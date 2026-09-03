<script lang="ts">
  import {
    Sidebar,
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

  let dropdownOpen = $state(false);

  async function handleLogout() {
    await fetch('/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
</script>

<div class="flex h-screen bg-gray-50 dark:bg-gray-900">
  <Sidebar {activeUrl} class="h-full w-64 flex-shrink-0">
    <SidebarWrapper class="h-full rounded-none border-r border-gray-200 dark:border-gray-700">
      <div class="mb-6 flex items-center gap-2 px-2">
        <img src="/logo.svg" alt="Precious Contractor" class="h-8" />
      </div>
      <SidebarGroup>
        {#each navItems as item (item.href)}
          <SidebarItem label={item.label} href={item.href}>
            {#snippet icon()}
              <item.icon class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {/snippet}
          </SidebarItem>
        {/each}
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>

  <div class="flex flex-1 flex-col overflow-hidden">
    <Navbar class="border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
      <NavBrand>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Panel</span>
      </NavBrand>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600 dark:text-gray-300">{data.user?.email}</span>
        <Avatar id="avatar-menu" class="cursor-pointer" />
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
          <DropdownItem>Signed in as<br /><span class="font-medium">{data.user?.email}</span></DropdownItem>
          <DropdownDivider />
          <DropdownItem onclick={handleLogout}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>

    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>
</div>
