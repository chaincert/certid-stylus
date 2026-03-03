const { ethers } = require("ethers");

async function testStylus() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    const stylusAddress = "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540";

    const abi = [
        "function verifyDeviceAttestation(bytes publicKey, bytes32 msgHash, bytes signature) external view returns (bool)"
    ];

    const contract = new ethers.Contract(stylusAddress, abi, provider);

    const publicKey = "0x1492cc40002d00ff74f1e365fc002ea66f9c258cec6c5fbfb9d72550d9353d027e82f11bc221f6c12f1321dcb48b67f4bd61411e2075988745905243fce13d37";
    const msgHash = "0xa8be78f19301b2cb388443f1df265bea9d0505e2d1d7512b4c46eb64a304092c";
    const signature = "0xc4ceb14753ed1668839d7dc1f3573f0cfec3f116d5e637e89f8b08238ce0b64400d5a7968471151815320527e5d3bf379443f9b76173d5b4ad690c381bfca6ac";

    console.log("Calling Stylus Engine...");
    try {
        const result = await contract.verifyDeviceAttestation(publicKey, msgHash, signature);
        console.log("Result:", result);
    } catch (e) {
        console.error("Reverted:", e.message);
    }
}

testStylus().catch(console.error);
