<script lang="ts">
	import { route } from "$lib";
	import Reach from "$lib/components/Reach.svelte";
	import { onMount } from "svelte";

	let height = $state(0);
	let width = $state(0);

	const checkSize = () => {
		height = window.innerHeight;
		width = window.innerWidth;
	}

	onMount(() => {
		checkSize();

		document.addEventListener('resize', checkSize);

		return () => {
			document.removeEventListener('resize', checkSize);
		}
	})
</script>

<svelte:head>
	<title>Precious Contractor</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip bg-[#232423] text-[#161616]">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100vh'}"
	>
		<div class="absolute inset-0">
			<img src="/home-image-1.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>
		<div class="hidden absolute inset-0 z-0 pointer-events-none md:flex items-center justify-center">
			<img src="/mask-1.webp" alt="" class="w-3/4 h-full object-cover object-center" />
		</div>

		<div class="absolute inset-y-0 z-10 flex flex-col pb-8 md:pb-0 justify-end md:justify-center inset-x-4 md:inset-x-36">
			<h1 class="mb-8 md:mb-16 text-3xl md:text-6xl font-medium uppercase w-full text-left md:text-center">
				Precision Planned.<br />Meticulously Delivered.
			</h1>

			<div class="grid grid-cols-1 md:flex flex-wrap justify-start md:justify-center gap-6 w-full">
				<a
					href={route.portofolio}
					class="inline-flex items-center gap-3 bg-[#e0b126] w-full md:w-auto px-6 py-4 text-sm tracking-[0.01em] text-[#111] no-underline"
				>
					See Our Work <span>↗</span>
				</a>
				<a
					href={route.contact}
					class="inline-flex items-center gap-3 bg-white/4 md:w-auto px-6 py-4 text-sm tracking-[0.01em] text-white no-underline ring-1 ring-inset ring-white/65"
				>
					Get In Touch <span>↗</span>
				</a>
			</div>
		</div>
	</section>

	<section
		class="relative grid w-full grid-cols-1 md:grid-cols-2 bg-[#f3f3f3]"
	>
		<div class="absolute inset-0">
			<img src="/mask-2.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div class="hidden md:block absolute bottom-0 inset-x-0">
			<img src="/mask-3.webp" alt="" class="mx-auto w-3/4 h-full object-cover object-center" />
		</div>
		<div class="sticky top-0 self-start z-10 pl-4 md:pl-36 pr-4 md:pr-16 pt-8 md:pt-32 pb-8 md:pb-20 w-full">
			<div class="mb-1 text-xs tracking-[0.17em] text-[#d4a321]">ABOUT US</div>
			<h2 class="text-white mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence<br />Across Indonesia
			</h2>
			<p class="mb-5 text-white">
				PT Precious Contractor Indonesia is a general contractor providing end-to-end services, from design to construction. We specialize in delivering high-quality projects across buildings, warehouses, factories, hospitals, and hotels.
			</p>
			<p class="mb-5 text-white">
				Supported by experienced engineers and trusted partners, we bring deep expertise in the Indonesian construction industry. We are committed to timely delivery, strong execution, and continuous growth—expanding our capabilities to serve both government and private sectors, from structural works to large-scale construction and infrastructure projects.
			</p>
			<a href={route.about} class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>

		<div class="hidden relative z-10 w-full pl-20 py-20 h-full md:flex flex-col gap-4">
			<div
				class="grid grid-cols-3 gap-4 w-full"
				style="height: calc(50% - 0.5rem)"
			>
				<div class="w-full h-64 relative">
					<img src="/home-image-3.webp" alt="" class="object-cover object-center h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
				<div class="w-full h-64 relative col-span-2">
					<img src="/home-image-4.webp" alt="" class="object-cover object-center h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
				<div class="w-full h-94 relative col-span-3">
					<img src="/home-image-5.webp" alt="" class="object-cover object-[75%_25%] h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
				<div class="w-full h-64 relative col-span-2">
					<img src="/home-image-3.webp" alt="" class="object-cover object-center h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
				<div class="w-full h-64 relative">
					<img src="/home-image-4.webp" alt="" class="object-cover object-center h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
			</div>
		</div>
	</section>

	<section class="relative mx-auto w-full" style="height: {height ? (width >= 768 ? `${height * 0.93}px` : 'auto') : (width >= 768 ? '93vh' : 'auto')}">
		<div class="hidden md:block h-full py-20">
			<div
				class="h-full relative"
				style="width: calc(50% + 5rem)"
			>
				<img src="/home-image-6.webp" alt="" class="object-cover object-center h-full w-full" />
				<div class="overlay-1 absolute inset-0"></div>
				<div class="absolute inset-y-0 left-34 overflow-hidden">
					<img src="/mask-4.webp" alt="" class="h-full w-auto" />
				</div>
			</div>
		</div>
		<div class="block md:absolute h-full right-0 top-0 w-full md:w-1/2 py-0 md:py-20">
			<div class="h-full w-full py-0 md:py-12">
				<div
					class="w-full h-full bg-[#060606] px-4 md:px-12 py-8 md:py-12 text-white"
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
					<a href={route.expertise} class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
				</div>
			</div>
		</div>
	</section>

	<section
		id="portfolio"
		class="relative mx-auto w-full"
		style="height: {height ? (width >= 768 ? `${height * 1.02}px` : 'auto') : (width >= 768 ? '102vh' : 'auto')}"
	>
		<div
			class="hidden md:block w-full relative"
			style="height: 76%"
		>
			<img src="/home-image-7.webp" alt="" class="object-cover object-center h-full w-full" />
			<div class="overlay-2 absolute inset-0"></div>
		</div>
		<div
			class="hidden md:flex items-center justify-end gap-4.5 text-sm text-white mt-8 w-full px-36"
		>
			<button
				aria-label="Previous"
				class="cursor-pointer border-0 bg-transparent text-[1.125rem] text-white"
			>
				←
			</button>
			<span>1 of 3</span>
			<button
				aria-label="Next"
				class="cursor-pointer border-0 bg-transparent text-[1.125rem] text-white"
			>
				→
			</button>
		</div>

		<div
			class="block md:absolute px-4 md:px-16 py-8 md:py-16 left-36 bg-[#060606] text-white w-full md:w-[45%] bottom-24"
		>
			<div class="mb-1 text-xs text-[#d4a321]">PORTOFOLIO</div>
			<h3 class="mb-4 text-4xl font-medium">
				Building Excellence Across Indonesia
			</h3>
			<a href={route.portofolio} class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
		</div>
	</section>

	<Reach />
</div>

<style>
	.overlay-1 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.4) 34.66%, rgba(0, 0, 0, 0) 82.22%);
	}
	.overlay-2 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.1) 34.66%, rgba(0, 0, 0, 0) 82.22%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
	}
</style>
