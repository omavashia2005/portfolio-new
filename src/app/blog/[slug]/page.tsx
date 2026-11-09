import type { Metadata } from 'next';
import SiteHeader from '../../SiteHeader';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../posts';
import Contents from './Contents';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post not found | Om Avashia',
    };
  }

  return {
    title: `${post.title} | Om Avashia`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 pt-8 pb-14 md:px-12 md:pt-14 md:pb-20">
      <article className="mx-auto w-full max-w-[720px]">
        <SiteHeader active="writing" />

        {/* relative wrapper so the contents sidebar starts level with the date */}
        <div className="relative">
        <Contents />
        <header className="border-b border-(--c-fg)/[0.07] pb-8">
          <div className="font-body text-[0.55rem] uppercase tracking-[0.14em] text-(--c-666)">
            <time dateTime={post.date}>{post.displayDate}</time>
          </div>
          <h1 className="mt-5 text-balance font-display text-[3rem] font-light leading-[0.95] text-(--c-fg) md:text-[4.25rem]">
            {post.title}
          </h1>
          <p className="mt-5 max-w-prose text-pretty font-body text-[0.87rem] leading-[1.8] tracking-[0.01em] text-(--c-888) md:text-[0.99rem]">
            {post.description}
          </p>
        </header>

        <div className="blog-body mt-10">{post.content}</div>
        </div>
      </article>
    </main>
  );
}
