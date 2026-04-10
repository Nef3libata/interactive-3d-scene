import { create } from "zustand";
import { type SphereSlice, createSphereSlice } from "./slices/sphereSlice";
import { type SceneSlice, createSceneSlice } from "./slices/sceneSlice";

type StoreState = SphereSlice & SceneSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createSphereSlice(...args),
  ...createSceneSlice(...args),
}));
