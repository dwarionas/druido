"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export function CallToActionButton() {
    const { user, loading } = useAuth();
    const { t } = useI18n();

    return (
        <Link
            href={!loading && user ? "/app" : "/login"}
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-teal-hover text-xl font-medium rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(30,193,167,0.4)]"
        >
            {!loading && user ? t("header.app") : t("landing.cta")}
        </Link>
    );
}
