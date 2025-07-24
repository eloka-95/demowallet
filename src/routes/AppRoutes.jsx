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
import AdminWalletPhrase from "../pages/admin/WalletPhrase"
import UseAdminLayout from "../layouts/AdminLayout"
import UserDetail from "../pages/admin/UserDetail"
import ProtectedRoute from "../pages/Auth/ProtectedRoute"
import VerifyEmail from "../components/VerifyEmail"
import Sendcoin from "../pages/Send"
import Receivecoin from "../pages/Receive"



export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />


            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="send" element={<Send />} />
                    <Route path="receive" element={<Receive />} />
                    <Route path="transfer/:type" element={<CoinSelection />} />
                    <Route path="send-transaction/:coinId" element={<Sendcoin />} />
                    <Route path="receive-transaction/:coinId" element={<Receivecoin />} />
                    <Route path="wallet-details/:amount" element={<WalletDetails />} />
                    <Route path="kyc-verification" element={<KYCVerification />} />
                    <Route path="wallet-connect" element={<WalletConnect />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="swap" element={<SwapPage />} />
                </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute isAdmin={true} />}>
                <Route path="/admin" element={<UseAdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="cryptocurrency" element={<AdminCryptocurrency />} />
                    <Route path="history" element={<AdminHistory />} />
                    <Route path="wallets" element={<AdminWallets />} />
                    <Route path="wallet-phrase" element={<AdminWalletPhrase />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="user/:id" element={<UserDetail />} />
                </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
