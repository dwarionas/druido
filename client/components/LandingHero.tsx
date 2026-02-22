"use client";

import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

export function LandingHero() {
	const { t } = useI18n();

	return (
		<section className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-3xl font-semibold tracking-tight leading-tight md:text-4xl">
					{t("landing.hero")}
				</h1>
				<p className="text-[15px] leading-relaxed text-muted-foreground max-w-md">
					An advanced scheduling algorithm, clean interface, and fast deck management — for language learning and beyond.
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<Link
					href="/login"
					className="border bg-foreground text-background px-4 py-2 text-xs font-medium hover:opacity-90 transition-opacity"
				>
					{t("landing.cta")}
				</Link>
				<Link
					href="#features"
					className="border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
				>
					Learn more
				</Link>
				<div className="ml-auto">
					<LanguageSwitcher />
				</div>
			</div>
		</section>
	);
}
