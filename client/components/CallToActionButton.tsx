"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function CallToActionButton() {
    const { user, loading } = useAuth();

    return (
        <Link
            href={!loading && user ? "/app" : "/login"}
            className="w-full h-14 brutal-btn bg-[#2d2112] text-white text-xl rounded-full flex items-center justify-center"
        >
            {!loading && user ? "Go to App >" : "Select a Language >"}
        </Link>
    );
}
