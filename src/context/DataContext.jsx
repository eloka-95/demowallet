import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loadingAllUsers, setLoadingAllUsers] = useState(false);
    const [errorAllUsers, setErrorAllUsers] = useState(null);
    const [loading, setLoading] = useState({
        user: false,
        crypto: false,
        all: false
    });
    const [error, setError] = useState({
        user: null,
        crypto: null
    });

    const fetchAllUsers = useCallback(async () => {
        try {
            setLoadingAllUsers(true);
            setErrorAllUsers(null);

            const response = await api.get('/api/users'); // Adjust URL if needed
            setAllUsers(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch all users';
            setErrorAllUsers(errorMsg);
            throw err;
        } finally {
            setLoadingAllUsers(false);
        }
    }, []);

    const fetchUserDetails = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, user: true }));
            setError(prev => ({ ...prev, user: null }));

            const response = await api.get('/api/user');
            setUserDetails(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.status === 401
                ? 'Please login to access this data'
                : err.response?.data?.message || err.message || 'Failed to fetch user details';

            setError(prev => ({ ...prev, user: errorMsg }));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, user: false }));
        }
    }, []);

    const fetchCryptocurrencies = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, crypto: true }));
            setError(prev => ({ ...prev, crypto: null }));

            // Changed endpoint to match your Laravel routes
            const response = await api.get('/api/cryptocurrencies');
            setCryptocurrencies(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.status === 404
                ? 'Cryptocurrency data not available'
                : err.response?.data?.message || err.message || 'Failed to fetch cryptocurrencies';

            setError(prev => ({ ...prev, crypto: errorMsg }));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, crypto: false }));
        }
    }, []);

    const refreshAllData = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(prev => ({ ...prev, all: true }));
            await Promise.all([fetchUserDetails(), fetchAllUsers()
                , fetchCryptocurrencies()]);
            setError({ user: null, crypto: null });
        } catch (err) {
            console.error("Failed to refresh all data:", err);
        } finally {
            setLoading(prev => ({ ...prev, all: false }));
        }
    }, [isAuthenticated, fetchUserDetails, fetchAllUsers, fetchCryptocurrencies]);

    useEffect(() => {
        const loadData = async () => {
            if (isAuthenticated) {
                await refreshAllData();
            } else {
                setUserDetails(null);
                setCryptocurrencies([]);
                setError({ user: null, crypto: null });
            }
        };

        loadData();
    }, [isAuthenticated, refreshAllData]);

    const value = {
        userDetails,
        cryptocurrencies,
        allUsers,
        loading: {
            ...loading,
            allUsers: loadingAllUsers
        },
        error: {
            ...error,
            allUsers: errorAllUsers
        },
        refreshAllData,
        fetchUserDetails,
        fetchCryptocurrencies,
        fetchAllUsers
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}