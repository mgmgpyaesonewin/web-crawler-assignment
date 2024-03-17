const { Cluster } = require('puppeteer-cluster');
const { randomDelay, queueKeywords } = require('../../src/cluster');

jest.mock('puppeteer-cluster', () => ({
  Cluster: {
    launch: jest.fn().mockResolvedValue({
      task: jest.fn().mockImplementation((fn) => fn({
        page: {
          setUserAgent: jest.fn(),
          setViewport: jest.fn(),
          goto: jest.fn(),
          title: jest.fn().mockResolvedValue('Title'),
          evaluate: jest.fn().mockResolvedValue([{ title: 'Title', link: 'https://www.example.com', htmlRaw: '<div>Test</div>' }]),
          content: jest.fn().mockResolvedValue('<html></html>'),
        },
        data: { url: 'https://www.example.com', user_id: '123' },
      })),
      queue: jest.fn(),
      idle: jest.fn().mockResolvedValue(),
      close: jest.fn().mockResolvedValue(),
    }),
  },
}));
jest.mock('puppeteer');
jest.mock('axios', () => ({
  request: jest.fn().mockResolvedValue({ data: 'Mocked response' }),
}));

describe('randomDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  it('should delay for a random duration between minDelay and maxDelay', async () => {
    const minDelay = 2000; // 2 seconds
    const maxDelay = 4000; // 4 seconds

    const randomDelayPromise = randomDelay(minDelay, maxDelay);

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    await randomDelayPromise;

    expect(jest.isMockFunction(setTimeout)).toBe(true);
    // Check that setTimeout was called exactly once
    expect(setTimeout).toHaveBeenCalledTimes(1);

    const actualDelay = setTimeout.mock.calls[0][1];
    expect(actualDelay).toBeGreaterThanOrEqual(minDelay);
    expect(actualDelay).toBeLessThanOrEqual(maxDelay);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('queueKeywords function', () => {
  it('should initialize cluster and queue tasks', async () => {
    await queueKeywords({ keywords: 'test', user_id: '123' });

    expect(Cluster.launch).toHaveBeenCalledTimes(1);
    const clusterInstance = await Cluster.launch();
    expect(clusterInstance.task).toHaveBeenCalled();
    expect(clusterInstance.queue).toHaveBeenCalled();
    expect(clusterInstance.idle).toHaveBeenCalled();
    expect(clusterInstance.close).toHaveBeenCalled();
  });
});
