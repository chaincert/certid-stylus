const { ethers } = require("hardhat");

async function main() {
    // 1. Stylus Contract Address on Arbitrum Sepolia
    const stylusAddress = "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540";

    // 2. Minimal ABI for Stylus view function
    const stylusAbi = [
        "function verifyDeviceAttestation(bytes calldata publicKey, bytes32 msgHash, bytes calldata signature) external view returns (bool)"
    ];

    console.log("Connecting to Stylus contract at:", stylusAddress);

    // Provide a default provider
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    const stylusContract = new ethers.Contract(stylusAddress, stylusAbi, provider);

    // 3. Data from Node.js calculation
    const publicKey = "0x32e081362865d99dbd81f672cccfb1e47803f7b74622783073db4a4e64fbdd35d1ef083cd6f295e2512d6134baf535fe388c57ae701ab826551d13d002f5abd6";
    const msgHash = "0x63cc11b83ae79a799439c62585342f39e8725ed2aa8ed6fb6b43818c09c304fe";
    const signature = "0x514528469506ce6a677034bf9298581c76ce3a3ff0857a5b79fff8d3343a7d90402397122d56a11ed5a95f3e5316fb43ba8e78993eaacbfdc10fa3c34d89fa24";

    console.log("\nCalling verifyDeviceAttestation...");
    console.log("  Public Key (64 bytes):", publicKey);
    console.log("  Msg Hash (32 bytes):  ", msgHash);
    console.log("  Signature (64 bytes): ", signature);

    try {
        const result = await stylusContract.verifyDeviceAttestation(publicKey, msgHash, signature);
        console.log("\n------------ STYLUS ON-CHAIN RESULT ------------");
        console.log("Result:", result ? "✅ SUCCESS (Valid)" : "❌ FAILED (Invalid)");
    } catch (error) {
        console.error("\n❌ Contract call failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
