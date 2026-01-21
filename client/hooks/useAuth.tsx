"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";

interface User {
	id: string;
	email: string;
	name: string | null;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name?: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		try {
			const data = await api.get<User | null>("/auth/me");
			setUser(data);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const login = useCallback(async (email: string, password: string) => {
		setError(null);
		try {
			const data = await api.post<User>("/auth/login", { email, password });
			setUser(data);
		} catch (err: any) {
			setError(err.message || "Login failed");
			throw err;
		}
	}, []);

	const register = useCallback(async (email: string, password: string, name?: string) => {
		setError(null);
		try {
			const data = await api.post<User>("/auth/register", { email, password, name });
			setUser(data);
		} catch (err: any) {
			setError(err.message || "Registration failed");
			throw err;
		}
	}, []);

	const logout = useCallback(async () => {
		await api.post("/auth/logout");
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
