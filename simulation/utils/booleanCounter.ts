/**
 * A boolean counter is a boolean state machine with a counter
 * that toggles between true/false based on the counter value. 
 */
export default class BooleanCounter {
    state: boolean;
    counter: number = 0;

    toggleTrueCount: number;
    toggleFalseCount: number;

    constructor(initialState: boolean, toggleTrueCount: number, toggleFalseCount: number) {
        this.state = initialState;
        this.toggleTrueCount = toggleTrueCount;
        this.toggleFalseCount = toggleFalseCount;

        const isInitialStateValid = initialState ? this.canToggleToTrue : this.canToggleToTrue;
        if (!isInitialStateValid) {
            throw new Error(`BooleanCounter is invalid: Given initial state ${initialState} but toggle count is less than 1`);
        }
    }

    get canToggleToTrue() {
        return this.toggleTrueCount > 0;
    }

    get canToggleToFalse() {
        return this.toggleFalseCount > 0;
    }

    cycle() {
        this.incrementCounter();

        const shouldResetCounterFromTrue = this.state && this.counter >= this.toggleTrueCount;
        const shouldResetCounterFromFalse = !this.state && this.counter >= this.toggleFalseCount;
        const shouldResetCounter = shouldResetCounterFromTrue || shouldResetCounterFromFalse;

        const shouldToggleStateFromTrue = shouldResetCounterFromTrue && this.canToggleToFalse; 
        const shouldToggleStateFromFalse = shouldResetCounterFromFalse && this.canToggleToTrue;
        const shouldToggleState = shouldToggleStateFromTrue || shouldToggleStateFromFalse;

        if (shouldToggleState) {
            this.toggleState();
        }

        if (shouldResetCounter) {
            this.resetCounter();
        }
    }

    incrementCounter() {
        this.counter++;
    }

    resetCounter() {
        this.counter = 0;
    }

    toggleState() {
        this.state = !this.state;
    }
}