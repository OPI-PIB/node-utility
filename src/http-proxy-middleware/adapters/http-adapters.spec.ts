/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';

import httpProxy from 'http-proxy';
import axios from 'axios';

import { HttpAdapters } from './http-adapters';

const SERVER_PORT = 5004;
const TARGET_SERVER_PORT = 5005;
describe('HttpAdapters', () => {
	it('stringify', async () => {
		const result = HttpAdapters.stringify({
			a: 'b', c: 1, d: undefined, e: null,
		});

		// eslint-disable-next-line no-useless-escape
		expect('{\"a\":\"b\",\"c\":1}').toEqual(result);
	});

	it('toQueryString', async () => {
		const result = HttpAdapters.toQueryString({
			a: 'b', c: 1, d: false, e: undefined, f: null,
		});

		expect('a=b&c=1&d=false').toEqual(result);
	});

	describe('Modify response', () => {
		let proxy: httpProxy;
		let server: http.Server;
		let targetServer: http.Server;

		beforeEach(() => {
			// Create a proxy server
			proxy = httpProxy.createProxyServer({
				target: `http://localhost:${TARGET_SERVER_PORT}`,
			});

			// Create your server and then proxies the request
			server = http
				.createServer((req, res) => proxy.web(req, res))
				.listen(SERVER_PORT);

			// Create your target server
			targetServer = http
				.createServer((req, res) => {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(
						JSON.stringify({
							name: 'node-http-proxy-json',
							age: 1,
							version: '1.0.0',
						}),
					);
					res.end();
				})
				.listen(TARGET_SERVER_PORT);
		});

		afterEach(() => {
			proxy.close();
			server.close();
			targetServer.close();
		});

		describe('json', () => {
			beforeEach(() => {
				proxy.on('proxyRes', (proxyRes, req, res) => {
					HttpAdapters.replaceResponseBody({
						name: 'node-http-proxy-json',
						age: 2,
					}, proxyRes, res);
				});
			});

			it('modify response successfully', async () => {
				const result = await axios.get(`http://localhost:${SERVER_PORT}`);

				expect(result.data).toEqual({
					name: 'node-http-proxy-json',
					age: 2,
				});
			});
		});

		describe('null', () => {
			beforeEach(() => {
				proxy.on('proxyRes', (proxyRes, req, res) => {
					HttpAdapters.replaceResponseBody(null, proxyRes, res);
				});
			});

			it('modify response successfully', async () => {
				const result = await axios.get(`http://localhost:${SERVER_PORT}`);

				expect(result.data).toEqual('');
			});
		});

		describe('undefined', () => {
			beforeEach(() => {
				proxy.on('proxyRes', (proxyRes, req, res) => {
					HttpAdapters.replaceResponseBody(undefined, proxyRes, res);
				});
			});

			it('modify response successfully', async () => {
				const result = await axios.get(`http://localhost:${SERVER_PORT}`);

				expect(result.data).toEqual('');
			});
		});

		describe('true', () => {
			beforeEach(() => {
				proxy.on('proxyRes', (proxyRes, req, res) => {
					HttpAdapters.replaceResponseBody(true, proxyRes, res);
				});
			});

			it('modify response successfully', async () => {
				const result = await axios.get(`http://localhost:${SERVER_PORT}`);

				expect(result.data).toEqual(true);
			});
		});

		describe('false', () => {
			beforeEach(() => {
				proxy.on('proxyRes', (proxyRes, req, res) => {
					HttpAdapters.replaceResponseBody(false, proxyRes, res);
				});
			});

			it('modify response successfully', async () => {
				const result = await axios.get(`http://localhost:${SERVER_PORT}`);

				expect(result.data).toEqual(false);
			});
		});
	});
});
