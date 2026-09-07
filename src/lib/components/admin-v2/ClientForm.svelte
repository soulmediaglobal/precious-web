<script lang="ts">
  type Values = {
    companyName: string;
    companyType: string | null;
    address: string | null;
    directorName: string | null;
    directorPhone: string | null;
    directorEmail: string | null;
    picName: string | null;
    picPhone: string | null;
    picEmail: string | null;
  };
  type FormResult = { values?: Values; errors?: Record<string, string>; message?: string };
  let { client = null, form = null, companyTypes, submitLabel = 'Save client' }: {
    client?: Values | null;
    form?: FormResult | null;
    companyTypes: readonly string[];
    submitLabel?: string;
  } = $props();
  let values = $derived(form?.values ?? client);
  let errors = $derived(form?.errors ?? {});
</script>

<form method="POST" class="client-form">
  {#if form?.message}<div class="notice" role="alert">{form.message}</div>{/if}
  <section class="panel" aria-labelledby="company-heading">
    <h2 id="company-heading">Client information</h2>
    <p class="intro">Company and primary contact details.</p>
    <div class="fields">
      <label class="field">
        <span>Company name *</span>
        <input name="companyName" value={values?.companyName ?? ''} required aria-invalid={!!errors.companyName} />
        {#if errors.companyName}<small>{errors.companyName}</small>{/if}
      </label>
      <label class="field">
        <span>Company type *</span>
        <select name="companyType" required aria-invalid={!!errors.companyType}>
          <option value="">Select company type</option>
          {#each companyTypes as type (type)}
            <option value={type} selected={values?.companyType === type}>{type}</option>
          {/each}
        </select>
        {#if errors.companyType}<small>{errors.companyType}</small>{/if}
      </label>
      <label class="field full">
        <span>Address</span>
        <textarea name="address" rows="4">{values?.address ?? ''}</textarea>
      </label>
    </div>
  </section>
  <div class="contacts">
    <section class="panel" aria-labelledby="director-heading">
      <h2 id="director-heading">Direktur</h2>
      <p class="intro">Data penanggung jawab perusahaan.</p>
      <div class="contact-fields">
        <label class="field">
          <span>Nama Direktur *</span>
          <input name="directorName" type="text" value={values?.directorName ?? ''} required aria-invalid={!!errors.directorName} />
          {#if errors.directorName}<small>{errors.directorName}</small>{/if}
        </label>
        <label class="field">
          <span>Email Direktur</span>
          <input name="directorEmail" type="email" value={values?.directorEmail ?? ''} aria-invalid={!!errors.directorEmail} />
          {#if errors.directorEmail}<small>{errors.directorEmail}</small>{/if}
        </label>
        <label class="field">
          <span>Nomor HP Direktur</span>
          <input name="directorPhone" type="tel" value={values?.directorPhone ?? ''} aria-invalid={!!errors.directorPhone} />
          {#if errors.directorPhone}<small>{errors.directorPhone}</small>{/if}
        </label>
      </div>
    </section>
    <section class="panel" aria-labelledby="pic-heading">
      <h2 id="pic-heading">PIC</h2>
      <p class="intro">Kontak operasional utama project.</p>
      <div class="contact-fields">
        <label class="field">
          <span>Nama PIC *</span>
          <input name="picName" type="text" value={values?.picName ?? ''} required aria-invalid={!!errors.picName} />
          {#if errors.picName}<small>{errors.picName}</small>{/if}
        </label>
        <label class="field">
          <span>Email PIC</span>
          <input name="picEmail" type="email" value={values?.picEmail ?? ''} aria-invalid={!!errors.picEmail} />
          {#if errors.picEmail}<small>{errors.picEmail}</small>{/if}
        </label>
        <label class="field">
          <span>Nomor HP PIC</span>
          <input name="picPhone" type="tel" value={values?.picPhone ?? ''} aria-invalid={!!errors.picPhone} />
          {#if errors.picPhone}<small>{errors.picPhone}</small>{/if}
        </label>
      </div>
    </section>
  </div>
  <div class="actions">
    <a class="button" href="/admin-v2/clients">Cancel</a>
    <button class="button primary" type="submit">{submitLabel}</button>
  </div>
</form>

<style>

  .client-form { display: grid; gap: 24px; min-width: 0; }
  .panel { padding: 24px; border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); }
  h2 { margin: 0; font-size: 18px; font-weight: 600; color: #f2f4f7; }
  .intro { margin: 8px 0 24px; font-size: 14px; line-height: 22px; color: var(--ta-muted); }
  .fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .field { display: flex; min-width: 0; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 500; }
  .full { grid-column: 1 / -1; }
  .field input, .field select, .field textarea { width: 100%; min-width: 0; min-height: 44px; border: 1px solid var(--ta-border); border-radius: 8px; background: #000; padding: 10px 12px; color: var(--ta-text); font: inherit; }
  .field textarea { resize: vertical; }
  .field input::placeholder { color: var(--ta-muted); }
  .field small { color: #fda29b; font-weight: 400; }
  .actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 10px 18px; border: 1px solid var(--ta-border); border-radius: 8px; background: transparent; color: var(--ta-text); font: inherit; font-size: 14px; font-weight: 500; text-decoration: none; }
  .button:hover { background: rgb(255 255 255 / 6%); }
  .primary { background: #465fff; border-color: #465fff; color: white; }
  .primary:hover { background: #3641f5; }
  .notice { padding: 14px 16px; border: 1px solid rgb(240 68 56 / 30%); border-radius: 8px; color: #fda29b; font-size: 14px; overflow-wrap: anywhere; }
  @media (max-width: 767px) {
    .panel { padding: 20px 16px; }
    .fields { grid-template-columns: minmax(0, 1fr); }
  }
  .contacts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .contact-fields { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
  @media (max-width: 767px) { .contacts { grid-template-columns: minmax(0, 1fr); } }
</style>
