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
	1: "border-2 border-neo-black bg-[#ff6b6b] text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-[#ff5252] hover:-translate-y-1 hover:shadow-[2px_4px_0px_#1a1510]",
	2: "border-2 border-neo-black bg-neo-orange text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-[#ff6a1a] hover:-translate-y-1 hover:shadow-[2px_4px_0px_#1a1510]",
	3: "border-2 border-neo-black bg-neo-yellow text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-[#fbd825] hover:-translate-y-1 hover:shadow-[2px_4px_0px_#1a1510]",
	4: "border-2 border-neo-black bg-[#4ade80] text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-[#34d399] hover:-translate-y-1 hover:shadow-[2px_4px_0px_#1a1510]",
};

const baseButtonClasses =
	"flex flex-col items-center justify-center gap-1 py-4 h-auto text-sm font-black rounded-xl transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed";

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
			<div className="text-center space-y-4 py-12 bg-white border-2 border-neo-black rounded-3xl shadow-[2px_2px_0px_#1a1510]">
				<p className="text-3xl font-black text-neo-black">🎉 Чудова робота!</p>
				<p className="text-lg font-bold text-neo-black/70 px-4">{t("deck.review.empty")}</p>
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
				<div className="flex items-center justify-between text-sm font-bold text-neo-black">
					<span className="inline-flex items-center gap-2 bg-white border-2 border-neo-black rounded-xl px-3 py-1 shadow-[2px_2px_0px_#1a1510]">
						{currentNumber} / {totalCards}
					</span>
					<span className="hidden sm:inline">Flip card, then rate difficulty.</span>
				</div>
				<div className="h-4 w-full bg-white border-2 border-neo-black rounded-full overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
					<div
						className="h-full bg-neo-orange transition-all duration-500 border-r-2 border-line-black"
						style={{ width: `${progress}%`, borderRightColor: progress > 0 ? 'black' : 'transparent', borderRightWidth: progress > 0 ? '2px' : '0px' }}
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
						className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 bg-white border-2 border-neo-black rounded-3xl p-6 md:p-10"
						style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: '8px 8px 0px #1a1510' }}
					>
						<div className="absolute top-6 left-8 text-sm font-black uppercase tracking-widest text-neo-black/40">{t("deck.detail.question")}</div>
						<div className="text-2xl md:text-4xl font-black text-neo-black leading-tight max-w-2xl">{currentCard.question}</div>
						<p className="absolute bottom-6 text-sm font-bold text-neo-black/40">{t("deck.review.flip")}</p>
					</div>

					{/* back */}
					<div
						className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-6 bg-neo-yellow border-2 border-neo-black rounded-3xl p-6 md:p-10"
						style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: '-8px 8px 0px #1a1510' }}
					>
						<div className="absolute top-6 left-8 text-sm font-black uppercase tracking-widest text-neo-black/40">{t("deck.detail.answer")}</div>
						<div className="text-2xl font-bold text-neo-black leading-relaxed max-w-2xl">{currentCard.answer}</div>
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
