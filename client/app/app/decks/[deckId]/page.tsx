"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listCards, createCard, updateCard, deleteCard, bulkDeleteCards, getDeck, bulkCreateCards, type Card, type Deck } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Download, Upload, FileArchive, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import Lernground from "@/components/app/Lernground";
import { useI18n } from "@/lib/i18n";
import { parseApkg } from "@/lib/apkg-parser";

type Tab = "study" | "cards" | "stats";

function chunkArray<T>(arr: T[], size: number): T[][] {
	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}

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
	const [activeTab, setActiveTab] = React.useState<Tab>("study");
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const apkgInputRef = React.useRef<HTMLInputElement>(null);
	const { t } = useI18n();

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
			} catch { }
			finally { if (!cancelled) setLoading(false); }
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
			setQuestion(""); setAnswer(""); setTags(""); setEditingCard(null); setIsEditSheetOpen(false);
			await loadCards();
		} catch { toast.error("Не вдалося зберегти картку"); }
		finally { setSaving(false); }
	}

	async function handleDeleteCard(cardId: string) {
		try { await deleteCard(cardId); toast.success("Картку видалено"); await loadCards(); }
		catch { toast.error("Не вдалося видалити"); }
	}

	async function handleDeleteAllCards() {
		try { await bulkDeleteCards(deckId as string); toast.success("Усі картки видалено"); await loadCards(); setReviewVersion((v) => v + 1); }
		catch { toast.error("Помилка видалення"); }
	}

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
		link.href = url; link.download = `${deck?.name || "cards"}.csv`; link.click();
		URL.revokeObjectURL(url);
		toast.success(`Експортовано ${cards.length} карток`);
	}

	async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const text = await file.text();
		const lines = text.split("\n").filter((l) => l.trim());
		const start = lines[0]?.toLowerCase().includes("question") ? 1 : 0;
		const cardsToCreate = [];
		for (let i = start; i < lines.length; i++) {
			const match = lines[i].match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g);
			if (!match || match.length < 2) continue;
			const clean = (s: string) => s.replace(/^"|"$/g, "").replace(/""/g, '"').trim();
			const q = clean(match[0]); const a = clean(match[1]);
			const t = match[2] ? clean(match[2]).split(",").map((s) => s.trim()).filter(Boolean) : [];
			if (q && a) cardsToCreate.push({ deckId: deckId as string, question: q, answer: a, tags: t });
		}
		if (cardsToCreate.length > 0) {
			try {
				const chunks = chunkArray(cardsToCreate, 500);
				let totalCount = 0;
				for (const chunk of chunks) {
					const res = await bulkCreateCards(chunk);
					totalCount += res.count;
				}
				toast.success(`Імпортовано ${totalCount} карток`);
			} catch { toast.error("Помилка під час імпорту карток"); }
		} else { toast.info("Не знайдено карток для імпорту"); }
		await loadCards();
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	async function handleApkgImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const parsed = await parseApkg(file);
			if (parsed.length === 0) { toast.info("Не знайдено карток у .apkg файлі"); return; }
			const cardsToCreate = parsed.map((c) => ({ deckId: deckId as string, question: c.question, answer: c.answer, tags: [] }));
			const chunks = chunkArray(cardsToCreate, 500);
			let totalCount = 0;
			for (const chunk of chunks) {
				const res = await bulkCreateCards(chunk);
				totalCount += res.count;
			}

			toast.success(`Імпортовано ${totalCount} карток з Anki`);
			await loadCards();
		} catch (err) { console.error(err); toast.error("Помилка при імпорті .apkg файлу"); }
		finally { if (apkgInputRef.current) apkgInputRef.current.value = ""; }
	}

	const allTags = React.useMemo(() => {
		const set = new Set<string>();
		cards.forEach((c) => c.tags.forEach((t) => set.add(t)));
		return Array.from(set).sort();
	}, [cards]);

	const filteredCards = tagFilter ? cards.filter((c) => c.tags.includes(tagFilter)) : cards;
	const totalCards = cards.length;
	const deckName = deck?.name || "Колода";

	// Deck-level stats
	const matureCards = cards.filter(c => c.state === 2).length;
	const learningCards = cards.filter(c => c.state === 1).length;
	const newCards = cards.filter(c => c.state === 0).length;
	const masteryPercent = totalCards > 0 ? Math.round((matureCards / totalCards) * 100) : 0;

	const TABS: { key: Tab; labelKey: string }[] = [
		{ key: "study", labelKey: "deck.tab.study" },
		{ key: "cards", labelKey: "deck.tab.cards" },
		{ key: "stats", labelKey: "deck.tab.stats" },
	];

	return (
		<div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
			{/* Header */}
			<section className="bg-card border rounded-2xl p-5 shadow-sm">
				<div className="flex items-center gap-4 mb-4">
					<Link href="/app" className="p-2 rounded-lg border bg-background hover:bg-muted transition-colors">
						<ArrowLeft className="h-4 w-4 text-foreground" />
					</Link>
					<div className="flex-1 min-w-0">
						<h1 className="text-2xl font-bold tracking-tight text-foreground truncate">{deckName}</h1>
						<p className="text-sm font-medium text-muted-foreground">{totalCards} {t("app.deck.total")}</p>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
					{TABS.map(({ key, labelKey }) => (
						<button
							key={key}
							onClick={() => setActiveTab(key)}
							className={`py-1.5 px-4 rounded-md text-sm font-medium transition-all ${activeTab === key
								? "bg-background shadow-sm text-foreground"
								: "text-muted-foreground hover:text-foreground"
								}`}
						>
							{t(labelKey)}
						</button>
					))}
				</div>
			</section>

			{/* Study tab */}
			{activeTab === "study" && (
				<section className="p-1">
					<Lernground deckId={deckId as string} version={reviewVersion} />
				</section>
			)}

			{/* Cards tab */}
			{activeTab === "cards" && (
				<section className="space-y-5">
					{/* Toolbar */}
					<div className="flex items-center gap-2 flex-wrap bg-card border rounded-xl p-3 shadow-sm">
						<Sheet open={isEditSheetOpen} onOpenChange={(open) => { setIsEditSheetOpen(open); if (!open) { setEditingCard(null); setQuestion(""); setAnswer(""); setTags(""); } }}>
							<SheetTrigger asChild>
								<Button size="sm">{t("deck.detail.add")}</Button>
							</SheetTrigger>
							<SheetContent side="bottom" className="flex flex-col">
								<SheetHeader>
									<SheetTitle>{editingCard ? t("deck.detail.edit") : t("deck.detail.add")}</SheetTitle>
									<SheetDescription></SheetDescription>
								</SheetHeader>
								<form onSubmit={handleSaveCard} className="flex flex-col gap-3 px-4 pb-4 pt-2">
									<Input placeholder={t("deck.detail.question")} value={question} onChange={(e) => setQuestion(e.target.value)} />
									<Textarea placeholder={t("deck.detail.answer")} value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} />
									<Input placeholder={t("deck.detail.tags")} value={tags} onChange={(e) => setTags(e.target.value)} className="text-xs" />
									<div className="flex justify-end gap-2">
										<Button type="button" variant="outline" size="sm" onClick={() => { setEditingCard(null); setQuestion(""); setAnswer(""); setTags(""); setIsEditSheetOpen(false); }}>{t("deck.detail.cancel")}</Button>
										<Button type="submit" size="sm" disabled={!question.trim() || !answer.trim() || saving}>{saving ? t("deck.detail.saving") : editingCard ? t("deck.detail.edit.save") : t("deck.detail.save")}</Button>
									</div>
								</form>
							</SheetContent>
						</Sheet>

						<Button variant="outline" size="sm" onClick={handleExport} disabled={totalCards === 0}><Download className="h-4 w-4 mr-1.5" />CSV</Button>
						<Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-1.5" />{t("deck.detail.import")}</Button>
						<input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
						<Button variant="outline" size="sm" onClick={() => apkgInputRef.current?.click()}><FileArchive className="h-4 w-4 mr-1.5" />APKG</Button>
						<input ref={apkgInputRef} type="file" accept=".apkg" className="hidden" onChange={handleApkgImport} />

						{totalCards > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto">{t("deck.detail.delete_all")}</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>{t("deck.detail.delete_all")}?</AlertDialogTitle>
										<AlertDialogDescription>{t("deck.detail.delete_all.desc")}</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>{t("deck.detail.delete_all.cancel")}</AlertDialogCancel>
										<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteAllCards}>{t("deck.detail.delete_all.confirm")}</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>

					{/* Tag filters */}
					{allTags.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							<button onClick={() => setTagFilter(null)} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${!tagFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>All</button>
							{allTags.map((tag) => (
								<button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${tagFilter === tag ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{tag}</button>
							))}
						</div>
					)}

					{/* Card list */}
					{!loading && totalCards === 0 && (
						<div className="text-center py-16 px-4 bg-card/50 border border-dashed rounded-2xl">
							<p className="text-muted-foreground text-sm">{t("deck.detail.due")}</p>
						</div>
					)}
					<div className="space-y-2">
						{filteredCards.map((card, idx) => (
							<div key={`${card.id}-${idx}`} className="bg-card border rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 group hover:shadow-md transition-all">
								<div className="min-w-0 flex-1">
									<div className="font-semibold text-sm text-foreground">{card.question}</div>
									<div className="mt-1 text-sm text-muted-foreground">{card.answer}</div>
									{card.tags.length > 0 && <div className="flex gap-1.5 mt-2">{card.tags.map((t) => <Badge key={t} variant="secondary" className="px-2 font-normal text-[10px]">{t}</Badge>)}</div>}
								</div>
								<div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
									<Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCard(card); setQuestion(card.question); setAnswer(card.answer); setTags(card.tags.join(", ")); setIsEditSheetOpen(true); }}><Pencil className="h-4 w-4" /></Button>
									<AlertDialog>
										<AlertDialogTrigger asChild><Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
										<AlertDialogContent><AlertDialogHeader><AlertDialogTitle>?</AlertDialogTitle><AlertDialogDescription></AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t("deck.detail.cancel")}</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteCard(card.id)}>Видалити</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Stats tab */}
			{activeTab === "stats" && (
				<section className="space-y-4">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
							<div className="text-3xl font-bold tracking-tight text-foreground">{totalCards}</div>
							<div className="text-sm font-medium text-muted-foreground">{t("stats.total_cards")}</div>
						</div>
						<div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden">
							<div className="text-3xl font-bold tracking-tight text-emerald-500">{matureCards}</div>
							<div className="text-sm font-medium text-muted-foreground">{t("deck.stats.mature")}</div>
						</div>
						<div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
							<div className="text-3xl font-bold tracking-tight text-orange-500">{learningCards}</div>
							<div className="text-sm font-medium text-muted-foreground">{t("deck.stats.learning")}</div>
						</div>
						<div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
							<div className="text-3xl font-bold tracking-tight text-yellow-500">{newCards}</div>
							<div className="text-sm font-medium text-muted-foreground">{t("deck.stats.new")}</div>
						</div>
					</div>

					{/* Mastery bar */}
					<div className="bg-card border rounded-2xl p-6 shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold tracking-tight text-foreground">{t("deck.stats.mastery")}</h3>
							<span className="text-xl font-bold text-foreground">{masteryPercent}%</span>
						</div>
						<div className="h-3 w-full bg-secondary rounded-full overflow-hidden flex">
							{matureCards > 0 && <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${(matureCards / Math.max(totalCards, 1)) * 100}%` }} />}
							{learningCards > 0 && <div className="bg-orange-500 h-full transition-all duration-700" style={{ width: `${(learningCards / Math.max(totalCards, 1)) * 100}%` }} />}
							{newCards > 0 && <div className="bg-yellow-500 h-full transition-all duration-700" style={{ width: `${(newCards / Math.max(totalCards, 1)) * 100}%` }} />}
						</div>
						<div className="flex gap-4 mt-4 text-xs font-medium text-muted-foreground">
							<span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {matureCards} {t("deck.stats.mature")}</span>
							<span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> {learningCards} {t("deck.stats.learning")}</span>
							<span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /> {newCards} {t("deck.stats.new")}</span>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
