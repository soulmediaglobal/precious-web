export function parseProjectForm(formData: FormData) {
	const rawClientId = String(formData.get('clientId') ?? '').trim();
	const clientId = Number(rawClientId);
	const values = {
		clientId,
		projectName: String(formData.get('projectName') ?? '').trim(),
		transactionTitle: String(formData.get('transactionTitle') ?? '').trim(),
		location: String(formData.get('location') ?? '').trim(),
		acquisitionType: String(formData.get('acquisitionType') ?? '').trim(),
		description: String(formData.get('description') ?? '').trim()
	};
	const errors: Record<string, string> = {};
	if (!rawClientId || !Number.isSafeInteger(clientId) || clientId <= 0)
		errors.clientId = 'Pilih client yang valid.';
	if (!values.projectName) errors.projectName = 'Nama project wajib diisi.';
	return { values, errors };
}
