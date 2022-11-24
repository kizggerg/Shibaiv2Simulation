import Distribution from "./distribution";

export const TOTAL_TOKEN_SUPPLY = 1_000_000_000; // Total number of tokens

export const NUM_STAKED = 1; // Range: 1 - 1000 (# of dogs staked)
export const TOKEN_VOLUME = 100; // Range: 100 - 100_000 ($ sales)
export const PRICE_PER_TOKEN = 0.00006305; // Price in $ of single token.
export const NFT_VOLUME = 100; // Range: 100 - 1000 ($ sales total of NFTs)
export const PAYABLES = 100; // Range: 100 - 5000 ($ interactions total of dogs)

export const TOKEN_VOLUME_PERCENT_AFTER_TAX = 0.03;
export const NFT_VOLUME_PERCENT_AFTER_TAX = 0.075;
export const MINT_VOLUME_PERCENT_AFTER_TAX = 0.3;
export const PAYABLES_PERCENT_AFTER_TAX = 0.3; 

export const FEED_TIME_DAYS = 4; // Number of days until next feed is required.
export const FEED_TIME_COOLDOWN_DAYS = 0; // Number of days dog remains unfed after feed time has expired.
export const FEED_AMOUNT = 0.0001; // .01% of total supply ???

export const CURRENT_NUMEBR_OF_NFTS = 46;
export const MAX_NUMBER_OF_NFTS = 1000;

export const MINT_PRICE = 300.00; // $ to Mint new NFT 

export const BASE_MULTIPLIER = 0.8;
export const MULTIPLIER_INCREMENT = 0.05;

export const INITIAL_MONEY = 100.00; // $ USD
export const INITIAL_DOGS = 2; // # of dogs in wallet

export const TRAIN_PRICE = 300.00; // $ USD

export const MAX_DOGS_PER_WALLET = 2;

export const STAKING_DAYS = 21;
export const STAKING_DAYS_COOLDOWN = 7;

export const SIMULATION_DAYS = 30 * 6; // 6 months

export const GAS_FEES = new Distribution(1, 4); // Cost to make transaction in dollars

export const MONTH_TOKEN_VOLUME_DISTRIBUTION = [
    new Distribution(500, 3000),
    new Distribution(1500, 4000),
    new Distribution(2000, 5000),
    new Distribution(4000, 7000),
    new Distribution(5000, 7500),
    new Distribution(5000, 7500),
];

export const MONTH_NFT_VOLUME_DISTRIBUTION = [
    new Distribution(0, 0),
    new Distribution(0, 0),
    new Distribution(0, 0),
    new Distribution(0, 0),
    new Distribution(0, 0),
    new Distribution(0, 0),
];

export const MONTH_MINT_AMOUNT_DISTRIBUTION = [
    new Distribution(1, 3),
    new Distribution(2, 5),
    new Distribution(2, 5),
    new Distribution(4, 7),
    new Distribution(4, 7),
    new Distribution(4, 7),
];

export const MONTH_TOTAL_PAYABLE_DOLLARS_DISTRIBUTION = [
    new Distribution(50, 150),
    new Distribution(100, 250),
    new Distribution(100, 250),
    new Distribution(250, 500),
    new Distribution(250, 500),
    new Distribution(250, 500),
];

