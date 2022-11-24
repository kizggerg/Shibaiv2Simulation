import * as Variables from '../utils/variables';
import TokenTransaction from './transactions/tokenTransaction';

export default class TokenMarket {
    tokenSupply = Variables.TOTAL_TOKEN_SUPPLY;
    tokenPrice = Variables.PRICE_PER_TOKEN; // Currently this is fixed, but eventually the simulation will account for change in price over time.

    /**
     * Purchases the token amount from the market up to the max dollars given.
     * @param tokenAmount The amount of tokens to purchase from the market.
     * @returns Transaction the buyer must commit to before the purchase can take place.
     */
    createTokenTransaction(tokenAmount: number): TokenTransaction {
        if (tokenAmount > this.tokenSupply) {
            throw new Error(`Cannot purchase ${tokenAmount}: not enough supply (current supply = ${this.tokenSupply})`);
        }

        const tokensTransactionPrice = tokenAmount * this.tokenPrice;
        const gasFee = Variables.GAS_FEES.generateIntegerInDistribution();
        const totalCost = tokensTransactionPrice + gasFee;

        const transaction = new TokenTransaction(totalCost, tokenAmount);
        transaction.addSeller(this); 

        return transaction;
    }
    
    purchaseTokens(totalAmount: number) {
        if (this.tokenSupply < totalAmount) {
            throw new Error(`
                Cannot purchase tokens, not enough supply: 
                    suppy = ${this.tokenSupply}, 
                    purchase amount = ${totalAmount}
            `)
        }

        this.tokenSupply -= totalAmount;
    }

    returnTokens(totalAmount: number) {
        this.tokenSupply += totalAmount;
    }
}