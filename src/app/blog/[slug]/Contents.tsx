'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Heading = { id: string; text: string; level: 2 | 3 };

const slugify = (text: string) =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

// Desktop-only table of contents, built from the post's rendered h2/h3s so posts need no extra markup.
export default function Contents() {
	const [headings, setHeadings] = useState<Heading[]>([]);
	const [active, setActive] = useState<string | null>(null);
	// while a click-triggered smooth scroll is in flight, ignore scroll tracking so the bar doesn't
	// get dragged back through the sections it passes; resume once scrolling has been idle briefly
	const clickLock = useRef<number | null>(null);

	useEffect(() => {
		const els = [...document.querySelectorAll<HTMLHeadingElement>('.blog-body h2, .blog-body h3')];
		for (const el of els) el.id ||= slugify(el.textContent ?? '');
		setHeadings(els.map((el) => ({ id: el.id, text: el.textContent ?? '', level: el.tagName === 'H2' ? 2 : 3 })));

		// active = the last heading that has scrolled past the top third of the screen
		const update = () => {
			let current: string | null = null;
			for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight / 3) current = el.id;
			// the last sections can't scroll up that far, so at the bottom of the page the last one wins
			const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40; // slack for zoom / fractional trackpad scroll
			setActive(atBottom ? els[els.length - 1].id : current);
		};
		const onScroll = () => {
			if (clickLock.current === null) return update();
			window.clearTimeout(clickLock.current);
			clickLock.current = window.setTimeout(() => {
				clickLock.current = null;
				update();
			}, 150);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// One indicator that moves like a weight through fabric: the leading edge travels first and
	// overshoots slightly, the trailing edge follows later, so the bar stretches then settles.
	const listRef = useRef<HTMLUListElement>(null);
	const [bar, setBar] = useState<{ top: number; bottom: number; down: boolean } | null>(null);
	useLayoutEffect(() => {
		const ul = listRef.current;
		const link = ul?.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(active ?? '')}"]`);
		if (!ul || !link) return setBar(null);
		const top = link.offsetTop;
		setBar((prev) => ({
			top,
			bottom: ul.clientHeight - top - link.offsetHeight,
			down: prev ? top >= prev.top : true,
		}));
	}, [active, headings]);
	const activeIndex = headings.findIndex((h) => h.id === active);

	const lead = '380ms cubic-bezier(0.34, 1.4, 0.64, 1)'; // quick, small overshoot
	const trail = '620ms cubic-bezier(0.22, 1, 0.36, 1) 90ms'; // lags behind, eases in

	if (headings.length === 0) return null;

	return (
		// spans the article's height in the left gutter; the inner nav sticks while scrolling
		<aside className="absolute top-0 right-full bottom-0 mr-16 hidden w-[200px] xl:block">
		<nav aria-label="Contents" className="sticky top-12">
			{/* same type as the post date so the two read as one row */}
			<p className="mb-5 font-body text-[0.55rem] uppercase tracking-[0.14em] text-(--c-666)">Contents</p>
			<ul ref={listRef} className="relative flex flex-col gap-2 border-l border-(--c-fg)/[0.08]">
				<span
					aria-hidden="true"
					className="absolute -left-px w-px bg-(--c-fg)"
					style={{
						top: bar?.top ?? 0,
						bottom: bar?.bottom ?? '100%',
						opacity: bar ? 1 : 0,
						// moving down the bottom edge leads; moving up the top edge leads
						transition: bar
							? `top ${bar.down ? trail : lead}, bottom ${bar.down ? lead : trail}, opacity 300ms ease`
							: 'opacity 300ms ease',
					}}
				/>
				{headings.map(({ id, text, level }, i) => {
					// active item nudges out 6px, its neighbours 2px, like cloth pulled at one point
					const d = activeIndex < 0 ? Infinity : Math.abs(i - activeIndex);
					const nudge = d === 0 ? 6 : d === 1 ? 2 : 0;
					return (
					<li key={id}>
						<a
							href={`#${id}`}
							onClick={() => {
								setActive(id);
								if (clickLock.current !== null) window.clearTimeout(clickLock.current);
								// released by the first idle gap in the scroll events (or right away if nothing scrolls)
								clickLock.current = window.setTimeout(() => (clickLock.current = null), 400);
							}}
							className={[
								'block py-[2px] font-body text-[0.72rem] leading-snug tracking-[0.01em]',
								level === 3 ? 'pl-7' : 'pl-4',
								active === id ? 'text-(--c-fg)' : 'text-(--c-666) hover:text-(--c-aaa)',
							].join(' ')}
							style={{
								transform: `translateX(${nudge}px)`,
								transition: `transform 520ms cubic-bezier(0.34, 1.4, 0.64, 1) ${d * 30}ms, color 300ms ease`,
							}}
						>
							{text}
						</a>
					</li>
					);
				})}
			</ul>
		</nav>
		</aside>
	);
}
