import { simulate } from './simulation/burnDynamicsSimulation';
import TokenMarket from './simulation/models/tokenMarket';
import Wallet from './simulation/models/wallet';
import Simulation from './simulation/pocSimulation';
import { SIMULATION_DAYS } from './simulation/utils/variables'; 

const args = process.argv.slice(2);

function main() {
    if (args.includes('-h')) {
        console.log(`
            npm run start:simulation -- [-h] [-d numberOfDogs] [-t numberOfTokens] [-n numberOfWeeks]
              where
                -h will print the help message and return.
                -d numberOfDogs will set the number of purchased dogs in your wallet to the number provided. Default = 2.
                -t numberOfTokens will set the number of tokens available in your wallet. Default = 10000000.
                -n numberOfWeeks will set the number of weeks in the simulation. Default = 16 (4 months).
            Example:
              npm run simulation -- -d 2 -t 10000000 -n 16
        `);

        process.exit(1);
    }

    const numberOfDogs = Number(parseArg('-d', '2'));
    const numberOfTokens = Number(parseArg('-t', '10000000'));
    const numberOfWeeks = Number(parseArg('-n', '16'));

    burnDynamicsSimulation(numberOfDogs, numberOfTokens, numberOfWeeks);
    // To see the original simulation, uncomment this line
    // proofOfConcept();
}

/**
 * NFT-4 
 * 
 * Assumptions:
 * - A starting ShibaiV2 token supply of 1 Billion tokens
 * - All dogs that are minted are alive
 * - All pups are being fed every 4 days
 * - All pups are being fed 100k ShibaiV2 tokens each time
 * - All pups are being minted in a semi-linear fashion
 *   - That is, the number of pups minted each week is randomly generated (uniform distribution), that doesn’t scale over time
 *   - Pups are minted between 5-20 per week
 * 
 * Definition of Done:
 * Given the assumptions above and the input:
 * - A starting number of pups
 * - A starting amount of tokens
 * - A time horizon (number of weeks)
 * When I open my terminal, follow the instructions in the README to install the program, and run it
 * Then the output will produce with the following columns:
 * - Week #
 * - Number of Tokens in Supply
 * - Number of Pups Currently Minted
 */
function burnDynamicsSimulation(startingNumberOfPups = 4, startingNumberOfTokens = 100_000_000, timeHorizonWeeks = 16) {
    console.log({ startingNumberOfPups, startingNumberOfTokens, timeHorizonWeeks })
    const result = simulate(startingNumberOfPups, startingNumberOfTokens, timeHorizonWeeks);
    console.table(result.weeklyTotals);
}


/**
 * THIS IS THE INITIAL PROOF OF CONCEPT DEMO.
 * 
 * 
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
function proofOfConcept() {
    const tokenMarket = new TokenMarket();
    const codysWallet = new Wallet({ initialMoney: 100, initialNumberOfDogs: 2, market: tokenMarket });
    // ... other wallets

    const simulation = new Simulation();
    simulation.run(SIMULATION_DAYS, [codysWallet]);

    codysWallet.printWallet();
}

function parseArg<T>(argSymbol: string, defaultValue: string | null = null): string | null {
    const argFlagIndex = args.indexOf(argSymbol);
    const hasArg = argFlagIndex > -1 && args.length > argFlagIndex;

    if (!hasArg) {
        return defaultValue;
    }

    return args[argFlagIndex + 1] ?? defaultValue;
}

main();