"use client";

import React from "react";
import Link from "next/link";
import { getDecksSummary, createDeck, type DeckSummary, deleteDeck } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2, ArrowUpDown } from "lucide-react";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/lib/i18n";
import WelcomeModal from "@/components/app/WelcomeModal";

const DECK_COLORS: Record<string, string> = {
	yellow: "bg-yellow-500",
	peach: "bg-orange-400",
	orange: "bg-orange-500",
	green: "bg-green-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500",
};

const DECK_BG_COLORS: Record<string, string> = {
	yellow: "bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/15",
	peach: "bg-orange-400/5 hover:bg-orange-400/10 border-orange-400/15",
	orange: "bg-orange-500/5 hover:bg-orange-500/10 border-orange-500/15",
	green: "bg-green-500/5 hover:bg-green-500/10 border-green-500/15",
	blue: "bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/15",
	purple: "bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/15",
};

type SortBy = "name" | "date" | "due" | "total";

export default function AppPage() {
	const [decks, setDecks] = React.useState<DeckSummary[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [selectedColor, setSelectedColor] = React.useState("yellow");
	const [creating, setCreating] = React.useState(false);
	const [sortBy, setSortBy] = React.useState<SortBy>("date");
	const [showWelcome, setShowWelcome] = React.useState(false);
	const { t } = useI18n();

	async function loadDecks() {
		setLoading(true);
		try {
			const data = await getDecksSummary();
			setDecks(data);
		} catch {
			toast.error("Не вдалося завантажити колоди");
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		let cancelled = false;
		getDecksSummary().then((data) => {
			if (!cancelled) {
				setDecks(data);
				setLoading(false);
				if (data.length === 0 && !localStorage.getItem("druido_onboarded")) {
					setShowWelcome(true);
				}
			}
		}).catch(() => {
			if (!cancelled) setLoading(false);
		});
		return () => { cancelled = true; };
	}, []);

	function handleDismissWelcome() {
		setShowWelcome(false);
		localStorage.setItem("druido_onboarded", "1");
	}

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setCreating(true);
		try {
			await createDeck({ name, description: description || undefined, color: selectedColor });
			setName("");
			setDescription("");
			setSelectedColor("yellow");
			toast.success("Колоду створено");
			await loadDecks();
		} catch {
			toast.error("Помилка при створенні колоди");
		} finally {
			setCreating(false);
		}
	}

	async function handleDeleteDeck(deckId: string) {
		try {
			await deleteDeck(deckId);
			toast.success("Колоду видалено");
			await loadDecks();
		} catch {
			toast.error("Не вдалося видалити колоду");
		}
	}

	const sortedDecks = React.useMemo(() => {
		const sorted = [...decks];
		switch (sortBy) {
			case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
			case "due": sorted.sort((a, b) => b.dueCards - a.dueCards); break;
			case "total": sorted.sort((a, b) => b.totalCards - a.totalCards); break;
			case "date":
			default: sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
		}
		return sorted;
	}, [decks, sortBy]);

	const sortOptions: { key: SortBy; label: string }[] = [
		{ key: "date", label: t("sort.date") },
		{ key: "name", label: t("sort.name") },
		{ key: "due", label: t("sort.due") },
		{ key: "total", label: t("sort.total") },
	];

	return (
		<div className="space-y-8 animate-fade-in-up">
			{showWelcome && <WelcomeModal onDismiss={handleDismissWelcome} />}

			<section>
				<h1 className="text-3xl font-bold tracking-tight mb-2">{t("app.decks.title")}</h1>
			</section>

			<section className="bg-card border border-border rounded-2xl p-5 mb-8">
				<form onSubmit={handleCreate} className="space-y-4">
					<h2 className="text-lg font-semibold">{t("app.deck.create")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Input placeholder={t("app.deck.create.name")} value={name} onChange={(e) => setName(e.target.value)} />
						<Input placeholder={t("app.deck.create.desc")} value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					{/* Color picker */}
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-muted-foreground mr-2">{t("app.deck.create.color")}</span>
						{Object.keys(DECK_COLORS).map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setSelectedColor(c)}
								className={`w-6 h-6 rounded-full transition-all ring-offset-background ${DECK_COLORS[c]} ${selectedColor === c ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"}`}
							/>
						))}
					</div>
					<Button type="submit" className="w-full md:w-auto" disabled={!name.trim() || creating}>
						{creating ? "..." : t("app.deck.create.save")}
					</Button>
				</form>
			</section>

			{/* Sort controls */}
			{decks.length > 1 && (
				<div className="flex items-center gap-2 flex-wrap">
					<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
					{sortOptions.map((opt) => (
						<button
							key={opt.key}
							onClick={() => setSortBy(opt.key)}
							className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${sortBy === opt.key ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			)}

			<section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{loading && Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-4">
						<Skeleton className="h-6 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-9 w-24 rounded-md mt-4" />
					</div>
				))}
				{!loading && decks.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-2xl">
						<div className="w-16 h-16 mb-4 bg-white/5 rounded-full flex items-center justify-center">
							<span className="text-2xl">🗂️</span>
						</div>
						<h3 className="text-xl font-semibold mb-2 text-foreground">{t("app.deck.empty")}</h3>
						<p className="text-muted-foreground text-sm max-w-sm">{t("onboarding.empty_hint")}</p>
					</div>
				)}
				{sortedDecks.map((deck) => {
					const bgColor = DECK_BG_COLORS[(deck as any).color] || DECK_BG_COLORS.yellow;
					const dotColor = DECK_COLORS[(deck as any).color] || DECK_COLORS.yellow;
					return (
						<UICard key={deck.id} className={`flex flex-col justify-between group rounded-2xl transition-all cursor-pointer ${bgColor}`}>
							<CardHeader className="pb-2">
								<CardTitle className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-2 min-w-0">
										<div className={`w-3 h-3 rounded-full shrink-0 ${dotColor}`} />
										<span className="text-xl font-semibold line-clamp-1">{deck.name}</span>
									</div>
									<div className="flex flex-col items-end gap-1 shrink-0">
										{deck.dueCards > 0 && (
											<Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
												{deck.dueCards} {t("app.deck.due")}
											</Badge>
										)}
										<span className="text-xs font-medium text-muted-foreground">{deck.totalCards} {t("app.deck.total")}</span>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className="flex items-end justify-between gap-4 mt-auto pt-4 relative">
								<div className="flex-1">
									{deck.description && <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{deck.description}</p>}
									<Link href={`/app/decks/${deck.id}`}>
										<Button size="sm" variant="default">{t("app.deck.open")}</Button>
									</Link>
								</div>
								<div className="absolute bottom-4 right-4">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
												<Trash2 className="h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent className="sm:max-w-[425px]">
											<AlertDialogHeader>
												<AlertDialogTitle>Видалити колоду «{deck.name}»?</AlertDialogTitle>
												<AlertDialogDescription>{t("deck.detail.delete_all.desc")}</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter className="mt-4">
												<AlertDialogCancel>{t("deck.detail.delete_all.cancel")}</AlertDialogCancel>
												<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteDeck(deck.id)}>{t("deck.detail.delete_all.confirm")}</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</CardContent>
						</UICard>
					);
				})}
			</section>
		</div>
	);
}
