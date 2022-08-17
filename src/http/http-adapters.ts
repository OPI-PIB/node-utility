import { ClientRequest, IncomingMessage, ServerResponse } from 'http';

import { readJsonSync } from 'fs-extra';

import { HttpRequestWithBody } from './http-request-with-body';
import { Notify } from '../notify';

const modifyResponse = require('node-http-proxy-json');

export class HttpAdapters {
	static objectToEncodedString(obj: Record<string, string>): string {
		const body = { ...obj };

		return Object.keys(body)
			.map(
				(key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
			)
			.join('&');
	}

	static writeParsedBody(
		proxyReq: ClientRequest,
		req: HttpRequestWithBody,
	): void {
		if (!req.body || !Object.keys(req.body).length) {
			return;
		}

		let newBody: string = '';

		const contentType = req.headers['content-type'] || '';

		if (contentType.includes('application/json')) {
			newBody = HttpAdapters.stringifyBody(req.body);
		}

		if (contentType === 'application/x-www-form-urlencoded') {
			newBody = HttpAdapters.objectToEncodedString(req.body);
		}

		proxyReq.write(newBody);
		proxyReq.end();
	}

	static replaceResponseBody(
		newBody: any,
		proxyRes: IncomingMessage,
		res: ServerResponse,
	) {
		if (newBody !== null && newBody !== undefined) {
			modifyResponse(res, proxyRes, () => HttpAdapters.stringifyBody(newBody));
		} else {
			modifyResponse(res, proxyRes, () => newBody);
		}
	}

	static replaceResponseBodyFromFile(
		newBodyUrl: string,
		proxyRes: IncomingMessage,
		res: ServerResponse,
	) {
		modifyResponse(res, proxyRes, () => {
			let stringifiedBody: string = '';

			try {
				const file = readJsonSync(newBodyUrl);
				stringifiedBody = HttpAdapters.stringifyBody(file);
			} catch (e) {
				Notify.error({ message: `Can't read file: ${newBodyUrl}` });
			}

			return stringifiedBody;
		});
	}

	static stringifyBody(body: any): string {
		let stringifiedBody: string = '';

		if (body !== null && body !== undefined) {
			try {
				stringifiedBody = JSON.stringify(body);
			} catch (e) {
				Notify.error({ message: "Can't stringify body" });
			}
		}

		return stringifiedBody;
	}
}
