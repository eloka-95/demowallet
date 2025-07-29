import React, { useState, useEffect, useCallback } from 'react'
import { useConversionRates } from '../context/ConversionRateContext';
import { useData } from '../context/DataContext';
import '../styles/SwapPage.css';

export default function SwapPage() {
  const { convertAmount, getRate } = useConversionRates()
  const { userDetails, cryptocurrencies } = useData()

  // State for form inputs
  const [fromCoin, setFromCoin] = useState('BTC')
  const [toCoin, setToCoin] = useState('USDT_TRC20')
  const [amount, setAmount] = useState('')
  const [estimatedAmount, setEstimatedAmount] = useState(0)
  const [error, setError] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  // Filter out Ethereum completely and create coin options
  const availableCoins = (cryptocurrencies?.cryptocurrencies || []).filter(coin =>
    !['ETH', 'ETH_1', 'ETH_2'].includes(coin.symbol)
  )

  // Format coin name for display
  const formatCoinName = (symbol) => {
    const names = {
      'USDT_TRC20': 'USDT (TRC20)',
      'USDT_ERC20': 'USDT (ERC20)',
      'BTC': 'Bitcoin',
      'TRX': 'Tron',
      'SOL': 'Solana',
      'XRP': 'Ripple',
      'AVAX': 'Avalanche',
      'POL': 'Polygon'
    }
    return names[symbol] || symbol
  }

  // Calculate estimated amount when inputs change
  useEffect(() => {
    if (!amount || isNaN(amount)) {
      setEstimatedAmount(0)
      return
    }

    try {
      const parsedAmount = parseFloat(amount)
      if (parsedAmount <= 0) {
        setEstimatedAmount(0)
        return
      }

      const estimated = convertAmount(parsedAmount, fromCoin, toCoin)
      setEstimatedAmount(estimated)
      setError('')
    } catch (err) {
      console.error('Error calculating conversion:', err)
    }
  }, [amount, fromCoin, toCoin, convertAmount])

  // Get user's balance for selected coin
  const getBalance = useCallback((coinSymbol) => {
    if (!userDetails) return 0

    // Handle USDT variants
    const symbolKey = coinSymbol.toLowerCase()
    return parseFloat(userDetails[symbolKey] || 0)
  }, [userDetails])

  // Handle swap submission
  const handleSwap = async (e) => {
    e.preventDefault()

    // Show feature not available message
    setError('Swap feature is not available at the moment. Coming soon!')
    setIsSwapping(false)
  }

  // Handle max amount click
  const handleMaxAmount = () => {
    const balance = getBalance(fromCoin)
    setAmount(balance.toString())
  }

  return (
    <div className="swap-container">
      <h2 className="swap-title">Swap Cryptocurrencies</h2>

      {error && <div className="swap-error">{error}</div>}

      <form onSubmit={handleSwap} className="swap-form">
        <div className="swap-input-group">
          <label htmlFor="from-amount">From</label>
          <div className="swap-input-wrapper">
            <input
              id="from-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="any"
              min="0"
            />
            <div className="swap-coin-selector">
              <select
                value={fromCoin}
                onChange={(e) => setFromCoin(e.target.value)}
              >
                {availableCoins.map(coin => (
                  <option key={coin.id} value={coin.symbol}>
                    {formatCoinName(coin.symbol)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="swap-balance">
            Balance: {getBalance(fromCoin).toFixed(8)} {formatCoinName(fromCoin)}
            <button
              type="button"
              onClick={handleMaxAmount}
              className="swap-max-btn"
            >
              Max
            </button>
          </div>
        </div>

        <div className="swap-arrow">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </div>

        <div className="swap-input-group">
          <label htmlFor="to-amount">To</label>
          <div className="swap-input-wrapper">
            <input
              id="to-amount"
              type="text"
              value={estimatedAmount.toFixed(8)}
              readOnly
              placeholder="0.00"
            />
            <div className="swap-coin-selector">
              <select
                value={toCoin}
                onChange={(e) => setToCoin(e.target.value)}
              >
                {availableCoins.map(coin => (
                  <option key={`to-${coin.id}`} value={coin.symbol}>
                    {formatCoinName(coin.symbol)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="swap-balance">
            Balance: {getBalance(toCoin).toFixed(8)} {formatCoinName(toCoin)}
          </div>
        </div>

        <button
          type="submit"
          className="swap-button"
          disabled={isSwapping || !amount || parseFloat(amount) <= 0}
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </button>
      </form>

      <div className="swap-rate-info">
        <p>
          Rate: 1 {formatCoinName(fromCoin)} = {convertAmount(1, fromCoin, toCoin).toFixed(8)} {formatCoinName(toCoin)}
        </p>
        <p>
          Inverse: 1 {formatCoinName(toCoin)} = {convertAmount(1, toCoin, fromCoin).toFixed(8)} {formatCoinName(fromCoin)}
        </p>
      </div>
    </div>
  )
}