import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
    selectedChat: number | undefined;
}

interface Actions {
    setSelectedChat: (id: number) => void;
}

const useChatStore = create<State & Actions>()(devtools(immer((set) => ({
    selectedChat: undefined,

    setSelectedChat: (id) => set({selectedChat: id})
}))));

export default useChatStore;