import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiKey, FiLock, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import { API_BASE_URL } from "../../constants";
import styles from "./auth.module.scss";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const registerHandler = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setPassword("");
            setConfirmPassword("");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, { username, email, password }, { headers: { "Content-Type": "application/json" } });
            localStorage.setItem("authToken", data.token);
            navigate("/");
        } catch (requestError) {
            setError(requestError.response?.data?.error || "Unable to create the account right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.grid}>
                    <div className={styles.intro}>
                        <span className={styles.eyebrow}><FiUserPlus /> New account</span>
                        <h1 className={styles.heading}>Create a secure place to start.</h1>
                        <p className={styles.lead}>The registration flow connects to the existing Express API and keeps the original token-based behavior intact.</p>
                        <ul className={styles.points}>
                            <li><FiCheckCircle /> Simple account creation</li>
                            <li><FiCheckCircle /> Secure password handling</li>
                            <li><FiCheckCircle /> Immediate protected access</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Create account</h2>
                        <p className={styles.subtitle}>Enter a few details to get started.</p>
                        <form className={styles.form} onSubmit={registerHandler}>
                            <div className={styles.formGroup}><label htmlFor="name">Username</label><div className={styles.inputWrap}><FiUser className={styles.inputIcon} /><input className={styles.input} type="text" required id="name" placeholder="Your name" value={username} onChange={(event) => setUserName(event.target.value)} /></div></div>
                            <div className={styles.formGroup}><label htmlFor="email">Email address</label><div className={styles.inputWrap}><FiMail className={styles.inputIcon} /><input className={styles.input} type="email" required id="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div></div>
                            <div className={styles.formGroup}><label htmlFor="password">Password</label><div className={styles.inputWrap}><FiLock className={styles.inputIcon} /><input className={styles.input} type="password" required id="password" autoComplete="new-password" placeholder="Create password" value={password} onChange={(event) => setPassword(event.target.value)} /></div></div>
                            <div className={styles.formGroup}><label htmlFor="confirmPassword">Confirm password</label><div className={styles.inputWrap}><FiKey className={styles.inputIcon} /><input className={styles.input} type="password" required id="confirmPassword" autoComplete="new-password" placeholder="Repeat password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div></div>
                            <div className={`${styles.status} ${styles.error}`} role="alert">{error}</div>
                            <button className={styles.button} type="submit" disabled={loading}><FiUserPlus /> {loading ? "Creating..." : "Create account"}</button>
                        </form>
                        <div className={styles.links}><NavLink to="/login">Already have an account?</NavLink><NavLink to="/forgotpassword">Forgot password?</NavLink></div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
};

export default RegisterPage;