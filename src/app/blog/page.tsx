import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from './posts';

export const metadata: Metadata = {
  title: 'Writing | Om Avashia',
  description: 'Notes, build logs, and writing from Om Avashia.',
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-[720px]">
        <Link
          href="/"
          className="anim anim-1 font-mono text-[0.67rem] uppercase tracking-[0.2em] text-[#666] transition-colors duration-200 hover:text-[#f0efe9]/70"
        >
          back
        </Link>

        <header className="anim anim-2 mt-12 border-b border-[#f0efe9]/[0.07] pb-8">
          <h1 className="font-cormorant text-[3rem] font-light leading-none text-[#f0efe9] md:text-[4rem]">
            Writing
          </h1>
          <p className="mt-4 max-w-prose font-mono text-[0.85rem] leading-[1.8] tracking-[0.03em] text-[#888] md:text-[0.94rem]">
	  yapping
          </p>
        </header>

        <section className="anim anim-3 mt-10" aria-label="Blog posts">
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-6">
                    <h2 className="font-cormorant text-[1.7rem] font-light leading-tight text-[#f0efe9] transition-colors duration-200 group-hover:text-white md:text-[2rem]">
                      {post.title}
                    </h2>
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#666] md:shrink-0">
                      {post.displayDate}
                    </span>
                  </div>
                  <p className="mt-2 max-w-prose font-mono text-[0.81rem] leading-[1.75] tracking-[0.03em] text-[#888] md:text-[0.87rem]">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
