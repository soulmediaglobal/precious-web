<script lang="ts">
	import { onMount } from "svelte";
	import { route, portofolio as p_list } from "$lib";

	import Reach from "$lib/components/Reach.svelte";

  let { data } = $props();

  let portofolio = $derived(data.portofolio);

  let projects = $derived.by(() => {
    let filtered = p_list.filter(item => item.category === portofolio.category && item.slug !== portofolio.slug);
    if (filtered.length === 0) {
      const others = p_list.filter(item => item.slug !== portofolio.slug);
      return others.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    return filtered.slice(0, 3);
  });

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
	<title>{portofolio.project_name} - Precious Contractor</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip text-[#161616]">
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img 
				src={portofolio.images[0]}
				alt="" 
				class="absolute -top-[15%] left-0 w-full h-[130%] object-cover object-center" 
				style="transform: translate3d(0, {scrollY * 0.3}px, 0);"
			/>
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>

		<div class="absolute bottom-8 md:bottom-24 z-10 inset-x-4 md:inset-x-36">
      <a href={route.portofolio} class="mb-6 md:mb-16 flex items-center gap-2 text-xs font-medium uppercase">
        <img src="/arrow.svg" alt="" />
        Back
      </a>
      <div class="font-medium mb-6 text-3xl md:text-6xl w-1/2">
        {portofolio.project_name}
      </div>
			<div class="font-light text-base md:text-xl capitalize mb-10 md:mb-40 w-full md:w-4/5">
				{portofolio.short_description}
			</div>
      <div class="grid grid-cols-2 md:flex gap-6 items-center">
        <div class="w-full h-full md:h-auto flex md:block flex-col justify-start md:w-60">
          <div class="font-light text-sm text-[#D9DAD9]">Client</div>
          <div class="text-white">{portofolio.client}</div>
        </div>
        <div class="w-full h-full md:h-auto flex md:block flex-col justify-start md:w-60">
          <div class="font-light text-sm text-[#D9DAD9]">Location</div>
          <div class="text-white">{portofolio.location}</div>
        </div>
        <div class="w-full h-full md:h-auto flex md:block flex-col justify-start md:w-60">
          <div class="font-light text-sm text-[#D9DAD9]">Scope Of Work</div>
          <div class="text-white">{portofolio.category}</div>
        </div>
        <div class="w-full h-full md:h-auto flex md:block flex-col justify-start md:w-60">
          <div class="font-light text-sm text-[#D9DAD9]">Status</div>
          <div class="text-white">{portofolio.status}</div>
        </div>
      </div>
		</div>
	</section>

  <section class="w-full px-4 md:px-36 py-18 md:py-24">
    <div class="w-full flex flex-col md:flex-row items-center gap-4 md:gap-16 mb-8 md:mb-16">
      <div>
        {portofolio.long_description_p1}
      </div>
      <div>
        {portofolio.long_description_p2}
      </div>
    </div>
    <div class="w-full h-80 md:h-152 relative mb-4">
      <img src={portofolio.images[1]} alt="" class="object-cover object-center h-full w-full" />
      <div class="overlay-1 absolute inset-0"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
      <div class="w-full h-80 md:h-110 relative">
        <img src={portofolio.images[2]} alt="" class="object-cover object-center h-full w-full" />
        <div class="overlay-1 absolute inset-0"></div>
      </div>
      <div class="w-full h-80 md:h-110 relative">
        <img src={portofolio.images[3]} alt="" class="object-cover object-center h-full w-full" />
        <div class="overlay-1 absolute inset-0"></div>
      </div>
    </div>
    <div class="flex items-center w-full justify-center">
      <button
        class="inline-flex items-center gap-3 justify-center border border-[#111] px-4 py-2 text-sm text-[#111] no-underline"
      >
        LOAD MORE
      </button>
    </div>
  </section>

  <section class="bg-[#FAF5F1] w-full px-4 md:px-36 py-8 md:py-12 mb-0 md:mb-20">
    <div class="font-medium text-4xl mb-8 md:mb-12">
      Related Works
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-y-12 overflow-hidden">
      {#each projects as p (p.slug)}
        <a href="{route.portofolio}/{p.slug}" class="w-full">
          <div class="w-full h-72 relative mb-4">
            <img src={p.images[0]} alt="" class="object-cover object-center h-full w-full" />
            <div class="overlay-1 absolute inset-0"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-medium">
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
  </section>
	
  <Reach />
</div>

<style>
	.overlay-1 {
		background: linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);
	}
</style>
