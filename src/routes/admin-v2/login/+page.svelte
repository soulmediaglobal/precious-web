<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';
  let { form }: PageProps = $props();
  let pending = $state(false);
  let showPassword = $state(false);
</script>

<main class="precious-login">
  <section class="brand-panel" aria-label="Precious Contractor">
    <img class="architecture" src="/home-image-1.webp" alt="" fetchpriority="high" />
    <div class="shade" aria-hidden="true"></div>
    <img class="brand-curve" src="/mask-6.webp" alt="" />
    <a class="logo" href="/" aria-label="Precious Contractor website">
      <img src="/logo.svg" alt="Precious Contractor" width="118" height="82" />
    </a>
    <div class="brand-copy">
      <p class="eyebrow">PRECIOUS CONTRACTOR</p>
      <h2>BUILDING BETTER<br />SPACES TOGETHER<span>.</span></h2>
      <p class="support">Manage your projects, clients, and content — all in one place.</p>
    </div>
    <p class="brand-footer">PRECISION PLANNED. METICULOUSLY DELIVERED.</p>
  </section>

  <section class="login-panel" aria-labelledby="login-title">
    <div class="login-content">
      <div class="accent" aria-hidden="true"></div>
      <h1 id="login-title">Welcome Back</h1>
      <p class="intro">Sign in to your Precious CMS</p>
      <form method="POST" aria-busy={pending} use:enhance={() => {
        pending = true;
        return async ({ update }) => { try { await update(); } finally { pending = false; } };
      }}>
        {#if form?.error}<div id="login-error" class="error" role="alert">{form.error}</div>{/if}
        <label for="email">Email <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" autocomplete="username" placeholder="Enter your email" required aria-describedby={form?.error ? 'login-error' : undefined} />
        <label for="password">Password <span aria-hidden="true">*</span></label>
        <div class="password">
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} autocomplete="current-password" placeholder="Enter your password" required aria-describedby={form?.error ? 'login-error' : undefined} />
          <button type="button" class="reveal" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="password" aria-pressed={showPassword} onclick={() => showPassword = !showPassword}>{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        <button class="submit" type="submit" disabled={pending}><span>{pending ? 'Signing in…' : 'Sign In'}</span><span aria-hidden="true">↗</span></button>
      </form>
      <a class="back" href="/"><span aria-hidden="true">←</span> Back to website</a>
    </div>
    <p class="login-footer">Precious Contractor <span aria-hidden="true">/</span> Content Management System</p>
  </section>
</main>

<style>
  .precious-login { min-height:100dvh; display:grid; grid-template-columns:1fr 1fr; background:#060606; color:#fff; color-scheme:dark; font-family:'Montserrat',ui-sans-serif,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .precious-login * { box-sizing:border-box; }
  .brand-panel { position:relative; isolation:isolate; display:flex; flex-direction:column; justify-content:space-between; min-width:0; overflow:hidden; padding:48px clamp(32px,4.5vw,72px); background:#0d172d; }
  .architecture,.shade { position:absolute; inset:0; width:100%; height:100%; z-index:-3; }
  .architecture { object-fit:cover; object-position:48% center; }
  .shade { z-index:-2; background:linear-gradient(180deg,rgba(5,12,28,.45),rgba(5,12,28,.8)); }
  .brand-curve { position:absolute; right:-16%; bottom:-18%; height:76%; width:auto; max-width:none; z-index:-1; pointer-events:none; opacity:.9; }
  .logo { align-self:flex-start; display:inline-flex; }
  .logo img { width:118px; height:auto; }
  .brand-copy { padding:72px 0; }
  .eyebrow { margin:0 0 24px; color:#e0b126; font-size:11px; line-height:1.5; letter-spacing:.18em; font-weight:500; }
  h2 { margin:0; font-size:clamp(30px,3.1vw,50px); line-height:1.16; letter-spacing:-.035em; font-weight:500; }
  h2 span { color:#e0b126; }
  .support { max-width:340px; margin:28px 0 0; color:#cfcfcf; font-size:14px; line-height:1.85; }
  .brand-footer { margin:0; font-size:9px; line-height:1.6; letter-spacing:.13em; color:#cfcfcf; }
  .login-panel { position:relative; min-width:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:88px 48px; }
  .login-content { width:100%; max-width:400px; }
  .accent { width:44px; height:3px; background:#e0b126; margin-bottom:28px; }
  h1 { margin:0 0 12px; font-size:34px; line-height:1.2; letter-spacing:-.035em; font-weight:500; }
  .intro { margin:0 0 40px; color:#aeaeae; font-size:14px; line-height:1.6; }
  label { display:block; margin:24px 0 10px; font-size:13px; font-weight:500; }
  label span { color:#e0b126; }
  input { width:100%; min-width:0; height:52px; border:1px solid #575757; border-radius:2px; padding:14px 16px; background:transparent; color:#fff; font:inherit; font-size:13px; }
  input::placeholder { color:#aeaeae; }
  .password { position:relative; }
  .password input { padding-right:78px; }
  button { cursor:pointer; font:inherit; font-size:13px; }
  .reveal { position:absolute; right:4px; top:4px; height:44px; min-width:64px; background:transparent; border:0; color:#cfcfcf; }
  .reveal:hover { color:#e0b126; }
  .submit { display:flex; align-items:center; justify-content:space-between; width:100%; min-height:52px; margin-top:28px; padding:14px 20px; background:#e0b126; color:#111; border:0; border-radius:2px; font-weight:600; }
  .submit:hover { filter:brightness(1.08); }
  .submit:disabled { opacity:.6; cursor:wait; }
  .submit span:last-child { font-size:21px; line-height:1; }
  .back { display:inline-flex; align-items:center; gap:10px; min-height:44px; margin-top:24px; color:#aeaeae; font-size:12px; text-decoration:none; }
  .back:hover { color:#fff; }
  .login-footer { position:absolute; bottom:32px; margin:0; padding:0 24px; color:#aeaeae; font-size:10px; line-height:1.8; text-align:center; }
  .login-footer span { padding:0 8px; color:#e0b126; }
  .error { padding:14px 16px; border:1px solid #7a271a; border-radius:2px; background:#301411; color:#fda29b; font-size:13px; line-height:1.6; overflow-wrap:anywhere; }
  :focus-visible { outline:2px solid #e0b126; outline-offset:4px; }
  @media (max-width:1100px) {
    .brand-panel { padding:36px 32px; }
    .login-panel { padding:80px 36px; }
    h2 { font-size:32px; }
    h1 { font-size:30px; }
  }
  @media (max-width:767px) {
    .precious-login { grid-template-columns:1fr; grid-template-rows:auto 1fr; }
    .brand-panel { padding:24px; min-height:260px; }
    .logo img { width:88px; }
    .architecture { object-position:center 42%; }
    .brand-copy { padding:28px 0 0; }
    .eyebrow,.support,.brand-footer { display:none; }
    h2 { font-size:28px; max-width:360px; }
    .brand-curve { height:145%; right:-10%; bottom:-65%; }
    .login-panel { justify-content:flex-start; padding:36px 24px 24px; }
    .accent { margin-bottom:20px; width:36px; }
    h1 { font-size:28px; }
    .intro { margin-bottom:28px; font-size:13px; }
    label { margin-top:20px; }
    .login-footer { position:static; margin-top:28px; padding:0; font-size:9px; }
    .back { margin-top:18px; }
  }
</style>
