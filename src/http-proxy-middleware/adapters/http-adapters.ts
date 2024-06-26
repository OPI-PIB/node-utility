import { Is } from '@opi_pib/ts-utility';
import { readFileSync, readJsonSync } from 'fs-extra';

import { Notify } from '../../notify';
import { IncomingMessage, ServerResponse } from '../proxy-params';

const modifyResponse = require('node-http-proxy-json');

export class HttpAdapters {
	/**
	 * Replace response with new value of body
	 */
	static replaceResponseBody(
		newBody: unknown,
		proxyRes: IncomingMessage,
		res: ServerResponse
	) {
		if (Is.object(newBody)) {
			modifyResponse(res, proxyRes, () =>
				HttpAdapters.stringify(newBody)
			);
		} else if (Is.boolean(newBody)) {
			const bodyString = JSON.stringify(newBody);
			const headers = {
				...proxyRes.headers,
				'Content-Type': 'application/json',
			};
			if (headers['transfer-encoding']) {
				delete headers['content-length'];
			} else {
				headers['content-length'] = `${Buffer.byteLength(bodyString)}`;
			}

			res.writeHead(200, headers);
			res.write(bodyString);
			res.end();
		} else {
			modifyResponse(res, proxyRes, () => newBody);
		}
	}

	/**
	 * Replace response with new value of body from json file
	 */
	static replaceResponseBodyFromJsonFile(
		newBodyUrl: string,
		proxyRes: IncomingMessage,
		res: ServerResponse
	) {
		modifyResponse(res, proxyRes, () => {
			let stringifiedBody = '';

			try {
				const file = readJsonSync(newBodyUrl);
				if (Is.object(file)) {
					stringifiedBody = HttpAdapters.stringify(file);
				}
			} catch (e) {
				Notify.error({ message: `Can't read file: ${newBodyUrl}` });
			}

			return stringifiedBody;
		});
	}

	/**
	 * Replace response with content of file
	 */
	static replaceResponseBodyFromFile(
		fileUrl: string,
		proxyRes: IncomingMessage,
		res: ServerResponse
	) {
		try {
			const file = readFileSync(fileUrl);

			proxyRes.headers['content-length'] = `${file.byteLength}`;

			res.writeHead(200, 'OK', proxyRes.headers);
			res.write(file);
		} catch (e) {
			Notify.error({ message: `Can't read file: ${fileUrl}` });
		}
	}

	/**
	 * Convert object into queryString
	 */
	static toQueryString(
		obj: Record<string, string | number | boolean | undefined | null>
	): string {
		const body = { ...obj };

		return Object.entries(body)
			.filter(([key, value]) => Is.defined(value))
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(
						value as string | number | boolean
					)}`
			)
			.join('&');
	}

	/**
	 * Stringify value
	 */
	static stringify(body: Record<string, any>): string {
		let stringifiedBody = '';

		if (body !== null && body !== undefined) {
			try {
				stringifiedBody = JSON.stringify(
					Object.fromEntries(
						Object.entries(body).filter(([key, value]) =>
							Is.defined(value)
						)
					)
				);
			} catch (e) {
				Notify.error({ message: "Can't stringify body" });
			}
		}

		return stringifiedBody;
	}
}
