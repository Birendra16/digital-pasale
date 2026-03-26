"use client";

import { useEffect } from "react";
import axios from "axios";

export default function AuthInitializer() {
  useEffect(() => {
    // Global axios interceptor to inject Authorization header
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.withCredentials = true; // Always send credentials
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  return null;
}
