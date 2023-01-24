# Node Utility

## Notify

Simple wrapper around [chalk](https://www.npmjs.com/package/chalk)

### Usage

```javascript
Notify.success({ message: "message" });
Notify.warning({ message: "message" });
Notify.info({ message: "message" });
Notify.error({ message: "message", error: new Error("Some error") });
```

## HttpProxyMiddleware

Proxy middleware for express server

### Usage

```javascript
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const proxyOptions: ProxyOptions = {
	target: "http://127.0.0.1:4010",
	changeOrigin: true,
	onProxyReq(proxyReq, req, res, options) {
		HttpProxyMiddleware.writeParsedBody(proxyReq, req);
	},
	onProxyRes(proxyRes, req, res) {},
};

app.use("/", HttpProxyMiddleware.create(proxyOptions));

app.listen(4011);
```

## HttpAdapters

### HttpAdapters.replaceResponseBody()

Replace response with new value of body

#### Usage

```javascript
processRes(
	proxyRes: IncomingMessage,
	req: ProxyRequest,
	res: ServerResponse,
): void {
	if (req._parsedUrl?.pathname.match('^/user$') && req.method === 'GET') {
		HttpAdapters.replaceResponseBody(userDto, proxyRes, res);
	}
}
```

### HttpAdapters.replaceResponseBodyFromJsonFile()

Replace response with new value of body from json file

#### Usage

```javascript
processRes(
	proxyRes: IncomingMessage,
	req: ProxyRequest,
	res: ServerResponse,
): void {
	if (req._parsedUrl?.pathname.match('^/user$') && req.method === 'GET') {
		HttpAdapters.replaceResponseBodyFromJsonFile('./userDto.json', proxyRes, res);
	}
}
```

### HttpAdapters.replaceResponseBodyFromFile()

Replace response with content of file

#### Usage

```javascript
processRes(
	proxyRes: IncomingMessage,
	req: ProxyRequest,
	res: ServerResponse,
): void {
	if (req._parsedUrl?.pathname.match('^/user$') && req.method === 'GET') {
		HttpAdapters.replaceResponseBodyFromFile('./user.pdf', proxyRes, res);
	}
}
```

### HttpAdapters.toQueryString()

Convert object into queryString

#### Usage

```javascript
const result = HttpAdapters.toQueryString({
	a: "b",
	c: 1,
	d: undefined,
	e: null,
});

expect("a=b&c=1").toEqual(result);
```

### HttpAdapters.stringify()

Stringify value

#### Usage

```javascript
const result = HttpAdapters.stringify({
	a: "b",
	c: 1,
	d: undefined,
	e: null,
});

expect("a=b&c=1").toEqual(result);
```
