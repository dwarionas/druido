'use client';

import ChatItem from "./ChatItem";

export default function ChatList() {
    return (
        <form className="grid w-full items-start gap-6 h-full">
            <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
                <legend className="-ml-1 px-1 text-sm font-medium">
                    Chats
                </legend>

                <div className="flex flex-col gap-y-4">
                    {[...Array(20).keys()].map((_, id) => (
                        <ChatItem id={id} />
                    ))}
                </div>
            </fieldset>
        </form>
    )
}