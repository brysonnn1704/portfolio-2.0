import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Deterministic pseudo-random number generator (pure function, zero lint warnings)
function seeded(index, seed = 1337) {
  const x = Math.sin(index * 9301 + seed * 49297) * 233280;
  return x - Math.floor(x);
}

// 1. Deep Instanced Starfield (2 layers with slow parallax)
function DeepStarfield({ count = 450, radius = 28 }) {
  const pointsRef = useRef();

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = seeded(i * 4 + 1);
      const v = seeded(i * 4 + 2);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.65 + seeded(i * 4 + 3) * 0.35);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.max(r * Math.cos(phi), -2.0); // Keep above ground plane
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      scl[i] = 0.6 + seeded(i * 4 + 4) * 1.6;
    }
    return [pos, scl];
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.008;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation
        color="#E2E8F0"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 2. Mid-Field Cosmic Dust & Nebula Sparkles
function CosmicDust({ count = 160 }) {
  const dustRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seeded(i * 3 + 1, 991) - 0.5) * 16;
      pos[i * 3 + 1] = 0.2 + seeded(i * 3 + 2, 991) * 5.5;
      pos[i * 3 + 2] = (seeded(i * 3 + 3, 991) - 0.5) * 16;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!dustRef.current) return;
    dustRef.current.rotation.y -= delta * 0.015;
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        sizeAttenuation
        color="#FDE047"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3. Periodic Shooting Star (Comet streak with smooth trail)
function ShootingStar() {
  const cometRef = useRef();
  const activeRef = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const progressRef = useRef(0);
  const nextSpawnRef = useRef(3.0);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (!activeRef.current && time > nextSpawnRef.current) {
      activeRef.current = true;
      progressRef.current = 0;
      const angle = seeded(Math.floor(time * 10), 421) * Math.PI * 2;
      startPos.current.set(
        Math.cos(angle) * 14 + (seeded(Math.floor(time * 10) + 1) - 0.5) * 4,
        8.0 + seeded(Math.floor(time * 10) + 2) * 4.0,
        Math.sin(angle) * 14 + (seeded(Math.floor(time * 10) + 3) - 0.5) * 4
      );
      endPos.current.set(
        -startPos.current.x * 0.7,
        2.5 + seeded(Math.floor(time * 10) + 4) * 2.0,
        -startPos.current.z * 0.7
      );
      nextSpawnRef.current = time + 6.0 + seeded(Math.floor(time * 10) + 5) * 7.0;
    }

    if (activeRef.current && cometRef.current) {
      progressRef.current += delta * 1.8;
      const p = progressRef.current;

      if (p >= 1.0) {
        activeRef.current = false;
        cometRef.current.visible = false;
      } else {
        cometRef.current.visible = true;
        const currentPos = new THREE.Vector3().lerpVectors(startPos.current, endPos.current, p);
        cometRef.current.position.copy(currentPos);

        const opacity = p < 0.2 ? p / 0.2 : 1.0 - (p - 0.2) / 0.8;
        if (cometRef.current.children[1]?.material) {
          cometRef.current.children[1].material.opacity = opacity * 0.7;
        }
      }
    }
  });

  return (
    <group ref={cometRef} visible={false}>
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#FFFBEB" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#FDE047" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// 4. Space Atmosphere Container Component
export function SpaceAtmosphere({ reducedMotion = false }) {
  return (
    <group name="space-atmosphere">
      <DeepStarfield count={reducedMotion ? 200 : 450} radius={28} />
      {!reducedMotion && <CosmicDust count={120} />}
      {!reducedMotion && <ShootingStar />}
    </group>
  );
}
