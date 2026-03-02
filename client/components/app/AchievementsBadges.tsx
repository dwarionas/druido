"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Achievement } from "@/lib/achievements";

interface Props {
    achievements: Achievement[];
}

export default function AchievementsBadges({ achievements }: Props) {
    const { t } = useI18n();
    const earned = achievements.filter((a) => a.earned);
    const locked = achievements.filter((a) => !a.earned);

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-foreground">{t("achievements.title")}</h2>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {earned.length}/{achievements.length}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {achievements.map((a) => (
                    <div
                        key={a.id}
                        className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${a.earned
                            ? "bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                            : "bg-muted/30 border-transparent opacity-60 grayscale"
                            }`}
                    >
                        <span className="text-3xl mb-2">{a.earned ? a.emoji : "🔒"}</span>
                        <span className="text-xs font-semibold text-foreground leading-tight">{t(a.titleKey)}</span>
                        <span className="text-[10px] font-medium text-muted-foreground mt-1 leading-tight">{t(a.descKey)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
