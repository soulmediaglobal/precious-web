<script lang="ts">
	import { route } from "$lib";

  let { expand = false } = $props();

	let componentHeight = $state(0);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section
  id="contact"
  class="relative mx-auto w-full h-40 md:h-160"
>
  <div
    class="hidden md:block h-full w-[72%] relative"
  >
    <img src="/home-image-8.webp" alt="" class="object-cover object-center h-full w-full" />
    <div class="overlay-2 absolute inset-0"></div>
    <div class="absolute inset-y-0 left-56 overflow-hidden">
      <img src="/mask-5.webp" alt="" class="h-full w-auto" />
    </div>
  </div>

  {#if !expand}
    <div
      class="block md:absolute px-4 md:px-16 py-8 md:py-16 right-36 bg-[#060606] text-white w-full md:w-[35%]"
      bind:clientHeight={componentHeight}
      style="top: calc(50% - {componentHeight / 2}px)"
    >
      <div class="mb-1 text-xs text-[#d4a321]">CONTACT US</div>
      <h3 class="mb-4 text-4xl font-medium">
        Need to Reach Us?
      </h3>
      <a href={route.contact} class="inline-flex text-[1.375rem] text-white no-underline">↗</a>
    </div>
  {:else}
    <div
      class="block md:absolute px-4 md:px-10 py-10 md:py-12 right-0 bg-[#050505] text-white w-full md:w-[40%]"
      bind:clientHeight={componentHeight}
      style="top: calc(50% - {componentHeight / 2}px)"
    >
      <div class="mb-2 text-[10px] text-[#e4761b] tracking-widest uppercase font-medium">CONTACT</div>
      <h3 class="mb-4 text-3xl font-medium tracking-wide">
        Get in Touch
      </h3>
      <p class="text-gray-400 mb-8 text-xs leading-relaxed max-w-[90%] font-light">
        Horseback riding along Ratenggaro Beach and exploration of its iconic megalithic village. Swim in the crystal-clear Waekuri
      </p>

      <form class="space-y-5 font-light">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label for="firstName" class="text-[10px] mb-1 text-gray-400">First Name</label>
            <input type="text" id="firstName" placeholder="Makenna" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full" />
          </div>
          <div class="flex flex-col">
            <label for="lastName" class="text-[10px] mb-1 text-gray-400">Last name</label>
            <input type="text" id="lastName" placeholder="Baptista" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full" />
          </div>
        </div>

        <div class="flex flex-col">
          <label for="email" class="text-[10px] mb-1 text-gray-400">Email</label>
          <input type="email" id="email" placeholder="makenna.baptista@mail.com" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full" />
        </div>

        <div class="flex flex-col">
          <label for="phone" class="text-[10px] mb-1 text-gray-400">Phone</label>
          <input type="tel" id="phone" placeholder="Makenna Baptista" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full" />
        </div>

        <div class="flex flex-col">
          <label for="message" class="text-[10px] mb-1 text-gray-400">Message</label>
          <textarea id="message" placeholder="Makenna Baptista" rows="1" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 resize-none text-sm w-full"></textarea>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <label class="flex items-start gap-3 cursor-pointer text-[10px] text-gray-400 flex-1 leading-tight pr-2">
            <div class="relative flex items-center justify-center mt-0.5">
              <input type="checkbox" class="peer appearance-none w-4 h-4 border border-gray-600 bg-transparent shrink-0 focus:outline-none focus:ring-1 focus:ring-white transition-colors cursor-pointer" />
              <svg class="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span>I agree to the Terms and Conditions and consent to receive newsletters. I understand I can unsubscribe at any time.</span>
          </label>
          <button type="submit" class="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white px-5 py-2.5 flex items-center gap-2 transition-colors text-[11px] tracking-wide shrink-0">
            Send Message
            <span class="text-sm leading-none">↗</span>
          </button>
        </div>
      </form>
    </div>
  {/if}
</section>