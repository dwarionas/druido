"use client";

import { useState, useCallback, useEffect } from "react";
import { getDueCards, reviewCard, getSchedulePreview, type Card } from "@/lib/decks-api";

export function useFSRS(deckId: string) {
	const [cards, setCards] = useState<Card[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [schedule, setSchedule] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);
	const [finished, setFinished] = useState(false);

	useEffect(() => {
		// cleanup fn to avoid setting state after unmount (React docs)
		let cancelled = false;

		async function load() {
			setLoading(true);
			try {
				const dueCards = await getDueCards(deckId);
				if (!cancelled) {
					setCards(dueCards);
					setCurrentIndex(0);
					setShowAnswer(false);
					setFinished(dueCards.length === 0);
					setLoading(false);

					if (dueCards.length > 0) {
						const preview = await getSchedulePreview(dueCards[0].id);
						if (!cancelled) setSchedule(preview);
					}
				}
			} catch {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => { cancelled = true; };
	}, [deckId]);

	const currentCard = cards[currentIndex] ?? null;

	const flipCard = useCallback(() => {
		setShowAnswer((prev) => !prev);
	}, []);

	const rateCard = useCallback(async (rating: number) => {
		if (!currentCard) return;

		try {
			await reviewCard(currentCard.id, rating);

			const nextIndex = currentIndex + 1;
			if (nextIndex >= cards.length) {
				setFinished(true);
				setShowAnswer(false);
				return;
			}

			setCurrentIndex(nextIndex);
			setShowAnswer(false);

			const preview = await getSchedulePreview(cards[nextIndex].id);
			setSchedule(preview);
		} catch (err) {
			console.error("Failed to review card:", err);
		}
	}, [currentCard, currentIndex, cards]);

	// keyboard shortcuts: space to flip, 1-4 to rate
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			// don't trigger if user is typing in an input
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (finished || loading || !currentCard) return;

			if (e.code === "Space") {
				e.preventDefault();
				flipCard();
			}

			if (showAnswer && ["1", "2", "3", "4"].includes(e.key)) {
				e.preventDefault();
				rateCard(parseInt(e.key));
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [flipCard, rateCard, showAnswer, finished, loading, currentCard]);

	return {
		cards,
		currentCard,
		currentIndex,
		totalCards: cards.length,
		showAnswer,
		schedule,
		loading,
		finished,
		flipCard,
		rateCard,
	};
}
