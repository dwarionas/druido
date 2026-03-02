"use client";

import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { CallToActionButton } from "@/components/CallToActionButton";
import { Brain, Upload, BarChart3, Globe, ChevronDown } from "lucide-react";
import React from "react";

export default function Home() {
	const { t } = useI18n();
	const [openFaq, setOpenFaq] = React.useState<number | null>(null);

	const features = [
		{ icon: Brain, titleKey: "landing.features.grid.1.title", descKey: "landing.features.grid.1.desc", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
		{ icon: Upload, titleKey: "landing.features.grid.2.title", descKey: "landing.features.grid.2.desc", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
		{ icon: BarChart3, titleKey: "landing.features.grid.3.title", descKey: "landing.features.grid.3.desc", color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
		{ icon: Globe, titleKey: "landing.features.grid.4.title", descKey: "landing.features.grid.4.desc", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
	];

	const faqs = [
		{ q: "landing.faq.q1", a: "landing.faq.a1" },
		{ q: "landing.faq.q2", a: "landing.faq.a2" },
		{ q: "landing.faq.q3", a: "landing.faq.a3" },
	];

	return (
		<div className="flex flex-col min-h-dvh bg-background">
			{/* Section 1: Hero */}
			<section className="min-h-dvh w-full flex flex-col pt-4 relative">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Header />
				</div>
				<div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 pt-10 pb-20 z-10">
					<LandingHero />
				</div>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
			</section>

			{/* Section 2: Features Grid */}
			<section className="py-24 px-6 bg-muted/30">
				<div className="max-w-6xl mx-auto flex flex-col items-center">
					<h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-3xl mb-16 text-center animate-in slide-in-from-bottom-4 duration-700">
						{t("landing.features.grid.title")}
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
						{features.map(({ icon: Icon, titleKey, descKey, color }, i) => (
							<div
								key={i}
								className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
								style={{ animationDelay: `${i * 100}ms` }}
							>
								<div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
									<Icon className="h-6 w-6 relative z-10" />
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">{t(titleKey)}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
							</div>
						))}
					</div>

					<div className="w-full max-w-sm mx-auto mt-4">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Section 3: Value Proposition */}
			<section className="py-32 px-6 flex flex-col items-center justify-center text-center">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-4xl md:text-6xl lg:text-7xl tracking-tighter font-bold text-foreground mb-8 animate-in slide-in-from-bottom-4" dangerouslySetInnerHTML={{ __html: t("landing.feature2.title") }}>
					</h2>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16 animate-in slide-in-from-bottom-5">
						{t("landing.feature2.desc")}
					</p>

					<div className="w-full max-w-sm mx-auto mb-12 animate-in slide-in-from-bottom-6">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Section 4: FAQ */}
			<section className="py-24 px-6 bg-muted/30 flex flex-col items-center justify-center">
				<div className="max-w-3xl w-full">
					<h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-16 text-center">
						{t("landing.faq.title")}
					</h2>

					<div className="space-y-4 mb-20 relative z-20">
						{faqs.map((faq, i) => (
							<div
								key={i}
								className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
								onClick={() => setOpenFaq(openFaq === i ? null : i)}
							>
								<div className="w-full text-left px-6 py-5 font-semibold text-foreground flex items-center justify-between outline-none">
									{t(faq.q)}
									<ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
								</div>
								<div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
									<p className="px-6 text-sm text-muted-foreground leading-relaxed">{t(faq.a)}</p>
								</div>
							</div>
						))}
					</div>

					<div className="w-full max-w-sm mx-auto mb-16 relative z-10">
						<CallToActionButton />
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="w-full border-t bg-background mt-auto py-8">
				<div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-muted-foreground">
					<span>{t("landing.footer")}</span>
					<div className="flex flex-col sm:flex-row items-center gap-6">
						<span>FSRS-based spaced repetition</span>
						<LanguageSwitcher />
					</div>
				</div>
			</footer>
		</div>
	);
}
