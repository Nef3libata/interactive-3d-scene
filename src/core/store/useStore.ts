import { create } from "zustand";
import { type SphereSlice, createSphereSlice } from "./slices/sphereSlice";
import { type SceneSlice, createSceneSlice } from "./slices/sceneSlice";
import {
  type InteractionSlice,
  createInteractionSlice,
} from "./slices/interactionSlice";

type StoreState = SphereSlice & SceneSlice & InteractionSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createSphereSlice(...args),
  ...createSceneSlice(...args),
  ...createInteractionSlice(...args),
}));
