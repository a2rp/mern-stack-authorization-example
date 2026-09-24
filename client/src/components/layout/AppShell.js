import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
    FiArrowUp,
    FiCoffee,
    FiCode,
    FiFacebook,
    FiGithub,
    FiGlobe,
    FiHeart,
    FiLinkedin,
    FiLock,
    FiMail,
    FiMenu,
    FiMessageCircle,
    FiShield,
    FiX,
    FiYoutube,
} from "react-icons/fi";
import { socialLinks, supportLinks } from "../../constants";
import styles from "./styles.module.scss";

const iconMap = {
    portfolio: FiGlobe,
    github: FiGithub,
    codepen: FiCode,
    linkedin: FiLinkedin,
    facebook: FiFacebook,
    youtube: FiYoutube,
    email: FiMail,
    support: FiMessageCircle,
    coffee: FiCoffee,
    patreon: FiHeart,
};

const AppShell = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTopButton, setShowTopButton] = useState(false);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const handleScroll = () => setShowTopButton(window.scrollY > 320);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("menu-open", menuOpen);
        return () => document.body.classList.remove("menu-open");
    }, [menuOpen]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className={styles.appShell}>
            <header className={styles.header}>
                <Link className={styles.brand} to="/" onClick={closeMenu}>
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Ashish Ranjan logo" />
                    <span>
                        <strong>Auth Workspace</strong>
                        <small>Secure MERN starter</small>
                    </span>
                </Link>

                <button
                    className={styles.menuButton}
                    type="button"
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((isOpen) => !isOpen)}
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>

                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary navigation">
                    <NavLink onClick={closeMenu} to="/" end>Home</NavLink>
                    <NavLink onClick={closeMenu} to="/login">Login</NavLink>
                    <NavLink onClick={closeMenu} to="/register">Register</NavLink>
                </nav>
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div>
                        <div className={styles.footerBrand}><FiShield /> Built for clear auth flows</div>
                        <p>Authentication, protected routes and password recovery in one focused MERN example.</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <div>
                            <span className={styles.footerLabel}>Connect</span>
                            <div className={styles.iconLinks}>
                                {socialLinks.map(({ label, href, icon }) => {
                                    const Icon = iconMap[icon];
                                    return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>;
                                })}
                            </div>
                        </div>
                        <div>
                            <span className={styles.footerLabel}>Support</span>
                            <div className={styles.iconLinks}>
                                {supportLinks.map(({ label, href, icon }) => {
                                    const Icon = iconMap[icon];
                                    return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <span>Copyright Â© {currentYear} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></span>
                    <span className={styles.footerNote}><FiLock /> Local API ready</span>
                </div>
            </footer>

            {showTopButton && <button className={styles.topButton} type="button" onClick={scrollToTop} aria-label="Scroll to top" title="Scroll to top"><FiArrowUp /></button>}
        </div>
    );
};

export default AppShell;