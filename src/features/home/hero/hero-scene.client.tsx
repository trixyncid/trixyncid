"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { inertCanvasEvents } from "@/lib/r3f-inert-events";
import { useRenderActive } from "@/hooks/use-render-active";
import { FrameDriver } from "@/lib/r3f-frame-driver";
import { downgradeVisuals } from "@/hooks/use-rich-visuals";

// The network drifts slowly; 30 fps is visually identical and halves GPU work.
const getHeroFps = () => 30;

function createNetworkGeometry() {
  const nodeCount = 36;
  const positions: number[] = [];
  const nodes: THREE.Vector3[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const node = new THREE.Vector3(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 7,
    );
    nodes.push(node);
    positions.push(node.x, node.y, node.z);
  }

  const linePositions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 3.4) {
        linePositions.push(
          nodes[i].x,
          nodes[i].y,
          nodes[i].z,
          nodes[j].x,
          nodes[j].y,
          nodes[j].z,
        );
      }
    }
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  const lines = new THREE.BufferGeometry();
  lines.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );

  return { points: pointGeometry, lineGeometry: lines };
}

function NetworkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const { points, lineGeometry } = useMemo(() => createNetworkGeometry(), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
  });

  return (
    <group ref={groupRef} position={[1.2, 0, 0]}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#3866F2" transparent opacity={0.35} />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial color="#FCFDFF" size={0.06} transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  );
}

export function HeroScene() {
  const { ref, active } = useRenderActive<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,black_20%,black_85%)]"
      // Drop the canvas from the compositor when frozen — frameloop="never"
      // alone still leaves a promoted WebGL layer that fights overlay UI.
      style={{ visibility: active ? "visible" : "hidden" }}
      aria-hidden={!active}
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0.5, 8], fov: 58 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        frameloop="demand"
        events={inertCanvasEvents}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 6, 8]} intensity={0.85} color="#3866F2" />
        <pointLight position={[-6, -4, 4]} intensity={0.35} color="#2138B8" />
        <FrameDriver active={active} getFps={getHeroFps} onSlow={downgradeVisuals} />
        <NetworkMesh />
      </Canvas>
    </div>
  );
}
