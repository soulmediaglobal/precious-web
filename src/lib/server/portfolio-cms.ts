import type { SupabaseClient } from '@supabase/supabase-js';

const fields = ['slug', 'projectName', 'client', 'shortDescription', 'location', 'category', 'status', 'longDescriptionP1', 'longDescriptionP2'] as const;
export const MAX_PORTFOLIO_IMAGE_BYTES = 1_048_576;
const extensions: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/gif': ['gif']
};

export function parsePortfolioForm(data: FormData, existing: { url: string }[] = [], creating = false) {
  const values = Object.fromEntries(fields.map((key) => [key, String(data.get(key) ?? '').trim()])) as Record<typeof fields[number], string>;
  if (creating && !values.slug) values.slug = values.projectName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const errors: Record<string, string> = {};
  for (const key of fields.slice(0, 7)) if (!values[key]) errors[key] = 'This field is required.';
  if (values.slug && /[\s/?#%\\]/.test(values.slug)) errors.slug = 'Use a URL slug without spaces, /, ?, #, %, or backslashes.';
  if (['.', '..'].includes(values.slug)) errors.slug = 'Choose a valid URL slug.';
  for (const [key, value] of data.entries()) {
    if (/^(imageFile|currentImage)\d+$/.test(key) && Number(key.match(/\d+$/)?.[0]) > 10 && (typeof value === 'string' ? value.length : value.size)) errors.images = 'Maximum one header and 10 content images.';
  }
  const slots = Array.from({ length: 11 }, (_, i) => {
    const current = String(data.get(`currentImage${i}`) ?? '');
    if (current && !existing.some((image) => image.url === current)) errors.images = 'An existing image is invalid. Reload the page.';
    const removed = data.get(`removeImage${i}`) === 'on';
    const input = data.get(`imageFile${i}`);
    const file = input instanceof File && input.size > 0 ? input : null;
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!extensions[file.type]?.includes(ext)) errors[`imageFile${i}`] = 'Use JPG, JPEG, PNG, or GIF with a matching file extension.';
      if (file.size > MAX_PORTFOLIO_IMAGE_BYTES) errors[`imageFile${i}`] = 'Each image must be 1 MiB (1,048,576 bytes) or smaller.';
    }
    return { current: removed ? '' : current, file };
  });
  if (!slots[0].current && !slots[0].file) errors.imageFile0 = 'One header image is required.';
  if (existing.length > 11) errors.images = 'This legacy entry has more than 11 images. Review it separately before editing to avoid losing images.';
  return { values, slots, errors, images: slots.map((slot) => slot.current) };
}

export async function uploadPortfolioImages(supabase: SupabaseClient, slots: ReturnType<typeof parsePortfolioForm>['slots']) {
  const images: string[] = [];
  for (const slot of slots) {
    if (slot.file) {
      const extension = extensions[slot.file.type][0];
      const path = `images/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from('portfolio').upload(path, slot.file, { contentType: slot.file.type, upsert: false });
      if (error) throw new Error('Image upload failed. Check the public portfolio bucket and upload permissions, then select your files again.');
      images.push(supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl);
    } else if (slot.current) images.push(slot.current);
  }
  return images;
}

export function portfolioSaveError(cause: unknown): string {
  let current = cause;
  for (let i = 0; i < 5 && current && typeof current === 'object'; i++) {
    if ('code' in current && current.code === '23505') return 'This slug is already used. Choose a different slug.';
    current = 'cause' in current ? current.cause : null;
  }
  return cause instanceof Error && cause.message.startsWith('Image upload failed.')
    ? cause.message : 'Could not save Portfolio. Please try again. Select any new files again.';
}
