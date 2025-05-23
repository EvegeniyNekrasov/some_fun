import * as React from "react";

export interface AuthContext {
    isAuthenticated: boolean;
    login: (token: string, userId: number) => void;
    logout: () => void;
    userId: number | null;
    token: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const TOKEN_KEY = "myapp.auth.token";
const ID_KEY = "myapp.auth.userId";

const getStorageUserId = () => {
    const raw = localStorage.getItem(ID_KEY);
    return raw ? Number(raw) : null;
};
const getStorageToken = () => localStorage.getItem(TOKEN_KEY);

function setStorage(token: string | null, userId: number | null) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ID_KEY, String(userId ?? ""));
    } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ID_KEY);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = React.useState<string | null>(getStorageToken());
    const [userId, setUserId] = React.useState<number | null>(
        getStorageUserId()
    );

    const isAuthenticated = !!token;

    const logout = React.useCallback(() => {
        setStorage(null, null);
        setToken(null);
        setUserId(null);
    }, []);

    const login = React.useCallback((token: string, userId: number) => {
        setStorage(token, userId);
        setToken(token);
        setUserId(userId);
    }, []);

    React.useEffect(() => {
        const handler = () => {
            setToken(getStorageToken());
            setUserId(getStorageUserId());
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) throw new Error("useAuth must be within an AuthProvider");
    return context;
}
