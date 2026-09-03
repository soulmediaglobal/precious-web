<script lang="ts">
  let { member = null, form = null, submitLabel = 'Save team member' } = $props();
  let values = $derived(form?.values ?? member ?? {});
  let errors = $derived(form?.errors ?? {});
  let imageFileError = $state('');

  const validateImageFile = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    imageFileError = file && file.size > 1024 * 1024 ? 'Image must be 1 MB or smaller.' : '';
    input.setCustomValidity(imageFileError);
  };
</script>

<form method="POST" enctype="multipart/form-data" class="space-y-8">
  {#if form?.message}<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{form.message}</div>{/if}
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-6"><h2 class="text-lg font-semibold">Profile information</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Basic information displayed on the About page.</p></div>
    <div class="grid gap-6 md:grid-cols-2">
      <label class="field"><span>Name *</span><input name="name" value={values.name ?? ''} required />{#if errors.name}<small>{errors.name}</small>{/if}</label>
      <label class="field"><span>Job title *</span><input name="title" value={values.title ?? ''} required />{#if errors.title}<small>{errors.title}</small>{/if}</label>
      <label class="field"><span>Hierarchy *</span><select name="group" value={values.group ?? 'staff'}><option value="board">Board of Director</option><option value="management">Management</option><option value="staff">Staff</option></select>{#if errors.group}<small>{errors.group}</small>{/if}</label>
      <label class="field"><span>Display order *</span><input name="sortOrder" type="number" min="0" value={values.sortOrder ?? 0} required />{#if errors.sortOrder}<small>{errors.sortOrder}</small>{/if}</label>
      <label class="field md:col-span-2"><span>Description {values.group === 'board' ? '*' : '(optional)'}</span><textarea name="description" rows="5" placeholder="Shown for Board of Director profiles">{values.description ?? ''}</textarea>{#if errors.description}<small>{errors.description}</small>{/if}</label>
    </div>
  </section>

  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-6"><h2 class="text-lg font-semibold">Portrait & contact</h2><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Portrait images work best in a 4:5 vertical ratio. Maximum file size: 1 MB.</p></div>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-4">
        {#if values.image}<img src={values.image} alt="Current portrait" class="aspect-[4/5] w-40 rounded-lg object-cover" />{/if}
        <label class="field"><span>{values.image ? 'Replace portrait' : 'Portrait image *'}</span><input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" onchange={validateImageFile} />{#if imageFileError || errors.imageFile}<small>{imageFileError || errors.imageFile}</small>{/if}</label>
        <input type="hidden" name="currentImage" value={values.image ?? ''} />
      </div>
      <div class="space-y-6">
        <label class="field"><span>Email</span><input name="email" type="email" value={values.email ?? ''} placeholder="name@company.com" />{#if errors.email}<small>{errors.email}</small>{/if}</label>
        <label class="field"><span>LinkedIn URL</span><input name="linkedin" type="url" value={values.linkedin ?? ''} placeholder="https://www.linkedin.com/in/..." />{#if errors.linkedin}<small>{errors.linkedin}</small>{/if}</label>
        <label class="flex items-center gap-3 text-sm font-medium"><input name="isActive" type="checkbox" checked={values.isActive ?? true} class="rounded border-gray-300" />Visible on the public website</label>
      </div>
    </div>
  </section>

  <div class="flex justify-end gap-3"><a href="/admin/team" class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</a><button class="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900">{submitLabel}</button></div>
</form>

<style>
  .field{display:flex;flex-direction:column;gap:.5rem;font-size:.875rem;font-weight:500}.field input,.field select,.field textarea{width:100%;border:1px solid #d1d5db;border-radius:.5rem;background:white;padding:.65rem .75rem;color:#111827}.field small{color:#dc2626;font-weight:400}@media(prefers-color-scheme:dark){.field input,.field select,.field textarea{border-color:#4b5563;background:#374151;color:white}}
</style>
