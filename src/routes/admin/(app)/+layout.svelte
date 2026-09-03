<script lang="ts">
  import {
    Sidebar,
    SidebarButton,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
    Navbar,
    NavBrand,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownDivider
  } from 'flowbite-svelte';
  import {
    ChartPieOutline,
    BuildingOutline,
    BriefcaseOutline,
    UsersOutline,
    CogOutline
  } from 'flowbite-svelte-icons';
  import { page } from '$app/state';

  let { children, data } = $props();

  let activeUrl = $derived(page.url.pathname);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: ChartPieOutline },
    { label: 'Portfolio', href: '/admin/portfolio', icon: BuildingOutline },
    { label: 'Expertise', href: '/admin/expertise', icon: BriefcaseOutline },
    { label: 'Team', href: '/admin/team', icon: UsersOutline },
    { label: 'Settings', href: '/admin/settings', icon: CogOutline }
  ];

  let sidebarOpen = $state(false);

  async function handleLogout() {
    await fetch('/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
</script>

<div class="flex h-dvh min-h-0 w-full overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
  <Sidebar
    {activeUrl}
    isOpen={sidebarOpen}
    closeSidebar={() => (sidebarOpen = false)}
    position="fixed"
    classes={{ div: 'h-full overflow-hidden !p-0' }}
    class="h-dvh w-64 shrink-0 md:!static md:h-full"
  >
    <SidebarWrapper class="flex h-full flex-col rounded-none border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div class="flex h-20 shrink-0 items-center gap-3 border-b border-gray-200 px-5 dark:border-gray-700">
        <img src="/logo.svg" alt="Precious Contractor" class="h-10 w-auto shrink-0" />
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">Precious Contractor</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Content Management</p>
        </div>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-4 py-6" aria-label="Admin navigation">
        <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Workspace</p>
        <SidebarGroup class="space-y-1">
          {#each navItems as item (item.href)}
            <SidebarItem
              label={item.label}
              href={item.href}
              active={item.href === '/admin' ? activeUrl === item.href : activeUrl === item.href || activeUrl.startsWith(`${item.href}/`)}
              spanClass=""
              activeClass="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-900 dark:bg-gray-700 dark:text-white"
              nonActiveClass="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white"
            >
              {#snippet icon()}
                <item.icon class="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-400" />
              {/snippet}
            </SidebarItem>
          {/each}
        </SidebarGroup>
      </nav>

      <div class="shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
        <div class="min-w-0 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-700/60">
          <p class="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
          <p class="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{data.user?.email}</p>
        </div>
      </div>
    </SidebarWrapper>
  </Sidebar>

  <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
    <Navbar
      fluid
      navContainerClass="min-w-0 flex-nowrap gap-3"
      class="h-20 shrink-0 border-b border-gray-200 bg-white px-2 py-0 sm:px-4 lg:px-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex min-w-0 items-center gap-2">
        <SidebarButton breakpoint="md" onclick={() => (sidebarOpen = true)} />
        <NavBrand href="/admin">
          <span class="whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-200">Dashboard</span>
        </NavBrand>
      </div>
      <div class="flex min-w-0 shrink items-center gap-2 sm:gap-3">
        <span class="hidden max-w-48 truncate text-sm text-gray-600 sm:block dark:text-gray-300">{data.user?.email}</span>
        <Avatar id="avatar-menu" class="cursor-pointer" />
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
          <DropdownItem>Signed in as<br /><span class="font-medium">{data.user?.email}</span></DropdownItem>
          <DropdownDivider />
          <DropdownItem onclick={handleLogout}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>

    <main class="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
      <div class="mx-auto w-full max-w-screen-2xl">
        {@render children()}
      </div>
    </main>
  </div>
</div>
