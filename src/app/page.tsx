import Image from 'next/image';
import GitHubContributions from './GitHubContributions';
import TabSection from './TabSection';

export const revalidate = 3600;

// ── SVG icons ────────────────────────────────────────────────────────────────

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ── Socials data ──────────────────────────────────────────────────────────────

const socials = [
  { label: 'X',        href: 'https://x.com/avashiaom', Icon: IconX },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omavashia/', Icon: IconLinkedIn },
  { label: 'GitHub',   href: 'https://github.com/omavashia2005', Icon: IconGitHub },
] as const;

function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <nav className={`flex items-center gap-[22px] ${className}`} aria-label="Social links">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--c-666) hover:text-(--c-fg) transition-colors duration-200"
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-(--c-bg) flex flex-col items-center justify-center px-6 py-16 md:px-12 md:py-24 lg:px-20">
      <TabSection
        githubContributions={<GitHubContributions />}
        mobileSocials={<SocialLinks />}
        identity={
            <div className="md:w-[250px] lg:w-[280px] md:shrink-0 flex flex-col">

              {/* Hero */}
              <div className="anim anim-1 flex items-center gap-5 md:flex-col md:items-start md:gap-5 mb-8 md:mb-0">
                <div
                  className="shrink-0 rounded-full overflow-hidden"
                  style={{ width: 78, height: 78, outline: '1px solid color-mix(in srgb, var(--c-fg) 8%, transparent)', outlineOffset: '2px' }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Om Avashia"
                    width={78}
                    height={78}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="font-display text-[2.45rem] md:text-[2.8rem] lg:text-[3rem] font-light leading-none tracking-[-0.01em] text-(--c-fg)">
                  Om Avashia
                </h1>
              </div>

              {/* Socials + Languages — tucked below name on desktop */}
              <div className="hidden flex-col gap-4 md:mt-9 md:flex">
                <SocialLinks className="anim anim-2" />
              </div>

            </div>
        }
      />
    </main>
  );
}
