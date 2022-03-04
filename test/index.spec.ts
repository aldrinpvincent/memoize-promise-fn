import { memoizePromiseFn } from '../src';

async function testApi(id: any): Promise<any> {
  const json = await fetch(`https://api.example.com/todos/${id}`);
  return json;
}

const mockResponse = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
};

describe('Test memoizePromiseFn', () => {
  it('Should cache the promise with key "" if no arguments', async done => {
    const cachedtestApi = memoizePromiseFn(testApi);

    global.fetch = jest.fn(() => Promise.resolve(mockResponse)) as jest.Mock;

    // First call with no params
    const response = await cachedtestApi();
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call with no params
    const response2 = await cachedtestApi();

    expect(response2).toEqual(mockResponse);
    // Two fetch calls made but number of calls to fetch should be 1 after this call since it is served from cache
    expect(fetch).toHaveBeenCalledTimes(1);

    (global.fetch as jest.Mock).mockClear();
    done();
  });

  it('Should cache the promise with key generated from arguments', async done => {
    const cachedtestApi = memoizePromiseFn(testApi);

    global.fetch = jest.fn(() => Promise.resolve(mockResponse)) as jest.Mock;

    // First call
    const response = await cachedtestApi('arg1');
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call with same arguments
    const response2 = await cachedtestApi('arg1');
    expect(response2).toEqual(mockResponse);
    // number of calls still 1
    expect(fetch).toHaveBeenCalledTimes(1);

    // Third call with different arguments
    const response3 = await cachedtestApi('arg2');
    expect(response3).toEqual(mockResponse);
    // number of calls becomes 2
    expect(fetch).toHaveBeenCalledTimes(2);

    (global.fetch as jest.Mock).mockClear();
    done();
  });

  it('Should not cache the promise on any error', async done => {
    const cachedtestApi = memoizePromiseFn(testApi);

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject({ error: 'error' }))
      .mockImplementationOnce(() => Promise.resolve(mockResponse));

    // First call, api failure so cache should be empty
    await expect(cachedtestApi('args')).rejects.toEqual({ error: 'error' });
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call with same arguments
    const response2 = await cachedtestApi('args');
    expect(response2).toEqual(mockResponse);
    // number of calls will be 2 since first call is not cached
    expect(fetch).toHaveBeenCalledTimes(2);
    (global.fetch as jest.Mock).mockClear();
    done();
  });
});
