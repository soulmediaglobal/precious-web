<script lang="ts">
import './layout.css';

import Header from '$lib/components/Header.svelte';
import Footer from '$lib/components/Footer.svelte';

let { children, data } = $props();
</script>

<Header />
{@render children()}
<Footer email={data.settings.email} phone={data.settings.phone} />
