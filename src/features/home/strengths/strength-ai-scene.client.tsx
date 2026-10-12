"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { inertCanvasEvents } from "@/lib/r3f-inert-events";
import { FrameDriver } from "@/lib/r3f-frame-driver";
import { downgradeVisuals } from "@/hooks/use-rich-visuals";
import { useRenderActive } from "@/hooks/use-render-active";

/**
 * Pointer state written by the card's DOM handlers and read inside useFrame,
 * so moving the mouse never re-renders React.
 */
export type RobotInteraction = {
  /** Pointer position over the card, -1..1 on each axis. */
  x: number;
  y: number;
  hover: boolean;
  /** performance.now() / 1000 of the last click/tap — triggers the spin + pulse. */
  pulseAt: number;
};

const BRAND = new THREE.Color("#3866F2");
const BRAND_DEEP = new THREE.Color("#2138B8");
const GLOW = new THREE.Color("#7D9BFF");
const PULSE_DURATION = 1.1;

const { damp } = THREE.MathUtils;

function now() {
  return performance.now() / 1000;
}

/** Soft radial sprite used as a cheap bloom halo (no post-processing pass). */
function useHaloTexture() {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.45)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Studio reflections for the glossy shell — generated once, no HDR download. */
function StudioEnvironment() {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.55;
    room.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      envMap.dispose();
    };
  }, [get]);

  return null;
}

function useMaterials() {
  const materials = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: "#eef1fb",
        roughness: 0.28,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
      visor: new THREE.MeshPhysicalMaterial({
        color: "#04060d",
        roughness: 0.06,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      }),
      trim: new THREE.MeshStandardMaterial({ color: BRAND_DEEP, metalness: 0.75, roughness: 0.28 }),
      glow: new THREE.MeshBasicMaterial({ color: GLOW, toneMapped: false }),
      glowSoft: new THREE.MeshBasicMaterial({
        color: BRAND,
        toneMapped: false,
        transparent: true,
        opacity: 0.65,
      }),
      tile: new THREE.MeshPhysicalMaterial({
        color: "#0b1024",
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.92,
      }),
    }),
    [],
  );

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  );
  return materials;
}

type Materials = ReturnType<typeof useMaterials>;

