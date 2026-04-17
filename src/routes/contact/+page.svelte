<script lang="ts">
	import { onMount } from "svelte";

	import Reach from "$lib/components/Reach.svelte";

	let height = $state(0);
	let scrollY = $state(0);
	let address = $state([
		{
			title: "Jakarta",
			address: "Jl. Mega Kuningan Barat III No.Lot 10 Tower B, 22nd floor, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950"
		},
		{
			title: "Yogyakarta",
			address: "Jl. Seturan Raya No.19, Kledokan, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281"
		},
		{
			title: "Bali",
			address: "Park23 Creative Hub, Jl. Kediri 3rd Floor, Tuban, Kuta, Badung Regency, Bali 80361"
		}
	]);

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
		class="relative w-full overflow-hidden mb-0 md:mb-12 bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img 
				src="/contact-us-1.webp" 
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
        CONTACT
      </div>
			<h1 class="text-3xl md:text-6xl font-medium capitalize">
				Let’s Build Something Together
			</h1>
		</div>
	</section>

	<Reach expand />
	<div class="mt-4 md:mt-12 bg-[#191A19] px-4 md:px-36 py-8 md:py-14 text-white grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
		{#each address as a (a.title)}
			<div class="text-[#CFCFCF]">
				<div class="font-semibold mb-4">{a.title}</div>
				<div class="paragraph-light">{a.address}</div>
			</div>
		{/each}
	</div>
</div>
