const addr = require("./addresses");

/**
 * Monitored trading pairs and their arbitrage routes.
 * Organized by liquidity tier — thinner liquidity = wider spreads.
 */
module.exports = [
    // ═══════════════════════════════════════════════════════════
    //  TIER 1 — WETH ↔ USDC (highest liquidity)
    // ═══════════════════════════════════════════════════════════
    {
        name: "WETH/USDC UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH/USDC Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH/USDC UniV3→Sushi",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V2, router: addr.SUSHISWAP_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH/USDC UniV3→BaseSwap",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V2, router: addr.BASESWAP_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH/USDC Aero→Sushi",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V2, router: addr.SUSHISWAP_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    // Fee-tier arb: same DEX, different pools
    {
        name: "WETH/USDC UniV3 0.05%→0.3%",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 2 — Stablecoin arb
    // ═══════════════════════════════════════════════════════════
    {
        name: "USDC/USDbC Aero(stable)→UniV3",
        borrowToken: addr.USDC,
        borrowSymbol: "USDC",
        borrowDecimals: 6,
        borrowAmount: "10000",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.USDbC, fee: 0, aeroStable: true, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDbC, tokenOut: addr.USDC, fee: addr.FEE_LOWEST, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "USDC/DAI Aero(stable)→UniV3",
        borrowToken: addr.USDC,
        borrowSymbol: "USDC",
        borrowDecimals: 6,
        borrowAmount: "10000",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.DAI, fee: 0, aeroStable: true, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.DAI, tokenOut: addr.USDC, fee: addr.FEE_LOWEST, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "USDC/EURC Aero(stable)→UniV3",
        borrowToken: addr.USDC,
        borrowSymbol: "USDC",
        borrowDecimals: 6,
        borrowAmount: "5000",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.EURC, fee: 0, aeroStable: true, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.EURC, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 3 — LST (liquid staking tokens)
    // ═══════════════════════════════════════════════════════════
    {
        name: "cbETH/WETH UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "5",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.cbETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.cbETH, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "wstETH/WETH UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "3",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.wstETH, fee: addr.FEE_LOWEST, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.wstETH, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "rETH/WETH UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "3",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.rETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.rETH, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 4 — AERO token (native to Aerodrome — wide spreads)
    // ═══════════════════════════════════════════════════════════
    {
        name: "AERO/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.AERO, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.AERO, tokenOut: addr.WETH, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "AERO/WETH UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.AERO, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.AERO, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "AERO/USDC Aero→UniV3",
        borrowToken: addr.USDC,
        borrowSymbol: "USDC",
        borrowDecimals: 6,
        borrowAmount: "2000",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.AERO, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.AERO, tokenOut: addr.USDC, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 5 — Meme/volatile tokens (thinnest liquidity = best arb)
    // ═══════════════════════════════════════════════════════════
    {
        name: "DEGEN/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.DEGEN, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.DEGEN, tokenOut: addr.WETH, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "DEGEN/WETH UniV3→Aero",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.DEGEN, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.DEGEN, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "BRETT/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.BRETT, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.BRETT, tokenOut: addr.WETH, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "TOSHI/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.3",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.TOSHI, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.TOSHI, tokenOut: addr.WETH, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "VIRTUAL/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.VIRTUAL, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.VIRTUAL, tokenOut: addr.WETH, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 6 — DeFi tokens
    // ═══════════════════════════════════════════════════════════
    {
        name: "COMP/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.COMP, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.COMP, tokenOut: addr.WETH, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "SNX/WETH Aero→UniV3",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.SNX, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.SNX, tokenOut: addr.WETH, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },

    // ═══════════════════════════════════════════════════════════
    //  TIER 7 — Triangular arbitrage (3-hop paths)
    // ═══════════════════════════════════════════════════════════
    {
        name: "WETH→USDC→DAI→WETH Tri-arb",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "2",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.USDC, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.USDC, tokenOut: addr.DAI, fee: 0, aeroStable: true, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V2, router: addr.SUSHISWAP_ROUTER, tokenIn: addr.DAI, tokenOut: addr.WETH, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH→AERO→USDC→WETH Tri-arb",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "1",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.AERO, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.AERO, tokenOut: addr.USDC, fee: addr.FEE_MEDIUM, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH→DEGEN→USDC→WETH Tri-arb",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "0.5",
        steps: [
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.WETH, tokenOut: addr.DEGEN, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.DEGEN, tokenOut: addr.USDC, fee: addr.FEE_HIGH, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
    {
        name: "WETH→cbETH→USDC→WETH Tri-arb",
        borrowToken: addr.WETH,
        borrowSymbol: "WETH",
        borrowDecimals: 18,
        borrowAmount: "2",
        steps: [
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.WETH, tokenOut: addr.cbETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_AERODROME, router: addr.AERODROME_ROUTER, tokenIn: addr.cbETH, tokenOut: addr.USDC, fee: 0, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
            { dexType: addr.DEX_UNISWAP_V3, router: addr.UNISWAP_V3_ROUTER, tokenIn: addr.USDC, tokenOut: addr.WETH, fee: addr.FEE_LOW, aeroStable: false, aeroFactory: addr.AERODROME_FACTORY },
        ],
    },
];
