import {
	createProxyMiddleware,
	Filter,
	RequestHandler,
} from 'http-proxy-middleware';

import { HttpAdapters } from './adapters/http-adapters';
import { ProxyOptions } from './proxy-options';
import { ClientRequest } from './proxy-params';
import { ProxyRequest } from './proxy-request';

export class HttpProxyMiddleware {
	/**
	 * Creates proxy middleware for express server
	 */
	static create(
		context: Filter | ProxyOptions,
		options?: ProxyOptions | undefined
	): RequestHandler {
		return createProxyMiddleware(context, options);
	}

	/**
	 * Parse and write body of request
	 */
	static writeParsedBody(proxyReq: ClientRequest, req: ProxyRequest): void {
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
}
