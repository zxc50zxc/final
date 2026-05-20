import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, login as apiLogin, register as apiRegister } from "../api/client";

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("nabd_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("nabd_user");
    if (u && token) setUser(JSON.parse(u));
    setLoading(false);
  }, [token]);

  const persist = (access_token: string, u: User) => {
    localStorage.setItem("nabd_token", access_token);
    localStorage.setItem("nabd_user", JSON.stringify(u));
    setToken(access_token);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    persist(data.access_token, data.user);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const data = await apiRegister({ email, password, full_name: fullName });
    persist(data.access_token, data.user);
  };

  const logout = () => {
    localStorage.removeItem("nabd_token");
    localStorage.removeItem("nabd_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
