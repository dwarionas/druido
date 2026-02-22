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
		<div className={cn("space-y-6", className)} {...props}>
			<form onSubmit={handleSubmit} className="space-y-5">
				{mode === "register" && (
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-bold text-neo-black">Ім'я</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" className="h-12 text-base font-bold text-neo-black border-2 border-neo-black rounded-xl shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange focus-visible:ring-offset-2" />
					</div>
				)}
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-bold text-neo-black">Email</Label>
					<Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base font-bold text-neo-black border-2 border-neo-black rounded-xl shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange focus-visible:ring-offset-2" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password" className="text-sm font-bold text-neo-black">Пароль</Label>
					<Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 text-base font-bold text-neo-black border-2 border-neo-black rounded-xl shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange focus-visible:ring-offset-2" />
				</div>

				{(formError || error) && <p className="text-red-500 font-bold text-sm bg-red-100 border-2 border-red-500 rounded-xl p-2">{formError || error}</p>}

				<Button type="submit" className="w-full h-12 text-lg rounded-xl brutal-btn bg-neo-black text-white hover:bg-neo-black/90 mt-2" disabled={submitting}>
					{submitting
						? (mode === "login" ? "Вхід..." : "Реєстрація...")
						: (mode === "login" ? "Увійти" : "Зареєструватися")}
				</Button>
			</form>

			<div className="text-center font-bold text-sm text-neo-black/70 mt-4">
				{mode === "login" ? "Немає акаунту? " : "Вже є акаунт? "}
				<button
					type="button"
					className="underline underline-offset-4 text-neo-black hover:text-neo-orange transition-colors"
					onClick={() => setMode(mode === "login" ? "register" : "login")}
				>
					{mode === "login" ? "Створити" : "Увійти"}
				</button>
			</div>
		</div>
	);
}
