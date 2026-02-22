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
		<div className="space-y-8 animate-pop-in">
			<section>
				<h1 className="text-4xl font-black text-neo-black mb-2">Твої колоди</h1>
				<p className="text-neo-black/70 font-bold text-sm">Створюй колоди та керуй колекціями карток.</p>
			</section>

			<section className="bg-white border-4 border-neo-black rounded-2xl p-6 shadow-[8px_8px_0px_#1a1510] mb-8">
				<form onSubmit={handleCreate} className="space-y-4">
					<h2 className="text-xl font-black text-neo-black">Створити нову колоду</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Input className="h-12 border-2 border-neo-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange" placeholder="Назва колоди" value={name} onChange={(e) => setName(e.target.value)} />
						<Input className="h-12 border-2 border-neo-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_#1a1510] focus-visible:ring-neo-orange" placeholder="Опис (необов'язково)" value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					<Button type="submit" className="w-full md:w-auto brutal-btn bg-neo-black text-white text-lg rounded-xl h-12" disabled={!name.trim() || creating}>
						{creating ? "Створюю..." : "Створити"}
					</Button>
				</form>
			</section>

			<section className="grid gap-6 md:grid-cols-2">
				{loading && Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-white border-4 border-neo-black rounded-2xl p-6 shadow-[8px_8px_0px_#1a1510] space-y-4">
						<Skeleton className="h-6 w-2/3 bg-gray-200" />
						<Skeleton className="h-4 w-1/2 bg-gray-200" />
						<Skeleton className="h-10 w-24 bg-gray-200 rounded-xl mt-4" />
					</div>
				))}
				{!loading && decks.length === 0 && <p className="text-neo-black font-bold text-lg col-span-2 text-center py-12">У тебе ще немає колод. Створи першу вище.</p>}
				{decks.map((deck) => (
					<UICard key={deck.id} className="flex flex-col justify-between group bg-neo-orange/20 border-4 border-neo-black rounded-2xl shadow-[8px_8px_0px_#1a1510] transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_#1a1510]">
						<CardHeader className="pb-2">
							<CardTitle className="flex items-start justify-between gap-2">
								<span className="text-2xl font-black text-neo-black line-clamp-2">{deck.name}</span>
								<div className="flex flex-col items-end gap-2 shrink-0">
									{deck.dueCards > 0 && (
										<Badge variant="default" className="text-xs font-bold px-2 py-1 bg-white text-neo-black border-2 border-neo-black shadow-[2px_2px_0px_#1a1510]">
											{deck.dueCards} до повтору
										</Badge>
									)}
									<span className="text-sm font-bold text-neo-black/70">{deck.totalCards} карток</span>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4 mt-auto pt-4">
							<div className="flex-1">
								{deck.description && <p className="text-sm font-bold text-neo-black/80 mb-4 line-clamp-2">{deck.description}</p>}
								<Link href={`/app/decks/${deck.id}`} className="inline-block bg-neo-black text-white font-bold text-sm px-4 py-2 rounded-xl border-2 border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-black/90 transition-transform active:translate-y-1 active:shadow-none">
									Відкрити
								</Link>
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-10 w-10 border-2 border-neo-black bg-white rounded-xl text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
									>
										<Trash2 className="h-5 w-5" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="bg-white border-4 border-neo-black rounded-2xl shadow-[12px_12px_0px_#1a1510]">
									<AlertDialogHeader>
										<AlertDialogTitle className="text-2xl font-black text-neo-black">Видалити колоду «{deck.name}»?</AlertDialogTitle>
										<AlertDialogDescription className="text-base font-bold text-neo-black/70">
											Усі картки в цій колоді будуть видалені назавжди. Цю дію не можна скасувати.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter className="gap-3 sm:gap-0 mt-6">
										<AlertDialogCancel className="h-12 rounded-xl border-2 border-neo-black text-sm font-bold text-neo-black shadow-[2px_2px_0px_#1a1510]">Скасувати</AlertDialogCancel>
										<AlertDialogAction
											className="h-12 rounded-xl border-2 border-neo-black bg-red-500 text-white text-sm font-bold shadow-[2px_2px_0px_#1a1510] hover:bg-red-600"
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
