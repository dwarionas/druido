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
		<div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 bg-background relative">
			{/* Subtle glow */}
			<div className="absolute inset-0 glow-teal-center pointer-events-none opacity-50" aria-hidden="true" />

			<div className="relative w-full max-w-sm space-y-8 glass-strong p-6 sm:p-8 rounded-2xl animate-fade-in-up">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold transition-all group-hover:shadow-[0_0_15px_rgba(30,193,167,0.4)]">D</div>
						<span className="text-xl font-bold tracking-tight text-foreground">Druido</span>
					</Link>
					<LanguageSwitcher />
				</div>

				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold text-foreground">{t("login.title")}</h1>
					<p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
				</div>

				<LoginForm />

				<p className="text-xs text-muted-foreground text-center text-balance">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</div>
	);
}
