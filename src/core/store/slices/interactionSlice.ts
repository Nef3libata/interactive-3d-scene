import { type StateCreator } from "zustand";

export type InteractionMode = "idle" | "placing";

export interface InteractionSlice {
  mode: InteractionMode;
  placementColor: string;
  placementRadius: number;
  selectedBallId: string | null;
  setMode: (mode: InteractionMode) => void;
  startPlacing: (color: string, radius: number) => void;
  selectBall: (id: string | null) => void;
}

export const createInteractionSlice: StateCreator<InteractionSlice> = (
  set
) => ({
  mode: "idle",
  placementColor: "#3b82f6",
  placementRadius: 0.4,
  selectedBallId: null,
  setMode: (mode) => set({ mode }),
  startPlacing: (color, radius) =>
    set({ mode: "placing", placementColor: color, placementRadius: radius }),
  selectBall: (id) => set({ selectedBallId: id }),
});
