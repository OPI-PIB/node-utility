import { Options } from 'http-proxy-middleware';

import { ClientRequest, IncomingMessage, ServerOptions, ServerResponse } from './proxy-params';
import { ProxyRequest } from './proxy-request';

type OnProxyReqCallbackExtended = (
	proxyReq: ClientRequest,
	req: IncomingMessage,
	res: ServerResponse,
	options: ServerOptions
) => void;

type OnProxyResCallbackExtended = (proxyRes: IncomingMessage, req: ProxyRequest, res: ServerResponse) => Promise<void>;

export type ProxyOptions = Omit<Options, 'onProxyReq' | 'onProxyRes'> & {
	onProxyReq?: OnProxyReqCallbackExtended;
	onProxyRes?: OnProxyResCallbackExtended;
};
