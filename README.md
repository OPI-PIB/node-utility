# Node Utility

## notify

Simple wrapper around [chalk](https://www.npmjs.com/package/chalk)

### Usage

```javascript
import { Notify } from "@opi_pib/node-utility";

Notify.success({ message: "message" });
Notify.warning({ message: "message" });
Notify.info({ message: "message" });
Notify.error({ message: "message", error: new Error("Some error") });
```

## HttpAdapters

Helper functions to setup mock server proxy
