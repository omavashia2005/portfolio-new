'use client';

// octicons sun-16 / moon-16
const sun = 'M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z';
const moon = 'M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z';

// No React state: which icon shows is decided in CSS from the active theme (see .theme-icon in
// globals.css), so it renders correctly on the first paint and even before JS hydrates.
const apply = (next: string) => {
	// freeze transitions for the swap so text (transition-colors) and svg fills flip together
	const freeze = document.createElement('style');
	freeze.textContent = '*,*::before,*::after{transition:none!important}';
	document.head.appendChild(freeze);
	document.documentElement.dataset.theme = next;
	getComputedStyle(document.body).color; // force the restyle while frozen
	requestAnimationFrame(() => freeze.remove());
	try {
		localStorage.setItem('theme', next);
	} catch {}
};

// Pixel reveal: a view transition snapshots the old page, and the new-theme snapshot is clipped to a
// growing set of blocks that spread outward from the button (distance + jitter decides each block's turn).
const DURATION = 700; // ms
const BLOCK = 48; // px
// placed in each page's header row (home tabs row, blog breadcrumb) so it never gets a line of its own
export default function ThemeToggle({ className = '' }: { className?: string }) {
	const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (document.getElementById('pixel-clip')) return; // mid-transition
		const current = getComputedStyle(document.documentElement).colorScheme === 'light' ? 'light' : 'dark';
		const next = current === 'light' ? 'dark' : 'light';
		if (!('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply(next);

		const r = e.currentTarget.getBoundingClientRect();
		const ox = r.left + r.width / 2;
		const oy = r.top + r.height / 2;
		const maxD = Math.hypot(Math.max(ox, innerWidth - ox), Math.max(oy, innerHeight - oy));
		const blocks: [x: number, y: number, at: number][] = [];
		for (let y = 0; y < innerHeight; y += BLOCK)
			for (let x = 0; x < innerWidth; x += BLOCK) {
				const d = Math.hypot(x + BLOCK / 2 - ox, y + BLOCK / 2 - oy) / maxD;
				blocks.push([x, y, (d * 0.75 + Math.random() * 0.25) * DURATION]);
			}

		const style = document.head.appendChild(document.createElement('style'));
		style.id = 'pixel-clip';
		const clip = (t: number) => {
			const squares = blocks.filter((b) => b[2] <= t).map(([x, y]) => `M${x} ${y}h${BLOCK}v${BLOCK}h-${BLOCK}z`);
			style.textContent = `::view-transition-new(root){clip-path:path('M0 0${squares.join('')}')}`;
		};
		clip(-1);

		const vt = document.startViewTransition(() => apply(next));
		vt.ready.then(() => {
			// no-op animation keeps the transition alive while rAF drives the clip
			document.documentElement.animate({ opacity: [1, 1] }, { duration: DURATION + 50, pseudoElement: '::view-transition-new(root)' });
			const start = performance.now();
			const tick = (now: number) => {
				clip(now - start);
				if (now - start < DURATION) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
		vt.finished.finally(() => style.remove());
	};

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle dark mode"
			className={`p-2 text-(--c-666) transition-colors duration-200 hover:text-(--c-fg) ${className}`}
		>
			<svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="currentColor" className="theme-icon-sun">
				<path d={sun} />
			</svg>
			<svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="currentColor" className="theme-icon-moon">
				<path d={moon} />
			</svg>
		</button>
	);
}
