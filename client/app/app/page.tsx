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
import { Trash2 } from "lucide-react";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AppPage() {
	const [decks, setDecks] = React.useState<DeckSummary[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [creating, setCreating] = React.useState(false);

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
			}
		}).catch(() => {
			if (!cancelled) setLoading(false);
		});
		return () => { cancelled = true; };
	}, []);

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setCreating(true);
		try {
			await createDeck({ name, description: description || undefined });
			setName("");
			setDescription("");
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

	return (
		<div className="space-y-6">
			<section>
				<h1 className="text-2xl font-semibold mb-2">Твої колоди</h1>
				<p className="text-muted-foreground text-sm">Створюй колоди та керуй колекціями карток.</p>
			</section>

			<section className="grid gap-4 md:grid-cols-[2fr,3fr]">
				<form onSubmit={handleCreate} className="space-y-3">
					<h2 className="text-sm font-medium">Створити нову колоду</h2>
					<Input placeholder="Назва колоди" value={name} onChange={(e) => setName(e.target.value)} />
					<Input placeholder="Опис (необов'язково)" value={description} onChange={(e) => setDescription(e.target.value)} />
					<Button type="submit" disabled={!name.trim() || creating}>
						{creating ? "Створюю..." : "Створити"}
					</Button>
				</form>
			</section>

			<section className="grid gap-4 md:grid-cols-2">
				{loading && Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="rounded-lg border p-4 space-y-3">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-8 w-20" />
					</div>
				))}
				{!loading && decks.length === 0 && <p className="text-muted-foreground">У тебе ще немає колод. Створи першу вище.</p>}
				{decks.map((deck) => (
					<UICard key={deck.id} className="flex flex-col justify-between group hover:shadow-md transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-2">
								<span>{deck.name}</span>
								<div className="flex items-center gap-1.5">
									{deck.dueCards > 0 && (
										<Badge variant="default" className="text-[10px] px-1.5 py-0">
											{deck.dueCards} до повтору
										</Badge>
									)}
									<span className="text-xs font-normal text-muted-foreground">{deck.totalCards} карток</span>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-between gap-2">
							<div>
								{deck.description && <p className="text-sm text-muted-foreground mb-2">{deck.description}</p>}
								<Button variant="outline" size="sm" asChild>
									<Link href={`/app/decks/${deck.id}`}>Відкрити</Link>
								</Button>
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Видалити колоду «{deck.name}»?</AlertDialogTitle>
										<AlertDialogDescription>
											Усі картки в цій колоді будуть видалені назавжди. Цю дію не можна скасувати.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Скасувати</AlertDialogCancel>
										<AlertDialogAction
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											onClick={() => handleDeleteDeck(deck.id)}
										>
											Видалити
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</UICard>
				))}
			</section>
		</div>
	);
}
