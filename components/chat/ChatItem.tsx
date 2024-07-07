'use client'

import { Skeleton } from "@/components/ui/skeleton"
import useChatStore from "@/lib/zustand/store";

const ChatItem = ({ id }: { id: number }) => {
    const chat = useChatStore(state => state);
    
    return (
        <div onClick={() => chat.setSelectedChat(id)} className="flex space-x-4  hover:bg-muted/100 rounded border-b-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />{id}
                <Skeleton className="h-4 w-[300px]" />
            </div>
        </div>
    )
}

export default ChatItem