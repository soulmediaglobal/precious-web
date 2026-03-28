<script lang="ts">
	import { onMount } from "svelte";

	let height = $state(0);
	let width = $state(0);

	const checkSize = () => {
		height = window.innerHeight;
		width = window.innerWidth;
	}

	onMount(() => {
		document.addEventListener('resize', checkSize);

		return () => {
			document.removeEventListener('resize', checkSize);
		}
	})
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section
  id="contact"
  class="relative mx-auto w-full md:mb-20 mb-0"
  style="height: {height ? (width >= 768 ? `${height * 0.75}px` : 'auto') : (width >= 768 ? '75vh' : 'auto')}"
>
  <div
    class="hidden mb:block h-full w-[72%] relative"
  >
    <img src="/home-image-8.webp" alt="" class="object-cover object-center h-full w-full" />
    <div class="overlay-2 absolute inset-0"></div>
  </div>

  <div
    class="block md:absolute px-4 md:px-16 py-8 md:py-16 right-36 bg-[#060606] text-white w-full md:w-[35%] bottom-1/2"
    style="transform: {width >= 768 ? 'translateY(50%)' : 'none'}"
  >
    <div class="mb-1 text-xs text-[#d4a321]">CONTACT US</div>
    <h3 class="mb-4 text-4xl font-medium">
      Need to Reach Us?
    </h3>
    <a href="/" class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
  </div>
</section>