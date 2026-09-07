<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { icons } from './icons';
  import './shell.css';

  let { children } = $props();
  let isLogin = $derived(page.url.pathname === '/admin-v2/login');
  let isTeam = $derived(
    /^\/admin-v2\/team(?:\/|$)/.test(page.url.pathname)
  );
  let isClients = $derived(/^\/admin-v2\/clients(?:\/|$)/.test(page.url.pathname));
  let isProjects = $derived(/^\/admin-v2\/projects(?:\/|$)/.test(page.url.pathname));
  let isPortfolio = $derived(/^\/admin-v2\/portfolio(?:\/|$)/.test(page.url.pathname));
  let isContact = $derived(/^\/admin-v2\/contact(?:\/|$)/.test(page.url.pathname));
  let selected = $derived(isContact ? 'Contact Inbox' : isPortfolio ? 'Portfolio' : isTeam ? 'Team' : isClients ? 'Clients' : isProjects ? 'Projects' : 'Dashboard');
  let mobile = $state(false);
  let open = $state(false);
  let collapsed = $state(false);
  let headerOpen = $state(false);
  let sidebar = $state<HTMLElement>();
  let toggle = $state<HTMLButtonElement>();

  const groups = [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', icon: 'dashboard', href: '/admin-v2' }]
    },
    {
      title: 'Management',
      items: [
        { label: 'Contact Inbox', icon: 'clients', href: '/admin-v2/contact' },
        { label: 'Clients', icon: 'clients', href: '/admin-v2/clients' },
        { label: 'Projects', icon: 'projects', href: '/admin-v2/projects' }
      ]
    },
    {
      title: 'Content',
      items: [{ label: 'Portfolio', icon: 'projects', href: '/admin-v2/portfolio' }, { label: 'Team', icon: 'team', href: '/admin-v2/team' }]
    }
  ] as const;

  onMount(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const resize = () => {
      mobile = media.matches;
      open = false;
    };
    resize();
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  });

  async function close() {
    open = false;
    await tick();
    toggle?.focus();
  }

  async function toggleNav() {
    if (!mobile) {
      collapsed = !collapsed;
      return;
    }
    if (open) {
      await close();
      return;
    }
    open = true;
    await tick();
    sidebar?.querySelector<HTMLButtonElement>('button')?.focus();
  }

  function keyboard(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (open) void close();
      headerOpen = false;
    }
    if (!mobile || !open || event.key !== 'Tab' || !sidebar) return;

    const elements = [...sidebar.querySelectorAll<HTMLElement>('a, button')];
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
</script>

<svelte:window onkeydown={keyboard} />

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{isLogin ? 'Login' : selected} | Precious Admin v2</title>
</svelte:head>

{#if isLogin}
  {@render children()}
{:else}
  <div class="ta-shell" class:nav-open={open} class:nav-collapsed={collapsed}>
    <a class="ta-skip" href="#v2-main">Skip to content</a>

    {#if open && mobile}
      <button class="ta-overlay" tabindex="-1" aria-label="Close navigation" onclick={close}></button>
    {/if}

    <aside id="v2-sidebar" class="ta-sidebar" bind:this={sidebar} inert={mobile && !open} aria-label="Main navigation">
      <div class="ta-sidebar-header">
        <a href="/admin-v2" aria-label="Precious dashboard">
          <img class="ta-logo" src="/logo.svg" alt="Precious Contractor" width="91" height="63" />
        </a>
        <button class="ta-close" aria-label="Close navigation" onclick={close}>×</button>
      </div>

      <nav>
        {#each groups as group}
          <section class="ta-nav-group" aria-label={group.title}>
            <h2>
              <span class="ta-label">{group.title}</span>
              <span class="ta-dots" aria-hidden="true">···</span>
            </h2>
            <ul>
              {#each group.items as item}
                <li>
                  <a
                    class="ta-menu-item"
                    class:ta-active={selected === item.label}
                    href={item.href}
                    aria-current={selected === item.label ? 'page' : undefined}
                    title={item.label}
                    onclick={() => { if (mobile) void close(); }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" clip-rule="evenodd" d={icons[item.icon]} />
                    </svg>
                    <span class="ta-label">{item.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </nav>
    </aside>

    <div class="ta-content" inert={mobile && open}>
      <header class="ta-header">
        <div class="ta-header-main">
          <button
            class="ta-icon-button"
            bind:this={toggle}
            aria-label={mobile ? 'Open navigation' : collapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-controls="v2-sidebar"
            aria-expanded={mobile ? open : !collapsed}
            onclick={toggleNav}
          >
            <svg width="20" height="16" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" clip-rule="evenodd" d={icons.menu} />
            </svg>
          </button>
          <span class="ta-header-title">Precious Contractor</span>
          <a class="ta-mobile-brand" href="/admin-v2">
            <img src="/logo.svg" alt="Precious Contractor" width="91" height="63" />
          </a>
          <button
            class="ta-header-toggle ta-icon-button"
            aria-label="Toggle header menu"
            aria-expanded={headerOpen}
            aria-controls="v2-header-menu"
            onclick={() => headerOpen = !headerOpen}
          >···</button>
        </div>

        <div id="v2-header-menu" class="ta-header-menu" class:ta-header-visible={headerOpen}>
          <span>Admin v2</span>
          <span class="ta-badge">Preview</span>
          <form method="POST" action="/admin-v2/logout">
            <button class="ta-icon-button" style="width:auto;padding:0 12px" type="submit">Keluar</button>
          </form>
        </div>
      </header>

      <main id="v2-main" tabindex="-1">
        {@render children()}
      </main>
    </div>
  </div>
{/if}
