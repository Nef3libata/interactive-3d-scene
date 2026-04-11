import { useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MeshStandardMaterial } from "three";
import "./Scene.scss";

const STL_PATH = "/3D_Model.stl";

const StlModel = () => {
  const geometry = useLoader(STLLoader, STL_PATH);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#6b7280",
        metalness: 0.3,
        roughness: 0.6,
      }),
    []
  );

  const centeredGeometry = useMemo(() => {
    geometry.computeBoundingBox();
    geometry.center();
    return geometry;
  }, [geometry]);

  return <mesh geometry={centeredGeometry} material={material} />;
};

export const Scene = () => {
  return (
    <div className="scene">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        <StlModel />

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellColor="#1a1a2e"
          sectionSize={5}
          sectionColor="#262640"
          fadeDistance={30}
          infiniteGrid
        />

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};
