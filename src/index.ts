const memoizePromiseFn = (fn: (arg: Array<any>) => Promise<any>) => {
  const cache = new Map();

  return (...args: any) => {
    const context = this;
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    cache.set(
      key,
      fn.call(context, ...args).catch((error: any) => {
        // Delete cache entry if api call fails
        cache.delete(key);
        return Promise.reject(error);
      })
    );

    return cache.get(key);
  };
};

export default memoizePromiseFn;
