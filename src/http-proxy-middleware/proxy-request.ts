import { IncomingMessage } from 'http';

import { ParsedQs } from 'qs';

/**
 * Type of request for http-proxy-middleware library
 */
export type ProxyRequest = IncomingMessage & {
	body?: Record<string, any>;
	query?: ParsedQs;
	_parsedUrl?: URL;
};
