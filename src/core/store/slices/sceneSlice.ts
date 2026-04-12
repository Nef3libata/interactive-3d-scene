import { type StateCreator } from "zustand";
import { Vector3 } from "three";
import { type ViewPreset } from "../../models/types";

const DEFAULT_CAMERA = new Vector3(7, 5.5, 9);

const VIEW_PRESET_POSITIONS: Record<ViewPreset, Vector3> = {
  top: new Vector3(0, 12, 0.01),
  front: new Vector3(0, 2, 12),
  side: new Vector3(12, 2, 0),
  reset: DEFAULT_CAMERA,
};

export interface SceneSlice {
  cameraTarget: Vector3 | null;
  setCameraTarget: (target: Vector3 | null) => void;
  applyViewPreset: (preset: ViewPreset) => void;
}

export const createSceneSlice: StateCreator<SceneSlice> = (set) => ({
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  applyViewPreset: (preset) =>
    set({ cameraTarget: VIEW_PRESET_POSITIONS[preset].clone() }),
});
