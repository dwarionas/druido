"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listCards, createCard, updateCard, deleteCard, bulkDeleteCards, type Card } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Lernground from "@/components/app/Lernground";

export default function DeckDetailPage() {
	const params = useParams<{ deckId: string }>();
	const deckId = params.deckId;
	const [cards, setCards] = React.useState<Card[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [question, setQuestion] = React.useState("");
	const [answer, setAnswer] = React.useState("");
	const [editingCard, setEditingCard] = React.useState<Card | null>(null);
	const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);

	async function loadCards() {
		setLoading(true);
		try {
			const data = await listCards(deckId as string);
			setCards(data);
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		void loadCards();
	}, [deckId]);

	async function handleSaveCard(e: React.FormEvent) {
		e.preventDefault();
		if (!question.trim() || !answer.trim()) return;

		if (editingCard) {
			await updateCard(editingCard.id, { question, answer });
		} else {
			await createCard({ deckId: deckId as string, question, answer });
		}

		setQuestion("");
		setAnswer("");
		setEditingCard(null);
		await loadCards();
	}

	async function handleDeleteCard(cardId: string) {
		const ok = window.confirm("Видалити цю картку?");
		if (!ok) return;
		await deleteCard(cardId);
		await loadCards();
	}

	async function handleDeleteAllCards() {
		if (!cards.length) return;
		const ok = window.confirm("Видалити всі картки цієї колоди?");
		if (!ok) return;
		await bulkDeleteCards(deckId as string);
		await loadCards();
	}

	const totalCards = cards.length;

	return (
		<div className="space-y-6">
			<section className="flex items-center justify-between gap-2">
				<div className="space-y-1">
					<h1 className="text-xl font-semibold">Колода</h1>
					<p className="text-xs text-muted-foreground">
						{totalCards > 0 ? `${totalCards} карток · ` : null}
						Додавай та повторюй картки.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="sm" disabled={loading || totalCards === 0}>
								{loading ? "Завантаження..." : `Картки (${totalCards})`}
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="flex flex-col">
							<SheetHeader>
								<SheetTitle>Картки колоди</SheetTitle>
								<SheetDescription>Швидкий перегляд усіх карток.</SheetDescription>
								{totalCards > 0 && (
									<div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
										<span>{totalCards} карток у колоді</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-destructive hover:text-destructive hover:underline"
											onClick={handleDeleteAllCards}
										>
											Видалити всі
										</Button>
									</div>
								)}
							</SheetHeader>
							<div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-2">
								{!loading && totalCards === 0 && (
									<p className="text-sm text-muted-foreground">Карток ще немає. Натисни «Додати картку».</p>
								)}
								{cards.map((card, index) => (
									<div key={`${card.id}-${card.updatedAt}-${index}`} className="rounded-md border bg-card px-3 py-2 text-sm">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0 flex-1">
												<div className="truncate font-medium leading-snug">{card.question}</div>
												<div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{card.answer}</div>
											</div>
											<div className="flex shrink-0 gap-1">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-7 w-7"
													onClick={() => {
														setEditingCard(card);
														setQuestion(card.question);
														setAnswer(card.answer);
														setIsEditSheetOpen(true);
													}}
												>
													<Pencil className="h-3 w-3" />
													<span className="sr-only">Редагувати</span>
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-7 w-7 text-destructive hover:text-destructive"
													onClick={() => handleDeleteCard(card.id)}
												>
													<Trash2 className="h-3 w-3" />
													<span className="sr-only">Видалити</span>
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</SheetContent>
					</Sheet>

					<Sheet
						open={isEditSheetOpen}
						onOpenChange={(open) => {
							setIsEditSheetOpen(open);
						}}
					>
						<SheetTrigger asChild>
							<Button variant="default" size="sm">
								{editingCard ? "Редагувати" : "Додати картку"}
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="flex flex-col">
							<SheetHeader>
								<SheetTitle>{editingCard ? "Редагувати картку" : "Додати нову картку"}</SheetTitle>
								<SheetDescription>
									Введи питання та відповідь, щоб {editingCard ? "оновити" : "додати"} картку.
								</SheetDescription>
							</SheetHeader>
							<form onSubmit={handleSaveCard} className="flex flex-col gap-3 px-4 pb-4 pt-2">
								<Input placeholder="Питання" value={question} onChange={(e) => setQuestion(e.target.value)} />
								<Input placeholder="Відповідь" value={answer} onChange={(e) => setAnswer(e.target.value)} />
								<div className="flex justify-end gap-2">
									<SheetClose asChild>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												setEditingCard(null);
												setQuestion("");
												setAnswer("");
											}}
										>
											Скасувати
										</Button>
									</SheetClose>
									<SheetClose asChild>
										<Button type="submit" size="sm" disabled={!question.trim() || !answer.trim()}>
											{editingCard ? "Зберегти зміни" : "Зберегти картку"}
										</Button>
									</SheetClose>
								</div>
							</form>
						</SheetContent>
					</Sheet>

					<Button variant="outline" size="sm" asChild>
						<Link href="/app">Назад</Link>
					</Button>
				</div>
			</section>

			<section className="rounded-md border bg-card p-4">
				<h2 className="mb-3 text-sm font-medium">Повторення</h2>
				<Lernground deckId={deckId as string} />
			</section>
		</div>
	);
}
