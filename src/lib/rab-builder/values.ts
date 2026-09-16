// Decimal strings stay exact across database, server actions and browser rendering.
export function cents(value: string): bigint {
	const [whole, fraction = ''] = value.split('.');
	return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}
export function decimal(value: bigint): string {
	return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}
export const sumMoney = (values: string[]) =>
	decimal(values.reduce((sum, value) => sum + cents(value), 0n));
export const money = (value: string) => {
	const amount = cents(value);
	return `Rp ${new Intl.NumberFormat('id-ID').format(amount / 100n)},${String(amount % 100n).padStart(2, '0')}`;
};
export type BuilderKind = 'section' | 'group' | 'subgroup' | 'item';
export class BuilderInputError extends Error {}
export function positiveId(value: unknown): number {
	const text = String(value ?? '');
	if (!/^[1-9]\d*$/.test(text) || Number(text) > 2147483647)
		throw new BuilderInputError('Identitas tidak valid.');
	return Number(text);
}
export function parseBuilderForm(form: FormData) {
	const kind = String(form.get('kind'));
	if (!['section', 'group', 'subgroup', 'item'].includes(kind))
		throw new BuilderInputError('Jenis baris tidak valid.');
	const id = form.get('id') ? positiveId(form.get('id')) : null;
	const parentId = kind === 'section' ? null : positiveId(form.get('parentId'));
	const subgroupId =
		kind === 'item' && form.get('subgroupId') ? positiveId(form.get('subgroupId')) : null;
	if (form.get('operation') === 'delete') {
		if (!id) throw new BuilderInputError('Pilih baris yang akan dihapus.');
		return { kind: kind as BuilderKind, id, parentId, subgroupId, operation: 'delete' as const };
	}
	const sortOrder = String(form.get('sortOrder') ?? '0');
	if (!/^\d{1,10}$/.test(sortOrder) || Number(sortOrder) > 2147483647)
		throw new BuilderInputError('Urutan harus bilangan bulat 0–2147483647.');
	const required = (key: string, label: string, max: number) => {
		const value = String(form.get(key) ?? '').trim();
		if (!value || value.length > max)
			throw new BuilderInputError(`${label} wajib diisi (maks. ${max} karakter).`);
		return value;
	};
	const base = {
		kind: kind as BuilderKind,
		id,
		parentId,
		subgroupId,
		operation: 'save' as const,
		sortOrder: Number(sortOrder)
	};
	if (kind !== 'item') return { ...base, name: required('name', 'Nama', 250) };
	const numeric = (key: string, label: string, integer: number, scale: number) => {
		const value = String(form.get(key) ?? '').trim();
		if (!new RegExp(`^\\d{1,${integer}}(?:\\.\\d{1,${scale}})?$`).test(value))
			throw new BuilderInputError(`${label} harus angka positif/nol, maks. ${scale} desimal.`);
		return value;
	};
	const description = required('description', 'Deskripsi', 2000);
	const unit = required('unit', 'Satuan', 50);
	const volume = numeric('volume', 'Volume/QS', 10, 4);
	if (Number(volume) <= 0) throw new BuilderInputError('Volume/QS harus lebih dari nol.');
	const materialUnitPrice = numeric('materialUnitPrice', 'Harga material', 16, 2);
	const jasaUnitPrice = numeric('jasaUnitPrice', 'Harga jasa', 16, 2);
	const notes = String(form.get('notes') ?? '').trim();
	if (notes.length > 5000) throw new BuilderInputError('Catatan maks. 5000 karakter.');
	return { ...base, description, unit, volume, materialUnitPrice, jasaUnitPrice, notes };
}
export type BuilderMutation = ReturnType<typeof parseBuilderForm>;

// Tahapan + Termin use a separate mutation contract from the work-item Builder hierarchy.
export type CommercialKind = 'stage' | 'paymentTerm';

function commercialRequired(value: unknown, label: string, max: number) {
	const text = String(value ?? '').trim();
	if (!text || text.length > max)
		throw new BuilderInputError(`${label} wajib diisi (maks. ${max} karakter).`);
	return text;
}

function commercialSortOrder(value: unknown) {
	const text = String(value ?? '0');
	if (!/^\d{1,10}$/.test(text) || Number(text) > 2147483647)
		throw new BuilderInputError('Urutan harus bilangan bulat 0–2147483647.');
	return Number(text);
}

export function parseCommercialForm(form: FormData) {
	const kind = String(form.get('commercialKind'));
	if (!['stage', 'paymentTerm'].includes(kind))
		throw new BuilderInputError('Jenis Tahapan/Termin tidak valid.');

	const id = form.get('id') ? positiveId(form.get('id')) : null;

	if (form.get('operation') === 'delete') {
		if (!id) throw new BuilderInputError('Pilih data yang akan dihapus.');
		return {
			kind: kind as CommercialKind,
			id,
			operation: 'delete' as const
		};
	}

	const name = commercialRequired(
		form.get('name'),
		kind === 'stage' ? 'Nama Tahapan' : 'Nama Termin',
		250
	);
	const sortOrder = commercialSortOrder(form.get('sortOrder'));

	if (kind === 'stage') {
		const description = String(form.get('description') ?? '').trim();
		if (description.length > 5000)
			throw new BuilderInputError('Deskripsi Tahapan maks. 5000 karakter.');

		return {
			kind: 'stage' as const,
			id,
			operation: 'save' as const,
			name,
			description,
			sortOrder
		};
	}

	const percentage = String(form.get('percentage') ?? '').trim();
	if (!/^\d{1,3}(?:\.\d{1,4})?$/.test(percentage))
		throw new BuilderInputError('Persentase Termin harus angka 0–100, maks. 4 desimal.');

	const percentageScaled = BigInt(
		percentage.includes('.')
			? `${percentage.split('.')[0]}${percentage.split('.')[1].padEnd(4, '0')}`
			: `${percentage}0000`
	);

	if (percentageScaled > 1000000n)
		throw new BuilderInputError('Persentase Termin tidak boleh lebih dari 100%.');

	const stageId = form.get('stageId') ? positiveId(form.get('stageId')) : null;

	const paymentTrigger = String(form.get('paymentTrigger') ?? '').trim();
	if (paymentTrigger.length > 5000)
		throw new BuilderInputError('Catatan/kondisi Termin maks. 5000 karakter.');

	return {
		kind: 'paymentTerm' as const,
		id,
		operation: 'save' as const,
		name,
		percentage,
		stageId,
		paymentTrigger,
		sortOrder
	};
}

export type CommercialMutation = ReturnType<typeof parseCommercialForm>;
