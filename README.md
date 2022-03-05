# memoize-promise-fn

A utility to cache api calls in JavaScript by memoizing promises.

# Installation

```bash
npm install --save memoize-promise-fn
yarn add memoize-promise-fn
```

# Usage

```ts
import memoizePromiseFn from 'memoize-promise-fn';

let cachedFetchData = memoizePromiseFn(fetchData);
```


# Demo
Codesandbox - https://codesandbox.io/s/memoize-promise-fn-demo-468rks?file=/src/lib/index.js

Deployed in Vercel - https://memoize-promise-fn.vercel.app/
