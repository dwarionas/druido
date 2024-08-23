import Aside from "@/components/layout/Aside";
import Header from "@/components/layout/Header";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid h-screen w-full pl-[53px]">
			<Aside />

			{/* <div className="flex flex-col h-dvh"> */}
			<Header />

			{children}
			{/* </div> */}
		</div>
	);
}
