"use client";

import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

export function LandingHero() {
	const { t } = useI18n();
	const { user, loading } = useAuth();

	return (
		<section className="flex flex-col items-center justify-center text-center space-y-12 animate-slide-up-fade-delay-1 py-16">
			<div className="space-y-6 flex flex-col items-center">
				<h1
					className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl text-foreground max-w-4xl leading-[1.1]"
					dangerouslySetInnerHTML={{ __html: t("landing.hero").replace("FSRS-", "FSRS-<br />") }}
				/>
				<div className="flex items-center gap-3 bg-background border rounded-full px-5 py-2.5 shadow-sm mt-2">
					<span className="font-semibold text-sm text-foreground tracking-wide">ON</span>
					<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
						<div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
					</div>
				</div>
			</div>

			{/* Soft Premium Illustration */}
			<div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-gradient-to-tr from-accent/50 to-background rounded-3xl border shadow-sm flex flex-col justify-end items-center overflow-hidden my-8">
				{/* Abstract shapes representing learning flow */}
				<div className="absolute inset-0 flex items-center justify-center opacity-30">
					<div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl absolute top-0 -left-10"></div>
					<div className="w-48 h-48 bg-primary/10 rounded-full blur-2xl absolute bottom-10 right-0"></div>
				</div>
				{/* Abstract deck interface */}
				<div className="w-[85%] h-3/4 bg-card rounded-t-2xl border border-b-0 shadow-md flex flex-col gap-4 p-6 justify-start items-center z-10 mx-auto mt-auto translate-y-4 hover:translate-y-0 transition-transform duration-700 ease-out cursor-default">
					<div className="w-3/4 h-4 rounded-full bg-muted mt-4"></div>
					<div className="w-full h-4 rounded-full bg-muted"></div>
					<div className="w-5/6 h-4 rounded-full bg-muted"></div>
					<div className="mt-8 flex gap-3 w-full">
						<div className="h-10 flex-1 bg-destructive/10 rounded-lg"></div>
						<div className="h-10 flex-1 bg-primary/10 rounded-lg"></div>
					</div>
				</div>
			</div>

			<div className="w-full max-w-sm mx-auto pt-4">
				<Link
					href={!loading && user ? "/app" : "/login"}
					className="w-full h-14 bg-primary text-primary-foreground font-medium text-xl rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/90 transition-all"
				>
					{!loading && user ? t("header.app") : t("landing.cta")}
				</Link>
			</div>
		</section>
	);
}
