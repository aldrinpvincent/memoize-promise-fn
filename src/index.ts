const memoizePromiseFn = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const context = this;
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const resultPromise = fn.call(context, ...args).catch((error) => {
      // Delete cache entry if promise rejection occurs
      cache.delete(key);
      return Promise.reject(error);
    });

    cache.set(key, resultPromise as ReturnType<T>);

    return resultPromise as ReturnType<T>;
  };
};

export default memoizePromiseFn;
