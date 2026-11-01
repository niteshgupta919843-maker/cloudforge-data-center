import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type VisualKind =
  | "server"
  | "cloud"
  | "hosting"
  | "storage"
  | "backup"
  | "support"
  | "network"
  | "security"
  | "globe"
  | "cooling";

const CYAN = "#3fd4ff";
const BLUE = "#2f7bff";
const DARK = "#1a2438";
const CHASSIS = "#2a3550";
const METAL = "#8fa3b8";

/* shared behaviours */
function Rig({ children, spin = 0.3 }: { children: ReactNode; spin?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, d) => {
    if (!g.current) return;
    g.current.rotation.y += Math.min(d, 0.05) * spin;
    g.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.06;
  });
  return <group ref={g}>{children}</group>;
}

function Led({ position, speed = 2.2, offset = 0, color = CYAN }: { position: [number, number, number]; speed?: number; offset?: number; color?: string }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * speed + offset) * 0.7;
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.09, 0.09, 0.02]} />
      <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  );
}

function Cable({ a, b }: { a: [number, number, number]; b: [number, number, number] }) {
  const { mid, len, quat } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const l = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { mid: va.clone().add(vb).multiplyScalar(0.5), len: l, quat: q };
  }, []);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.012, 0.012, len, 6]} />
      <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} transparent opacity={0.45} />
    </mesh>
  );
}

function ServerUnit({ w = 1.5, h = 0.34, leds = 2 }: { w?: number; h?: number; leds?: number }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[w, h, 1]} />
        <meshStandardMaterial color={CHASSIS} metalness={0.7} roughness={0.3} />
      </mesh>
      {Array.from({ length: leds }).map((_, i) => (
        <Led key={i} position={[-w / 2 + 0.16 + i * 0.14, 0, 0.51]} offset={i * 1.3} />
      ))}
      <mesh position={[w / 3, 0, 0.51]}>
        <boxGeometry args={[w * 0.45, h * 0.6, 0.02]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* kind scenes */
function ServerScene() {
  return (
    <group>
      <group position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
        <ServerUnit w={1.7} h={0.42} leds={3} />
      </group>
      <mesh position={[-0.3, 0.32, 0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.34, 0.05, 0.34]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[-0.3, 0.355, 0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.012, 0.2]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function CloudScene() {
  const puffs: [number, number, number, number][] = [
    [-0.38, 0.28, 0, 0.3],
    [0, 0.4, 0, 0.4],
    [0.4, 0.26, 0, 0.3],
    [0.02, 0.16, 0.16, 0.28],
  ];
  return (
    <group>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 20, 16]} />
          <meshStandardMaterial color="#9fc4ff" roughness={0.4} metalness={0.1} emissive={BLUE} emissiveIntensity={0.08} />
        </mesh>
      ))}
      <group position={[0, -0.62, 0]}>
        <ServerUnit w={0.9} h={0.24} leds={1} />
      </group>
      <Cable a={[0, 0.05, 0]} b={[0, -0.42, 0]} />
    </group>
  );
}

function HostingScene() {
  return (
    <group>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.06, 1.5, 1.05]} />
          <meshStandardMaterial color="#5b6b85" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      {[0.5, 0.02, -0.46].map((y, i) => (
        <group key={y} position={[0, y, 0]}>
          <ServerUnit w={1.5} h={0.3} leds={i === 1 ? 3 : 2} />
        </group>
      ))}
      <group position={[0, 0.86, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.14, 1]} />
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.4} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <Led key={i} position={[-0.55 + i * 0.22, 0, 0.51]} speed={3} offset={i} />
        ))}
      </group>
    </group>
  );
}

function StorageScene() {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (spin.current) spin.current.rotation.y += Math.min(d, 0.05) * 0.8;
  });
  return (
    <group>
      {[0.32, 0.02, -0.28].map((y, i) => (
        <group key={y} position={[0, y, 0]} ref={i === 2 ? spin : undefined}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.55, 0.55, 0.14, 28]} />
            <meshStandardMaterial color={i === 1 ? CHASSIS : "#3a4660"} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.075, 0]}>
            <torusGeometry args={[0.18, 0.03, 8, 24]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={i === 2 ? 0.9 : 0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.1, 0.08, 1.1]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.5} />
      </mesh>
      <Led position={[0.62, -0.4, 0.4]} speed={2.6} />
    </group>
  );
}

