import TokenMarket from './simulation/models/tokenMarket';
import Wallet from './simulation/models/wallet';
import Simulation from './simulation/simulation';
import { SIMULATION_DAYS } from './simulation/utils/variables'; 

/**
 * Purpose:
 * - Shibai is currently valued at $61_000. 
 * - Cody owns 10% of Shibai
 * - Cody is employed to grow Shibai
 * - If Shibai reaches $10Mil, Cody has $1Mil
 * - To reach $10Mil, NFT needs to sell out
 * - COdy needs to sell 954 internet dogs to become a millionaire
 * 
 * So we want to create a simulation to understand if the ecosystem is sustainable.
 * Is this achievable in 6 months?
 * 
 * Can we show, tangiably, that if you bought this dog now, could you make this money?
 */
function main() {
    const tokenMarket = new TokenMarket();
    const codysWallet = new Wallet({ initialMoney: 100, initialNumberOfDogs: 2, market: tokenMarket });
    // ... other wallets

    const simulation = new Simulation();
    simulation.run(SIMULATION_DAYS, [codysWallet]);

    codysWallet.printWallet();
}

main();