"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { getStatsOverview, getStatsHeatmap, getStatsDaily, getStatsByDeck, type StatsOverview, type DailyStats, type DeckStats } from "@/lib/decks-api";
import { computeAchievements } from "@/lib/achievements";
import AchievementsBadges from "@/components/app/AchievementsBadges";

export default function StatsPage() {
    const { t } = useI18n();
    const [overview, setOverview] = React.useState<StatsOverview | null>(null);
    const [heatmap, setHeatmap] = React.useState<Record<string, number>>({});
    const [daily, setDaily] = React.useState<DailyStats[]>([]);
    const [deckStats, setDeckStats] = React.useState<DeckStats[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;
        Promise.all([getStatsOverview(), getStatsHeatmap(), getStatsDaily(30), getStatsByDeck()])
            .then(([ov, hm, dl, ds]) => {
                if (!cancelled) {
                    setOverview(ov);
                    setHeatmap(hm);
                    setDaily(dl);
                    setDeckStats(ds);
                }
            })
            .catch(() => { })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const maxDaily = Math.max(...daily.map(d => d.cardsReviewed), 1);
    const goalProgress = overview ? Math.min((overview.reviewedToday / overview.dailyGoal) * 100, 100) : 0;

    // Generate heatmap grid (52 weeks × 7 days)
    const heatmapCells = React.useMemo(() => {
        const cells: { date: string; count: number; level: number }[] = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const count = heatmap[key] || 0;
            const level = count === 0 ? 0 : count <= 5 ? 1 : count <= 15 ? 2 : count <= 30 ? 3 : 4;
            cells.push({ date: key, count, level });
        }
        return cells;
    }, [heatmap]);

    const heatmapColors = [
        "bg-muted",
        "bg-primary/20",
        "bg-primary/40",
        "bg-primary/60",
        "bg-primary",
    ];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded-xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
                </div>
                <div className="h-40 bg-muted rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("stats.title")}</h1>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-1 hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-3xl font-bold tracking-tight text-foreground">{overview?.streak ?? 0}</div>
                    <div className="text-sm font-medium text-muted-foreground">{t("stats.streak")}</div>
                </div>
                <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-1 hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-3xl font-bold tracking-tight text-foreground">{overview?.xp ?? 0}</div>
                    <div className="text-sm font-medium text-muted-foreground">{t("stats.xp")}</div>
                </div>
                <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-1 hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-3xl font-bold tracking-tight text-foreground">{overview?.totalCards ?? 0}</div>
                    <div className="text-sm font-medium text-muted-foreground">{t("stats.total_cards")}</div>
                </div>
                <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-1 hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">🗂️</div>
                    <div className="text-3xl font-bold tracking-tight text-foreground">{overview?.totalDecks ?? 0}</div>
                    <div className="text-sm font-medium text-muted-foreground">{t("stats.total_decks")}</div>
                </div>
            </div>

            {/* Daily goal progress */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("stats.daily_goal")}</h2>
                    <span className="text-sm font-medium text-foreground">{overview?.reviewedToday ?? 0} / {overview?.dailyGoal ?? 20}</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-700 rounded-full"
                        style={{ width: `${goalProgress}%` }}
                    />
                </div>
            </div>

            {/* Activity heatmap */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">{t("stats.activity")}</h2>
                <div className="overflow-x-auto pb-2">
                    <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[700px]">
                        {heatmapCells.map((cell) => (
                            <div
                                key={cell.date}
                                className={`w-3 h-3 rounded-sm ${heatmapColors[cell.level]} transition-colors`}
                                title={`${cell.date}: ${cell.count} ${t("stats.cards")}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-muted-foreground">
                    <span>Less</span>
                    {heatmapColors.map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {/* 30-day bar chart */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">{t("stats.daily_chart")}</h2>
                <div className="flex items-end gap-1 h-32">
                    {daily.map((d) => (
                        <div
                            key={d.date}
                            className="flex-1 bg-primary/40 hover:bg-primary rounded-t-sm transition-colors cursor-pointer relative group min-w-[6px]"
                            style={{ height: `${Math.max((d.cardsReviewed / maxDaily) * 100, 4)}%` }}
                            title={`${d.date}: ${d.cardsReviewed} ${t("stats.cards")}`}
                        >
                            <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-medium px-2 py-1 rounded shadow-sm whitespace-nowrap z-10">
                                {d.cardsReviewed}
                            </div>
                        </div>
                    ))}
                </div>
                {daily.length > 0 && (
                    <div className="flex justify-between mt-3 text-xs font-medium text-muted-foreground">
                        <span>{daily[0]?.date.slice(5)}</span>
                        <span>{daily[daily.length - 1]?.date.slice(5)}</span>
                    </div>
                )}
            </div>

            {/* Deck mastery */}
            {deckStats.length > 0 && (
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">{t("stats.deck_mastery")}</h2>
                    <div className="space-y-5">
                        {deckStats.map((ds) => (
                            <div key={ds.deckId}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-foreground truncate">{ds.deckName}</span>
                                    <span className="text-sm font-medium text-muted-foreground shrink-0 ml-2">{ds.masteryPercent}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                                    {ds.mature > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${(ds.mature / Math.max(ds.total, 1)) * 100}%` }} />}
                                    {ds.learning > 0 && <div className="bg-orange-500 h-full" style={{ width: `${(ds.learning / Math.max(ds.total, 1)) * 100}%` }} />}
                                    {ds.new > 0 && <div className="bg-yellow-500 h-full" style={{ width: `${(ds.new / Math.max(ds.total, 1)) * 100}%` }} />}
                                </div>
                                <div className="flex gap-4 mt-2 text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {ds.mature} {t("deck.stats.mature")}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> {ds.learning} {t("deck.stats.learning")}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> {ds.new} {t("deck.stats.new")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <AchievementsBadges achievements={computeAchievements(overview, deckStats)} />
            </div>
        </div>
    );
}
