"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { inertCanvasEvents } from "@/lib/r3f-inert-events";
import { useRenderActive } from "@/hooks/use-render-active";
import { FrameDriver } from "@/lib/r3f-frame-driver";
import { downgradeVisuals } from "@/hooks/use-rich-visuals";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * "Built in Sync" core: scattered data points assemble into one network
 * sphere, sparks run along its links, and orbiting modules stream pulses into
 * the core. ~10 draw calls; the assemble motion runs in shaders.
 */

const NODE_COUNT = 200;
const NEIGHBOURS = 3;
const SPARK_COUNT = 28;
const MODULE_COUNT = 4;
const ARC_SEGMENTS = 28;
const PULSES_PER_ARC = 2;
const ASSEMBLE_SECONDS = 2.2;

type Palette = {
  node: THREE.Color;
  nodeHot: THREE.Color;
  line: THREE.Color;
  /** The live data (link sparks, arc pulses, satellites) is the pop accent — the structure stays blue. */
  spark: THREE.Color;
  blending: THREE.Blending;
  lineOpacity: number;
  glowOpacity: number;
};

const darkPalette: Palette = {
  node: new THREE.Color("#5b7cf5"),
  nodeHot: new THREE.Color("#e8eeff"),
  line: new THREE.Color("#3866f2"),
  spark: new THREE.Color("#d4ff3f"),
  blending: THREE.AdditiveBlending,
  lineOpacity: 0.5,
  glowOpacity: 0.55,
};

const lightPalette: Palette = {
  node: new THREE.Color("#2138b8"),
  nodeHot: new THREE.Color("#3866f2"),
  line: new THREE.Color("#2138b8"),
  spark: new THREE.Color("#9bd81f"),
  blending: THREE.NormalBlending,
  lineOpacity: 0.35,
  glowOpacity: 0.18,
};

/** Pointer state written by a window listener and read inside useFrame. */
type HeroInput = { x: number; y: number; movedAt: number };

type Network = ReturnType<typeof buildNetwork>;

/**
 * The scene's own clock. It stands still (pose = the poster image) until the
 * poster has faded out, then eases up to full speed, so the hand-over from
 * poster to live scene never shows two different frames on top of each other.
 */
type SceneClock = { t: number; dt: number; speed: number };

type LayerProps = {
  palette: Palette;
  progress: React.RefObject<number>;
  radius: number;
  clock: React.RefObject<SceneClock>;
};

function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Evenly spread points on a unit sphere, links to nearest neighbours, and scattered start positions. */
function buildNetwork() {
  const random = seededRandom(7);
  const nodes: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    nodes.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
  }

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const nearest = nodes
      .map((node, j) => ({ j, d: j === i ? Infinity : node.distanceToSquared(nodes[i]!) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBOURS);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([i, j]);
      }
    }
  }

  const target = new Float32Array(NODE_COUNT * 3);
  const scatter = new Float32Array(NODE_COUNT * 3);
  const phase = new Float32Array(NODE_COUNT);
  const size = new Float32Array(NODE_COUNT);
  nodes.forEach((node, i) => {
    target.set([node.x, node.y, node.z], i * 3);
    // Start far out in a loose cloud so the intro reads as "pieces coming together".
    const spread = 2.2 + random() * 2.8;
    scatter.set(
      [
        node.x * spread + (random() - 0.5) * 3,
        node.y * spread + (random() - 0.5) * 3,
        node.z * spread + (random() - 0.5) * 3,
      ],
      i * 3,
    );
    phase[i] = random() * Math.PI * 2;
    size[i] = 0.7 + random() * 0.9 + (random() > 0.92 ? 1.2 : 0); // a few brighter hubs
  });

  const lineTarget = new Float32Array(edges.length * 6);
  const lineScatter = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    lineTarget.set(target.subarray(a * 3, a * 3 + 3), k * 6);
    lineTarget.set(target.subarray(b * 3, b * 3 + 3), k * 6 + 3);
    lineScatter.set(scatter.subarray(a * 3, a * 3 + 3), k * 6);
    lineScatter.set(scatter.subarray(b * 3, b * 3 + 3), k * 6 + 3);
  });

  // For each node, the links leaving it — lets sparks continue along a path.
  const outgoing: number[][] = Array.from({ length: NODE_COUNT }, () => []);
  edges.forEach(([a, b], k) => {
    outgoing[a]!.push(k);
    outgoing[b]!.push(k);
  });

  return { nodes, edges, outgoing, target, scatter, phase, size, lineTarget, lineScatter };
}

