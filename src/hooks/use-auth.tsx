"use client";

import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { UseFormSetError } from "react-hook-form";

import { useAuthControllerLogin } from "@/api";
import { LocalStorageHelper } from "@/lib/local-storage/local-storage";
import { LocalStorageKeys } from "@/lib/local-storage/local-storage-key";

export interface JwtPayload {
  sub: string;
  email: string;
  phone: string;
  exp?: number;
  iat?: number;
}

export function useAuth() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // 👈 Rename để rõ nghĩa
  const { mutate, isPending } = useAuthControllerLogin();
  const router = useRouter();

  const parseToken = (token: string): JwtPayload | null => {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (err) {
      return null;
    }
  };

  const loadUserFromToken = useCallback(() => {
    const token = LocalStorageHelper.get<string>(LocalStorageKeys.ACCESS_TOKEN);

    if (!token) {
      setUser(null);
      setIsAuthLoading(false); // ✅ luôn gọi sau khi xử lý

      return;
    }

    const decoded = parseToken(token);

    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      LocalStorageHelper.remove(LocalStorageKeys.ACCESS_TOKEN);
      setUser(null);
    } else {
      setUser(decoded);
    }

    setIsAuthLoading(false); // ✅ kết thúc xử lý
  }, []);

  const login = async (
    identifier: string,
    password: string,
    setError?: UseFormSetError<{ identifier: string, password: string }>
  ) => {
    mutate(
      { data: { identifier, password } },
      {
        onSuccess: (data) => {
          LocalStorageHelper.set<string>(
            LocalStorageKeys.ACCESS_TOKEN,
            data.data.accessToken
          );
          const decoded = parseToken(data.data.accessToken);

          console.log("Login successful", decoded);

          setUser(decoded);
          router.push("/dashboard");
        },
        onError: (error) => {
          setError?.("root", {
            message: "Thông tin đăng nhập không chính xác"
          });
          setUser(null);
        }
      }
    );
  };

  const logout = () => {
    LocalStorageHelper.remove(LocalStorageKeys.ACCESS_TOKEN);
    setUser(null);
  };

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  return {
    user,
    isLoading: isAuthLoading,
    isPending, // Rename rõ nghĩa
    login,
    logout,
    refreshUser: loadUserFromToken
  };
}
