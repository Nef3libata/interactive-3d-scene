import { type StateCreator } from "zustand";
import { type Sphere } from "../../models/types";

export interface SphereSlice {
  spheres: Sphere[];
  selectedSphereId: string | null;
  addSphere: (sphere: Sphere) => void;
  removeSphere: (id: string) => void;
  clearAllSpheres: () => void;
  setSelectedSphereId: (id: string | null) => void;
}

export const createSphereSlice: StateCreator<SphereSlice> = (set) => ({
  spheres: [],
  selectedSphereId: null,
  addSphere: (sphere) =>
    set((state) => ({
      spheres: [...state.spheres, sphere],
    })),
  removeSphere: (id) =>
    set((state) => ({
      spheres: state.spheres.filter((s) => s.id !== id),
    })),
  clearAllSpheres: () => set({ spheres: [], selectedSphereId: null }),
  setSelectedSphereId: (id) => set({ selectedSphereId: id }),
});
