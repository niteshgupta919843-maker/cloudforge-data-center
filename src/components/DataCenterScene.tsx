import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/* ---------- pure helpers ---------- */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const COLORS = {
  board: "#123a4a",
  metal: "#8fa3b8",
  dark: "#1a2438",
  chassis: "#2a3550",
  cyan: "#3fd4ff",
  blue: "#2f7bff",
};

const SLOT = 0.55;
const RACK_SLOTS = 8;
const RACK_BOTTOM = -3 * SLOT - 0.3;

function makeCanvasTexture(draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 256) {
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

/* ---------- component parts ---------- */
type Part = {
  key: string;
  from: [number, number, number];
  rot: [number, number, number];
  to: [number, number, number];
  window: [number, number];
};

const PARTS: Part[] = [
  { key: "board", from: [0, -1.4, 0.4], rot: [0.5, 0.3, 0.1], to: [0, -0.17, 0], window: [0.02, 0.14] },
  { key: "cpu", from: [-2.6, 1.3, 0.3], rot: [0.9, 0.6, 0.2], to: [-0.55, -0.11, 0.1], window: [0.06, 0.18] },
  { key: "ram", from: [-2.2, -0.7, 1.2], rot: [0.2, 1.1, 0.7], to: [0.05, -0.02, 0.1], window: [0.08, 0.2] },
  { key: "ssd", from: [2.4, 1.4, 0.6], rot: [1.1, 0.2, 0.5], to: [0.75, -0.12, 0.55], window: [0.1, 0.22] },
  { key: "fan", from: [-0.4, 1.8, -0.6], rot: [1.2, 0.4, 0.3], to: [-0.55, 0.02, -0.55], window: [0.12, 0.24] },
  { key: "psu", from: [2.6, -0.9, 0.2], rot: [0.4, 0.9, 0.3], to: [1.0, -0.03, -0.45], window: [0.14, 0.26] },
  { key: "switch", from: [0.9, 2.1, 1.0], rot: [0.6, 0.5, 0.4], to: [0, RACK_BOTTOM + (RACK_SLOTS - 0.5) * SLOT + 0.05, 0], window: [0.36, 0.5] },
];

function PartMesh({ k }: { k: string }) {
  const fanRef = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (fanRef.current) fanRef.current.rotation.y += Math.min(d, 0.05) * 6;
  });
  switch (k) {
    case "board":
      return (
        <group>
          <mesh>
            <boxGeometry args={[2.7, 0.05, 1.75]} />
            <meshStandardMaterial color={COLORS.board} roughness={0.6} metalness={0.2} />
          </mesh>
          {[-0.9, -0.3, 0.3, 0.9].map((x) => (
            <mesh key={x} position={[x, 0.03, 0.75]}>
              <boxGeometry args={[0.3, 0.02, 0.06]} />
              <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );
    case "cpu":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.45, 0.06, 0.45]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[0.28, 0.01, 0.28]} />
            <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={0.6} />
          </mesh>
        </group>
      );
    case "ram":
      return (
        <group>
          {[-0.15, -0.05, 0.05, 0.15].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.05, 0.22, 0.95]} />
              <meshStandardMaterial color={COLORS.dark} metalness={0.5} roughness={0.4} emissive={COLORS.blue} emissiveIntensity={0.15} />
            </mesh>
          ))}
        </group>
      );
    case "ssd":
      return (
        <mesh>
          <boxGeometry args={[0.55, 0.05, 0.36]} />
          <meshStandardMaterial color="#cfd8e3" metalness={0.6} roughness={0.35} />
        </mesh>
      );
    case "fan":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.5, 0.3, 0.5]} />
            <meshStandardMaterial color={COLORS.dark} transparent opacity={0.55} />
          </mesh>
          <group ref={fanRef}>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} rotation={[0.35, (i / 5) * Math.PI * 2, 0]} position={[Math.cos((i / 5) * Math.PI * 2) * 0.1, 0, -Math.sin((i / 5) * Math.PI * 2) * 0.1]}>
                <boxGeometry args={[0.2, 0.015, 0.08]} />
                <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      );
    case "psu":
      return (
        <mesh>
          <boxGeometry args={[0.7, 0.3, 0.6]} />
          <meshStandardMaterial color="#3a4660" metalness={0.7} roughness={0.35} />
        </mesh>
      );
    case "switch":
      return (
        <group>
          <mesh>
            <boxGeometry args={[2.9, 0.4, 1.9]} />
            <meshStandardMaterial color="#141c2e" metalness={0.6} roughness={0.4} />
          </mesh>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[-1.1 + i * 0.2, 0, 0.96]}>
              <boxGeometry args={[0.1, 0.1, 0.02]} />
              <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}

/* ---------- scene ---------- */
type Props = { progress: MutableRefObject<number>; reduced: boolean };

