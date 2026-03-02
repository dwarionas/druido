"use client";

import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const { t } = useI18n();
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.push("/app");
		}
	}, [user, loading, router]);

	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 bg-background selection:bg-primary selection:text-primary-foreground">
			<div className="w-full max-w-sm space-y-8 bg-card border rounded-2xl p-6 md:p-8 shadow-sm animate-in zoom-in-95 fade-in duration-500">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm transition-transform group-hover:scale-105">D</div>
						<span className="text-xl font-bold tracking-tight text-foreground">Druido</span>
					</Link>
					<LanguageSwitcher />
				</div>

				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">{t("login.title")}</h1>
					<p className="text-sm font-medium text-muted-foreground">{t("login.subtitle")}</p>
				</div>

				<LoginForm />

				<p className="text-xs font-medium text-muted-foreground text-center text-balance leading-relaxed">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</div>
	);
}
