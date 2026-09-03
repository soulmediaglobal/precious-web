<script lang="ts">
	import { route } from '$lib';
	let { data } = $props();
	let teams = $derived(data.teams);
	let directors = $derived(teams.filter((person) => person.group === 'board'));
	let management = $derived(teams.filter((person) => person.group === 'management'));
	let staff = $derived(teams.filter((person) => person.group === 'staff'));
	const linkedin = 'https://www.linkedin.com/company/precious-contractor';
	let email = $derived(data.settings?.email ?? '');
	const pillars = [
		['Quality', 'We build with carefully selected materials, proven methods, and an uncompromising standard of workmanship.', '/expertise/construction-2.webp'],
		['Precision', 'Every stage is planned and executed with close attention to detail, performance, and technical accuracy.', '/expertise/mep-2.webp'],
		['Partnership', 'Clear communication and dependable collaboration keep every project aligned from vision to completion.', '/expertise/interior-2.webp']
	];
	const teamSrcset = (src: string) => {
		if (!src.startsWith('/teams/')) return undefined;
		const basename = src.slice(0, src.lastIndexOf('.'));
		return `${basename}-480.webp 480w, ${basename}-800.webp 800w`;
	};
</script>

<svelte:head>
	<title>Precious Contractor - About Us</title>
	<meta name="description" content="Discover Precious Contractor, our approach, and the people behind every project." />
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="overflow-x-clip bg-[#090909] text-white">
	<section class="relative min-h-[100svh] overflow-hidden">
		<img src="/about-1.webp" srcset="/about-1-768.webp 768w, /about-1-1280.webp 1280w, /about-1-1920.webp 1920w" sizes="100vw" width="2939" height="1962" loading="eager" fetchpriority="high" decoding="async" alt="Precious Contractor project" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.92),rgba(3,3,3,.52)_55%,rgba(3,3,3,.18))]"></div>
		<div class="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pt-24 sm:px-8 md:px-16 xl:px-0">
			<p class="eyebrow">ABOUT US</p>
			<h1 class="max-w-5xl text-[clamp(3rem,7vw,6.75rem)] leading-[.94] font-light tracking-[-.045em]">Built with purpose.<br />Delivered with precision.</h1>
			<p class="mt-7 max-w-lg text-sm leading-7 text-white/60 md:text-base">We turn considered ideas into enduring spaces through disciplined planning, trusted collaboration, and careful execution.</p>
			<div class="mt-12 flex items-center gap-4 text-[.65rem] tracking-[.22em] text-white/45"><span class="h-px w-12 bg-[#d4a321]"></span>SCROLL TO DISCOVER</div>
		</div>
	</section>

	<section class="section border-y border-white/10">
		<div class="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
			<div class="flex flex-col justify-center">
				<p class="eyebrow">WHO WE ARE</p>
				<h2 class="display">Building excellence across Indonesia.</h2>
				<div class="mt-8 max-w-xl space-y-5 text-sm leading-7 text-white/55 md:text-base">
					<p>Precious Contractor delivers residential, commercial, and hospitality projects with a clear focus on quality, efficiency, and precision.</p>
					<p>From concept to completion, we balance design intent, technical requirements, and project performance to create spaces built for lasting value.</p>
				</div>
				<a href={route.expertise} class="mt-10 w-fit border-b border-[#d4a321]/70 pb-2 text-sm hover:text-[#d4a321]">Explore our expertise ↗</a>
			</div>
			<div class="grid grid-cols-[1.15fr_.85fr] items-end gap-4 md:gap-6">
				<img src="/about-2.webp" srcset="/about-2-640.webp 640w, /about-2-1024.webp 1024w" sizes="(min-width: 1024px) 32vw, 58vw" width="4096" height="2736" loading="lazy" decoding="async" alt="Precious Contractor project" class="h-[30rem] w-full object-cover md:h-[42rem]" />
				<img src="/about-3.webp" srcset="/about-3-480.webp 480w, /about-3-800.webp 800w" sizes="(min-width: 1024px) 24vw, 42vw" width="4096" height="2214" loading="lazy" decoding="async" alt="Project detail" class="mb-10 h-64 w-full object-cover md:mb-16 md:h-96" />
			</div>
		</div>
	</section>

	<section class="border-b border-white/10 bg-[#111] px-5 sm:px-8 md:px-16 lg:px-20">
		<div class="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
			{#each ['Residential', 'Commercial', 'Hospitality', 'Nationwide execution'] as item, i}
				<div class="border-r border-white/10 px-4 py-9 first:pl-0 last:border-0 md:px-8"><p class="mb-3 text-xs text-[#d4a321]">0{i + 1}</p><p class="text-sm text-white/75 md:text-base">{item}</p></div>
			{/each}
		</div>
	</section>

	<section class="section">
		<div class="mx-auto max-w-7xl">
			<p class="eyebrow">HOW WE BUILD</p>
			<h2 class="display mb-12">Our pillars of excellence.</h2>
			<div class="grid gap-10 md:grid-cols-3 md:gap-6">
				{#each pillars as pillar, i}
					<article class="border-t border-white/15 pt-5">
						<img src={pillar[2]} srcset={`${pillar[2].slice(0, -5)}-480.webp 480w, ${pillar[2].slice(0, -5)}-800.webp 800w`} sizes="(min-width: 768px) 33vw, 100vw" loading="lazy" decoding="async" alt="" class="mb-7 h-64 w-full object-cover grayscale-[20%]" />
						<p class="mb-3 text-xs text-[#d4a321]">0{i + 1}</p>
						<h3 class="text-3xl font-light">{pillar[0]}</h3>
						<p class="mt-4 text-sm leading-6 text-white/48">{pillar[1]}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="relative min-h-[44rem] overflow-hidden border-y border-white/10">
		<img src="/home-image-6.webp" srcset="/home-image-6-960.webp 960w, /home-image-6-1600.webp 1600w" sizes="100vw" width="1651" height="1101" loading="lazy" decoding="async" alt="Project detail" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.96),rgba(5,5,5,.75)_48%,rgba(5,5,5,.15))]"></div>
		<div class="relative z-10 mx-auto flex min-h-[44rem] max-w-7xl items-center px-5 sm:px-8 md:px-16 xl:px-0">
			<div class="max-w-xl"><p class="eyebrow">OUR MISSION</p><h2 class="display">Our commitment to excellence.</h2><p class="mt-8 text-sm leading-7 text-white/58 md:text-base">To provide dependable construction solutions with a focus on quality, efficiency, and precision—ensuring every project is delivered on time, on plan, and to the highest standards.</p></div>
		</div>
	</section>

	<section class="section bg-[#080808]">
		<div class="mx-auto max-w-7xl">
			<header class="mb-14 border-b border-[#d4a321]/40 pb-9"><p class="eyebrow">OUR PEOPLE</p><h2 class="display">Leadership is built on trust.</h2></header>
			{#if directors.length}
				<p class="eyebrow">BOARD OF DIRECTOR</p>
				<div class="space-y-16 border-b border-white/12 pb-16">
					{#each directors as person (person.image)}
						<article class="grid items-center gap-9 md:grid-cols-[.82fr_1.18fr] md:gap-16">
							<div class="max-w-md"><img src={person.image} srcset={teamSrcset(person.image)} sizes="(min-width: 768px) 36vw, 100vw" loading="lazy" decoding="async" alt={person.name} class="aspect-[4/5] w-full object-cover" /></div>
							<div class="flex h-full max-w-2xl flex-col justify-center">
								<h3 class="person-name">{person.name}</h3>
								<p class="mt-4 text-lg text-[#d4a321]">{person.title}</p>
								<p class="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">{person.description ?? 'Leading with clarity, integrity, and close attention to every detail, our Board sets the strategic direction for Precious Contractor and ensures that each project reflects our commitment to quality.'}</p>
								<div class="mt-auto flex flex-wrap justify-end gap-3 pt-8">{#if person.email ?? email}<a class="chip" href="mailto:{person.email ?? email}">✉ Email</a>{/if}<a class="chip" href={person.linkedin ?? linkedin} target="_blank" rel="noreferrer"><b>in</b> LinkedIn</a></div>
							</div>
						</article>
					{/each}
				</div>
			{/if}
			<div class="border-b border-white/12 py-14">
				<p class="eyebrow">MANAGEMENT</p>
				<div class="grid gap-12 md:grid-cols-2">
					{#each management as person}
						<article class="grid grid-cols-[.78fr_1.22fr] items-end gap-6">
							<img src={person.image} srcset={teamSrcset(person.image)} sizes="(min-width: 768px) 20vw, 40vw" loading="lazy" decoding="async" alt={person.name} class="aspect-[4/5] w-full object-cover" />
							<div class="flex h-full flex-col justify-end pb-2"><h3 class="person-name">{person.name}</h3><p class="mt-3 text-sm text-[#d4a321]">{person.title}</p><div class="mt-auto flex flex-wrap justify-end gap-2 pt-8">{#if person.email ?? email}<a class="chip small" href="mailto:{person.email ?? email}">✉ Email</a>{/if}<a class="chip small" href={person.linkedin ?? linkedin} target="_blank" rel="noreferrer"><b>in</b> LinkedIn</a></div></div>
						</article>
					{/each}
				</div>
			</div>
			<div class="pt-14">
				<p class="eyebrow">STAFF</p>
				<div class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
					{#each staff as person}
						<article><img src={person.image} srcset={teamSrcset(person.image)} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" decoding="async" alt={person.name} class="aspect-[4/5] w-full object-cover" /><div class="mt-5 flex min-h-32 flex-col"><h3 class="person-name">{person.name}</h3><p class="mt-2 text-sm text-[#d4a321]">{person.title}</p><div class="mt-auto flex flex-wrap justify-end gap-2 pt-5">{#if person.email ?? email}<a class="chip small" href="mailto:{person.email ?? email}">✉ Email</a>{/if}<a class="chip small" href={person.linkedin ?? linkedin} target="_blank" rel="noreferrer"><b>in</b> LinkedIn</a></div></div></article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="relative min-h-[34rem] overflow-hidden border-t border-white/10">
		<img src="/contact-us-1.webp" srcset="/contact-us-1-960.webp 960w, /contact-us-1-1600.webp 1600w" sizes="100vw" width="3072" height="2048" loading="lazy" decoding="async" alt="Construction project" class="absolute inset-0 h-full w-full object-cover" /><div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.3),rgba(3,3,3,.94)_70%)]"></div>
		<div class="relative z-10 mx-auto flex min-h-[34rem] max-w-7xl items-center justify-end px-5 sm:px-8 md:px-16 xl:px-0"><div class="max-w-xl"><p class="eyebrow">START A CONVERSATION</p><h2 class="display">Let’s build something that lasts.</h2><p class="mt-6 text-sm leading-7 text-white/58">Tell us about your next project. We are ready to turn your vision into an enduring result.</p><a href={route.contact} class="mt-8 inline-flex border border-white/50 px-6 py-3 text-sm hover:bg-white hover:text-black">Contact us&nbsp; ↗</a></div></div>
	</section>
</div>

<style>
	.section{padding:7rem 5rem;background:#0a0a0a}.eyebrow{margin-bottom:1.25rem;font-size:.7rem;font-weight:600;letter-spacing:.25em;color:#d4a321}.display{font-size:clamp(2.6rem,5vw,5rem);line-height:1;letter-spacing:-.04em;font-weight:300}.person-name{font-size:clamp(1.5rem,2vw,1.875rem);line-height:1.2;font-weight:300}.chip{display:inline-flex;min-height:2.7rem;align-items:center;gap:.65rem;border:1px solid rgb(212 163 33/.62);border-radius:9999px;padding:.6rem 1.1rem;font-size:.78rem;color:#ffffffd1;transition:.18s}.chip:hover{border-color:#d4a321;background:#d4a32116;color:white}.chip.small{min-height:2.2rem;padding:.4rem .8rem;font-size:.68rem}@media(max-width:1023px){.section{padding:5rem 2rem}}@media(max-width:639px){.section{padding:5rem 1.25rem}.chip{padding:.55rem .9rem}}
</style>
