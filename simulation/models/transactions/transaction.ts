import TryFn from '../../utils/tryFn';

/**
 * A transaction as two parties: a buyer and a seller.
 * - If both buyer and seller agree to the terms of the transaction (e.g. the total cost),
 *   both the buyer and the seller will commit.
 * - If an error occurs in either party, both buyer and seller will be rolled back,
 *   as if the transaction never occur.
 * - A transaction is settled if the buyer and seller committed successfully.
 */
 export default abstract class Transaction<Buyer, Seller> {
    buyer?: Buyer;
    seller?: Seller;

    abstract commitBuyer(): void;
    abstract commitSeller(): void;
    abstract rollbackBuyer(): void;
    abstract rollbackSeller(): void;

    addBuyer(buyer: Buyer) { this.buyer = buyer; }
    addSeller(seller: Seller) { this.seller = seller; }
    
    settle() {
        if (!this.buyer) {
            throw new Error(`Cannot settle transaction without a buyer`);
        }

        if (!this.seller) {
            throw new Error(`Cannot settle transaction without a seller`);
        }

        const buyerResult = TryFn.run(this.commitBuyer.bind(this));
        if (buyerResult.hasError) {
            this.rollbackBuyer();
            throw new Error(this.getTransactionFailedErrorMessage(buyerResult.error!, "buyer"));
        }

        const sellerResult = TryFn.run(this.commitSeller.bind(this));
        if (sellerResult.hasError) {
            this.rollbackSeller();
            this.rollbackBuyer();
            throw new Error(this.getTransactionFailedErrorMessage(sellerResult.error!, "seller"));
        }
    }

    private getTransactionFailedErrorMessage(error: Error, source: 'buyer' | 'seller') {
        return `
            Transaction failed to settle, a ${error.name} error occurred in the ${source}:
                ${error.message}
        `;
    }
}
