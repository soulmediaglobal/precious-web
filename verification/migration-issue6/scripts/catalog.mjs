export const catalog = async (pg) => {
	const q = async (s) => (await pg.query(s)).rows;
	return {
		columns: await q(
			`select c.relname,a.attname,format_type(a.atttypid,a.atttypmod) as type,a.attnotnull,pg_get_expr(d.adbin,d.adrelid) as default from pg_class c join pg_namespace n on n.oid=c.relnamespace join pg_attribute a on a.attrelid=c.oid left join pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum where n.nspname='public' and c.relkind='r' and a.attnum>0 and not a.attisdropped order by 1,2`
		),
		constraints: await q(
			`select c.relname,con.conname,pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' order by 1,2`
		),
		indexes: await q(
			`select tablename,indexname,indexdef from pg_indexes where schemaname='public' order by 1,2`
		),
		rls: await q(
			`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r' order by 1`
		)
	};
};
