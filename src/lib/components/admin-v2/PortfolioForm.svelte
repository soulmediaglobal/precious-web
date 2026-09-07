<script lang="ts">
  import { onDestroy } from 'svelte';
  type Values = { slug: string; projectName: string; client: string; shortDescription: string; location: string; category: string; status: string; longDescriptionP1: string | null; longDescriptionP2: string | null };
  let { entry = null, form = null, submitLabel = 'Save Portfolio' }: {
    entry?: (Values & { images: { url: string }[] }) | null;
    form?: { values?: Values; images?: string[]; errors?: Record<string, string>; message?: string } | null;
    submitLabel?: string;
  } = $props();
  let values = $derived(form?.values ?? entry);
  let errors = $derived(form?.errors ?? {});
  let images = $derived(form?.images ?? entry?.images.map((image) => image.url) ?? []);
  let previews = $state<Record<number, string>>({});
  let submitting = $state(false);
  onDestroy(() => { for (const url of Object.values(previews)) if (url) URL.revokeObjectURL(url); });
  const fields = [
    { key: 'projectName', label: 'Project name', required: true },
    { key: 'slug', label: 'Slug', required: false },
    { key: 'client', label: 'Client', required: true },
    { key: 'location', label: 'Location', required: true },
    { key: 'category', label: 'Category / scope of work', required: true },
    { key: 'status', label: 'Status', required: true },
    { key: 'shortDescription', label: 'Short description', required: true },
    { key: 'longDescriptionP1', label: 'Description — paragraph 1', required: false },
    { key: 'longDescriptionP2', label: 'Description — paragraph 2', required: false }
  ] as const;
  function preview(event: Event, slot: number) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.setCustomValidity(file && file.size > 1_048_576 ? 'Maximum 1 MiB per image.' : '');
    if (previews[slot]) URL.revokeObjectURL(previews[slot]);
    previews[slot] = file ? URL.createObjectURL(file) : '';
  }
</script>

<form method="POST" enctype="multipart/form-data" class="portfolio-form" onsubmit={() => submitting = true}>
  {#if form}
    <div class="notice" role="alert">{form.message ?? 'Please check the fields below.'} Select any new files again before saving.</div>
  {/if}
  <section class="panel">
    <h2>Portfolio information</h2>
    <p class="intro">Project details shown on the public website.</p>
    <div class="fields">
      {#each fields as field}
        <label class="field">
          <span>{field.label}{field.required ? ' *' : ''}</span>
          {#if field.key.includes('Description')}
            <textarea name={field.key} rows={field.key === 'shortDescription' ? 3 : 6} required={field.required} aria-invalid={!!errors[field.key]}>{values?.[field.key] ?? ''}</textarea>
          {:else}
            <input name={field.key} value={values?.[field.key] ?? ''} required={field.required || (field.key === 'slug' && !!entry)} aria-invalid={!!errors[field.key]} />
          {/if}
          {#if field.key === 'slug'}<span class="help">{entry ? 'Changing this changes the public URL; old links will stop working.' : 'Leave blank to generate from the project name.'}</span>{/if}
          {#if errors[field.key]}<small>{errors[field.key]}</small>{/if}
        </label>
      {/each}
    </div>
  </section>
  <section class="panel">
    <h2>Header & content images</h2>
    <p class="intro">One required header, up to 10 content images. JPG, JPEG, PNG or GIF, maximum 1 MiB (1,048,576 bytes) each. Content follows slot order. Existing images stay unless removed or replaced.</p>
    {#if errors.images}<div class="notice" role="alert">{errors.images}</div>{/if}
    <div class="fields">
      {#each Array.from({ length: 11 }, (_, i) => i) as slot}
        <div class="image-slot">
          <h3>{slot === 0 ? 'Header / hero *' : `Content image ${slot} (optional)`}</h3>
          {#if previews[slot] || images[slot]}<img class="preview" src={previews[slot] || images[slot]} alt={slot === 0 ? 'Header preview' : `Content ${slot} preview`} />{/if}
          <input type="hidden" name={`currentImage${slot}`} value={images[slot] ?? ''} />
          <label class="field">
            <span>{images[slot] ? 'Replace image' : 'Add image'}</span>
            <input type="file" name={`imageFile${slot}`} accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif" onchange={(event) => preview(event, slot)} aria-invalid={!!errors[`imageFile${slot}`]} />
            {#if errors[`imageFile${slot}`]}<small>{errors[`imageFile${slot}`]}</small>{/if}
          </label>
          {#if images[slot]}
            {#if slot > 0}<label class="checkbox"><input type="checkbox" name={`removeImage${slot}`} /> Remove current image (a selected replacement takes its place)</label>
            {:else}<p class="help">To remove this header, select a replacement. A header is required.</p>{/if}
          {/if}
        </div>
      {/each}
    </div>
  </section>
  <div class="actions"><a class="button" href="/admin-v2/portfolio">Cancel</a><button class="button primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button></div>
</form>
<style>
  .portfolio-form { display: grid; gap: 24px; min-width: 0; }
  .panel { padding: 24px; border: 1px solid var(--ta-border); border-radius: 16px; background: var(--ta-bg); }
  h2 { margin: 0; font-size: 18px; font-weight: 600; color: #f2f4f7; }
  .intro { margin: 8px 0 24px; font-size: 14px; line-height: 22px; color: var(--ta-muted); }
  .fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .field { display: flex; min-width: 0; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 500; }
  .field input, .field textarea { width: 100%; min-width: 0; min-height: 44px; border: 1px solid var(--ta-border); border-radius: 8px; background: #000; padding: 10px 12px; color: var(--ta-text); font: inherit; }
  .field textarea { resize: vertical; }
  .field input::placeholder { color: var(--ta-muted); }
  .field small { color: #fda29b; font-weight: 400; }
  .help { margin: 0; color: var(--ta-muted); font-size: 12px; line-height: 20px; font-weight: 400; }
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
.image-slot { display: grid; align-content: start; gap: 12px; min-width: 0; border: 1px solid var(--ta-border); padding: 16px; border-radius: 12px; }
h3 { margin: 0; font-weight: 600; }
.preview { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; }
button:disabled { opacity: .6; }
</style>
