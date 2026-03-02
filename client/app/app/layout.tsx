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
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
				<Input
					type="search"
					placeholder={t("app.search.placeholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-9 h-10 w-full bg-muted/30 hover:bg-muted/60 border-transparent focus-visible:bg-background transition-all rounded-lg"
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
				<p className="text-sm font-medium text-muted-foreground animate-pulse">{t("app.decks.loading")}</p>
			</div>
		);
	}

	const isActive = (href: string) => {
		if (href === "/app") return pathname === "/app";
		return pathname.startsWith(href);
	};

	return (
		<div className="min-h-dvh bg-muted/20 flex tracking-tight">
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex flex-col w-64 border-r bg-card/60 backdrop-blur-xl shrink-0 sticky top-0 h-dvh z-40">
				<div className="p-5 border-b border-border/50">
					<Link href="/app" className="flex items-center gap-3 px-1 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm transition-transform group-hover:scale-105">D</div>
						<span className="text-xl font-bold text-foreground">Druido</span>
					</Link>
				</div>

				<nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
					{NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => (
						<Link
							key={href}
							href={href}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive(href)
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
						>
							<Icon className="h-4 w-4" />
							{t(labelKey)}
						</Link>
					))}
				</nav>

				{/* Sidebar footer: XP + Streak */}
				<div className="p-4 border-t border-border/50 space-y-4">
					<div className="flex items-center justify-between px-2">
						<div className="flex items-center gap-2 text-sm font-medium text-foreground">
							<span className="text-orange-500">🔥</span>
							<span>{user.streak} {t("stats.streak")}</span>
						</div>
						<div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
							<span className="text-yellow-500">⭐</span>
							<span>{user.xp} XP</span>
						</div>
					</div>
					<div className="flex items-center justify-between px-2">
						<span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">{user.name || user.email}</span>
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
			<div className="flex-1 flex flex-col min-w-0">
				{/* Mobile header */}
				<header className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 sticky top-0 z-50">
					<div className="flex items-center gap-3">
						<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
							{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
						<Link href="/app" className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold shadow-sm">D</div>
							<span className="text-lg font-bold tracking-tight text-foreground">Druido</span>
						</Link>
						<div className="flex-1 max-w-xs ml-auto">
							<SearchForm />
						</div>
					</div>

					{/* Mobile dropdown nav */}
					{mobileMenuOpen && (
						<nav className="mt-4 pb-2 space-y-1 animate-in slide-in-from-top-4 duration-200">
							{NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => (
								<Link
									key={href}
									href={href}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive(href)
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:bg-muted"
										}`}
								>
									<Icon className="h-5 w-5" />
									{t(labelKey)}
								</Link>
							))}
							<div className="flex items-center justify-between px-4 pt-4 mt-4 border-t">
								<span className="text-sm font-medium text-foreground">🔥 {user.streak} · ⭐ {user.xp} XP</span>
								<button onClick={() => logout().then(() => router.push("/login"))} className="text-xs font-medium text-muted-foreground transition-colors">{t("profile.logout")}</button>
							</div>
						</nav>
					)}
				</header>

				{/* Desktop top bar with search */}
				<header className="hidden md:flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-8 py-4 sticky top-0 z-30">
					<div className="w-full max-w-md">
						<SearchForm />
					</div>
				</header>

				<main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">{children}</main>
			</div>
		</div>
	);
}
