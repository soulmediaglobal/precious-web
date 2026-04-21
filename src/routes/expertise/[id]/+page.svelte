<script lang="ts">
	import { onMount } from "svelte";
	import { route, portofolio } from "$lib";

	import Reach from "$lib/components/Reach.svelte";

  let { data } = $props();

  let expertise = $derived(data.expertise);

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
	<title>Precious Contractor - {expertise.title}</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip text-[#161616] bg-secondary">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img 
				src={expertise.image} 
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
      <a href={route.expertise} class="mb-6 md:mb-16 flex items-center gap-2 text-xs font-medium uppercase">
        <img src="/arrow.svg" alt="" />
        Back
      </a>
			<div class="font-medium mb-2 text-3xl md:text-6xl w-1/2">
        {expertise.title}
      </div>
			<div class="capitalize w-full md:w-4/5 heading-light">
				{expertise.description}
			</div>
		</div>
	</section>

  <section class="w-full px-4 md:px-36 py-8 md:py-16 relative">
    <div class="absolute inset-0">
			<img src="/mask-2.webp" alt="" class="w-full h-full object-cover object-center" />
		</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-14 mb-20 z-10 relative">
      <div>
        <div class="text-white font-medium text-4xl mb-4">
          Why Precious Contractor
        </div>
        <div class="heading-light text-right">
          {expertise.why}
        </div>
      </div>
      <img src={expertise.image} alt="" class="w-full object-cover object-center h-104" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-14 z-10 relative">
      <img src={expertise.image} alt="" class="w-full object-cover object-center h-104" />
      <div>
        <div class="text-white font-medium text-4xl mb-4">
          How We Do This
        </div>
        <div class="heading-light">
          {expertise.how}
        </div>
      </div>
    </div>
  </section>

  <section class="w-full px-4 md:px-36 py-8 md:py-14">
    <div class="mb-6 md:mb-10 flex items-center w-full justify-between gap-4 flex-col md:flex-row">
      <div class="font-medium text-4xl text-white">
        Related Works
      </div>
      <div class="text-left md:text-right w-full md:w-2/5 paragraph-light">
        A curated selection of our built and conceptual projects, spanning architecture, interiors, and landscape.
      </div>
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden mb-17">
      {#each portofolio.filter(p => expertise.portofolio.includes(p.slug)) as p (p.slug)}
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
