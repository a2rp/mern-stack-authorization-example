import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiKey, FiMail, FiSend } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import styles from "./auth.module.scss";
import api from "../../api";

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
            const { data } = await api.post("/api/auth/forgotpassword", { email });
            setSuccess(data.message);
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
                        <p className={styles.lead}>If an account exists for that email, the API sends a time-limited reset link.</p>
                        <ul className={styles.points}><li><FiCheckCircle /> Email-based reset request</li><li><FiCheckCircle /> Time-limited reset token</li><li><FiCheckCircle /> One-time recovery link</li></ul>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Forgot password?</h2>
                        <p className={styles.subtitle}>Enter the email connected to your account.</p>
                        <form className={styles.form} onSubmit={forgotPasswordHandler}>
                            <div className={styles.formGroup}><label htmlFor="email">Email address</label><div className={styles.inputWrap}><FiMail className={styles.inputIcon} /><input className={styles.input} type="email" required id="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div></div>
                            <div className={styles.status + " " + styles.error} role="alert">{error}</div>
                            <div className={styles.status + " " + styles.success} role="status">{success}</div>
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
