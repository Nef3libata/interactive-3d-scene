export interface Sphere {
  id: string;
  position: [number, number, number];
  radius: number;
  color: string;
}

export type ViewPreset = "top" | "front" | "side" | "reset";
