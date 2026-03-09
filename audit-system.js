const { ethers } = require("ethers");

// CONFIGURATION: Replace these with your actual deployment values
const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const MANAGER_ADDRESS = "0xB05dBBAe660C4F2ebD917638760e608b3c263CaA";
const TEST_ADDRESS = "0x9f802e09650bC821977aF178a7c89759A59F0139";

async function auditSystem() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const abi = [
        "function stylusEngine() view returns (address)",
        "function userPublicKeys(address) view returns (bytes)"
    ];
    const contract = new ethers.Contract(MANAGER_ADDRESS, abi, provider);

    console.log(`--- Starting System Audit for: ${MANAGER_ADDRESS} ---`);

    // 1. Check Stylus Linkage
    try {
        const engine = await contract.stylusEngine();
        console.log(`[1/3] Stylus Engine Pointer: ${engine}`);
        if (engine === "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540") {
            console.log("    ✅ CORRECT: Pointing to the Rust verification engine.");
        } else {
            console.error("    ❌ WARNING: Manager is pointing to a different address or 0x0.");
        }
    } catch (e) { console.error("    ❌ Error checking engine linkage:", e.message); }

    // 2. Check Registry State
    try {
        const key = await contract.userPublicKeys(TEST_ADDRESS);
        console.log(`[2/3] Registry Lookup for ${TEST_ADDRESS}:`);

        if (!key || key === "0x") {
            console.error("    ❌ FAIL: No public key found. The user is NOT registered.");
        } else {
            console.log("    ✅ SUCCESS: Public key found.");

            // 3. Check Key Length (The 64-byte rule)
            const byteLength = (key.length - 2) / 2;
            console.log(`[3/3] Key Length: ${byteLength} bytes`);

            if (byteLength === 64) {
                console.log("    ✅ PERFECT: Key is 64 bytes (X and Y coordinates).");
            } else if (byteLength === 65) {
                console.error("    ❌ REVERT RISK: Key includes 0x04 prefix (65 bytes). Stylus engine will reject this.");
            } else {
                console.error("    ❌ UNKNOWN FORMAT: Unexpected key length.");
            }
        }
    } catch (e) { console.error("    ❌ Error checking registry:", e.message); }

    console.log("--- Audit Complete ---");
}

auditSystem();