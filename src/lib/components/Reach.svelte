<script lang="ts">
	import { browser } from "$app/environment";

	let height = $state(0);

	$effect(() => {
		if (browser) {
			height = window.innerHeight;
		}
	})
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section
  id="contact"
  class="relative mx-auto w-full mb-20"
  style="height: {height ? `${height * 0.75}px` : '75vh'}"
>
  <div
    class="h-full w-[72%] relative"
  >
    <img src="/home-image-8.webp" alt="" class="object-cover object-center h-full w-full" />
    <div class="overlay-2 absolute inset-0"></div>
  </div>

  <div
    class="absolute right-36 bg-[#060606] p-16 text-white w-[35%] bottom-1/2"
    style="transform: translateY(50%)"
  >
    <div class="mb-1 text-xs text-[#d4a321]">CONTACT US</div>
    <h3 class="mb-4 text-4xl font-medium">
      Need to Reach Us?
    </h3>
    <a href="/" class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
  </div>
</section>