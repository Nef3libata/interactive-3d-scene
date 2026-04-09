import { Vector3 } from "three";

export interface Sphere {
  id: string;
  position: Vector3;
  radius: number;
  color: string;
  name: string;
}

export interface SphereFormData {
  radius: number;
  color: string;
}

export type ViewPreset = "top" | "front" | "side" | "reset";