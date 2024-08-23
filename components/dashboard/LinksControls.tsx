"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { create } from "@/app/[id]/actions";

import { ListFilter, PlusCircle, File } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useLinksStore from "@/lib/zustand/store";
import { UrlModel } from "@/types/service";

export default function LinksControls({ urls }: { urls: UrlModel[] }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const store = useLinksStore((state) => state);

	React.useEffect(() => {
		store.setLinks(urls);
	}, []);

	const handleShorten = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const newLink = await create(formData);
		store.pushLink(newLink);
		setIsOpen(false);
	};

	return (
		<div className="flex items-center">
			<TabsList>
				<TabsTrigger value="all">All</TabsTrigger>
				<TabsTrigger value="active">Active</TabsTrigger>
				<TabsTrigger value="draft">Draft</TabsTrigger>
				<TabsTrigger value="archived" className="hidden sm:flex">
					Archived
				</TabsTrigger>
			</TabsList>

			<div className="ml-auto flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							onClick={() => setIsOpen(true)}
							variant="outline"
							size="sm"
							className="h-7 gap-1"
						>
							<ListFilter className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Filter
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Filter by</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem checked>
							Active
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem>
							Draft
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem>
							Archived
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button size="sm" variant="outline" className="h-7 gap-1">
					<File className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Export
					</span>
				</Button>

				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button size="sm" className="h-7 gap-1">
							<PlusCircle className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Add Product
							</span>
						</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create new short link</DialogTitle>
							<DialogDescription>
								This action a description
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleShorten}>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Name"
							/>
							<Input
								id="link"
								name="link"
								type="text"
								placeholder="Link"
							/>
							<Button type="submit">Shorten</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
