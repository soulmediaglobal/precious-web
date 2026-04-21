<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const sections = [
		{ id: 'scope', title: 'Scope of This Policy' },
		{ id: 'definitions', title: 'Definitions' },
		{ id: 'categories', title: 'Categories of Personal Data Collected' },
		{ id: 'purposes', title: 'Purposes of Data Processing' },
		{ id: 'legal-basis', title: 'Legal Basis for Processing' },
		{ id: 'data-sharing', title: 'Data Sharing and Disclosure' },
		{ id: 'international-transfers', title: 'International Data Transfers' },
		{ id: 'data-retention', title: 'Data Retention Policy' },
		{ id: 'data-security', title: 'Data Security Measures' },
		{ id: 'your-rights', title: 'Your Rights' },
		{ id: 'automated-decision', title: 'Automated Decision-Making' },
		{ id: 'third-party-websites', title: 'Third-Party Websites' },
		{ id: 'childrens-privacy', title: 'Children\'s Privacy' },
		{ id: 'updates', title: 'Updates to This Privacy Policy' },
		{ id: 'contact', title: 'Contact Information' }
	];

	// let activeSectionId = $derived(page.url.searchParams.get('section') || '');
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
				<div class="mb-10">
          <div>
            This Privacy Policy describes how Precious Contractor ("we", "us", or "our") collects, uses,
            discloses, and safeguards your personal data when you access or use our website and
            services.
          </div>
          <div>
            Please read this Policy carefully. By using our services, you acknowledge that you have read
            and understood this Policy and agree to our processing of your personal data as described.
          </div>
				</div>

				<!-- Section 1 -->
				<div id="scope" class="mb-10 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-6">1. Scope of This Policy</h2>
					<p class="text-sm">This Privacy Policy applies to:</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Our core SaaS platform</li>
						<li>Public websites you access through [insert url] and other domains</li>
						<li>Any connected mobile or desktop applications</li>
					</ul>
					<p>
						It does NOT apply to any third-party websites, systems, or services linked from our
						website.
					</p>
				</div>

				<!-- Section 2 -->
				<div id="definitions" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">2. Definitions</h2>
					<p class="mb-2">For the purposes of this Privacy Policy:</p>
					<ul class="list-disc pl-5 space-y-1 text-neutral-400">
						<li>"Company" refers to Precious Contractor, legally established in [Country], [City]</li>
						<li>
							"Services" means all products, software, APIs, and websites operated by the Company
						</li>
						<li>
							"You" refers to the user or subscriber using the Services and their authorized
							personnel
						</li>
						<li>
							"Personal Data" means any information relating to an identified or identifiable natural
							person
						</li>
					</ul>
				</div>

				<!-- Section 3 -->
				<div id="categories" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">3. Categories of Personal Data Collected</h2>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">
						3.1 Information Provided Directly by You
					</h3>
					<p class="mb-2">When you interact with our services, you may provide us with:</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Full name</li>
						<li>Email address</li>
						<li>Phone number</li>
						<li>Billing and payment details</li>
					</ul>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">
						3.2 Automatically Collected Data
					</h3>
					<p class="mb-2">When you access our services, we may automatically collect:</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>IP address</li>
						<li>Device type and version</li>
						<li>Operating system and browser type</li>
						<li>Pages visited and interaction data</li>
						<li>Time and date of your visits</li>
						<li>Referring URLs</li>
					</ul>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">
						3.3 Cookies and Tracking Technologies
					</h3>
					<p class="mb-4">
						We use cookies and similar technologies to track activity on our Services and hold
						certain information.
					</p>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">
						3.4 Third-Party Integrations
					</h3>
					<ul class="list-disc pl-5 space-y-1 text-neutral-400">
						<li>Analytics providers</li>
						<li>Advertising networks</li>
						<li>Integration partners</li>
					</ul>
				</div>

				<!-- Section 4 -->
				<div id="purposes" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">4. Purposes of Data Processing</h2>
					<p class="mb-2">We process your personal data for the following purposes:</p>
					<ul class="list-disc pl-5 space-y-1 text-neutral-400">
						<li>To provide, maintain, and improve our services</li>
						<li>To manage user accounts and billing processes</li>
						<li>To process transactions and send related information</li>
						<li>To respond to your requests, comments, and questions</li>
						<li>To monitor and analyze trends, usage, and activities</li>
						<li>To comply with legal obligations</li>
						<li>To protect against, investigate, and deter fraudulent activities</li>
					</ul>
				</div>

				<!-- Section 5 -->
				<div id="legal-basis" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">5. Legal Basis for Processing</h2>
					<p class="mb-2">We rely on the following legal bases to process your data:</p>
					<ul class="list-disc pl-5 space-y-1 text-neutral-400">
						<li>Consent: When you have given us explicit consent</li>
						<li>Contract: When processing is necessary for the performance of a contract</li>
						<li>Legal Obligation: When processing is necessary to comply with a legal obligation</li>
						<li>Legitimate Interest: When processing is necessary for our legitimate interests</li>
					</ul>
				</div>

				<!-- Section 6 -->
				<div id="data-sharing" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">6. Data Sharing and Disclosure</h2>
					<p class="mb-4">
						We may share your personal data with third parties in the following circumstances:
					</p>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">6.1 Service Providers</h3>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Cloud hosting providers (e.g., AWS, Azure, Google Cloud)</li>
						<li>Payment processors</li>
						<li>Analytics services</li>
						<li>Customer support and CRM platforms</li>
					</ul>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">6.2 Legal Authorities</h3>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>When required by law or in response to legal process</li>
					</ul>

					<h3 class="text-lg font-medium text-neutral-200 mt-6 mb-2">6.3 Business Transfers</h3>
					<ul class="list-disc pl-5 space-y-1 text-neutral-400">
						<li>
							In the event of a merger, acquisition, reorganization, or sale of assets, your data
							may be transferred as part of that transaction
						</li>
					</ul>
				</div>

				<!-- Section 7 -->
				<div id="international-transfers" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">7. International Data Transfers</h2>
					<p class="mb-2">
						Your data may be transferred to, and processed in, countries other than the country in
						which you are resident. These countries may have data protection laws that are different
						from the laws of your country.
					</p>
					<p>
						We implement appropriate safeguards to ensure your personal data remains protected during
						international transfers.
					</p>
				</div>

				<!-- Section 8 -->
				<div id="data-retention" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">8. Data Retention Policy</h2>
					<p class="mb-2">We retain your personal data only for as long as necessary to:</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Fulfill the purposes outlined in this Policy</li>
						<li>Comply with our legal and regulatory obligations</li>
						<li>Resolve disputes and enforce our agreements</li>
					</ul>
					<p>Upon requesting account deletion, your data will be permanently erased.</p>
				</div>

				<!-- Section 9 -->
				<div id="data-security" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">9. Data Security Measures</h2>
					<p class="mb-2">
						We implement rigorous technical and organizational security measures, including:
					</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Encryption of data in transit and at rest</li>
						<li>Regular security audits and assessments</li>
						<li>Strict access controls and authentication</li>
						<li>Incident response and disaster recovery procedures</li>
					</ul>
					<p>
						However, no system is impenetrable, and we cannot guarantee the absolute security of your
						data.
					</p>
				</div>

				<!-- Section 10 -->
				<div id="your-rights" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">10. Your Rights</h2>
					<p class="mb-2">Depending on your jurisdiction, you may have the right to:</p>
					<ul class="list-disc pl-5 space-y-1 mb-4 text-neutral-400">
						<li>Access your personal data</li>
						<li>Correct inaccuracies in your data</li>
						<li>Request deletion ("right to be forgotten")</li>
						<li>Object to or restrict processing</li>
						<li>Data portability (receive a copy of your data)</li>
						<li>Withdraw consent at any time</li>
					</ul>
					<p>Requests to exercise these rights can be submitted to our contact address.</p>
				</div>

				<!-- Section 11 -->
				<div id="automated-decision" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">11. Automated Decision-Making</h2>
					<p>
						We do not engage in automated decision-making or profiling that produces legal or
						similarly significant effects.
					</p>
				</div>

				<!-- Section 12 -->
				<div id="third-party-websites" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">12. Third-Party Websites</h2>
					<p class="mb-2">Our services may contain links to third-party websites.</p>
					<p>
						We are not responsible for the privacy practices or content of such third-party sites.
						Please review their privacy policies.
					</p>
				</div>

				<!-- Section 13 -->
				<div id="childrens-privacy" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">13. Children's Privacy</h2>
					<p>
						Our services are not intended for individuals under the age of 18. We do not knowingly
						collect personal data from children.
					</p>
				</div>

				<!-- Section 14 -->
				<div id="updates" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">14. Updates to This Privacy Policy</h2>
					<p>
						We reserve the right to update this Privacy Policy at any time. We will notify you of any
						changes by posting the new policy on this page with a revised "Last Updated" date.
					</p>
				</div>

				<!-- Section 15 -->
				<div id="contact" class="mb-12 scroll-mt-24">
					<h2 class="text-xl font-semibold text-white mb-4">15. Contact Information</h2>
					<p class="mb-2">
						If you have any questions, concerns, or requests regarding this Privacy Policy or our
						practices, please contact our Data Protection Officer at:
					</p>
					<p class="text-neutral-400">Email: privacy@[company].com</p>
					<p class="text-neutral-400">Mailing Address: [Address]</p>
				</div>
			</div>
		</main>
	</div>
</div>
