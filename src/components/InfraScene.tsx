import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CYAN = "#3fd4ff";
const BLUE = "#2f7bff";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const RACK_H = 4.6;
const RACKS: [number, number][] = [
  [-6, -4.5],
  [-2, -4.5],
  [2, -4.5],
  [6, -4.5],
  [-6, 4.5],
  [-2, 4.5],
  [2, 4.5],
  [6, 4.5],
];

function makeCanvasTexture(draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, w = 256, h = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Rack({ x, z, tex }: { x: number; z: number; tex: THREE.Texture }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, RACK_H / 2, 0]}>
        <boxGeometry args={[2.2, RACK_H, 1.6]} />
        <meshStandardMaterial color="#16203a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, RACK_H / 2, 0.81]}>
        <planeGeometry args={[2.05, RACK_H - 0.2]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, RACK_H + 0.05, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.8]} />
        <meshStandardMaterial color="#2a3550" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function cableCurve(x: number, z: number) {
  const start = new THREE.Vector3(x, RACK_H + 0.15, z);
  const end = new THREE.Vector3(0, 5.1, 0);
  const mid = start.clone().lerp(end, 0.5);
  mid.y -= 0.9;
  return new THREE.CatmullRomCurve3([start, mid, end]);
}

function Pulse({ curve, offset, speed }: { curve: THREE.CatmullRomCurve3; offset: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current?.position.copy(curve.getPoint(t));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={CYAN} toneMapped={false} />
    </mesh>
  );
}

function CoolingUnit({ x, z }: { x: number; z: number }) {
  const fan = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (fan.current) fan.current.rotation.z += Math.min(d, 0.05) * 5;
  });
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.7, 1.9, 0.8]} />
        <meshStandardMaterial color="#1a2438" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh ref={fan} position={[0, 1.15, 0.42]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 8, 24]} />
        <meshStandardMaterial color="#3a4660" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.15, 0.43]}>
        <circleGeometry args={[0.14, 12]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
    </group>
  );
}

type Props = { progress: { current: number }; reduced: boolean };

