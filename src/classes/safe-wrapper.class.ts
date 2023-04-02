import { Authorizer } from './auth.class';
import { Logger } from './logger.class';

/** Create handle logger/authorizer boilerplate for feature. */
export class SafeWrapper {
  constructor(private readonly logger: Logger, private readonly auth?: Authorizer) {
    this.logger = logger;
    this.auth = auth;
  }

  static factory(feature: string, allowedEmails?: string[]): SafeWrapper {
    const logger = new Logger(feature);
    const auth = allowedEmails && new Authorizer(allowedEmails, logger);

    return new this(logger, auth);
  }

  /**
   * Wrap a feature function with authorizer and error logging.
   * @param fn feature function to be wrapped (injection for logger and authorizer)
   * @returns wrapped function
   */
  getWrapped(fn: (logger?: Logger, auth?: Authorizer) => void): () => void {
    return () => {
      if (this.auth && !this.auth.ok) {
        this.logger.accessDenied();

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
  wrap(...args: Parameters<typeof this.getWrapped>): void {
    return this.getWrapped(...args)();
  }
}
