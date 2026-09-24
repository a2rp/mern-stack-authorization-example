import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiKey, FiLock, FiLogIn, FiMail } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import { API_BASE_URL } from "../../constants";
import styles from "./auth.module.scss";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("authToken")) navigate("/");
    }, [navigate]);

    const loginHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password }, { headers: { "Content-Type": "application/json" } });
            localStorage.setItem("authToken", data.token);
            navigate("/");
        } catch (requestError) {
            setError(requestError.response?.data?.error || "Unable to connect to the authentication server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.grid}>
                    <div className={styles.intro}>
                        <span className={styles.eyebrow}><FiKey /> Protected access</span>
                        <h1 className={styles.heading}>Welcome back to your secure workspace.</h1>
                        <p className={styles.lead}>A clear example of authentication, protected routes and account recovery built with a MERN stack.</p>
                        <ul className={styles.points}>
                            <li><FiCheckCircle /> Token-based login flow</li>
                            <li><FiCheckCircle /> Protected profile page</li>
                            <li><FiCheckCircle /> Password reset support</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Sign in</h2>
                        <p className={styles.subtitle}>Use your account details to continue.</p>
                        <form className={styles.form} onSubmit={loginHandler}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email address</label>
                                <div className={styles.inputWrap}><FiMail className={styles.inputIcon} /><input className={styles.input} type="email" required id="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.inputWrap}><FiLock className={styles.inputIcon} /><input className={styles.input} type="password" required id="password" autoComplete="current-password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
                            </div>
                            <div className={`${styles.status} ${styles.error}`} role="alert">{error}</div>
                            <button className={styles.button} type="submit" disabled={loading}><FiLogIn /> {loading ? "Signing in..." : "Sign in"}</button>
                        </form>
                        <div className={styles.links}><NavLink to="/forgotpassword">Forgot password?</NavLink><NavLink to="/register">Create account</NavLink></div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
};

export default LoginPage;