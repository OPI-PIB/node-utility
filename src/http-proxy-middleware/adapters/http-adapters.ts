import { readFileSync } from 'node:fs';

import { Is } from '@opi_pib/ts-utility';

import { Notify } from '../../notify';
import { IncomingMessage, ServerResponse } from '../proxy-params';

export class HttpAdapters {
	/**
	 * Replace response with new value of body
	 */
	static replaceResponseBody(newBody: unknown, proxyRes: IncomingMessage, res: ServerResponse) {
		try {
			const bodyString = HttpAdapters.stringify(newBody);

			const headers = { ...proxyRes.headers };
			if (!headers['content-type']) {
				headers['content-type'] = 'application/json';
			}

			if (!headers['transfer-encoding']) {
				headers['content-length'] = `${Buffer.byteLength(bodyString)}`;
			} else {
				delete headers['content-length'];
			}

			res.writeHead(200, headers);
			res.end(bodyString);

			return true;
		} catch {
			Notify.error({ message: 'Failed to replace response body' });
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ error: 'Internal Server Error' }));

			return false;
		}
	}

	/**
	 * Replace response with new value of body from JSON file
	 */
	static replaceResponseBodyFromJsonFile(newBodyUrl: string, proxyRes: IncomingMessage, res: ServerResponse) {
		try {
			const fileContent = readFileSync(newBodyUrl, 'utf-8');
			const file: unknown = JSON.parse(fileContent);
			const bodyString = Is.object(file) ? HttpAdapters.stringify(file) : '';

			const headers = { ...proxyRes.headers, 'Content-Type': 'application/json' };
			headers['content-length'] = `${Buffer.byteLength(bodyString)}`;

			res.writeHead(200, headers);
			res.write(bodyString);
			res.end();

			return true;
		} catch {
			Notify.error({ message: `Can't read file: ${newBodyUrl}` });

			return false;
		}
	}

	/**
	 * Replace response with content of file
	 */
	static replaceResponseBodyFromFile(fileUrl: string, proxyRes: IncomingMessage, res: ServerResponse) {
		try {
			const file = readFileSync(fileUrl);

			proxyRes.headers['content-length'] = `${file.byteLength}`;

			res.writeHead(200, 'OK', proxyRes.headers);
			res.write(file);
			res.end();

			return true;
		} catch {
			Notify.error({ message: `Can't read file: ${fileUrl}` });

			return false;
		}
	}

	/**
	 * Convert object into query string
	 */
	static toQueryString(obj: Record<string, string | number | boolean | undefined | null>): string {
		return Object.entries(obj)
			.filter(([, value]) => Is.defined(value))
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`)
			.join('&');
	}

	/**
	 * Stringify value
	 */
	static stringify(body: unknown): string {
		if (!Is.defined(body)) return '';

		try {
			if (Is.boolean(body) || Is.number(body)) {
				return `${body}`;
			}

			if (Is.string(body)) {
				return body;
			}

			if (Is.array(body)) {
				return JSON.stringify(body.map((v) => (v === undefined ? null : v)));
			}

			if (Is.object(body)) {
				return JSON.stringify(Object.fromEntries(Object.entries(body).filter(([, value]) => Is.defined(value))));
			}

			return '';
		} catch {
			Notify.error({ message: "Can't stringify body" });
			return '';
		}
	}
}
