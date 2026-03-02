"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listCards, getDecksSummary, type Card, type DeckSummary } from "@/lib/decks-api";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

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
		<div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
			<section>
				<h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{t("app.search.title")}</h1>
			</section>

			<form onSubmit={handleSubmit} className="flex gap-4">
				<input
					className="flex-1 bg-background border rounded-lg px-4 text-base shadow-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
					placeholder={t("app.search.placeholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded-lg h-12 shadow-sm hover:bg-primary/90 transition-colors" type="submit">
					Шукати
				</button>
			</form>

			{loading && <p className="text-muted-foreground font-medium text-sm animate-pulse">Шукаю...</p>}

			{!loading && decks.length === 0 && cards.length === 0 && initialQ && (
				<div className="bg-card border rounded-xl shadow-sm p-6 text-center mt-8">
					<p className="text-foreground font-medium text-lg">{t("app.search.empty")} «{initialQ}».</p>
				</div>
			)}

			{!loading && decks.length > 0 && (
				<section className="space-y-4 pt-4">
					<h2 className="text-xl font-bold text-foreground tracking-tight">{t("app.search.decks")}</h2>
					<div className="grid gap-4 sm:p-2 md:grid-cols-2">
						{decks.map((deck) => (
							<UICard key={deck.id} className="bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-start justify-between gap-2">
										<span className="text-lg font-semibold text-foreground line-clamp-1">{deck.name}</span>
										<span className="text-xs font-medium text-muted-foreground shrink-0">{deck.totalCards} {t("app.deck.total")}</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{deck.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{deck.description}</p>}
									<Link href={`/app/decks/${deck.id}`} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
										Відкрити
									</Link>
								</CardContent>
							</UICard>
						))}
					</div>
				</section>
			)}

			{!loading && cards.length > 0 && (
				<section className="space-y-4 pt-4">
					<h2 className="text-xl font-bold text-foreground tracking-tight">{t("app.search.cards")}</h2>
					<div className="grid gap-4 sm:p-2 md:grid-cols-2">
						{cards.map((card) => (
							<UICard key={card.id} className="bg-card border rounded-xl shadow-sm">
								<CardHeader className="pb-2">
									<CardTitle className="text-base font-semibold text-foreground leading-tight">{card.question}</CardTitle>
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
				<div className="space-y-8 animate-pulse">
					<section>
						<h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Пошук</h1>
						<p className="text-sm font-medium text-muted-foreground">Шукай серед усіх карток та колод.</p>
					</section>
					<p className="text-muted-foreground font-medium text-sm">Завантаження...</p>
				</div>
			}
		>
			<SearchContent />
		</Suspense>
	);
}
