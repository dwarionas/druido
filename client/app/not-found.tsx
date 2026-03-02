"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
    const { t } = useI18n();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 bg-background text-center">
            <div className="w-32 h-32 mb-8 bg-muted rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                <span className="text-5xl font-bold text-muted-foreground/50">404</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 animate-slide-up-fade">{t("404.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md animate-slide-up-fade-delay-1">{t("404.desc")}</p>
            <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 animate-slide-up-fade-delay-2"
            >
                {t("404.back")}
            </Link>
        </div>
    );
}
