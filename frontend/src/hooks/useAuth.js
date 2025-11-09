// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { saveAuth as saveAuthStorage, getAuth, clearAuth } from "../auth";

export function useAuth() {
  const [auth, setAuth] = useState(() => getAuth());

  const refresh = useCallback(() => {
    setAuth(getAuth());
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
    window.location.href = "/";
  }, []);

  const saveAuth = useCallback(
    (data) => {
      saveAuthStorage(data);
      setAuth(getAuth());
    },
    [setAuth]
  );

  const isLoggedIn = !!auth && !!auth.token;
  const isCustomer = isLoggedIn && auth.type === "CUSTOMER";
  const isMerchant = isLoggedIn && auth.type === "MERCHANT";

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === "auth") setAuth(getAuth());
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    auth,
    isLoggedIn,
    isCustomer,
    isMerchant,
    refresh,
    saveAuth,
    logout,
  };
}