function Halo({
  texture,
  size,
  color = GLOW,
  opacity = 0.8,
  position,
  haloRef,
}: {
  texture: THREE.Texture;
  size: number;
  color?: THREE.Color;
  opacity?: number;
  position?: [number, number, number];
  haloRef?: React.Ref<THREE.Sprite>;
}) {
  return (
    <sprite ref={haloRef} position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

function Robot({
  interaction,
  materials,
  halo,
}: {
  interaction: React.RefObject<RobotInteraction>;
  materials: Materials;
  halo: THREE.Texture;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Mesh>(null);
  const handLeft = useRef<THREE.Mesh>(null);
  const handRight = useRef<THREE.Mesh>(null);
  const antennaTip = useRef<THREE.Sprite>(null);
  const coreHalo = useRef<THREE.Sprite>(null);
  const blink = useRef({ next: now() + 2.5, until: 0 });
  const happy = useRef(0);

  // Visor covers the front of the head; SphereGeometry's +z faces phi = π/2.
  const visorGeometry = useMemo(
    () => new THREE.SphereGeometry(0.6, 48, 24, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.42, 0.86),
    [],
  );
  useEffect(() => () => visorGeometry.dispose(), [visorGeometry]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const input = interaction.current;
    const dt = Math.min(delta, 0.1);
    const sincePulse = now() - input.pulseAt;
    const pulsing = sincePulse >= 0 && sincePulse < PULSE_DURATION;

    // Where to look: the cursor while hovered, a slow idle scan otherwise.
    const lookX = input.hover ? input.x : Math.sin(t * 0.45) * 0.55;
    const lookY = input.hover ? input.y : Math.sin(t * 0.3 + 1) * 0.2;

    if (root.current) {
      // Float, plus a hop + full spin on click.
      const hop = pulsing ? Math.sin((sincePulse / PULSE_DURATION) * Math.PI) * 0.35 : 0;
      root.current.position.y = Math.sin(t * 1.3) * 0.07 + hop;
      const turn = Math.PI * 2;
      if (pulsing) {
        const eased = 1 - Math.pow(1 - sincePulse / PULSE_DURATION, 3);
        root.current.rotation.y = eased * turn;
      } else {
        // Settle on the nearest whole turn so it never spins back the long way.
        const rotation = root.current.rotation.y;
        root.current.rotation.y = damp(rotation, Math.round(rotation / turn) * turn, 6, dt);
      }
    }
    if (body.current) {
      body.current.rotation.y = damp(body.current.rotation.y, lookX * 0.22, 4, dt);
      body.current.rotation.z = damp(body.current.rotation.z, -lookX * 0.06, 4, dt);
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, lookX * 0.55, 6, dt);
      head.current.rotation.x = damp(head.current.rotation.x, lookY * 0.32, 6, dt);
      head.current.rotation.z = damp(head.current.rotation.z, -lookX * 0.08, 5, dt);
    }

    // Eyes: drift toward the look target, blink every few seconds, squint happily on hover.
    happy.current = damp(happy.current, input.hover || pulsing ? 1 : 0, 6, dt);
    const nowS = now();
    if (nowS > blink.current.next) {
      blink.current.until = nowS + 0.12;
      blink.current.next = nowS + 2.5 + Math.random() * 3;
    }
    const blinking = nowS < blink.current.until;
    if (eyes.current) {
      eyes.current.position.x = damp(eyes.current.position.x, lookX * 0.06, 8, dt);
      eyes.current.position.y = damp(eyes.current.position.y, 0.02 + lookY * -0.035, 8, dt);
      const targetY = blinking ? 0.1 : 1 - happy.current * 0.45;
      eyes.current.scale.y = damp(eyes.current.scale.y, targetY, blinking ? 30 : 10, dt);
      eyes.current.scale.x = damp(eyes.current.scale.x, 1 + happy.current * 0.15, 10, dt);
    }
    if (smile.current) {
      const s = happy.current;
      smile.current.scale.setScalar(Math.max(s, 0.001));
      (smile.current.material as THREE.MeshBasicMaterial).opacity = s;
    }

    // Floating hands bob out of phase; the right hand waves after a click.
    if (handLeft.current) {
      handLeft.current.position.y = -0.62 + Math.sin(t * 1.6) * 0.05;
    }
    if (handRight.current) {
      const wave = pulsing ? Math.sin(sincePulse * 14) * 0.12 : 0;
      handRight.current.position.y = -0.62 + Math.sin(t * 1.6 + 1.4) * 0.05 + (pulsing ? 0.35 : 0);
      handRight.current.position.x = 0.72 + wave;
    }

    const glowPulse = 0.75 + Math.sin(t * 2.4) * 0.15 + (pulsing ? 0.4 : 0) + happy.current * 0.15;
    if (antennaTip.current) {
      antennaTip.current.scale.setScalar(0.32 * glowPulse);
    }
    if (coreHalo.current) {
      coreHalo.current.scale.setScalar(0.55 * glowPulse);
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* Torso */}
        <mesh material={materials.shell} position={[0, -0.62, 0]} scale={[1, 1, 0.82]}>
          <capsuleGeometry args={[0.4, 0.3, 12, 32]} />
        </mesh>
        {/* AI core in the chest */}
        <mesh material={materials.trim} position={[0, -0.52, 0.33]} rotation={[0.08, 0, 0]}>
          <torusGeometry args={[0.11, 0.022, 16, 48]} />
        </mesh>
        <mesh material={materials.glow} position={[0, -0.52, 0.335]}>
          <circleGeometry args={[0.075, 32]} />
        </mesh>
        <Halo haloRef={coreHalo} texture={halo} size={0.55} position={[0, -0.52, 0.4]} color={BRAND} />
        {/* Neck */}
        <mesh material={materials.trim} position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.14, 24]} />
        </mesh>

        <group ref={head} position={[0, 0.38, 0]}>
          <group scale={[1.12, 0.9, 1]}>
            <mesh material={materials.shell}>
              <sphereGeometry args={[0.6, 48, 32]} />
            </mesh>
            <mesh material={materials.visor} geometry={visorGeometry} scale={1.025} />
          </group>

          {/* Eyes + smile live on the visor */}
          <group ref={eyes} position={[0, 0.02, 0.585]}>
            <mesh material={materials.glow} position={[-0.19, 0, 0]} rotation={[0, -0.28, 0]}>
              <capsuleGeometry args={[0.055, 0.09, 8, 16]} />
            </mesh>
            <mesh material={materials.glow} position={[0.19, 0, 0]} rotation={[0, 0.28, 0]}>
              <capsuleGeometry args={[0.055, 0.09, 8, 16]} />
            </mesh>
            <Halo texture={halo} size={0.42} position={[-0.19, 0, 0.05]} opacity={0.55} />
            <Halo texture={halo} size={0.42} position={[0.19, 0, 0.05]} opacity={0.55} />
          </group>
          <mesh ref={smile} position={[0, -0.16, 0.575]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.09, 0.016, 8, 32, Math.PI]} />
            <meshBasicMaterial color={GLOW} toneMapped={false} transparent opacity={0} />
          </mesh>

          {/* Ears with glowing rings */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.665, 0, 0]} rotation={[0, 0, (side * Math.PI) / 2]}>
              <mesh material={materials.trim}>
                <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
              </mesh>
              <mesh material={materials.glowSoft} position={[0, side * -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.105, 0.014, 8, 40]} />
              </mesh>
            </group>
          ))}

          {/* Antenna */}
          <mesh material={materials.trim} position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.014, 0.02, 0.24, 12]} />
          </mesh>
          <mesh material={materials.glow} position={[0, 0.74, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
          </mesh>
          <Halo haloRef={antennaTip} texture={halo} size={0.32} position={[0, 0.74, 0]} />
        </group>
      </group>

      {/* Floating hands */}
      <mesh ref={handLeft} material={materials.shell} position={[-0.72, -0.62, 0.05]}>
        <sphereGeometry args={[0.13, 32, 24]} />
      </mesh>
      <mesh ref={handRight} material={materials.shell} position={[0.72, -0.62, 0.05]}>
        <sphereGeometry args={[0.13, 32, 24]} />
      </mesh>
    </group>
  );
}

