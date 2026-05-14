"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api-client";
import React from "react";

export function CallToActionButton() {
    const { user, loading, refreshUser } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const [starting, setStarting] = React.useState(false);

    async function handleTryDemo() {
        setStarting(true);
        try {
            await api.post("/auth/demo");
            await refreshUser();
            router.push("/app");
        } catch {
            setStarting(false);
        }
    }

    if (!loading && user) {
        return (
            <Link
                href="/app"
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-teal-hover text-xl font-medium rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(30,193,167,0.4)]"
            >
                {t("header.app")}
            </Link>
        );
    }

    return (
        <button
            onClick={handleTryDemo}
            disabled={starting || loading}
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-teal-hover text-xl font-medium rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(30,193,167,0.4)] disabled:opacity-60"
        >
            {starting ? t("demo.loading") : t("landing.cta")}
        </button>
    );
}
