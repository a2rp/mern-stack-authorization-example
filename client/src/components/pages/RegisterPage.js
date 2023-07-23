import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from "./RegisterPage.module.scss";
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import PrivatePage from './PrivatePage';

import loading from "../../assets/images/loading-gif.gif";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const registerHandler = async event => {
        event.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        };

        if (password != confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            const { data } = await axios.post("http://localhost:1198/api/auth/register", { username, email, password }, config);
            localStorage.setItem("authToken", data.token);
            navigate("/");
        } catch (error) {
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
            <form onSubmit={registerHandler} className={styles.form}>
                <h3 className={styles.title}>Register</h3>

                <div className={styles.formGroup}>
                    <label htmlFor="name">Username:</label>
                    <input type="text" required id="name" name="name" placeholder="Username" value={username} onChange={(event) => setUserName(event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" required id="email" email="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" required id="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" required id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>

                <div className={styles.errorInfoRegisterButtonContainer}>
                    <div className={styles.errorInfoContainer}>{error ? <span className={styles.errorMessage}>{error}</span> : null}</div>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Register</button>
                </div>

                <div className={styles.loginRegisterContainer}>
                    {loading
                        ? <img src={loading} alt="loading" style={{ height: "30px" }} />
                        : <>
                            <NavLink className={styles.loginLink} to="/login">Login</NavLink>
                            <NavLink className={styles.forgotPasswordLink} to="/forgotpassword">Forgot Password</NavLink>
                        </>}
                </div>
            </form>
        </div>
    )
}

export default RegisterPage
