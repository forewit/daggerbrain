/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) {
					await caches.delete(key);
				}
			}
		})()
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	if (url.origin !== self.location.origin) return;
	if (!ASSETS.includes(url.pathname)) return;

	event.respondWith(
		caches.match(url.pathname).then((response) => response ?? fetch(event.request))
	);
});
