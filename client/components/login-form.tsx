"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const { login, register, error } = useAuth();
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
			setFormError(mode === "login" ? "Невірний email або пароль" : "Не вдалося створити акаунт");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className={cn("space-y-4", className)} {...props}>
			<form onSubmit={handleSubmit} className="space-y-4">
				{mode === "register" && (
					<div className="space-y-1.5">
						<Label htmlFor="name" className="text-xs">Ім'я</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" className="h-9 text-sm" />
					</div>
				)}
				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-xs">Email</Label>
					<Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-sm" />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="password" className="text-xs">Пароль</Label>
					<Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 text-sm" />
				</div>

				{(formError || error) && <p className="text-destructive text-xs">{formError || error}</p>}

				<Button type="submit" className="w-full h-9 text-xs" disabled={submitting}>
					{submitting
						? (mode === "login" ? "Вхід..." : "Реєстрація...")
						: (mode === "login" ? "Увійти" : "Зареєструватися")}
				</Button>
			</form>

			<div className="text-center text-xs text-muted-foreground">
				{mode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
				<button
					type="button"
					className="underline underline-offset-4 hover:text-foreground transition-colors"
					onClick={() => setMode(mode === "login" ? "register" : "login")}
				>
					{mode === "login" ? "Створити" : "Увійти"}
				</button>
			</div>
		</div>
	);
}
