"use client";

import React from "react";
import { useFSRS } from "@/hooks/useFSRS";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Props {
	deckId: string;
	version?: number;
}

const RATING_BUTTONS = [
	{ labelKey: "deck.review.again", rating: 1 },
	{ labelKey: "deck.review.hard", rating: 2 },
	{ labelKey: "deck.review.good", rating: 3 },
	{ labelKey: "deck.review.easy", rating: 4 },
] as const;

const ratingStyles: Record<number, string> = {
	1: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow",
	2: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow",
	3: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow",
	4: "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow",
};

const baseButtonClasses =
	"flex flex-col items-center justify-center gap-1 py-4 h-auto text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed";

export default function Lernground({ deckId, version }: Props) {
	const [flipped, setFlipped] = React.useState(false);
	const [rating, setRating] = React.useState(false);
	const { currentCard, rateCard, schedule, loading, finished, totalCards, currentIndex } = useFSRS(deckId, version);
	const { t } = useI18n();

	// reset flip when card changes
	React.useEffect(() => {
		setFlipped(false);
	}, [currentCard?.id]);

	if (loading) {
		return (
			<div className="space-y-3 animate-pulse">
				<div className="h-4 w-32 bg-muted" />
				<div className="h-24 bg-muted" />
				<div className="h-20 bg-muted" />
			</div>
		);
	}

	if (finished || !currentCard) {
		return (
			<div className="text-center space-y-4 py-16 bg-card border rounded-2xl shadow-sm">
				<p className="text-3xl font-bold tracking-tight text-foreground">🎉 Чудова робота!</p>
				<p className="text-lg font-medium text-muted-foreground px-4">{t("deck.review.empty")}</p>
			</div>
		);
	}

	const currentNumber = currentIndex + 1;
	const progress = totalCards > 0 ? (currentNumber / totalCards) * 100 : 0;

	async function handleRate(r: number) {
		setRating(true);
		try {
			await rateCard(r);
		} finally {
			setRating(false);
		}
	}

	return (
		<div className="space-y-8">
			{/* progress */}
			<div className="space-y-4">
				<div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
					<span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-4 py-1 shadow-sm">
						{currentNumber} / {totalCards}
					</span>
					<span className="hidden sm:inline">Flip card, then rate difficulty.</span>
				</div>
				<div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
					<div
						className="h-full bg-primary transition-all duration-500"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* card with flip */}
			<div
				className="w-full relative cursor-pointer perspective-1000 h-[300px] md:h-[400px]"
				onClick={() => setFlipped(!flipped)}
			>
				<div
					className={cn(
						"absolute inset-0 w-full h-full transition-transform duration-500",
						flipped ? "[transform:rotateY(180deg)]" : ""
					)}
					style={{ transformStyle: 'preserve-3d' }}
				>
					{/* front */}
					<div
						className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 bg-card border rounded-2xl p-6 md:p-10 shadow-md"
						style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
					>
						<div className="absolute top-6 left-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("deck.detail.question")}</div>
						<div className="text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-2xl">{currentCard.question}</div>
						<p className="absolute bottom-6 text-sm font-medium text-muted-foreground">{t("deck.review.flip")}</p>
					</div>

					{/* back */}
					<div
						className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-6 bg-accent border rounded-2xl p-6 md:p-10 shadow-md"
						style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
					>
						<div className="absolute top-6 left-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("deck.detail.answer")}</div>
						<div className="text-2xl md:text-4xl font-semibold text-foreground leading-relaxed max-w-2xl">{currentCard.answer}</div>
					</div>
				</div>
			</div>

			{/* rating buttons */}
			<div className="grid gap-2 md:grid-cols-4">
				{RATING_BUTTONS.map(({ labelKey, rating: r }) => (
					<Button
						key={r}
						type="button"
						className={cn(baseButtonClasses, ratingStyles[r])}
						disabled={!flipped || rating}
						onClick={() => handleRate(r)}
					>
						<span className="font-black text-lg">{t(labelKey)}</span>
						{schedule && schedule[r] && <span className="text-xs font-bold opacity-80 mt-1">{schedule[r]}</span>}
					</Button>
				))}
			</div>
		</div>
	);
}
