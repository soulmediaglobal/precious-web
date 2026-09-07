export const followUpMethods = ['WhatsApp', 'Phone', 'Email', 'Lainnya'] as const;
export type FollowUpMethod = (typeof followUpMethods)[number];
export type ContactValues = { firstName: string; lastName: string; email: string; phone: string; message: string; consentAccepted: boolean };
const field = (form: FormData, key: string) => typeof form.get(key) === 'string' ? (form.get(key) as string).trim() : '';

export function parseContactForm(form: FormData) {
  const values: ContactValues = {
    firstName: field(form, 'firstName'), lastName: field(form, 'lastName'),
    email: field(form, 'email'), phone: field(form, 'phone'), message: field(form, 'message'),
    consentAccepted: form.get('consentAccepted') === 'on'
  };
  const errors: Record<string, string> = {};
  if (!values.firstName) errors.firstName = 'First name is required.';
  for (const [key, max] of [['firstName', 100], ['lastName', 100], ['email', 254], ['phone', 32], ['message', 10000]] as const) {
    if (values[key].length > max) errors[key] = `Maximum ${max} characters.`;
  }
  if (!values.email && !values.phone) {
    errors.email = 'Provide an email address or phone number.';
    errors.phone = errors.email;
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.phone && (!/^[+\d ()-]+$/.test(values.phone) || !/^\d{7,15}$/.test(values.phone.replace(/\D/g, '')))) errors.phone = 'Use 7–15 digits; +, spaces, (), and - are allowed.';
  if (!values.message) errors.message = 'Message is required.';
  return { values, errors };
}

export function parseContactFollowUpForm(form: FormData) {
  const status = field(form, 'status');
  const method = field(form, 'followUpMethod');
  const errors: Record<string, string> = {};
  if (!['Belum Follow Up', 'Sudah Follow Up'].includes(status)) errors.status = 'Pilih status yang valid.';
  const isFollowedUp = status === 'Sudah Follow Up';
  if (isFollowedUp && !followUpMethods.includes(method as FollowUpMethod)) errors.followUpMethod = 'Pilih metode follow-up.';
  return { values: { status, followUpMethod: method }, nextState: { isFollowedUp, followUpMethod: isFollowedUp ? method as FollowUpMethod : null }, errors };
}

export function parseContactId(raw: string) {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}
