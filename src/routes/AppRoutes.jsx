import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Send from "../pages/Send"
import CoinSelection from "../components/CoinSelection"
import Receive from "../pages/Receive"
import WalletDetails from "../pages/WalletDetails"
import KYCVerification from "../pages/KYCVerification"
import WalletConnect from "../pages/WalletConnect"
import SettingsPage from "../pages/SettingsPage"
import AppLayout from "../layouts/AppLayout"
import SwapPage from "../pages/SwapPage"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import ForgotPassword from "../pages/Auth/ForgotPassword"
import NotFound from "../pages/NotFound"
import AdminDashboard from "../pages/admin/Dashboard"
import AdminUsers from "../pages/admin/Users"
import AdminHistory from "../pages/admin/History"
import AdminWallets from "../pages/admin/Wallets"
import AdminCryptocurrency from "../pages/admin/Cryptocurrency"
import UseAdminLayout from "../layouts/AdminLayout"
import UserDetail from "../pages/admin/UserDetail"
import ProtectedRoute from "../pages/Auth/ProtectedRoute"
import VerifyEmail from "../components/VerifyEmail"
import Sendcoin from "../pages/Send"
import Receivecoin from "../pages/Receive"
import AdminKYCVerification from "../pages/admin/AdminKYCVerification"
import WalletPhraseAuth from "../pages/admin/WalletPhrase"
import Transaction from "../pages/admin/Transaction"
import UserTransactionHistory from "../pages/UserTransactionHistory"
import AuthGuard from "../pages/Auth/AuthGuard"

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}

            <Route path="/wallet/login" element={<AuthGuard><Login /></AuthGuard>} />
            <Route path="/wallet/register" element={<AuthGuard><Register /></AuthGuard>} />
            <Route path="/wallet/forgot-password" element={<AuthGuard><ForgotPassword /></AuthGuard>} />
            <Route path="/wallet/verify-email" element={<AuthGuard><VerifyEmail /></AuthGuard>} />
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/wallet" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="send" element={<Send />} />
                    <Route path="transaction-History" element={<UserTransactionHistory />} />
                    <Route path="receive" element={<Receive />} />
                    <Route path="transfer/:type" element={<CoinSelection />} />
                    <Route path="send-transaction/:coinId" element={<Sendcoin />} />
                    <Route path="receive-transaction/:coinId" element={<Receivecoin />} />
                    <Route path="wallet-details/:coin/:usdAmount/:coinAmount" element={<WalletDetails />} />
                    <Route path="kyc-verification" element={<KYCVerification />} />
                    <Route path="wallet-connect" element={<WalletConnect />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="swap" element={<SwapPage />} />
                </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute isAdmin={true} />}>
                <Route path="/wallet/admin" element={<UseAdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="cryptocurrency" element={<AdminCryptocurrency />} />
                    <Route path="history" element={<AdminHistory />} />
                    <Route path="wallets" element={<AdminWallets />} />
                    <Route path="kyccheck" element={<AdminKYCVerification />} />
                    <Route path="wallet-phrase" element={<WalletPhraseAuth />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="transaction" element={<Transaction />} />
                    <Route path="user/:id" element={<UserDetail />} />
                </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
