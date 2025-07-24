import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { COIN_ID_MAPPING, COINGECKO_CONFIG } from "../constants/coinMappings"

const ConversionRateContext = createContext(undefined)

export const ConversionRateProvider = ({ children }) => {
    const [rates, setRates] = useState({})
    const [marketData, setMarketData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchRates = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Get all coin IDs we need
            const coinIds = Object.values(COIN_ID_MAPPING).join(",")

            // Build the URL with parameters
            const params = new URLSearchParams({
                ...COINGECKO_CONFIG.defaultParams,
                ids: coinIds,
            })

            const url = `${COINGECKO_CONFIG.baseURL}${COINGECKO_CONFIG.endpoints.markets}?${params}`

            // console.log("Fetching from:", url)

            // Fetch from CoinGecko API using the markets endpoint
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            // console.log("CoinGecko API Response:", data)

            // Convert the response to our format
            const newRates = {}
            const newMarketData = {}

            // Process each coin from the API response
            data.forEach((coin) => {
                // Find which symbol this coin corresponds to in our mapping
                const symbol = Object.keys(COIN_ID_MAPPING).find((key) => COIN_ID_MAPPING[key] === coin.id)

                if (symbol) {
                    // Store the rate (for backward compatibility)
                    newRates[symbol] = coin.current_price

                    // Store comprehensive market data
                    newMarketData[symbol] = {
                        id: coin.id,
                        symbol: coin.symbol.toUpperCase(),
                        name: coin.name,
                        current_price: coin.current_price,
                        market_cap: coin.market_cap,
                        market_cap_rank: coin.market_cap_rank,
                        price_change_24h: coin.price_change_24h,
                        price_change_percentage_24h: coin.price_change_percentage_24h,
                        market_cap_change_24h: coin.market_cap_change_24h,
                        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
                        circulating_supply: coin.circulating_supply,
                        total_supply: coin.total_supply,
                        max_supply: coin.max_supply,
                        ath: coin.ath,
                        ath_change_percentage: coin.ath_change_percentage,
                        ath_date: coin.ath_date,
                        atl: coin.atl,
                        atl_change_percentage: coin.atl_change_percentage,
                        atl_date: coin.atl_date,
                        last_updated: coin.last_updated,
                        image: coin.image,
                    }

                    // For USDT, set both ERC20 and TRC20 to the same data
                    if (symbol === "USDT") {
                        newRates["USDT_ERC20"] = coin.current_price
                        newRates["USDT_TRC20"] = coin.current_price
                        newMarketData["USDT_ERC20"] = { ...newMarketData[symbol] }
                        newMarketData["USDT_TRC20"] = { ...newMarketData[symbol] }
                    }
                }
            })

            setRates(newRates)
            setMarketData(newMarketData)
            setLastUpdated(new Date())

        } catch (err) {
            console.error("Error fetching conversion rates:", err)
            setError(err instanceof Error ? err.message : "Failed to fetch rates")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const refreshRates = useCallback(async () => {
        await fetchRates()
    }, [fetchRates])

    const getRate = useCallback(
        (coinSymbol) => {
            if (coinSymbol.toUpperCase() === "USD") return 1;

            // Handle different USDT variants
            if (coinSymbol === "USDT") {
                return rates["USDT"] || 1.0
            }

            return rates[coinSymbol.toUpperCase()] || 0
        },
        [rates],
    )

    const getMarketData = useCallback(
        (coinSymbol) => {
            // Handle different USDT variants
            if (coinSymbol === "USDT") {
                return marketData["USDT"] || null
            }

            return marketData[coinSymbol.toUpperCase()] || null
        },
        [marketData],
    )

    const convertAmount = useCallback(
        (amount, fromCoin, toCoin = "USD") => {
            if (toCoin.toUpperCase() === "USD") {
                const rate = getRate(fromCoin)
                return amount * rate
            }

            // For crypto-to-crypto conversion
            const fromRate = getRate(fromCoin)
            const toRate = getRate(toCoin)

            if (fromRate === 0 || toRate === 0) return 0

            return (amount * fromRate) / toRate
        },
        [getRate],
    )

    // Fetch rates on mount and set up interval
    useEffect(() => {
        fetchRates()

        // Update rates every 60 seconds (markets endpoint is less frequent)
        const interval = setInterval(fetchRates, 60000)

        return () => clearInterval(interval)
    }, [fetchRates])

    const value = {
        rates,
        marketData,
        isLoading,
        error,
        lastUpdated,
        refreshRates,
        getRate,
        getMarketData,
        convertAmount,
    }

    return <ConversionRateContext.Provider value={value}>{children}</ConversionRateContext.Provider>
}

export const useConversionRates = () => {
    const context = useContext(ConversionRateContext)
    if (context === undefined) {
        throw new Error("useConversionRates must be used within a ConversionRateProvider")
    }
    return context
}
