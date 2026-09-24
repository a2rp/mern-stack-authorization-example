import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiKey, FiMail, FiSend } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import { API_BASE_URL } from "../../constants";
import styles from "./auth.module.scss";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const forgotPasswordHandler = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgotpassword`, { email }, { headers: { "Content-Type": "application/json" } });
            setSuccess(data.data);
        } catch (requestError) {
            setError(requestError.response?.data?.error || "Unable to send the reset email right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.grid}>
                    <div className={styles.intro}>
                        <span className={styles.eyebrow}><FiKey /> Account recovery</span>
                        <h1 className={styles.heading}>A clear path back into your account.</h1>
                        <p className={styles.lead}>Request a reset link from the existing API and choose a new password from the secure token route.</p>
                        <ul className={styles.points}><li><FiCheckCircle /> Email-based reset request</li><li><FiCheckCircle /> Time-limited reset token</li><li><FiCheckCircle /> Simple recovery experience</li></ul>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Forgot password?</h2>
                        <p className={styles.subtitle}>Enter the email connected to your account.</p>
                        <form className={styles.form} onSubmit={forgotPasswordHandler}>
                            <div className={styles.formGroup}><label htmlFor="email">Email address</label><div className={styles.inputWrap}><FiMail className={styles.inputIcon} /><input className={styles.input} type="email" required id="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div></div>
                            <div className={`${styles.status} ${styles.error}`} role="alert">{error}</div>
                            <div className={`${styles.status} ${styles.success}`} role="status">{success}</div>
                            <button className={styles.button} type="submit" disabled={loading}><FiSend /> {loading ? "Sending..." : "Send reset email"}</button>
                        </form>
                        <div className={styles.links}><NavLink to="/login"><FiArrowLeft /> Back to login</NavLink><NavLink to="/register">Create account</NavLink></div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
};

export default ForgotPasswordPage;