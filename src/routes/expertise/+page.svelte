<script lang="ts">
	import { onMount } from "svelte";
	import { route } from "$lib";

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

  let projects = $state([
    {
      image: "/project-list-1.webp",
      title: "Tepi Hutan Villas",
      description: "Pejeng, Bali"
    },
    {
      image: "/project-list-2.webp",
      title: "Villa Baloo",
      description: "Bali"
    },
    {
      image: "/project-list-3.webp",
      title: "The Long House",
      description: "Bali"
    }
  ]);
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
<div class="w-screen overflow-x-hidden">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100vh'}"
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

		<div class="absolute bottom-8 md:bottom-44 z-10 inset-x-4 md:inset-x-36">
      <div class="mb-1 md:mb-0 text-xs font-medium text-[#d4a321]">
        EXPERTISE
      </div>
			<h1 class="text-3xl md:text-6xl font-medium capitalize">
				Expertise in Construction<br />Engineering, and Building Systems
			</h1>
		</div>
	</section>

  <section class="w-full px-4 md:px-36 py-12 md:py-20 bg-[#131313]">
    <div class="mb-12 md:mb-32 flex items-center w-full justify-center gap-4 flex-col text-white">
      <div class="font-medium text-4xl">
        Our Expertise
      </div>
      <div class="text-base font-light w-full text-center">
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

  <section class="w-full px-4 md:px-36 py-8 md:py-12 mb-0 md:mb-20">
    <div class="mb-6 md:mb-10 flex items-center w-full justify-between gap-4 flex-col md:flex-row">
      <div class="font-medium text-4xl">
        Selected Works
      </div>
      <div class="text-base font-light text-left md:text-right w-full md:w-2/5">
        A curated selection of our built and conceptual projects, spanning architecture, interiors, and landscape.
      </div>
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden">
      {#each projects as p (p.image)}
        <a href={route.portofolio + '/12345678'} class="w-full">
          <div class="w-full h-72 relative mb-4">
            <img src={p.image} alt="" class="object-cover object-center h-full w-full" />
            <div class="overlay-1 absolute inset-0"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-medium">
                {p.title}
              </div>
              <div class="text-sm text-[#828382]">
                {p.description}
              </div>
            </div>
            <span class="inline-flex text-lg text-[#111] no-underline">↗</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

	<Reach />
</div>

<style>
	.overlay-1 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);
	}
</style>
