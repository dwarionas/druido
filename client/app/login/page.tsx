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
		<div className="flex min-h-svh flex-col items-center justify-center px-6 py-12 bg-neo-peach selection:bg-black selection:text-white">
			<div className="w-full max-w-sm space-y-8 bg-white border-4 border-neo-black p-8 rounded-3xl shadow-[8px_8px_0px_#1a1510] animate-pop-in">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neo-black bg-neo-yellow text-sm font-black shadow-[2px_2px_0px_#1a1510] transition-transform hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_#1a1510]">D</div>
						<span className="text-xl font-extrabold tracking-tight text-neo-black">Druido</span>
					</Link>
					<LanguageSwitcher />
				</div>

				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-black text-neo-black">{t("login.title")}</h1>
					<p className="text-sm font-bold text-neo-black/70">{t("login.subtitle")}</p>
				</div>

				<LoginForm />

				<p className="text-xs font-bold text-neo-black/60 text-center text-balance">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</div>
	);
}