/** Glowing hover-pad under the robot, with a shockwave ring on click. */
function HoverPad({
  interaction,
  halo,
}: {
  interaction: React.RefObject<RobotInteraction>;
  halo: THREE.Texture;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const wave = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) {
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.55 + Math.sin(t * 2) * 0.15 + (interaction.current.hover ? 0.2 : 0);
    }
    if (wave.current) {
      const since = now() - interaction.current.pulseAt;
      const progress = since >= 0 && since < PULSE_DURATION ? since / PULSE_DURATION : 1;
      wave.current.scale.setScalar(1 + progress * 2.6);
      (wave.current.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.8;
    }
  });

  return (
    <group position={[0, -1.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring}>
        <torusGeometry args={[0.62, 0.012, 8, 96]} />
        <meshBasicMaterial color={GLOW} toneMapped={false} transparent opacity={0.6} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.42, 0.006, 8, 96]} />
        <meshBasicMaterial color={BRAND} toneMapped={false} transparent opacity={0.45} />
      </mesh>
      <mesh ref={wave}>
        <torusGeometry args={[0.62, 0.01, 8, 96]} />
        <meshBasicMaterial color={GLOW} toneMapped={false} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.9, 48]} />
        <meshBasicMaterial
          map={halo}
          color={BRAND}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

const TILE_COUNT = 5;
const PARTICLE_COUNT = 70;

