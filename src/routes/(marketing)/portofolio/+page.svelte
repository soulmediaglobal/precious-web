<script lang="ts">
	import { onMount } from 'svelte';
	import { route } from '$lib';

	let { data } = $props();

	let portofolio = $derived(data.portofolio);
	let activeCategory = $state('All');

	let height = $state(0);
	let scrollY = $state(0);

	let categories = $derived([
		'All',
		...Array.from(
			new Set(
				portofolio
					.map((item) => item.category?.trim())
					.filter((category): category is string => Boolean(category))
			)
		)
	]);

	let filteredProjects = $derived(
		activeCategory === 'All'
			? portofolio
			: portofolio.filter((item) => item.category === activeCategory)
	);

	let featuredProject = $derived(filteredProjects[0] ?? portofolio[0]);

	const checkSize = () => {
		height = window.innerHeight;
	};

	const cardSpanClass = (index: number) => {
		const position = index % 4;

		if (position === 0 || position === 3) {
			return 'md:col-span-5';
		}

		return 'md:col-span-7';
	};

	const imageHeightClass = (index: number) => {
		const position = index % 4;

		if (position === 0 || position === 1) {
			return 'md:h-[520px]';
		}

		return 'md:h-[460px]';
	};

	onMount(() => {
		checkSize();

		window.addEventListener('resize', checkSize);

		return () => {
			window.removeEventListener('resize', checkSize);
		};
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Precious Contractor - Projects</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="w-full overflow-x-clip bg-[#090909] text-white">
	<!-- Existing hero retained -->
	<section
		class="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(5,12,28,0.45),rgba(5,12,28,0.6)),radial-gradient(circle_at_50%_20%,rgba(84,107,159,0.45),transparent_35%),linear-gradient(135deg,#0d172d_0%,#13284d_36%,#31435d_65%,#1c2738_100%)] text-white"
		style="height: {height ? `${height}px` : '100dvh'}"
	>
		<div class="absolute inset-0 overflow-hidden">
			<img
				src="/portofolio-1.webp"
				alt=""
				class="absolute -top-[15%] left-0 h-[130%] w-full object-cover object-center"
				style="transform: translate3d(0, {scrollY * 0.3}px, 0);"
			/>
		</div>

		<div
			class="absolute inset-0"
			style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(77.04deg, rgba(0, 0, 0, 0.2) 34.66%, rgba(0, 0, 0, 0) 82.22%);"
		></div>

		<div
			class="pointer-events-none absolute bottom-0 left-0 z-0 hidden items-center justify-start md:flex"
		>
			<img
				src="/mask-6.webp"
				alt=""
				class="h-full w-2/5 -scale-x-100 object-cover object-center"
			/>
		</div>

		<div class="absolute inset-x-4 bottom-8 z-10 md:inset-x-36 md:bottom-44">
			<div class="mb-1 text-xs font-medium tracking-[0.16em] text-[#d4a321] md:mb-0">
				PORTOFOLIO
			</div>

			<h1 class="text-3xl font-medium capitalize md:text-6xl">
				A selection of projects<br />we’ve successfully delivered.
			</h1>
		</div>
	</section>

	<!-- Editorial project showcase -->
	<section id="selected-works" class="relative bg-[#090909] px-4 py-20 md:px-16 md:py-28 lg:px-24 xl:px-36">
		<div
			class="mx-auto flex max-w-[1600px] flex-col gap-10 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between md:gap-16"
		>
			<div class="max-w-3xl">
				<div class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d4a321]">
					Selected Works
				</div>

				<h2 class="max-w-3xl text-[2.5rem] font-medium leading-[0.98] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
					Spaces That Perform<br class="hidden md:block" />
					In Real Life.
				</h2>
			</div>

			<p class="max-w-md text-sm leading-7 text-white/50 md:text-base">
				A curated selection of work delivered across architecture, construction, interiors,
				and the built environment.
			</p>
		</div>

		<div class="mx-auto max-w-[1600px]">
			<!-- Category filters -->
			<div class="flex gap-2 overflow-x-auto border-b border-white/10 py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{#each categories as category}
					<button
						type="button"
						onclick={() => (activeCategory = category)}
						class={[
							'whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300',
							activeCategory === category
								? 'border-[#d4a321] bg-[#d4a321] text-black'
								: 'border-white/15 text-white/55 hover:border-white/40 hover:text-white'
						]}
						aria-pressed={activeCategory === category}
					>
						{category}
					</button>
				{/each}
			</div>

			{#if filteredProjects.length > 0}
				<div class="grid grid-cols-1 gap-x-5 gap-y-12 pt-10 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
					{#each filteredProjects as project, index (project.slug)}
						<a
							href={route.portofolio + '/' + project.slug}
							class={[
								'project-card group block min-w-0',
								cardSpanClass(index)
							]}
						>
							<div
								class={[
									'relative h-[390px] w-full overflow-hidden bg-[#141414]',
									imageHeightClass(index)
								]}
							>
								<img
									src={project.images?.[0] || '/portofolio-1.webp'}
									alt={project.project_name}
									loading={index < 2 ? 'eager' : 'lazy'}
									decoding="async"
									class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
								/>

								<div
									class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent"
								></div>

								{#if index === 0}
									<div
										class="absolute left-5 top-5 border border-white/25 bg-black/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm"
									>
										Featured Project
									</div>
								{/if}

								<div
									class="absolute inset-x-0 bottom-0 flex translate-y-1 items-end justify-between gap-6 p-5 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-7"
								>
									<div class="min-w-0">
										{#if project.category}
											<div
												class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4a321]"
											>
												{project.category}
											</div>
										{/if}

										<h3
											class="text-xl font-medium leading-tight tracking-[-0.02em] text-white md:text-2xl"
										>
											{project.project_name}
										</h3>
									</div>

									<span
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-lg text-white transition-all duration-300 group-hover:border-[#d4a321] group-hover:bg-[#d4a321] group-hover:text-black"
										aria-hidden="true"
									>
										↗
									</span>
								</div>
							</div>

							<div
								class="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-start sm:justify-between"
							>
								<div>
									<div class="text-sm font-medium text-white/85">
										{project.project_name}
									</div>

									{#if project.location}
										<div class="mt-1 text-sm text-white/35">
											{project.location}
										</div>
									{/if}
								</div>

								<div class="flex flex-wrap gap-2 sm:justify-end">
									{#if project.category}
										<span
											class="border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/40"
										>
											{project.category}
										</span>
									{/if}

									{#if project.client}
										<span
											class="max-w-[190px] truncate border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/40"
										>
											{project.client}
										</span>
									{/if}
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="border-b border-white/10 py-24 text-center text-sm text-white/45">
					No projects available in this category.
				</div>
			{/if}
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="relative min-h-[620px] overflow-hidden bg-black md:min-h-[720px]">
		<img
			src={featuredProject?.images?.[0] || '/portofolio-1.webp'}
			alt=""
			loading="lazy"
			decoding="async"
			class="absolute inset-0 h-full w-full object-cover object-center opacity-60"
		/>

		<div
			class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.58)_48%,rgba(0,0,0,0.28)_100%)]"
		></div>

		<div
			class="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/55 to-transparent"
		></div>

		<div
			class="pointer-events-none absolute -bottom-[20%] right-[-22%] h-[520px] w-[820px] rounded-[50%] border-[70px] border-[#d4a321]/90 md:-bottom-[35%] md:right-[-8%] md:h-[900px] md:w-[1300px] md:border-[120px]"
		></div>

		<div
			class="relative z-10 mx-auto flex min-h-[620px] max-w-[1600px] items-end px-4 py-16 md:min-h-[720px] md:px-16 md:py-24 lg:px-24 xl:px-36"
		>
			<div class="grid w-full gap-12 md:grid-cols-[1fr_auto] md:items-end">
				<div class="max-w-4xl">
					<div class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d4a321]">
						Start A Project
					</div>

					<h2 class="text-[3rem] font-medium leading-[0.92] tracking-[-0.05em] text-white md:text-7xl lg:text-8xl">
						Let’s Build<br />
						What’s Next.
					</h2>

					<p class="mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">
						From early planning to final execution, we bring clarity, precision, and accountability
						to every stage of the build.
					</p>
				</div>

				<a
					href="/contact"
					class="group inline-flex w-fit items-center gap-8 border border-white/30 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-[#d4a321] hover:bg-[#d4a321] hover:text-black md:px-8"
				>
					Contact Precious
					<span class="text-lg transition-transform duration-300 group-hover:translate-x-1">↗</span>
				</a>
			</div>
		</div>
	</section>
</div>
