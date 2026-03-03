require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        arbitrumSepolia: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",
            chainId: 421614,
            accounts: [process.env.PRIVATE_KEY || "[REDACTED_PRIVATE_KEY]"], // User's private key
        }
    },
    etherscan: {
        apiKey: "[REDACTED_ETHERSCAN_API_KEY]"
    }
};
