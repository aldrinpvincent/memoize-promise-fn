/**
 * IF YOU WANT TO CACHE API CALLS, GO FOR STANDARD HTTP CACHING - https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
 * IT IS NOT PREFERRED TO USE SOME JAVASCRIPT HACKS LIKE THIS OR USING REDUX STORE TO CACHE API CALLS
 * If no arguments are passed, it will return the same result for all calls, suceptible to stale data problem
 * @param {function} fn function whose response should be to be cached
 * @returns function with caching
 */
export const promiseMemoize = (fn) => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(args);

    if (key in cache) {
      return cache[key];
    }
    cache[key] = fn(...args).catch((error) => {
      delete cache[key];
      return Promise.reject(error);
    });

    return cache[key];
  };
};


export const promiseCacheV2 = (fn) => {
    const cache = new Map(); //{};

    return (...args) => {
        const key = JSON.stringify(args);
        // const key = JSON.parse(JSON.stringify(args));

        // console.log('args :>> ', JSON.parse(JSON.stringify(args)));

        console.log('cache current:>> ', cache);

        console.log('key :>> ', key);


        if (cache.has(key)) {
            console.log('cache hit key:>> ', key);
            console.log('cache[key] :>> ', cache[key]);
            // return cache[key];
            return cache.get(key);
        }

        cache.set(key, fn(...args).catch((error) => {
            cache.delete(key);
            return Promise.reject(error);
        }));
        // cache[key] = fn(...args).catch((error) => {
           

        console.log('cache new:>> ', cache);

        return cache.get(key);
    };
};


// function testApi() {
//   fetch("https://jsonplaceholder.typicode.com/todos/1")
//     .then((response) => response.json())
//     .then((json) => console.log(json));
// }

// async function test() {
//   let cached = promiseMemoize(testApi);
//   // let cached = testApi;
//   let c1 = await cached();
//   let c2 = await cached();
//   let c3 = await cached();
//   let c4 = await cached();
//   console.log({ c1 });
// }

// test();
