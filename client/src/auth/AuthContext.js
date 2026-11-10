import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;
        api.get("/api/private")
            .then(({ data }) => {
                if (!active) return;
                setUser(data.user);
                setStatus("authenticated");
            })
            .catch(() => {
                if (!active) return;
                setUser(null);
                setStatus("anonymous");
            });
        return () => { active = false; };
    }, []);

    const login = (userData) => {
        setUser(userData);
        setStatus("authenticated");
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
        } finally {
            setUser(null);
            setStatus("anonymous");
        }
    };

    return <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
