import * as Variables from '../utils/variables';
import Wallet from './wallet';

export default class NFTDog {
    currentMultipler = Variables.BASE_MULTIPLIER;
    trainPrice = Variables.TRAIN_PRICE;

    stakingDaysPeriod = Variables.STAKING_DAYS;
    stakingDaysCooldownPeriod = Variables.STAKING_DAYS_COOLDOWN;

    isStaked = false;
    
    currentDaysStaked = 0;
    currentDaysUnstaked = 0;

    /**
     * Increases multiplier by increment
     * @param {Wallet}} wallet 
     */
    train(wallet: Wallet) {
        wallet.purchase(this.trainPrice);
        this.currentMultipler += Variables.MULTIPLIER_INCREMENT;
    }

    stake() {
        this.isStaked = true;
    }

    unstake() {
        this.isStaked = false;
    }

    endDay() {
        if (this.isStaked) {
            this.currentDaysStaked++;
        }

        if (!this.isStaked) {
            this.currentDaysUnstaked++;
        }

        if (this.currentDaysStaked >= Variables.STAKING_DAYS) {
            this.resetStaked(false);
        }

        if (this.currentDaysUnstaked >= Variables.STAKING_DAYS_COOLDOWN) {
            this.resetStaked(true);
        }
    }

    resetStaked(newIsStaked: boolean) {
        this.currentDaysStaked = 0;
        this.currentDaysUnstaked = 0;
        this.isStaked = newIsStaked;
    }
}