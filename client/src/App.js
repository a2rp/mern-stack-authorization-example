import "./App.css";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import PrivatePage from "./components/pages/PrivatePage";
import PrivateRoute from "./components/routing/PrivateRoute";
import { AuthProvider } from "./auth/AuthContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PrivateRoute><PrivatePage /></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                    <Route path="/resetpassword/:resetToken" element={<ResetPasswordPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
