import { type StateCreator } from "zustand";
import { type Sphere } from "../../models/types";

export interface SphereSlice {
  spheres: Sphere[];
  addSphere: (sphere: Sphere) => void;
  removeSphere: (id: string) => void;
  clearAllSpheres: () => void;
}

export const createSphereSlice: StateCreator<SphereSlice> = (set) => ({
  spheres: [],
  addSphere: (sphere) =>
    set((state) => ({
      spheres: [...state.spheres, sphere],
    })),
  removeSphere: (id) =>
    set((state) => ({
      spheres: state.spheres.filter((s) => s.id !== id),
    })),
  clearAllSpheres: () => set({ spheres: [] }),
});
