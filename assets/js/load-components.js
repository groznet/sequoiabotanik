async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(`Error loading component [${id}]:`, error);
    }
}

async function initSite() {
    // Define all components to load
    const components = [
        loadComponent('header', '/components/header.html'),
        loadComponent('footer', '/components/footer.html'),
        // Add others here: loadComponent('sidebar', '/components/sidebar.html')
    ];

    // Wait for ALL components to finish loading
    await Promise.all(components);

    // Dispatch a custom event to tell main.js it's safe to run
// Give the browser one frame to recognize the new DOM elements
    requestAnimationFrame(() => {
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    });
}

initSite();