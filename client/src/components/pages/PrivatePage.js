import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiLogOut, FiShield, FiUser } from "react-icons/fi";
import AppShell from "../layout/AppShell";
import styles from "./PrivatePage.module.scss";
import { useAuth } from "../../auth/AuthContext";

const PrivatePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const logoutHandler = async () => {
        try { await logout(); } catch (_) {}
        navigate("/login", { replace: true });
    };

    return (
        <AppShell>
            <section className={styles.page}>
                <div className={styles.privateCard}>
                    <div className={styles.privateHeader}>
                        <div><span className={styles.eyebrow}><FiShield /> Protected area</span><h1 className={styles.title}>Your profile workspace</h1></div>
                        <FiUser size={30} color="#67c7ff" />
                    </div>
                    <div className={styles.privateData}><FiCheckCircle color="#71dfae" /> Signed in as {user?.username} ({user?.email})</div>
                    <button className={styles.button} type="button" onClick={logoutHandler}><FiLogOut /> Log out</button>
                </div>
            </section>
        </AppShell>
    );
};

export default PrivatePage;
