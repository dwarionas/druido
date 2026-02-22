"use client";

import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
	const { user, loading } = useAuth();

	return (
		<header className="flex w-full items-center justify-between animate-pop-in border-b-4 border-neo-black bg-neo-yellow px-6 py-4">
			<Link href="/" className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-neo-black bg-neo-orange text-xl font-bold tracking-tight shadow-[4px_4px_0px_#1a1510] transition-transform hover:-translate-y-1 hover:shadow-[4px_6px_0px_#1a1510]">
					D
				</div>
				<span className="text-xl font-extrabold tracking-tight text-neo-black">Druido</span>
			</Link>

			<div className="flex items-center gap-4">
				{/* Hidden ModeToggle since we force light theme for this design */}
				<Link
					href={!loading && user ? "/app" : "/login"}
					className="rounded-xl border-4 border-neo-black bg-white px-5 py-2 text-sm font-bold text-neo-black shadow-[4px_4px_0px_#1a1510] transition-transform hover:-translate-y-1 hover:shadow-[4px_6px_0px_#1a1510]"
				>
					{!loading && user ? "Go to App" : "Login"}
				</Link>
			</div>
		</header>
	);
}