function BackupScene() {
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (orbit.current) orbit.current.rotation.z += Math.min(d, 0.05) * 1.1;
  });
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.72, 0.05, 10, 40]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.45} />
      </mesh>
      <group ref={orbit}>
        <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.1, 0.22, 12]} />
          <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.8} />
        </mesh>
      </group>
      <group position={[0, 0.06, 0]}>
        <mesh>
          <boxGeometry args={[0.62, 0.4, 0.14]} />
          <meshStandardMaterial color={CHASSIS} metalness={0.7} roughness={0.3} />
        </mesh>
        <Led position={[-0.2, 0, 0.08]} speed={2} />
      </group>
    </group>
  );
}

function SupportScene() {
  return (
    <group position={[0, 0.05, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.52, 0.05, 10, 32, Math.PI]} />
        <meshStandardMaterial color={CHASSIS} metalness={0.7} roughness={0.35} />
      </mesh>
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.17, 0.14, 20]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.42, -0.38, 0.12]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.24, -0.52, 0.18]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

function NetworkScene() {
  const nodes: [number, number, number][] = [
    [1, 0.42, 0.2],
    [0.85, -0.5, -0.3],
    [0, 0.85, -0.2],
    [0, -0.85, 0.25],
    [-0.95, 0.45, -0.15],
    [-0.9, -0.5, 0.2],
  ];
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.95, 0.22, 0.65]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.4} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <Led key={i} position={[-0.32 + i * 0.13, 0, 0.33]} speed={2.4 + i * 0.2} offset={i * 0.7} />
      ))}
      {nodes.map((n, i) => (
        <group key={i}>
          <Cable a={[0, 0, 0]} b={n} />
          <mesh position={n}>
            <sphereGeometry args={[0.1, 14, 12]} />
            <meshStandardMaterial color={i % 2 ? BLUE : CYAN} emissive={i % 2 ? BLUE : CYAN} emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SecurityScene() {
  return (
    <group>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.62, 0.52, 0.26]} />
        <meshStandardMaterial color={CHASSIS} metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.06, 10, 28, Math.PI]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.24, 0.14]}>
        <boxGeometry args={[0.1, 0.16, 0.03]} />
        <meshStandardMaterial color={DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.3, 0.145]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.8} />
      </mesh>
      <Led position={[0.22, -0.42, 0.14]} speed={1.6} color={BLUE} />
    </group>
  );
}

function GlobeScene() {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    const dt = Math.min(d, 0.05);
    if (ringA.current) ringA.current.rotation.z += dt * 0.5;
    if (ringB.current) ringB.current.rotation.x += dt * 0.4;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.68, 24, 18]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} emissive={BLUE} emissiveIntensity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.18} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.95, 0.02, 8, 48]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ringB} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.12, 0.02, 8, 48]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function CoolingScene() {
  const fan = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (fan.current) fan.current.rotation.z += Math.min(d, 0.05) * 4;
  });
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.68, 0.06, 10, 36]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
      </mesh>
      <group ref={fan}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, a]} position={[Math.cos(a) * 0.34, Math.sin(a) * 0.34, 0]}>
              <boxGeometry args={[0.5, 0.14, 0.04]} />
              <meshStandardMaterial color={CHASSIS} metalness={0.6} roughness={0.35} />
            </mesh>
          );
        })}
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.8} />
        </mesh>
      </group>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.02]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        );
      })}
    </group>
  );
}

function KindScene({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "server":
      return <ServerScene />;
    case "cloud":
      return <CloudScene />;
    case "hosting":
      return <HostingScene />;
    case "storage":
      return <StorageScene />;
    case "backup":
      return <BackupScene />;
    case "support":
      return <SupportScene />;
    case "network":
      return <NetworkScene />;
    case "security":
      return <SecurityScene />;
    case "globe":
      return <GlobeScene />;
    case "cooling":
      return <CoolingScene />;
  }
}

export default function VisualScene({ kind, paused }: { kind: VisualKind; paused: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [1.7, 1.15, 2.3], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#cfe6ff" />
      <pointLight position={[-2, -1, 2]} intensity={4} color={CYAN} distance={8} />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} position={[0, 4, 0]} scale={[8, 8, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={0.8} color="#5ad8ff" position={[-4, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 1, 1]} />
      </Environment>
      <Rig spin={0.28}>
        <KindScene kind={kind} />
      </Rig>
    </Canvas>
  );
}
