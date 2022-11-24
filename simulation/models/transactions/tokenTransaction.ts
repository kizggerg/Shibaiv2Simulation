import TokenMarket from "../tokenMarket";
import Wallet from "../wallet";
import Transaction from "./transaction";

export default class TokenTransaction extends Transaction<Wallet, TokenMarket> {
    totalCost: number;
    totalAmount: number;

    buyer?: Wallet;
    seller?: TokenMarket;

    constructor(totalCost: number, totalAmount: number) {
        super();
        this.totalCost = totalCost;
        this.totalAmount = totalAmount;
    }
    
    commitBuyer(): void {
        this.buyer!.purchase(this.totalCost);
    }

    commitSeller(): void {
        this.seller!.purchaseTokens(this.totalAmount);
    }

    rollbackBuyer(): void {
        this.buyer!.refund(this.totalCost);
    }

    rollbackSeller(): void {
        this.seller!.returnTokens(this.totalAmount);
    }
}