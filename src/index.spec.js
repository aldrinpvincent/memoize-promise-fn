import { promiseMemoize } from "./index.js";

async function testApi() {
  const json = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return json;
}

describe("Test promiseMemoize util", () => {
  it('Should cache the promise with key "" if no arguments', async (done) => {
    const cachedtestApi = promiseMemoize(testApi);

    const mockResponse = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false
    };
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponse));

    // First call
    const response = await cachedtestApi();
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call
    const response2 = await cachedtestApi();

    expect(response2).toEqual(mockResponse);
    // Second call but number of calls to fetch should be 1 after this call since it is served from cache
    expect(fetch).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
    delete global.fetch;
    done();
  });

  it("Should cache the promise with key generated from arguments", async (done) => {
    const cachedtestApi = promiseMemoize(testApi);

    const mockResponse = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false
    };

    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponse));
    const response = await cachedtestApi("arg1");
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call with same arguments
    const response2 = await cachedtestApi("arg1");
    expect(response2).toEqual(mockResponse);
    // number of calls still 1
    expect(fetch).toHaveBeenCalledTimes(1);

    // Third call with different arguments
    const response3 = await cachedtestApi("arg2");
    expect(response3).toEqual(mockResponse);
    // number of calls becomes 2
    expect(fetch).toHaveBeenCalledTimes(2);

    global.fetch.mockClear();
    delete global.fetch;
    done();
  });

  it("Should not cache the promise on any error", async (done) => {
    const cachedtestApi = promiseMemoize(testApi);
    const mockResponse = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false
    };

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject({ error: "error" }))
      .mockImplementationOnce(() => Promise.resolve(mockResponse));

    // fetch.mockReturnValueOnce.(Promise.reject({ error: "error" })).mockReturnValueOnce(Promise.resolve(mockResponse));
    await expect(cachedtestApi("args")).rejects.toEqual({ error: "error" });
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call with same arguments
    const response2 = await cachedtestApi("args");
    expect(response2).toEqual(mockResponse);
    // number of calls will be 2 since first call is not cached
    expect(fetch).toHaveBeenCalledTimes(2);
    global.fetch.mockClear();
    delete global.fetch;
    done();
  });
});
