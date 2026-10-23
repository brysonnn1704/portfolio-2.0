import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

// Station world coordinates lookup for head-tracking & arm-pointing
const STATION_COORDINATES = {
  projects: new THREE.Vector3(-1.86, 0.45, -1.08),
  systems: new THREE.Vector3(0.0, 0.55, -2.15),
  resume: new THREE.Vector3(1.86, 0.35, -1.08),
  creative: new THREE.Vector3(1.86, 0.45, 1.08),
  about: new THREE.Vector3(0.0, 0.25, 2.15),
  github: new THREE.Vector3(-1.86, 0.35, 1.08),
};

// Procedural Muscular, Stylish 3D Avatar of Bryson
export function Character({
  hovered,
  clickedStation,
  mousePos,
  reducedMotion = false,
}) {
  const rootRef = useRef();
  const spineRef = useRef();
  const neckRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const auraMaterialRef = useRef();
  const auraRingRef = useRef();

  // Internal state for arm pointing animation
  const pointingState = useRef({
    active: false,
    arm: null,
    targetVec: new THREE.Vector3(),
    timer: 0,
    blend: 0,
  });

  // Track station clicks and trigger pointing gesture
  useEffect(() => {
    if (!clickedStation || !STATION_COORDINATES[clickedStation]) return;

    const target = STATION_COORDINATES[clickedStation];
    const isLeft = target.x < 0;

    pointingState.current = {
      active: true,
      arm: isLeft ? "left" : "right",
      targetVec: target.clone(),
      timer: 1.1,
      blend: 0,
    };
  }, [clickedStation]);

  const tempTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const isInteracting = !!hovered || pointingState.current.active;

    // 1. Idle Breathing & Weight Shift (Muscular athletic posture)
    if (spineRef.current) {
      if (!reducedMotion) {
        const breath = Math.sin(time * 2.2) * 0.015;
        const sway = Math.cos(time * 1.1) * 0.012;
        spineRef.current.position.y = 0.58 + breath;
        spineRef.current.rotation.z = sway;
      } else {
        spineRef.current.position.y = 0.58;
        spineRef.current.rotation.z = 0;
      }
    }

    // 2. Head & Neck Look-At Target Calculation
    let targetX = 0;
    let targetY = 0.9;
    let targetZ = 3.5;

    if (hovered && STATION_COORDINATES[hovered]) {
      const coord = STATION_COORDINATES[hovered];
      targetX = coord.x;
      targetY = coord.y;
      targetZ = coord.z;
    } else if (mousePos && Math.abs(mousePos.x) > 0.05) {
      targetX = THREE.MathUtils.clamp(mousePos.x * 2.2, -1.8, 1.8);
      targetY = 0.6;
      targetZ = THREE.MathUtils.clamp(mousePos.y * 2.0 + 1.2, -0.8, 2.8);
    }

    tempTarget.set(targetX, targetY, targetZ);

    if (headRef.current && neckRef.current) {
      const headWorldPos = new THREE.Vector3();
      headRef.current.getWorldPosition(headWorldPos);
      const dir = tempTarget.clone().sub(headWorldPos).normalize();

      const yaw = Math.atan2(dir.x, dir.z);
      const pitch = -Math.asin(THREE.MathUtils.clamp(dir.y, -0.6, 0.6));

      const clampedYaw = THREE.MathUtils.clamp(yaw, -1.15, 1.15);
      const clampedPitch = THREE.MathUtils.clamp(pitch, -0.4, 0.45);

      neckRef.current.rotation.y = THREE.MathUtils.damp(
        neckRef.current.rotation.y,
        clampedYaw * 0.35,
        7.0,
        delta
      );
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        clampedYaw * 0.65,
        8.0,
        delta
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        clampedPitch * 0.7,
        8.0,
        delta
      );
    }

    // 3. Arm Pointing IK & Natural Idle Arm Swing
    const p = pointingState.current;
    if (p.active) {
      p.timer -= delta;
      if (p.timer > 0.2) {
        p.blend = THREE.MathUtils.damp(p.blend, 1.0, 10.0, delta);
      } else {
        p.blend = THREE.MathUtils.damp(p.blend, 0.0, 8.0, delta);
      }

      if (p.timer <= 0 && p.blend < 0.02) {
        p.active = false;
        p.blend = 0;
      }
    }

    // Animate Left Arm
    if (leftArmRef.current && leftForearmRef.current) {
      if (p.active && p.arm === "left" && p.blend > 0.01) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          -1.25,
          p.blend
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          0.45,
          p.blend
        );
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftForearmRef.current.rotation.x,
          -0.2,
          p.blend
        );
      } else {
        const idleSwing = !reducedMotion ? Math.sin(time * 1.8) * 0.04 : 0;
        leftArmRef.current.rotation.x = THREE.MathUtils.damp(
          leftArmRef.current.rotation.x,
          0.08 + idleSwing,
          6.0,
          delta
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.damp(
          leftArmRef.current.rotation.z,
          0.18,
          6.0,
          delta
        );
        leftForearmRef.current.rotation.x = THREE.MathUtils.damp(
          leftForearmRef.current.rotation.x,
          0.12,
          6.0,
          delta
        );
      }
    }

    // Animate Right Arm
    if (rightArmRef.current && rightForearmRef.current) {
      if (p.active && p.arm === "right" && p.blend > 0.01) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -1.25,
          p.blend
        );
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          -0.45,
          p.blend
        );
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightForearmRef.current.rotation.x,
          -0.2,
          p.blend
        );
      } else {
        const idleSwing = !reducedMotion ? -Math.sin(time * 1.8) * 0.04 : 0;
        rightArmRef.current.rotation.x = THREE.MathUtils.damp(
          rightArmRef.current.rotation.x,
          0.08 + idleSwing,
          6.0,
          delta
        );
        rightArmRef.current.rotation.z = THREE.MathUtils.damp(
          rightArmRef.current.rotation.z,
          -0.18,
          6.0,
          delta
        );
        rightForearmRef.current.rotation.x = THREE.MathUtils.damp(
          rightForearmRef.current.rotation.x,
          0.12,
          6.0,
          delta
        );
      }
    }

    // 4. Ground Holographic Scan Ring Pulse & Color Shift
    if (auraRingRef.current) {
      const pulseSpeed = isInteracting ? 4.5 : 2.0;
      const pulseScale = 1.0 + Math.sin(time * pulseSpeed) * (isInteracting ? 0.06 : 0.025);
      auraRingRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    if (auraMaterialRef.current) {
      auraMaterialRef.current.opacity = THREE.MathUtils.damp(
        auraMaterialRef.current.opacity,
        isInteracting ? 0.75 : 0.35,
        6.0,
        delta
      );
    }
  });

  // Palette: Dark Charcoal techwear, warm tan skin, golden chain & yellow accent
  const SKIN_COLOR = "#C68A64";
  const SHIRT_COLOR = "#121A24";
  const PANTS_COLOR = "#0D131A";
  const ACCENT_COLOR = "#F2E900";
  const HAIR_COLOR = "#14171A";

  return (
    <group ref={rootRef} position={[0, -0.45, 0]}>
      {/* Soft Contact Ground Shadow under character's feet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* Holographic Pedestal Energy Ring */}
      <mesh
        ref={auraRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, 0]}
      >
        <ringGeometry args={[0.38, 0.44, 48]} />
        <meshBasicMaterial
          ref={auraMaterialRef}
          color={hovered ? ACCENT_COLOR : "#38BDF8"}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Floating Holographic Cyber Badge */}
      <Html position={[0, 1.48, 0]} center distanceFactor={7.5} zIndexRange={[40, 0]}>
        <div className="char-badge">
          <span className="char-badge-dot" />
          <span className="char-badge-text">BRYSON // SWE & CLOUD</span>
        </div>
      </Html>

      {/* Lower Body: Muscular Athletic Legs & Techwear Joggers */}
      {/* Left Leg */}
      <group position={[-0.11, 0.28, 0]}>
        <RoundedBox args={[0.13, 0.54, 0.15]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color={PANTS_COLOR} roughness={0.7} />
        </RoundedBox>
        {/* Left Sneaker */}
        <RoundedBox args={[0.13, 0.08, 0.22]} radius={0.02} smoothness={3} position={[0, -0.25, 0.03]} castShadow>
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.27, 0.03]}>
          <boxGeometry args={[0.135, 0.03, 0.225]} />
          <meshStandardMaterial color={ACCENT_COLOR} roughness={0.5} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.11, 0.28, 0]}>
        <RoundedBox args={[0.13, 0.54, 0.15]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color={PANTS_COLOR} roughness={0.7} />
        </RoundedBox>
        {/* Right Sneaker */}
        <RoundedBox args={[0.13, 0.08, 0.22]} radius={0.02} smoothness={3} position={[0, -0.25, 0.03]} castShadow>
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.27, 0.03]}>
          <boxGeometry args={[0.135, 0.03, 0.225]} />
          <meshStandardMaterial color={ACCENT_COLOR} roughness={0.5} />
        </mesh>
      </group>

      {/* Upper Body Hierarchy: Spine / V-Taper Muscular Torso */}
      <group ref={spineRef} position={[0, 0.58, 0]}>
        {/* Waist & Belt */}
        <RoundedBox args={[0.3, 0.12, 0.19]} radius={0.03} smoothness={3} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={SHIRT_COLOR} roughness={0.6} />
        </RoundedBox>

        {/* Athletic Chest & Broad Pectorals (V-Taper) */}
        <RoundedBox args={[0.42, 0.36, 0.23]} radius={0.04} smoothness={4} position={[0, 0.18, 0]} castShadow>
          <meshStandardMaterial color={SHIRT_COLOR} roughness={0.6} />
        </RoundedBox>

        {/* Stylish Techwear Chest Glyph Emblem */}
        <mesh position={[0, 0.22, 0.12]}>
          <planeGeometry args={[0.14, 0.05]} />
          <meshBasicMaterial color={ACCENT_COLOR} />
        </mesh>
        <mesh position={[0, 0.17, 0.12]}>
          <planeGeometry args={[0.08, 0.018]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        {/* Gold Necklace / Chain Detail */}
        <mesh position={[0, 0.34, 0.09]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.065, 0.007, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Neck Pivot */}
        <group ref={neckRef} position={[0, 0.38, 0]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.078, 0.1, 16]} />
            <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
          </mesh>

          {/* Head Pivot (tracks target with clamped slerp) */}
          <group ref={headRef} position={[0, 0.12, 0]}>
            {/* Jaw / Face Base */}
            <RoundedBox args={[0.22, 0.26, 0.22]} radius={0.06} smoothness={4} castShadow>
              <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
            </RoundedBox>

            {/* Stylized Eyes / Confident Brow */}
            <mesh position={[-0.055, 0.02, 0.112]}>
              <planeGeometry args={[0.038, 0.016]} />
              <meshBasicMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0.055, 0.02, 0.112]}>
              <planeGeometry args={[0.038, 0.016]} />
              <meshBasicMaterial color="#1E293B" />
            </mesh>
            {/* Subtle Eye Highlights */}
            <mesh position={[-0.05, 0.022, 0.114]}>
              <circleGeometry args={[0.004, 8]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0.06, 0.022, 0.114]}>
              <circleGeometry args={[0.004, 8]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>

            {/* Confident Smirk / Smile */}
            <mesh position={[0.015, -0.06, 0.112]} rotation={[0, 0, 0.08]}>
              <planeGeometry args={[0.06, 0.012]} />
              <meshBasicMaterial color="#88422A" />
            </mesh>

            {/* Signature Textured Wavy Dark Hair (from photo) */}
            <RoundedBox args={[0.25, 0.13, 0.25]} radius={0.05} smoothness={4} position={[0, 0.11, -0.01]} castShadow>
              <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.23, 0.08, 0.11]} radius={0.03} smoothness={4} position={[0, 0.1, 0.09]} castShadow>
              <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} />
            </RoundedBox>
            {[
              { pos: [-0.06, 0.17, 0.03], rot: [0.1, 0.2, 0.15], scale: [0.1, 0.06, 0.1] },
              { pos: [0.04, 0.18, 0.02], rot: [-0.1, -0.2, -0.1], scale: [0.12, 0.07, 0.11] },
              { pos: [0.0, 0.17, -0.05], rot: [0, 0, 0], scale: [0.16, 0.06, 0.12] },
            ].map((lock, idx) => (
              <RoundedBox
                key={idx}
                args={lock.scale}
                radius={0.02}
                smoothness={3}
                position={lock.pos}
                rotation={lock.rot}
                castShadow
              >
                <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} />
              </RoundedBox>
            ))}
          </group>
        </group>

        {/* LEFT ARM (Muscular Deltoid, Bicep, Forearm, Hand) */}
        <group position={[-0.26, 0.32, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={SHIRT_COLOR} roughness={0.6} />
          </mesh>

          <group ref={leftArmRef}>
            <RoundedBox args={[0.1, 0.24, 0.1]} radius={0.03} smoothness={3} position={[0, -0.11, 0]} castShadow>
              <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
            </RoundedBox>

            <group ref={leftForearmRef} position={[0, -0.22, 0]}>
              <RoundedBox args={[0.085, 0.22, 0.085]} radius={0.025} smoothness={3} position={[0, -0.1, 0]} castShadow>
                <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
              </RoundedBox>

              {/* Stylish Black Smartwatch on Left Wrist (from photo) */}
              <group position={[0, -0.18, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.052, 0.052, 0.035, 20]} />
                  <meshStandardMaterial color="#0B0F14" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.05]}>
                  <planeGeometry args={[0.032, 0.028]} />
                  <meshBasicMaterial color="#38BDF8" />
                </mesh>
              </group>

              {/* Hand & Pointing Finger */}
              <group position={[0, -0.24, 0]}>
                <RoundedBox args={[0.065, 0.08, 0.04]} radius={0.015} smoothness={3} castShadow>
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </RoundedBox>
                <mesh position={[0, -0.055, 0.015]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.05, 12]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* RIGHT ARM (Muscular Deltoid, Bicep, Forearm, Hand) */}
        <group position={[0.26, 0.32, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={SHIRT_COLOR} roughness={0.6} />
          </mesh>

          <group ref={rightArmRef}>
            <RoundedBox args={[0.1, 0.24, 0.1]} radius={0.03} smoothness={3} position={[0, -0.11, 0]} castShadow>
              <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
            </RoundedBox>

            <group ref={rightForearmRef} position={[0, -0.22, 0]}>
              <RoundedBox args={[0.085, 0.22, 0.085]} radius={0.025} smoothness={3} position={[0, -0.1, 0]} castShadow>
                <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
              </RoundedBox>

              {/* Hand & Pointing Finger */}
              <group position={[0, -0.24, 0]}>
                <RoundedBox args={[0.065, 0.08, 0.04]} radius={0.015} smoothness={3} castShadow>
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </RoundedBox>
                <mesh position={[0, -0.055, 0.015]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.05, 12]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
