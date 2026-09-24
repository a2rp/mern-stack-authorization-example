import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FiCheckCircle, FiKey, FiLock, FiRefreshCw } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import { API_BASE_URL } from "../../constants";
import styles from "./auth.module.scss";

const ResetPasswordPage = () => {
    const { resetToken } = useParams();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetPasswordHandler = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/auth/resetpassword/${resetToken}`, { password }, { headers: { "Content-Type": "application/json" } });
            setSuccess(data.data);
        } catch (requestError) {
            setError(requestError.response?.data?.error || "Unable to reset the password right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.grid}>
                    <div className={styles.intro}><span className={styles.eyebrow}><FiRefreshCw /> New password</span><h1 className={styles.heading}>Choose a stronger way back in.</h1><p className={styles.lead}>Set a new password using the reset token sent to your email.</p><ul className={styles.points}><li><FiCheckCircle /> Token-based reset route</li><li><FiCheckCircle /> Confirmed password entry</li></ul></div>
                    <div className={styles.card}>
                        <h2 className={styles.title}>Reset password</h2>
                        <p className={styles.subtitle}>Create and confirm your new password.</p>
                        <form className={styles.form} onSubmit={resetPasswordHandler}>
                            <div className={styles.formGroup}><label htmlFor="password">New password</label><div className={styles.inputWrap}><FiLock className={styles.inputIcon} /><input className={styles.input} type="password" required id="password" autoComplete="new-password" placeholder="Enter new password" value={password} onChange={(event) => setPassword(event.target.value)} /></div></div>
                            <div className={styles.formGroup}><label htmlFor="confirmPassword">Confirm new password</label><div className={styles.inputWrap}><FiKey className={styles.inputIcon} /><input className={styles.input} type="password" required id="confirmPassword" autoComplete="new-password" placeholder="Repeat new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div></div>
                            <div className={`${styles.status} ${styles.error}`} role="alert">{error}</div>
                            <div className={`${styles.status} ${styles.success}`} role="status">{success}{success && <> <Link to="/login">Return to login</Link></>}</div>
                            <button className={styles.button} type="submit" disabled={loading}><FiRefreshCw /> {loading ? "Resetting..." : "Reset password"}</button>
                        </form>
                    </div>
                </div>
            </section>
        </AppShell>
    );
};

export default ResetPasswordPage;