import { Suspense } from 'react';
import GitHubContributions from './GitHubContributions';
import TabSection from './TabSection';
import { getBlogPosts } from './blog/posts';

// rendered per request (reads ?tab=), and Cloudflare Pages runs those on the edge
export const runtime = 'edge';

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 pt-8 pb-16 md:px-12 md:pt-14 md:pb-24 lg:px-20">
      <TabSection
        initialTab={tab}
        posts={getBlogPosts().map(({ slug, title, displayDate, description }) => ({ slug, title, displayDate, description }))}
        // streamed: the GitHub API is slow and used to hold the whole page (and back-navigation) hostage
        githubContributions={<Suspense fallback={null}><GitHubContributions /></Suspense>}
      />
    </main>
  );
}
