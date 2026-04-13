import { type StateCreator } from "zustand";

export type InteractionMode = "idle" | "placing";

export interface InteractionSlice {
  mode: InteractionMode;
  placementColor: string;
  placementRadius: number;
  setMode: (mode: InteractionMode) => void;
  startPlacing: (color: string, radius: number) => void;
}

export const createInteractionSlice: StateCreator<InteractionSlice> = (
  set
) => ({
  mode: "idle",
  placementColor: "#3b82f6",
  placementRadius: 0.4,
  setMode: (mode) => set({ mode }),
  startPlacing: (color, radius) =>
    set({ mode: "placing", placementColor: color, placementRadius: radius }),
});
