/**
 * DO NOT USE THIS UTILITY FOR NORMAL API CACHING
 * IF YOU WANT TO CACHE API CALLS, GO FOR STANDARD HTTP CACHING - https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
 * IT IS NOT PREFERRED TO USE SOME JAVASCRIPT HACKS LIKE THIS OR USING REDUX STORE TO CACHE API CALLS
 * Use this util as a last resort to cache but it can return stale data sometimes based on the function passed
 * If no arguments are passed, it will return the same result for all calls, suceptible to stale data problem
 * No cache invalidation strategy, cache will be cleared on refresh
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
