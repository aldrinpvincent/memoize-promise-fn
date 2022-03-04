export const memoizePromiseFn = (fn: (args: Array<any>) => Promise<any>) => {
  const cache = new Map();

  return (...args: Array<any>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    cache.set(
      key,
      fn([...args]).catch(error => {
        // Delete cache entry if api call fails
        cache.delete(key);
        return Promise.reject(error);
      })
    );

    return cache.get(key);
  };
};