/** Workflow cards orbiting the robot, linked to its core, inside a stream of data particles. */
function WorkflowOrbit({
  interaction,
  materials,
}: {
  interaction: React.RefObject<RobotInteraction>;
  materials: Materials;
}) {
  const tiles = useRef<(THREE.Group | null)[]>([]);
  const links = useRef<THREE.LineSegments>(null);
  const particles = useRef<THREE.Points>(null);
  const speed = useRef(1);
  const angle = useRef(0);
  const camera = useThree((state) => state.camera);

  const linkBuffer = useMemo(() => new Float32Array(TILE_COUNT * 6), []);
  const particleBuffer = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const particleData = useMemo(() => {
    const offsets = new Float32Array(PARTICLE_COUNT);
    const lanes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Deterministic spread so the stream looks the same on every visit.
      offsets[i] = (i / PARTICLE_COUNT) * Math.PI * 2;
      lanes[i] = ((i * 37) % 11) / 11 - 0.5;
    }
    return { offsets, lanes };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const input = interaction.current;
    const since = now() - input.pulseAt;
    const boost = since >= 0 && since < PULSE_DURATION ? 2.2 : input.hover ? 1.8 : 1;
    speed.current = damp(speed.current, boost, 3, dt);
    angle.current += dt * 0.32 * speed.current;

    if (!links.current || !particles.current) return;
    const linkPositions = links.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < TILE_COUNT; i++) {
      const tile = tiles.current[i];
      if (!tile) continue;
      const a = angle.current + (i / TILE_COUNT) * Math.PI * 2;
      const x = Math.cos(a) * 2.05;
      const z = Math.sin(a) * 1.1;
      const y = -0.25 + Math.sin(a * 2 + i) * 0.22;
      tile.position.set(x, y, z);
      tile.quaternion.copy(camera.quaternion);
      // Cards behind the robot shrink slightly for depth.
      tile.scale.setScalar(0.85 + (z + 1.1) * 0.12);
      linkPositions.setXYZ(i * 2, 0, -0.52, 0.2);
      linkPositions.setXYZ(i * 2 + 1, x, y, z);
    }
    linkPositions.needsUpdate = true;

    const positions = particles.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const a = angle.current * 1.6 + particleData.offsets[i]!;
      const lane = particleData.lanes[i]!;
      const radius = 1.55 + lane * 0.5;
      positions.setXYZ(
        i,
        Math.cos(a) * radius,
        -0.35 + Math.sin(a * 3 + lane * 6 + t * 0.6) * 0.18 + lane * 0.3,
        Math.sin(a) * radius * 0.55,
      );
    }
    positions.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={links}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkBuffer, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={BRAND} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleBuffer, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={GLOW}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      {Array.from({ length: TILE_COUNT }, (_, i) => (
        <group
          key={i}
          ref={(node) => {
            tiles.current[i] = node;
          }}
        >
          <mesh material={materials.tile}>
            <boxGeometry args={[0.42, 0.27, 0.03]} />
          </mesh>
          {/* Status dot + two "text" lines glowing on the card face */}
          <mesh material={materials.glow} position={[-0.14, 0.06, 0.017]}>
            <circleGeometry args={[0.028, 16]} />
          </mesh>
          <mesh material={materials.glowSoft} position={[0.03, 0.06, 0.017]}>
            <planeGeometry args={[0.2, 0.026]} />
          </mesh>
          <mesh material={materials.glowSoft} position={[-0.02, -0.03, 0.017]}>
            <planeGeometry args={[0.3, 0.02]} />
          </mesh>
          <mesh material={materials.glowSoft} position={[-0.06, -0.08, 0.017]}>
            <planeGeometry args={[0.22, 0.02]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type StrengthAiSceneProps = {
  interaction: React.RefObject<RobotInteraction>;
};

export function StrengthAiScene({ interaction }: StrengthAiSceneProps) {
  const { ref, active } = useRenderActive<HTMLDivElement>();
  // 60 fps while someone is interacting, 30 fps for the idle float.
  const getFps = () => {
    const input = interaction.current;
    const pulsing = now() - input.pulseAt < PULSE_DURATION;
    return input.hover || pulsing ? 60 : 30;
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ visibility: active ? "visible" : "hidden" }}
      aria-hidden
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0.1, 5.4], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "default" }}
        frameloop="demand"
        events={inertCanvasEvents}
        style={{ background: "transparent" }}
      >
        <FrameDriver active={active} getFps={getFps} onSlow={downgradeVisuals} />
        <SceneContents interaction={interaction} />
      </Canvas>
    </div>
  );
}

function SceneContents({ interaction }: StrengthAiSceneProps) {
  const materials = useMaterials();
  const halo = useHaloTexture();

  return (
    <>
      <StudioEnvironment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.6} color="#ffffff" />
      {/* Blue rim lights from behind give the white shell its brand edge glow */}
      <directionalLight position={[-3, 2, -3]} intensity={2.6} color={BRAND} />
      <directionalLight position={[3, -1, -2.5]} intensity={1.4} color={GLOW} />
      <group position={[0, 0.02, 0]} scale={1.08}>
        <Robot interaction={interaction} materials={materials} halo={halo} />
        <HoverPad interaction={interaction} halo={halo} />
        <WorkflowOrbit interaction={interaction} materials={materials} />
      </group>
    </>
  );
}
