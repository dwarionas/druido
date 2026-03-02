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
	yellow: "bg-amber-500",
	peach: "bg-orange-400",
	orange: "bg-orange-500",
	green: "bg-emerald-500",
	blue: "bg-blue-500",
	purple: "bg-violet-500",
};

const DECK_BG_COLORS: Record<string, string> = {
	yellow: "bg-amber-500/10",
	peach: "bg-orange-400/10",
	orange: "bg-orange-500/10",
	green: "bg-emerald-500/10",
	blue: "bg-blue-500/10",
	purple: "bg-violet-500/10",
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
				// Show welcome if first visit + no decks
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
		<div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
			{showWelcome && <WelcomeModal onDismiss={handleDismissWelcome} />}

			<section className="flex items-end justify-between">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">{t("app.decks.title")}</h1>
			</section>

			<section className="bg-card border rounded-2xl p-6 shadow-sm mb-8">
				<form onSubmit={handleCreate} className="space-y-5">
					<h2 className="text-lg font-semibold text-foreground">{t("app.deck.create")}</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Input className="h-10" placeholder={t("app.deck.create.name")} value={name} onChange={(e) => setName(e.target.value)} />
						<Input className="h-10" placeholder={t("app.deck.create.desc")} value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					{/* Color picker */}
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-muted-foreground mr-1">{t("app.deck.create.color")}</span>
						{Object.keys(DECK_COLORS).map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setSelectedColor(c)}
								className={`w-7 h-7 rounded-full border-2 transition-all ${DECK_COLORS[c]} ${selectedColor === c ? "border-primary scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"}`}
							/>
						))}
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={!name.trim() || creating}>
							{creating ? "..." : t("app.deck.create.save")}
						</Button>
					</div>
				</form>
			</section>

			{/* Sort controls */}
			{decks.length > 1 && (
				<div className="flex items-center gap-2 flex-wrap bg-card border rounded-xl p-2 shadow-sm w-fit">
					<ArrowUpDown className="h-4 w-4 text-muted-foreground ml-2 mr-1" />
					{sortOptions.map((opt) => (
						<button
							key={opt.key}
							onClick={() => setSortBy(opt.key)}
							className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${sortBy === opt.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			)}

			<section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{loading && Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
						<Skeleton className="h-6 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-10 w-24 rounded-md mt-4" />
					</div>
				))}
				{!loading && decks.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-card/50 border border-dashed rounded-3xl">
						<div className="w-20 h-20 mb-6 bg-muted rounded-full flex items-center justify-center">
							<span className="text-3xl grayscale opacity-50">🗂️</span>
						</div>
						<h3 className="text-xl font-bold text-foreground mb-2">{t("app.deck.empty")}</h3>
						<p className="text-muted-foreground text-sm max-w-sm">{t("onboarding.empty_hint")}</p>
					</div>
				)}
				{sortedDecks.map((deck) => {
					const bgColor = DECK_BG_COLORS[(deck as any).color] || DECK_BG_COLORS.yellow;
					const dotColor = DECK_COLORS[(deck as any).color] || DECK_COLORS.yellow;
					return (
						<UICard key={deck.id} className={`flex flex-col justify-between group overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer ${bgColor}`}>
							<CardHeader className="pb-3 border-b bg-background/50 backdrop-blur-sm">
								<CardTitle className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-2 min-w-0 flex-1">
										<div className={`w-3 h-3 rounded-full shrink-0 shadow-sm ${dotColor}`} />
										<span className="text-lg font-semibold text-foreground line-clamp-1">{deck.name}</span>
									</div>
									<div className="flex flex-col items-end gap-1.5 shrink-0">
										{deck.dueCards > 0 && (
											<Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
												{deck.dueCards} {t("app.deck.due")}
											</Badge>
										)}
										<span className="text-xs font-medium text-muted-foreground">{deck.totalCards} {t("app.deck.total")}</span>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col justify-between gap-4 p-5 h-full">
								{deck.description ?
									<p className="text-sm text-foreground/80 line-clamp-2 h-10">{deck.description}</p>
									: <div className="h-10"></div>
								}
								<div className="flex items-end justify-between mt-auto space-x-2">
									<Link href={`/app/decks/${deck.id}`} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
										{t("app.deck.open")}
									</Link>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0">
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
