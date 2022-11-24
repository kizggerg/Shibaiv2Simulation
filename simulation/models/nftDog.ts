import * as Variables from '../utils/variables';
import BooleanCounter from '../utils/booleanCounter';
import Wallet from './wallet';

export default class NFTDog {
    currentMultipler = Variables.BASE_MULTIPLIER;
    trainPrice = Variables.TRAIN_PRICE;

    stakedState: BooleanCounter;
    aliveState: BooleanCounter;
    
    currentDaysStaked = 0;
    currentDaysUnstaked = 0;

    constructor() {
        this.stakedState = new BooleanCounter(true, Variables.STAKING_DAYS, Variables.STAKING_DAYS_COOLDOWN)
        this.aliveState = new BooleanCounter(true, Variables.FEED_TIME_DAYS, Variables.FEED_TIME_COOLDOWN_DAYS);
    }

    get isStaked() {
        return this.stakedState.state;
    }

    get isAlive() {
        return this.aliveState.state;
    }
    
    /**
     * A dog will get "hungry" when it only has one more day left to be fed before it dies.
     */
    get isHungry() {
        return this.aliveState.counter === 1;
    }

    /**
     * Increases multiplier by increment
     * @param {Wallet} wallet 
     */
    train(wallet: Wallet) {
        wallet.purchase(this.trainPrice);
        this.currentMultipler += Variables.MULTIPLIER_INCREMENT;
    }

    /**
     * Keeps the dog alive for a period of time
     */
    feed() {
        if (!this.isAlive) {
            throw new Error(`Cannot feed a dead dog: isAlive = ${this.isAlive}, counter = ${this.aliveState.counter}`);
        }

        this.aliveState.resetCounter();
        // TODO:Then feed each dog in my wallet FEED_AMOUNT?
    }

    endDay() {
        this.aliveState.cycle();
        this.stakedState.cycle();
    }
}