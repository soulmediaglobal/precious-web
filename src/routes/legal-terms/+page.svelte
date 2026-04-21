<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const introTexts = [
		`Welcome to Precious Contractor (“Company”, “we”, “our”, or “us”). These Terms and Conditions (“Terms”) govern your access to and use of our website and services.`,
		`By accessing or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.`
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
			id: 'scope',
			title: 'Scope of This Policy',
			heading: '1. Scope of This Policy',
			content: [
				{ type: 'text', content: 'This website provides general information regarding contractor-related services offered by Precious Contractor, including but not limited to construction, project consultation, and related services.' },
				{ type: 'text', content: 'The website also serves as a communication platform through which users may submit inquiries or service requests.' }
			]
		},
		{
			id: 'eligibility',
			title: 'Eligibility',
			heading: '2. Eligibility',
			content: [
				{ type: 'text', content: 'By using this website, you confirm that:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'You are at least 18 years old or have legal capacity to enter into agreements',
						'You are using the website for lawful purposes only',
						'You will not misuse the website or its content'
					]
				}
			]
		},
		{
			id: 'acceptable-use',
			title: 'Acceptable Use',
			heading: '3. Acceptable Use',
			content: [
				{ type: 'text', content: 'You agree not to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Use the website for fraudulent or unlawful activities',
						'Attempt to gain unauthorized access to systems or data',
						'Interfere with the operation or security of the website',
						'Submit false, misleading, or harmful information'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'We reserve the right to restrict or terminate access if misuse is detected.' }
			]
		},
		{
			id: 'disclaimer-of-information',
			title: 'Disclaimer of Information',
			heading: '4. Disclaimer of Information',
			content: [
				{ type: 'text', content: 'All content provided on this website is for general informational purposes only.' },
				{ type: 'text', content: 'While we strive to ensure accuracy, we do not warrant that:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Information is complete, accurate, or up to date',
						'Services described are always available',
						'Website content is free from errors'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Users should not rely solely on website content for decision-making without further consultation.' }
			]
		},
		{
			id: 'no-binding-agreement',
			title: 'No Binding Agreement',
			heading: '5. No Binding Agreement',
			content: [
				{ type: 'text', content: 'Any communication initiated through this website, including form submissions, emails, or messages, does not constitute a legally binding agreement.' },
				{ type: 'text', content: 'A binding agreement will only be formed upon:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Mutual agreement between both parties',
						'Execution of a formal written contract'
					]
				}
			]
		},
		{
			id: 'quotes-and-estimates',
			title: 'Quotes and Estimates',
			heading: '6. Quotes and Estimates',
			content: [
				{ type: 'text', content: 'Any pricing, quotations, or estimates provided through this website or initial communication are:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Indicative only',
						'Subject to change based on project scope, site conditions, and requirements'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Final pricing will be determined in a formal agreement.' }
			]
		},
		{
			id: 'data-submitted',
			title: 'Data Submitted by Users',
			heading: '7. Data Submitted by Users',
			content: [
				{ type: 'text', content: 'When submitting information through the website, you agree that:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'The information provided is accurate and complete',
						'You have the legal right to provide such information',
						'Your submission does not violate any third-party rights'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'You grant us the right to use your submitted data for:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Responding to inquiries',
						'Providing services',
						'Internal analysis and improvement'
					]
				}
			]
		},
		{
			id: 'intellectual-property',
			title: 'Intellectual Property Rights',
			heading: '8. Intellectual Property Rights',
			content: [
				{ type: 'text', content: 'All materials on this website, including but not limited to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Text, graphics, logos, images',
						'Layout, design, and software'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'are owned by or licensed to Precious Contractor and are protected by applicable intellectual property laws. You may not:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Copy, reproduce, distribute, or modify content',
						'Use content for commercial purposes without prior written consent'
					]
				}
			]
		},
		{
			id: 'third-party-links',
			title: 'Third-Party Links and Services',
			heading: '9. Third-Party Links and Services',
			content: [
				{ type: 'text', content: 'This website may contain links to third-party websites or services. we do not:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Control or endorse third-party content',
						'Assume responsibility for their practices or policies'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Accessing third-party links is at your own risk.' }
			]
		},
		{
			id: 'limitation-of-liability',
			title: 'Limitation of Liability',
			heading: '10. Limitation of Liability',
			content: [
				{ type: 'text', content: 'To the maximum extent permitted by law, Precious Contractor shall not be liable for:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Any indirect, incidental, or consequential damages',
						'Loss of data, revenue, or business opportunities',
						'Errors, inaccuracies, or omissions in content',
						'Interruptions or unavailability of the website'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Your use of the website is at your sole risk.' }
			]
		},
		{
			id: 'disclaimers-and-warranties',
			title: 'Disclaimers and Warranties',
			heading: '11. Disclaimers and Warranties',
			content: [
				{ type: 'text', content: 'This website is provided on an “as is” and “as available” basis. we make no warranties, express or implied, including but not limited to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Merchantability',
						'Fitness for a particular purpose',
						'Non-infringement'
					]
				}
			]
		},
		{
			id: 'privacy-and-cookies-policies',
			title: 'Privacy and Cookies Policies',
			heading: '12. Privacy and Cookies Policies',
			content: [
				{ type: 'text', content: 'Your use of this website is also subject to our Privacy Policy and Cookies Policy.' },
				{ type: 'text', content: 'We encourage you to review these documents to understand how your data is collected and used.' }
			]
		},
		{
			id: 'security',
			title: 'Security',
			heading: '13. Security',
			content: [
				{ type: 'text', content: 'While we implement reasonable security measures, we cannot guarantee that:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'The website will be free from viruses or harmful components',
						'Data transmission over the internet will be completely secure'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Users are responsible for maintaining their own device security.' }
			]
		},
		{
			id: 'suspension-and-termination',
			title: 'Suspension and Termination',
			heading: '14. Suspension and Termination',
			content: [
				{ type: 'text', content: 'We reserve the right to:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Suspend or terminate access to the website',
						'Restrict certain functionalities'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'at any time, without prior notice, if we believe there is a violation of these Terms.' }
			]
		},
		{
			id: 'changes-to-terms',
			title: 'Changes to Terms',
			heading: '15. Changes to Terms',
			content: [
				{ type: 'text', content: 'We may update or modify these Terms at any time.' },
				{ type: 'text', content: 'Changes will:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'Be effective immediately upon posting',
						'Replace previous versions'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'Continued use of the website constitutes acceptance of the updated Terms.' }
			]
		},
		{
			id: 'governing-law',
			title: 'Governing Law and Jurisdiction',
			heading: '16. Governing Law and Jurisdiction',
			content: [
				{ type: 'text', content: 'These Terms shall be governed by and interpreted in accordance with the laws of the Republic of Indonesia.' },
				{ type: 'text', content: 'Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Indonesia.' }
			]
		},
		{
			id: 'severability',
			title: 'Severability',
			heading: '17. Severability',
			content: [
				{ type: 'text', content: 'If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.' }
			]
		},
		{
			id: 'contact',
			title: 'Contact Information',
			heading: '18. Contact Information',
			content: [
				{ type: 'text', content: 'If you have any questions regarding these Terms, please contact us:' },
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
	<title>Legal Terms - Precious Contractor</title>
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
			<h1 class="text-3xl font-semibold text-white mb-6 tracking-tight">Terms and Conditions</h1>

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
