"use client";

import React from "react";

export type Locale = "uk" | "en" | "de";

const messages: Record<Locale, Record<string, string>> = {
	uk: {
		"landing.hero": "FSRS-закріплення знань для серйозних учнів.",
		"landing.cta": "Почати з email",
		"landing.features": "Можливості",
		"landing.feature1.title": "Картки з інтервальним повторенням",
		"landing.feature1.desc": "Оптимізований алгоритм для максимального запам'ятовування.",
		"landing.feature2.title": "Організація",
		"landing.feature2.desc": "Групуйте картки у колоди з тегами та налаштуваннями.",
		"landing.footer": "© 2026 Druido. Усі права захищені.",
		"header.login": "Увійти",
		"header.app": "До додатку",
		"login.title": "Повертаємось до навчання",
		"login.subtitle": "Увійдіть за допомогою email та пароля",
		"login.email": "Email",
		"login.password": "Пароль",
		"login.name": "Ім'я (для реєстрації)",
		"login.action.login": "Увійти",
		"login.action.register": "Зареєструватися",
		"login.switch.register": "Немає акаунту? Зареєструватися",
		"login.switch.login": "Вже є акаунт? Увійти",
		"login.error": "Невірний email або пароль",
		"app.decks.title": "Твої колоди",
		"app.decks.loading": "Завантаження...",
		"app.deck.total": "всього",
		"app.deck.due": "на повторення",
		"app.deck.create": "Створити нову колоду",
		"app.deck.create.name": "Назва колоди",
		"app.deck.create.desc": "Опис",
		"app.deck.create.lang": "Мова",
		"app.deck.create.cancel": "Скасувати",
		"app.deck.create.save": "Створити",
		"app.deck.empty": "Колод поки немає. Створи першу!",
		"app.search.placeholder": "Пошук колод або карток...",
		"app.search.title": "Результати пошуку",
		"app.search.decks": "Колоди",
		"app.search.cards": "Картки",
		"app.search.empty": "Нічого не знайдено за запитом",
		"deck.detail.cards": "Картки",
		"deck.detail.due": "Додавай та повторюй картки.",
		"deck.detail.add": "Додати картку",
		"deck.detail.delete_all": "Видалити всі",
		"deck.detail.delete_all.desc": "Це видалить усі картки у колоді. Цю дію не можна скасувати.",
		"deck.detail.delete_all.cancel": "Скасувати",
		"deck.detail.delete_all.confirm": "Видалити",
		"deck.detail.question": "Питання",
		"deck.detail.answer": "Відповідь",
		"deck.detail.tags": "Теги (через кому)",
		"deck.detail.save": "Зберегти картку",
		"deck.detail.saving": "Зберігаю...",
		"deck.detail.edit": "Редагувати картку",
		"deck.detail.edit.save": "Зберегти зміни",
		"deck.detail.cancel": "Скасувати",
		"deck.detail.export": "Експорт CSV",
		"deck.detail.import": "Імпорт CSV",
		"deck.detail.import_apkg": "Імпорт Anki",
		"deck.detail.back": "Назад",
		"deck.review.title": "Повторення",
		"deck.review.empty": "На сьогодні карток немає! Можна відпочивати.",
		"deck.review.flip": "Показати відповідь",
		"deck.review.again": "Знову",
		"deck.review.hard": "Тяжко",
		"deck.review.good": "Добре",
		"deck.review.easy": "Легко",
		"profile.settings": "Налаштування (скоро)",
		"profile.logout": "Вийти"
	},
	en: {
		"landing.hero": "FSRS-based spaced repetition for serious learners.",
		"landing.cta": "Get started with email",
		"landing.features": "Features",
		"landing.feature1.title": "Spaced Repetition Flashcards",
		"landing.feature1.desc": "Optimized algorithm for maximum retention.",
		"landing.feature2.title": "Organization",
		"landing.feature2.desc": "Group cards into decks with tags and settings.",
		"landing.footer": "© 2026 Druido. All rights reserved.",
		"header.login": "Log in",
		"header.app": "Go to App",
		"login.title": "Welcome back",
		"login.subtitle": "Log in with your email and password",
		"login.email": "Email",
		"login.password": "Password",
		"login.name": "Name (for registration)",
		"login.action.login": "Log in",
		"login.action.register": "Register",
		"login.switch.register": "Don't have an account? Register",
		"login.switch.login": "Already have an account? Log in",
		"login.error": "Invalid email or password",
		"app.decks.title": "Your Decks",
		"app.decks.loading": "Loading...",
		"app.deck.total": "total",
		"app.deck.due": "due",
		"app.deck.create": "Create new deck",
		"app.deck.create.name": "Deck Name",
		"app.deck.create.desc": "Description",
		"app.deck.create.lang": "Language",
		"app.deck.create.cancel": "Cancel",
		"app.deck.create.save": "Create",
		"app.deck.empty": "No decks yet. Create your first one!",
		"app.search.placeholder": "Search decks or cards...",
		"app.search.title": "Search Results",
		"app.search.decks": "Decks",
		"app.search.cards": "Cards",
		"app.search.empty": "No results found for",
		"deck.detail.cards": "Cards",
		"deck.detail.due": "Add and review cards.",
		"deck.detail.add": "Add Card",
		"deck.detail.delete_all": "Delete All",
		"deck.detail.delete_all.desc": "This will delete all cards in the deck. This action cannot be undone.",
		"deck.detail.delete_all.cancel": "Cancel",
		"deck.detail.delete_all.confirm": "Delete",
		"deck.detail.question": "Question",
		"deck.detail.answer": "Answer",
		"deck.detail.tags": "Tags (comma-separated)",
		"deck.detail.save": "Save Card",
		"deck.detail.saving": "Saving...",
		"deck.detail.edit": "Edit Card",
		"deck.detail.edit.save": "Save Changes",
		"deck.detail.cancel": "Cancel",
		"deck.detail.export": "Export CSV",
		"deck.detail.import": "Import CSV",
		"deck.detail.import_apkg": "Import Anki",
		"deck.detail.back": "Back",
		"deck.review.title": "Review",
		"deck.review.empty": "No more cards for today! You can rest.",
		"deck.review.flip": "Show Answer",
		"deck.review.again": "Again",
		"deck.review.hard": "Hard",
		"deck.review.good": "Good",
		"deck.review.easy": "Easy",
		"profile.settings": "Settings (soon)",
		"profile.logout": "Log out"
	},
	de: {
		"landing.hero": "FSRS-basiertes Wiederholen für ernsthafte Lerner.",
		"landing.cta": "Mit E-Mail starten",
		"landing.features": "Funktionen",
		"landing.feature1.title": "Spaced Repetition Karteikarten",
		"landing.feature1.desc": "Optimierter Algorithmus für maximales Behalten.",
		"landing.feature2.title": "Organisation",
		"landing.feature2.desc": "Gruppieren Sie Karten in Decks mit Tags.",
		"landing.footer": "© 2026 Druido. Alle Rechte vorbehalten.",
		"header.login": "Anmelden",
		"header.app": "Zur App",
		"login.title": "Willkommen zurück",
		"login.subtitle": "Melde dich mit E-Mail und Passwort an",
		"login.email": "E-Mail",
		"login.password": "Passwort",
		"login.name": "Name (für Registrierung)",
		"login.action.login": "Anmelden",
		"login.action.register": "Registrieren",
		"login.switch.register": "Noch kein Konto? Registrieren",
		"login.switch.login": "Bereits ein Konto? Anmelden",
		"login.error": "Ungültige E-Mail oder Passwort",
		"app.decks.title": "Deine Decks",
		"app.decks.loading": "Wird geladen...",
		"app.deck.total": "gesamt",
		"app.deck.due": "fällig",
		"app.deck.create": "Neues Deck erstellen",
		"app.deck.create.name": "Deck Name",
		"app.deck.create.desc": "Beschreibung",
		"app.deck.create.lang": "Sprache",
		"app.deck.create.cancel": "Abbrechen",
		"app.deck.create.save": "Erstellen",
		"app.deck.empty": "Noch keine Decks. Erstelle dein erstes!",
		"app.search.placeholder": "Decks oder Karten suchen...",
		"app.search.title": "Suchergebnisse",
		"app.search.decks": "Decks",
		"app.search.cards": "Karten",
		"app.search.empty": "Keine Ergebnisse gefunden für",
		"deck.detail.cards": "Karten",
		"deck.detail.due": "Füge Karten hinzu und lerne sie.",
		"deck.detail.add": "Karte hinzufügen",
		"deck.detail.delete_all": "Alle löschen",
		"deck.detail.delete_all.desc": "Dies löscht alle Karten im Deck. Diese Aktion kann nicht rückgängig gemacht werden.",
		"deck.detail.delete_all.cancel": "Abbrechen",
		"deck.detail.delete_all.confirm": "Löschen",
		"deck.detail.question": "Frage",
		"deck.detail.answer": "Antwort",
		"deck.detail.tags": "Tags (kommagetrennt)",
		"deck.detail.save": "Karte speichern",
		"deck.detail.saving": "Wird gespeichert...",
		"deck.detail.edit": "Karte bearbeiten",
		"deck.detail.edit.save": "Änderungen speichern",
		"deck.detail.cancel": "Abbrechen",
		"deck.detail.export": "CSV exportieren",
		"deck.detail.import": "CSV importieren",
		"deck.detail.import_apkg": "Anki importieren",
		"deck.detail.back": "Zurück",
		"deck.review.title": "Wiederholen",
		"deck.review.empty": "Keine Karten mehr für heute! Du kannst dich ausruhen.",
		"deck.review.flip": "Antwort anzeigen",
		"deck.review.again": "Nochmal",
		"deck.review.hard": "Schwer",
		"deck.review.good": "Gut",
		"deck.review.easy": "Einfach",
		"profile.settings": "Einstellungen (bald)",
		"profile.logout": "Abmelden"
	},
};

