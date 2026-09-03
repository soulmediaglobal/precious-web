<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const introTexts = [
		`This Cookies Policy explains how Precious Contractor (“we”, “our”, or “us”) uses cookies and similar technologies when you visit our website.`
	];

    type ContentBlock = {
        type: 'text' | 'subheading' | 'list';
        content?: string;
        items?: string[];
        class?: string;
    };

    type Section = {
        id: string;
        title: string;
        heading: string;
        content: ContentBlock[];
    };

	const sections: Section[] = [
		{
			id: 'introduction',
			title: 'Introduction',
			heading: '1. Introduction',
			content: [
				{ type: 'text', content: 'When you access our website, we may store or retrieve information on your browser in the form of cookies. This information helps us improve your experience, understand how our website is used, and support our marketing efforts.' }
			]
		},
		{
			id: 'what-are-cookies',
			title: 'What Are Cookies',
			heading: '2. What Are Cookies',
			content: [
				{ type: 'text', content: 'Cookies are small text files stored on your device when you visit a website. They enable the website to recognize your device and remember certain information about your visit.' },
				{ type: 'text', content: 'Cookies can be:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Session cookies (deleted when you close your browser)',
						'Persistent cookies (stored for a defined period)'
					]
				}
			]
		},
		{
			id: 'how-we-use-cookies',
			title: 'How We Use Cookies',
			heading: '3. How We Use Cookies',
			content: [
				{ type: 'text', content: 'We use cookies for the following purposes:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'To ensure the website functions properly',
						'To analyze traffic and user behavior',
						'To improve website performance and usability',
						'To support marketing and advertising activities',
						'To remember user preferences and interactions'
					]
				}
			]
		},
		{
			id: 'types-of-cookies',
			title: 'Types of Cookies We Use',
			heading: '4. Types of Cookies We Use',
			content: [
				{ type: 'subheading', content: '4.1 Essential Cookies' },
				{ type: 'text', content: 'These cookies are strictly necessary for the operation of the website. They enable basic functions such as navigation and access to secure areas.' },
				{ type: 'text', content: 'These cookies do not require user consent.', class: 'mb-4' },

				{ type: 'subheading', content: '4.2 Analytics Cookies' },
				{ type: 'text', content: 'We use Google Analytics to collect information about how visitors interact with our website.' },
				{ type: 'text', content: 'These cookies help us:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Understand traffic patterns',
						'Identify popular pages',
						'Improve overall user experience'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'The information collected is aggregated and does not directly identify individual users.', class: 'mb-4' },

				{ type: 'subheading', content: '4.3 Advertising Cookies' },
				{ type: 'text', content: 'We use Google Ads to deliver relevant advertisements and measure the effectiveness of our campaigns.' },
				{ type: 'text', content: 'These cookies may:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Track your browsing behavior',
						'Help display ads relevant to your interests',
						'Limit how often you see an advertisement'
					],
					class: 'mb-4'
				},

				{ type: 'subheading', content: '4.4 Functional Cookies' },
				{ type: 'text', content: 'These cookies allow the website to remember choices you make, such as form inputs or preferences, to provide a more personalized experience.' }
			]
		},
		{
			id: 'personal-data-collected',
			title: 'Personal Data Collected',
			heading: '5. Personal Data Collected',
			content: [
				{ type: 'text', content: 'Through cookies and website interactions, we may collect:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'First and last name',
						'Email address',
						'Phone number',
						'Message content',
						'IP address',
						'Device and browser information'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'This data is used for communication, service improvement, and marketing analysis' }
			]
		},
		{
			id: 'third-party-cookies',
			title: 'Third-Party Cookies',
			heading: '6. Third-Party Cookies',
			content: [
				{ type: 'text', content: 'Some cookies are placed by third-party services that we use to enhance functionality and performance.' },
				{ type: 'text', content: 'These include:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Google Analytics',
						'Google Ads'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'These third parties may process your data according to their own privacy policies.' }
			]
		},
		{
			id: 'data-retention',
			title: 'Data Retention',
			heading: '7. Data Retention',
			content: [
				{ type: 'text', content: 'Cookies may be stored on your device for different periods depending on their purpose:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Session cookies: deleted when the browser is closed',
						'Persistent cookies: stored for a defined duration or until manually deleted'
					]
				}
			]
		},
		{
			id: 'your-rights-and-choices',
			title: 'Your Rights and Choices',
			heading: '8. Your Rights and Choices',
			content: [
				{ type: 'text', content: 'You have the right to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Accept or reject cookies',
						'Withdraw consent at any time',
						'Access or request deletion of your personal data',
						'Restrict or object to certain types of data processing'
					]
				}
			]
		},
		{
			id: 'managing-cookies',
			title: 'Managing Cookies',
			heading: '9. Managing Cookies',
			content: [
				{ type: 'text', content: 'You can control and manage cookies through your browser settings. Most browsers allow you to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Block cookies',
						'Delete stored cookies',
						'Set preferences for certain websites'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Please note that disabling cookies may impact website functionality.' }
			]
		},
		{
			id: 'international-users',
			title: 'International Users',
			heading: '10. International Users',
			content: [
				{ type: 'text', content: 'As our website may be accessed globally, we aim to comply with applicable data protection laws, including the General Data Protection Regulation (GDPR).' }
			]
		},
		{
			id: 'updates',
			title: 'Updates to This Policy',
			heading: '11. Updates to This Policy',
			content: [
				{ type: 'text', content: 'We may update this Cookies Policy from time to time. Changes will be posted on this page with an updated effective date.' }
			]
		},
		{
			id: 'contact',
			title: 'Contact Us',
			heading: '12. Contact Us',
			content: [
				{ type: 'text', content: 'If you have any questions regarding this Cookies Policy, please contact us:' },
				{ type: 'text', content: 'Precious Contractor' },
				{ type: 'text', content: 'Email: hello@precious.com' },
				{ type: 'text', content: 'Phone: +62 812 3567 890' }
			]
		}
	];

	let isInitialLoad = true;

	$effect(() => {
		const sectionParam = page.url.searchParams.get('section');
		
		if (sectionParam) {
			const el = document.getElementById(sectionParam);
			if (el) {
				// Small delay on initial load to ensure DOM is ready and styles are applied
				if (isInitialLoad) {
					setTimeout(() => {
						el.scrollIntoView({ behavior: 'smooth' });
						isInitialLoad = false;
					}, 100);
				} else {
					el.scrollIntoView({ behavior: 'smooth' });
				}
			}
		} else {
			if (isInitialLoad) {
				setTimeout(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
					isInitialLoad = false;
				}, 100);
			} else {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	});

	const scrollToSection = async (id: string, e: Event) => {
		e.preventDefault();
		const url = new URL(page.url);
		url.searchParams.set('section', id);
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(url, { replaceState: true, noScroll: true });
		
        // Explicitly scroll if clicking the same item while already active but user scrolled away
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	};
</script>

<svelte:head>
	<title>Cookies Policy - Precious Contractor</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="min-h-screen bg-secondary text-neutral-300 py-28 md:py-40 px-4 md:px-36">
	<div class="flex flex-col md:flex-row gap-14">
		<!-- Sidebar -->
		<aside class="w-full md:w-1/3 shrink-0">
			<div class="sticky top-24">
				<nav class="flex flex-col space-y-1">
					{#each sections as section (section.id)}
						<a
							href="?section={section.id}"
							onclick={(e) => scrollToSection(section.id, e)}
							class="text-sm py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-white"
						>
							{section.title}
						</a>
					{/each}
				</nav>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="w-full md:w-2/3">
			<h1 class="text-3xl font-semibold text-white mb-6 tracking-tight">Cookies Policy</h1>

			<div class="prose prose-invert max-w-none text-sm text-primary leading-relaxed">
				<div class="mb-10 space-y-4">
					{#each introTexts as text, i (i)}
						<div>{text}</div>
					{/each}
				</div>

				{#each sections as section (section.id)}
					<div id={section.id} class="mb-10 scroll-mt-24">
						<h2 class="text-xl font-semibold mb-6">{section.heading}</h2>
						{#each section.content as block, i (i)}
							{#if block.type === 'text'}
								<p class="text-sm {block.class || ''}">{block.content}</p>
							{:else if block.type === 'subheading'}
								<h3 class="text-sm {block.class || ''}">
									{block.content}
								</h3>
							{:else if block.type === 'list'}
								<ul class="text-sm list-disc pl-5 space-y-1 {block.class || ''}">
									{#each block.items || [] as item, j (j)}
										<li>{item}</li>
									{/each}
								</ul>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</main>
	</div>
</div>
