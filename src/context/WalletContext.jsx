import React, { createContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext'; // Import useAuth instead of AuthContext

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallets, setWallets] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Use the useAuth hook to access auth state
    const {
        isAuthenticated,
        currentUser,
        loading: authLoading
    } = useAuth();

    const fetchWallets = useCallback(async (currentRetry = 0) => {
        if (authLoading || !isAuthenticated) {
            setWallets(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/api/wallets');
            setWallets(response.data);
            setError(null);
            setRetryCount(0);
        } catch (err) {
            console.error('Failed to fetch wallets:', err);

            if (err.response?.status === 401) {
                setError(new Error('Session expired. Please login again.'));
                return;
            }

            if (currentRetry < 3) {
                const delay = 2000 * Math.pow(2, currentRetry);
                const timer = setTimeout(() => {
                    fetchWallets(currentRetry + 1);
                }, delay);
                return () => clearTimeout(timer);
            } else {
                setError(err);
                setRetryCount(currentRetry);
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, authLoading, currentUser?.id]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchWallets();
        } else {
            setWallets(null);
        }
    }, [fetchWallets, isAuthenticated, authLoading]);

    useEffect(() => {
        return () => {
            setWallets(null);
            setLoading(false);
            setError(null);
        };
    }, []);

    const value = {
        wallets,
        loading: loading || authLoading,
        error,
        retryCount,
        refetchWallets: () => fetchWallets(0),
        isReady: !authLoading
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

// Custom hook for consuming wallet context
export function useWallet() {
    const context = React.useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}