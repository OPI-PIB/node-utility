import { IncomingMessage } from 'http';

export type HttpRequestWithBody = IncomingMessage & {
	body: Record<string, any>;
};
