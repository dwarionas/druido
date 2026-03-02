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
            className="w-full h-14 brutal-btn bg-[#2d2112] text-white text-xl rounded-full flex items-center justify-center"
        >
            {!loading && user ? t("header.app") : t("landing.cta")}
        </Link>
    );
}
