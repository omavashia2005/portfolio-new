'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Fragment, useState, type ReactNode } from 'react';
import { Icon, type IconName } from './icons';
import SiteHeader from './SiteHeader';
import { isTab, type Tab } from './tabs';

// ── Data ─────────────────────────────────────────────────────────────────────

const aboutLink = 'underline underline-offset-4 decoration-(--c-fg)/15 hover:text-(--c-fg) hover:decoration-(--c-fg)/60 transition-colors duration-200';
const nameLink = `${aboutLink} font-bold`;

// home tab tables: name | description, with the metric / status underneath
type Row = { name: string; href: string; icon?: IconName; description: ReactNode; note?: ReactNode };

const builtProjects: Row[] = [
	{ name: 'emberdb', href: 'https://github.com/omavashia2005/emberdb', description: 'Concurrent Redis Clusters in Go',
		note: (
			<>
				320K SET ops/s, 3ms p99 latency at 100 concurrent clients.{' '}
				<Link href="/blog/sharded-maps-go-kv-store" className={aboutLink}>Writeup</Link>,{' '}
				<a href="https://youtu.be/4B92hMQ9jiU" target="_blank" rel="noopener noreferrer" className={aboutLink}>video</a>
			</>
		),
	},
	{ name: '.sct', href: 'https://dotsct.pages.dev', description: 'macOS Keychain-backed vault for your environment variables', note: 'Encrypted sharing with teammates over AirDrop or relay' },
	{ name: 'ai-tool-elements', href: 'https://ai-tool-elements.vercel.app', description: 'React components for the tools your AI calls', note: '700+ downloads' },
	{ name: 'agentgit', href: 'https://github.com/omavashia2005/agentgit', description: '3D visualization of your Claude Code sessions', note: '600+ downloads' },
	{ name: 'hydra', href: 'https://github.com/gholtzap/hydra', description: 'Open source ADE that runs 10+ coding agents in parallel in your terminal', note: 'voice mode, hassle-free worktrees, and continuous sessions between agents' },
	{
		name: 'veto',
		href: 'https://github.com/omavashia2005/veto',
		description: '3D git history visualization in Rust',
		note: <a href="https://x.com/orhundev/status/2114380107964182976" target="_blank" rel="noopener noreferrer" className={aboutLink}>people liked it</a>,
	},
	{ name: 'ShadeASU', href: 'https://shadeasu.pages.dev/', description: 'Helping ASU students walk through maximum shade in the summer', note: "600+ acres of campus mapped using building heights and the sun's position" },
];

const ossContribs: Row[] = [
	{ name: 'rust-clippy', icon: 'rust', href: 'https://github.com/rust-lang/rust-clippy/pull/17902', description: 'Added call_missing_target_feature restriction and MIR lints', note: 'The official Rust linter. Queued for merging' },
	{ name: 'Apache Texera', icon: 'apache', href: 'https://github.com/apache/texera/pull/9020', description: 'Dropped unused generated protobuf TypeScript from the frontend', note: 'Human-AI collaborative data science with visual workflows. Merged' },
	{ name: 'nvim-gpui', icon: 'neovim', href: 'https://github.com/imkerberos/nvim-gpui/pull/3', description: 'Made the themed titlebar optional', note: 'GPU-rendered Neovim frontend. Merged' },
	{ name: '3DRealCar', icon: 'repo', href: 'https://github.com/xiaobiaodu/3DRealCar_Toolkit/pull/39', description: 'Fixed an infinite loop in the data processing pipeline', note: 'ICCV 2025 in-the-wild RGB-D car dataset. Merged' },
	{ name: 'Dify', icon: 'dify', href: 'https://github.com/langgenius/dify/pull/22476', description: 'Fixed Python SDK WorkflowClient and KnowledgeBase client imports', note: 'Platform for agentic workflows and RAG pipelines. Merged' },
];

