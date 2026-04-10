import { type StateCreator } from "zustand";
import { Vector3 } from "three";

export interface SceneSlice {
  modelName: string;
  cameraPosition: Vector3;
  setModelName: (name: string) => void;
  setCameraPosition: (position: Vector3) => void;
}

export const createSceneSlice: StateCreator<SceneSlice> = (set) => ({
  modelName: "STL Layout",
  cameraPosition: new Vector3(5, 5, 5),
  setModelName: (name) => set({ modelName: name }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
});
