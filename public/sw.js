self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        actions: data.actions
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
