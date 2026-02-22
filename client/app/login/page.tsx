"use client";

import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

export default function LoginPage() {
	const { t } = useI18n();

	return (
		<div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
			<div className="w-full max-w-xs space-y-8">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center border bg-foreground text-background text-[10px] font-bold">D</div>
						<span className="text-sm font-semibold tracking-tight">Druido</span>
					</Link>
					<LanguageSwitcher />
				</div>

				<div className="space-y-1">
					<h1 className="text-lg font-semibold">{t("login.title")}</h1>
					<p className="text-xs text-muted-foreground">{t("login.subtitle")}</p>
				</div>

				<LoginForm />

				<p className="text-[11px] text-muted-foreground text-center text-balance">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</div>
	);
}
