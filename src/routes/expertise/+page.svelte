<script lang="ts">
	import { onMount } from "svelte";
	import { route, portofolio } from "$lib";

	import Reach from "$lib/components/Reach.svelte";

  let expertises = $state([
    {
      image: "/expertise-1.webp",
      title: "Exhibition",
      description: "1"
    },
    {
      image: "/expertise-2.webp",
      title: "Interior",
      description: "2"
    },
    {
      image: "/expertise-3.webp",
      title: "MEP & Structural Works",
      description: "3"
    },
    {
      image: "/expertise-4.webp",
      title: "FRP & Structural Repair",
      description: "4"
    },
    {
      image: "/expertise-3.webp",
      title: "Structure Strengthening",
      description: "5"
    },
    {
      image: "/expertise-4.webp",
      title: "Jacketing",
      description: "6"
    }
  ])

	let height = $state(0);
	let scrollY = $state(0);

	const checkSize = () => {
		height = window.innerHeight;
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
	<title>Precious Contractor - Expertise</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip text-[#161616] bg-secondary">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img 
				src="/expertise-cover.webp" 
				alt="" 
				class="absolute -top-[15%] left-0 w-full h-[130%] object-cover object-center" 
				style="transform: translate3d(0, {scrollY * 0.3}px, 0);"
			/>
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>
    <div class="hidden absolute right-0 top-0 z-0 pointer-events-none md:flex items-center justify-end">
			<img src="/mask-6.webp" alt="" class="w-2/5 h-full object-cover object-center -scale-y-100" />
		</div>

		<div class="absolute bottom-8 md:bottom-44 z-10 inset-x-4 md:inset-x-36">
      <div class="mb-1 md:mb-0 text-xs font-medium text-[#d4a321]">
        EXPERTISE
      </div>
			<h1 class="text-3xl md:text-6xl font-medium capitalize">
				Expertise in Construction<br />Engineering, and Building Systems
			</h1>
		</div>
	</section>

  <section class="w-full px-4 md:px-36 py-12 md:py-20 relative">
    <div class="absolute inset-0">
			<img src="/mask-2.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
    <div class="relative z-10 mb-12 md:mb-32 flex items-center w-full justify-center gap-4 flex-col">
      <div class="font-medium text-4xl text-[#D9DAD9]">
        Our Expertise
      </div>
      <div class="text-base font-light w-full text-center text-[#CFCFCF]">
        We are a collective of designers, strategists, and hospitality professionals dedicated to shaping meaningful spaces and over two decades of experiences. Blending expertise in architecture, operations, commercial strategy, and wellness curation, we deliver high-impact projects grounded in authenticity and built for lasting value.
      </div>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
      {#each expertises as e (e.description)}
        <div class="w-full h-60 md:h-100 relative">
          <div class="w-full h-full">
            <img src={e.image} alt="" class="object-cover object-center h-full w-full" />
            <div class="overlay-1 absolute inset-0"></div>
          </div>
          <div class="absolute bottom-8 left-8 text-lg font-medium text-white">
            {e.title}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="w-full px-4 md:px-36 py-8 md:py-14">
    <div class="mb-6 md:mb-10 flex items-center w-full justify-between gap-4 flex-col md:flex-row">
      <div class="font-medium text-4xl text-white">
        Selected Works
      </div>
      <div class="text-base font-light text-left md:text-right w-full md:w-2/5 text-[#CFCFCF]">
        A curated selection of our built and conceptual projects, spanning architecture, interiors, and landscape.
      </div>
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden mb-17">
      {#each portofolio.filter((_, i) => i < 3) as p (p.slug)}
        <a href={route.portofolio + '/' + p.slug} class="w-full">
          <div class="w-full h-72 relative mb-4">
            <img src={p.images[0]} alt="" class="object-cover object-center h-full w-full" />
            <div class="overlay-1 absolute inset-0"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-medium text-white">
                {p.project_name}
              </div>
              <div class="text-sm text-[#828382]">
                {p.location}
              </div>
            </div>
            <span class="inline-flex text-lg text-[#111] no-underline">↗</span>
          </div>
        </a>
      {/each}
    </div>
    <div class="w-full flex items-center justify-center">
      <a
				href={route.portofolio}
				class="mt-8 inline-flex items-center gap-3 justify-center border border-[#828382] px-6 py-3 text-white no-underline transition-colors hover:bg-white hover:text-black hover:border-white"
			>
				View All
			</a>
    </div>
  </section>

	<Reach />
</div>

<style>
	.overlay-1 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);
	}
</style>
