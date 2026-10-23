import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

// Precise 3D station coordinates for head-tracking & arm-pointing
const STATION_COORDINATES = {
  projects: new THREE.Vector3(-1.86, 0.45, -1.08),
  systems: new THREE.Vector3(0.0, 0.55, -2.15),
  resume: new THREE.Vector3(1.86, 0.35, -1.08),
  creative: new THREE.Vector3(1.86, 0.45, 1.08),
  about: new THREE.Vector3(0.0, 0.25, 2.15),
  github: new THREE.Vector3(-1.86, 0.35, 1.08),
};

// Detailed, Muscular, Stylish 3D Avatar of Bryson (Modeled directly after photo)
export function Character({
  hovered,
  clickedStation,
  reducedMotion = false,
}) {
  const rootRef = useRef();
  const spineRef = useRef();
  const chestRef = useRef();
  const neckRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const auraRingRef = useRef();
  const auraMaterialRef = useRef();

  // Internal state for arm pointing IK animation
  const pointingState = useRef({
    active: false,
    arm: null,
    timer: 0,
    blend: 0,
  });

  // Smooth mouse tracking coordinates
  const smoothTarget = useRef(new THREE.Vector3(0, 0.8, 3.5));

  // Trigger arm pointing when any station is clicked
  useEffect(() => {
    if (!clickedStation || !STATION_COORDINATES[clickedStation]) return;

    const target = STATION_COORDINATES[clickedStation];
    const isLeft = target.x < 0;

    pointingState.current = {
      active: true,
      arm: isLeft ? "left" : "right",
      timer: 1.25, // Point gesture duration
      blend: 0,
    };
  }, [clickedStation]);

  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const headWorldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const pointer = state.pointer; // Built-in R3F NDC coordinates [-1 to +1]
    const isInteracting = !!hovered || pointingState.current.active;

    // 1. Natural Breathing & Athletic Stance Idle Motion
    if (spineRef.current) {
      if (!reducedMotion) {
        const breath = Math.sin(time * 2.2) * 0.014;
        const subtleWeightShift = Math.cos(time * 1.1) * 0.012;
        spineRef.current.position.y = 0.58 + breath;
        spineRef.current.rotation.z = subtleWeightShift;
      } else {
        spineRef.current.position.y = 0.58;
        spineRef.current.rotation.z = 0;
      }
    }

    // 2. Dynamic Mouse & Station Target Tracking
    let targetX = 0;
    let targetY = 0.8;
    let targetZ = 3.2;

    if (hovered && STATION_COORDINATES[hovered]) {
      // Prioritize hovered 3D station or dock button
      const stationPos = STATION_COORDINATES[hovered];
      targetX = stationPos.x;
      targetY = stationPos.y;
      targetZ = stationPos.z;
    } else if (pointer && (Math.abs(pointer.x) > 0.001 || Math.abs(pointer.y) > 0.001)) {
      // Unprojected mouse position across the 3D desk plane (continuous smooth tracking)
      targetX = pointer.x * 3.8;
      targetY = 0.45 - pointer.y * 1.2;
      targetZ = -pointer.y * 2.8 + 1.4;
    }

    tempTarget.set(targetX, targetY, targetZ);

    // Damped interpolation to current target point
    smoothTarget.current.lerp(tempTarget, Math.min(delta * 12.0, 1.0));

    // 3. Multi-Bone Natural Head, Neck, Torso & Eye Tracking
    if (headRef.current && neckRef.current) {
      headRef.current.getWorldPosition(headWorldPos);
      const dir = smoothTarget.current.clone().sub(headWorldPos).normalize();

      const yaw = Math.atan2(dir.x, dir.z);
      const pitch = -Math.asin(THREE.MathUtils.clamp(dir.y, -0.65, 0.65));

      // Natural physiological angle limits (clamped so neck never over-twists)
      const clampedYaw = THREE.MathUtils.clamp(yaw, -1.25, 1.25);
      const clampedPitch = THREE.MathUtils.clamp(pitch, -0.45, 0.48);

      // Torso slight follow-through rotation (15%)
      if (chestRef.current) {
        chestRef.current.rotation.y = THREE.MathUtils.damp(
          chestRef.current.rotation.y,
          clampedYaw * 0.15,
          6.0,
          delta
        );
      }

      // Neck rotation (30%)
      neckRef.current.rotation.y = THREE.MathUtils.damp(
        neckRef.current.rotation.y,
        clampedYaw * 0.3,
        8.0,
        delta
      );

      // Head primary rotation (55%)
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        clampedYaw * 0.55,
        10.0,
        delta
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        clampedPitch * 0.75,
        10.0,
        delta
      );

      // Micro-saccades for eyes
      const eyeYaw = THREE.MathUtils.clamp(yaw * 0.2, -0.15, 0.15);
      const eyePitch = THREE.MathUtils.clamp(pitch * 0.2, -0.12, 0.12);
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.position.x = -0.055 + eyeYaw * 0.015;
        leftEyeRef.current.position.y = 0.02 - eyePitch * 0.01;
        rightEyeRef.current.position.x = 0.055 + eyeYaw * 0.015;
        rightEyeRef.current.position.y = 0.02 - eyePitch * 0.01;
      }
    }

    // 4. Arm Pointing IK & Natural Idle Arm Swing
    const p = pointingState.current;
    if (p.active) {
      p.timer -= delta;
      if (p.timer > 0.25) {
        p.blend = THREE.MathUtils.damp(p.blend, 1.0, 11.0, delta);
      } else {
        p.blend = THREE.MathUtils.damp(p.blend, 0.0, 8.0, delta);
      }

      if (p.timer <= 0 && p.blend < 0.02) {
        p.active = false;
        p.blend = 0;
      }
    }

    // Left Arm Pointing or Athletic Idle
    if (leftArmRef.current && leftForearmRef.current) {
      if (p.active && p.arm === "left" && p.blend > 0.01) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          -1.28,
          p.blend
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          0.48,
          p.blend
        );
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftForearmRef.current.rotation.x,
          -0.22,
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
          0.16,
          6.0,
          delta
        );
        leftForearmRef.current.rotation.x = THREE.MathUtils.damp(
          leftForearmRef.current.rotation.x,
          0.14,
          6.0,
          delta
        );
      }
    }

    // Right Arm Pointing or Athletic Idle
    if (rightArmRef.current && rightForearmRef.current) {
      if (p.active && p.arm === "right" && p.blend > 0.01) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -1.28,
          p.blend
        );
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          -0.48,
          p.blend
        );
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightForearmRef.current.rotation.x,
          -0.22,
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
          -0.16,
          6.0,
          delta
        );
        rightForearmRef.current.rotation.x = THREE.MathUtils.damp(
          rightForearmRef.current.rotation.x,
          0.14,
          6.0,
          delta
        );
      }
    }

    // 5. Holographic Pedestal Pulse
    if (auraRingRef.current) {
      const pulseSpeed = isInteracting ? 5.0 : 2.2;
      const pulseScale = 1.0 + Math.sin(time * pulseSpeed) * (isInteracting ? 0.07 : 0.025);
      auraRingRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    if (auraMaterialRef.current) {
      auraMaterialRef.current.opacity = THREE.MathUtils.damp(
        auraMaterialRef.current.opacity,
        isInteracting ? 0.8 : 0.38,
        6.0,
        delta
      );
    }
  });

  // Authentic Color Palette extracted from Bryson's photo
  const SKIN_COLOR = "#C48862"; // Warm olive/tan Indian skin tone
  const SHIRT_GREEN = "#2D614A"; // Exact forest/sage green athletic t-shirt from photo
  const GRAPHIC_CREAM = "#D8C5A2"; // Vintage chest graphic print
  const GRAPHIC_ORANGE = "#E0834B"; // Mountain stripe accent
  const PANTS_NAVY = "#172030"; // Deep navy blue athletic shorts/sweatpants
  const STRIPE_WHITE = "#FFFFFF"; // Athletic white side-stripe from photo
  const HAIR_BLACK = "#121417"; // Rich dark curly hair
  const GOLD_CHAIN = "#F59E0B"; // Gold chain necklace around neck

  return (
    <group ref={rootRef} position={[0, -0.45, 0]}>
      {/* Soft Contact Ground Shadow under feet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
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
          color={hovered ? "#F2E900" : "#38BDF8"}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Floating Holographic Cyber Badge */}
      <Html position={[0, 1.48, 0]} center distanceFactor={7.5} zIndexRange={[40, 0]}>
        <div className="char-badge">
          <span className="char-badge-dot" />
          <span className="char-badge-text">BRYSON // ENG & CLOUD</span>
        </div>
      </Html>

      {/* Lower Body: Athletic Navy Shorts with White Side Stripe (as in photo) */}
      {/* Left Leg */}
      <group position={[-0.115, 0.28, 0]}>
        <RoundedBox args={[0.13, 0.54, 0.15]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color={PANTS_NAVY} roughness={0.7} />
        </RoundedBox>
        {/* Athletic White Stripe on outer seam */}
        <mesh position={[-0.066, 0, 0]}>
          <planeGeometry args={[0.024, 0.52]} />
          <meshBasicMaterial color={STRIPE_WHITE} />
        </mesh>
        {/* Left Sneaker */}
        <RoundedBox args={[0.13, 0.08, 0.22]} radius={0.02} smoothness={3} position={[0, -0.25, 0.03]} castShadow>
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.27, 0.03]}>
          <boxGeometry args={[0.135, 0.03, 0.225]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.115, 0.28, 0]}>
        <RoundedBox args={[0.13, 0.54, 0.15]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color={PANTS_NAVY} roughness={0.7} />
        </RoundedBox>
        {/* Athletic White Stripe on outer seam */}
        <mesh position={[0.066, 0, 0]}>
          <planeGeometry args={[0.024, 0.52]} />
          <meshBasicMaterial color={STRIPE_WHITE} />
        </mesh>
        {/* Right Sneaker */}
        <RoundedBox args={[0.13, 0.08, 0.22]} radius={0.02} smoothness={3} position={[0, -0.25, 0.03]} castShadow>
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, -0.27, 0.03]}>
          <boxGeometry args={[0.135, 0.03, 0.225]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
      </group>

      {/* Upper Body Hierarchy: Spine / Muscular Athletic V-Taper Torso */}
      <group ref={spineRef} position={[0, 0.58, 0]}>
        {/* Waist & Belt */}
        <RoundedBox args={[0.31, 0.12, 0.19]} radius={0.03} smoothness={3} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
        </RoundedBox>

        {/* Chest & Broad Athletic Shoulders (V-Taper) */}
        <group ref={chestRef}>
          <RoundedBox args={[0.43, 0.36, 0.23]} radius={0.04} smoothness={4} position={[0, 0.18, 0]} castShadow>
            <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
          </RoundedBox>

          {/* Authentic Chest Graphic Print (from photo) */}
          <group position={[0, 0.19, 0.118]}>
            <mesh position={[0, 0.03, 0]}>
              <planeGeometry args={[0.22, 0.04]} />
              <meshBasicMaterial color={GRAPHIC_CREAM} />
            </mesh>
            <mesh position={[0, -0.015, 0]}>
              <planeGeometry args={[0.18, 0.02]} />
              <meshBasicMaterial color={GRAPHIC_ORANGE} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <planeGeometry args={[0.12, 0.012]} />
              <meshBasicMaterial color={GRAPHIC_CREAM} />
            </mesh>
          </group>

          {/* Crew-Neck Collar Trim */}
          <mesh position={[0, 0.355, 0.03]} rotation={[0.3, 0, 0]}>
            <torusGeometry args={[0.088, 0.014, 12, 28, Math.PI * 1.3]} />
            <meshStandardMaterial color="#214A37" roughness={0.8} />
          </mesh>

          {/* Gold Chain Necklace (from photo) */}
          <mesh position={[0, 0.34, 0.085]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.068, 0.007, 12, 24, Math.PI]} />
            <meshStandardMaterial color={GOLD_CHAIN} metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Neck Pivot */}
          <group ref={neckRef} position={[0, 0.38, 0]}>
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.072, 0.08, 0.11, 16]} />
              <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
            </mesh>

            {/* Head Pivot (follows mouse & stations with fluid damped tracking) */}
            <group ref={headRef} position={[0, 0.12, 0]}>
              {/* Jaw & Sculpted Facial Structure */}
              <RoundedBox args={[0.22, 0.26, 0.22]} radius={0.06} smoothness={4} castShadow>
                <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
              </RoundedBox>

              {/* Sculpted Nose Bridge & Tip */}
              <group position={[0, -0.01, 0.115]}>
                <mesh>
                  <boxGeometry args={[0.024, 0.06, 0.025]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                </mesh>
                <mesh position={[0, -0.025, 0.01]}>
                  <sphereGeometry args={[0.018, 12, 12]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                </mesh>
              </group>

              {/* Expressive Almond Eyes & Pupils */}
              <group ref={leftEyeRef} position={[-0.055, 0.02, 0.112]}>
                <mesh>
                  <planeGeometry args={[0.038, 0.018]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                {/* Iris & Pupil */}
                <mesh position={[0, 0, 0.002]}>
                  <circleGeometry args={[0.011, 16]} />
                  <meshBasicMaterial color="#1E1611" />
                </mesh>
                <mesh position={[0.003, 0.003, 0.004]}>
                  <circleGeometry args={[0.0035, 8]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                {/* Eyebrow */}
                <mesh position={[0, 0.018, 0.002]} rotation={[0, 0, -0.05]}>
                  <planeGeometry args={[0.044, 0.01]} />
                  <meshBasicMaterial color="#0A0D11" />
                </mesh>
              </group>

              <group ref={rightEyeRef} position={[0.055, 0.02, 0.112]}>
                <mesh>
                  <planeGeometry args={[0.038, 0.018]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                  <circleGeometry args={[0.011, 16]} />
                  <meshBasicMaterial color="#1E1611" />
                </mesh>
                <mesh position={[0.003, 0.003, 0.004]}>
                  <circleGeometry args={[0.0035, 8]} />
                  <meshBasicMaterial color="#FFFFFF" />
                </mesh>
                {/* Eyebrow */}
                <mesh position={[0, 0.018, 0.002]} rotation={[0, 0, 0.05]}>
                  <planeGeometry args={[0.044, 0.01]} />
                  <meshBasicMaterial color="#0A0D11" />
                </mesh>
              </group>

              {/* Confident Smirk / Smile (from photo) */}
              <mesh position={[0.012, -0.065, 0.112]} rotation={[0, 0, 0.08]}>
                <planeGeometry args={[0.065, 0.014]} />
                <meshBasicMaterial color="#88422A" />
              </mesh>

              {/* Sculpted Ears */}
              <group position={[-0.118, 0, 0]} rotation={[0, -0.15, 0]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.02, 0.04, 8, 12]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </mesh>
              </group>
              <group position={[0.118, 0, 0]} rotation={[0, 0.15, 0]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.02, 0.04, 8, 12]} />
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.7} />
                </mesh>
              </group>

              {/* Signature Voluminous Wavy/Curly Dark Hair (Modeled directly after photo) */}
              {/* Hair Base Crown Dome */}
              <RoundedBox args={[0.26, 0.14, 0.25]} radius={0.06} smoothness={4} position={[0, 0.12, -0.01]} castShadow>
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.92} />
              </RoundedBox>

              {/* Front Curly Fringe Waves falling softly over forehead */}
              <RoundedBox args={[0.24, 0.09, 0.12]} radius={0.04} smoothness={4} position={[0, 0.11, 0.09]} castShadow>
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.92} />
              </RoundedBox>
              <RoundedBox args={[0.14, 0.06, 0.07]} radius={0.025} smoothness={3} position={[-0.04, 0.07, 0.12]} rotation={[0.15, -0.1, 0.2]} castShadow>
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.92} />
              </RoundedBox>
              <RoundedBox args={[0.12, 0.06, 0.07]} radius={0.025} smoothness={3} position={[0.05, 0.08, 0.12]} rotation={[0.1, 0.15, -0.15]} castShadow>
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.92} />
              </RoundedBox>

              {/* Voluminous Top Curls (Bouncy Textured Waves) */}
              {[
                { pos: [-0.07, 0.19, 0.04], rot: [0.12, 0.25, 0.2], scale: [0.11, 0.07, 0.11] },
                { pos: [0.05, 0.2, 0.03], rot: [-0.1, -0.22, -0.15], scale: [0.13, 0.08, 0.12] },
                { pos: [0.0, 0.19, -0.05], rot: [0.05, 0.1, 0], scale: [0.18, 0.07, 0.13] },
                { pos: [-0.08, 0.17, -0.04], rot: [-0.1, 0.3, 0.1], scale: [0.1, 0.06, 0.1] },
                { pos: [0.08, 0.17, -0.03], rot: [0.1, -0.3, -0.1], scale: [0.1, 0.06, 0.1] },
              ].map((lock, idx) => (
                <RoundedBox
                  key={idx}
                  args={lock.scale}
                  radius={0.025}
                  smoothness={3}
                  position={lock.pos}
                  rotation={lock.rot}
                  castShadow
                >
                  <meshStandardMaterial color={HAIR_BLACK} roughness={0.92} />
                </RoundedBox>
              ))}

              {/* Sideburns tapering down the sides */}
              <mesh position={[-0.114, 0.03, 0.04]} castShadow>
                <boxGeometry args={[0.015, 0.09, 0.05]} />
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.9} />
              </mesh>
              <mesh position={[0.114, 0.03, 0.04]} castShadow>
                <boxGeometry args={[0.015, 0.09, 0.05]} />
                <meshStandardMaterial color={HAIR_BLACK} roughness={0.9} />
              </mesh>
            </group>
          </group>

          {/* LEFT ARM (Muscular Athletic Deltoid, Bicep Peak, Forearm & Sports Watch) */}
          <group position={[-0.265, 0.32, 0]}>
            {/* Muscular Deltoid (Shoulder Cap) */}
            <mesh castShadow>
              <sphereGeometry args={[0.088, 16, 16]} />
              <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
            </mesh>

            <group ref={leftArmRef}>
              {/* Athletic Sleeve Cut */}
              <RoundedBox args={[0.11, 0.08, 0.11]} radius={0.025} smoothness={3} position={[0, -0.04, 0]} castShadow>
                <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
              </RoundedBox>
              {/* Sculpted Muscular Bicep & Tricep */}
              <RoundedBox args={[0.1, 0.18, 0.1]} radius={0.03} smoothness={4} position={[0, -0.13, 0]} castShadow>
                <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
              </RoundedBox>

              {/* Forearm Pivot */}
              <group ref={leftForearmRef} position={[0, -0.22, 0]}>
                <RoundedBox args={[0.088, 0.22, 0.088]} radius={0.025} smoothness={4} position={[0, -0.1, 0]} castShadow>
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                </RoundedBox>

                {/* Black Sports Watch on Left Wrist (from photo) */}
                <group position={[0, -0.18, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.055, 0.055, 0.04, 24]} />
                    <meshStandardMaterial color="#0A0E13" metalness={0.8} roughness={0.25} />
                  </mesh>
                  {/* Digital Display Screen */}
                  <mesh position={[0, 0, 0.052]}>
                    <planeGeometry args={[0.034, 0.03]} />
                    <meshBasicMaterial color="#38BDF8" />
                  </mesh>
                </group>

                {/* Muscular Hand & Pointing Finger */}
                <group position={[0, -0.24, 0]}>
                  <RoundedBox args={[0.068, 0.08, 0.045]} radius={0.015} smoothness={3} castShadow>
                    <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                  </RoundedBox>
                  {/* Index Finger for Pointing */}
                  <mesh position={[0, -0.055, 0.015]}>
                    <cylinderGeometry args={[0.011, 0.011, 0.052, 12]} />
                    <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>

          {/* RIGHT ARM (Muscular Athletic Deltoid, Bicep, Forearm) */}
          <group position={[0.265, 0.32, 0]}>
            {/* Muscular Deltoid */}
            <mesh castShadow>
              <sphereGeometry args={[0.088, 16, 16]} />
              <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
            </mesh>

            <group ref={rightArmRef}>
              {/* Sleeve Cut */}
              <RoundedBox args={[0.11, 0.08, 0.11]} radius={0.025} smoothness={3} position={[0, -0.04, 0]} castShadow>
                <meshStandardMaterial color={SHIRT_GREEN} roughness={0.65} />
              </RoundedBox>
              {/* Muscular Bicep */}
              <RoundedBox args={[0.1, 0.18, 0.1]} radius={0.03} smoothness={4} position={[0, -0.13, 0]} castShadow>
                <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
              </RoundedBox>

              {/* Forearm Pivot */}
              <group ref={rightForearmRef} position={[0, -0.22, 0]}>
                <RoundedBox args={[0.088, 0.22, 0.088]} radius={0.025} smoothness={4} position={[0, -0.1, 0]} castShadow>
                  <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                </RoundedBox>

                {/* Hand & Pointing Finger */}
                <group position={[0, -0.24, 0]}>
                  <RoundedBox args={[0.068, 0.08, 0.045]} radius={0.015} smoothness={3} castShadow>
                    <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                  </RoundedBox>
                  <mesh position={[0, -0.055, 0.015]}>
                    <cylinderGeometry args={[0.011, 0.011, 0.052, 12]} />
                    <meshStandardMaterial color={SKIN_COLOR} roughness={0.65} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
