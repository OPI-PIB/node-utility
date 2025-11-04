import http from 'http';
import httpProxy from 'http-proxy';
import { test, beforeEach, afterEach, describe } from 'node:test';
import { deepEqual, strictEqual } from 'node:assert/strict';
import { HttpAdapters } from './http-adapters';

const SERVER_PORT = 5004;
const TARGET_SERVER_PORT = 5005;

describe('HttpAdapters', () => {
	let proxy: httpProxy;
	let server: http.Server;
	let targetServer: http.Server;

	beforeEach(async () => {
		proxy = httpProxy.createProxyServer({
			target: `http://localhost:${TARGET_SERVER_PORT}`,
			selfHandleResponse: true
		});

		await new Promise<void>((resolve) => {
			server = http.createServer((req, res) => proxy.web(req, res)).listen(SERVER_PORT, () => resolve());
		});

		await new Promise<void>((resolve) => {
			targetServer = http
				.createServer((req, res) => {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ name: 'name', age: 1, version: '1.0.0' }));
				})
				.listen(TARGET_SERVER_PORT, () => resolve());
		});
	});

	afterEach(async () => {
		proxy.removeAllListeners('proxyRes');

		await new Promise<void>((resolve) => server.close(() => resolve()));
		await new Promise<void>((resolve) => targetServer.close(() => resolve()));
	});

	const makeRequest = (): Promise<any> =>
		new Promise((resolve, reject) => {
			http
				.get(`http://localhost:${SERVER_PORT}`, (res) => {
					let data = '';
					res.on('data', (chunk) => (data += chunk));
					res.on('end', () => {
						try {
							resolve(JSON.parse(data));
						} catch {
							resolve(data);
						}
					});
				})
				.on('error', reject);
		});

	test('replace null response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody(null, proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, '');
	});

	test('replace undefined response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody(undefined, proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, '');
	});

	test('replace string response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody('hello', proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, 'hello');
	});

	test('replace number response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody(42, proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, 42);
	});

	test('replace true response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody(true, proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, true);
	});

	test('replace false response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody(false, proxyRes, res);
		});

		const result = await makeRequest();
		strictEqual(result, false);
	});

	test('replace object response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody({ name: 'name', age: 2 }, proxyRes, res);
		});

		const result = await makeRequest();
		deepEqual(result, { name: 'name', age: 2 });
	});

	test('replace array response', async () => {
		proxy.on('proxyRes', (proxyRes, req, res) => {
			HttpAdapters.replaceResponseBody([{ name: 'name', age: 2 }], proxyRes, res);
		});

		const result = await makeRequest();
		deepEqual(result, [{ name: 'name', age: 2 }]);
	});
});
