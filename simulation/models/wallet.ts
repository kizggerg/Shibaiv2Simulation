import * as Helpers from '../utils/helpers';
import * as Variables from '../utils/variables';
import NFTDog from './nftDog';
import TokenMarket from './tokenMarket';

export default class Wallet {
    moneyInDollars = 0;
    dogs: NFTDog[] = [];
    market: TokenMarket;

    constructor(args: { initialMoney: number, initialNumberOfDogs: number, market: TokenMarket }) {
        this.moneyInDollars = args.initialMoney;

        const numberOfDogs = Helpers.range(args.initialNumberOfDogs);
        this.dogs = numberOfDogs.map(_ => new NFTDog());
        this.market = args.market;
    }

    endDay() {
        this.dogs.forEach(dog => dog.endDay());
    }

    feedDogs() {
        const dogsToFeed = this.dogs.filter(dog => dog.isAlive && dog.isHungry);
        const numberOfTokenToBuy = Variables.FEED_AMOUNT * dogsToFeed.length;
        
        const transaction = this.market.createTokenTransaction(numberOfTokenToBuy);
        transaction.addBuyer(this);
        transaction.settle();

        dogsToFeed.forEach(dog => dog.feed());
    }

    payRewards(paymentAmount: number) {
        const stakedDogs = this.dogs.filter(dog => dog.isStaked);

        for (const dog of stakedDogs) {
            this.moneyInDollars += paymentAmount * dog.currentMultipler;
        }
    }

    purchase(price: number) {
        if (this.moneyInDollars < price) {
            throw new Error(`Not enogh momey in wallet to make purchase: price = ${price}, money = ${this.moneyInDollars}`)
        }

        this.moneyInDollars -= price;
    }

    refund(refundedCost: number) {
        this.moneyInDollars += refundedCost;
    }

    printWallet() {
        console.log(`
            Money = ${this.moneyInDollars}
        `)
    }
}