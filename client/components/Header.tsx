"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api-client";
import React from "react";

export function Header() {
	const { user, loading, refreshUser } = useAuth();
	const { t } = useI18n();
	const router = useRouter();
	const [starting, setStarting] = React.useState(false);

	async function handleTryDemo() {
		setStarting(true);
		try {
			await api.post("/auth/demo");
			await refreshUser();
			router.push("/app");
		} catch {
			setStarting(false);
		}
	}

	return (
		<header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto">
			<nav className="flex items-center gap-1 glass-strong rounded-full px-2 py-1.5 shadow-lg">
				<Link href="/" className="flex items-center gap-2 px-3 py-1.5 font-semibold text-foreground">
					<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
						D
					</div>
					<span className="text-base tracking-tight hidden sm:inline">Druido</span>
				</Link>

				<div className="w-px h-5 bg-white/10 mx-1" />

				{!loading && user ? (
					<Link
						href="/app"
						className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium transition-all hover:bg-teal-hover hover:shadow-[0_0_20px_rgba(30,193,167,0.3)]"
					>
						{t("header.app")}
					</Link>
				) : (
					<button
						onClick={handleTryDemo}
						disabled={starting || loading}
						className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium transition-all hover:bg-teal-hover hover:shadow-[0_0_20px_rgba(30,193,167,0.3)] disabled:opacity-60"
					>
						{starting ? t("demo.loading") : t("header.login")}
					</button>
				)}
			</nav>
		</header>
	);
}
