# Node Utility

- [Install](#install)
- [Notify](#notify)
- [HttpProxyMiddleware](#httpproxymiddleware)
- [HttpAdapters](#httpadapters)

## Install

```
npm install @opi_pib/node-utility
```

## Notify

### Usage

```javascript
Notify.success({ message: 'message' });
Notify.warning({ message: 'message' });
Notify.info({ message: 'message' });
Notify.error({ message: 'message', error: new Error('Some error') });
```

## Mock server

npm scripts

```
npm i -D @stoplight/prism-cli
```

```
"mock:server": "prism mock --port=3010 ./dist/index.json",
```

## HttpProxyMiddleware

Proxy middleware for express server

### Usage

proxy.ts

```javascript
import { HttpProxyMiddleware } from '@opi_pib/node-utility';

const handlers = [SystemInfo.processRes];

HttpProxyMiddleware.run(3010, 3011, handlers);
```

npm scripts

```
"mock:server": "ts-node proxy.ts",
```

## HttpAdapters

### HttpAdapters.replaceResponseBody()

Replace response with new value of body

#### Usage

```javascript
import {
	HttpAdapters,
	IncomingMessage,
	ProxyRequest,
	ServerResponse,
} from '@opi_pib/node-utility';

export class SystemInfo {
	static processRes(
		proxyRes: IncomingMessage,
		req: ProxyRequest,
		res: ServerResponse,
	) {
		if (Route.pathMatch(req, '^/system/info$')) {
			return HttpAdapters.replaceResponseBody(infoElementDto, proxyRes, res);
		}
	}
}
```

### HttpAdapters.replaceResponseBodyFromJsonFile()

Replace response with new value of body from json file

#### Usage

```javascript
export class SystemInfo {
	static processRes(
		proxyRes: IncomingMessage,
		req: ProxyRequest,
		res: ServerResponse,
	) {
		if (Route.pathMatch(req, '^/system/info$')) {
			return HttpAdapters.replaceResponseBodyFromJsonFile('./infoElementDto.json', proxyRes, res);
		}
	}
}
```

### HttpAdapters.replaceResponseBodyFromFile()

Replace response with content of file

#### Usage

```javascript
export class SystemInfo {
	static processRes(
		proxyRes: IncomingMessage,
		req: ProxyRequest,
		res: ServerResponse,
	) {
		if (Route.pathMatch(req, '^/system/info$')) {
			return HttpAdapters.replaceResponseBodyFromFile('./infoElementDto.pdf', proxyRes, res);
		}
	}
}
```

### HttpAdapters.toQueryString()

Convert object into queryString

#### Usage

```javascript
const result = HttpAdapters.toQueryString({
	a: 'b',
	c: 1,
	d: undefined,
	e: null
});

expect('a=b&c=1').toEqual(result);
```

### HttpAdapters.stringify()

Stringify value

#### Usage

```javascript
const result = HttpAdapters.stringify({
	a: 'b',
	c: 1,
	d: undefined,
	e: null
});

expect('{"a":"b","c":1}').toEqual(result);
```
