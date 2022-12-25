import { range } from "./utils/helpers";
import Distribution from './utils/distribution';

// Assumptions
const STARTING_NUMBER_OF_TOKENS = 1_000_000_000;
const COST_PER_FEED_IN_TOKENS = 100_000;
const COST_TO_MINT_IN_TOKENS = 0; // TODO: This is definitely wrong.
const NUMBER_OF_DAYS_PER_FEED = 4;
const MINT_PER_DAY = new Distribution(0, 3); // NOTE: This is altered from mint per week to make things easier.

interface WeekResult {
    weekNumber: number;
    monthNumber: number;
    numberOfTokensPurchasedThisWeek: number;
    numberOfPupsPurchasedThisWeek: number;
    numberOfTokensInSupplyTotal: number;
    numberOfPupsMintedTotal: number;
}

interface SimulationResult {
    weeklyTotals: WeekResult[];
}

class Market {
    constructor(public numberOfTokensInSupply: number, public wallets: Wallet[] = []) {}

    get costToFeedInTokens() {
        return COST_PER_FEED_IN_TOKENS;
    }

    get costToMintInTokens() {
        return COST_TO_MINT_IN_TOKENS;
    }

    get numberOfPupsInMarket() {
        return this.wallets.reduce((sum, wallet) => sum + wallet.dogs.length, 0);
    }

    addWallets(wallets: Wallet[]) {
        this.wallets.push(...wallets);
    }

    simulateDay() {
        this.wallets.forEach(wallet => wallet.simulateDay());
    }

    // Returns the number of tokens purchased.
    buyTokens(numberOfTokensToBuy: number): number {
        if (numberOfTokensToBuy > this.numberOfTokensInSupply) {
            throw new Error(`
                Cannot purchase more tokens: not enough tokens in supply.
                    Number of tokens to buy = ${numberOfTokensToBuy}
                    Number of tokens in supply = ${this.numberOfTokensInSupply}
            `);
        }

        this.numberOfTokensInSupply -= numberOfTokensToBuy;
        return numberOfTokensToBuy;
    }
}

class Wallet {
    dogs: Dog[];

    constructor(readonly walletName: string, public numberOfTokens: number, initialNumberOfDogs: number, protected market: Market) {
        this.dogs = range(initialNumberOfDogs).map(() => new Dog());
    }

    simulateDay() {
        this.dogs.filter(dog => dog.isHungry).forEach(dog => this.feedHungryDog(dog), this);
        this.dogs.forEach(dog => dog.simulateDay());
    }

    mintNewDogs(numberOfDogsToMint: number) {
        const totalMintCost = this.getMintCost(numberOfDogsToMint);

        if (totalMintCost > this.numberOfTokens) {
            throw new Error(`
                Cannot mint new dogs in ${this.walletName}: not enough tokens in wallet.
                    totalMintCost = ${totalMintCost}
                    numberOfTokensInSupply = ${this.numberOfTokens}
            `);
        }

        this.numberOfTokens -= totalMintCost;
        const newDogs = range(numberOfDogsToMint).map(() => new Dog());
        this.dogs.push(...newDogs);
    }

    feedHungryDog(dog: Dog) {
        if (!dog.isHungry) {
            return;
        }

        if (this.numberOfTokens < this.market.costToFeedInTokens) {
            throw new Error(`
                Cannot feed any more dogs in ${this.walletName}: not enough tokens in wallet to pay for feeding cost.
                    Number of tokens in wallet = ${this.numberOfTokens}
                    Cost to feed = ${this.market.costToFeedInTokens}
            `);
        }

        this.numberOfTokens -= this.market.costToFeedInTokens;
        dog.feed();
    }

    protected getMintCost(mintAmount: number) {
        const mintCostPerDog = this.market.costToMintInTokens;
        return mintCostPerDog * mintAmount;
    }
}

// A minting wallet will mint a number of dogs each day.
// To do so, it will purchase the number of tokens it needs "just in time".
class MintingWallet extends Wallet {
    simulateDay() {
        const newDogsToMint = MINT_PER_DAY.generateIntegerInDistribution();
        if (newDogsToMint > 0) this.mintNewDogs(newDogsToMint);

        super.simulateDay();
    }

    mintNewDogs(numberOfDogsToMint: number) {
        const totalMintCost = this.getMintCost(numberOfDogsToMint);
        const tokensToPurchase = this.getTokensToPurchase(totalMintCost)
        if (tokensToPurchase > 0) this.buyTokensFromMarket(tokensToPurchase);

        super.mintNewDogs(numberOfDogsToMint);
    }

    feedHungryDog(dog: Dog) {
        const tokensToPurchase = this.getTokensToPurchase(this.market.costToFeedInTokens);
        if (tokensToPurchase > 0) this.buyTokensFromMarket(tokensToPurchase);

        super.feedHungryDog(dog);
    }

    private getTokensToPurchase(cost: number) {
        return Math.max(0, cost - this.numberOfTokens);
    }

    private buyTokensFromMarket(tokensToPurchase: number) {
        this.numberOfTokens += this.market.buyTokens(tokensToPurchase)
    }
}

class Dog {
    numberOfDaysPerFeed = NUMBER_OF_DAYS_PER_FEED;
    daysSinceLastFed: number;

    constructor() {
        // All dogs start off as fed.
        this.daysSinceLastFed = 0;
    }

    get isHungry(): boolean {
        return this.daysSinceLastFed >= this.numberOfDaysPerFeed;
    }

    simulateDay() {
        this.daysSinceLastFed++;
    }

    feed() {
        this.daysSinceLastFed = 0;
    }
}

export function simulate(initialNumberOfDogsInMyWallet: number, initialNumberOfTokensInMyWallet: number, numberOfWeeks: number): SimulationResult {
    const market = new Market(STARTING_NUMBER_OF_TOKENS);

    const myWallet = new Wallet("My Wallet", initialNumberOfTokensInMyWallet, initialNumberOfDogsInMyWallet, market);
    const mintingWallet = new MintingWallet("Market Wallet", 0, 0, market);
    market.addWallets([myWallet, mintingWallet]);
    
    const weeklyTotals = range(numberOfWeeks).map((weekIndex) => simulateWeek(weekIndex + 1, market, initialNumberOfDogsInMyWallet));

    return {
        weeklyTotals,
    };
}

function simulateWeek(weekNumber: number, market: Market, initialNumberOfDogs: number): WeekResult {
    const DAYS_PER_WEEK = 7;
    const WEEKS_PER_MONTH = 4;

    const initialNumberOfTokensInSupply = market.numberOfTokensInSupply;
    const initialNumberOfPupsMinted = market.numberOfPupsInMarket - initialNumberOfDogs;

    range(DAYS_PER_WEEK).forEach(() => market.simulateDay());
    
    const numberOfTokensPurchasedThisWeek = initialNumberOfTokensInSupply - market.numberOfTokensInSupply;
    const numberOfPupsMintedThisWeek = (market.numberOfPupsInMarket - initialNumberOfDogs) - initialNumberOfPupsMinted;

    return {
        weekNumber,
        monthNumber: Math.floor((weekNumber - 1) / WEEKS_PER_MONTH) + 1,
        numberOfTokensPurchasedThisWeek: numberOfTokensPurchasedThisWeek,
        numberOfPupsPurchasedThisWeek: numberOfPupsMintedThisWeek,
        numberOfTokensInSupplyTotal: market.numberOfTokensInSupply,
        numberOfPupsMintedTotal: market.numberOfPupsInMarket - initialNumberOfDogs,
    }
}