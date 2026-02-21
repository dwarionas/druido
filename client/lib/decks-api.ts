import { api } from './api-client';

// ----- Types -----

export interface DeckSummary {
	id: string;
	name: string;
	description: string | null;
	language: string;
	tags: string[];
	totalCards: number;
	dueCards: number;
	createdAt: string;
	updatedAt: string;
}

export interface Deck {
	id: string;
	name: string;
	description: string | null;
	language: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Card {
	id: string;
	deckId: string;
	question: string;
	answer: string;
	notes: string | null;
	tags: string[];
	stability: number | null;
	difficulty: number | null;
	elapsedDays: number;
	scheduledDays: number;
	reps: number;
	lapses: number;
	state: number;
	due: string;
	lastReviewedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ReviewResult {
	card: Card;
	schedule: Record<number, string>;
}

// ----- Decks API -----

export function listDecks(q?: string) {
	const query = q ? `?q=${encodeURIComponent(q)}` : '';
	return api.get<Deck[]>(`/decks${query}`);
}

export function getDecksSummary(q?: string) {
	const query = q ? `?q=${encodeURIComponent(q)}` : '';
	return api.get<DeckSummary[]>(`/decks/summary${query}`);
}

export function getDeck(id: string) {
	return api.get<Deck>(`/decks/${id}`);
}

export function createDeck(data: { name: string; description?: string; language?: string; tags?: string[] }) {
	return api.post<Deck>('/decks', data);
}

export function updateDeck(id: string, data: Partial<{ name: string; description: string; language: string; tags: string[] }>) {
	return api.patch<Deck>(`/decks/${id}`, data);
}

export function deleteDeck(id: string) {
	return api.del<void>(`/decks/${id}`);
}

// ----- Cards API -----

export function listCards(deckId?: string, q?: string, tag?: string) {
	const params = new URLSearchParams();
	if (deckId) params.set('deckId', deckId);
	if (q) params.set('q', q);
	if (tag) params.set('tag', tag);
	const query = params.toString() ? `?${params}` : '';
	return api.get<Card[]>(`/cards${query}`);
}

export function getDueCards(deckId: string) {
	return api.get<Card[]>(`/cards/due?deckId=${deckId}`);
}

export function getCard(id: string) {
	return api.get<Card>(`/cards/${id}`);
}

export function getSchedulePreview(id: string) {
	return api.get<Record<number, string>>(`/cards/${id}/schedule`);
}

export function createCard(data: { deckId: string; question: string; answer: string; notes?: string; tags?: string[] }) {
	return api.post<Card>('/cards', data);
}

export function updateCard(id: string, data: Partial<{ question: string; answer: string; notes: string; tags: string[] }>) {
	return api.patch<Card>(`/cards/${id}`, data);
}

export function reviewCard(id: string, rating: number) {
	return api.post<ReviewResult>(`/cards/${id}/review`, { rating });
}

export function deleteCard(id: string) {
	return api.del<void>(`/cards/${id}`);
}

export function bulkDeleteCards(deckId: string) {
	return api.del<void>(`/cards/bulk?deckId=${deckId}`);
}
