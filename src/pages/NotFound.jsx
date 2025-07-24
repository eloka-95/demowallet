import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css'

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-glass-card">
                <div className="not-found-content">
                    <div className="not-found-illustration">
                        <div className="web3-404">404</div>
                        <div className="polygon-1"></div>
                        <div className="polygon-2"></div>
                        <div className="polygon-3"></div>
                    </div>

                    <h1 className="not-found-title">Page Not Found</h1>
                    <p className="not-found-text">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="not-found-actions">
                        <Link to="/" className="not-found-button primary">
                            Return Home
                        </Link>
                        <Link to="/contact" className="not-found-button secondary">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;