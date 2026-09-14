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
