<script lang="ts">import TeamForm from '$lib/components/admin/TeamForm.svelte'; let { data, form } = $props();</script>
<svelte:head><title>Edit {data.member.name} - Precious Contractor Admin</title></svelte:head>
<div class="mx-auto max-w-4xl space-y-8"><header><a href="/admin/team" class="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">← Back to team</a><h1 class="mt-4 text-3xl font-bold tracking-tight">Edit team member</h1><p class="mt-2 text-sm text-gray-500">{data.member.name}</p></header><TeamForm member={data.member} {form} submitLabel="Save changes" /></div>
