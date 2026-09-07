<script lang="ts">
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  const labels: Record<string, string> = {
    board: 'Board of Director',
    management: 'Management',
    staff: 'Staff'
  };

  function confirmDelete(event: SubmitEvent, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      event.preventDefault();
    }
  }
</script>

<svelte:head>
  <title>Team | Precious Admin v2</title>
</svelte:head>

<div class="team-page">
  <header class="team-heading">
    <div>
      <p class="breadcrumb"><a href="/admin-v2">Home</a> / Team</p>
      <h1>Team</h1>
      <p class="intro">Manage people shown on the About page.</p>
    </div>
    <a class="button primary" href="/admin-v2/team/new">Add team member</a>
  </header>

  {#if form?.message}
    <div class="notice error" role="alert">{form.message}</div>
  {/if}

  {#if form?.success}
    <div class="notice" role="status">Team member deleted.</div>
  {/if}

  <section class="team-panel" aria-label="Team members">
    {#if data.members.length}
      <ul class="member-list">
        {#each data.members as member (member.id)}
          <li class="member">
            <img class="portrait" src={member.image} alt={member.name} />
            <div class="profile">
              <div class="name-row">
                <h2>{member.name}</h2>
                <span class="badge">{labels[member.group] ?? member.group}</span>
                {#if !member.isActive}
                  <span class="badge hidden-badge">Hidden</span>
                {/if}
              </div>
              <p class="details">{member.title} · Order {member.sortOrder}</p>
            </div>
            <div class="actions">
              <a
                class="button"
                href={`/admin-v2/team/${member.id}`}
                aria-label={`Edit ${member.name}`}
              >Edit</a>
              <form
                method="POST"
                action="?/delete"
                onsubmit={(event) => confirmDelete(event, member.name)}
              >
                <input type="hidden" name="id" value={member.id} />
                <button
                  class="button danger"
                  type="submit"
                  aria-label={`Delete ${member.name}`}
                >Delete</button>
              </form>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="empty">
        <h2>No team members yet</h2>
        <p>Add the first profile to get started.</p>
      </div>
    {/if}
  </section>
</div>

<style>
  .team-page { display: grid; gap: 24px; min-width: 0; }
  .team-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
  .breadcrumb { margin: 0 0 12px; font-size: 14px; color: var(--ta-muted); }
  .breadcrumb a { color: inherit; text-decoration: none; }
  .breadcrumb a:hover { color: var(--ta-brand); }
  h1 { margin: 0; font-size: 28px; line-height: 36px; font-weight: 600; color: #f2f4f7; }
  .intro { margin: 8px 0 0; font-size: 14px; color: var(--ta-muted); }
  .team-panel { border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); overflow: hidden; }
  .member-list { list-style: none; margin: 0; padding: 0; }
  .member { display: grid; grid-template-columns: 64px minmax(0, 1fr) auto; align-items: center; gap: 20px; padding: 24px; }
  .member + .member { border-top: 1px solid var(--ta-border); }
  .portrait { width: 64px; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 8px; background: #171717; }
  .profile { min-width: 0; overflow-wrap: anywhere; }
  .name-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 600; color: #f2f4f7; }
  .details { margin: 6px 0 0; font-size: 14px; color: var(--ta-muted); }
  .badge { padding: 4px 9px; border-radius: 999px; background: rgb(255 255 255 / 6%); color: var(--ta-text); font-size: 12px; }
  .hidden-badge { background: rgb(247 144 9 / 12%); color: #fec84b; }
  .actions { display: flex; justify-content: flex-end; gap: 8px; }
  .actions form { margin: 0; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 10px 16px; border: 1px solid var(--ta-border); border-radius: 8px; background: transparent; color: var(--ta-text); font: inherit; font-size: 14px; font-weight: 500; text-decoration: none; }
  .button:hover { background: rgb(255 255 255 / 6%); }
  .primary { background: #465fff; border-color: #465fff; color: white; }
  .primary:hover { background: #3641f5; }
  .danger { border-color: rgb(240 68 56 / 30%); color: #fda29b; }
  .danger:hover { background: rgb(240 68 56 / 10%); }
  .notice { padding: 14px 16px; border: 1px solid var(--ta-border); border-radius: 8px; font-size: 14px; }
  .error { border-color: rgb(240 68 56 / 30%); color: #fda29b; }
  .empty { padding: 48px 24px; text-align: center; }
  .empty p { margin: 8px 0 0; color: var(--ta-muted); font-size: 14px; }
  @media (max-width: 767px) {
    .team-heading { align-items: flex-start; flex-direction: column; }
    h1 { font-size: 24px; line-height: 32px; }
    .member { grid-template-columns: 64px minmax(0, 1fr); gap: 16px; padding: 16px; }
    .actions { grid-column: 1 / -1; }
  }
</style>
