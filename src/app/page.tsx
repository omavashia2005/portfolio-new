import Image from 'next/image';
import TabSection from './TabSection';

// ── SVG icons ────────────────────────────────────────────────────────────────

function IconX() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function IconDevTo() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.74v-5.55H6.1c1.44 0 2.04.19 2.44.66.35.42.44.82.44 2.12 0 1.23-.1 1.58-.42 2zm4.43-.05c-.31.47-.74.7-1.3.7-.75 0-1.19-.4-1.19-1.11v-3.72h1.3v3.12c0 .52.03.64.22.64.17 0 .2-.12.2-.64v-3.12H13.5v3.72c0 .55-.06.81-.5 1.41zm5.23-3.71l-.44 1.37-.35 1.06-.22.67-.22-.67-.35-1.06-.44-1.37-.42-1.31h1.44l.25.98.29 1.13.23.94.23-.94.29-1.13.25-.98h1.44l-.44 1.31z" />
    </svg>
  );
}

// ── Socials data ──────────────────────────────────────────────────────────────

const socials = [
  { label: 'X',        href: 'https://x.com/avashiaom', Icon: IconX        },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omavashia/', Icon: IconLinkedIn  },
  { label: 'GitHub',   href: 'https://github.com/omavashia2005', Icon: IconGitHub   },
  { label: 'Blog',     href: 'https://dev.to/omavashia', Icon: IconDevTo     },
] as const;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-[420px] flex flex-col">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="anim anim-1 flex items-center gap-5 mb-10">
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{ width: 64, height: 64, outline: '1px solid rgba(240,239,233,0.08)', outlineOffset: '2px' }}
          >
            <Image
              src="/profile.jpg"
              alt="Om Avashia"
              width={64}
              height={64}
              priority
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="font-cormorant text-[2.15rem] font-light leading-none tracking-[-0.01em] text-[#f0efe9]">
              Om Avashia
            </h1>
            <p className="font-mono text-[0.6rem] tracking-[0.18em] text-[#f0efe9]/28 mt-[6px] uppercase">
              BACKEND DEVELOPER&nbsp;·&nbsp;OPEN SOURCE&nbsp;·&nbsp;CS @ ASU
            </p>
          </div>
        </div>

        {/* ── Socials ──────────────────────────────────────────────────── */}
        <nav
          className="anim anim-2 flex items-center gap-[18px] mb-4"
          aria-label="Social links"
        >
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f0efe9]/25 hover:text-[#f0efe9] transition-colors duration-200"
            >
              {label === 'Blog'
                ? <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase">{label}</span>
                : <Icon />}
            </a>
          ))}
        </nav>

        {/* ── Languages ────────────────────────────────────────────────── */}
        <p className="anim anim-3 font-mono text-[0.58rem] text-[#f0efe9]/22 tracking-[0.06em] mb-12">
          Python&nbsp;·&nbsp;Java&nbsp;·&nbsp;Go&nbsp;·&nbsp;C/C++&nbsp;·&nbsp;JavaScript/TypeScript
        </p>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="anim anim-3 border-t border-[#f0efe9]/[0.07] mb-10" />

        {/* ── Tabbed section (Experience / Projects) ────────────────────── */}
        <TabSection />

      </div>
    </main>
  );
}
