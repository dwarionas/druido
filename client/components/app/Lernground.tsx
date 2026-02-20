"use client";

import React from "react";
import { useFSRS } from "@/hooks/useFSRS";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
	deckId: string;
	version?: number;
}

const RATING_BUTTONS = [
	{ label: "Знову", rating: 1 },
	{ label: "Тяжко", rating: 2 },
	{ label: "Добре", rating: 3 },
	{ label: "Легко", rating: 4 },
] as const;

const ratingStyles: Record<number, string> = {
	1: "border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10",
	2: "border-amber-300/70 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/50",
	3: "border-emerald-300/70 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50",
	4: "border-sky-300/70 bg-sky-50 text-sky-900 hover:bg-sky-100 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/50",
};

const baseButtonClasses =
	"flex flex-col items-center justify-center gap-1 py-2 text-xs border transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export default function Lernground({ deckId, version }: Props) {
	const [flipped, setFlipped] = React.useState(false);
	const [rating, setRating] = React.useState(false);
	const { currentCard, rateCard, schedule, loading, finished, totalCards, currentIndex } = useFSRS(deckId);

	// reset flip when card changes
	React.useEffect(() => {
		setFlipped(false);
	}, [currentCard?.id]);

	if (loading) {
		return (
			<div className="space-y-3 animate-pulse">
				<div className="h-4 w-32 rounded bg-muted" />
				<div className="h-24 rounded-md bg-muted" />
				<div className="h-20 rounded-md bg-muted" />
			</div>
		);
	}

	if (finished || !currentCard) {
		return (
			<div className="text-center space-y-2 py-8">
				<p className="text-lg font-medium text-emerald-600">🎉 Чудова робота!</p>
				<p className="text-sm text-muted-foreground">Немає більше карток для повторення зараз. Повертайся пізніше!</p>
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
		<div className="space-y-4">
			{/* progress */}
			<div className="space-y-1">
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
						Карта {currentNumber} з {totalCards}
					</span>
					<span className="hidden sm:inline">Flip card, then rate difficulty.</span>
				</div>
				<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
					<div
						className="h-full rounded-full bg-primary transition-all duration-500"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* card with flip */}
			<div
				className="relative cursor-pointer perspective-1000"
				style={{ minHeight: 160 }}
				onClick={() => setFlipped(!flipped)}
			>
				<div className={cn(
					"w-full transition-transform duration-500 transform-style-3d",
					flipped && "rotate-y-180"
				)}>
					{/* front */}
					<div className={cn(
						"space-y-2 rounded-md border bg-muted/40 p-4 backface-hidden",
						flipped && "hidden"
					)}>
						<div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Питання</div>
						<div className="rounded-sm bg-background/80 px-3 py-2 text-sm leading-relaxed md:text-base">{currentCard.question}</div>
						<p className="text-xs text-muted-foreground text-center pt-2">Натисни, щоб побачити відповідь</p>
					</div>

					{/* back */}
					{flipped && (
						<div className="space-y-2 rounded-md border bg-muted/40 p-4">
							<div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Відповідь</div>
							<div className="rounded-sm bg-background/80 px-3 py-2 text-sm leading-relaxed md:text-base">{currentCard.answer}</div>
						</div>
					)}
				</div>
			</div>

			{/* rating buttons */}
			<div className="grid gap-2 md:grid-cols-4">
				{RATING_BUTTONS.map(({ label, rating: r }) => (
					<Button
						key={r}
						type="button"
						variant="outline"
						size="sm"
						className={cn(baseButtonClasses, ratingStyles[r])}
						disabled={!flipped || rating}
						onClick={() => handleRate(r)}
					>
						<span className="font-medium">{label}</span>
						{schedule && schedule[r] && <span className="text-[10px] text-muted-foreground">через {schedule[r]}</span>}
					</Button>
				))}
			</div>
		</div>
	);
}
