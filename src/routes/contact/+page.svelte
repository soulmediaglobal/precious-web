<script lang="ts">
	import { onMount } from "svelte";

	import Reach from "$lib/components/Reach.svelte";

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
	<title>Precious Contractor - Expertise</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-screen overflow-x-hidden">
	<section
		class="relative w-full overflow-hidden mb-12 bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100vh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img src="/contact.webp" alt="" class="object-cover object-center" style="width: {width ? `${width}px` : '100vw'}; height: {height ? `${height}px` : '100vh'};" />
		</div>
		<div style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);" class="absolute inset-0"></div>

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
</div>
