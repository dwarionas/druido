import { UrlModel } from "@/types/service";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
    links: UrlModel[];
}

interface Actions {
    setLinks: (array: UrlModel[]) => void;
    pushLink: (entity: UrlModel) => void;
}

const useLinksStore = create<State & Actions>()(devtools(immer((set) => ({
    links: [],

    setLinks: (array) => set({links: array}),
    pushLink: (link) => set((state) => ({ links: [link, ...state.links] }))
}))));

export default useLinksStore;