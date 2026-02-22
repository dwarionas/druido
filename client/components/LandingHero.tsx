"use client";

import Link from "next/link";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

export function LandingHero() {
	const { t } = useI18n();
	const { user, loading } = useAuth();

	return (
		<section className="flex flex-col items-center justify-center text-center space-y-10 animate-pop-in-delay-1 py-12">
			<div className="space-y-6 flex flex-col items-center">
				<h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-neo-black max-w-3xl leading-[1.1]">
					Speak<br />Confidently
				</h1>
				<div className="flex items-center gap-3 bg-white border-4 border-neo-black rounded-full px-4 py-2 shadow-[4px_4px_0px_#1a1510]">
					<span className="font-bold text-sm">ON</span>
					<div className="w-8 h-8 rounded-full bg-neo-orange border-2 border-neo-black"></div>
				</div>
			</div>

			{/* Illustration Placeholder */}
			<div className="relative w-full max-w-sm mx-auto aspect-square bg-neo-peach rounded-full border-4 border-neo-black shadow-[8px_8px_0px_#1a1510] flex flex-col justify-end items-center overflow-hidden">
				{/* Dog placeholder */}
				<div className="w-1/2 h-1/2 bg-white rounded-t-full border-4 border-b-0 border-neo-black flex flex-col justify-between items-center z-10">
					<div className="w-4 h-4 rounded-full bg-neo-black mt-8"></div>
				</div>
				{/* Podium */}
				<div className="w-3/4 h-16 bg-white border-t-4 border-neo-black self-end z-20 brutal-shadow relative -mb-1">
					<div className="absolute inset-x-0 top-2 h-2 bg-neo-orange"></div>
				</div>
			</div>

			<div className="w-full max-w-sm mx-auto pt-8">
				<Link
					href={!loading && user ? "/app" : "/login"}
					className="w-full h-14 brutal-btn bg-[#2d2112] text-white text-xl rounded-full flex items-center justify-center"
				>
					{!loading && user ? "Go to App" : "Get Started"}
				</Link>
			</div>
		</section>
	);
}