// Shared GLSL: assemble from scatter → sphere, and dim the far side of the sphere.
const assembleVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uRadius;
  attribute vec3 aScatter;
  varying float vFacing;
  vec3 assembled() {
    float eased = 1.0 - pow(1.0 - uProgress, 3.0);
    return mix(aScatter, position, eased) * uRadius;
  }
  float facing(vec3 p) {
    vec3 n = normalize((modelViewMatrix * vec4(p, 0.0)).xyz);
    return mix(0.15, 1.0, smoothstep(-0.6, 0.6, n.z));
  }
`;

function NetworkSphere({ network, palette, progress, radius, clock }: LayerProps & { network: Network }) {
  const dpr = useThree((state) => state.viewport.dpr);

  const pointMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: palette.blending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uRadius: { value: radius },
          uPixelRatio: { value: dpr },
          uColor: { value: palette.node },
          uHot: { value: palette.nodeHot },
        },
        vertexShader: /* glsl */ `
          ${assembleVertex}
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aPhase;
          attribute float aSize;
          varying float vTwinkle;
          void main() {
            vec3 p = assembled();
            vFacing = facing(p);
            vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * uPixelRatio * (34.0 / -mv.z) * (0.8 + 0.4 * vTwinkle);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform vec3 uHot;
          varying float vFacing;
          varying float vTwinkle;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float core = smoothstep(0.5, 0.0, d);
            float glow = pow(core, 2.2);
            vec3 color = mix(uColor, uHot, glow * vTwinkle);
            gl_FragColor = vec4(color, core * vFacing);
          }
        `,
      }),
    [palette, radius, dpr],
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: palette.blending,
        uniforms: {
          uProgress: { value: 0 },
          uRadius: { value: radius },
          uColor: { value: palette.line },
          uOpacity: { value: palette.lineOpacity },
        },
        vertexShader: /* glsl */ `
          ${assembleVertex}
          void main() {
            vec3 p = assembled();
            vFacing = facing(p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uProgress;
          varying float vFacing;
          void main() {
            // Links fade in as the nodes lock into place.
            float lock = smoothstep(0.55, 1.0, uProgress);
            gl_FragColor = vec4(uColor, uOpacity * vFacing * lock);
          }
        `,
      }),
    [palette, radius],
  );

  useEffect(
    () => () => {
      pointMaterial.dispose();
      lineMaterial.dispose();
    },
    [pointMaterial, lineMaterial],
  );

  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    const p = progress.current;
    const pm = points.current?.material as THREE.ShaderMaterial | undefined;
    const lm = lines.current?.material as THREE.ShaderMaterial | undefined;
    if (pm) {
      pm.uniforms.uTime!.value = clock.current.t;
      pm.uniforms.uProgress!.value = p;
    }
    if (lm) lm.uniforms.uProgress!.value = p;
  });

  return (
    <group>
      <lineSegments ref={lines} material={lineMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.lineTarget, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[network.lineScatter, 3]} />
        </bufferGeometry>
      </lineSegments>
      <points ref={points} material={pointMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.target, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[network.scatter, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[network.phase, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[network.size, 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}

/** Soft bright point sprites shared by link sparks and arc pulses. */
function useSparkMaterial(palette: Palette, size = 78) {
  const dpr = useThree((state) => state.viewport.dpr);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: palette.blending,
        uniforms: { uColor: { value: palette.spark }, uPixelRatio: { value: dpr }, uSize: { value: size } },
        vertexShader: /* glsl */ `
          uniform float uPixelRatio;
          uniform float uSize;
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uPixelRatio * (uSize / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = pow(smoothstep(0.5, 0.0, d), 1.6);
            gl_FragColor = vec4(uColor, a * vAlpha);
          }
        `,
      }),
    [palette, dpr, size],
  );
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

/** Data sparks racing along the sphere's links, hopping link to link. */
function LinkSparks({ network, palette, progress, radius, clock }: LayerProps & { network: Network }) {
  const ref = useRef<THREE.Points>(null);
  const material = useSparkMaterial(palette);
  const buffers = useMemo(
    () => ({ position: new Float32Array(SPARK_COUNT * 3), alpha: new Float32Array(SPARK_COUNT) }),
    [],
  );
  const sparks = useRef<{ edge: number; forward: boolean; t: number; speed: number }[]>([]);
  const random = useMemo(() => seededRandom(21), []);
  const scratch = useMemo(() => ({ a: new THREE.Vector3() }), []);

  useFrame(() => {
    const points = ref.current;
    if (!points) return;
    if (sparks.current.length === 0) {
      sparks.current = Array.from({ length: SPARK_COUNT }, () => ({
        edge: Math.floor(random() * network.edges.length),
        forward: random() > 0.5,
        t: random(),
        speed: 0.7 + random() * 0.9,
      }));
    }
    const dt = clock.current.dt;
    const locked = THREE.MathUtils.smoothstep(progress.current, 0.8, 1);
    const position = points.geometry.attributes.position as THREE.BufferAttribute;
    const alpha = points.geometry.attributes.aAlpha as THREE.BufferAttribute;
    const { a } = scratch;

    sparks.current.forEach((spark, i) => {
      spark.t += dt * spark.speed;
      let [from, to] = network.edges[spark.edge]!;
      if (!spark.forward) [from, to] = [to, from];
      if (spark.t >= 1) {
        // Continue along a link leaving the node we just reached.
        const options = network.outgoing[to]!.filter((k) => k !== spark.edge);
        spark.edge = options[Math.floor(random() * options.length)] ?? spark.edge;
        spark.forward = network.edges[spark.edge]![0] === to;
        spark.t = 0;
        [from, to] = network.edges[spark.edge]!;
        if (!spark.forward) [from, to] = [to, from];
      }
      a.copy(network.nodes[from]!).lerp(network.nodes[to]!, spark.t).multiplyScalar(radius);
      position.setXYZ(i, a.x, a.y, a.z);
      alpha.setX(i, (0.4 + 0.6 * Math.sin(spark.t * Math.PI)) * locked);
    });
    position.needsUpdate = true;
    alpha.needsUpdate = true;
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[buffers.alpha, 1]} />
      </bufferGeometry>
    </points>
  );
}

/** Orbiting module satellites streaming pulses along curved arcs into the core. */
function ModuleOrbits({ palette, progress, radius, clock }: LayerProps) {
  const satellites = useRef<THREE.Points>(null);
  const arcs = useRef<THREE.LineSegments>(null);
  const pulses = useRef<THREE.Points>(null);
  const pulseMaterial = useSparkMaterial(palette);
  const satelliteMaterial = useSparkMaterial(palette, 230);

  const orbits = useMemo(
    () =>
      Array.from({ length: MODULE_COUNT }, (_, i) => ({
        radius: radius * (1.3 + (i % 2) * 0.18),
        tilt: new THREE.Euler(0.35 + i * 0.32, i * 0.9, (i % 2 ? -1 : 1) * 0.25),
        speed: 0.16 + i * 0.035,
        offset: (i / MODULE_COUNT) * Math.PI * 2,
      })),
    [radius],
  );

  const ringGeometries = useMemo(
    () =>
      orbits.map((orbit) => {
        const curve = new THREE.EllipseCurve(0, 0, orbit.radius, orbit.radius);
        const points = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, 0, p.y));
        return new THREE.BufferGeometry().setFromPoints(points);
      }),
    [orbits],
  );
  useEffect(() => () => ringGeometries.forEach((geometry) => geometry.dispose()), [ringGeometries]);

  const buffers = useMemo(
    () => ({
      arc: new Float32Array(MODULE_COUNT * ARC_SEGMENTS * 6),
      pulse: new Float32Array(MODULE_COUNT * PULSES_PER_ARC * 3),
      pulseAlpha: new Float32Array(MODULE_COUNT * PULSES_PER_ARC),
      satellite: new Float32Array(MODULE_COUNT * 3),
      satelliteAlpha: new Float32Array(MODULE_COUNT),
    }),
    [],
  );

  const scratch = useMemo(() => {
    const start = new THREE.Vector3();
    const control = new THREE.Vector3();
    return {
      start,
      control,
      point: new THREE.Vector3(),
      lift: new THREE.Vector3(0, radius * 0.55, 0),
      curve: new THREE.QuadraticBezierCurve3(start, control, new THREE.Vector3()),
    };
  }, [radius]);

  useFrame(() => {
    const t = clock.current.t;
    const visible = THREE.MathUtils.smoothstep(progress.current, 0.7, 1);
    if (!arcs.current || !pulses.current || !satellites.current) return;
    const satellitePositions = satellites.current.geometry.attributes.position as THREE.BufferAttribute;
    const satelliteAlpha = satellites.current.geometry.attributes.aAlpha as THREE.BufferAttribute;
    const arcPositions = arcs.current.geometry.attributes.position as THREE.BufferAttribute;
    const pulsePositions = pulses.current.geometry.attributes.position as THREE.BufferAttribute;
    const pulseAlpha = pulses.current.geometry.attributes.aAlpha as THREE.BufferAttribute;
    const { start, control, point, lift, curve } = scratch;

    orbits.forEach((orbit, i) => {
      const angle = t * orbit.speed + orbit.offset;
      start.set(Math.cos(angle) * orbit.radius, 0, Math.sin(angle) * orbit.radius).applyEuler(orbit.tilt);
      satellitePositions.setXYZ(i, start.x, start.y, start.z);
      satelliteAlpha.setX(i, visible * (0.85 + Math.sin(t * 2.2 + i) * 0.15));
      // Each arc bows outward and up before diving into the core.
      control.copy(start).multiplyScalar(0.55).add(lift);
      for (let s = 0; s < ARC_SEGMENTS; s++) {
        const index = (i * ARC_SEGMENTS + s) * 2;
        curve.getPoint(s / ARC_SEGMENTS, point);
        arcPositions.setXYZ(index, point.x, point.y, point.z);
        curve.getPoint((s + 1) / ARC_SEGMENTS, point);
        arcPositions.setXYZ(index + 1, point.x, point.y, point.z);
      }
      for (let p = 0; p < PULSES_PER_ARC; p++) {
        const along = (t * 0.45 + i * 0.27 + p / PULSES_PER_ARC) % 1;
        curve.getPoint(along, point);
        const index = i * PULSES_PER_ARC + p;
        pulsePositions.setXYZ(index, point.x, point.y, point.z);
        pulseAlpha.setX(index, Math.sin(along * Math.PI) * visible);
      }
    });
    arcPositions.needsUpdate = true;
    satellitePositions.needsUpdate = true;
    satelliteAlpha.needsUpdate = true;
    pulsePositions.needsUpdate = true;
    pulseAlpha.needsUpdate = true;
    (arcs.current.material as THREE.LineBasicMaterial).opacity = 0.24 * visible;
  });

  return (
    <group>
      {orbits.map((orbit, i) => (
        <lineLoop key={i} geometry={ringGeometries[i]} rotation={orbit.tilt}>
          <lineBasicMaterial color={palette.line} transparent opacity={0.16} depthWrite={false} />
        </lineLoop>
      ))}
      <lineSegments ref={arcs}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.arc, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.line}
          transparent
          opacity={0}
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>
      <points ref={pulses} material={pulseMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.pulse, 3]} />
          <bufferAttribute attach="attributes-aAlpha" args={[buffers.pulseAlpha, 1]} />
        </bufferGeometry>
      </points>
      <points ref={satellites} material={satelliteMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.satellite, 3]} />
          <bufferAttribute attach="attributes-aAlpha" args={[buffers.satelliteAlpha, 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}

/** Glowing heart of the system plus a counter-rotating inner lattice. */
function Core({ palette, progress, radius, clock }: LayerProps) {
  const lattice = useRef<THREE.LineSegments>(null);
  const glow = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius * 0.38, 1)),
    [radius],
  );
  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      glowTexture.dispose();
    },
    [geometry, glowTexture],
  );

  useFrame((state) => {
    const t = clock.current.t;
    const p = Math.max(THREE.MathUtils.smoothstep(progress.current, 0.4, 1), 0.001);
    if (lattice.current) {
      lattice.current.rotation.set(-t * 0.25, -t * 0.32, 0);
      lattice.current.scale.setScalar(p);
    }
    if (glow.current) {
      glow.current.scale.setScalar(radius * 1.9 * p * (0.92 + Math.sin(t * 1.8) * 0.08));
      glow.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group>
      <mesh ref={glow}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          color={palette.line}
          transparent
          opacity={palette.glowOpacity}
          depthWrite={false}
          blending={palette.blending}
          toneMapped={false}
        />
      </mesh>
      <lineSegments ref={lattice} geometry={geometry}>
        <lineBasicMaterial
          color={palette.nodeHot}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>
    </group>
  );
}

/** Seconds for the scene to ease from standing still to full speed once released. */
const RAMP_SECONDS = 1.2;

function SyncCore({
  dark,
  input,
  started,
  onReady,
}: {
  dark: boolean;
  input: React.RefObject<HeroInput>;
  /** False while the poster is still fading out: hold the poster's exact pose. */
  started: boolean;
  onReady?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  // Starts assembled: the poster image already shows the finished sphere, so
  // the live scene can cross-fade in without a visible jump.
  const progress = useRef(1);
  const framesRendered = useRef(0);
  const spin = useRef(0);
  const clock = useRef<SceneClock>({ t: 0, dt: 0, speed: 0 });
  const ramp = useRef(0);
  const viewport = useThree((state) => state.viewport);
  const network = useMemo(() => buildNetwork(), []);
  const palette = dark ? darkPalette : lightPalette;
  // The canvas is a square box; leave room for the orbit rings.
  const radius = Math.min(viewport.width, viewport.height) * 0.26;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    progress.current = Math.min(1, progress.current + dt / ASSEMBLE_SECONDS);
    framesRendered.current += 1;
    // A few frames in, shaders are compiled and the scene matches the poster.
    if (framesRendered.current === 3) onReady?.();
    // Until released the clock stands still; then it eases up to full speed.
    if (started) ramp.current = Math.min(1, ramp.current + dt / RAMP_SECONDS);
    const speed = THREE.MathUtils.smootherstep(ramp.current, 0, 1);
    const c = clock.current;
    c.speed = speed;
    c.dt = dt * speed;
    c.t += c.dt;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    spin.current += c.dt * (0.08 + scroll * 0.25);
    const g = group.current;
    if (!g) return;
    const { x: px, y: py } = input.current;
    // Auto-spin (faster while scrolling away) plus a damped lean toward the cursor,
    // both scaled by the ramp so motion starts from the poster's pose.
    const lean = THREE.MathUtils.damp(g.rotation.y - spin.current, px * 0.45 * speed, 3, dt);
    g.rotation.y = spin.current + lean;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.25 + py * 0.3 * speed, 3, dt);
  });

  return (
    <group>
      <group ref={group} rotation={[0.25, 0, 0]}>
        <Core palette={palette} progress={progress} radius={radius} clock={clock} />
        <NetworkSphere network={network} palette={palette} progress={progress} radius={radius} clock={clock} />
        <LinkSparks network={network} palette={palette} progress={progress} radius={radius} clock={clock} />
        <ModuleOrbits palette={palette} progress={progress} radius={radius} clock={clock} />
      </group>
    </group>
  );
}

type HeroSceneProps = {
  /** Fired once the first frames have rendered, to cross-fade from the poster. */
  onReady?: () => void;
  /** Becomes true once the poster has faded out; the scene holds still until then. */
  started: boolean;
  className?: string;
};

export function HeroScene({ onReady, started, className }: HeroSceneProps) {
  const { ref, active } = useRenderActive<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const input = useRef<HeroInput>({ x: 0, y: 0, movedAt: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      input.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      input.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
      input.current.movedAt = performance.now();
    };
    const onScroll = () => {
      input.current.movedAt = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 60 fps while the cursor moves or the page scrolls; 30 fps at rest.
  const getFps = () => {
    const now = performance.now();
    return now - input.current.movedAt < 1200 ? 60 : 30;
  };

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 h-full w-full", className)}
      // Drop the canvas from the compositor when frozen — frameloop="never"
      // alone still leaves a promoted WebGL layer that fights overlay UI.
      style={{ visibility: active ? "visible" : "hidden" }}
      aria-hidden
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "default" }}
        frameloop="demand"
        events={inertCanvasEvents}
        // Size from layout (offsetWidth), not getBoundingClientRect: the parents are
        // scaled/moved by scroll animations, and re-measuring that on scroll resized
        // the canvas mid-scroll and made the scene jump.
        resize={{ scroll: false, offsetSize: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <FrameDriver active={active} getFps={getFps} onSlow={downgradeVisuals} />
        <SyncCore dark={resolvedTheme === "dark"} input={input} started={started} onReady={onReady} />
      </Canvas>
    </div>
  );
}
