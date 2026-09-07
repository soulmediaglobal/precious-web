<script lang="ts">
	import { route } from "$lib";

  let { expand = false, form = null, sent = false }: {
    expand?: boolean;
    form?: { values?: { firstName: string; lastName: string; email: string; phone: string; message: string; consentAccepted: boolean }; errors?: Record<string, string>; message?: string } | null;
    sent?: boolean;
  } = $props();

	let componentHeight = $state(0);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section
  id="contact"
  class="relative mx-auto w-full h-auto md:h-160 bg-third"
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
        Tell us about your construction project. Leave your email or phone number so our team can get in touch.
      </p>

      <form method="POST" action="/contact#contact" class="space-y-5 font-light">
        {#if sent}<p role="status">Thank you. Your message has been received.</p>{/if}
        {#if form?.message}<p role="alert" class="text-red-300 text-xs">{form.message}</p>{/if}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label for="firstName" class="text-[10px] mb-1 text-gray-400">First Name</label>
            <input type="text" id="firstName" name="firstName" maxlength="100" required value={form?.values?.firstName ?? ''} aria-invalid={!!form?.errors?.firstName} aria-describedby={form?.errors?.firstName ? 'firstName-error' : undefined} placeholder="" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full px-0" />
            {#if form?.errors?.firstName}<p id="firstName-error" class="text-red-300 text-xs">{form.errors.firstName}</p>{/if}
          </div>
          <div class="flex flex-col">
            <label for="lastName" class="text-[10px] mb-1 text-gray-400">Last name</label>
            <input type="text" id="lastName" name="lastName" maxlength="100" value={form?.values?.lastName ?? ''} aria-invalid={!!form?.errors?.lastName} aria-describedby={form?.errors?.lastName ? 'lastName-error' : undefined} placeholder="" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full px-0" />
            {#if form?.errors?.lastName}<p id="lastName-error" class="text-red-300 text-xs">{form.errors.lastName}</p>{/if}
          </div>
        </div>

        <div class="flex flex-col">
          <label for="email" class="text-[10px] mb-1 text-gray-400">Email</label>
          <input type="email" id="email" name="email" maxlength="254" value={form?.values?.email ?? ''} aria-invalid={!!form?.errors?.email} aria-describedby={form?.errors?.email ? 'email-error' : undefined} placeholder="" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full px-0" />
            {#if form?.errors?.email}<p id="email-error" class="text-red-300 text-xs">{form.errors.email}</p>{/if}
        </div>

        <div class="flex flex-col">
          <label for="phone" class="text-[10px] mb-1 text-gray-400">Phone</label>
          <input type="tel" id="phone" name="phone" maxlength="32" value={form?.values?.phone ?? ''} aria-invalid={!!form?.errors?.phone} aria-describedby={form?.errors?.phone ? 'phone-error' : undefined} placeholder="" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full px-0" />
            {#if form?.errors?.phone}<p id="phone-error" class="text-red-300 text-xs">{form.errors.phone}</p>{/if}
        </div>

        <div class="flex flex-col">
          <label for="message" class="text-[10px] mb-1 text-gray-400">Message</label>
          <textarea id="message" name="message" maxlength="10000" required value={form?.values?.message ?? ''} aria-invalid={!!form?.errors?.message} aria-describedby={form?.errors?.message ? 'message-error' : undefined} placeholder="" rows="1" class="bg-transparent border-0 border-b border-gray-700 pb-1.5 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 resize-none text-sm w-full px-0"></textarea>
            {#if form?.errors?.message}<p id="message-error" class="text-red-300 text-xs">{form.errors.message}</p>{/if}
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <label class="flex items-start gap-3 cursor-pointer text-[10px] text-gray-400 flex-1 leading-tight pr-2">
            <div class="relative flex items-center justify-center mt-0.5">
              <input type="checkbox" name="consentAccepted" checked={form?.values?.consentAccepted ?? false} class="peer appearance-none w-4 h-4 border border-gray-600 bg-transparent shrink-0 focus:outline-none focus:ring-1 focus:ring-white transition-colors cursor-pointer" />
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