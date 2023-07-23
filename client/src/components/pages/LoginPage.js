import { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("authToken")) navigate("/");
    }, [navigate]);

    const loginHandler = async (event) => {
        event.preventDefault();
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post("http://localhost:1198/api/auth/login", { email, password }, config);
            localStorage.setItem("authToken", data.token);
            navigate("/");
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={loginHandler} className={styles.form}>
                <h3 className={styles.title}>Login</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        className={styles.emailInput}
                        type="email"
                        required
                        id="email"
                        placeholder="Email address"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        className={styles.passwordInput}
                        type="password"
                        required
                        id="password"
                        autoComplete="true"
                        placeholder="Enter password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                </div>

                <div className={styles.buttonInfoContainer}>
                    <div className={styles.errorMessageContainer}>{error && <div className={styles.errorMessage}>{error}</div>}</div>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Login</button>
                </div>


                <span className={styles.forgotPasswordRegisterLinkContainer}>
                    <div className={styles.forgotPasswordContainer}>
                        <NavLink to="/forgotpassword" className={styles.forgotpasswordLink}>Forgot Password?</NavLink>
                    </div>
                    <div className={styles.registerLinkContainer}>
                        <NavLink to="/register">Register</NavLink>
                    </div>
                </span>
            </form>
        </div>
    );
};

export default LoginPage;
