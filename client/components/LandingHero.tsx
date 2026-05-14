"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api-client";
import Link from "next/link";
import React from "react";

export function LandingHero() {
	const { t } = useI18n();
	const { user, loading, refreshUser } = useAuth();
	const router = useRouter();
	const [starting, setStarting] = React.useState(false);

	async function handleTryDemo() {
		setStarting(true);
		try {
			await api.post("/auth/demo");
			await refreshUser();
			router.push("/app");
		} catch {
			setStarting(false);
		}
	}

	return (
		<section className="relative flex flex-col items-center justify-center text-center space-y-8 py-32 sm:py-40 px-6">
			<div className="absolute inset-0 glow-teal pointer-events-none" aria-hidden="true" />

			<div className="relative space-y-6 flex flex-col items-center animate-fade-in-up">
				<span className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-primary">
					Spaced Repetition
				</span>

				<h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.05]">
					{t("landing.hero").split("FSRS-").map((part, i) =>
						i === 0 ? (
							<span key={i}>{part}<span className="relative inline-block">FSRS
								<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2 8C40 2 120 2 198 8" stroke="#1ec1a7" strokeWidth="3" strokeLinecap="round" />
								</svg>
							</span>-</span>
						) : <span key={i}>{part}</span>
					)}
				</h1>

				<p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up-delay-1">
					Smart scheduling, powerful deck management, and multi-language support.
				</p>
			</div>

			<div className="relative w-full max-w-xs mx-auto animate-fade-in-up-delay-2">
				{!loading && user ? (
					<Link
						href="/app"
						className="w-full h-14 bg-primary text-primary-foreground hover:bg-teal-hover text-lg font-medium rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(30,193,167,0.4)]"
					>
						{t("header.app")}
					</Link>
				) : (
					<button
						onClick={handleTryDemo}
						disabled={starting || loading}
						className="w-full h-14 bg-primary text-primary-foreground hover:bg-teal-hover text-lg font-medium rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(30,193,167,0.4)] disabled:opacity-60"
					>
						{starting ? t("demo.loading") : t("landing.cta")}
					</button>
				)}
			</div>
		</section>
	);
}
