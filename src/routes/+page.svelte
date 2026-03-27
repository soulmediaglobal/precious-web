<script lang="ts">
	const navItems = ['Home', 'About Us', 'Expertise', 'Portfolio'];
</script>

<svelte:head>
	<title>Precious Contractor</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-hidden bg-[#ececec] text-[#161616]">
	<section
		class="relative mx-auto min-h-195 w-full max-w-360 overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] px-14 pt-7 pb-16 text-white max-[68.75rem]:px-7 max-[45rem]:min-h-170 max-[45rem]:pt-5"
	>
		<div
			class="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28),rgba(0,0,0,0.08)),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%)]"
		></div>

		<div
			class="absolute top-0 -left-12 h-130 w-80 border border-white/8 bg-[linear-gradient(rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] bg-size-[1.875rem_1.875rem,1.875rem_1.875rem,cover] opacity-70 shadow-[0_1.25rem_3.75rem_rgba(0,0,0,0.18)] transform-[perspective(56.25rem)_rotateY(24deg)_rotateX(3deg)_skewY(-9deg)]"
		></div>
		<div
			class="absolute bottom-2.5 left-1/2 h-135 w-90 -translate-x-1/2 border border-white/8 bg-[linear-gradient(rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] bg-size-[1.875rem_1.875rem,1.875rem_1.875rem,cover] opacity-[0.78] shadow-[0_1.25rem_3.75rem_rgba(0,0,0,0.18)] transform-[translateX(-50%)_perspective(62.5rem)_rotateX(17deg)_rotateY(-8deg)]"
		></div>
		<div
			class="absolute top-0 -right-6 h-130 w-75 border border-white/8 bg-[linear-gradient(rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,rgba(255,255,255,0.08)_0.0625rem,transparent_0.0625rem),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] bg-size-[1.875rem_1.875rem,1.875rem_1.875rem,cover] opacity-72 shadow-[0_1.25rem_3.75rem_rgba(0,0,0,0.18)] transform-[perspective(56.25rem)_rotateY(-22deg)_rotateX(4deg)_skewY(7deg)]"
		></div>

		<header class="relative z-10 flex items-center justify-between gap-5">
			<div class="flex items-center gap-2.5 text-white">
				<div class="relative h-8 w-10.5">
					<span
						class="absolute top-1 left-0.5 block h-1.5 w-7.5 origin-left rounded-full bg-white transform-[rotate(24deg)]"
					></span>
					<span
						class="absolute top-3.25 left-2.5 block h-1.5 w-6 origin-left rounded-full bg-white transform-[rotate(16deg)]"
					></span>
					<span
						class="absolute top-5.25 left-0 block h-1.5 w-8.5 origin-left rounded-full bg-white transform-[rotate(8deg)]"
					></span>
				</div>
				<div class="text-[0.625rem] leading-[1.1] font-bold tracking-[0.16em]">
					<div>PRECIOUS</div>
					<div>CONTRACTOR</div>
				</div>
			</div>

			<nav class="flex items-center gap-9.5 max-[68.75rem]:hidden">
				{#each navItems as item (item)}
					<a href="/" class="text-[0.8125rem] text-white/85 no-underline">{item}</a>
				{/each}
			</nav>

			<a
				href="#contact"
				class="inline-flex min-w-33 items-center justify-center border border-white/75 px-4.5 py-3 text-[0.8125rem] text-white no-underline max-[45rem]:min-w-0 max-[45rem]:px-3.5 max-[45rem]:py-2.5"
			>
				Contact us
			</a>
		</header>

		<div class="relative z-10 max-w-190 pt-47.5 pl-1 max-[45rem]:pt-37.5">
			<h1 class="m-0 text-[clamp(2.9rem,5vw,4.7rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Complete Building Solutions<br />From Structure To Interior
			</h1>

			<div class="mt-10.5 flex flex-wrap gap-3.5">
				<a
					href="#portfolio"
					class="inline-flex items-center gap-3 bg-[#e0b126] px-5.5 py-4 text-[0.8125rem] tracking-[0.01em] text-[#111] no-underline"
				>
					See Our Work <span>↗</span>
				</a>
				<a
					href="#contact"
					class="inline-flex items-center gap-3 bg-white/4 px-5.5 py-4 text-[0.8125rem] tracking-[0.01em] text-white no-underline ring-1 ring-inset ring-white/65"
				>
					Get In Touch <span>↗</span>
				</a>
			</div>
		</div>
	</section>

	<section
		class="relative mx-auto grid w-full max-w-360 grid-cols-[1.05fr_1fr] gap-14 overflow-hidden bg-[#f3f3f3] px-14 py-23 max-[68.75rem]:grid-cols-1 max-[68.75rem]:px-7"
	>
		<div class="relative z-10 max-w-135">
			<div class="mb-4.5 text-[0.6875rem] tracking-[0.17em] text-[#d4a321]">ABOUT US</div>
			<h2 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence<br />Across Indonesia
			</h2>
			<p class="mb-5 max-w-125 text-[0.9375rem] leading-[1.75] text-[#555]">
				PT Precious Contractor Indonesia is a general contractor providing end-to-end services, from
				design to construction. We specialize in delivering high-quality projects across buildings,
				warehouses, factories, hospitals, and hotels.
			</p>
			<p class="mb-5 max-w-125 text-[0.9375rem] leading-[1.75] text-[#555]">
				Supported by experienced engineers and trusted partners, we bring deep expertise in the
				Indonesian construction industry. We are committed to strong execution, reliable delivery,
				and sustainable growth across projects of different scales.
			</p>
			<a href="/" class="mt-2 inline-flex text-[1.375rem] text-[#111] no-underline">↗</a>
		</div>

		<div
			class="relative z-10 grid grid-cols-2 grid-rows-[11.25rem_21.25rem] gap-4 max-[45rem]:grid-cols-1 max-[45rem]:grid-rows-[11.25rem_11.25rem_16.25rem]"
		>
			<div
				class="relative overflow-hidden bg-[radial-gradient(circle_at_60%_35%,rgba(255,255,255,0.25),transparent_30%),linear-gradient(135deg,#7b5f45_0%,#b0875d_40%,#302927_100%)]"
			></div>
			<div
				class="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,199,112,0.18),transparent_40%),repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_0.5rem,transparent_0.5rem_1.125rem),linear-gradient(135deg,#4b3e34,#936b40_55%,#2d2622)]"
			></div>
			<div
				class="relative col-span-2 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent),linear-gradient(135deg,#6d85aa_0%,#8db1e0_35%,#d27931_35%,#c34c1e_70%,#192940_100%)] max-[45rem]:col-span-1"
			></div>
		</div>

		<div
			class="pointer-events-none absolute bottom--30 left-[28%] h-85 w-140 rotate-[-8deg] bg-[repeating-radial-gradient(circle_at_0_0,rgba(0,0,0,0.035)_0_0.1875rem,transparent_0.1875rem_1.125rem)] opacity-25"
		></div>
	</section>

	<section class="relative mx-auto w-full max-w-360 bg-[#ececec] px-14 pb-18.5 max-[68.75rem]:px-7">
		<div
			class="h-140 w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.12)),linear-gradient(135deg,#59685f_0%,#bca27c_40%,#6e5f4b_70%,#3d3a37_100%)] max-[45rem]:h-90"
		></div>

		<div
			class="absolute right-14 bottom-18.5 w-full max-w-130 bg-[#060606] px-12 py-13 text-white max-[68.75rem]:relative max-[68.75rem]:right-auto max-[68.75rem]:bottom-auto max-[68.75rem]:-mt-17.5 max-[68.75rem]:max-w-180 max-[45rem]:mt-0 max-[45rem]:px-6 max-[45rem]:py-7"
		>
			<div class="mb-4.5 text-[0.6875rem] tracking-[0.17em] text-[#d4a321]">EXPERTISE</div>
			<h3 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence<br />Across Indonesia
			</h3>
			<p class="mb-5 max-w-125 text-[0.9375rem] leading-[1.75] text-white/70">
				PT Precious Contractor Indonesia is a general contractor providing end-to-end services, from
				design to construction. We specialize in delivering high-quality projects across buildings,
				warehouses, factories, hospitals, and hotels.
			</p>
			<a href="/" class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>
	</section>

	<section
		id="portfolio"
		class="relative mx-auto w-full max-w-360 bg-[#ececec] px-14 pb-18.5 max-[68.75rem]:px-7"
	>
		<div
			class="h-140 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,#ddd5cb_0%,#f0eee9_28%,#cabaa2_62%,#8c735f_100%)] max-[45rem]:h-90"
		></div>

		<div
			class="absolute bottom-18.5 left-14 w-107.5 bg-[#060606] px-8.5 py-10.5 text-white max-[68.75rem]:relative max-[68.75rem]:left-auto max-[68.75rem]:bottom-auto max-[68.75rem]:-mt-17.5 max-[68.75rem]:w-full max-[68.75rem]:max-w-180 max-[45rem]:mt-0 max-[45rem]:px-6 max-[45rem]:py-7"
		>
			<div class="mb-4.5 text-[0.6875rem] tracking-[0.17em] text-[#d4a321]">PORTFOLIO</div>
			<h3 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence Across<br />Indonesia
			</h3>
			<a href="/" class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>

		<div
			class="absolute right-19.5 bottom-6.5 flex items-center gap-4.5 text-[0.75rem] text-[#777] max-[68.75rem]:right-7 max-[45rem]:relative max-[45rem]:right-auto max-[45rem]:bottom-auto max-[45rem]:justify-end max-[45rem]:pt-4.5"
		>
			<button
				aria-label="Previous"
				class="cursor-pointer border-0 bg-transparent text-[1.125rem] text-[#777]"
			>
				←
			</button>
			<span>1 of 3</span>
			<button
				aria-label="Next"
				class="cursor-pointer border-0 bg-transparent text-[1.125rem] text-[#777]"
			>
				→
			</button>
		</div>
	</section>

	<section
		id="contact"
		class="relative mx-auto w-full max-w-360 bg-[#ececec] px-14 pb-18.5 max-[68.75rem]:px-7"
	>
		<div
			class="h-140 w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.15)),linear-gradient(135deg,#898887_0%,#5c5a58_38%,#c94a2d_38%,#323232_68%,#b8b8b8_100%)] max-[45rem]:h-90"
		></div>

		<div
			class="absolute right-14 bottom-33 w-117.5 bg-[#060606] px-10 py-10.5 text-white max-[68.75rem]:relative max-[68.75rem]:right-auto max-[68.75rem]:bottom-auto max-[68.75rem]:-mt-17.5 max-[68.75rem]:w-full max-[68.75rem]:max-w-180 max-[45rem]:mt-0 max-[45rem]:px-6 max-[45rem]:py-7"
		>
			<div class="mb-4.5 text-[0.6875rem] tracking-[0.17em] text-[#d4a321]">CONTACT US</div>
			<h3 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Need to Reach Us?
			</h3>
			<a href="/" class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>
	</section>

	<footer
		class="mx-auto grid w-full max-w-360 grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 bg-[#060606] px-14 pt-13 pb-6.5 text-white/80 max-[68.75rem]:grid-cols-2 max-[68.75rem]:px-7 max-[45rem]:grid-cols-1"
	>
		<div>
			<div class="mb-27.5 flex items-center gap-2.5 text-white max-[45rem]:mb-7">
				<div class="relative h-8 w-10.5">
					<span
						class="absolute top-1 left-0.5 block h-1.5 w-7.5 origin-left rounded-full bg-white transform-[rotate(24deg)]"
					></span>
					<span
						class="absolute top-3.25 left-2.5 block h-1.5 w-6 origin-left rounded-full bg-white transform-[rotate(16deg)]"
					></span>
					<span
						class="absolute top-5.25 left-0 block h-1.5 w-8.5 origin-left rounded-full bg-white transform-[rotate(8deg)]"
					></span>
				</div>
				<div class="text-[0.625rem] leading-[1.1] font-bold tracking-[0.16em]">
					<div>PRECIOUS</div>
					<div>CONTRACTOR</div>
				</div>
			</div>
			<div class="text-[0.75rem] text-white/60">© 2025 Precious</div>
		</div>

		<div class="flex flex-col gap-3 text-[0.8125rem]">
			<a href="/" class="text-inherit no-underline">Home</a>
			<a href="/" class="text-inherit no-underline">About Us</a>
			<a href="/" class="text-inherit no-underline">Expertise</a>
			<a href="/" class="text-inherit no-underline">Contact</a>
		</div>

		<div class="flex flex-col gap-3 text-[0.8125rem]">
			<a href="mailto:hello@precious.com" class="text-inherit no-underline">hello@precious.com</a>
			<a href="tel:+620000000000" class="text-inherit no-underline">+62 70 7687 891</a>
			<a href="/" class="text-inherit no-underline">Instagram</a>
			<a href="/" class="text-inherit no-underline">LinkedIn</a>
		</div>

		<form class="flex flex-col justify-start gap-4.5">
			<label for="email" class="text-[0.8125rem] text-white/70">Enter your e-mail</label>
			<div class="flex items-center border-b border-white/35 pb-2.5">
				<input
					id="email"
					type="email"
					class="flex-1 border-0 bg-transparent text-[0.875rem] text-white outline-none"
				/>
				<button
					type="submit"
					class="cursor-pointer border-0 bg-transparent text-[1.25rem] text-white"
				>
					↗
				</button>
			</div>
		</form>

		<div
			class="col-span-full flex justify-end gap-6 border-t border-white/10 pt-4.5 text-[0.75rem] text-white/60 max-[45rem]:flex-wrap max-[45rem]:justify-start"
		>
			<a href="/" class="text-inherit no-underline">Cookies Policy</a>
			<a href="/" class="text-inherit no-underline">Legal Terms</a>
			<a href="/" class="text-inherit no-underline">Privacy Policy</a>
		</div>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		background: #ececec;
	}
</style>
