"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listCards, getDecksSummary, type Card, type DeckSummary } from "@/lib/decks-api";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

function SearchContent() {
	const searchParams = useSearchParams();
	const initialQ = searchParams.get("q") || "";
	const [query, setQuery] = React.useState(initialQ);
	const [cards, setCards] = React.useState<Card[]>([]);
	const [decks, setDecks] = React.useState<DeckSummary[]>([]);
	const [loading, setLoading] = React.useState(false);
	const { t } = useI18n();

	React.useEffect(() => {
		if (!initialQ) return;
		void runSearch(initialQ);
	}, [initialQ]);

	async function runSearch(q: string) {
		setLoading(true);
		try {
			const [deckData, cardData] = await Promise.all([getDecksSummary(q), listCards(undefined, q)]);
			setDecks(deckData);
			setCards(cardData);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!query.trim()) return;
		await runSearch(query.trim());
	}

	return (
		<div className="space-y-8 animate-fade-in-up">
			<section>
				<h1 className="text-3xl font-bold tracking-tight mb-2">{t("app.search.title")}</h1>
			</section>

			<form onSubmit={handleSubmit} className="flex gap-4">
				<input
					autoFocus
					type="text"
					className="flex-1 h-12 bg-white/5 border border-border rounded-xl px-4 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground transition-all"
					placeholder={t("app.search.placeholder")}
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
				<Button type="submit" className="h-12 px-6">
					Шукати
				</Button>
			</form>

			{loading && <p className="text-foreground font-medium text-lg animate-pulse">Шукаю...</p>}

			{!loading && decks.length === 0 && cards.length === 0 && initialQ && (
				<div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center mt-8">
					<p className="text-foreground font-semibold text-xl">{t("app.search.empty")} «{initialQ}».</p>
				</div>
			)}

			{!loading && decks.length > 0 && (
				<section className="space-y-4 pt-4">
					<h2 className="text-2xl font-bold text-foreground">{t("app.search.decks")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{decks.map((deck) => (
							<UICard key={deck.id} className="border-primary/10 hover:border-primary/25 transition-all p-4">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-start justify-between gap-2">
										<span className="text-xl font-semibold text-foreground line-clamp-1">{deck.name}</span>
										<span className="text-sm font-medium text-muted-foreground shrink-0">{deck.totalCards} {t("app.deck.total")}</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{deck.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{deck.description}</p>}
									<Link href={`/app/decks/${deck.id}`}>
										<Button size="sm">Відкрити</Button>
									</Link>
								</CardContent>
							</UICard>
						))}
					</div>
				</section>
			)}

			{!loading && cards.length > 0 && (
				<section className="space-y-4 pt-4">
					<h2 className="text-2xl font-bold text-foreground">{t("app.search.cards")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{cards.map((card) => (
							<UICard key={card.id} className="p-4">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg font-semibold text-foreground leading-tight">{card.question}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">{card.answer}</p>
								</CardContent>
							</UICard>
						))}
					</div>
				</section>
			)}
		</div>
	);
}

export default function SearchPage() {
	return (
		<Suspense
			fallback={
				<div className="space-y-8 animate-fade-in-up">
					<section>
						<h1 className="text-3xl font-bold tracking-tight mb-2">Пошук</h1>
						<p className="text-sm text-muted-foreground">Шукай серед усіх карток та колод.</p>
					</section>
					<p className="text-foreground font-medium text-lg animate-pulse">Завантаження...</p>
				</div>
			}
		>
			<SearchContent />
		</Suspense>
	);
}
