import { check } from "./actions";
import { redirect } from "next/navigation";

export default async function Catcher({ params }: { params: { id: string } }) {
	const id = params.id;

	const data = await check(id);
	redirect(data.originalURL);
}
