import { type StateCreator } from "zustand";

export type InteractionMode = "idle" | "placing";

export interface InteractionSlice {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
}

export const createInteractionSlice: StateCreator<InteractionSlice> = (
  set
) => ({
  mode: "idle",
  setMode: (mode) => set({ mode }),
});
