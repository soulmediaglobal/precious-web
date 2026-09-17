/** Presentation only: measure the canonical DOM at its print width, then compose A4 sheets. */
export function paginatePreview(root: HTMLElement) {
	const source = root.querySelector<HTMLElement>('[data-source]')!;
	const output = root.querySelector<HTMLElement>('[data-pages]')!;
	const status = root.querySelector<HTMLElement>('[data-pagination-status]')!;
	const button = root.querySelector<HTMLButtonElement>('[data-print]')!;
	let disposed = false;
	let frame = 0;

	function compose() {
		if (disposed) return;
		output.replaceChildren();
		let content!: HTMLElement;
		let page!: HTMLElement;
		let oversized = false;
		const pages: HTMLElement[] = [];
		const clone = (node: Element) => node.cloneNode(true) as HTMLElement;
		function nextPage() {
			page = document.createElement('section');
			page.className = 'rab-sheet';
			page.appendChild(clone(source.querySelector('[data-letterhead]')!));
			content = document.createElement('div');
			content.className = 'page-content';
			page.appendChild(content);
			page.appendChild(clone(source.querySelector('footer')!));
			output.appendChild(page);
			pages.push(page);
		}
		const fits = () => content.scrollHeight <= content.clientHeight + 1;
		const flagOverflow = () => {
			if (!fits()) {
				// Never clip unusually large legacy text. Native print fragmentation remains available.
				page.classList.add('oversized');
				oversized = true;
			}
		};
		nextPage();
		for (const block of source.querySelector<HTMLElement>('[data-content]')!.children) {
			if (page.classList.contains('oversized')) nextPage();
			if (block instanceof HTMLTableElement) {
				let table: HTMLTableElement;
				let body: HTMLTableSectionElement;
				function tableShell(continuation = false) {
					table = block.cloneNode(false) as HTMLTableElement;
					for (const child of block.children)
						if (child.tagName !== 'TBODY' && !(continuation && child.tagName === 'CAPTION'))
							table.appendChild(clone(child));
					body = document.createElement('tbody');
					table.appendChild(body);
					content.appendChild(table);
				}
				tableShell();
				const rows = Array.from(block.tBodies).flatMap((body) => Array.from(body.rows));
				for (let i = 0; i < rows.length; i++) {
					if (page.classList.contains('oversized')) {
						nextPage();
						tableShell(true);
					}
					// Keep consecutive hierarchy headings with their first detail row when they fit.
					const batch = [clone(rows[i])];
					while (rows[i].classList.contains('heading') && i + 1 < rows.length)
						batch.push(clone(rows[++i]));
					const hadRows = body!.children.length > 0;
					batch.forEach((row) => body!.appendChild(row));
					if (!fits() && (hadRows || content.children.length > 1)) {
						batch.forEach((row) => row.remove());
						const continuation = hadRows || !table!.caption;
						if (!hadRows) table!.remove();
						nextPage();
						tableShell(continuation);
						batch.forEach((row) => body!.appendChild(row));
					}
					// If a heading chain itself exceeds a page, relax keep-with-next before row safety.
					if (!fits() && batch.length > 1) {
						batch.forEach((row) => row.remove());
						for (const row of batch) {
							if (page.classList.contains('oversized')) {
								nextPage();
								tableShell(true);
							}
							const hasRows = body!.children.length > 0;
							body!.appendChild(row);
							if (!fits() && hasRows) {
								row.remove();
								nextPage();
								tableShell(true);
								body!.appendChild(row);
							}
							flagOverflow();
						}
					} else flagOverflow();
				}
			} else {
				const copy = clone(block);
				content.appendChild(copy);
				if (!fits() && content.children.length > 1) {
					copy.remove();
					nextPage();
					content.appendChild(copy);
				}
				flagOverflow();
			}
		}
		pages.forEach((sheet, index) => {
			sheet.setAttribute('aria-label', `Halaman ${index + 1} dari ${pages.length}`);
			sheet.querySelector('[data-page-number]')!.textContent = `${index + 1} / ${pages.length}`;
		});
		status.textContent = oversized
			? 'Ada konten yang melebihi satu halaman A4. Konten tetap utuh; periksa pemisahan halaman di dialog print.'
			: `${pages.length} halaman A4 · Cetak A4, skala 100%, tanpa margin tambahan dan header/footer browser; aktifkan background.`;
		button.disabled = false;
	}
	function schedule() {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(compose);
	}
	const observer = new MutationObserver(schedule);
	observer.observe(source, { childList: true, subtree: true, characterData: true });
	Promise.all([
		document.fonts.ready,
		...Array.from(source.querySelectorAll('img')).map((img) => img.decode().catch(() => {}))
	]).then(schedule);
	document.fonts.addEventListener('loadingdone', schedule);
	window.addEventListener('beforeprint', compose);
	return {
		destroy() {
			disposed = true;
			cancelAnimationFrame(frame);
			observer.disconnect();
			document.fonts.removeEventListener('loadingdone', schedule);
			window.removeEventListener('beforeprint', compose);
		}
	};
}