interface I18nContextValue {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string, fallback?: string) => string;
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined);

const LOCALE_STORAGE_KEY = "druido.locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = React.useState<Locale>("en");

	React.useEffect(() => {
		const stored = (typeof window !== "undefined" && window.localStorage.getItem(LOCALE_STORAGE_KEY)) as Locale | null;
		if (stored === "uk" || stored === "en" || stored === "de") {
			setLocaleState(stored);
		}
	}, []);

	const setLocale = (next: Locale) => {
		setLocaleState(next);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
		}
	};

	const t = (key: string, fallback?: string) => {
		const dict = messages[locale];
		return dict[key] ?? fallback ?? messages.en[key] ?? key;
	};

	const value: I18nContextValue = {
		locale,
		setLocale,
		t,
	};

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const ctx = React.useContext(I18nContext);
	if (!ctx) {
		throw new Error("useI18n must be used within I18nProvider");
	}
	return ctx;
}

export function LanguageSwitcher() {
	const { locale, setLocale } = useI18n();

	return (
		<div className="flex items-center gap-1 text-xs">
			{(["uk", "en", "de"] as Locale[]).map((lng) => (
				<button
					key={lng}
					type="button"
					onClick={() => setLocale(lng)}
					className={`px-2 py-1 transition-all ${locale === lng ? "btn-gradient font-medium" : "text-muted-foreground hover:bg-muted"
						}`}
				>
					{lng.toUpperCase()}
				</button>
			))}
		</div>
	);
}
