<script lang="ts">
	import { page } from '$app/state';
	import { route } from '$lib';
	import { slide } from 'svelte/transition';

	const navItems: Record<string, string>[] = [
		{ name: 'Home', href: route.root },
		{ name: 'About Us', href: route.about },
		{ name: 'Expertise', href: route.expertise },
		{ name: 'Portofolio', href: route.portofolio }
	];

	let y = $state(0);
	let isMobileMenuOpen = $state(false);

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<svelte:window bind:scrollY={y} />

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<header class="fixed top-0 w-full left-0 z-50 flex items-center justify-between gap-5 h-20 md:h-24 px-6 md:px-16 transition-all duration-300 {isMobileMenuOpen ? 'bg-black backdrop-blur-none' : y > 50 ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'}">
	<!-- Logo -->
	<a href={route.root} class="relative z-50 flex items-center" onclick={() => { isMobileMenuOpen = false; }}>
		<img src="/logo.svg" alt="" class="h-10 md:h-auto object-contain" />
	</a>

	<!-- Desktop Nav -->
	<nav class="hidden md:flex flex-1 items-center justify-center gap-6">
		{#each navItems as item (item)}
			<a
				href={item.href} class="text-sm text-white/85 no-underline px-3 transition-colors hover:text-white"
				class:font-bold={page.url.pathname === item.href}
			>
				{item.name}
			</a>
		{/each}
	</nav>

	<!-- Desktop Contact Button -->
	<a
		href={route.contact}
		class="hidden md:inline-flex items-center gap-3 justify-center border border-white/75 px-4 py-2 text-sm text-white no-underline transition-colors hover:bg-white hover:text-black hover:border-white"
	>
		Contact us <span>↗</span>
	</a>

	<!-- Mobile Hamburger -->
	<button
		class="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-1.5 relative z-50 cursor-pointer text-white mix-blend-difference"
		onclick={toggleMenu}
		aria-label="Toggle mobile menu"
	>
		<span class="block w-6 h-0.5 bg-white transition-transform duration-300 origin-center {isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}"></span>
		<span class="block w-6 h-0.5 bg-white transition-opacity duration-300 {isMobileMenuOpen ? 'opacity-0' : ''}"></span>
		<span class="block w-6 h-0.5 bg-white transition-transform duration-300 origin-center {isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}"></span>
	</button>
</header>

<!-- Mobile Menu Overlay -->
{#if isMobileMenuOpen}
	<div transition:slide class="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center min-h-screen md:hidden">
		<nav class="flex flex-col items-center justify-center gap-8 w-full mt-10">
			{#each navItems as item (item)}
				<a
					href={item.href}
					class="text-xl text-white/85 no-underline transition-colors hover:text-white"
					class:font-bold={page.url.pathname === item.href}
					onclick={(e) => { e.stopPropagation(); isMobileMenuOpen = false; }}
				>
					{item.name}
				</a>
			{/each}
			
			<a
				href={route.contact}
				class="mt-8 inline-flex items-center gap-3 justify-center border border-white/75 px-8 py-4 text-white no-underline transition-colors hover:bg-white hover:text-black hover:border-white"
				onclick={(e) => { e.stopPropagation(); isMobileMenuOpen = false; }}
			>
				Contact us <span>↗</span>
			</a>
		</nav>
	</div>
{/if}