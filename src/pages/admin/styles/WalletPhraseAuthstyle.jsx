export const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "20px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Loading States
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  loadingCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    color: "#f8fafc",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99, 102, 241, 0.3)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    margin: 0,
    fontSize: "16px",
    color: "#cbd5e1",
  },

  // Error States
  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  errorCard: {
    background: "rgba(239, 68, 68, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    color: "#f8fafc",
    maxWidth: "400px",
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  errorText: {
    margin: "0 0 24px 0",
    fontSize: "16px",
    color: "#fecaca",
  },
  retryButton: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Header
  header: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
  },
  headerContent: {
    marginBottom: "24px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    margin: 0,
    fontSize: "16px",
    color: "#cbd5e1",
  },
  controls: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: "1",
    minWidth: "200px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
  },
  filterWrapper: {
    minWidth: "150px",
  },
  filterSelect: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },

  // Desktop Table
  desktopTable: {
    display: "block",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  tableWrapper: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    background: "rgba(99, 102, 241, 0.1)",
  },
  tableHeader: {
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  tableRow: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.2s ease",
  },
  tableCell: {
    padding: "16px",
    color: "#f8fafc",
    fontSize: "14px",
    verticalAlign: "top",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  userName: {
    fontWeight: "500",
    color: "#f8fafc",
  },
  userEmail: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  coinName: {
    fontWeight: "600",
    color: "#10b981",
  },
  dateInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  timeText: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  // Status Badges
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statusPending: {
    background: "rgba(245, 158, 11, 0.2)",
    color: "#fbbf24",
    border: "1px solid rgba(245, 158, 11, 0.3)",
  },
  statusVerified: {
    background: "rgba(16, 185, 129, 0.2)",
    color: "#34d399",
    border: "1px solid rgba(16, 185, 129, 0.3)",
  },
  statusRejected: {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },

  // Buttons
  viewButton: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  approveButton: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  rejectButton: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Mobile Cards
  mobileCards: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },
  walletCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    transition: "all 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardId: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#6366f1",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  infoLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#94a3b8",
    minWidth: "60px",
  },
  infoValue: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    textAlign: "right",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  viewButtonMobile: {
    flex: "1",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  approveButtonMobile: {
    flex: "1",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  rejectButtonMobile: {
    flex: "1",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // No Results
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
    fontSize: "16px",
  },
  noResultsCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },

  // Phrase Display
  phraseContainer: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "24px",
  },
  phraseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  phraseTitle: {
    flex: "1",
  },
  phraseTitleText: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#f8fafc",
  },
  phraseSubtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#94a3b8",
  },
  copyButton: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  copyButtonCopied: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  phraseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  phraseWord: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "12px 16px",
    transition: "all 0.2s ease",
  },
  wordNumber: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6366f1",
    minWidth: "20px",
  },
  wordText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#f8fafc",
    fontFamily: "monospace",
  },
}

// Add CSS animations
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .desktop-table { display: none !important; }
    .mobile-cards { display: block !important; }
  }
  
  @media (min-width: 769px) {
    .desktop-table { display: block !important; }
    .mobile-cards { display: none !important; }
  }
  
  /* Hover effects */
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .wallet-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .phrase-word:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(99, 102, 241, 0.3);
  }
  
  input:focus, select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`
document.head.appendChild(styleSheet)

