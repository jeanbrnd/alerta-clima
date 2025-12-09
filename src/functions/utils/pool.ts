// limite de paralelismo

export function runInPool(limit: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  return async function <T>(task: () => Promise<T>): Promise<T> {
    if (active >= limit) {
      await new Promise<void>(resolve => queue.push(resolve));
    }

    active++;
    try {
      return await task();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}
