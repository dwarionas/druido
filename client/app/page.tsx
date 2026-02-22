import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import Link from "next/link";
import { LanguageSwitcher } from "@/lib/i18n";
import { CallToActionButton } from "@/components/CallToActionButton";

export default function Home() {
	return (
		<div className="flex flex-col min-h-[300dvh]">
			{/* Section 1: Speak Confidently (Yellow) */}
			<section className="min-h-dvh w-full bg-neo-yellow flex flex-col border-b-8 border-neo-black pb-12">
				<div className="w-full">
					<Header />
				</div>
				<div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6">
					<LandingHero />
				</div>
			</section>

			{/* Section 2: Learn Anytime (Peach) */}
			<section className="min-h-dvh w-full bg-neo-peach flex flex-col items-center justify-center border-b-8 border-neo-black py-20 px-6 text-center">
				<h2 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-neo-black max-w-4xl leading-[1.1] mb-8 animate-pop-in">
					Learn Anytime,<br className="hidden sm:block" /> Anywhere
				</h2>
				<p className="text-xl sm:text-2xl font-bold text-neo-black/80 max-w-2xl mb-16 animate-pop-in-delay-1">
					Make language learning part of your routine.
				</p>

				{/* Abstract Star shape placeholder */}
				<div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-16 animate-pop-in-delay-2">
					<div className="w-64 h-64 bg-neo-orange rounded-[30%] border-[6px] border-neo-black shadow-[12px_12px_0px_#1a1510] flex items-center justify-center relative hover:rounded-[50%] transition-all duration-500 z-10">
						<div className="flex gap-6 mt-4">
							<div className="w-4 h-6 bg-neo-black rounded-full"></div>
							<div className="w-4 h-6 bg-neo-black rounded-full"></div>
						</div>
						<div className="absolute bottom-16 w-8 h-4 border-b-4 border-neo-black rounded-b-full"></div>
					</div>
					{/* Stand */}
					<div className="absolute bottom-8 w-48 h-8 border-[6px] border-neo-black rounded-full text-transparent flex flex-col items-center bg-white z-0">
						<div className="w-6 h-24 bg-white border-x-[6px] border-neo-black -mt-[88px] z-0"></div>
					</div>
				</div>

				<div className="w-full max-w-sm mx-auto">
					<CallToActionButton />
				</div>
			</section>

			{/* Section 3: Lessons that Suit You (Orange) */}
			<section className="min-h-dvh w-full bg-neo-orange flex flex-col items-center justify-center py-20 px-6 text-center">
				<h2 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl text-neo-black max-w-4xl leading-[1.1] mb-8">
					Lessons that<br className="hidden sm:block" /> Suit You
				</h2>
				<p className="text-xl sm:text-2xl font-bold text-neo-black/80 max-w-2xl mb-16">
					A variety of techniques to learn effectively.
				</p>

				{/* Ghost/Book illustration placeholder */}
				<div className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center mb-16">
					<div className="w-56 h-auto bg-white border-[6px] border-neo-black shadow-[12px_12px_0px_#1a1510] relative rounded-t-full flex flex-col items-center pt-16 pb-12 z-0">
						{/* Eyes */}
						<div className="flex gap-8 mb-8">
							<div className="w-5 h-8 bg-neo-black rounded-full"></div>
							<div className="w-5 h-8 bg-neo-black rounded-full"></div>
						</div>
						{/* Book */}
						<div className="w-40 h-48 bg-[#2d2112] border-[6px] border-neo-black flex items-center justify-center absolute -bottom-10 shadow-[8px_8px_0px_#1a1510] text-neo-peach text-4xl z-20">
							♥
						</div>
						{/* Skirt */}
						<div className="absolute -bottom-10 w-full flex justify-between px-2 z-10">
							<div className="w-10 h-14 bg-white border-[6px] border-neo-black rounded-b-[2rem]"></div>
							<div className="w-10 h-14 bg-white border-[6px] border-neo-black rounded-b-[2rem]"></div>
							<div className="w-10 h-14 bg-white border-[6px] border-neo-black rounded-b-[2rem]"></div>
							<div className="w-10 h-14 bg-white border-[6px] border-neo-black rounded-b-[2rem]"></div>
						</div>
					</div>
				</div>

				<div className="w-full max-w-sm mx-auto mb-20">
					<CallToActionButton />
				</div>

				<footer className="w-full max-w-5xl mx-auto mt-auto flex flex-col sm:flex-row items-center justify-between border-t-[6px] border-neo-black pt-8 pb-4 font-bold text-neo-black gap-6">
					<span className="text-lg">© {new Date().getFullYear()} Druido</span>
					<div className="flex flex-col sm:flex-row items-center gap-6">
						<span className="text-lg">FSRS-based spaced repetition</span>
						<LanguageSwitcher />
					</div>
				</footer>
			</section>
		</div>
	);
}
