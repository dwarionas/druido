"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export function Header() {
	const { user, loading } = useAuth();
	const { t } = useI18n();

	return (
		<header className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-background/95 backdrop-blur px-6 py-4 shadow-sm animate-in slide-in-from-top-4 duration-500">
			<Link href="/" className="flex items-center gap-3 group">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold tracking-tight shadow-sm transition-transform group-hover:scale-105">
					D
				</div>
				<span className="text-xl font-bold tracking-tight text-foreground">Druido</span>
			</Link>

			<div className="flex items-center gap-4">
				<Link
					href={!loading && user ? "/app" : "/login"}
					className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
				>
					{!loading && user ? t("header.app") : t("header.login")}
				</Link>
			</div>
		</header>
	);
}
