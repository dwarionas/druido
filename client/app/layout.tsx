import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
	subsets: ["latin", "latin-ext"],
	variable: "--font-dm-sans",
	display: "swap",
	weight: ["400", "500", "700", "800"], // Added weights for bolder typography
});

export const metadata: Metadata = {
	title: "Druido",
	description: "FSRS-based spaced repetition for serious learners. Smart scheduling, powerful deck management, and multi-language support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning className={dmSans.variable}>
			<body className="font-sans antialiased bg-neo-yellow selection:bg-black selection:text-white">
				<ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
					<I18nProvider>
						<AuthProvider>{children}</AuthProvider>
					</I18nProvider>
					<Toaster position="bottom-right" richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
