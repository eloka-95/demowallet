// Mapping of your coin names to CoinGecko API IDs
export const COIN_ID_MAPPING = {
    BTC: "bitcoin",
    USDT: "tether", // For both ERC20 and TRC20
    ETH: "ethereum",
    TRX: "tron",
    SOL: "solana",
    XRP: "ripple",
    AVAX: "avalanche-2",
    POL: "polygon-ecosystem-token",
}

// Export mapping with underscores for your API
export const RATE_EXPORT_MAPPING = {
    Bitcoin: "btc",
    "Tether ERC20": "usdt_erc20",
    "Tether TRC20": "usdt_trc20",
    Ethereum: "eth",
    Tron: "trx",
    Solana: "sol",
    Ripple: "xrp",
    Avalanche: "avax",
    Polygon: "pol",
}

// CoinGecko API configuration
export const COINGECKO_CONFIG = {
    baseURL: "https://api.coingecko.com/api/v3",
    endpoints: {
        markets: "/coins/markets",
    },
    defaultParams: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
    },
}