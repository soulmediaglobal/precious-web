<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

  import { preciousemail, preciousPhone } from '$lib';

	const introTexts = [
		`This Privacy Policy describes how Precious Contractor ("we", "us", or "our") collects, uses,
            discloses, and safeguards your personal data when you access or use our website and
            services.`,
		`Please read this Policy carefully. By using our services, you acknowledge that you have read
            and understood this Policy and agree to our processing of your personal data as described.`
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
                { type: 'text', content: 'This Privacy Policy applies to:' },
                { 
                    type: 'list', 
                    items: [
                        'Our core SaaS platform',
                        'Public websites you access through [insert url] and other domains',
                        'Any connected mobile or desktop applications'
                    ],
                    class: 'mb-4'
                },
                { type: 'text', content: 'It does NOT apply to any third-party websites, systems, or services linked from our website.' }
            ]
		},
		{
			id: 'definitions',
			title: 'Definitions',
			heading: '2. Definitions',
			content: [
                { type: 'text', content: 'For the purposes of this Privacy Policy:' },
                {
                    type: 'list',
                    items: [
                        '"Company" refers to Precious Contractor, legally established in [Country], [City]',
                        '"Services" means all products, software, APIs, and websites operated by the Company',
                        '"You" refers to the user or subscriber using the Services and their authorized personnel',
                        '"Personal Data" means any information relating to an identified or identifiable natural person'
                    ]
                }
            ]
		},
		{
			id: 'categories',
			title: 'Categories of Personal Data Collected',
			heading: '3. Categories of Personal Data Collected',
			content: [
                { type: 'subheading', content: '3.1 Information Provided Directly by You' },
                { type: 'text', content: 'When you interact with our services, you may provide us with:' },
                { type: 'list', items: ['Full name', 'Email address', 'Phone number', 'Billing and payment details'], class: 'mb-4' },

                { type: 'subheading', content: '3.2 Automatically Collected Data' },
                { type: 'text', content: 'When you access our services, we may automatically collect:' },
                { type: 'list', items: ['IP address', 'Device type and version', 'Operating system and browser type', 'Pages visited and interaction data', 'Time and date of your visits', 'Referring URLs'], class: 'mb-4' },

                { type: 'subheading', content: '3.3 Cookies and Tracking Technologies' },
                { type: 'text', content: 'We use cookies and similar technologies to track activity on our Services and hold certain information.', class: 'mb-4' },

                { type: 'subheading', content: '3.4 Third-Party Integrations' },
                { type: 'list', items: ['Analytics providers', 'Advertising networks', 'Integration partners'] }
            ]
		},
		{
			id: 'purposes',
			title: 'Purposes of Data Processing',
			heading: '4. Purposes of Data Processing',
			content: [
                { type: 'text', content: 'We process your personal data for the following purposes:' },
                { type: 'list', items: ['To provide, maintain, and improve our services', 'To manage user accounts and billing processes', 'To process transactions and send related information', 'To respond to your requests, comments, and questions', 'To monitor and analyze trends, usage, and activities', 'To comply with legal obligations', 'To protect against, investigate, and deter fraudulent activities'] }
            ]
		},
		{
			id: 'legal-basis',
			title: 'Legal Basis for Processing',
			heading: '5. Legal Basis for Processing',
			content: [
                { type: 'text', content: 'We rely on the following legal bases to process your data:' },
                { type: 'list', items: ['Consent: When you have given us explicit consent', 'Contract: When processing is necessary for the performance of a contract', 'Legal Obligation: When processing is necessary to comply with a legal obligation', 'Legitimate Interest: When processing is necessary for our legitimate interests'] }
            ]
		},
		{
			id: 'data-sharing',
			title: 'Data Sharing and Disclosure',
			heading: '6. Data Sharing and Disclosure',
			content: [
                { type: 'text', content: 'We may share your personal data with third parties in the following circumstances:' },
                { type: 'subheading', content: '6.1 Service Providers' },
                { type: 'list', items: ['Cloud hosting providers (e.g., AWS, Azure, Google Cloud)', 'Payment processors', 'Analytics services', 'Customer support and CRM platforms'], class: 'mb-4' },
                { type: 'subheading', content: '6.2 Legal Authorities' },
                { type: 'list', items: ['When required by law or in response to legal process'], class: 'mb-4' },
                { type: 'subheading', content: '6.3 Business Transfers' },
                { type: 'list', items: ['In the event of a merger, acquisition, reorganization, or sale of assets, your data may be transferred as part of that transaction'] }
            ]
		},
		{
			id: 'international-transfers',
			title: 'International Data Transfers',
			heading: '7. International Data Transfers',
			content: [
                { type: 'text', content: 'Your data may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country.' },
                { type: 'text', content: 'We implement appropriate safeguards to ensure your personal data remains protected during international transfers.' }
            ]
		},
		{
			id: 'data-retention',
			title: 'Data Retention Policy',
			heading: '8. Data Retention Policy',
			content: [
                { type: 'text', content: 'We retain your personal data only for as long as necessary to:' },
                { type: 'list', items: ['Fulfill the purposes outlined in this Policy', 'Comply with our legal and regulatory obligations', 'Resolve disputes and enforce our agreements'], class: 'mb-4' },
                { type: 'text', content: 'Upon requesting account deletion, your data will be permanently erased.' }
            ]
		},
		{
			id: 'data-security',
			title: 'Data Security Measures',
			heading: '9. Data Security Measures',
			content: [
                { type: 'text', content: 'We implement rigorous technical and organizational security measures, including:' },
                { type: 'list', items: ['Encryption of data in transit and at rest', 'Regular security audits and assessments', 'Strict access controls and authentication', 'Incident response and disaster recovery procedures'], class: 'mb-4' },
                { type: 'text', content: 'However, no system is impenetrable, and we cannot guarantee the absolute security of your data.' }
            ]
		},
		{
			id: 'your-rights',
			title: 'Your Rights',
			heading: '10. Your Rights',
			content: [
                { type: 'text', content: 'Depending on your jurisdiction, you may have the right to:' },
                { type: 'list', items: ['Access your personal data', 'Correct inaccuracies in your data', 'Request deletion ("right to be forgotten")', 'Object to or restrict processing', 'Data portability (receive a copy of your data)', 'Withdraw consent at any time'], class: 'mb-4' },
                { type: 'text', content: 'Requests to exercise these rights can be submitted to our contact address.' }
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
                { type: 'text', content: 'Our services may contain links to third-party websites.', class: 'mb-2' },
                { type: 'text', content: 'We are not responsible for the privacy practices or content of such third-party sites. Please review their privacy policies.' }
            ]
		},
		{
			id: 'childrens-privacy',
			title: 'Children\'s Privacy',
			heading: '13. Children\'s Privacy',
			content: [
                { type: 'text', content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children.' }
            ]
		},
		{
			id: 'updates',
			title: 'Updates to This Privacy Policy',
			heading: '14. Updates to This Privacy Policy',
			content: [
                { type: 'text', content: 'We reserve the right to update this Privacy Policy at any time. We will notify you of any changes by posting the new policy on this page with a revised "Last Updated" date.' }
            ]
		},
		{
			id: 'contact',
			title: 'Contact Information',
			heading: '15. Contact Information',
			content: [
                { type: 'text', content: 'If you have any questions, concerns, or requests regarding this Privacy Policy or our practices, please contact our Data Protection Officer at:' },
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
