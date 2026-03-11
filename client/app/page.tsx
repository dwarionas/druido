"use client";

import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { CallToActionButton } from "@/components/CallToActionButton";
import { Brain, Upload, BarChart3, Globe } from "lucide-react";
import React from "react";

export default function Home() {
	const { t } = useI18n();
	const [openFaq, setOpenFaq] = React.useState<number | null>(null);

	const features = [
		{ icon: Brain, titleKey: "landing.features.grid.1.title", descKey: "landing.features.grid.1.desc" },
		{ icon: Upload, titleKey: "landing.features.grid.2.title", descKey: "landing.features.grid.2.desc" },
		{ icon: BarChart3, titleKey: "landing.features.grid.3.title", descKey: "landing.features.grid.3.desc" },
		{ icon: Globe, titleKey: "landing.features.grid.4.title", descKey: "landing.features.grid.4.desc" },
	];

	const faqs = [
		{ q: "landing.faq.q1", a: "landing.faq.a1" },
		{ q: "landing.faq.q2", a: "landing.faq.a2" },
		{ q: "landing.faq.q3", a: "landing.faq.a3" },
	];

	return (
		<div className="flex flex-col min-h-dvh bg-background">
			{/* Floating nav */}
			<Header />

			{/* Section 1: Hero */}
			<section className="relative min-h-dvh w-full flex flex-col justify-center">
				<div className="max-w-5xl mx-auto w-full px-6">
					<LandingHero />
				</div>
				{/* Bottom gradient fade */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
			</section>

			{/* Section 2: Features Grid */}
			<section className="relative w-full py-32 px-6">
				<div className="absolute inset-0 glow-teal-center pointer-events-none" aria-hidden="true" />
				<div className="max-w-5xl mx-auto relative">
					<div className="text-center mb-16">
						<span className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
							Features
						</span>
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground max-w-3xl mx-auto leading-[1.1]">
							{t("landing.features.grid.title")}
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-16">
						{features.map(({ icon: Icon, titleKey, descKey }, i) => (
							<div
								key={i}
								className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(30,193,167,0.06)] group"
								style={{ animationDelay: `${i * 0.1}s` }}
							>
								<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
									<Icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">{t(titleKey)}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
							</div>
						))}
					</div>

					<div className="w-full max-w-sm mx-auto">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Section 3: Stats / Social Proof */}
			<section className="relative w-full py-32 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<h2
						className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground max-w-4xl mx-auto leading-[1.1] mb-8"
						dangerouslySetInnerHTML={{ __html: t("landing.feature2.title") }}
					/>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
						{t("landing.feature2.desc")}
					</p>

					{/* Stats row */}
					<div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-16">
						<div className="text-center">
							<div className="text-3xl sm:text-4xl font-bold text-primary">5+</div>
							<div className="text-xs sm:text-sm text-muted-foreground mt-1">Languages</div>
						</div>
						<div className="text-center">
							<div className="text-3xl sm:text-4xl font-bold text-primary">FSRS</div>
							<div className="text-xs sm:text-sm text-muted-foreground mt-1">Algorithm</div>
						</div>
						<div className="text-center">
							<div className="text-3xl sm:text-4xl font-bold text-primary">∞</div>
							<div className="text-xs sm:text-sm text-muted-foreground mt-1">Decks</div>
						</div>
					</div>

					<div className="w-full max-w-sm mx-auto">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Section 4: FAQ */}
			<section className="relative w-full py-32 px-6">
				<div className="absolute inset-0 glow-teal pointer-events-none opacity-50" aria-hidden="true" />
				<div className="max-w-2xl mx-auto relative">
					<h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground mb-16 text-center">
						{t("landing.faq.title")}
					</h2>

					<div className="space-y-3 mb-20">
						{faqs.map((faq, i) => (
							<div
								key={i}
								className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-white/15"
							>
								<button
									className="w-full text-left px-6 py-5 font-semibold text-foreground text-lg flex items-center justify-between"
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
								>
									{t(faq.q)}
									<span className={`text-xl text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
								</button>
								<div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}>
									<p className="px-6 text-sm text-muted-foreground leading-relaxed">{t(faq.a)}</p>
								</div>
							</div>
						))}
					</div>

					<div className="w-full max-w-sm mx-auto mb-12">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="w-full border-t border-border py-12 px-6">
				<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
							D
						</div>
						<span className="text-base font-semibold text-foreground tracking-tight">Druido</span>
					</div>
					<div className="flex items-center gap-6 text-sm text-muted-foreground">
						<span>FSRS-based spaced repetition</span>
						<LanguageSwitcher />
					</div>
					<span className="text-xs text-muted-foreground">{t("landing.footer")}</span>
				</div>
			</footer>
		</div>
	);
}