function Scene({ progress, reduced }: Props) {
  const { camera } = useThree();
  const smooth = useRef(reduced ? progress.current : 0);
  const look = useMemo(() => new THREE.Vector3(0, 2, 0), []);
  const ready = useRef(false);

  const rackTex = useMemo(
    () =>
      makeCanvasTexture((c, w, h) => {
        c.fillStyle = "#0d1424";
        c.fillRect(0, 0, w, h);
        const slots = 12;
        for (let i = 0; i < slots; i++) {
          const y = 14 + i * ((h - 28) / slots);
          c.fillStyle = "#18233a";
          c.fillRect(12, y, w - 24, (h - 28) / slots - 6);
          c.fillStyle = i % 3 === 0 ? BLUE : CYAN;
          c.fillRect(w - 34, y + 8, 9, 9);
          c.fillRect(w - 50, y + 8, 9, 9);
        }
      }),
    [],
  );

  const floorTex = useMemo(() => {
    const t = makeCanvasTexture(
      (c, w, h) => {
        c.fillStyle = "#0b1222";
        c.fillRect(0, 0, w, h);
        c.strokeStyle = "#1c2d4d";
        c.lineWidth = 4;
        c.strokeRect(0, 0, w, h);
      },
      128,
      128,
    );
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(24, 18);
    return t;
  }, []);

  const cables = useMemo(() => RACKS.map(([x, z], i) => ({ curve: cableCurve(x, z), offset: i * 0.13 })), []);
  const beams = useMemo(() => {
    const tops: [number, number][] = [
      [-6, -4.5],
      [-2, 4.5],
      [6, -4.5],
      [2, 4.5],
    ];
    return tops.map(([x, z]) => {
      const from = new THREE.Vector3(x, RACK_H + 0.2, z);
      const to = new THREE.Vector3(x * 0.5, 7.6, z * 0.5);
      return new THREE.CatmullRomCurve3([from, from.clone().lerp(to, 0.5), to]);
    });
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    smooth.current = reduced ? progress.current : lerp(smooth.current, progress.current, 1 - Math.exp(-5 * dt));
    const p = smooth.current;

    const angle = -0.9 + p * 1.9;
    const radius = lerp(17, 12.5, seg(p, 0.45, 1));
    const height = lerp(4.5, 8.5, seg(p, 0.25, 0.8));
    camera.position.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    look.set(lerp(0, 1.5, seg(p, 0.6, 1)), 2, 0);
    camera.lookAt(look);

    if (!ready.current) {
      ready.current = true;
      state.gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "true");
    }
  });

  return (
    <>
      <color attach="background" args={["#0a1120"]} />
      <fog attach="fog" args={["#0a1120", 20, 55]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} color="#cfe6ff" />
      <pointLight position={[0, 3, 0]} intensity={18} color={CYAN} distance={16} />
      <Environment resolution={64}>
        <Lightformer intensity={1.6} position={[0, 8, 0]} scale={[14, 14, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={0.9} color="#5ad8ff" position={[-8, 3, 0]} rotation-y={Math.PI / 2} scale={[16, 2, 1]} />
        <Lightformer intensity={0.7} color="#3a6bff" position={[8, 3, 0]} rotation-y={-Math.PI / 2} scale={[16, 2, 1]} />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]}>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial map={floorTex} metalness={0.35} roughness={0.55} />
      </mesh>

      {RACKS.map(([x, z]) => (
        <Rack key={`${x}_${z}`} x={x} z={z} tex={rackTex} />
      ))}

      {/* core network switch */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2.6, 0]}>
          <boxGeometry args={[0.5, 5.2, 0.5]} />
          <meshStandardMaterial color="#1a2438" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 5.3, 0]}>
          <boxGeometry args={[1.4, 0.35, 1]} />
          <meshStandardMaterial color="#141c2e" metalness={0.6} roughness={0.4} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.5 + i * 0.14, 5.3, 0.51]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshBasicMaterial color={i % 2 ? CYAN : BLUE} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {cables.map(({ curve, offset }, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[curve, 24, 0.035, 6, false]} />
            <meshStandardMaterial color="#243453" metalness={0.5} roughness={0.5} />
          </mesh>
          {!reduced && <Pulse curve={curve} offset={offset} speed={0.25} />}
        </group>
      ))}

      {[-5, 0, 5].map((x) => (
        <CoolingUnit key={x} x={x} z={-9.5} />
      ))}

      {/* security camera */}
      <group position={[10, 0, 8.5]}>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 2.2, 8]} />
          <meshStandardMaterial color="#5b6b85" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.25, 0]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.28, 0.16, 0.4]} />
          <meshStandardMaterial color="#141c2e" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.05, 0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff5a6e" toneMapped={false} />
        </mesh>
      </group>

      {/* cloud connectivity */}
      <group position={[0, 8.2, 0]}>
        {[
          [-0.6, 0.1, 0, 0.75],
          [0.1, 0.45, 0, 0.95],
          [0.9, 0.05, 0.1, 0.7],
          [0.15, -0.05, 0.35, 0.6],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 16, 12]} />
            <meshStandardMaterial color="#bcd6ff" roughness={0.45} metalness={0.1} emissive={BLUE} emissiveIntensity={0.1} />
          </mesh>
        ))}
      </group>
      {beams.map((curve, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[curve, 20, 0.02, 6, false]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.25} toneMapped={false} />
          </mesh>
          {!reduced && <Pulse curve={curve} offset={0.2 + i * 0.25} speed={0.18} />}
        </group>
      ))}
    </>
  );
}

export default function InfraScene({ progress, reduced }: Props) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      camera={{ fov: mobile ? 55 : 44, position: [0, 5, 17], near: 0.1, far: 90 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene progress={progress} reduced={reduced} />
    </Canvas>
  );
}
