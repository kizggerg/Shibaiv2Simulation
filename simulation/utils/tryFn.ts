/**
 * Tried to run a function in a try-catch block.
 * - If the function succeeds, its result is returned.
 * - If the function throw an error, the error is returned.
 */
export default class Try<Result> {
    result?: Result;
    error?: Error;

    get hasError() {
        return this.error !== undefined;
    }

    static run<Result>(fn: () => Result) {
        const tryResult = new Try<Result>();

        try {
            tryResult.result = fn();
        }
        catch(error: any) {
            tryResult.error = error;
        }

        return tryResult;
    }
}