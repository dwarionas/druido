
import { ScrollArea } from "@/components/ui/scroll-area"

import ChatList from "@/components/chat/ChatList"
import ChatMessages from "@/components/chat/ChatMessages"
import ChatInput from "@/components/chat/ChatInput"

export default function Chat() {
    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <ScrollArea
                className="relative max-h-screen hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
                <ChatList />
            </ScrollArea>

            <div className="relative flex h-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                <ChatMessages />

                <ChatInput />
            </div>
        </main>
    )
}