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
	2: "border-amber-300/70 bg-amber-50 text-amber-900 hover:bg-amber-100",
	3: "border-emerald-300/70 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
	4: "border-sky-300/70 bg-sky-50 text-sky-900 hover:bg-sky-100",
};

const baseButtonClasses =
	"flex flex-col items-center justify-center gap-1 py-2 text-xs border transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

export default function Lernground({ deckId }: Props) {
	const [revealed, setRevealed] = React.useState(false);
	const { currentCard, rateCard, schedule, loading, finished, totalCards, currentIndex } = useFSRS(deckId);

	if (loading) {
		return <p className="text-muted-foreground">Loading...</p>;
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

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
					Карта {currentNumber} з {totalCards}
				</span>
				<span className="hidden sm:inline">Flip card, then rate difficulty.</span>
			</div>

			<div className="space-y-2 rounded-md border bg-muted/40 p-4">
				<div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Питання</div>
				<div className="rounded-sm bg-background/80 px-3 py-2 text-sm leading-relaxed md:text-base">{currentCard.question}</div>
			</div>

			<div
				className={cn("space-y-3 rounded-md border bg-muted/40 p-4", !revealed && "cursor-pointer hover:bg-muted/60")}
				onClick={() => {
					if (!revealed) setRevealed(true);
				}}
			>
				<div className="flex items-center justify-between gap-2">
					<span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Відповідь</span>
				</div>
				{revealed ? (
					<div className="rounded-sm bg-background/80 px-3 py-2 text-sm leading-relaxed md:text-base">{currentCard.answer}</div>
				) : (
					<p className="text-xs text-muted-foreground">Натисни, щоб побачити відповідь, потім обери складність.</p>
				)}
			</div>

			<div className="grid gap-2 md:grid-cols-4">
				{RATING_BUTTONS.map(({ label, rating }) => (
					<Button
						key={rating}
						type="button"
						variant="outline"
						size="sm"
						className={cn(baseButtonClasses, ratingStyles[rating])}
						disabled={!revealed}
						onClick={() => {
							void rateCard(rating);
							setRevealed(false);
						}}
					>
						<span className="font-medium">{label}</span>
						{schedule && schedule[rating] && <span className="text-[10px] text-muted-foreground">через {schedule[rating]}</span>}
					</Button>
				))}
			</div>
		</div>
	);
}
