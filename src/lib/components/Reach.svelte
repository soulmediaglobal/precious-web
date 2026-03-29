<script lang="ts">
	let componentHeight = $state(0);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section
  id="contact"
  class="relative mx-auto w-full md:mb-20 mb-10 h-40 md:h-160"
>
  <div
    class="hidden md:block h-full w-[72%] relative"
  >
    <img src="/home-image-8.webp" alt="" class="object-cover object-center h-full w-full" />
    <div class="overlay-2 absolute inset-0"></div>
  </div>

  <div
    class="block md:absolute px-4 md:px-16 py-8 md:py-16 right-36 bg-[#060606] text-white w-full md:w-[35%]"
    bind:clientHeight={componentHeight}
    style="top: calc(50% - {componentHeight / 2}px)"
  >
    <div class="mb-1 text-xs text-[#d4a321]">CONTACT US</div>
    <h3 class="mb-4 text-4xl font-medium">
      Need to Reach Us?
    </h3>
    <a href="/" class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
  </div>
</section>