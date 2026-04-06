'use client';

import { useState } from 'react';

// ── Data ─────────────────────────────────────────────────────────────────────

const experience = [
  {
    company: 'Wells Fargo',
    role: 'Software Engineering Intern',
    location: 'Phoenix, AZ',
    date: 'Summer 2026',
    description: 'Incoming Summer 2026',
  },
  {
    company: 'ASU Active Perception Group',
    role: 'Computer Vision Researcher',
    location: 'Tempe, AZ',
    date: 'Nov 2025 – Present',
    description: '3D Gaussian Reconstruction + NVS for Autonomous Vehicles',
  },
  {
    company: 'IPAuthor',
    role: 'Software Engineering Intern',
    location: 'San Mateo, CA',
    date: 'May 2025 – Aug 2025',
    description: 'Backed by Illuminate, eLab, and Okapi.',
    link: 'https://ipauthor.com',
  },
];

const projects = [
  {
    name: 'yank',
    description: 'Copy Claude Code (CLI) responses directly to your clipboard',
    detail: '500+ downloads in <24h',
    stack: 'Shell · JS · npm',
    href: 'https://github.com/omavashia2005/yank',
  },
  {
    name: 'agentgit',
    description: '3D visualizer for Claude Code sessions',
    detail: '200+ downloads in <24h',
    stack: 'TypeScript · Bun',
    href: 'https://github.com/omavashia2005/agentgit',
  },
  {
    name: 'asudines',
    description: 'Dining hall food ranker',
    detail: '100+ users on launch',
    stack: 'Next.js · Cloudflare D1 · Workers',
    href: 'https://asudines.com',
  },
  {
    name: 'canvasbot',
    description: 'Search and chat with Canvas course files',
    detail: '70% page render improvement via caching',
    stack: 'FastAPI · Redis · Supabase',
    href: 'https://canvasbot.pages.dev',
  },
];

const opensource = [
  {
    name: 'nanobot',
    description: 'Persistent memory integration',
    detail: '',
    href: 'https://github.com/omavashia2005/nanobot',
  },
  {
    name: 'cased/sandboxes',
    description: '',
    detail: 'Extended the SDK to support for rich code execution output (built for dify-cloud-sandboxes)',
    href: 'https://github.com/omavashia2005/sandboxes/tree/feat/e2b-code-interpreter',
  },
  {
    name: 'Dify',
    description: '',
    detail: 'Drop-in cloud sandbox router for code execution on Dify',
    href: 'https://github.com/omavashia2005/dify-cloud-sandboxes',
  },
];

type Tab = 'experience' | 'projects' | 'open source';

// ── Component ─────────────────────────────────────────────────────────────────

export default function TabSection() {
  const [active, setActive] = useState<Tab>('experience');

  return (
    <div className="anim anim-4 w-full">

      {/* ── Tab buttons ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 mb-8">
        {(['experience', 'projects', 'open source'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={[
              'font-mono text-[0.55rem] tracking-[0.22em] uppercase transition-colors duration-200',
              active === tab
                ? 'text-[#f0efe9]'
                : 'text-[#f0efe9]/22 hover:text-[#f0efe9]/50',
            ].join(' ')}
          >
            {tab}
            {active === tab && (
              <span className="block h-px bg-[#f0efe9]/30 mt-[3px]" />
            )}
          </button>
        ))}
      </div>

      {/* ── Experience ───────────────────────────────────────────────── */}
      {active === 'experience' && (
        <ul className="flex flex-col gap-7">
          {experience.map(({ company, role, location, date, description, ...rest }) => {
            const link = 'link' in rest ? (rest as { link: string }).link : undefined;
            return (
              <li key={company} className="group flex flex-col gap-[3px]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-cormorant text-[1.35rem] font-light leading-tight text-[#f0efe9] group-hover:text-white transition-colors duration-200">
                    {company}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[#f0efe9]/22 tracking-[0.06em] shrink-0">
                    {date}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[0.62rem] text-[#f0efe9]/38 tracking-[0.04em]">
                    {role}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[#f0efe9]/22 tracking-[0.06em] shrink-0">
                    {location}
                  </span>
                </div>
                <span className="font-mono text-[0.58rem] text-[#f0efe9]/22 tracking-[0.06em] mt-[1px]">
                  {description}
                  {link && (
                    <>
                      {' '}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#f0efe9]/50 transition-colors duration-200 underline underline-offset-2 decoration-[#f0efe9]/15"
                      >
                        ipauthor.com
                      </a>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Projects ─────────────────────────────────────────────────── */}
      {active === 'projects' && (
        <ul className="flex flex-col gap-7">
          {projects.map(({ name, description, detail, stack, href }) => (
            <li key={name} className="group">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-[3px]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-cormorant text-[1.35rem] font-light leading-tight text-[#f0efe9] group-hover:text-white transition-colors duration-200">
                    {name}
                  </span>
                  <span className="font-mono text-[0.6rem] text-[#f0efe9]/18 group-hover:text-[#f0efe9]/40 transition-colors duration-200 shrink-0 translate-y-[-1px]">
                    ↗
                  </span>
                </div>
                <span className="font-mono text-[0.62rem] text-[#f0efe9]/38 tracking-[0.04em]">
                  {description}
                </span>
                <div className="flex items-baseline justify-between gap-4 mt-[1px]">
                  <span className="font-mono text-[0.58rem] text-[#f0efe9]/22 tracking-[0.06em]">
                    {detail}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[#f0efe9]/18 tracking-[0.04em] shrink-0">
                    {stack}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* ── Open Source ──────────────────────────────────────────────── */}
      {active === 'open source' && (
        <ul className="flex flex-col gap-7">
          {opensource.map(({ name, description, detail, href }) => (
            <li key={name} className="group">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-[3px]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-cormorant text-[1.35rem] font-light leading-tight text-[#f0efe9] group-hover:text-white transition-colors duration-200">
                    {name}
                  </span>
                  <span className="font-mono text-[0.6rem] text-[#f0efe9]/18 group-hover:text-[#f0efe9]/40 transition-colors duration-200 shrink-0 translate-y-[-1px]">
                    ↗
                  </span>
                </div>
                <span className="font-mono text-[0.62rem] text-[#f0efe9]/38 tracking-[0.04em]">
                  {description}
                </span>
                <span className="font-mono text-[0.58rem] text-[#f0efe9]/22 tracking-[0.06em] mt-[1px]">
                  {detail}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
