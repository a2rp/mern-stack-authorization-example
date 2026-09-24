import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiLogOut, FiShield, FiUser } from "react-icons/fi";
import axios from "axios";
import AppShell from "../layout/AppShell";
import { API_BASE_URL } from "../../constants";
import styles from "./auth.module.scss";

const PrivatePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        const fetchPrivateData = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/private`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
                setPrivateData(data.data);
            } catch (requestError) {
                localStorage.removeItem("authToken");
                setError(requestError.response?.data?.error || "You are not authorized to access this page. Please login.");
            }
        };
        fetchPrivateData();
    }, [navigate]);

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.privateCard}>
                    <div className={styles.privateHeader}><div><span className={styles.eyebrow}><FiShield /> Protected area</span><h1 className={styles.title}>Your profile workspace</h1></div><FiUser size={30} color="#67c7ff" /></div>
                    {error ? <div className={`${styles.status} ${styles.error}`} role="alert">{error} <NavLink to="/login">Login</NavLink></div> : <><div className={styles.privateData}><FiCheckCircle color="#71dfae" /> {privateData || "Loading protected data..."}</div><button className={styles.button} type="button" onClick={logoutHandler}><FiLogOut /> Log out</button></>}
                </div>
            </section>
        </AppShell>
    );
};

export default PrivatePage;