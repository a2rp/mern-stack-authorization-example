import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// routing
import PrivateRoute from './components/routing/PrivateRoute';

// pages
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import PrivatePage from './components/pages/PrivatePage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* <PrivateRoute exact path="/" element={<PrivatePage />} /> */}
                    <Route exact path="/" element={<PrivatePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                    <Route path="/resetpassword/:resetToken" element={<ResetPasswordPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
