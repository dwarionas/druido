"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
    const { t } = useI18n();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 bg-background text-center relative">
            <div className="absolute inset-0 glow-red pointer-events-none" aria-hidden="true" />

            <div className="relative animate-fade-in-up">
                <div className="w-32 h-32 mb-8 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-5xl font-bold text-primary">404</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{t("404.title")}</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md animate-fade-in-up-delay-1">{t("404.desc")}</p>
                <Link
                    href="/"
                    className="bg-primary text-primary-foreground hover:bg-teal-hover rounded-full text-base font-medium px-8 py-3 transition-all hover:shadow-[0_0_20px_rgba(30,193,167,0.3)] inline-flex items-center animate-fade-in-up-delay-2"
                >
                    {t("404.back")}
                </Link>
            </div>
        </div>
    );
}
