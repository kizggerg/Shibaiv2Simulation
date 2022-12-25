import * as Variables from './utils/variables';
import * as Helpers from './utils/helpers';
import Wallet from './models/wallet';

export default class Simulation {
    currentNumberOfNFTs = Variables.CURRENT_NUMEBR_OF_NFTS;

    getCurrentMonth(currentDay: number) {
        return Math.floor(currentDay / 30);
    }

    getDailyMintVolume(mintAmount: number) {
        if (this.currentNumberOfNFTs + mintAmount > Variables.MAX_NUMBER_OF_NFTS) {
            throw new Error(`Cannot mint new NFT: current = ${this.currentNumberOfNFTs}, increment = ${mintAmount}`)
        }

        const dailyAmount = mintAmount * Variables.MINT_PRICE;
        this.currentNumberOfNFTs += mintAmount;

        return dailyAmount;
    }

    /**
     * Run simulation and report totals
     * @param {Number} numberOfDays 
     * @param {Wallet[]} wallets 
     */
    run(numberOfDays: number, wallets: Wallet[]) {
        const days = Helpers.range(numberOfDays);

        for (const day of days) {
            const thisMonth = this.getCurrentMonth(day);

            const dailyTokenVolume = Variables.MONTH_TOKEN_VOLUME_DISTRIBUTION[thisMonth].generateIntegerInDistribution() * Variables.TOKEN_VOLUME_PERCENT_AFTER_TAX;
            const dailyNFTVolume = Variables.MONTH_NFT_VOLUME_DISTRIBUTION[thisMonth].generateIntegerInDistribution() * Variables.NFT_VOLUME_PERCENT_AFTER_TAX;
            const dailyPayablesVolume = Variables.MONTH_TOTAL_PAYABLE_DOLLARS_DISTRIBUTION[thisMonth].generateIntegerInDistribution() * Variables.PAYABLES_PERCENT_AFTER_TAX;
            const dailyMintVolume = this.getDailyMintVolume(Variables.MONTH_MINT_AMOUNT_DISTRIBUTION[thisMonth].generateIntegerInDistribution()) * Variables.MINT_VOLUME_PERCENT_AFTER_TAX;

            const dailyTotalVolume = dailyTokenVolume + dailyNFTVolume + dailyPayablesVolume + dailyMintVolume;
            const dailyPayAmount = dailyTotalVolume / this.currentNumberOfNFTs;

            wallets.forEach(wallet => wallet.payRewards(dailyPayAmount));
            wallets.forEach(wallet => wallet.feedDogs());
            wallets.forEach(wallet => wallet.endDay());
        }
    }
}