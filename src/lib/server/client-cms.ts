export const companyTypes = ['PT', 'CV', 'Perseorangan', 'Firma'] as const;

export function parseClientForm(formData: FormData) {
	const values = {
		companyName: String(formData.get('companyName') ?? '').trim(),
		companyType: String(formData.get('companyType') ?? '').trim(),
		address: String(formData.get('address') ?? '').trim(),
		directorName: String(formData.get('directorName') ?? '').trim(),
		directorPhone: String(formData.get('directorPhone') ?? '').trim(),
		directorEmail: String(formData.get('directorEmail') ?? '').trim(),
		picName: String(formData.get('picName') ?? '').trim(),
		picPhone: String(formData.get('picPhone') ?? '').trim(),
		picEmail: String(formData.get('picEmail') ?? '').trim()
	};
	const errors: Record<string, string> = {};
	if (!values.companyName) errors.companyName = 'Company name is required.';
	if (!companyTypes.includes(values.companyType as (typeof companyTypes)[number]))
		errors.companyType = 'Select a valid company type.';
	if (!values.directorName) errors.directorName = 'Director name is required.';
	if (values.directorEmail && !/^\S+@\S+\.\S+$/.test(values.directorEmail))
		errors.directorEmail = 'Enter a valid email address.';
	if (!values.picName) errors.picName = 'PIC name is required.';
	if (values.picEmail && !/^\S+@\S+\.\S+$/.test(values.picEmail))
		errors.picEmail = 'Enter a valid email address.';
	return { values, errors };
}
