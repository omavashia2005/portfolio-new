import type { ReactNode } from 'react';
import { CodeBlock } from '@/components/ui/code-block';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  description: string;
  content: ReactNode;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'sharded-maps-go-kv-store',
    title: 'How I doubled throughput on my key-value store in Go using sharded maps',
    date: '2026-10-07',
    displayDate: 'October 7, 2026',
    description: 'Using CPU profiling to find and fix lock contention in EmberDB, my Redis-compatible key-value store.',
    content: (
      <>
        <p>
          A few weeks ago, I wrote <a href="https://github.com/omavashia2005/emberdb">EmberDB</a>, a Redis-compatible key-value store in Go with a cluster mode. I spent the last week optimizing it. I wanted to push it past the first working version, and I also wanted an excuse to get deep into CPU profiling.
        </p>

        <p>
          The optimizations I made gave me <strong>up to a 2.5x throughput gain</strong> and <strong>about a 2.25x drop in latency for certain commands</strong>. Here&apos;s how I got there and what I learned along the way.
        </p>

        <p>
          If you&apos;d much rather watch a video, here&apos;s the{' '}
          <a href="https://youtu.be/4B92hMQ9jiU?si=lvzOjnRAI3Vg9G7_">link</a>. You can also watch part 1{' '}
          <a href="https://youtu.be/Xy0TJViRIUE?si=8U_RgouCQzeN-kHH">here</a>.
        </p>

        <h2>The benchmarking setup</h2>

        <p>
          Once the implementation was done, I wanted to ask whether I could improve it further. As I mentioned in my previous video, the first version was pretty hacky because I wanted it working before I worried about performance. So with Codex&apos;s help I set up a benchmarking suite and a profiling suite.
        </p>

        <img src="/blog/ember-setup.jpg" alt="Benchmarking setup" />

        <p>
          Everything runs on my Mac. A script spins up a Docker network with a temporary client container inside it. That client sends four commands (GET, SET, MGET, MSET) to two clusters: a 3-node Redis cluster and a 3-node Ember cluster. Each cluster gets 50,000 requests in total, and concurrency starts at 1 client and scales to 10, 50, then 100. I tried going past 100 concurrent clients, but my machine became the bottleneck and froze or crashed, so I capped it there for now. A full run takes about half an hour.
        </p>

        <p>It measures two things:</p>

        <ul>
          <li>throughput (operations per second)</li>
          <li>latency (time between sending a request and getting the right response back).</li>
        </ul>

        <p>
          I also built a test suite to check correctness. I ported Redis&apos;s tests for these four commands into Go and added a few of my own to catch concurrency bugs, since Redis executes commands on a single thread and Ember executes them on many.
        </p>

        <p>
          I originally ran 2,000 requests in total, and the results varied too much between runs for both Redis and Ember. Bumping it to 50,000 fixed that.
        </p>

        <p>
          There&apos;s one real limitation here. The client runs on the same machine as the containers, and Redis&apos;s own benchmarking docs say that&apos;s not ideal. I don&apos;t have a second laptop and didn&apos;t want to pay for a VPS before knowing the setup would work.
        </p>

        <p>
          This did add some variance, so I ran enough repetitions that the numbers I talk about here sit close to the mean. I also tried CPU pinning through Docker Compose, but with the way macOS and Docker handle CPUs (at least as I understand it), it made no real difference and gave me one more variable to worry about, so I dropped it.
        </p>

        <h2>The bottleneck</h2>

        <img src="/blog/ember-bottleneck.jpg" alt="MSET throughput and P99 latency charts for Redis and Ember" />

        <p>
          These charts are for MSET on new keys. Going from 50 to 100 clients, Redis&apos;s throughput keeps climbing while <strong>Ember&apos;s pretty much flatlines</strong>. Latency is worse. <strong>Ember&apos;s P99 latency climbs almost exponentially to about 7ms</strong>, while Redis tops out a little under 2.5ms.
        </p>

        <h2>The wrong turn: syscalls</h2>

        <p>
          I spent 2 to 3 days convinced this was a syscall problem. I&apos;d read a blog post saying unbuffered writes kill throughput and latency, and the profile showed a function that ended up in a write syscall, which meant a lot of time was going into small writes that weren&apos;t being batched.
        </p>

        <p>
          I forked the networking library internally so I could dig into it, and that&apos;s when it clicked that the library was fine. The cost came from my architecture. Redis runs commands on a single thread. Ember spins up a goroutine per client connection, which means I need to keep things consistent across goroutines. On top of that, I don&apos;t support pipelined requests yet, and the benchmark wasn&apos;t pipelined either, so every command was one request and one response, which pays the full write cost each time.
        </p>

        <p>
          Fixing that properly meant either rewriting Ember as a single-threaded event loop or building pipelining as a whole new feature. Both were bigger refactors than I wanted for this, so after a few days of staring at those graphs I started looking elsewhere.
        </p>

        <h2>The actual problem: lock contention</h2>

        <img src="/blog/ember-flamegraph-before.jpg" alt="CPU flame graph for MSET @ 50 concurrent clients and 100% cache misses" />

        <p>
          This is the same CPU profile as before, viewed as a flame graph. When I run MSET, the CPU spends a lot of its time waiting for a lock to be released.
        </p>

        <img src="/blog/ember-mset-before.jpg" alt="Original MSET flow: a global lock held over every slot map until MSET finishes" />

        <p>
          Looking at how I handled MSET made the reason obvious. MSET hashes every key and checks that they all land in the same slot, returning an error if they don&apos;t. Then it took a global lock and held it until every key was written. That locks the entire array of slot maps, so no other client can read or write anything until that one MSET finishes. That&apos;s exactly the shape in the flame graph, and it&apos;s why throughput and latency fell behind Redis.
        </p>

        <h2>The fix</h2>

        <p>
          After reading a few more blog posts, I realized the data structure was already right. I only needed a lock per shard in place of one global lock. It came out to about 10 to 15 lines of code that I had to propagate through the codebase.
        </p>

        <img src="/blog/ember-sharded-maps.jpg" alt="New MSET flow: each slot is its own map with its own lock" />

        <p>
          Each slot is now its own map with its own lock. Since Ember runs one goroutine per client connection, an MSET only locks the one shard its keys belong to, and every other client&apos;s goroutine can keep reading and writing the rest.
        </p>

        <img src="/blog/ember-flamegraph-after.jpg" alt="CPU flame graph for MSET after switching to per-shard locks" />

        <p>
          The lock-wait frames are basically gone. The big remaining chunks of CPU time are the flusher (the write syscall from earlier) and a channel, and both come from the goroutine-per-connection design, which I&apos;m not changing for now.
        </p>

        <h2>Results</h2>

        <img src="/blog/ember-results.jpg" alt="Benchmark results table comparing EmberDB and Redis throughput and P99 latency" />

        <p>
          SET throughput is up 140%, and MSET is up almost 19%. GET regressed a little, which I think is noise from the same-machine setup I mentioned earlier. Latency dropped a lot for SET and GET under concurrent load, with a 60.8% reduction at 100 clients, down to about 1.5ms.
        </p>

        <h2>What I learned</h2>

        <p>
          This project taught me why lock contention is such a big deal. Every cycle a goroutine spends waiting on a lock could go to actual work, and picking the right data structure (and the right lock granularity on top of it) is how you get those cycles back. I care about correctness and speed equally, and per-shard locks gave me both here because MSET still has to keep every key in one slot.
        </p>

        <p>It took me about a week to get here, and I had a lot of fun doing it.</p>

        <p>GitHub: <a href="https://github.com/omavashia2005/emberdb">github.com/omavashia2005/emberdb</a></p>
      </>
    ),
  },
  {
    slug: 'distributed-key-value-store-go',
    title: 'I built a distributed key‑value store in Go using the Redis source code to guide me',
    date: '2026-09-22',
    displayDate: 'September 22, 2026',
    description: 'I spent four weeks building a distributed key‑value store from scratch in Go, using Redis as a reference.',
    content: (
      <>
        <p>
          I spent the last four weeks building a distributed key-value store from scratch in Go, with the Redis source code open in another window as a reference. The project broke into four phases: starting a cluster, initializing it, propagating state between nodes, and resharding when nodes get added or removed. Each phase had a few subproblems of its own.
        </p>

        <p>
          If you&apos;d rather watch than read, here&apos;s the{' '}
          <a href="https://youtu.be/Xy0TJViRIUE?si=8U_RgouCQzeN-kHH">video version</a>.
        </p>

        <h2>Phase 1: Starting Server Processes</h2>

        <p>
          This was the easiest part of the project. All I needed was a CLI command that accepts <code>cluster start</code> and hands it to the main program, which then launches as many server processes as the CLI asked for.
        </p>

        <p>
          Redis requires at least three nodes and allows up to a thousand, and it configures each one through a config file. I eventually moved to Docker Compose to spin up the containers instead.
        </p>

        <CodeBlock filename="start-cluster.go" language="go" code={`func startCluster() error {
    exe, err := os.Executable()
    if err != nil {
        return fmt.Errorf("failed to find executable: %s\\n", err)
    }

    for _, port := range CLUSTER_PORTS {
        cmd := exec.Command(exe, "__node", port)

        cmd.Stdout = os.Stdout
        cmd.Stderr = os.Stderr

        if err := cmd.Start(); err != nil {
            return fmt.Errorf("failed to start node on %s: %v\\n", port, err)
        }

        CLUSTER_NODES = append(CLUSTER_NODES, cmd)
        fmt.Printf("started node on port %s [PID %d]\\n", port, cmd.Process.Pid)
    }

    return nil
}`} />

        <CodeBlock filename="compose.yaml" language="yaml" code={`services:
  node-1:
    build: .
    command: ["__node", "6379", "node-1"]
    ports: ["6379:6379"]

  node-2:
    build: .
    command: ["__node", "6379", "node-2"]
    ports: ["6380:6379"]

  node-3:
    build: .
    command: ["__node", "6379", "node-3"]
    ports: ["6381:6379"]

  node-4:
    build: .
    command: ["__node", "6379", "node-4"]
    ports: ["6382:6379"]

  node-5:
    build: .
    command: ["__node", "6379", "node-5"]
    ports: ["6383:6379"]`} />

        <p>
          At this point, each node knows about itself and nothing about the other nodes or their state, so you end up with a handful of unconfigured servers sitting idle. Fixing that is the job of the next command.
        </p>

        <h2>Phase 2: Configuring Clusters</h2>

        <p>
          After reading into how Redis handles <code>cluster create</code>, I found it solves two subproblems. It has to divide the data among the nodes, and it has to get the nodes talking to each other so they can keep their state up to date.
        </p>

        <h3>Splitting the data with hash slots</h3>

        <p>Redis splits its data into 16,384 hash slots and divides them almost evenly across every node in the cluster. Building this took three steps:</p>

        <ol>
          <li>Have the CLI accept <code>cluster create</code>.</li>
          <li>Check that every node listed in the command is valid, exists, and is alive, then connect to each one.</li>
          <li>Keep some state on the CLI side that assigns each node its share of the slots, then push that state out to every node.</li>
        </ol>

        <CodeBlock filename="assign-slots.go" language="go" code={`slotsPerNode := CLUSTER_CLI_SLOTS / float64(len(cliNodeArray))
var first int64
var cursor float64

for i := range len(cliNodeArray) {
    curNode := cliNodeArray[i]
    last := int64(math.Round(cursor + slotsPerNode - 1))

    if last > CLUSTER_CLI_SLOTS || i == len(cliNodeArray)-1 {
        last = CLUSTER_CLI_SLOTS - 1
    }
    if last < first {
        last = first
    }

    for j := first; j <= last; j++ {
        curNode.slots[j] = 1
        curNode.slotsCount++
    }

    curNode.dirty = 1
    first = last + 1
    cursor += slotsPerNode
}

first = 0
cursor = 0.0
for i := range len(cliNodeArray) {
    curNode := cliNodeArray[i]
    if curNode.dirty != 1 {
        continue
    }

    last := int64(math.Round(cursor + slotsPerNode - 1))
    if last > CLUSTER_CLI_SLOTS || i == len(cliNodeArray)-1 {
        last = CLUSTER_CLI_SLOTS - 1
    }
    if last < first {
        last = first
    }

    rconn := resp.NewServer(curNode.conn)
    reader := resp3.NewReader(curNode.conn)
    rconn.WriteArrayString([]string{
        "CLUSTER",
        "ADDSLOTSRANGE",
        strconv.Itoa(int(first)),
        strconv.Itoa(int(last)),
    })

    if err := utils.ExpectStringResponse(reader, "OK"); err != nil {
        fmt.Println(err)
    } else {
        curNode.dirty = 0
        fmt.Printf("Node %s configured successfully\\n", curNode.ctx.TCP.sourceAddr)
    }

    first = last + 1
    cursor += slotsPerNode
}`} />

        <h3>Making the nodes meet</h3>

        <p>
          With slots configured everywhere, the nodes still had to find each other. I pick a bootstrap node (usually the first argument passed to <code>cluster create</code>) and have every other node open a TCP connection to it.
        </p>

        <CodeBlock filename="cluster-meet.go" language="go" code={`bootstrapConn := cliNodeArray[0].conn
for i := 1; i < len(cliNodeArray); i++ {
    target := cliNodeArray[i]

    err := clusters.ClusterMeet(
        bootstrapConn,
        target.clusterPort,
        target.clusterHost,
    )
    if err != nil {
        panic(fmt.Errorf("[ERROR] %e", err))
    }
}`} />

        <video autoPlay loop muted playsInline preload="auto" aria-label="Cluster nodes connecting">
          <source src="/blog/cluster-meet.mp4" type="video/mp4" />
        </video>

        <p>This runs right after we divide the slots for all nodes on the CLI side.</p>

        <p>
          If you look closely at the animation, you&apos;ll notice the bootstrap node now knows about every node and every node knows about the bootstrap node, but the rest of the nodes still don&apos;t know about each other.
        </p>

        <p>
          There&apos;s also a deeper problem. Each node&apos;s state keeps changing over time, and with no way to propagate those changes across the cluster (yet), it would be hard to call the data distributed or sharded at all.
        </p>

        <h2>Phase 3: State Propagation</h2>

        <p>This is implemented using a cron job that runs roughly 10 times every second.</p>

        <CodeBlock filename="cluster-cron.go" language="go" code={`go func() {
    ticker := time.NewTicker(100 * time.Millisecond)
    defer ticker.Stop()

    iterations := 0

    for range ticker.C {
        clusters.ClusterCron(iterations)
        iterations++
    }
}()`} />

        <p>There are two data structures worth walking through for this phase.</p>

        <h3>ClusterState</h3>

        <p>ClusterState is what actually gets propagated between server processes. Every server keeps its own copy, maintains it, and sends it to the others. Among other fields, it holds:</p>

        <ul>
          <li>a pointer to the ClusterNode this server process represents</li>
          <li>a map from node ID to node, for fast lookups by name</li>
          <li>a global array of slot ownership that says which node owns which slot, which is the most important field in the struct</li>
        </ul>

        <CodeBlock filename="cluster-state.go" language="go" code={`type ClusterState struct {
    Self      *ClusterNode
    Nodes     map[string]*ClusterNode
    Host      string
    Slots     [CLUSTER_SLOTS]*ClusterNode
    State     int
    Importing map[int]*ClusterNode
    Migrating map[int]*ClusterNode
    Mu        sync.RWMutex
}`} />

        <h3>ClusterLink</h3>

        <p>
          ClusterLink does most of the work in this phase. A link lives as long as its cluster node lives, so I don&apos;t have to keep dialing a new TCP connection per node, and connection handling stays in its own structure away from the node state.
        </p>

        <p>
          The structure itself is pretty simple. It wraps a Go channel. When a node wants to send something, it writes to the channel, and a writer goroutine dedicated to that link copies whatever arrives into the TCP buffer of the destination node. On the receiving end, a reader goroutine pulls it out of the TCP buffer and updates that server node&apos;s ClusterState accordingly, and sends a message back to the source node with an OK. That&apos;s the whole propagation mechanism.
        </p>

        <CodeBlock filename="cluster-link.go" language="go" code={`type clusterLink struct {
    connection net.Conn
    node       *ClusterNode
    inbound    bool
    ctime      time.Time
    send       chan []byte
}`} />

        <video autoPlay loop muted playsInline preload="auto" aria-label="State propagating through cluster nodes">
          <source src="/blog/state-propagation.mp4" type="video/mp4" />
        </video>

        <h2>Phase 4: Rebalancing and Resharding</h2>

        <p>Once state propagation worked, I could start rebalancing the cluster whenever a node joins or leaves, which really means moving slots and the keys inside them. It happens in three steps:</p>

        <ol>
          <li>Recalculate how many slots each node should have.</li>
          <li>Sort the nodes by how many slots they need to give away or take on.</li>
          <li>Move the keys in the affected slots from each source node to its destination.</li>
        </ol>

        <h3>Migrating keys</h3>

        <p>Fetching and moving keys was my favorite part of the whole project. The code breaks into four chunks: fetch a batch of keys, decode them, migrate them to the target node, and delete the migrated keys from the source.</p>

        <p>The migration step is the interesting one. On the source node, slots own keys, and you&apos;re lifting a batch of keys out of that slot-to-key structure and dropping them into the same structure on the target node.</p>

        <p>That covers one iteration. Both Redis and my version keep querying the requested slots for keys until every one of them is empty, and at that point the resharding is done (for that node).</p>

        <h2>Wrapping up</h2>

        <p>I ended up solving every problem I set out to solve. Along the way I got real practice with concurrency in Go and learned a lot about Redis internals and how distributed data systems are built, though I&apos;m only scratching the surface of all three.</p>

        <p>I&apos;m planning more projects like this over the next year, and I&apos;ll post each one here and on YouTube. If you&apos;ve made it this far, thanks for reading, and consider leaving a star :)</p>

        <p>GitHub: <a href="https://github.com/omavashia2005/emberdb">github.com/omavashia2005/emberdb</a></p>
      </>
    ),
  },
  {
    slug: 'unfinished-projects',
    title: 'the case for unfinished projects',
    date: '2026-06-14',
    displayDate: 'June 14, 2026',
    description: 'TLDR: Building incomplete projects taught me everything I know about programming',
    content: (
      <>

<p>
	I, like many programmers, have this habit of starting projects with a lot of excitement, working nonstop for a few days or a week on it, and then getting sick of it and never touching it again. </p> 

	<p>
	Take the expense tracker I built in Java with Spring Boot. I wrote a handful of endpoints, did the whole Interface/Service/Controller dance for each one, and never bothered adding the features that would've made it actually fun or interesting. But by the time I bailed, I'd learned how HTTP methods work, how to write API endpoints and middleware, how cookies behave, and how to wire code up to a database. </p> 

	<p> And that's exactly what let me build and ship <a href="http://canvasbot.pages.dev">canvasbot</a> and <a href="https://asudines.com">asudines</a> later: one needed real endpoints I now knew how to write, both needed databases I had to connect to (Supabase and D1) and debug when things inevitably broke (a larger nightmare, perhaps deserves another post). Work that would've stumped me felt trivial, because I'd already done the hard part on a project nobody will ever see.
	</p>

	<p>
	Or take <a href="https://github.com/omavashia2005/ChromaLite/tree/main">ChromaLite</a>, a musical scale classifier I built later that year. That one I actually finished, though I can see a dozen things I'd build differently now, and some I might still go back and fix. But writing it got me comfortable reading and writing PyTorch, and gave me the intuition behind neural nets, CNNs, loss functions, and backprop. Now, I'm in a research environment, a completely different domain solving a much harder problem with almost no connection to ChromaLite, and while it is (more) daunting, the feeling is familiar enough for me to not be as daunted as I would've otherwise been. 
	</p>
	<p>
	Most recently, I started porting canvasbot's FastAPI server to Go, just to stretch a language I'd recently picked up. I never finished, but the Go I learned banging out those endpoints by hand is exactly what I'm leaning on for my current project.
	</p>
<p>
	I've found this pattern across most of my programming experience since I started in middle school: start something, build enough of it to lose interest, abandon it. Features stay unfinished, plans never get implemented, sometimes the core thing never even gets built. But completion (for some projects) is never the point. The point is to have a good time building something fun and pick things up along the way, things that help me ship better software down the line and ideally make me a better programmer in the process.
	</p>
      </>
    ),
  },
  {
    slug: 'hello-world',
    title: 'hello!',
    date: '2026-05-01',
    displayDate: 'May 1, 2026',
    description: 'TLDR: A tiny first note to make this blog real.',
    content: (
      <>
        <p>
          I will probably use this space for build notes, research updates,
          open source work, and everything in betweem. Basically just yapping about stuff, giving my two cents on stuff I care or think about. 
        </p>
      </>
    ),
  },
];

export function getBlogPosts() {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
