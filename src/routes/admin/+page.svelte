<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Admin Dashboard - Precious Contractor</title>
</svelte:head>

<div class="p-8">
  <h1 class="text-2xl font-semibold">Welcome, {data.user?.email}</h1>
  <p class="text-gray-600 mt-2">Admin dashboard is under construction.</p>
</div>
