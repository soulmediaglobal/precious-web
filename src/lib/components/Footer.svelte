<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer
  class="mx-auto grid w-full grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 bg-[#060606] px-14 pt-13 pb-6.5 text-white/80 max-[68.75rem]:grid-cols-2 max-[68.75rem]:px-7 max-[45rem]:grid-cols-1"
>
  <img src="/logo-white.svg" alt="" />

  <div class="flex flex-col gap-3 text-sm">
    <a href="/" class="text-inherit no-underline">Home</a>
    <a href="/" class="text-inherit no-underline">About Us</a>
    <a href="/" class="text-inherit no-underline">Expertise</a>
    <a href="/" class="text-inherit no-underline">Contact</a>
  </div>

  <div class="flex flex-col gap-3 text-sm">
    <a href="mailto:hello@precious.com" class="text-inherit no-underline">hello@precious.com</a>
    <a href="tel:+620000000000" class="text-inherit no-underline">+62 70 7687 891</a>
    <a href="/" class="text-inherit no-underline">Instagram</a>
    <a href="/" class="text-inherit no-underline">LinkedIn</a>
  </div>

  <form class="flex flex-col justify-start gap-4.5">
    <label for="email" class="text-sm text-white/70">Enter your e-mail</label>
    <div class="flex items-center border-b border-white/35 pb-2.5">
      <input
        id="email"
        type="email"
        class="flex-1 border-0 bg-transparent text-[0.875rem] text-white outline-none"
      />
      <button
        type="submit"
        class="cursor-pointer border-0 bg-transparent text-[1.25rem] text-white"
      >
        ↗
      </button>
    </div>
  </form>

  <div
    class="col-span-full flex justify-between gap-6 border-t border-white/10 pt-4.5 text-sm text-white/60"
  >
    <div class="text-white/60">© 2025 Precious</div>
    <div class="flex justify-end gap-6">
      <a href="/" class="text-inherit no-underline">Cookies Policy</a>
      <a href="/" class="text-inherit no-underline">Legal Terms</a>
      <a href="/" class="text-inherit no-underline">Privacy Policy</a>
    </div>
  </div>
</footer>