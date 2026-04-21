<script>
  import { page } from '$app/state';
	import { route, preciousemail, preciousPhone } from '$lib';

  let routes = [
    { name: 'Home', href: route.root },
    { name: 'About Us', href: route.about },
    { name: 'Expertise', href: route.expertise },
    { name: 'Contact', href: route.contact }
  ];
  let socmed = [
    { name: 'LinkedIn', icon: '/icons/linkedin.svg', href: 'https://www.linkedin.com/company/precious-contractor' },
    { name: 'Facebook', icon: '/icons/facebook.svg', href: 'https://www.facebook.com/p/Precious-Contractor-Indonesia-61558311793708/' },
    { name: 'Instagram', icon: '/icons/instagram.svg', href: 'https://www.instagram.com/preciouscontractor.official?igsh=MTRyM3Vrbm1nN21tZQ==' },
  ];
</script>
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer
  class="mx-auto grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 md:gap-10 lg:gap-10 bg-[#060606] px-4 md:px-36 py-8 md:py-12 text-[#AEAEAE]"
>
  <div class="flex justify-start items-start">
    <img src="/logo-white.svg" alt="" class="h-16 lg:h-auto max-w-max" />
  </div>

  <div class="flex flex-col gap-3 text-sm">
    {#each routes as r (r.name)}
      <a
        href={r.href}
        class="text-inherit no-underline transition-colors hover:text-white"
        class:text-white={page.url.pathname === r.href}
      >
        {r.name}
      </a>
    {/each}
  </div>

  <div class="flex flex-col gap-3 text-sm">
    <a href="mailto:{preciousemail}" class="text-inherit no-underline transition-colors hover:text-white">{preciousemail}</a>
    <a href="tel:{preciousPhone}" class="text-inherit no-underline transition-colors hover:text-white">+62 8111 000 47</a>
    <div class="opacity-0">A</div>
    <div class="flex items-center gap-3">
      {#each socmed as s (s.name)}
        <a href={s.href} target="_blank"><img src={s.icon} alt={s.name} class="h-6" /></a>
      {/each}
    </div>
  </div>

  <form class="flex flex-col justify-start gap-4">
    <div class="flex items-center relative">
      <input
        id="email"
        type="email"
        placeholder="Enter your e-mail"
        class="bg-transparent border-0 border-b border-gray-700 focus:outline-none focus:ring-0 focus:border-white transition-colors text-white placeholder-gray-600 text-sm w-full px-0 pb-4"
      />
      <button
        type="submit"
        class="absolute right-0 cursor-pointer border-0 bg-transparent text-[1.25rem] text-white transition-transform hover:scale-110 bottom-3"
      >
        ↗
      </button>
    </div>
  </form>

  <div
    class="col-span-1 md:col-span-2 lg:col-span-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-6 lg:gap-6 border-t border-[#575757] pt-6 mt-2 lg:mt-0 text-sm font-light"
  >
    <div class="order-2 md:order-1 text-center md:text-left">© 2025 Precious</div>
    <div class="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 order-1 md:order-2">
      <a href={route.cookies_policy} class="text-inherit no-underline transition-colors hover:text-white">Cookies Policy</a>
      <a href={route.legal_terms} class="text-inherit no-underline transition-colors hover:text-white">Legal Terms</a>
      <a href={route.privacy_policy} class="text-inherit no-underline transition-colors hover:text-white">Privacy Policy</a>
    </div>
  </div>
</footer>