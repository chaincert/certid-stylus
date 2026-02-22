/**
 * Contract addresses on Base mainnet (chain ID: 8453)
 */
module.exports = {
    // ─── Aave V3 ───────────────────────────────────────────────
    AAVE_POOL: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
    AAVE_POOL_ADDRESSES_PROVIDER: "0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D",

    // ─── DEX Routers ──────────────────────────────────────────
    UNISWAP_V3_ROUTER: "0x2626664c2603336E57B271c5C0b26F421741e481", // SwapRouter02
    UNISWAP_V3_QUOTER: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a", // QuoterV2
    SUSHISWAP_ROUTER: "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891",
    AERODROME_ROUTER: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
    AERODROME_FACTORY: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",

    // ─── Tokens — Blue Chips ──────────────────────────────────
    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    USDbC: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // Bridged USDC
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    cbETH: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    wstETH: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",

    // ─── Tokens — Mid-Cap / Volatile (wider spreads) ──────────
    AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",   // Aerodrome token
    DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",  // DEGEN memecoin
    TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",  // TOSHI cat token
    BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4",   // BRETT memecoin
    VIRTUAL: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b", // Virtuals Protocol
    WELL: "0xA88594D404727625A9GF1DCDa2B75750CEBCD932",   // Moonwell
    rETH: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",   // Rocket Pool ETH
    COMP: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",   // Compound
    SNX: "0x22e6966B799c4D5B13BE962E1D117b56327FDa66",    // Synthetix
    EURC: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",   // Euro Coin
    BASESWAP_ROUTER: "0x327Df1E6de05895d2ab08513aaDD9313Fe505d86", // BaseSwap V2

    // ─── DEX Type Constants ────────────────────────────────────
    DEX_UNISWAP_V3: 1,
    DEX_UNISWAP_V2: 2,
    DEX_AERODROME: 3,

    // ─── Uniswap V3 Fee Tiers ─────────────────────────────────
    FEE_LOWEST: 100,  // 0.01% (stable pairs)
    FEE_LOW: 500,     // 0.05%
    FEE_MEDIUM: 3000, // 0.3%
    FEE_HIGH: 10000,  // 1%
};