// one shared grid per table; fixed name column so projects and OSS descriptions line up with each other
const Rows = ({ rows }: { rows: Row[] }) => (
	<ul className="grid sm:grid-cols-[11rem_1fr] sm:gap-x-8">
		{rows.map(({ name, href, icon, description, note }) => (
			<li key={name} className="grid gap-y-1 py-2 leading-snug sm:col-span-2 sm:grid-cols-subgrid">
				<span className="self-start whitespace-nowrap">
					<a href={href} target="_blank" rel="noopener noreferrer" className={nameLink}>{name}</a>
					{icon && <Icon name={icon} size={14} className="ml-[0.4em] inline-block align-[-0.12em]" />}
				</span>
				<div>
					<p>{description}</p>
					{note && <p className="mt-0.5 text-(--c-aaa)">{note}</p>}
				</div>
			</li>
		))}
	</ul>
);

// inline link + logo; the last word and the logo never wrap apart
const Org = ({ href, icon, bold, children }: { href: string; icon: IconName; bold?: boolean; children: string }) => {
	const i = children.lastIndexOf(' ') + 1;
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className={bold ? nameLink : aboutLink}>
			{children.slice(0, i)}<span className="whitespace-nowrap">{children.slice(i)}<Icon name={icon} size={14} className="ml-[0.4em] inline-block align-[-0.12em]" /></span>
		</a>
	);
};

// after Org: the cells link the companies, tools and customers inline
const internships: Row[] = [
	{ name: 'Wells Fargo', icon: 'wellsfargo', href: 'https://www.wellsfargo.com', description: 'Built the loan price verification engine for the Auto lending team' },
	{
		name: 'IPAuthor',
		icon: 'ipauthor',
		href: 'https://ipauthor.com',
		description: (
			<>
				Built the AI patent drafting editor {/* customers stay on one line, so the break lands after "editor" instead of orphaning Chevron */}
				<span className="sm:whitespace-nowrap">used by <Org href="https://www.resmed.com" icon="resmed">ResMed</Org>, <Org href="https://www.qualcomm.com" icon="qualcomm">Qualcomm</Org> &amp; <Org href="https://www.chevron.com" icon="chevron">Chevron</Org></span>
			</>
		),
		note: (
			<>
				$3.12M seed with participation from <Org href="https://illuminate.com" icon="illuminate">Illuminate</Org>, <Org href="https://okapivc.com" icon="okapi">Okapi</Org> &amp; <Org href="https://elabvc.com" icon="elab">eLab</Org>
			</>
		),
	},
];

