<script>
	import { route } from "$lib";

	// Use static assets provided in the static folder.
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="relative h-screen font-sans text-white w-full overflow-hidden flex flex-col bg-neutral-900">
	<!-- Background Image -->
	<div class="absolute inset-0 z-0">
    <img src="/back-new.png.webp" alt="Background" class="w-full h-full object-cover object-center absolute inset-0 mix-blend-overlay" />
		<img src="/front_2.png.webp" alt="Background" class="w-full h-full object-cover object-center absolute inset-0" />
    <div class="absolute top-0 left-0 w-full h-60" style="background: linear-gradient(180deg, rgba(30, 30, 30, .5), rgba(61, 57, 52, 0))"></div>
    <div class="absolute bottom-0 left-0 w-full h-3/5" style="background: linear-gradient(235deg, rgba(61, 57, 52,0), rgba(30, 30, 30,1))"></div>
	</div>

	<!-- Content Layer -->
	<div class="relative z-10 flex flex-col min-h-screen justify-between px-14">
		
		<!-- Top Section (Header) -->
		<div>
			<!-- Top utility bar -->
			<div class="hidden md:flex justify-end items-center py-3 text-[11px] font-bold tracking-widest ">
				<a href={route.root} class="mr-6 hover:text-white transition-colors uppercase">CRAFT RESOURCES</a>
				<a href={route.root} class="hover:text-white transition-colors uppercase">EN / ES</a>
			</div>
			<!-- Separator line -->
			<div class="w-full h-px bg-white/50 hidden md:block"></div>

			<!-- Main Navigation -->
			<nav class="flex items-center justify-between py-2">
				<!-- Logo -->
				<div class="bg-[#e91c24] text-white font-black italic tracking-tighter text-3xl md:text-4xl px-3 pb-1 pt-2 flex items-center shadow-lg relative">
					MCCARTHY
					<span class="text-[10px] absolute right-1 top-2 font-normal not-italic">&reg;</span>
				</div>
				
				<!-- Nav Links -->
				<div class="hidden lg:flex items-center space-x-10 font-bold text-[13px] tracking-widest uppercase">
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">ABOUT</a>
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">OUR WORK</a>
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">OUR APPROACH</a>
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">OFFICES</a>
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">INSIGHTS</a>
					<a href={route.root} class="text-white hover:text-gray-300 transition-colors">CAREERS</a>
				</div>
				
				<!-- Right Menu -->
				<div class="hidden lg:flex items-center space-x-6">
					<a href={route.root} class="bg-neutral-800/80 hover:bg-neutral-800 text-white font-bold text-sm px-3 py-2 transition-colors uppercase tracking-widest">CONTACT</a>
					<button class="text-white hover:text-gray-300 transition-colors" aria-label="Search">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</button>
				</div>
				
				<!-- Mobile menu button -->
				<div class="lg:hidden flex items-center">
					<button class="text-white" aria-label="Mobile Navigation">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</nav>
		</div>

		<!-- Hero Content -->
		<main class="grow flex flex-col justify-end pb-24 md:pb-32 px-4 md:px-12 lg:px-24">
			<h1 class="text-7xl mb-10 max-w-6xl">
				<div class="uppercase drop-shadow-lg">
					<span class="font-extrabold tracking-tight">SUPERIOR RESULTS.</span> 
					<span class="font-normal tracking-tight ml-2">GREAT</span>
				</div>
				<div class="font-normal uppercase drop-shadow-lg tracking-tight">
					EXPERIENCES FOR EVERYONE.
				</div>
			</h1>
			
			<div class="flex flex-col sm:flex-row gap-4">
				<a href={route.root} class="bg-[#e91c24] hover:bg-red-700 text-white font-extrabold text-xs md:text-sm tracking-widest px-3 py-2 transition-colors text-center w-full sm:w-auto uppercase">
					SEE OUR WORK
				</a>
				<a href={route.root} class="bg-neutral-800/90 hover:bg-neutral-900 text-white font-extrabold text-xs md:text-sm tracking-widest px-3 py-2 transition-colors text-center w-full sm:w-auto uppercase">
					FIND A CAREER
				</a>
			</div>
		</main>
	</div>
</div>