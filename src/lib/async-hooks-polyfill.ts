export class AsyncLocalStorage<T = unknown> {
  getStore(): T | undefined {
    return undefined;
  }
  run<R>(_store: T, callback: (...args: unknown[]) => R, ...args: unknown[]): R {
    return callback(...args);
  }
  disable(): void {}
  enterWith(_store: T): void {}
}

export class AsyncResource {
  static bind<F extends (...args: unknown[]) => unknown>(fn: F, _type?: string): F {
    return fn;
  }
  static runInAsyncScope<F extends (...args: unknown[]) => unknown>(
    fn: F,
    thisArg: unknown,
    ...args: unknown[]
  ): ReturnType<F> {
    return fn.apply(thisArg, args) as ReturnType<F>;
  }
}
