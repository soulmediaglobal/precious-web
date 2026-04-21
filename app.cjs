async function loadApp() {
    const { handler } = await import('./build/handler.js');
    const express = await import('express');
    const app = express.default();

    app.use(handler);

    app.listen(process.env.PORT || 3000, () => {
        console.log('SvelteKit app is running');
    });
}

loadApp();