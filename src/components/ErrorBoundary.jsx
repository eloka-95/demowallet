import { useData } from '../context/DataContext';



function ErrorBoundary({ children }) {
    const { error } = useData();

    if (error.user || error.crypto) {
        return (
            <div className="error-container">
                <h3>Data Loading Error</h3>
                <p>{error.user || error.crypto}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return children;
}

export default ErrorBoundary;