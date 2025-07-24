import React from 'react';
import '../styles/SwapPage.css'

const TokenSelector = ({ tokens, onSelect, onClose }) => {
    return (
        <div className="token-selector-modal">
            <div className="token-selector-backdrop" onClick={onClose}></div>
            <div className="token-selector-content">
                <div className="token-selector-header">
                    <h3>Select a token</h3>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="token-list">
                    {tokens.map((token) => (
                        <div
                            key={token.symbol}
                            className="token-item"
                            onClick={() => onSelect(token)}
                        >
                            <img src={token.icon} alt={token.symbol} className="token-icon" />
                            <span>{token.symbol}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TokenSelector;