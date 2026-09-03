import type { SupabaseClient } from '@supabase/supabase-js';

export const teamGroups = ['board', 'management', 'staff'] as const;
export type TeamGroup = (typeof teamGroups)[number];
export const MAX_TEAM_IMAGE_BYTES = 1024 * 1024;

export function parseTeamForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const group = String(formData.get('group') ?? 'staff') as TeamGroup;
  const description = String(formData.get('description') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const linkedin = String(formData.get('linkedin') ?? '').trim();
  const image = String(formData.get('currentImage') ?? '').trim();
  const sortOrderRaw = String(formData.get('sortOrder') ?? '0');
  const sortOrder = Number.parseInt(sortOrderRaw, 10);
  const isActive = formData.get('isActive') === 'on';
  const file = formData.get('imageFile');
  const errors: Record<string, string> = {};

  if (!name) errors.name = 'Name is required.';
  if (!title) errors.title = 'Job title is required.';
  if (!teamGroups.includes(group)) errors.group = 'Select a valid hierarchy.';
  if (!Number.isInteger(sortOrder) || sortOrder < 0) errors.sortOrder = 'Order must be zero or greater.';
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (linkedin) {
    try {
      const url = new URL(linkedin);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      errors.linkedin = 'Enter a complete LinkedIn URL.';
    }
  }
  if (group === 'board' && !description) errors.description = 'A Director description is required.';
  if (file instanceof File && file.size > 0) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) errors.imageFile = 'Use a JPEG, PNG, or WebP image.';
    if (file.size > MAX_TEAM_IMAGE_BYTES) errors.imageFile = 'Image must be 1 MB or smaller.';
  } else if (!image) {
    errors.imageFile = 'A portrait image is required.';
  }

  return {
    values: { name, title, group, description, email, linkedin, image, sortOrder, isActive },
    file: file instanceof File && file.size > 0 ? file : null,
    errors
  };
}

export async function uploadTeamImage(supabase: SupabaseClient, file: File) {
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `portraits/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('team').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return supabase.storage.from('team').getPublicUrl(path).data.publicUrl;
}
