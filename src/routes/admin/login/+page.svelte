<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
  let loading = $state(false);
</script>

<svelte:head>
  <title>Admin Login - Precious Contractor</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
  <div class="bg-[#151515] border border-[#2a2a2a] p-8 rounded-lg shadow-xl w-full max-w-sm">
    <div class="flex justify-center mb-6">
      <img src="/logo.svg" alt="Precious Contractor" class="h-30" />
    </div>
    <h1 class="text-base font-medium mb-6 text-center text-white">Welcome to Precious Admin Access</h1>

    <form
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
      class="flex flex-col gap-4"
    >
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a321] focus:border-transparent placeholder-gray-600"
          placeholder="you@preciouscontractor.co.id"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          class="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a321] focus:border-transparent"
        />
      </div>

      {#if form?.error}
        <p class="text-red-400 text-sm">{form.error}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="bg-[#d4a321] text-black font-medium rounded py-2 mt-2 hover:bg-[#c4941d] transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  </div>
</div>
