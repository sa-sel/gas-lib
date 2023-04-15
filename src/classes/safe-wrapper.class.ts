import { Authorizer } from './auth.class';
import { SheetLogger } from './sheet-logger.class';

/** Create handle logger/authorizer boilerplate for feature. */
export class SafeWrapper {
  constructor(private readonly logger: SheetLogger, private readonly auth?: Authorizer) {
    this.logger = logger;
    this.auth = auth;
  }

  static factory(feature: string, allowedEmails?: string[] | (() => string[])): SafeWrapper {
    const logger = new SheetLogger(feature);
    const auth = allowedEmails && new Authorizer(typeof allowedEmails === 'function' ? allowedEmails() : allowedEmails, logger);

    return new this(logger, auth);
  }

  /**
   * Wrap a feature function with authorizer and error logging.
   * @param fn feature function to be wrapped (injection for logger and authorizer)
   * @returns wrapped function
   */
  getWrapped(fn: (logger?: SheetLogger, auth?: Authorizer) => void): () => void {
    return () => {
      if (this.auth && !this.auth.ok) {
        this.logger.accessDenied(this.auth.allowedEmails);

        return;
      }

      try {
        fn(this.logger, this.auth);
      } catch (err) {
        this.logger.error(`Ocorreu um erro inesperado:\n${err}`);
        throw err;
      }
    };
  }

  /**
   * Wrap the call to a feature function with authorizer and error logging.
   * @param fn feature function to be wrapped (injection for logger and authorizer)
   */
  wrap(...args: Parameters<typeof SafeWrapper.prototype.getWrapped>): void {
    return this.getWrapped(...args)();
  }
}
