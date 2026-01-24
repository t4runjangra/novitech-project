import { createContext, useState, useEffect } from "react";
import { useToast } from "./toastContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { showSuccess, showError } = useToast();

    useEffect(() => {

        const savedUser = localStorage.getItem('user')
        if (savedUser) setUser(JSON.parse(savedUser));

    }, []);

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        showError("Logout Successfull!")
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};