const contacts: { label: string; icon: IconName; href: string }[] = [
	{ label: 'X', icon: 'x', href: 'https://x.com/avashiaom' },
	{ label: 'GitHub', icon: 'github', href: 'https://github.com/omavashia2005' },
	{ label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/omavashia/' },
	{ label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@omavashia' },
	{ label: 'Email', icon: 'mail', href: 'mailto:omavashia1233@gmail.com' },
];

const readingList = [
	{
		title: 'Yes, and...',
		icon: 'htmx' as IconName,
		author: 'Carson Gross',
		href: 'https://htmx.org/essays/yes-and/',
		note: 'Helped me rethink things as a soon-to-be newgrad',
		category: 'design & taste',
	},
	{
		title: '39.78%',
		icon: 'substack' as IconName,
		author: 'chris',
		href: 'https://cwispy.substack.com/p/3978',
		note: 'Running 10 Claudes in parallel gives me the same ADHD',
		category: 'design & taste',
	},
	{
		title: 'How we built Pingora, the proxy that connects Cloudflare to the Internet',
		icon: 'cloudflare' as IconName,
		author: 'Yuchen Wu & Andrew Hauck',
		href: 'https://blog.cloudflare.com/how-we-built-pingora-the-proxy-that-connects-cloudflare-to-the-internet/',
		note: 'Encouraged me to pick up Rust and open a couple PRs to Pingora',
		category: 'tech',
	},
	{
		title: "How we saved 100 terabytes of memory by optimizing 1.1.1.1's DNS cache",
		icon: 'cloudflare' as IconName,
		author: 'Sebastiaan Neuteboom',
		href: 'https://blog.cloudflare.com/dns-cache-memory-optimization-1111/',
		note: (
			<>
				Read this after watching{' '}
				<a
					href="https://youtu.be/dCwWXEI1-lA"
					target="_blank"
					rel="noopener noreferrer"
					className="underline underline-offset-2 decoration-(--c-fg)/15 hover:text-(--c-fg)/70"
				>
					ThePrimeagen cover it
				</a>
			</>
		),
		category: 'tech',
	},
	{
		title: 'You Have to Feel It',
		icon: 'ghostty' as IconName,
		author: 'Mitchell Hashimoto',
		href: 'https://mitchellh.com/writing/feel-it',
		note: 'Guiding light',
		category: 'design & taste',
	},
	{
		title: 'Rewriting Bun in Rust',
		icon: 'bun' as IconName,
		author: 'Jarred Sumner',
		href: 'https://bun.com/blog/bun-in-rust',
		note: 'Tokenmaxxing → engineering with agents',
		category: 'tech',
	},
	{
		title: 'We Found a Ticking Time Bomb in macOS TCP Networking',
		icon: 'photon' as IconName,
		author: 'Photon',
		href: 'https://photon.codes/blog/we-found-a-ticking-time-bomb-in-macos-tcp-networking',
		note: 'An all-time favorite for how good technical writing makes complex stuff easy to digest',
		category: 'tech',
	},
	{
		title: 'Why is quality so rare',
		icon: 'linear' as IconName,
		author: 'Karri Saarinen, Co-Founder of Linear',
		href: 'https://linear.app/now/why-is-quality-so-rare',
		note: 'A good framework for trying to stand out in the era of agents',
		category: 'design & taste',
	},
	{
		title: 'Output isn\'t design',
		icon: 'linear' as IconName,
		author: 'Karri Saarinen, Co-Founder of Linear',
		href: 'https://linear.app/now/output-isn-t-design',
		note: 'The hard part of design is rarely generating the form. It is understanding the problem well enough to know what and how something should exist at all',
		category: 'design & taste',
	},
	{
		title: 'White Nights',
		author: 'Fyodor Dostoyevsky',
		href: 'https://www.gutenberg.org/ebooks/36034',
		category: 'literature',
		note: 'A quick but engaging read after finishing Crime and Punishment',
	},
	{
		title: 'And the Mountains Echoed',
		author: 'Khaled Hosseini',
		href: 'https://www.goodreads.com/en/book/show/16115612-and-the-mountains-echoed',
		note: 'All-time favorite & got my younger sister to admit she misses me',
		category: 'literature',
	},
	{
		title: 'Not a Penny More, Not a Penny Less',
		author: 'Jeffrey Archer',
		href: 'https://www.goodreads.com/book/show/78982.Not_a_Penny_More_Not_a_Penny_Less',
		note: 'Literally could not put it down',
		category: 'literature',
	},
	{
		title: 'Memory Man',
		author: 'David Baldacci',
		href: 'https://www.goodreads.com/book/show/23153154-memory-man',
		note: 'Finished this in a day',
		category: 'literature',
	},
	{
		title: 'Percy Jackson + Heroes of Olympus + Kane Chronicles',
		series: [
			{ label: 'Percy Jackson', href: 'https://en.wikipedia.org/wiki/Percy_Jackson_%26_the_Olympians' },
			{ label: 'Heroes of Olympus', href: 'https://en.wikipedia.org/wiki/The_Heroes_of_Olympus' },
			{ label: 'Kane Chronicles', href: 'https://en.wikipedia.org/wiki/The_Kane_Chronicles' },
		],
		author: 'Rick Riordan',
		note: 'Mythologymaxxing',
		category: 'literature',
	},
	{
		title: 'Hamlet',
		author: 'William Shakespeare',
		href: 'https://www.gutenberg.org/ebooks/1524',
		note: (
			<>
				Read after watching the movie{' '}
				<a
					href="https://en.wikipedia.org/wiki/Haider_(film)"
					target="_blank"
					rel="noopener noreferrer"
					className="underline underline-offset-2 decoration-(--c-fg)/15 hover:text-(--c-fg)/70"
				>
					Haider
				</a>
			</>
		),
		category: 'literature',
	},
];

const readingCategories = ['tech', 'design & taste', 'literature'];
const categoryIcon: Record<string, { name: IconName; color: string }> = {
	tech: { name: 'code', color: 'var(--c-green)' },
	'design & taste': { name: 'paintbrush', color: 'var(--c-violet)' },
	literature: { name: 'book', color: 'var(--c-amber)' },
};

const videos = [
	{
		id: '4B92hMQ9jiU',
		thumb: 'maxresdefault',
		href: 'https://youtu.be/4B92hMQ9jiU?si=lvzOjnRAI3Vg9G7_',
		title: 'Using CPU profiling to make my Go Redis clone blazingly fast',
	},
	{
		id: 'Xy0TJViRIUE',
		thumb: 'sddefault',
		href: 'https://youtu.be/Xy0TJViRIUE?si=8U_RgouCQzeN-kHH',
		title: 'I built a distributed KV store from scratch in Go',
	},
];


// ── Component ─────────────────────────────────────────────────────────────────

// just what the list needs; post bodies stay on the server
export type PostSummary = { slug: string; title: string; displayDate: string; description: string };

type TabSectionProps = {
	initialTab?: string;
	posts?: PostSummary[];
	githubContributions?: ReactNode;
};

export default function TabSection({ initialTab, posts = [], githubContributions }: TabSectionProps) {
	// the tab lives in the URL (?tab=), so the server renders the right one: refresh, back and shared links never flash home
	// read the live URL too: on browser-back Next reuses its cached render of "/" from before the tab
	// was picked, so initialTab can be stale while the URL (kept in sync by replaceState) is right
	const urlTab = useSearchParams().get('tab');
	const [active, setActive] = useState<Tab>(isTab(urlTab) ? urlTab : isTab(initialTab) ? initialTab : 'about');

	const selectTab = (tab: Tab) => {
		setActive(tab);
		window.history.replaceState(null, '', tab === 'about' ? '/' : `/?tab=${tab}`);
	};

	return (
		<div className="w-full max-w-[420px] md:max-w-[900px] lg:max-w-[980px]">

			<SiteHeader active={active} onSelect={selectTab} />

			{/* home only: short intro under the header, contact info beside it (below it on phones) */}
			{active === 'about' && (
				<div className="-mt-6 mb-10 md:mt-0 flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
					<p className="font-display text-[1.15rem] md:text-[1.5rem] font-light leading-snug text-(--c-fg)">
						<span className="text-(--c-666)">I&apos;m Om, a</span> software engineer<span className="text-(--c-666)">,</span><br />
						researcher<span className="text-(--c-666)">, and</span>{' '}
						<span className="whitespace-nowrap">CS senior at ASU<span className="text-(--c-666)">.</span></span>
					</p>
					{/* one row of icons, so it never makes the intro row taller than the intro itself */}
					<nav aria-label="Contact" className="flex shrink-0 items-center gap-x-5 md:pt-1.5">
						{contacts.map(({ label, icon, href }) => (
							<a
								key={label}
								href={href}
								aria-label={label}
								target={href.startsWith('mailto:') ? undefined : '_blank'}
								rel="noopener noreferrer"
								className="text-(--c-666) hover:text-(--c-fg) transition-colors duration-200"
							>
								<Icon name={icon} size={18} color="currentColor" />
							</a>
						))}
					</nav>
				</div>
			)}

			<div className="anim anim-4">
				{/* one text size/color for every section; hierarchy is bold → normal → one shade dimmer */}
				<div className="min-w-0 grid font-body text-[0.85rem] md:text-[0.94rem] text-(--c-fg) tracking-[0.01em]">
					{/* ── About ────────────────────────────────────────────────────── */}
					<section
						id="panel-about"
						aria-hidden={active !== 'about'}
						data-active={active === 'about'}
						className="tab-panel flex flex-col leading-[1.85]"
					>
						<div className="flex w-full flex-col gap-5">
							<div>
								<h2 className="mb-2 text-[1.15rem] md:text-[1.3rem] text-(--c-fg)">Projects</h2>
								<Rows rows={builtProjects} />
								<a href="https://github.com/omavashia2005" target="_blank" rel="noopener noreferrer" className={`${aboutLink} mt-2 inline-block text-(--c-aaa)`}>all my projects</a>
							</div>
							<div>
								<h2 className="mb-2 text-[1.15rem] md:text-[1.3rem] text-(--c-fg)">Open source</h2>
								<Rows rows={ossContribs} />
							</div>
							<div>
								<h2 className="mb-2 text-[1.15rem] md:text-[1.3rem] text-(--c-fg)">Research</h2>
								<p>Reconstruction &amp; NVS to train self driving cars w/ <Org href="https://faculty.engineering.asu.edu/yezhouyang/" icon="asu" bold>ASU Active Perception Group</Org> &amp; <Org href="https://amrd.toyota.com/division/trina/" icon="trina" bold>Toyota Research Institute of North America</Org></p>
							</div>
							<div>
								<h2 className="mb-2 text-[1.15rem] md:text-[1.3rem] text-(--c-fg)">Internships</h2>
								<Rows rows={internships} />
							</div>
						</div>
						{active === 'about' && githubContributions}
					</section>

					{/* ── Reading List ─────────────────────────────────────────────── */}
					<section
						id="panel-reading"
						aria-hidden={active !== 'reading'}
						data-active={active === 'reading'}
						className="tab-panel"
					>
						<div className="flex flex-col gap-10">
							{readingCategories
								.filter((category) => readingList.some((r) => r.category === category))
								.map((category) => (
									<div key={category}>
										{/* same as the home headings ("Stuff I've built:") */}
										<h3 className="mb-4 flex items-center gap-2">
											<Icon name={categoryIcon[category].name} color={categoryIcon[category].color} size={14} />
											{category[0].toUpperCase() + category.slice(1)}:
										</h3>
										<ul className="flex flex-col gap-6">
											{readingList.filter((r) => r.category === category).map(({ title, author, note, href, series, ...rest }) => (
												<li key={title} className="flex items-start gap-3">
													<Icon name={('icon' in rest && rest.icon) || 'book'} size={14} className="mt-[0.2em] shrink-0" />
													<div className="min-w-0">
														<p className="font-bold">
															{series
																? series.map((s, i) => (
																	<Fragment key={s.href}>
																		{i > 0 && ' + '}
																		<a href={s.href} target="_blank" rel="noopener noreferrer" className={aboutLink}>{s.label}</a>
																	</Fragment>
																))
																: <a href={href} target="_blank" rel="noopener noreferrer" className={aboutLink}>{title}</a>}
														</p>
														<p className="mt-1">{author}</p>
														<p className="mt-0.5 text-(--c-aaa)">{note}</p>
													</div>
												</li>
											))}
										</ul>
									</div>
								))}
						</div>
					</section>

					{/* ── Writing ──────────────────────────────────────────────────── */}
					<section
						id="panel-writing"
						aria-hidden={active !== 'writing'}
						data-active={active === 'writing'}
						className="tab-panel leading-snug"
					>
						{/* title | date on one line, description under it; same size throughout, hierarchy by weight and shade */}
						<ul className="flex flex-col gap-6">
							{posts.map((post) => (
								<li key={post.slug}>
									<Link href={`/blog/${post.slug}`} className="group block">
										<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
											<span className="font-bold underline underline-offset-4 decoration-(--c-fg)/15 group-hover:decoration-(--c-fg)/60 transition-colors duration-200">
												{post.title}
											</span>
											<span className="shrink-0 text-(--c-aaa)">{post.displayDate}</span>
										</div>
										<p className="mt-1.5 text-(--c-aaa)">{post.description}</p>
									</Link>
								</li>
							))}
						</ul>
					</section>

					{/* ── Videos ─────────────────────────────── */}
					<section
						id="panel-videos"
						aria-hidden={active !== 'videos'}
						data-active={active === 'videos'}
						className="tab-panel"
					>
						<div className="space-y-10">
							{videos.map((v) => (
								<a
									key={v.id}
									href={v.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group block"
								>
									<div className="relative aspect-video overflow-hidden border border-(--c-fg)/[0.08] bg-(--c-bg-2)">
										<img
											src={`https://i.ytimg.com/vi/${v.id}/${v.thumb}.jpg`}
											alt={`Thumbnail for ${v.title}`}
											className="h-full w-full object-cover opacity-80 transition duration-200 group-hover:scale-[1.02] group-hover:opacity-100"
										/>
										<span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
											<span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--c-bg)/80 pl-1 text-lg text-(--c-fg) backdrop-blur-sm">
												▶
											</span>
										</span>
									</div>
									<p className="mt-3 font-bold leading-snug underline underline-offset-4 decoration-(--c-fg)/15 group-hover:decoration-(--c-fg)/60 transition-colors duration-200">
										{v.title}
									</p>
									<span className="mt-1 flex items-center gap-1.5 text-(--c-aaa)">
										<Icon name="youtube" size={14} />
										YouTube
									</span>
								</a>
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
