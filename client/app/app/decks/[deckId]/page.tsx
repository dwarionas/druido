"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listCards, createCard, updateCard, deleteCard, bulkDeleteCards, getDeck, type Card, type Deck } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
	const [tags, setTags] = React.useState("");
	const [editingCard, setEditingCard] = React.useState<Card | null>(null);
	const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [reviewVersion, setReviewVersion] = React.useState(0);
	const [tagFilter, setTagFilter] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

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
				// ok
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

		const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

		try {
			if (editingCard) {
				await updateCard(editingCard.id, { question, answer, tags: parsedTags });
				toast.success("Картку оновлено");
			} else {
				await createCard({ deckId: deckId as string, question, answer, tags: parsedTags });
				toast.success("Картку додано");
			}

			setQuestion("");
			setAnswer("");
			setTags("");
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
		try {
			await deleteCard(cardId);
			toast.success("Картку видалено");
			await loadCards();
		} catch {
			toast.error("Не вдалося видалити");
		}
	}

	async function handleDeleteAllCards() {
		try {
			await bulkDeleteCards(deckId as string);
			toast.success("Усі картки видалено");
			await loadCards();
			setReviewVersion((v) => v + 1);
		} catch {
			toast.error("Помилка видалення");
		}
	}

	// CSV export
	function handleExport() {
		if (cards.length === 0) return;
		const header = "question,answer,tags";
		const rows = cards.map((c) => {
			const q = `"${c.question.replace(/"/g, '""')}"`;
			const a = `"${c.answer.replace(/"/g, '""')}"`;
			const t = `"${c.tags.join(", ")}"`;
			return `${q},${a},${t}`;
		});
		const csv = [header, ...rows].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${deck?.name || "cards"}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Експортовано ${cards.length} карток`);
	}

	// CSV import
	async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const text = await file.text();
		const lines = text.split("\n").filter((l) => l.trim());
		// skip header if it looks like one
		const start = lines[0]?.toLowerCase().includes("question") ? 1 : 0;

		let imported = 0;
		for (let i = start; i < lines.length; i++) {
			// simple CSV parse (handles quoted fields)
			const match = lines[i].match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g);
			if (!match || match.length < 2) continue;

			const clean = (s: string) => s.replace(/^"|"$/g, "").replace(/""/g, '"').trim();
			const q = clean(match[0]);
			const a = clean(match[1]);
			const t = match[2] ? clean(match[2]).split(",").map((s) => s.trim()).filter(Boolean) : [];

			if (q && a) {
				try {
					await createCard({ deckId: deckId as string, question: q, answer: a, tags: t });
					imported++;
				} catch {
					// skip bad rows
				}
			}
		}

		toast.success(`Імпортовано ${imported} карток`);
		await loadCards();
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	// collect all unique tags
	const allTags = React.useMemo(() => {
		const set = new Set<string>();
		cards.forEach((c) => c.tags.forEach((t) => set.add(t)));
		return Array.from(set).sort();
	}, [cards]);

	const filteredCards = tagFilter
		? cards.filter((c) => c.tags.includes(tagFilter))
		: cards;

	const totalCards = cards.length;
	const deckName = deck?.name || "Колода";

	return (
		<div className="space-y-8 animate-pop-in">
			<section className="flex items-center justify-between gap-4 flex-wrap bg-white border-4 border-neo-black rounded-2xl p-6 shadow-[8px_8px_0px_#1a1510]">
				<div className="space-y-2">
					<h1 className="text-3xl font-black text-neo-black">{deckName}</h1>
					<p className="text-sm font-bold text-neo-black/70">
						{totalCards > 0 ? `${totalCards} карток · ` : null}
						Додавай та повторюй картки.
					</p>
				</div>
				<div className="flex items-center gap-3 flex-wrap">
					{/* cards sheet */}
					<Sheet>
						<SheetTrigger asChild>
							<Button className="brutal-btn bg-white text-neo-black rounded-xl border-2 hover:bg-neo-yellow/30" size="sm" disabled={loading || totalCards === 0}>
								{loading ? "Завантаження..." : `Картки (${totalCards})`}
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="flex flex-col">
							<SheetHeader>
								<SheetTitle>Картки колоди</SheetTitle>
								<SheetDescription>Швидкий перегляд усіх карток.</SheetDescription>
								{totalCards > 0 && (
									<div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
										<span>{filteredCards.length} карток{tagFilter ? ` (фільтр: ${tagFilter})` : ""}</span>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:underline">
													Видалити всі
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Видалити всі картки?</AlertDialogTitle>
													<AlertDialogDescription>Це видалить усі {totalCards} карток у колоді. Цю дію не можна скасувати.</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Скасувати</AlertDialogCancel>
													<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteAllCards}>
														Видалити
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								)}
								{/* tag filters */}
								{allTags.length > 0 && (
									<div className="flex flex-wrap gap-1 mt-1">
										<button
											onClick={() => setTagFilter(null)}
											className={`text-[10px] px-2 py-0.5 border transition-colors ${!tagFilter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
										>
											Усі
										</button>
										{allTags.map((tag) => (
											<button
												key={tag}
												onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
												className={`text-[10px] px-2 py-0.5 border transition-colors ${tagFilter === tag ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
											>
												{tag}
											</button>
										))}
									</div>
								)}
							</SheetHeader>
							<div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-2">
								{!loading && totalCards === 0 && (
									<p className="text-sm text-muted-foreground">Карток ще немає. Натисни «Додати картку».</p>
								)}
								{filteredCards.map((card, index) => (
									<div key={`${card.id}-${index}`} className="border border-border/50 bg-card/50 px-3 py-2 text-sm glass">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0 flex-1">
												<div className="truncate font-medium leading-snug">{card.question}</div>
												<div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{card.answer}</div>
												{card.tags.length > 0 && (
													<div className="flex gap-1 mt-1">
														{card.tags.map((t) => (
															<Badge key={t} variant="secondary" className="text-[9px] px-1 py-0">{t}</Badge>
														))}
													</div>
												)}
											</div>
											<div className="flex shrink-0 gap-1">
												<Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
													setEditingCard(card);
													setQuestion(card.question);
													setAnswer(card.answer);
													setTags(card.tags.join(", "));
													setIsEditSheetOpen(true);
												}}>
													<Pencil className="h-3 w-3" />
												</Button>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
															<Trash2 className="h-3 w-3" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Видалити картку?</AlertDialogTitle>
															<AlertDialogDescription>Цю дію не можна скасувати.</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Скасувати</AlertDialogCancel>
															<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteCard(card.id)}>
																Видалити
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</div>
									</div>
								))}
							</div>
						</SheetContent>
					</Sheet>

					{/* add/edit card sheet */}
					<Sheet
						open={isEditSheetOpen}
						onOpenChange={(open) => {
							setIsEditSheetOpen(open);
							if (!open) {
								setEditingCard(null);
								setQuestion("");
								setAnswer("");
								setTags("");
							}
						}}
					>
						<SheetTrigger asChild>
							<Button className="brutal-btn bg-neo-black text-white rounded-xl h-[44px]" size="sm">Додати картку</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="flex flex-col">
							<SheetHeader>
								<SheetTitle>{editingCard ? "Редагувати картку" : "Додати нову картку"}</SheetTitle>
								<SheetDescription>Введи питання та відповідь.</SheetDescription>
							</SheetHeader>
							<form onSubmit={handleSaveCard} className="flex flex-col gap-3 px-4 pb-4 pt-2">
								<Input placeholder="Питання" value={question} onChange={(e) => setQuestion(e.target.value)} />
								<Textarea placeholder="Відповідь" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} />
								<Input placeholder="Теги (через кому)" value={tags} onChange={(e) => setTags(e.target.value)} className="text-xs" />
								<div className="flex justify-end gap-2">
									<Button type="button" variant="outline-glow" size="sm" onClick={() => {
										setEditingCard(null);
										setQuestion("");
										setAnswer("");
										setTags("");
										setIsEditSheetOpen(false);
									}}>
										Скасувати
									</Button>
									<Button type="submit" variant="gradient" size="sm" disabled={!question.trim() || !answer.trim() || saving}>
										{saving ? "Зберігаю..." : editingCard ? "Зберегти зміни" : "Зберегти картку"}
									</Button>
								</div>
							</form>
						</SheetContent>
					</Sheet>

					{/* import/export */}
					<Button className="brutal-btn bg-white text-neo-black border-2 rounded-xl" size="sm" onClick={handleExport} disabled={totalCards === 0} title="Експорт CSV">
						<Download className="h-4 w-4 mr-2" />
						CSV
					</Button>
					<Button className="brutal-btn bg-white text-neo-black border-2 rounded-xl" size="sm" onClick={() => fileInputRef.current?.click()} title="Імпорт CSV">
						<Upload className="h-4 w-4 mr-2" />
						Імпорт
					</Button>
					<input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />

					<Button className="brutal-btn bg-white text-neo-black border-2 rounded-xl" size="sm" asChild>
						<Link href="/app">Назад</Link>
					</Button>
				</div>
			</section>

			<section className="bg-neo-peach border-4 border-neo-black rounded-2xl p-6 shadow-[8px_8px_0px_#1a1510]">
				<h2 className="mb-6 text-2xl font-black text-neo-black">Повторення</h2>
				<Lernground deckId={deckId as string} version={reviewVersion} />
			</section>
		</div>
	);
}
