"use client";

import Link from "next/link";
import ModeToggle from "./ModeToggle";

export function Header() {
	return (
		<header className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">D</div>
				<span className="font-semibold">Druido</span>
			</div>

			<div className="flex gap-3">
				<ModeToggle />
				<Link href="/login" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
					Login
				</Link>
			</div>
		</header>
	);
}
