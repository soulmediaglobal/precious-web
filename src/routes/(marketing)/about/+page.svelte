<script lang="ts">
	import { onMount } from "svelte";
	import { route } from "$lib";

	import Reach from "$lib/components/Reach.svelte";

	let { data } = $props();
	let teams = $derived(data.teams);

	let height = $state(0);
	let width = $state(0);
	let scrollY = $state(0);

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

<svelte:window bind:scrollY />

<svelte:head>
	<title>Precious Contractor - About Us</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip text-[#161616] bg-secondary">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img 
				src="/about-1.webp" 
				alt="" 
				class="absolute -top-[15%] left-0 w-full h-[130%] object-cover object-center" 
				style="transform: translate3d(0, {scrollY * 0.3}px, 0);"
			/>
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>
		<div class="hidden absolute left-0 bottom-0 z-0 pointer-events-none md:flex items-center justify-start">
			<img src="/mask-6.webp" alt="" class="w-2/5 h-full object-cover object-center -scale-x-100" />
		</div>

		<div class="absolute bottom-8 md:bottom-44 z-10 inset-x-4 md:inset-x-36">
      <div class="mb-1 md:mb-0 text-xs font-medium text-[#d4a321]">
        ABOUT US
      </div>
			<h1 class="text-3xl md:text-6xl font-medium capitalize">
				Commited To Building<br />Excellence
			</h1>
		</div>
	</section>

  <section
		class="relative grid w-full grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#f3f3f3]"
	>
		<div class="absolute inset-0">
			<img src="/mask-2.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div class="hidden md:absolute inset-0" style="background: linear-gradient(270deg, rgba(255, 255, 255, 85%) 41.16%, #FFFFFF 86.3%);"></div>
		<div class="text-white relative z-10 pl-4 md:pl-36 pr-4 md:pr-16 pt-8 md:pt-32 pb-8 md:pb-20 w-full">
			<div class="mb-1 text-xs tracking-[0.17em] text-[#d4a321]">ABOUT US</div>
			<h2 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
				Building Excellence<br />Across Indonesia
			</h2>
			<p class="mb-5 paragraph">
				We are driven by a strong commitment to building with quality, precision, and attention to detail. Every project reflects our dedication to craftsmanship and our consistent pursuit of high construction standards.
			</p>
			<p class="mb-5 paragraph">
				With experienced teams and trusted partners, we deliver projects that are not only functional but also thoughtfully executed. We believe that successful construction goes beyond the final result—it is built on clear communication, reliability, and long-term relationships with our clients.
			</p>
      <p class="mb-5 paragraph">
				We handle projects across residential, commercial, and hospitality sectors, including hotels, villas, and resorts. From concept to completion, we ensure every stage is managed with care, balancing design intent, technical requirements, and project efficiency.
			</p>
      <p class="mb-16 paragraph">
				Whether in urban environments or remote locations, we maintain the same level of quality and service—delivering results that meet expectations and stand the test of time.
			</p>
			<a href={route.contact} class="hidden md:inline-flex items-center gap-3 justify-center px-6 py-3 text-sm no-underline transition-colors border border-[#2B2C2B]">Get In Touch</a>
		</div>

		<div class="hidden relative z-10 w-full pl-20 py-20 h-full md:flex flex-col gap-4">
			<div
				class="grid grid-cols-2 gap-4 w-full"
				style="height: calc(50% - 0.5rem)"
			>
				<div class="w-full h-88 relative col-span-2">
					<img src="/about-2.webp" alt="" class="object-cover object-center h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
				<div class="w-full h-88 relative">
					<img src="/about-3.webp" alt="" class="object-cover object-bottom-left h-full w-full" />
					<div class="overlay-1 absolute inset-0"></div>
				</div>
        <div class="w-full h-88 relative">
          <img src="/about-4.webp" alt="" class="object-cover object-[75%_25%] h-full w-full" />
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
					<div class="mb-4.5 text-xs tracking-[0.17em] text-[#d4a321]">OUR MISSION</div>
					<h3 class="mb-5 text-[clamp(2rem,3vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.03em]">
						Our Commitment<br />to Excellence
					</h3>
					<p class="mb-5 max-w-125 paragraph">
						To provide dependable construction solutions with a focus on quality, efficiency, and precision—ensuring every project is delivered on time, on plan, and to the highest standards.
					</p>
					<a href={route.expertise} class="mt-2 inline-flex text-[1.375rem] text-white no-underline">↗</a>
				</div>
			</div>
		</div>
	</section>

	<section
		class="relative w-full px-4 md:px-36 pt-10 md:pt-20 bg-[#131313] text-white mb-0 md:mb-17"
	>
    <div class="flex gap-4 md:gap-0 flex-col md:flex-row items-center justify-between pt-4 md:pt-12 pb-8 md:pb-10">
      <div class="text-4xl font-medium text-left w-full">
        Meet our team
      </div>
      <div class="text-base font-light text-left md:text-right w-full md:w-full paragraph">
        Strong execution, and continuous growth—expanding our capabilities to serve both government and private sectors, from structural.
      </div>
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden mb-8 md:mb-24">
      {#each teams as p (p.image)}
        <div class="w-full">
          <div class="w-full h-72 relative mb-4">
            <img src={p.image} alt="" class="object-cover object-center h-full w-full" />
            <div class="overlay-1 absolute inset-0"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-medium">
                {p.name}
              </div>
              <div class="text-sm text-[#828382]">
                {p.title}
              </div>
            </div>
            <span class="inline-flex text-lg text-[#111] no-underline">↗</span>
          </div>
        </div>
      {/each}
    </div>
    <div class="flex items-center w-full justify-center">
      <button
        class="inline-flex items-center gap-3 justify-center border border-[#111] px-4 py-2 text-sm text-[#111] no-underline"
      >
        LOAD MORE
      </button>
    </div>
	</section>

	<Reach />
</div>

<style>
	.overlay-1 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);
	}
</style>
