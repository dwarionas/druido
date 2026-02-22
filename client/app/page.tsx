import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";

export default function Home() {
	return (
		<div className="min-h-dvh bg-background">
			<main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-16 px-6 py-16">
				<Header />
				<LandingHero />

				<section id="features" className="space-y-6">
					<h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Features</h2>
					<div className="grid gap-px border bg-border md:grid-cols-3">
						<div className="bg-background p-5">
							<h3 className="mb-1.5 text-sm font-medium">Smart scheduling</h3>
							<p className="text-[13px] leading-relaxed text-muted-foreground">Review cards at the right time using FSRS, a modern replacement for SM-2.</p>
						</div>
						<div className="bg-background p-5">
							<h3 className="mb-1.5 text-sm font-medium">Powerful organisation</h3>
							<p className="text-[13px] leading-relaxed text-muted-foreground">Create decks, tag cards, import CSV files, and search across everything.</p>
						</div>
						<div className="bg-background p-5">
							<h3 className="mb-1.5 text-sm font-medium">Built for polyglots</h3>
							<p className="text-[13px] leading-relaxed text-muted-foreground">Interface in Ukrainian, English, and German. Keyboard shortcuts included.</p>
						</div>
					</div>
				</section>

				<footer className="mt-auto flex items-center justify-between border-t pt-6 text-[11px] text-muted-foreground">
					<span>© {new Date().getFullYear()} Druido</span>
					<span>FSRS-based spaced repetition</span>
				</footer>
			</main>
		</div>
	);
}
