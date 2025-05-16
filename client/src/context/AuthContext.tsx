import * as React from "react";

export interface AuthContext {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const KEY = "myapp.auth.token";

function getStorageToken() {
    return localStorage.getItem(KEY);
}

function setStorageToken(token: string | null) {
    if (token) {
        localStorage.setItem(KEY, token);
    } else {
        localStorage.removeItem(KEY);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = React.useState<string | null>(getStorageToken());
    const isAuthenticated = !!token;

    const logout = React.useCallback(() => {
        setStorageToken(null);
        setToken(null);
    }, []);

    const login = React.useCallback((token: string) => {
        setStorageToken(token);
        setToken(token);
    }, []);

    React.useEffect(() => {
        setToken(getStorageToken());
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) throw new Error("useAuth must be within an AuthProvider");
    return context;
}
