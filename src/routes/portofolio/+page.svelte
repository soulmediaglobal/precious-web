<script lang="ts">
	import { browser } from "$app/environment";
	import { route } from "$lib";

	import Reach from "$lib/components/Reach.svelte";

	let height = $state(0);
  let projects = $state([
    {
      image: "/about-1.webp",
      title: "Tepi Hutan Villas",
      description: "Pejeng, Bali"
    },
    {
      image: "/about-2.webp",
      title: "Villa Baloo",
      description: "Bali"
    },
    {
      image: "/about-3.webp",
      title: "The Long House",
      description: "Bali"
    },
    {
      image: "/about-4.webp",
      title: "Villa Melati",
      description: "Bali"
    },
    {
      image: "/about-5.webp",
      title: "Villa Melati",
      description: "Bali"
    },
    {
      image: "/about-6.webp",
      title: "Villa Melati",
      description: "Bali"
    },
    {
      image: "/about-7.webp",
      title: "Villa Melati",
      description: "Bali"
    },
    {
      image: "/about-8.webp",
      title: "Villa Melati",
      description: "Bali"
    },
    {
      image: "/about-9.webp",
      title: "Villa Melati",
      description: "Bali"
    }
  ]);

	$effect(() => {
		if (browser) {
			height = window.innerHeight;
		}
	})
</script>

<svelte:head>
	<title>Precious Contractor - Projects</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-screen overflow-x-hidden">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100vh'}"
	>
		<div class="absolute inset-0">
			<img src="/about-10.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>

		<div class="absolute bottom-8 md:bottom-44 z-10 inset-x-4 md:inset-x-36">
      <div class="mb-1 md:mb-0 text-xs font-medium text-[#d4a321]">
        PORTOFOLIO
      </div>
			<h1 class="text-3xl md:text-6xl font-medium capitalize">
				A selection of projects<br />we’ve successfully delivered.
			</h1>
		</div>
	</section>

	<section
		class="relative w-full px-4 md:px-36 pb-8 md:pb-14"
	>
    <div class="flex gap-4 md:gap-0 flex-col md:flex-row items-center justify-between pt-4 md:pt-12 pb-8 md:pb-10">
      <div class="text-4xl font-medium text-left w-full">
        Selected Works
      </div>
      <div class="text-base font-light text-left md:text-right w-full md:w-2/5">
        A curated selection of our built and conceptual projects, spanning architecture, interiors, and landscape.
      </div>
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden mb-8 md:mb-24">
      {#each projects as p (p.image)}
        <a href={route.portfolio + '/12345678'} class="w-full">
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
