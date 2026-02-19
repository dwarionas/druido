"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listCards, createCard, updateCard, deleteCard, bulkDeleteCards, getDeck, type Card, type Deck } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import Lernground from "@/components/app/Lernground";

export default function DeckDetailPage() {
	const params = useParams<{ deckId: string }>();
	const deckId = params.deckId;
	const [deck, setDeck] = React.useState<Deck | null>(null);
	const [cards, setCards] = React.useState<Card[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [question, setQuestion] = React.useState("");
	const [answer, setAnswer] = React.useState("");
	const [editingCard, setEditingCard] = React.useState<Card | null>(null);
	const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [reviewVersion, setReviewVersion] = React.useState(0);

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
		let cancelled = false;

		async function init() {
			try {
				const [deckData, cardsData] = await Promise.all([
					getDeck(deckId as string),
					listCards(deckId as string),
				]);
				if (!cancelled) {
					setDeck(deckData);
					setCards(cardsData);
				}
			} catch {
				// handled
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		init();
		return () => { cancelled = true; };
	}, [deckId]);

	async function handleSaveCard(e: React.FormEvent) {
		e.preventDefault();
		if (!question.trim() || !answer.trim()) return;
		setSaving(true);

		try {
			if (editingCard) {
				await updateCard(editingCard.id, { question, answer });
				toast.success("Картку оновлено");
			} else {
				await createCard({ deckId: deckId as string, question, answer });
				toast.success("Картку додано");
			}

			setQuestion("");
			setAnswer("");
			setEditingCard(null);
			setIsEditSheetOpen(false);
			await loadCards();
		} catch {
			toast.error("Не вдалося зберегти картку");
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteCard(cardId: string) {
		if (!window.confirm("Видалити цю картку?")) return;
		try {
			await deleteCard(cardId);
			toast.success("Картку видалено");
			await loadCards();
		} catch {
			toast.error("Не вдалося видалити");
		}
	}

	async function handleDeleteAllCards() {
		if (!cards.length) return;
		if (!window.confirm("Видалити всі картки цієї колоди?")) return;
		try {
			await bulkDeleteCards(deckId as string);
			toast.success("Усі картки видалено");
			await loadCards();
			setReviewVersion((v) => v + 1);
		} catch {
			toast.error("Помилка видалення");
		}
	}

	const totalCards = cards.length;
	const deckName = deck?.name || "Колода";

	return (
		<div className="space-y-6">
			<section className="flex items-center justify-between gap-2">
				<div className="space-y-1">
					<h1 className="text-xl font-semibold">{deckName}</h1>
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
							if (!open) {
								setEditingCard(null);
								setQuestion("");
								setAnswer("");
							}
						}}
					>
						<SheetTrigger asChild>
							<Button variant="default" size="sm">
								Додати картку
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
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setEditingCard(null);
											setQuestion("");
											setAnswer("");
											setIsEditSheetOpen(false);
										}}
									>
										Скасувати
									</Button>
									<Button type="submit" size="sm" disabled={!question.trim() || !answer.trim() || saving}>
										{saving ? "Зберігаю..." : editingCard ? "Зберегти зміни" : "Зберегти картку"}
									</Button>
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
				<Lernground deckId={deckId as string} version={reviewVersion} />
			</section>
		</div>
	);
}
