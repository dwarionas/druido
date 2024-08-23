"use server";

import Header from "@/components/dashboard/Header";
import Links from "@/components/dashboard/Links";
import LinksControls from "@/components/dashboard/LinksControls";

import { getUser } from "./actions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Dashboard() {
	const { urls } = await getUser();

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Header />

			<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<LinksControls urls={urls} />
					<Links />
				</Tabs>
			</main>
		</div>
	);
}
