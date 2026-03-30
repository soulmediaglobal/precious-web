<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer
  class="mx-auto grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 md:gap-10 lg:gap-10 bg-[#060606] px-4 md:px-36 py-8 md:py-12 text-white/80"
>
  <div class="flex justify-start items-start">
    <img src="/logo-white.svg" alt="" class="h-16 lg:h-auto max-w-max" />
  </div>

  <div class="flex flex-col gap-3 text-sm">
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Home</a>
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">About Us</a>
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Expertise</a>
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Contact</a>
  </div>

  <div class="flex flex-col gap-3 text-sm">
    <a href="mailto:hello@precious.com" class="text-inherit no-underline transition-colors hover:text-white">hello@precious.com</a>
    <a href="tel:+620000000000" class="text-inherit no-underline transition-colors hover:text-white">+62 70 7687 891</a>
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Instagram</a>
    <a href="/" class="text-inherit no-underline transition-colors hover:text-white">LinkedIn</a>
  </div>

  <form class="flex flex-col justify-start gap-4">
    <label for="email" class="text-sm text-white/70">Enter your e-mail</label>
    <div class="flex items-center border-b border-white/35 pb-2.5">
      <input
        id="email"
        type="email"
        class="flex-1 w-full border-0 bg-transparent text-[0.875rem] text-white outline-none"
      />
      <button
        type="submit"
        class="cursor-pointer border-0 bg-transparent text-[1.25rem] text-white transition-transform hover:scale-110"
      >
        ↗
      </button>
    </div>
  </form>

  <div
    class="col-span-1 md:col-span-2 lg:col-span-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-6 lg:gap-6 border-t border-white/10 pt-6 mt-2 lg:mt-0 text-sm text-white/60"
  >
    <div class="text-white/60 order-2 md:order-1 text-center md:text-left">© 2025 Precious</div>
    <div class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 order-1 md:order-2">
      <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Cookies Policy</a>
      <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Legal Terms</a>
      <a href="/" class="text-inherit no-underline transition-colors hover:text-white">Privacy Policy</a>
    </div>
  </div>
</footer>