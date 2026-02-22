"use client";

import Link from "next/link";
import ModeToggle from "./ModeToggle";

export function Header() {
	return (
		<header className="flex items-center justify-between">
			<Link href="/" className="flex items-center gap-2">
				<div className="flex h-7 w-7 items-center justify-center border bg-foreground text-background text-xs font-bold">D</div>
				<span className="text-sm font-semibold tracking-tight">Druido</span>
			</Link>

			<div className="flex items-center gap-3">
				<ModeToggle />
				<Link
					href="/login"
					className="border px-3 py-1 text-xs font-medium hover:bg-muted transition-colors"
				>
					Login
				</Link>
			</div>
		</header>
	);
}
