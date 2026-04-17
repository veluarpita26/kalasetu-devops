import { createContext, useContext, useState, useEffect } from "react";
import * as authAPI from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI.getProfile()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
  const res = await authAPI.login(credentials);

  console.log("LOGIN RESPONSE:", res.data);

  // ✅ HANDLE BOTH STRUCTURES
  const data = res.data.data || res.data;

  if (!data.token) {
    console.error("❌ TOKEN NOT FOUND IN RESPONSE");
    return;
  }

  // ✅ SAVE TOKEN PROPERLY
  localStorage.setItem("token", data.token);

  console.log("✅ TOKEN SAVED:", data.token);

  setUser(data.user);

  return data;
};

const register = async (formData) => {
  const res = await authAPI.register(formData);

  console.log("REGISTER RESPONSE:", res.data);

  const data = res.data.data || res.data;

  if (!data.token) {
    console.error("❌ TOKEN NOT FOUND");
    return;
  }

  localStorage.setItem("token", data.token);

  console.log("✅ TOKEN SAVED:", data.token);

  setUser(data.user);

  return data;
};
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;