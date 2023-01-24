import http from 'http';

import type * as httpProxy from 'http-proxy';

export type IncomingMessage = http.IncomingMessage;

export type ClientRequest = http.ClientRequest;

export type ServerResponse = http.ServerResponse;

export type ServerOptions = httpProxy.ServerOptions;
