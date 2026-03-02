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
		<div className="space-y-8 animate-pop-in">
			<section>
				<h1 className="text-4xl font-black text-neo-black mb-2">{t("app.search.title")}</h1>
			</section>

			<form onSubmit={handleSubmit} className="flex gap-4">
				<input
					className="flex-1 border-2 border-neo-black bg-white rounded-xl px-4 py-3 text-lg font-bold shadow-[2px_2px_0px_#2a2520] focus:ring-4 focus:ring-neo-orange focus:outline-none transition-all"
					placeholder={t("app.search.placeholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button className="brutal-btn bg-neo-black text-white px-6 py-3 text-lg rounded-xl h-[60px]" type="submit">
					Шукати
				</button>
			</form>

			{loading && <p className="text-neo-black font-bold text-lg animate-pulse">Шукаю...</p>}

			{!loading && decks.length === 0 && cards.length === 0 && initialQ && (
				<div className="bg-white border-2 border-neo-black rounded-2xl shadow-[2px_2px_0px_#2a2520] p-4 sm:p-4 sm:p-5 md:p-6 md:p-8 text-center mt-8">
					<p className="text-neo-black font-black text-xl">{t("app.search.empty")} «{initialQ}».</p>
				</div>
			)}

			{!loading && decks.length > 0 && (
				<section className="space-y-4 pt-4">
					<h2 className="text-2xl font-black text-neo-black">{t("app.search.decks")}</h2>
					<div className="grid gap-4 sm:p-5 md:p-6 md:grid-cols-2">
						{decks.map((deck) => (
							<UICard key={deck.id} className="bg-neo-yellow/20 border-2 border-neo-black rounded-2xl shadow-[2px_2px_0px_#2a2520] transition-transform hover:-translate-y-1 hover:shadow-[2px_2px_0px_#2a2520] p-4">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-start justify-between gap-2">
										<span className="text-xl font-black text-neo-black line-clamp-1">{deck.name}</span>
										<span className="text-sm font-bold text-neo-black/60 shrink-0">{deck.totalCards} {t("app.deck.total")}</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{deck.description && <p className="text-sm font-bold text-neo-black/70 mb-4 line-clamp-2">{deck.description}</p>}
									<Link href={`/app/decks/${deck.id}`} className="inline-block bg-neo-black text-white font-bold text-sm px-4 py-2 rounded-xl border-2 border-neo-black shadow-[2px_2px_0px_#2a2520] hover:bg-neo-black/90 active:translate-y-1 active:shadow-none transition-all">
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
					<h2 className="text-2xl font-black text-neo-black">{t("app.search.cards")}</h2>
					<div className="grid gap-4 sm:p-5 md:p-6 md:grid-cols-2">
						{cards.map((card) => (
							<UICard key={card.id} className="bg-white border-2 border-neo-black rounded-2xl shadow-[2px_2px_0px_#2a2520] p-4">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg font-black text-neo-black leading-tight">{card.question}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm font-bold text-neo-black/70">{card.answer}</p>
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
				<div className="space-y-8 animate-pop-in">
					<section>
						<h1 className="text-4xl font-black text-neo-black mb-2">Пошук</h1>
						<p className="text-sm font-bold text-neo-black/70">Шукай серед усіх карток та колод.</p>
					</section>
					<p className="text-neo-black font-bold text-lg animate-pulse">Завантаження...</p>
				</div>
			}
		>
			<SearchContent />
		</Suspense>
	);
}
