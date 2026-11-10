'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import ThemeToggle from './ThemeToggle';
import { tabs, type Tab } from './tabs';

const pageTitle: Record<Tab, string> = { about: '', writing: 'Stuff I Wrote', videos: 'Videos', reading: 'Stuff I Liked Reading' };
const tabHref = (tab: Tab) => (tab === 'about' ? '/' : `/?tab=${tab}`);

// Name (home) + page title on the left, section links on the right, same on every page.
// On the home page onSelect swaps tabs in place; elsewhere (blog posts) the links just navigate.
export default function SiteHeader({ active, onSelect }: { active: Tab; onSelect?: (tab: Tab) => void }) {
	const go = (tab: Tab) => (e: MouseEvent) => {
		if (!onSelect) return;
		e.preventDefault();
		onSelect(tab);
	};

	return (
		<header className="mb-10 flex items-start justify-between gap-x-6 max-sm:block">
			{/* as tall as the name's line, so links and icon sit centered on it; on phones it floats right as a
			    column (icon under the links) so the intro can tuck up beside it. first in DOM for the float, order-1 keeps it right on desktop */}
			<div className="order-1 flex min-h-[1.875rem] shrink-0 items-center gap-x-6 max-sm:float-right max-sm:ml-6 max-sm:flex-col max-sm:items-end max-sm:gap-y-3">
				<nav aria-label="Sections" className="flex gap-x-6 font-body text-[0.85rem] md:text-[0.94rem] tracking-[0.02em] text-(--c-666) max-sm:flex-col max-sm:items-end">
					{tabs.filter((tab) => tab !== 'about').map((tab) => (
						<Link
							key={tab}
							href={tabHref(tab)}
							prefetch={!onSelect}
							onClick={go(tab)}
							aria-current={active === tab ? 'page' : undefined}
							className={`transition-colors duration-200 hover:text-(--c-fg) ${active === tab ? 'font-bold text-(--c-fg)' : ''}`}
						>
							{tab}
						</Link>
					))}
				</nav>
				{/* -m-2 cancels its p-2 hit area so it doesn't push the row taller or off the right edge */}
				<ThemeToggle className="-my-2 -mr-2 flex" />
			</div>
			<h1 className="font-display text-[1.5rem] font-bold leading-tight text-(--c-fg)">
				<Link href="/" prefetch={!onSelect} onClick={go('about')}>Om Avashia</Link>
				{/* narrow screens: title drops to its own line and the dash goes */}
				{pageTitle[active] && (
					<span className="font-light max-[580px]:block max-[580px]:text-[1.25rem]">
						<span className="text-(--c-666) max-[580px]:hidden">{' — '}</span>
						{pageTitle[active]}
					</span>
				)}
			</h1>
		</header>
	);
}
