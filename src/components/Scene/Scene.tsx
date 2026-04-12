import { useRef, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { type OrbitControls as OrbitControlsType } from "three-stdlib";
import { useStore } from "@core/store/useStore";
import { type Sphere } from "@core/models/types";
import "./Scene.scss";

const STL_PATH = "/3D_Model.stl";
const STL_SCALE = 0.2;
const BG_COLOR = "#0B1120";

const StlModel = () => {
  const geometry = useLoader(STLLoader, STL_PATH);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8899AA",
        metalness: 0.12,
        roughness: 0.28,
      }),
    []
  );

  const { centeredGeometry, yOffset } = useMemo(() => {
    geometry.computeBoundingBox();
    geometry.center();
    const height = geometry.boundingBox!.max.y - geometry.boundingBox!.min.y;
    return { centeredGeometry: geometry, yOffset: (height / 2) * STL_SCALE };
  }, [geometry]);

  return (
    <mesh
      geometry={centeredGeometry}
      material={material}
      scale={STL_SCALE}
      position={[0, yOffset, 0]}
      castShadow
      receiveShadow
    />
  );
};

const SceneSphere = ({ position, radius, color, visible }: Sphere) => {
  if (!visible) return null;

  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshStandardMaterial
        color={color}
        metalness={0.15}
        roughness={0.28}
        envMapIntensity={1.2}
      />
    </mesh>
  );
};

const Spheres = () => {
  const spheres = useStore((state) => state.spheres);

  return (
    <>
      {spheres.map((sphere) => (
        <SceneSphere key={sphere.id} {...sphere} />
      ))}
    </>
  );
};

const FloorGrid = () => (
  <gridHelper
    args={[30, 60, 0x1e2d45, 0x162035]}
    material-opacity={0.7}
    material-transparent={true}
  />
);

const ShadowPlane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
    <planeGeometry args={[30, 30]} />
    <shadowMaterial opacity={0.35} color="#000000" />
  </mesh>
);

const LERP_SPEED = 4;

const CameraController = ({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsType | null>;
}) => {
  const cameraTarget = useStore((state) => state.cameraTarget);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  useFrame(({ camera }, delta) => {
    if (cameraTarget) {
      camera.position.lerp(cameraTarget, LERP_SPEED * delta);

      if (camera.position.distanceTo(cameraTarget) < 0.05) {
        camera.position.copy(cameraTarget);
        setCameraTarget(null);
      }

      controlsRef.current?.update();
    }
  });

  return null;
};

export const Scene = () => {
  const controlsRef = useRef<OrbitControlsType | null>(null);

  return (
    <div className="scene">
      <Canvas
        camera={{ position: [7, 5.5, 9], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
      >
        <color attach="background" args={[BG_COLOR]} />
        <fogExp2 attach="fog" args={[BG_COLOR, 0.032]} />

        <ambientLight color={0x8899cc} intensity={0.45} />

        <directionalLight
          color={0xfff5ee}
          position={[8, 14, 7]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />
        <directionalLight
          color={0x4477cc}
          position={[-7, 3, -5]}
          intensity={0.55}
        />

        <directionalLight
          color={0xffddcc}
          position={[1, -2, 9]}
          intensity={0.35}
        />

        <pointLight
          color={0x2244aa}
          position={[0, -1, 0]}
          intensity={0.6}
          distance={12}
        />

        <StlModel />
        <Spheres />
        <FloorGrid />
        <ShadowPlane />

        <CameraController controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.07}
          target={[0, 0.8, 0]}
          minDistance={2}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
};
