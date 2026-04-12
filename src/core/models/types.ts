export interface Sphere {
  id: string;
  position: [number, number, number];
  radius: number;
  color: string;
  visible: boolean;
}

export type ViewPreset = "top" | "front" | "side" | "reset";
