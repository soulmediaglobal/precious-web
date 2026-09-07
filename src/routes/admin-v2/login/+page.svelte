<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';
  let { form }: PageProps = $props();
  let pending = $state(false);
  let showPassword = $state(false);
</script>

<main class="ta-login">
  <section aria-labelledby="login-title">
    <a href="/" aria-label="Precious Contractor website"><img src="/logo.svg" alt="Precious Contractor" width="79" height="55" /></a>
    <h1 id="login-title">Masuk ke CMS</h1>
    <p>Precious Contractor · Admin v2</p>
    <form method="POST" use:enhance={() => {
      pending = true;
      return async ({ update }) => { try { await update(); } finally { pending = false; } };
    }}>
      {#if form?.error}<div class="error" role="alert">{form.error}</div>{/if}
      <label for="email">Email <span aria-hidden="true">*</span></label>
      <input id="email" name="email" type="email" autocomplete="username" placeholder="Masukkan email" required />
      <label for="password">Password <span aria-hidden="true">*</span></label>
      <div class="password">
        <input id="password" name="password" type={showPassword ? 'text' : 'password'} autocomplete="current-password" placeholder="Masukkan password" required />
        <button type="button" class="reveal" aria-controls="password" aria-pressed={showPassword} onclick={() => showPassword = !showPassword}>{showPassword ? 'Sembunyikan' : 'Lihat'}</button>
      </div>
      <button class="submit" type="submit" disabled={pending}>{pending ? 'Memproses…' : 'Masuk'}</button>
    </form>
  </section>
</main>

<style>
  .ta-login { min-height:100dvh; display:grid; place-items:center; padding:32px 24px; background:#000; color:#d0d5dd; color-scheme:dark; font-family:'Outfit',sans-serif; -webkit-font-smoothing:antialiased; }
  .ta-login * { box-sizing:border-box; }
  section { width:100%; max-width:440px; }
  img { height:auto; margin-bottom:40px; }
  h1 { margin:0 0 8px; font-size:30px; line-height:38px; font-weight:600; color:#f2f4f7; }
  p { margin:0 0 32px; color:#98a2b3; font-size:14px; }
  label { display:block; margin:20px 0 8px; font-size:14px; font-weight:500; }
  label span { color:#f97066; }
  input { width:100%; height:48px; border:1px solid #344054; border-radius:8px; padding:12px 16px; background:transparent; color:#f2f4f7; font:inherit; font-size:14px; }
  input::placeholder { color:#667085; }
  .password { position:relative; }
  .password input { padding-right:116px; }
  button { cursor:pointer; font:inherit; font-size:14px; }
  .reveal { position:absolute; right:12px; top:0; height:48px; background:transparent; border:0; color:#98a2b3; }
  .submit { width:100%; margin-top:28px; padding:14px; background:#465fff; color:white; border:0; border-radius:8px; font-weight:500; }
  .submit:hover { background:#3641f5; }
  .submit:disabled { opacity:.6; cursor:wait; }
  .error { padding:14px 16px; border:1px solid #7a271a; border-radius:8px; background:#301411; color:#fda29b; font-size:14px; }
  :focus-visible { outline:2px solid #7592ff; outline-offset:3px; }
</style>
