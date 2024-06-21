'use client'

import useChatStore from "@/lib/store";

export default function ChatMessages() {
    const chat = useChatStore(state => state);
    
    return (
        <div className="flex-1">
            {chat.selectedChat}
        </div>
    )
}