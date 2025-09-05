import { StateCreator } from "zustand"

export type StartggSlice = {
    apiKey: string,
    updateKey: (newApiKey: string) => void
}
export const createStartggSlice: StateCreator<StartggSlice, [['zustand/immer', never]], [], StartggSlice> = (set) => ({
    apiKey: "",
    updateKey: (newApiKey) => set((state) => {
        state.apiKey = newApiKey
        
    })
})