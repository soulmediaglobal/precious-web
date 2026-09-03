<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { preciousemail, preciousPhone } from '$lib';

	const introTexts = [
		`This Privacy Policy describes how Precious Contractor ("Company", "we", "us", or "our") collects, uses, discloses, and safeguards your personal data when you access or use our websites and services.`,
		`We are committed to safeguarding your privacy and ensuring that your personal data is handled securely and in compliance with applicable data protection laws.`
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
				{ type: 'text', content: 'This Privacy Policy applies to:', class: '-mb-2.5' },
				{ 
					type: 'list', 
					items: [
						'Visitors of our website',
						'Individuals who contact us through forms or communication channels',
						'Any interaction with our digital platforms'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: 'This Policy does not apply to third-party websites or services that may be linked from our website.' }
			]
		},
		{
			id: 'definitions',
			title: 'Definitions',
			heading: '2. Definitions',
			content: [
				{ type: 'text', content: 'For the purpose of this Privacy Policy:', class: '-mb-2.5' },
				{
					type: 'list',
					items: [
						'“Personal Data” means any information relating to an identified or identifiable individual',
						'“Processing” means any operation performed on personal data (collection, storage, use, disclosure, etc.)'
					],
					class: 'mb-4'
				},
				{ type: 'text', content: '“Data Subject” refers to the individual whose personal data is processed' }
			]
		},
		{
			id: 'categories',
			title: 'Categories of Personal Data Collected',
			heading: '3. Categories of Personal Data Collected',
			content: [
				{ type: 'subheading', content: '3.1 Information Provided Directly by You' },
				{ type: 'text', content: 'We may collect personal data that you voluntarily provide, including:', class: '-mb-2.5' },
				{ type: 'list', items: ['Full name', 'Email address', 'Phone number', 'Message or inquiry details'], class: 'mb-4' },

				{ type: 'subheading', content: '3.2 Automatically Collected Data' },
				{ type: 'text', content: 'When you access our website, we may automatically collect:', class: '-mb-2.5' },
				{ type: 'list', items: ['IP address', 'Browser type and version', 'Device type and operating system', 'Pages visited and interaction data', 'Time and duration of visits', 'Referral source'], class: 'mb-4' },

				{ type: 'subheading', content: '3.3 Cookies and Tracking Technologies' },
				{ type: 'text', content: 'We use cookies and similar technologies to collect data about your interactions with our website.', class: '-mb-2.5' },
				{ type: 'text', content: 'This includes services such as:', class: '-mb-2.5' },
				{ type: 'list', items: ['Google Analytics', 'Google Ads'] }
			]
		},
		{
			id: 'purposes',
			title: 'Purposes of Data Processing',
			heading: '4. Purposes of Data Processing',
			content: [
				{ type: 'text', content: 'We process personal data for the following purposes:', class: '-mb-2.5' },
				{ type: 'list', items: [
					'To respond to inquiries and provide requested services',
					'To manage communication and follow-ups',
					'To improve website functionality and user experience',
					'To analyze usage trends and performance metrics',
					'To conduct marketing and advertising activities',
					'To comply with legal obligations',
					'To protect our legal rights and prevent misuse'
				] }
			]
		},
		{
			id: 'legal-basis',
			title: 'Legal Basis for Processing',
			heading: '5. Legal Basis for Processing',
			content: [
				{ type: 'text', content: 'Where applicable (such as under GDPR), we rely on:', class: '-mb-2.5' },
				{ type: 'list', items: [
					'Consent – when you submit forms or accept cookies',
					'Legitimate Interests – for improving services and ensuring website security',
					'Legal Obligations – where required by applicable law'
				] }
			]
		},
		{
			id: 'data-sharing',
			title: 'Data Sharing and Disclosure',
			heading: '6. Data Sharing and Disclosure',
			content: [
				{ type: 'text', content: 'We do not sell personal data. We may disclose personal data to:' },
				{ type: 'subheading', content: '6.1 Service Providers' },
				{ type: 'text', content: 'Including analytics and advertising partners, such as:', class: '-mb-2.5' },
				{ type: 'list', items: ['Google Analytics', 'Google Ads'] },
				{ type: 'text', content: 'These providers process data on our behalf and are contractually obligated to protect it.', class: 'mb-4' },
				{ type: 'subheading', content: '6.2 Legal Authorities' },
				{ type: 'text', content: 'When required by law, regulation, or legal process.', class: 'mb-4' },
				{ type: 'subheading', content: '6.3 Business Transfers' },
				{ type: 'text', content: 'In the event of a merger, acquisition, or restructuring, personal data may be transferred as part of business assets.' }
			]
		},
		{
			id: 'international-transfers',
			title: 'International Data Transfers',
			heading: '7. International Data Transfers',
			content: [
				{ type: 'text', content: 'Your personal data may be transferred to and processed in countries outside your jurisdiction, including countries that may not have equivalent data protection laws.' },
				{ type: 'text', content: 'We implement appropriate safeguards, including contractual protections, to ensure your data remains protected.' }
			]
		},
		{
			id: 'data-retention',
			title: 'Data Retention Policy',
			heading: '8. Data Retention Policy',
			content: [
				{ type: 'text', content: 'We retain personal data only for as long as necessary to:', class: '-mb-2.5' },
				{ type: 'list', items: [
					'Fulfill the purposes outlined in this Policy',
					'Comply with legal and regulatory obligations',
					'Resolve disputes and enforce agreements'
				], class: 'mb-4' },
				{ type: 'text', content: 'Retention periods may vary depending on the nature of the data.' }
			]
		},
		{
			id: 'data-security',
			title: 'Data Security Measures',
			heading: '9. Data Security Measures',
			content: [
				{ type: 'text', content: 'We implement appropriate technical and organizational measures, including:', class: '-mb-2.5' },
				{ type: 'list', items: [
					'Access control and authentication',
					'Secure data storage practices',
					'Monitoring and risk mitigation procedures'
				], class: 'mb-4' },
				{ type: 'text', content: 'However, no system is completely secure, and we cannot guarantee absolute protection.' }
			]
		},
		{
			id: 'your-rights',
			title: 'Your Rights',
			heading: '10. Your Rights',
			content: [
				{ type: 'text', content: 'Depending on applicable laws, you may have the right to:', class: '-mb-2.5' },
				{ type: 'list', items: [
					'Access your personal data',
					'Request correction or update',
					'Request deletion (“right to be forgotten”)',
					'Restrict or object to processing',
					'Withdraw consent at any time',
					'Request data portability'
				], class: 'mb-4' },
				{ type: 'text', content: 'Requests may be submitted through our contact details below.' }
			]
		},
		{
			id: 'automated-decision',
			title: 'Automated Decision-Making',
			heading: '11. Automated Decision-Making',
			content: [
				{ type: 'text', content: 'We do not engage in automated decision-making or profiling that produces legal or similarly significant effects.' }
			]
		},
		{
			id: 'third-party-websites',
			title: 'Third-Party Websites',
			heading: '12. Third-Party Websites',
			content: [
				{ type: 'text', content: 'Our website may contain links to third-party websites.', class: 'mb-2' },
				{ type: 'text', content: 'We are not responsible for their privacy practices, and we encourage you to review their policies separately' }
			]
		},
		{
			id: 'childrens-privacy',
			title: 'Children\'s Privacy',
			heading: '13. Children\'s Privacy',
			content: [
				{ type: 'text', content: 'Our services are not directed at individuals under the age of 18. We do not knowingly collect personal data from children.' }
			]
		},
		{
			id: 'updates',
			title: 'Updates to This Privacy Policy',
			heading: '14. Updates to This Privacy Policy',
			content: [
				{ type: 'text', content: 'We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective upon posting, and continued use of the website constitutes acceptance of the updated Policy.' }
			]
		},
		{
			id: 'contact',
			title: 'Contact Information',
			heading: '15. Contact Information',
			content: [
				{ type: 'text', content: 'If you have any questions, requests, or concerns regarding this Privacy Policy or your personal data, please contact us:' },
				{ type: 'text', content: 'Precious Contractor' },
				{ type: 'text', content: `Email: ${preciousemail}` },
				{ type: 'text', content: `Phone: ${preciousPhone}` }
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
	<title>Privacy Policy - Precious Contractor</title>
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
			<h1 class="text-3xl font-semibold text-white mb-6 tracking-tight">Privacy Policy</h1>

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
