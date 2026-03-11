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

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse pt-4">
                <div className="h-8 w-48 bg-white/5 rounded-md" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl border border-border" />)}
                </div>
                <div className="h-40 bg-white/5 rounded-2xl border border-border" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up py-6">
            <h1 className="text-3xl font-bold tracking-tight">{t("stats.title")}</h1>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-3xl font-bold text-foreground">{overview?.streak ?? 0}</div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">{t("stats.streak")}</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-foreground">{overview?.xp ?? 0}</div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">{t("stats.xp")}</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-3xl font-bold text-foreground">{overview?.totalCards ?? 0}</div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">{t("stats.total_cards")}</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-2">🗂️</div>
                    <div className="text-3xl font-bold text-foreground">{overview?.totalDecks ?? 0}</div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">{t("stats.total_decks")}</div>
                </div>
            </div>

            {/* Daily goal progress */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{t("stats.daily_goal")}</h2>
                    <span className="text-sm font-medium text-muted-foreground">{overview?.reviewedToday ?? 0} / {overview?.dailyGoal ?? 20}</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-700 rounded-full"
                        style={{ width: `${goalProgress}%` }}
                    />
                </div>
            </div>

            {/* Activity heatmap */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">{t("stats.activity")}</h2>
                <div className="overflow-x-auto pb-2">
                    <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[700px]">
                        {heatmapCells.map((cell) => (
                            <div
                                key={cell.date}
                                className={`w-3 h-3 rounded-sm transition-opacity hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background cursor-help ${cell.count > 0 ? 'bg-primary' : 'bg-white/5'}`}
                                style={cell.count > 0 ? { opacity: Math.max(0.3, cell.level * 0.25) } : {}}
                                title={`${cell.date}: ${cell.count} ${t("stats.cards")}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/5" />
                        <div className="w-3 h-3 rounded-sm bg-primary/30" />
                        <div className="w-3 h-3 rounded-sm bg-primary/50" />
                        <div className="w-3 h-3 rounded-sm bg-primary/75" />
                        <div className="w-3 h-3 rounded-sm bg-primary" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* 30-day bar chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">{t("stats.daily_chart")}</h2>
                <div className="flex items-end gap-1 h-40">
                    {daily.map((d) => (
                        <div
                            key={d.date}
                            className="flex-1 bg-primary/40 hover:bg-primary rounded-t-sm transition-colors cursor-pointer relative group min-w-[8px]"
                            style={{ height: `${Math.max((d.cardsReviewed / maxDaily) * 100, 4)}%` }}
                            title={`${d.date}: ${d.cardsReviewed} ${t("stats.cards")}`}
                        >
                            <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border shadow-md text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap z-10">
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
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-6">{t("stats.deck_mastery")}</h2>
                    <div className="space-y-6">
                        {deckStats.map((ds) => (
                            <div key={ds.deckId}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold truncate">{ds.deckName}</span>
                                    <span className="text-xs font-medium shrink-0 ml-2 text-primary">{ds.masteryPercent}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full flex gap-0.5">
                                        {ds.mature > 0 && <div className="bg-green-500 h-full rounded-l-full" style={{ width: `${(ds.mature / Math.max(ds.total, 1)) * 100}%` }} />}
                                        {ds.learning > 0 && <div className="bg-orange-500 h-full" style={{ width: `${(ds.learning / Math.max(ds.total, 1)) * 100}%` }} />}
                                        {ds.new > 0 && <div className="bg-blue-500 h-full rounded-r-full" style={{ width: `${(ds.new / Math.max(ds.total, 1)) * 100}%` }} />}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> {ds.mature} {t("deck.stats.mature")}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> {ds.learning} {t("deck.stats.learning")}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> {ds.new} {t("deck.stats.new")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Achievements</h2>
                <AchievementsBadges achievements={computeAchievements(overview, deckStats)} />
            </div>
        </div>
    );
}
