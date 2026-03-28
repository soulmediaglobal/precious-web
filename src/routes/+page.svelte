<script lang="ts">
	import { onMount } from "svelte";

	const navItems = ['Home', 'About Us', 'Expertise', 'Portfolio'];

	let height = $state(0);

	onMount(() => {
		height = window.innerHeight;
	})
</script>

<svelte:head>
	<title>Precious Contractor</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-screen overflow-x-hidden bg-[#ececec] text-[#161616]">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100vh'}"
	>
		<div class="absolute inset-0">
			<img src="/home-image-1.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>
		<header class="relative z-10 flex items-center justify-between gap-5 h-24 px-16">
			<img src="/logo.svg" alt="" />

			<nav class="flex flex-1 items-center justify-center gap-6">
				{#each navItems as item (item)}
					<a href="/" class="text-sm text-white/85 no-underline px-3">{item}</a>
				{/each}
			</nav>

			<a
				href="#contact"
				class="inline-flex items-center gap-3 justify-center border border-white/75 px-4 py-2 text-sm text-white no-underline"
			>
				Contact us <span>↗</span>
			</a>
		</header>

		<div class="absolute bottom-44 z-10 inset-x-36">
			<h1 class="mb-16 text-6xl font-medium">
				Complete Building Solutions<br />From Structure To Interior
			</h1>

			<div class="flex flex-wrap gap-6">
				<a
					href="#portfolio"
					class="inline-flex items-center gap-3 bg-[#e0b126] px-6 py-4 text-sm tracking-[0.01em] text-[#111] no-underline"
				>
					See Our Work <span>↗</span>
				</a>
				<a
					href="#contact"
					class="inline-flex items-center gap-3 bg-white/4 px-6 py-4 text-sm tracking-[0.01em] text-white no-underline ring-1 ring-inset ring-white/65"
				>
					Get In Touch <span>↗</span>
				</a>
			</div>
		</div>
	</section>

	<section
		class="relative grid w-full grid-cols-2 overflow-hidden bg-[#f3f3f3]"
		style="height: {height ? `${height * 0.93}px` : '93vh'}"
	>
		<div class="absolute inset-0">
			<img src="/home-image-2.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div class="absolute inset-0" style="background: linear-gradient(270deg, rgba(255, 255, 255, 85%) 41.16%, #FFFFFF 86.3%);"></div>
		<div class="relative z-10 pl-36 pr-16 py-32 pb-20 w-full">
			<div class="mb-1 text-xs tracking-[0.17em] text-[#d4a321]">ABOUT US</div>
			<h2 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence<br />Across Indonesia
			</h2>
			<p class="mb-5 text-[#555]">
				PT Precious Contractor Indonesia is a general contractor providing end-to-end services, from
				design to construction. We specialize in delivering high-quality projects across buildings,
				warehouses, factories, hospitals, and hotels.
			</p>
			<p class="mb-5 text-[#555]">
				Supported by experienced engineers and trusted partners, we bring deep expertise in the
				Indonesian construction industry. We are committed to strong execution, reliable delivery,
				and sustainable growth across projects of different scales.
			</p>
			<a href="/" class="mt-2 inline-flex text-[1.375rem] text-[#111] no-underline">↗</a>
		</div>

		<div class="relative z-10 h-full w-full pl-20 py-20">
			<div
				class="grid grid-cols-2 gap-4 w-full h-full"
			>
				<div class="w-full h-full overflow-hidden">
					<!-- <img src="/home-image-3.webp" alt="" class="w-full h-full object-cover object-center" /> -->
				</div>
				<div class="w-full h-full overflow-hidden">
					<!-- <img src="/home-image-4.webp" alt="" class="w-full h-full object-cover object-center" /> -->
				</div>
				<div class="w-full h-full overflow-hidden col-span-2">
					<!-- <img src="/home-image-5.webp" alt="" class="w-full h-full" /> -->
				</div>
			</div>
			<!-- <div class="w-full h-full bg-red-500"> -->

			<!-- </div> -->
		</div>
	</section>

	<section class="relative mx-auto w-full bg-[#ececec]" style="height: {height ? `${height * 0.93}px` : '93vh'}">
		<div class="h-full py-20">
			<div
				class="h-full bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.12)),linear-gradient(135deg,#59685f_0%,#bca27c_40%,#6e5f4b_70%,#3d3a37_100%)]"
				style="width: calc(50% + 5rem)"
			></div>
		</div>
		<div class="absolute h-full right-0 top-0 w-1/2 py-20">
			<div class="h-full w-full py-12">
				<div
					class="w-full h-full bg-[#060606] p-12 text-white"
				>
					<div class="mb-4.5 text-xs tracking-[0.17em] text-[#d4a321]">EXPERTISE</div>
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
			</div>
		</div>
	</section>

	<section
		id="portfolio"
		class="relative mx-auto w-full bg-[#ececec]"
		style="height: {height ? `${height * 1.02}px` : '102vh'}"
	>
		<div
			class="w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,#ddd5cb_0%,#f0eee9_28%,#cabaa2_62%,#8c735f_100%)]"
			style="height: 76%"
		></div>
		<div
			class="flex items-center justify-end gap-4.5 text-sm text-[#777] mt-8 w-full px-36"
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

		<div
			class="absolute left-36 bg-[#060606] p-16 text-white w-[45%] bottom-24"
		>
			<div class="mb-1 text-xs text-[#d4a321]">PORTFOLIO</div>
			<h3 class="mb-4 text-4xl font-medium">
				Building Excellence Across Indonesia
			</h3>
			<a href="/" class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>
	</section>

	<section
		id="contact"
		class="relative mx-auto w-full bg-[#ececec] mb-20"
		style="height: {height ? `${height * 0.75}px` : '75vh'}"
	>
		<div
			class="h-full w-[72%] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.15)),linear-gradient(135deg,#898887_0%,#5c5a58_38%,#c94a2d_38%,#323232_68%,#b8b8b8_100%)]"
		></div>

		<div
			class="absolute right-36 bg-[#060606] p-16 text-white w-[35%] bottom-1/2"
			style="transform: translateY(50%)"
		>
			<div class="mb-1 text-xs text-[#d4a321]">CONTACT US</div>
			<h3 class="mb-4 text-4xl font-medium">
				Need to Reach Us?
			</h3>
			<a href="/" class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>
	</section>

	<footer
		class="mx-auto grid w-full grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 bg-[#060606] px-14 pt-13 pb-6.5 text-white/80 max-[68.75rem]:grid-cols-2 max-[68.75rem]:px-7 max-[45rem]:grid-cols-1"
	>
		<img src="/logo-white.svg" alt="" />

		<div class="flex flex-col gap-3 text-sm">
			<a href="/" class="text-inherit no-underline">Home</a>
			<a href="/" class="text-inherit no-underline">About Us</a>
			<a href="/" class="text-inherit no-underline">Expertise</a>
			<a href="/" class="text-inherit no-underline">Contact</a>
		</div>

		<div class="flex flex-col gap-3 text-sm">
			<a href="mailto:hello@precious.com" class="text-inherit no-underline">hello@precious.com</a>
			<a href="tel:+620000000000" class="text-inherit no-underline">+62 70 7687 891</a>
			<a href="/" class="text-inherit no-underline">Instagram</a>
			<a href="/" class="text-inherit no-underline">LinkedIn</a>
		</div>

		<form class="flex flex-col justify-start gap-4.5">
			<label for="email" class="text-sm text-white/70">Enter your e-mail</label>
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
			class="col-span-full flex justify-between gap-6 border-t border-white/10 pt-4.5 text-sm text-white/60"
		>
			<div class="text-white/60">© 2025 Precious</div>
			<div class="flex justify-end gap-6">
				<a href="/" class="text-inherit no-underline">Cookies Policy</a>
				<a href="/" class="text-inherit no-underline">Legal Terms</a>
				<a href="/" class="text-inherit no-underline">Privacy Policy</a>
			</div>
		</div>
	</footer>
</div>
