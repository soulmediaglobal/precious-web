<script lang="ts">
	import { page } from '$app/state';
	import { route } from '$lib';

	const navItems: Record<string, string>[] = [
		{ name: 'Home', href: route.root },
		{ name: 'About', href: route.about },
		{ name: 'Projects', href: route.projects },
		{ name: 'Services', href: route.services }
	];

	let y = $state(0);
</script>

<svelte:window bind:scrollY={y} />

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<header class="fixed top-0 w-screen left-0 z-50 flex items-center justify-between gap-5 h-24 px-16 transition-all duration-300 {y > 50 ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'}">
  <img src="/logo.svg" alt="" />

  <nav class="flex flex-1 items-center justify-center gap-6">
    {#each navItems as item (item)}
      <a
        href={item.href} class="text-sm text-white/85 no-underline px-3"
        class:font-bold={page.url.pathname === item.href}
      >
        {item.name}
      </a>
    {/each}
  </nav>

  <a
    href="#contact"
    class="inline-flex items-center gap-3 justify-center border border-white/75 px-4 py-2 text-sm text-white no-underline"
  >
    Contact us <span>↗</span>
  </a>
</header>