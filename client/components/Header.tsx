"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export function Header() {
	const { user, loading } = useAuth();
	const { t } = useI18n();

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

				<Link
					href={!loading && user ? "/app" : "/login"}
					className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium transition-all hover:bg-teal-hover hover:shadow-[0_0_20px_rgba(30,193,167,0.3)]"
				>
					{!loading && user ? t("header.app") : t("header.login")}
				</Link>
			</nav>
		</header>
	);
}
