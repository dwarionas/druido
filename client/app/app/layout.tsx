"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import ModeToggle from "@/components/ModeToggle";

function SearchFormInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = React.useState(searchParams.get("q") || "");

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;
		router.push(`/app/search?q=${encodeURIComponent(query)}`);
	};

	return (
		<form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
			<Input
				type="search"
				placeholder="Пошук..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="h-10 border-2 border-neo-black rounded-xl font-bold bg-white text-sm shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange"
			/>
		</form>
	);
}

function SearchForm() {
	return (
		<Suspense fallback={<div className="flex-1" />}>
			<SearchFormInner />
		</Suspense>
	);
}

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [loading, user, router]);

	if (loading || !user) {
		return (
			<div className="flex min-h-dvh items-center justify-center">
				<p className="text-sm font-bold text-neo-black animate-pulse">Завантаження...</p>
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-neo-yellow">
			<header className="border-b-4 border-neo-black bg-neo-peach px-6 py-4">
				<div className="mx-auto flex max-w-4xl items-center gap-4">
					<Link href="/app" className="flex items-center gap-2 shrink-0 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neo-black bg-neo-yellow text-sm font-black shadow-[2px_2px_0px_#1a1510] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[2px_4px_0px_#1a1510]">D</div>
						<span className="text-lg font-extrabold tracking-tight hidden sm:inline text-neo-black">Druido</span>
					</Link>

					<div className="flex-1 max-w-xs mx-auto">
						<SearchForm />
					</div>

					<div className="flex items-center gap-4 shrink-0">
						<span className="text-sm font-bold text-neo-black hidden md:inline">
							{user.name || user.email}
						</span>
						<button
							onClick={() => logout().then(() => router.push("/login"))}
							className="rounded-xl border-2 border-neo-black bg-white px-3 py-1.5 text-xs font-bold text-neo-black shadow-[2px_2px_0px_#1a1510] transition-transform hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_#1a1510]"
						>
							Вихід
						</button>
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
		</div>
	);
}
