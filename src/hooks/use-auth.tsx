"use client";

import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { useAuthControllerLogin } from "@/api";

export interface JwtPayload {
  sub: string;
  email: string;
  phone: string;
  exp?: number;
  iat?: number;
}

export function useAuth() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate } = useAuthControllerLogin();
  const router = useRouter();

  const parseToken = (token: string): JwtPayload | null => {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (err) {
      return null;
    }
  };

  const loadUserFromToken = useCallback(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);

      return;
    }

    const decoded = parseToken(token);

    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      setUser(null);
    } else {
      setUser(decoded);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    mutate(
      { data: { identifier, password } },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);
          localStorage.setItem("accessToken", data.data.accessToken);
          loadUserFromToken();
          setUser(parseToken(data.data.accessToken));
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Login failed:", error);
          setUser(null);
        }
      }
    );
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  return {
    user,
    isLoading: isLoading && user === null,
    login,
    logout,
    refreshUser: loadUserFromToken
  };
}
