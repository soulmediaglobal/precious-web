<script lang="ts">
  type Values = {
    name: string;
    title: string;
    group: string;
    description: string | null;
    email: string | null;
    linkedin: string | null;
    image: string;
    sortOrder: number;
    isActive: boolean;
  };

  type FormResult = {
    values?: Values;
    errors?: Record<string, string>;
    message?: string;
  };

  let {
    member = null,
    form = null,
    submitLabel = 'Save team member'
  }: {
    member?: Values | null;
    form?: FormResult | null;
    submitLabel?: string;
  } = $props();

  let values = $derived(form?.values ?? member);
  let errors = $derived(form?.errors ?? {});
  let imageFileError = $state('');

  function validateImageFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    imageFileError = file && file.size > 1024 * 1024
      ? 'Image must be 1 MB or smaller.'
      : '';
    input.setCustomValidity(imageFileError);
  }
</script>

<form method="POST" enctype="multipart/form-data" class="team-form">
  {#if form?.message}
    <div class="notice" role="alert">{form.message}</div>
  {/if}

  <section class="panel" aria-labelledby="profile-heading">
    <h2 id="profile-heading">Profile information</h2>
    <p class="intro">Basic information displayed on the About page.</p>

    <div class="fields">
      <label class="field">
        <span>Name *</span>
        <input name="name" value={values?.name ?? ''} required aria-invalid={!!errors.name} />
        {#if errors.name}<small>{errors.name}</small>{/if}
      </label>

      <label class="field">
        <span>Job title *</span>
        <input name="title" value={values?.title ?? ''} required aria-invalid={!!errors.title} />
        {#if errors.title}<small>{errors.title}</small>{/if}
      </label>

      <label class="field">
        <span>Hierarchy *</span>
        <select name="group" value={values?.group ?? 'staff'} aria-invalid={!!errors.group}>
          <option value="board">Board of Director</option>
          <option value="management">Management</option>
          <option value="staff">Staff</option>
        </select>
        {#if errors.group}<small>{errors.group}</small>{/if}
      </label>

      <label class="field">
        <span>Display order *</span>
        <input name="sortOrder" type="number" min="0" value={values?.sortOrder ?? 0} required aria-invalid={!!errors.sortOrder} />
        {#if errors.sortOrder}<small>{errors.sortOrder}</small>{/if}
      </label>

      <label class="field full">
        <span>Description</span>
        <textarea name="description" rows="5" aria-describedby="description-help" aria-invalid={!!errors.description}>{values?.description ?? ''}</textarea>
        <span id="description-help" class="help">Required for Board of Director; optional for Management and Staff.</span>
        {#if errors.description}<small>{errors.description}</small>{/if}
      </label>
    </div>
  </section>

  <section class="panel" aria-labelledby="portrait-heading">
    <h2 id="portrait-heading">Portrait & contact</h2>
    <p class="intro" id="portrait-help">JPEG, PNG, or WebP. Maximum 1 MB (1,048,576 bytes). A 4:5 portrait works best.</p>

    <div class="fields">
      <div class="portrait-field">
        {#if values?.image}
          <img src={values.image} alt="Current portrait" class="portrait" />
        {/if}
        <label class="field">
          <span>{values?.image ? 'Replace portrait' : 'Portrait image *'}</span>
          <input
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onchange={validateImageFile}
            aria-describedby="portrait-help"
            aria-invalid={!!(imageFileError || errors.imageFile)}
          />
          {#if imageFileError || errors.imageFile}
            <small>{imageFileError || errors.imageFile}</small>
          {/if}
        </label>
        <input type="hidden" name="currentImage" value={values?.image ?? ''} />
        {#if form}
          <p class="help">If you selected a new portrait, select it again before saving.</p>
        {/if}
      </div>

      <div class="contact-fields">
        <label class="field">
          <span>Email</span>
          <input name="email" type="email" value={values?.email ?? ''} placeholder="name@company.com" aria-invalid={!!errors.email} />
          {#if errors.email}<small>{errors.email}</small>{/if}
        </label>

        <label class="field">
          <span>LinkedIn URL</span>
          <input name="linkedin" type="url" value={values?.linkedin ?? ''} placeholder="https://www.linkedin.com/in/..." aria-invalid={!!errors.linkedin} />
          {#if errors.linkedin}<small>{errors.linkedin}</small>{/if}
        </label>

        <label class="checkbox">
          <input name="isActive" type="checkbox" checked={values?.isActive ?? true} />
          <span>Visible on the public website</span>
        </label>
      </div>
    </div>
  </section>

  <div class="actions">
    <a class="button" href="/admin-v2/team">Cancel</a>
    <button class="button primary" type="submit">{submitLabel}</button>
  </div>
</form>

<style>
  .team-form { display: grid; gap: 24px; min-width: 0; }
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
  .help { margin: 0; color: var(--ta-muted); font-size: 12px; line-height: 20px; font-weight: 400; }
  .portrait-field, .contact-fields { display: flex; min-width: 0; flex-direction: column; gap: 20px; }
  .portrait { width: 160px; max-width: 100%; aspect-ratio: 4 / 5; border-radius: 8px; object-fit: cover; background: #171717; }
  .checkbox { display: flex; align-items: center; gap: 12px; min-height: 44px; font-size: 14px; }
  .checkbox input { width: 18px; height: 18px; flex-shrink: 0; accent-color: #465fff; }
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
</style>
