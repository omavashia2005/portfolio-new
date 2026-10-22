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
    <main className="min-h-screen bg-(--c-bg) px-6 pt-14 pb-32 md:px-12 md:py-20">
      <div className="mx-auto w-full max-w-[720px]">
        {/* phones: fixed bottom bar like the home tabs; desktop: inline breadcrumb */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-(--c-fg)/[0.08] bg-(--c-bg) px-6 pr-14 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:static md:z-auto md:border-0 md:bg-transparent md:p-0 flex items-center gap-2 font-body text-[0.75rem] tracking-[0.02em] text-(--c-666)">
          {/* home restores the tab they came from (sessionStorage in TabSection) */}
          <Link href="/" className="transition-colors duration-200 hover:text-(--c-fg)">
            back
          </Link>
          <span aria-hidden="true" className="text-(--c-444)">/</span>
          <span aria-current="page" className="text-(--c-aaa)">writing</span>
        </nav>

        <header className="anim anim-2 md:mt-12 border-b border-(--c-fg)/[0.07] pb-8">
          <h1 className="font-display text-[3rem] font-light leading-none text-(--c-fg) md:text-[4rem]">
            Writing
          </h1>
          <p className="mt-4 max-w-prose font-body text-[0.85rem] leading-[1.8] tracking-[0.01em] text-(--c-888) md:text-[0.94rem]">
	  yapping
          </p>
        </header>

        <section className="anim anim-3 mt-10" aria-label="Blog posts">
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-6">
                    <h2 className="font-display text-[1.7rem] font-light leading-tight text-(--c-fg) transition-colors duration-200 group-hover:text-(--c-strong) md:text-[2rem]">
                      {post.title}
                    </h2>
                    <span className="font-body text-[0.55rem] uppercase tracking-[0.14em] text-(--c-666) md:shrink-0">
                      {post.displayDate}
                    </span>
                  </div>
                  <p className="mt-2 max-w-prose font-body text-[0.81rem] leading-[1.75] tracking-[0.01em] text-(--c-888) md:text-[0.87rem]">
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
