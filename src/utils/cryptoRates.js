// CoinGecko API configuration
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_COIN_IDS = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT_ERC20: 'tether',
    USDT_TRC20: 'tether',
    TRX: 'tron',
    SOL: 'solana',
    XRP: 'ripple',
    AVAX: 'avalanche-2',
    POL: 'matic-network'
};

export const fetchCoinGeckoRates = async () => {
    try {
        // Get all coin prices in USD
        const response = await fetch(
            `${COINGECKO_API_URL}/simple/price?ids=${Object.values(COINGECKO_COIN_IDS).join(',')}&vs_currencies=usd`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch rates from CoinGecko');
        }

        const data = await response.json();

        // Transform to our format
        const rates = {};
        Object.entries(COINGECKO_COIN_IDS).forEach(([symbol, coinId]) => {
            rates[symbol] = data[coinId]?.usd || 0;
        });

        // Special handling for USDT variants (same price)
        rates.USDT_ERC20 = rates.USDT_ERC20 || 1;
        rates.USDT_TRC20 = rates.USDT_TRC20 || 1;

        return rates;
    } catch (error) {
        console.error('CoinGecko API error:', error);
        throw error;
    }
};