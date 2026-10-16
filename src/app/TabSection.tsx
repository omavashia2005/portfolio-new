'use client';

import Link from 'next/link';
import { Fragment, useState, type ReactNode } from 'react';

// ── Data ─────────────────────────────────────────────────────────────────────

const experience = [
	{
		company: 'ASU Active Perception Group + Toyota Research Institute (TRINA)',
		role: 'Computer Vision Researcher',
		location: 'Tempe, AZ',
		date: 'Nov 2025 – Present',
		description: '3D Gaussian Reconstruction + NVS for Autonomous Vehicles',
	},
	{
		company: 'Wells Fargo',
		role: 'Software Engineering Intern',
		location: 'Phoenix, AZ',
		date: 'May 2026 – Aug 2026',
		description: 'Consumer Technology, Loan Pricing',
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

// Wraps numbers like 700+, 160K, 6ms, 70% in a brighter span.
const highlightNumbers = (text: string) =>
	text.split(/((?<![A-Za-z\d])\d[\d,.]*(?:K|k|ms|%|x)?\+?(?![A-Za-z]))/).map((part, i) =>
		i % 2 ? <span key={i} className="text-[#f0efe9]">{part}</span> : part
	);

const readingList = [
	{
		title: 'Yes, and...',
		author: 'Carson Gross',
		href: 'https://htmx.org/essays/yes-and/',
		note: 'Helped me rethink things as a soon-to-be newgrad',
		category: 'design & taste',
	},
	{
		title: '39.78%',
		author: 'chris',
		href: 'https://cwispy.substack.com/p/3978',
		note: 'Running 10 Claudes in parallel gives me the same ADHD',
		category: 'design & taste',
	},
	{
		title: 'How we built Pingora, the proxy that connects Cloudflare to the Internet',
		author: 'Yuchen Wu & Andrew Hauck',
		href: 'https://blog.cloudflare.com/how-we-built-pingora-the-proxy-that-connects-cloudflare-to-the-internet/',
		note: 'Encouraged me to pick up Rust and open a couple PRs to Pingora',
		category: 'tech',
	},
	{
		title: 'How we saved 100 terabytes of memory by optimizing 1.1.1.1’s DNS cache',
		author: 'Sebastiaan Neuteboom',
		href: 'https://blog.cloudflare.com/dns-cache-memory-optimization-1111/',
		note: (
			<>
				Read this after watching{' '}
				<a
					href="https://youtu.be/dCwWXEI1-lA"
					target="_blank"
					rel="noopener noreferrer"
					className="underline underline-offset-2 decoration-[#f0efe9]/15 hover:text-[#f0efe9]/70"
				>
					ThePrimeagen cover it
				</a>
			</>
		),
		category: 'tech',
	},
	{
		title: 'You Have to Feel It',
		author: 'Mitchell Hashimoto',
		href: 'https://mitchellh.com/writing/feel-it',
		note: 'Guiding light',
		category: 'design & taste',
	},
	{
		title: 'Rewriting Bun in Rust',
		author: 'Jarred Sumner',
		href: 'https://bun.com/blog/bun-in-rust',
		note: 'Tokenmaxxing → engineering with agents',
		category: 'tech',
	},
	{
		title: 'We Found a Ticking Time Bomb in macOS TCP Networking',
		author: 'Photon',
		href: 'https://photon.codes/blog/we-found-a-ticking-time-bomb-in-macos-tcp-networking',
		note: 'An all-time favorite for how good technical writing makes complex stuff easy to digest',
		category: 'tech',
	},
	{
		title: 'Why is quality so rare',
		author: 'Karri Saarinen, Co-Founder of Linear',
		href: 'https://linear.app/now/why-is-quality-so-rare',
		note: 'A good framework for trying to stand out in the era of agents',
		category: 'design & taste',
	},
	{
		title: 'Output isn\'t design',
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
					className="underline underline-offset-2 decoration-[#f0efe9]/15 hover:text-[#f0efe9]/70"
				>
					Haider
				</a>
			</>
		),
		category: 'literature',
	},
];

const readingCategories = ['tech', 'design & taste', 'literature'];

const videos = [
	{
		id: '4B92hMQ9jiU',
		// highest-res thumbnail YouTube has for this video (maxresdefault isn't always generated)
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

const projects = [
	{
		name: 'emberdb',
		description: 'Blazing fast distributed Redis-compatible key-value store',
		detail: "Profiled MSET/MGET lock contention and replaced Go's global map with thread-safe sharded maps, doubling SET throughput from 160K to 320K ops/s and halving latency from 6ms to 3ms at 100 concurrent clients",
		href: 'https://github.com/omavashia2005/emberdb',
	},
	{
		name: 'hydra',
		description: 'Run 10+ coding agents in your terminal parallely',
		detail: 'Plus features like voice mode, hassle-free worktrees, continuous sessions between different agents, and more',
		href: 'https://github.com/gholtzap/hydra',
	},
	{
		name: 'yank',
		description: 'Copy Claude Code (CLI) responses directly to your clipboard',
		detail: '1200+ downloads on npm',
		href: 'https://github.com/omavashia2005/yank',
	},
	{
		name: 'ai-tool-elements',
		description: 'UI library for agent connectors',
		detail: '700+ downloads in its first week, exposing 1200+ tool connectors through a single unified API',
		href: 'https://ai-tool-elements.vercel.app',
	},
	{
		name: 'agentgit',
		description: '3D visualizer for Claude Code sessions',
		detail: '500+ downloads on npm',
		href: 'https://github.com/omavashia2005/agentgit',
	},
	{
		name: "ShadeASU",
		description: '3D campus navigator that plots the shadiest routes between buildings by calculating real-time shadows from sun position',
		detail: 'Integrated geospatial datasets with solar position algorithms to dynamically shade building geometries; pathfinding optimizes for both thermal comfort and travel time across 600+ acres',
		href: 'https://shadeasu.pages.dev/',
	},
	{
		name: "dash",
		description: 'A geometry dash clone in the terminal in Rust',
		detail: 'Building a lot from scratch like game physics, rendering, etc',
		href: 'https://github.com/omavashia2005/dash',
	},
	{
		name: "veto",
		description: '[Blazing flast] TUI based 3D git commit graph viewer in Rust',
		detail: 'Mainly just messing around with smart pointers (Rc<T>, Weak<T>, RefCell<T>, Box<T>) and Fable',
		href: 'https://github.com/omavashia2005/veto',
	},
];

const opensource = [
	{
		name: 'cloudflare/pingora',
		description: '',
		detail: '',
		href: 'https://github.com/cloudflare/pingora',
		prs: [
			{
				label: '#926',
				detail: 'Finished a TODO in pingora-header-serde to check file paths and avoid panics on unwrap',
				href: 'https://github.com/cloudflare/pingora/pull/926',
				status: 'open' as const,
			},
			{
				label: '#928',
				detail: 'Made the pingora-core rustls listener return a Result instead of panicking',
				href: 'https://github.com/cloudflare/pingora/pull/928',
				status: 'open' as const,
			},
		],
	},
	{
		name: 'imkerberos/nvim-gpui',
		description: '',
		detail: '',
		href: 'https://github.com/imkerberos/nvim-gpui',
		prs: [
			{
				label: '#3',
				detail: 'feat: make the themed titlebar optional',
				href: 'https://github.com/imkerberos/nvim-gpui/pull/3',
				status: 'merged' as const,
			},
		],
	},
	{
		name: 'langgenius/dify',
		description: '',
		detail: '',
		href: 'https://github.com/langgenius/dify',
		prs: [
			{
				label: '#22476',
				detail: 'fix: Python SDK WorkflowClient and KnowledgeBase client imports fixed',
				href: 'https://github.com/langgenius/dify/pull/22476',
				status: 'merged' as const,
			},
		],
	},
	{
		name: 'excalidraw/excalidraw',
		description: '',
		detail: '',
		href: 'https://github.com/excalidraw/excalidraw',
		prs: [
			{
				label: '#11587',
				detail: 'feat: adding shape conversion',
				href: 'https://github.com/excalidraw/excalidraw/pull/11587',
				status: 'open' as const,
			},
		],
	},
	{
		name: 'xiaobiaodu/3DRealCar_Toolkit',
		description: '',
		detail: '',
		href: 'https://github.com/xiaobiaodu/3DRealCar_Toolkit',
		prs: [
			{
				label: '#39',
				detail: 'Fixed an infinite loop in the data processing pipeline',
				href: 'https://github.com/xiaobiaodu/3DRealCar_Toolkit/pull/39',
				status: 'merged' as const,
			},
		],
	},
	{
		name: 'nanobot',
		description: '',
		detail: 'Persistent memory integration',
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

type Tab = 'about' | 'experience' | 'projects' | 'oss' | 'videos' | 'reading';
const tabs: Tab[] = ['about', 'projects', 'experience', 'videos', 'oss', 'reading'];

const tabId = (tab: Tab) => tab.replace(' ', '-');

// ── Component ─────────────────────────────────────────────────────────────────

type TabSectionProps = {
	githubContributions?: ReactNode;
	mobileSocials?: ReactNode;
	identity?: ReactNode;
};

export default function TabSection({ githubContributions, mobileSocials, identity }: TabSectionProps) {
	const [active, setActive] = useState<Tab>('about');

	return (
		<div className="anim anim-4 w-full max-w-[420px] md:max-w-[900px] lg:max-w-[980px]">

			{/* ── Tab buttons ──────────────────────────────────────────────── */}
			<div className="tabs-scroll mb-8 flex items-center gap-x-6 overflow-x-auto pb-1 md:justify-between">
				<div className="contents" role="tablist" aria-label="Portfolio sections">
					{tabs.map((tab) => (
						<Fragment key={tab}>
							<button
								id={`tab-${tabId(tab)}`}
								type="button"
								role="tab"
								aria-selected={active === tab}
								aria-controls={`panel-${tabId(tab)}`}
								onClick={() => setActive(tab)}
								className={[
									'shrink-0 whitespace-nowrap font-mono text-[0.63rem] md:text-[0.69rem] tracking-[0.22em] uppercase transition-colors duration-200 leading-none',
									active === tab
										? 'text-[#f0efe9]'
										: 'text-[#666] hover:text-[#f0efe9]/50',
								].join(' ')}
							>
								{tab}
								<span
									aria-hidden="true"
									className={[
										'block h-px w-full mt-[5px] transition-colors duration-200',
										active === tab ? 'bg-[#f0efe9]/30' : 'bg-transparent',
									].join(' ')}
								/>
							</button>
							{tab === 'about' && (
								<Link
									href="/blog"
									className="shrink-0 font-mono text-[0.63rem] md:text-[0.69rem] tracking-[0.22em] uppercase transition-colors duration-200 leading-none text-[#666] hover:text-[#f0efe9]/50"
								>
									Writing
									<span aria-hidden="true" className="block h-px w-full mt-[5px] bg-transparent" />
								</Link>
							)}
						</Fragment>
					))}
				</div>
			</div>

			{/* tabs stay put on top; identity column only on about, other tabs get the full width */}
			<div className="flex flex-col md:flex-row md:gap-16 lg:gap-24 md:items-start">
				{active === 'about' && identity}

				<div className="flex-1 min-w-0 grid">
					{/* ── About ────────────────────────────────────────────────────── */}
					<section
						id="panel-about"
						role="tabpanel"
						aria-labelledby="tab-about"
						aria-hidden={active !== 'about'}
						data-active={active === 'about'}
						className="tab-panel flex flex-col font-mono text-[0.85rem] md:text-[0.94rem] text-[#aaa] tracking-[0.03em] leading-[1.85]"
					>
						<div className="flex w-full flex-col gap-5 text-pretty">
							<p>
								{"Hey! I'm Om. I love building stuff mainly in Python, Go, Rust, and TypeScript. Check out the projects and OSS tabs for some stuff that did manage to make it outside the private repos :)."}
							</p>
							<p>
								{"I am also currently working on a super interesting research project (more details soon!) for self‑driving cars."}
							</p>
							<p>
								{"HMU on X if anything around here looks interesting / wanna build together / anything else!"}
							</p>
						</div>
						<div className="mt-7 md:hidden">{mobileSocials}</div>
						{active === 'about' && githubContributions}
					</section>

					{/* ── Experience ───────────────────────────────────────────────── */}
					<section
						id="panel-experience"
						role="tabpanel"
						aria-labelledby="tab-experience"
						aria-hidden={active !== 'experience'}
						data-active={active === 'experience'}
						className="tab-panel"
					>
						<ul className="flex flex-col gap-7">
							{experience.map(({ company, role, location, date, description, ...rest }) => {
								const link = 'link' in rest ? (rest as { link: string }).link : undefined;
								return (
									<li key={company} className="group flex flex-col gap-[3px]">
										<div className="flex items-baseline justify-between gap-4">
											<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9] group-hover:text-white transition-colors duration-200">
												{company}
											</span>
											<span className="font-mono text-[0.55rem] text-[#666] tracking-[0.06em] shrink-0">
												{date}
											</span>
										</div>
										<div className="flex items-baseline justify-between gap-4">
											<span className="font-mono text-[0.71rem] md:text-[0.78rem] text-[#888] tracking-[0.04em]">
												{role}
											</span>
											<span className="font-mono text-[0.55rem] text-[#666] tracking-[0.06em] shrink-0">
												{location}
											</span>
										</div>
										<span className="font-mono text-[0.67rem] md:text-[0.72rem] text-[#666] tracking-[0.06em] mt-[1px]">
											{highlightNumbers(description)}
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
					</section>

					{/* ── Projects ─────────────────────────────────────────────────── */}
					<section
						id="panel-projects"
						role="tabpanel"
						aria-labelledby="tab-projects"
						aria-hidden={active !== 'projects'}
						data-active={active === 'projects'}
						className="tab-panel"
					>
						<ul className="flex flex-col gap-7">
							{projects.map(({ name, description, detail, href }) => (
								<li key={name} className="group">
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="flex flex-col gap-[3px]"
									>
										<div className="flex items-baseline justify-between gap-4">
											<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9] group-hover:text-white underline underline-offset-4 decoration-[#f0efe9]/10 group-hover:decoration-[#f0efe9]/60 transition-colors duration-200">
												{name}
											</span>
										</div>
										<span className="font-mono text-[0.71rem] md:text-[0.78rem] text-[#888] tracking-[0.04em]">
											{highlightNumbers(description)}
										</span>
										<div className="flex items-baseline justify-between gap-4 mt-[1px]">
											<span className="font-mono text-[0.67rem] text-[#666] tracking-[0.06em]">
												{highlightNumbers(detail)}
											</span>
										</div>
									</a>
								</li>
							))}
						</ul>
					</section>

					{/* ── Reading List ─────────────────────────────────────────────── */}
					<section
						id="panel-reading"
						role="tabpanel"
						aria-labelledby="tab-reading"
						aria-hidden={active !== 'reading'}
						data-active={active === 'reading'}
						className="tab-panel"
					>
						<div className="flex flex-col gap-10">
							{readingCategories
								.filter((category) => readingList.some((r) => r.category === category))
								.map((category) => (
									<div key={category}>
										<h3 className="mb-4 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#555]">
											{category}
										</h3>
										<ul className="flex flex-col gap-7">
											{readingList.filter((r) => r.category === category).map(({ title, author, note, href, series }) => (
												<li key={title} className="flex flex-col gap-[3px]">
													{/* note sits outside the link so it can hold its own links */}
													{series ? (
														<div className="flex flex-col gap-[3px]">
															<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9]">
																{series.map((s, i) => (
																	<Fragment key={s.href}>
																		{i > 0 && ' + '}
																		<a
																			href={s.href}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="underline underline-offset-4 decoration-[#f0efe9]/10 hover:text-white hover:decoration-[#f0efe9]/60 transition-colors duration-200"
																		>
																			{s.label}
																		</a>
																	</Fragment>
																))}
															</span>
															<span className="font-mono text-[0.67rem] md:text-[0.72rem] text-[#666] tracking-[0.06em] mt-[1px]">
																{author}
															</span>
														</div>
													) : (
														<a
															href={href}
															target="_blank"
															rel="noopener noreferrer"
															className="group flex flex-col gap-[3px]"
														>
															<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9] group-hover:text-white underline underline-offset-4 decoration-[#f0efe9]/10 group-hover:decoration-[#f0efe9]/60 transition-colors duration-200">
																{title}
															</span>
															<span className="font-mono text-[0.67rem] md:text-[0.72rem] text-[#666] tracking-[0.06em] mt-[1px]">
																{author}
															</span>
														</a>
													)}
													<span className="font-mono text-[0.71rem] md:text-[0.78rem] text-[#888] tracking-[0.04em]">
														{note}
													</span>
												</li>
											))}
										</ul>
									</div>
								))}
						</div>
					</section>

					{/* ── Open Source ──────────────────────────────────────────────── */}
					<section
						id="panel-oss"
						role="tabpanel"
						aria-labelledby="tab-oss"
						aria-hidden={active !== 'oss'}
						data-active={active === 'oss'}
						className="tab-panel"
					>
						<div className="flex flex-col gap-10">
							{['merged', 'open'].map((status) => {
								const filteredOss = opensource.filter(item =>
									item.prs?.some((pr) => (pr as any).status === status)
								);
								if (filteredOss.length === 0) return null;
								return (
									<div key={status}>
										<h3 className="mb-6 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#555]">
											{status === 'merged' ? 'Merged' : 'Open'}
										</h3>
										<ul className="flex flex-col gap-7">
											{filteredOss.map(({ name, description, detail, href, prs }) => {
												const filteredPrs = prs?.filter((pr) => (pr as any).status === status) || [];
												const isSinglePr = filteredPrs.length === 1;

												return (
													<li key={name} className="flex flex-col gap-[3px]">
														{isSinglePr ? (
															<a
																href={filteredPrs[0].href}
																target="_blank"
																rel="noopener noreferrer"
																className="group"
															>
																<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9] group-hover:text-white underline underline-offset-4 decoration-[#f0efe9]/10 group-hover:decoration-[#f0efe9]/60 transition-colors duration-200">
																	{name}:
																</span>
															</a>
														) : (
															<>
																<a
																	href={href}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="group flex flex-col gap-[3px]"
																>
																	<div className="flex items-baseline justify-between gap-4">
																		<span className="font-cormorant text-[1.35rem] md:text-[1.5rem] font-light leading-tight text-[#f0efe9] group-hover:text-white underline underline-offset-4 decoration-[#f0efe9]/10 group-hover:decoration-[#f0efe9]/60 transition-colors duration-200">
																			{name}
																		</span>
																	</div>
																	<span className="font-mono text-[0.71rem] md:text-[0.78rem] text-[#888] tracking-[0.04em]">
																		{highlightNumbers(description)}
																	</span>
																	<span className="font-mono text-[0.67rem] md:text-[0.72rem] text-[#666] tracking-[0.06em] mt-[1px]">
																		{highlightNumbers(detail)}
																	</span>
																</a>
																{filteredPrs.length > 0 && (
																	<ul className="mt-3 flex flex-col gap-3 pl-5 border-l border-[#f0efe9]/[0.08]">
																		{filteredPrs.map((pr) => (
																			<li key={pr.href}>
																				<a
																					href={pr.href}
																					target="_blank"
																					rel="noopener noreferrer"
																					className="group"
																				>
																					<span className="font-cormorant text-[1.15rem] md:text-[1.25rem] font-light leading-tight text-[#f0efe9] group-hover:text-white underline underline-offset-4 decoration-[#f0efe9]/10 group-hover:decoration-[#f0efe9]/60 transition-colors duration-200">
																						{pr.label}
																					</span>
																					<span className="font-mono text-[0.67rem] md:text-[0.72rem] text-[#666] tracking-[0.06em]">
																						{' '}{pr.detail}
																					</span>
																				</a>
																			</li>
																		))}
																	</ul>
																)}
															</>
														)}
													</li>
												);
											})}
										</ul>
									</div>
								);
							})}
						</div>
					</section>

					{/* ── Videos ─────────────────────────────────── */}
					<section
						id="panel-videos"
						role="tabpanel"
						aria-labelledby="tab-videos"
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
									<div className="relative aspect-video overflow-hidden border border-[#f0efe9]/[0.08] bg-[#111]">
										<img
											src={`https://i.ytimg.com/vi/${v.id}/${v.thumb}.jpg`}
											alt={`Thumbnail for ${v.title}`}
											className="h-full w-full object-cover opacity-80 transition duration-200 group-hover:scale-[1.02] group-hover:opacity-100"
										/>
										<span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
											<span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#080808]/80 pl-1 text-lg text-[#f0efe9] backdrop-blur-sm">
												▶
											</span>
										</span>
									</div>
									<div className="mt-3 flex items-baseline justify-between gap-4">
										<span className="font-cormorant text-[1.35rem] font-light leading-tight text-[#f0efe9] transition-colors duration-200 group-hover:text-white md:text-[1.5rem]">
											{v.title}
										</span>
										<span className="shrink-0 font-mono text-[0.6rem] text-[#555] transition-colors duration-200 group-hover:text-[#f0efe9]/40">
											↗
										</span>
									</div>
									<span className="mt-1 block font-mono text-[0.58rem] tracking-[0.06em] text-[#666]">
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
