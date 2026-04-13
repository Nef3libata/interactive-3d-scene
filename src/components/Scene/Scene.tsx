import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { type OrbitControls as OrbitControlsType } from "three-stdlib";
import { useStore } from "@core/store/useStore";
import { type Sphere } from "@core/models/types";
import {
  AxesIndicator,
  cameraQuaternionRef,
} from "@components/AxesIndicator/AxesIndicator";
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

const SceneSphere = ({ position, radius, color }: Sphere) => (
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

const SNAP_THRESHOLD = 0.08;

const CameraController = ({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsType | null>;
}) => {
  useFrame(({ camera }, delta) => {
    cameraQuaternionRef.current.copy(camera.quaternion);

    const { cameraTarget, orbitTarget, setCameraTarget, setOrbitTarget } =
      useStore.getState();

    if (!cameraTarget && !orbitTarget) return;

    const controls = controlsRef.current;
    if (controls) controls.enableDamping = false;

    const alpha = Math.min(LERP_SPEED * delta, 1);

    if (cameraTarget) camera.position.lerp(cameraTarget, alpha);
    if (orbitTarget && controls) controls.target.lerp(orbitTarget, alpha);

    controls?.update();

    const camDone =
      !cameraTarget ||
      camera.position.distanceTo(cameraTarget) < SNAP_THRESHOLD;
    const orbitDone =
      !orbitTarget ||
      !controls ||
      controls.target.distanceTo(orbitTarget) < SNAP_THRESHOLD;

    if (camDone && orbitDone) {
      if (cameraTarget) camera.position.copy(cameraTarget);
      if (orbitTarget && controls) controls.target.copy(orbitTarget);
      setCameraTarget(null);
      setOrbitTarget(null);
      if (controls) controls.enableDamping = true;
      controls?.update();
    }
  });

  return null;
};

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const raycastToSurface = (
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  camera: THREE.Camera,
  scene: THREE.Scene
): THREE.Vector3 | null => {
  raycaster.setFromCamera(mouse, camera);

  const meshes = scene.children.filter(
    (c) => c instanceof THREE.Mesh || c instanceof THREE.Group
  );
  const hits = raycaster.intersectObjects(meshes, true);

  if (hits.length > 0) return hits[0].point;

  const groundHit = new THREE.Vector3();
  return raycaster.ray.intersectPlane(GROUND_PLANE, groundHit)
    ? groundHit
    : null;
};

const PlacementHandler = () => {
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const { mode, placementColor, placementRadius, addSphere, setMode } =
        useStore.getState();
      if (mode !== "placing") return;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const point = raycastToSurface(raycaster, mouse, camera, scene);
      if (!point) return;

      const position: [number, number, number] = [
        point.x,
        Math.max(placementRadius, point.y + placementRadius),
        point.z,
      ];

      addSphere({
        id: Date.now().toString(),
        position,
        color: placementColor,
        radius: placementRadius,
      });
      setMode("idle");
    },
    [camera, gl, scene, raycaster]
  );

  useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl, handleClick]);

  return null;
};

const PlacementPreview = () => {
  const mode = useStore((state) => state.mode);
  const color = useStore((state) => state.placementColor);
  const radius = useStore((state) => state.placementRadius);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, scene, pointer } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const point = raycastToSurface(raycaster, pointer, camera, scene);
    if (point) {
      meshRef.current.position.set(
        point.x,
        Math.max(radius, point.y + radius),
        point.z
      );
      meshRef.current.visible = true;
    } else {
      meshRef.current.visible = false;
    }
  });

  if (mode !== "placing") return null;

  return (
    <mesh ref={meshRef} visible={false} raycast={() => {}}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
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

        <PlacementPreview />
        <PlacementHandler />
        <CameraController controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.12}
          enablePan
          panSpeed={1.2}
          zoomSpeed={1.4}
          rotateSpeed={0.8}
          target={[0, 0.8, 0]}
          minDistance={1}
          maxDistance={40}
        />
      </Canvas>
      <AxesIndicator />
    </div>
  );
};
