"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, BarChart3, User, Search, Menu, X } from "lucide-react";

function SearchFormInner() {
	const { t } = useI18n();
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
			<div className="relative w-full">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder={t("app.search.placeholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-9 h-9"
				/>
			</div>
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

const NAV_ITEMS = [
	{ href: "/app", icon: LayoutDashboard, labelKey: "nav.dashboard" },
	{ href: "/app/stats", icon: BarChart3, labelKey: "nav.stats" },
	{ href: "/app/profile", icon: User, labelKey: "nav.profile" },
] as const;

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const { user, loading, logout } = useAuth();
	const { t } = useI18n();
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	React.useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [loading, user, router]);

	React.useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	if (loading || !user) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-background">
				<p className="text-sm text-muted-foreground animate-pulse">{t("app.decks.loading")}</p>
			</div>
		);
	}

	const isActive = (href: string) => {
		if (href === "/app") return pathname === "/app";
		return pathname.startsWith(href);
	};

	return (
		<div className="min-h-dvh bg-background flex">
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex flex-col w-64 border-r border-border bg-[#0f0f0f] shrink-0 sticky top-0 h-dvh">
				<div className="flex h-14 items-center border-b border-border px-4 py-2">
					<Link href="/app" className="flex items-center gap-2 group font-semibold">
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold transition-all group-hover:shadow-[0_0_15px_rgba(30,193,167,0.3)]">D</div>
						<span className="text-lg tracking-tight text-foreground">Druido</span>
					</Link>
				</div>

				<nav className="flex-1 p-3 space-y-1">
					{NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => (
						<Link
							key={href}
							href={href}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive(href)
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-white/5 hover:text-foreground"
								}`}
						>
							<Icon className="h-4 w-4" />
							{t(labelKey)}
						</Link>
					))}
				</nav>

				{/* Sidebar footer: XP + Streak */}
				<div className="p-4 border-t border-border space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm font-medium text-foreground">
							<span className="text-muted-foreground">🔥</span>
							<span>{user.streak} {t("stats.streak")}</span>
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-foreground">
							<span className="text-muted-foreground">⭐</span>
							<span>{user.xp} XP</span>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-xs font-medium text-muted-foreground truncate">{user.name || user.email}</span>
						<button
							onClick={() => logout().then(() => router.push("/login"))}
							className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							{t("profile.logout")}
						</button>
					</div>
				</div>
			</aside>

			{/* Main content area */}
			<div className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
				{/* Mobile header */}
				<header className="md:hidden border-b border-border bg-[#0f0f0f] px-4 py-3 sticky top-0 z-30">
					<div className="flex items-center gap-3">
						<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-foreground">
							{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
						<Link href="/app" className="flex items-center gap-2 font-semibold">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">D</div>
							<span className="text-lg tracking-tight text-foreground">Druido</span>
						</Link>
						<div className="flex-1 max-w-xs ml-auto">
							<SearchForm />
						</div>
					</div>

					{/* Mobile dropdown nav */}
					{mobileMenuOpen && (
						<nav className="mt-3 pb-1 space-y-1 animate-in slide-in-from-top-2">
							{NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => (
								<Link
									key={href}
									href={href}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive(href)
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-white/5"
										}`}
								>
									<Icon className="h-4 w-4" />
									{t(labelKey)}
								</Link>
							))}
							<div className="flex items-center justify-between px-3 pt-2">
								<span className="text-sm font-medium text-foreground">🔥 {user.streak} · ⭐ {user.xp} XP</span>
								<button onClick={() => logout().then(() => router.push("/login"))} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("profile.logout")}</button>
							</div>
						</nav>
					)}
				</header>

				{/* Desktop top bar with search */}
				<header className="hidden md:flex h-14 items-center gap-4 border-b border-border bg-background px-6 sticky top-0 z-30">
					<div className="flex-1 max-w-sm">
						<SearchForm />
					</div>
					<span className="text-sm font-medium text-muted-foreground hidden lg:inline">{user.name || user.email}</span>
				</header>

				<main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
			</div>
		</div>
	);
}
