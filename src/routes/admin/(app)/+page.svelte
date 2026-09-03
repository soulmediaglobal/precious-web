<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Admin Dashboard - Precious Contractor</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
    <p class="mt-2 text-sm text-gray-500 sm:text-base dark:text-gray-400">Manage the content displayed on the Precious Contractor website.</p>
  </header>

  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800">
    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Welcome back</p>
    <h2 class="mt-1 break-words text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{data.user?.email}</h2>
    <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
      The admin dashboard is ready. Portfolio, expertise, team, and site settings can be managed from the navigation.
    </p>
  </section>
</div>
