import * as Helpers from '../utils/helpers';
import NFTDog from './nftDog';

export default class Wallet {
    money = 0;
    dogs: NFTDog[] = [];

    constructor(initialMoney: number, initialNumberOfDogs: number) {
        this.money = initialMoney;

        const numberOfDogs = Helpers.range(initialNumberOfDogs);
        this.dogs = numberOfDogs.map(_ => new NFTDog());
    }

    endDay() {
        this.dogs.forEach(dog => dog.endDay());
    }

    payRewards(paymentAmount: number) {
        const stakedDogs = this.dogs.filter(dog => dog.isStaked);

        for (const dog of stakedDogs) {
            this.money += paymentAmount * dog.currentMultipler;
        }
    }

    purchase(price: number) {
        if (this.money < price) {
            throw new Error(`Not enogh momey in wallet to make purchase: price = ${price}, money = ${this.money}`)
        }

        this.money -= price;
    }

    printWallet() {
        console.log(`
            Money = ${this.money}
        `)
    }
}