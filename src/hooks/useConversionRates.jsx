import { useContext } from 'react';
import ConversionRateContext from '../context/ConversionRateContext';

export const useConversionRates = () => {
    const context = useContext(ConversionRateContext);
    if (!context) {
        throw new Error('useConversionRates must be used within a ConversionRateProvider');
    }

    const getRate = (symbol) => {
        const normalizedSymbol = symbol.toUpperCase();
        return context.rates[normalizedSymbol] || 0;
    };

    return { ...context, getRate };
};