function Scene({ progress, reduced }: Props) {
  const smooth = useRef(reduced ? progress.current : 0);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const lidMat = useRef<THREE.MeshStandardMaterial>(null);
  const lidGroup = useRef<THREE.Group>(null);
  const rackGroup = useRef<THREE.Group>(null);
  const serverRefs = useRef<(THREE.Group | null)[]>([]);
  const roomGroup = useRef<THREE.Group>(null);
  const extraRacks = useRef<(THREE.Group | null)[]>([]);
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  const frontTex = useMemo(
    () =>
      makeCanvasTexture((c, w, h) => {
        c.fillStyle = "#121a2b";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#1e2a44";
        for (let x = 20; x < w * 0.62; x += 14) c.fillRect(x, 30, 8, h - 60);
        c.fillStyle = "#3fd4ff";
        c.fillRect(w * 0.7, h / 2 - 10, 20, 20);
        c.fillStyle = "#2f7bff";
        c.fillRect(w * 0.78, h / 2 - 10, 20, 20);
        c.fillStyle = "#9fb3c8";
        c.font = "bold 46px sans-serif";
        c.fillText("H2C", w * 0.84, h / 2 + 16);
      }),
    [],
  );
  const rackTex = useMemo(
    () =>
      makeCanvasTexture(
        (c, w, h) => {
          c.fillStyle = "#0d1424";
          c.fillRect(0, 0, w, h);
          for (let i = 0; i < 12; i++) {
            const y = 20 + i * ((h - 40) / 12);
            c.fillStyle = "#18233a";
            c.fillRect(16, y, w - 32, (h - 40) / 12 - 6);
            c.fillStyle = i % 3 === 0 ? "#2f7bff" : "#3fd4ff";
            c.fillRect(w - 50, y + 8, 10, 10);
            c.fillRect(w - 70, y + 8, 10, 10);
          }
        },
        128,
        512,
      ),
    [],
  );
  const signTex = useMemo(
    () =>
      makeCanvasTexture(
        (c, w, h) => {
          c.clearRect(0, 0, w, h);
          const g = c.createLinearGradient(0, 0, w, 0);
          g.addColorStop(0, "#3fd4ff");
          g.addColorStop(1, "#2f7bff");
          c.fillStyle = g;
          c.font = "700 150px Sora, sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText("HTwoCloud", w / 2, h / 2);
        },
        1024,
        256,
      ),
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
    t.repeat.set(20, 14);
    return t;
  }, []);

  const rackPositions = useMemo(() => {
    const list: [number, number][] = [];
    for (const z of [0, -5]) for (const x of [-9, -6, -3, 0, 3, 6, 9]) if (!(x === 0 && z === 0)) list.push([x, z]);
    return list;
  }, []);

  const cams = useMemo(
    () => [
      { p: 0, pos: [0, 0.8, 6.5], look: [0, 0, 0] },
      { p: 0.3, pos: [2.2, 2.2, 5.2], look: [0, -0.1, 0] },
      { p: 0.62, pos: [5.5, 2.5, 9.5], look: [0, 0.3, 0] },
      { p: 1, pos: [13, 9, 17], look: [0, 0, -3] },
    ],
    [],
  );

  const ready = useRef(false);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = progress.current;
    smooth.current = reduced ? target : lerp(smooth.current, target, 1 - Math.exp(-6 * dt));
    const p = smooth.current;
    const t = state.clock.elapsedTime;

    // parts
    PARTS.forEach((part, i) => {
      const g = partRefs.current[i];
      if (!g) return;
      const k = seg(p, part.window[0], part.window[1]);
      const floatAmt = reduced ? 0 : (1 - k) * 0.12;
      g.position.set(
        lerp(part.from[0], part.to[0], k),
        lerp(part.from[1], part.to[1], k) + Math.sin(t * 1.2 + i) * floatAmt,
        lerp(part.from[2], part.to[2], k),
      );
      g.rotation.set(part.rot[0] * (1 - k), part.rot[1] * (1 - k) + (reduced ? 0 : (1 - k) * t * 0.2), part.rot[2] * (1 - k));
      g.visible = part.key === "switch" || p < 0.55;
    });

    // chassis lid
    const lid = seg(p, 0.24, 0.32);
    if (lidMat.current) lidMat.current.opacity = lid;
    if (lidGroup.current) lidGroup.current.visible = lid > 0.01;

    // rack + servers
    const rack = seg(p, 0.34, 0.46);
    if (rackGroup.current) {
      rackGroup.current.visible = rack > 0.01;
      rackGroup.current.scale.setScalar(lerp(0.9, 1, rack));
    }
    serverRefs.current.forEach((g, i) => {
      if (!g) return;
      const k = seg(p, 0.4 + i * 0.025, 0.5 + i * 0.025);
      g.visible = k > 0.01;
      g.position.x = lerp(i % 2 ? 6 : -6, 0, k);
    });

    // room
    const room = seg(p, 0.66, 0.85);
    if (roomGroup.current) {
      roomGroup.current.visible = room > 0.01;
    }
    extraRacks.current.forEach((g, i) => {
      if (!g) return;
      const k = seg(p, 0.68 + (i % 7) * 0.015, 0.82 + (i % 7) * 0.015);
      g.scale.set(1, Math.max(0.001, k), 1);
      g.visible = k > 0.01;
    });

    // camera keyframes
    let a = cams[0];
    let b = cams[cams.length - 1];
    for (let i = 0; i < cams.length - 1; i++) {
      if (p >= cams[i].p && p <= cams[i + 1].p) {
        a = cams[i];
        b = cams[i + 1];
        break;
      }
    }
    const ck = seg(p, a.p, b.p === a.p ? a.p + 1 : b.p);
    const sway = reduced ? 0 : Math.sin(t * 0.3) * 0.15;
    camera.position.set(lerp(a.pos[0], b.pos[0], ck) + sway, lerp(a.pos[1], b.pos[1], ck), lerp(a.pos[2], b.pos[2], ck));
    look.set(lerp(a.look[0], b.look[0], ck), lerp(a.look[1], b.look[1], ck), lerp(a.look[2], b.look[2], ck));
    camera.lookAt(look);

    if (!ready.current) {
      ready.current = true;
      state.gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "true");
    }
  });

  return (
    <>
      <color attach="background" args={["#0a1120"]} />
      <fog attach="fog" args={["#0a1120", 14, 40]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#cfe6ff" />
      <pointLight position={[-3, 2, 3]} intensity={12} color={COLORS.cyan} distance={12} />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.2} color="#5ad8ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        <Lightformer intensity={0.8} color="#3a6bff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>

      {PARTS.map((part, i) => (
        <group key={part.key} ref={(el) => { partRefs.current[i] = el; }}>
          <PartMesh k={part.key} />
        </group>
      ))}

      {/* hero server chassis */}
      <group ref={lidGroup}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.9, 0.42, 1.9]} />
          <meshStandardMaterial ref={lidMat} color={COLORS.chassis} metalness={0.75} roughness={0.3} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0, 0.951]}>
          <planeGeometry args={[2.9, 0.42]} />
          <meshBasicMaterial map={frontTex} toneMapped={false} />
        </mesh>
      </group>

      {/* rack */}
      <group ref={rackGroup}>
        {[
          [-1.55, -0.95],
          [1.55, -0.95],
          [-1.55, 0.95],
          [1.55, 0.95],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, RACK_BOTTOM + (RACK_SLOTS * SLOT) / 2, z]}>
            <boxGeometry args={[0.08, RACK_SLOTS * SLOT + 0.3, 0.08]} />
            <meshStandardMaterial color="#5b6b85" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, RACK_BOTTOM + RACK_SLOTS * SLOT + 0.15, 0]}>
          <boxGeometry args={[3.2, 0.08, 2]} />
          <meshStandardMaterial color="#2a3550" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, RACK_BOTTOM - 0.1, 0]}>
          <boxGeometry args={[3.2, 0.12, 2]} />
          <meshStandardMaterial color="#2a3550" metalness={0.8} roughness={0.3} />
        </mesh>
        {[0, 1, 2, 4, 5, 6].map((slot, i) => (
          <group key={slot} ref={(el) => { serverRefs.current[i] = el; }} position={[0, RACK_BOTTOM + (slot + 0.5) * SLOT, 0]}>
            <mesh>
              <boxGeometry args={[2.9, 0.42, 1.9]} />
              <meshStandardMaterial color={COLORS.chassis} metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.951]}>
              <planeGeometry args={[2.9, 0.42]} />
              <meshBasicMaterial map={frontTex} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* data-center room */}
      <group ref={roomGroup}>
        <mesh rotation-x={-Math.PI / 2} position={[0, RACK_BOTTOM - 0.17, -2.5]}>
          <planeGeometry args={[28, 18]} />
          <meshStandardMaterial map={floorTex} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.5, -10]}>
          <boxGeometry args={[28, 9, 0.3]} />
          <meshStandardMaterial color="#0f1a30" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.6, -9.8]}>
          <planeGeometry args={[10, 2.5]} />
          <meshBasicMaterial map={signTex} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.6, -9.84]}>
          <boxGeometry args={[24, 0.06, 0.05]} />
          <meshBasicMaterial color={COLORS.cyan} toneMapped={false} />
        </mesh>
        {rackPositions.map(([x, z], i) => (
          <group key={`${x}_${z}`} position={[x, RACK_BOTTOM - 0.04, z]} ref={(el) => { extraRacks.current[i] = el; }}>
            <mesh position={[0, (RACK_SLOTS * SLOT + 0.3) / 2, 0]}>
              <boxGeometry args={[2.6, RACK_SLOTS * SLOT + 0.3, 2]} />
              <meshStandardMaterial color="#1a2438" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, (RACK_SLOTS * SLOT + 0.3) / 2, 1.01]}>
              <planeGeometry args={[2.5, RACK_SLOTS * SLOT + 0.2]} />
              <meshBasicMaterial map={rackTex} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function DataCenterScene({ progress, reduced }: Props) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  useEffect(() => () => undefined, []);
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: mobile ? 55 : 42, position: [0, 0.8, 6.5], near: 0.1, far: 80 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene progress={progress} reduced={reduced} />
    </Canvas>
  );
}
