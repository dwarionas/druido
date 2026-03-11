"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const { login, register, error } = useAuth();
	const { t } = useI18n();
	const router = useRouter();
	const [mode, setMode] = React.useState<"login" | "register">("login");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [name, setName] = React.useState("");
	const [submitting, setSubmitting] = React.useState(false);
	const [formError, setFormError] = React.useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setFormError(null);
		try {
			if (mode === "login") {
				await login(email, password);
			} else {
				await register(email, password, name || undefined);
			}
			router.push("/app");
		} catch {
			setFormError(t("login.error"));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className={cn("space-y-6", className)} {...props}>
			<form onSubmit={handleSubmit} className="space-y-5">
				{mode === "register" && (
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium text-foreground">{t("login.name")}</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("login.name")} />
					</div>
				)}
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium text-foreground">{t("login.email")}</Label>
					<Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password" className="text-sm font-medium text-foreground">{t("login.password")}</Label>
					<Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>

				{(formError || error) && (
					<p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 font-medium">{formError || error}</p>
				)}

				<Button type="submit" className="w-full h-11 text-base mt-4" disabled={submitting}>
					{submitting
						? "..."
						: (mode === "login" ? t("login.action.login") : t("login.action.register"))}
				</Button>
			</form>

			<div className="text-center text-sm text-muted-foreground mt-4">
				<button
					type="button"
					className="underline underline-offset-4 text-foreground hover:text-primary transition-colors font-medium"
					onClick={() => setMode(mode === "login" ? "register" : "login")}
				>
					{mode === "login" ? t("login.switch.register") : t("login.switch.login")}
				</button>
			</div>
		</div>
	);
}
