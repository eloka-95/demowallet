// src/utils/format.js

export const formatCurrency = (value, fallback = 'N/A') => {
    if (value === undefined || value === null || isNaN(value)) return fallback;
    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};



export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
