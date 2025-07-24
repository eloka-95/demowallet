import { RATE_EXPORT_MAPPING } from "../constants/coinMappings"

// Helper function to get export-ready rates
export const getExportRates = (rates) => {
    const exportRates = {}

    Object.entries(RATE_EXPORT_MAPPING).forEach(([coinName, exportKey]) => {
        let rate = 0

        switch (coinName) {
            case "Bitcoin":
                rate = rates["BTC"]?.current_price || 0
                break
            case "Tether ERC20":
            case "Tether TRC20":
                rate = rates["USDT"]?.current_price || 1.0
                break
            case "Ethereum":
                rate = rates["ETH"]?.current_price || 0
                break
            case "Tron":
                rate = rates["TRX"]?.current_price || 0
                break
            case "Solana":
                rate = rates["SOL"]?.current_price || 0
                break
            case "Ripple":
                rate = rates["XRP"]?.current_price || 0
                break
            case "Avalanche":
                rate = rates["AVAX"]?.current_price || 0
                break
            case "Polygon":
                rate = rates["POL"]?.current_price || 0
                break
        }

        exportRates[exportKey] = rate
    })

    return exportRates
}

// Helper function to get explorer URLs
export const getExplorerUrl = (network = "", txHash = "") => {
    const explorers = {
        bitcoin: "https://blockstream.info/tx/",
        ethereum: "https://etherscan.io/tx/",
        tron: "https://tronscan.org/#/transaction/",
        solana: "https://explorer.solana.com/tx/",
        ripple: "https://xrpscan.com/tx/",
        avalanche: "https://snowtrace.io/tx/",
        polygon: "https://polygonscan.com/tx/",
    }

    return explorers[network?.toLowerCase()] ? `${explorers[network.toLowerCase()]}${txHash}` : "#"
}

// Helper function to format balance display
export const formatBalance = (coin) => {
    if (!coin) return "0"
    return `${coin.cryptoBalance?.toFixed(8) || "0"} ${coin.symbol} ($${coin.usdBalance?.toFixed(2) || "0"})`
}

// Helper function to format price change
export const formatPriceChange = (change) => {
    if (!change) return "0.00%"
    const formatted = change.toFixed(2)
    return `${change >= 0 ? "+" : ""}${formatted}%`
}

// Helper function to format market cap
export const formatMarketCap = (marketCap) => {
    if (!marketCap) return "N/A"

    if (marketCap >= 1e12) {
        return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
        return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
        return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
        return `$${marketCap.toLocaleString()}`
    }
}
