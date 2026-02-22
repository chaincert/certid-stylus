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
    paths: {
        sources: "./contracts_certid", // We are pointing directly to the folder we created
        cache: "./cache_certid",
        artifacts: "./artifacts_certid"
    },
    networks: {
        arbitrumSepolia: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",
            chainId: 421614,
            accounts: ["[REDACTED_PRIVATE_KEY]"], // User's private key identified earlier
        }
    }
};
