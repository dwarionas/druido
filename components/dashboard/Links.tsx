"use client";

import React from "react";
import { UrlModel, UserModel } from "@/types/service";
import Link from "next/link";
import Image from "next/image";
import { create } from "@/app/[id]/actions";
import useLinksStore from "@/lib/zustand/store";

import {
	File,
	Home,
	LineChart,
	ListFilter,
	MoreHorizontal,
	Package,
	Package2,
	PanelLeft,
	PlusCircle,
	Search,
	Settings,
	ShoppingCart,
	Users2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LinksControls from "./LinksControls";

export default function Links() {
	const store = useLinksStore((state) => state);

	return (
		<TabsContent value="all">
			<Card x-chunk="dashboard-06-chunk-0">
				<CardHeader>
					<CardTitle>Products</CardTitle>
					<CardDescription>
						Manage your products and view their sales performance.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Income</TableHead>
								<TableHead className="hidden md:table-cell">
									Total Sales
								</TableHead>
								<TableHead className="hidden md:table-cell">
									Created at
								</TableHead>
								<TableHead>
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{store.links.map((el) => (
								<TableRow key={el.id}>
									<TableCell className="font-medium">
										{el.name}
									</TableCell>
									<TableCell>
										<Badge variant="outline">Active</Badge>
									</TableCell>
									<TableCell>$499.99</TableCell>
									<TableCell className="hidden md:table-cell">
										25
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{new Date(el.createdAt).toLocaleString(
											"uk-UA"
										)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													aria-haspopup="true"
													size="icon"
													variant="ghost"
												>
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">
														Toggle menu
													</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuItem>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>

				<CardFooter>
					<div className="text-xs text-muted-foreground">
						Showing <strong>1-10</strong> of <strong>32</strong>{" "}
						products
					</div>
				</CardFooter>
			</Card>
		</TabsContent>
	);
}
