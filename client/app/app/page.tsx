"use client";

import React from "react";
import Link from "next/link";
import { getDecksSummary, createDeck, type DeckSummary, deleteDeck } from "@/lib/decks-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function AppPage() {
	const [decks, setDecks] = React.useState<DeckSummary[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [creating, setCreating] = React.useState(false);

	async function loadDecks(query?: string) {
		setLoading(true);
		try {
			const data = await getDecksSummary(query);
			setDecks(data);
		} catch (err) {
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
		} catch (err) {
			toast.error("Помилка при створенні колоди");
		} finally {
			setCreating(false);
		}
	}

	async function handleDeleteDeck(deckId: string, deckName: string) {
		if (!window.confirm(`Видалити колоду "${deckName}"? Усі картки будуть втрачені.`)) return;
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
				{loading && <p className="text-muted-foreground">Завантаження...</p>}
				{!loading && decks.length === 0 && <p className="text-muted-foreground">У тебе ще немає колод. Створи першу вище.</p>}
				{decks.map((deck) => (
					<UICard key={deck.id} className="flex flex-col justify-between group hover:shadow-md transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-2">
								<span>{deck.name}</span>
								<span className="text-xs font-normal text-muted-foreground">{deck.totalCards} карток</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center justify-between gap-2">
							<div>
								{deck.description && <p className="text-sm text-muted-foreground mb-2">{deck.description}</p>}
								<Button variant="outline" size="sm" asChild>
									<Link href={`/app/decks/${deck.id}`}>Відкрити</Link>
								</Button>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
								onClick={() => handleDeleteDeck(deck.id, deck.name)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</CardContent>
					</UICard>
				))}
			</section>
		</div>
	);
}
