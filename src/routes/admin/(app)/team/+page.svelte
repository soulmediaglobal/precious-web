<script lang="ts">
  let { data, form } = $props();
  const labels = { board: 'Board of Director', management: 'Management', staff: 'Staff' };
  function confirmDelete(event: MouseEvent, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) event.preventDefault();
  }
</script>

<svelte:head><title>Team - Precious Contractor Admin</title></svelte:head>

<div class="space-y-8">
  <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><h1 class="text-3xl font-bold tracking-tight">Team</h1><p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage people shown on the About page.</p></div>
    <a href="/admin/team/new" class="inline-flex justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900">Add team member</a>
  </header>
  {#if form?.message}<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{form.message}</div>{/if}
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    {#if data.members.length}
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each data.members as member (member.id)}
          <article class="grid gap-4 p-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:px-6">
            <img src={member.image} alt={member.name} class="aspect-[4/5] w-16 rounded-lg bg-gray-100 object-cover" />
            <div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h2 class="truncate font-semibold">{member.name}</h2><span class="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">{labels[member.group as keyof typeof labels]}</span>{#if !member.isActive}<span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">Hidden</span>{/if}</div><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{member.title} · Order {member.sortOrder}</p></div>
            <div class="flex items-center justify-end gap-2"><a href="/admin/team/{member.id}" class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Edit</a><form method="POST" action="?/delete"><input type="hidden" name="id" value={member.id} /><button class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onclick={(event) => confirmDelete(event, member.name)}>Delete</button></form></div>
          </article>
        {/each}
      </div>
    {:else}<div class="p-12 text-center"><p class="font-medium">No team members yet</p><p class="mt-2 text-sm text-gray-500">Add the first profile to get started.</p></div>{/if}
  </div>
</div>
