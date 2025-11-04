import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { Notify } from '../notify';

import { HttpAdapters } from './adapters/http-adapters';
import { ProxyOptions } from './proxy-options';
import { ClientRequest, IncomingMessage, ServerResponse } from './proxy-params';
import { ProxyRequest } from './proxy-request';

export type ResponseHandler = (
	proxyRes: IncomingMessage,
	req: ProxyRequest,
	res: ServerResponse
) => Promise<boolean | undefined> | boolean | undefined;

/**
 * Parse and write body of request
 */
function writeParsedBody(proxyReq: ClientRequest, req: ProxyRequest): void {
	if (!req.body || !Object.keys(req.body).length) {
		return;
	}

	let newBody = '';

	const contentType = req.headers['content-type'] || '';

	if (contentType.includes('application/json')) {
		newBody = HttpAdapters.stringify(req.body);
	}

	if (contentType === 'application/x-www-form-urlencoded') {
		newBody = HttpAdapters.toQueryString(req.body);
	}

	proxyReq.write(newBody);
	proxyReq.end();
}

export class HttpProxyMiddleware {
	/**
	 * Creates and runs proxy middleware for express server
	 */
	static run(options: { targetPort: number; proxyPort: number; responseHandlers: ResponseHandler[] }) {
		const { targetPort, proxyPort, responseHandlers } = options;
		const app = express();

		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		const proxyOptions: ProxyOptions = {
			target: `http://127.0.0.1:${targetPort}`,
			changeOrigin: true,
			selfHandleResponse: true,
			onProxyReq(proxyReq, req) {
				writeParsedBody(proxyReq, req);
			},
			onProxyRes: async (proxyRes, req, res) => {
				let handled = false;

				for (const handler of responseHandlers) {
					const result = await handler(proxyRes, req, res);

					if (result === true) {
						handled = true;
						break;
					}
				}

				if (handled !== true) {
					// Copy headers from proxyRes, but override CORS
					const headers = { ...proxyRes.headers };

					// Add CORS headers
					headers['Access-Control-Allow-Origin'] = '*';
					headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
					headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

					res.writeHead(proxyRes.statusCode || 200, headers);
					proxyRes.pipe(res);
				}
			}
		};

		app.use('/', createProxyMiddleware(proxyOptions));

		app.listen(proxyPort, () => {
			Notify.success({ message: `[Server]: created at http://localhost:${proxyPort}` });
		});
	}
}
