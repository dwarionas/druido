"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
				className="h-8 bg-background text-xs"
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
				<p className="text-xs text-muted-foreground">Завантаження...</p>
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-background">
			<header className="border-b">
				<div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-2">
					<Link href="/app" className="flex items-center gap-2 shrink-0">
						<div className="flex h-5 w-5 items-center justify-center border bg-foreground text-background text-[8px] font-bold">D</div>
						<span className="text-xs font-semibold tracking-tight hidden sm:inline">Druido</span>
					</Link>

					<SearchForm />

					<div className="flex items-center gap-2 shrink-0">
						<span className="text-[11px] text-muted-foreground hidden md:inline">
							{user.name || user.email}
						</span>
						<ModeToggle />
						<button
							onClick={() => logout().then(() => router.push("/login"))}
							className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
						>
							Вихід
						</button>
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
		</div>
	);
}
