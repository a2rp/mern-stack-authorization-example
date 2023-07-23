import { useState } from "react";
import axios from "axios";
import styles from "./ForgotPasswordPage.module.scss";
import { NavLink, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const forgotPasswordHandler = async (event) => {
        event.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post("http://localhost:1198/api/auth/forgotpassword", { email }, config);
            setSuccess(data.data);
        } catch (error) {
            setError(error.response.data.error);
            setEmail("");
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={forgotPasswordHandler} className={styles.form}>
                <h3 className={styles.title}>Forgot Password</h3>
                <div className={styles.formGroup}>
                    <p className={styles.info}>
                        Please enter the email address you registered your account with. Reset password confirmation will be sent to this email.
                    </p>
                    <label htmlFor="email">Email:</label>
                    <input type="email" required id="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className={styles.infoButtonContainer}>
                    <div className={styles.infoContainer}>
                        {error ? <span className={styles.errorMessage}>{error}</span> : null}
                        {success ? <span className={styles.successMessage}>{success}</span> : null}
                    </div>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Send Email</button>
                </div>

                <div className={styles.loginRegisterContainer}>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;