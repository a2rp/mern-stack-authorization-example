import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import loading from "../../assets/images/loading-gif.gif";
import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage = ({ match }) => {
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        // console.log("reset");
        const url = window.location.href;
        // console.log(url);
        const token = url.split("/");
        const tokenValue = token[token.length - 1];
        console.log("tokenValue", tokenValue);

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords don't match");
        }
        console.log(password);

        try {
            setLoading(true);
            const { data } = await axios.put(`http://localhost:1198/api/auth/resetpassword/${tokenValue}`, { password }, config);

            console.log(data);
            setSuccess(data.data);
        } catch (error) {
            console.log(error);
            if (error.response) {
                setError(error.response.data.error);
            }
            setTimeout(() => {
                setError("");
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={resetPasswordHandler} className={styles.form}>
                <h3 className={styles.title}>Forgot Password</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        required
                        id="password"
                        placeholder="Enter new password"
                        autoComplete="true"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmpassword">Confirm New Password:</label>
                    <input
                        type="password"
                        required
                        id="confirmpassword"
                        placeholder="Confirm new password"
                        autoComplete="true"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className={styles.messageButtonContainer}>
                    <div className={styles.messageContainer}>
                        {error && <span className={styles.errorMessage}>{error} </span>}
                        {success && (
                            <span className={styles.successMessage}>
                                {success} <Link to="/login">Login</Link>
                            </span>
                        )}
                    </div>
                    <div className={styles.buttonContainer}>
                        {loading
                            ? <img src={loading} alt="loading" style={{ height: "30px" }} />
                            : <>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    Reset
                                </button>
                            </>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordPage;