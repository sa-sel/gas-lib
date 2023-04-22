import { SheetLogger } from './sheet-logger.class';

export type Step = Partial<Record<'forward' | 'backward', () => any>>;

/**
 * Specify how to execute/undo the steps of a transaction.
 * If an error happens, undo all executed steps.
 */
export class Transaction {
  private steps: Step[] = [];

  constructor(private readonly logger?: SheetLogger) {}

  step(step: Step): this {
    this.steps.push(step);

    return this;
  }

  run() {
    const backwardSteps: (() => any)[] = [];

    this.steps.forEach(({ backward, forward }) => {
      if (forward) {
        try {
          forward();
        } catch (err) {
          for (const backward of [...backwardSteps].reverse()) {
            try {
              backward();
            } catch (suppressedErr) {
              const errMsg = `Suppressed error while rolling back transaction: \n${suppressedErr}`;

              if (this.logger) {
                this.logger.error(errMsg);
              } else {
                Logger.log(errMsg);
              }
            }
          }

          throw err;
        }
      }

      if (backward) {
        backwardSteps.push(backward);
      }
    });
  }
}
