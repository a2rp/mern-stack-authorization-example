import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from "./PrivatePage.module.scss";
import axios from 'axios';

const PrivatePage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            navigate("/login");
        }

        const fetchPrivateData = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            };

            try {
                const { data } = await axios.get("http://localhost:1198/api/private", config);
                setPrivateData(data.data);
            } catch (error) {
                localStorage.removeItem("authToken");
                setError("You are not authorized to access this page. Please login.");
            }
        };

        fetchPrivateData();
    }, [navigate]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Profile Page</h1>
            {error
                ? <div className={styles.errorMessageLoginContainer}>
                    <div className={styles.errorMessage}>{error}</div>
                    <NavLink to="/login">Login</NavLink>
                </div>
                : <div className={styles.dataLogoutContainer}>
                    <div className={styles.privateData}>{privateData}</div>
                    <button onClick={logoutHandler}>Logout</button>
                </div>}
        </div>
    );

}

export default PrivatePage
