import { useRef, useEffect } from "react";
import "./DoodleCharacter.css";

// Station screen directions for pointing and looking
const STATION_DIRECTIONS = {
  projects: { x: -180, y: -80, arm: "left", bubble: "Selected Projects! 💻" },
  systems: { x: 0, y: -200, arm: "left", bubble: "Cloud & Systems! ☁️" },
  resume: { x: 180, y: -80, arm: "right", bubble: "Curriculum Vitae! 📄" },
  creative: { x: 160, y: 100, arm: "right", bubble: "Video & Media! 🎥" },
  about: { x: 0, y: 160, arm: "left", bubble: "About Bryson! 🪪" },
  github: { x: -160, y: 100, arm: "left", bubble: "Live Repositories! ⚡" },
};

export function DoodleCharacter({
  posRef,
  hovered,
  clickedStation,
  reducedMotion = false,
  isStatic = false,
}) {
  const containerRef = useRef(null);

  // Animation Refs for direct 60fps transform manipulation (no React re-renders)
  const headGroupRef = useRef(null);
  const hairGroupRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const eyelidsRef = useRef(null);
  const mouthRef = useRef(null);
  const browsRef = useRef(null);
  const torsoRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const auraRef = useRef(null);

  // Speech bubble DOM refs for zero-re-render high performance updates
  const speechWrapRef = useRef(null);
  const speechTextRef = useRef(null);
  const bubbleTimeoutRef = useRef(null);

  // Target and current animated values
  const animState = useRef({
    mouseX: 0,
    mouseY: 0,
    currHeadRot: 0,
    currHeadTilt: 0,
    currTorsoRot: 0,
    currPupilX: 0,
    currPupilY: 0,
    currHairLag: 0,
    pointingArm: null, // "left" or "right"
    pointingAngle: 0,
    pointingBlend: 0,
    pointingTimer: 0,
    isBlinking: false,
    blinkTimer: 3.5,
    idleTimer: 0,
  });

  // Handle station click speech bubbles and pointing
  useEffect(() => {
    if (!clickedStation) return;
    const info = STATION_DIRECTIONS[clickedStation];
    if (info) {
      if (speechTextRef.current) speechTextRef.current.innerText = info.bubble;
      if (speechWrapRef.current) speechWrapRef.current.classList.add("visible");

      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => {
        if (speechWrapRef.current) speechWrapRef.current.classList.remove("visible");
      }, 2000);

      // Trigger arm pointing
      animState.current.pointingArm = info.arm;
      animState.current.pointingAngle = Math.atan2(info.y, info.x) * (180 / Math.PI);
      animState.current.pointingTimer = 1.25;
      animState.current.pointingBlend = 0;
    }
  }, [clickedStation]);

  // Handle station hover reactions
  useEffect(() => {
    if (hovered && STATION_DIRECTIONS[hovered]) {
      if (speechTextRef.current) speechTextRef.current.innerText = STATION_DIRECTIONS[hovered].bubble;
      if (speechWrapRef.current) speechWrapRef.current.classList.add("visible");
    } else {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => {
        if (speechWrapRef.current) speechWrapRef.current.classList.remove("visible");
      }, 1200);
    }
  }, [hovered]);

  // Global mouse tracking
  useEffect(() => {
    const handlePointerMove = (e) => {
      animState.current.mouseX = e.clientX;
      animState.current.mouseY = e.clientY;
      animState.current.idleTimer = 0;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Main 60 FPS Animation Loop
  useEffect(() => {
    let reqId;
    let lastTime = performance.now();

    const loop = (now) => {
      reqId = requestAnimationFrame(loop);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = animState.current;
      s.idleTimer += delta;

      // Update 2D screen anchoring from 3D camera projection
      if (containerRef.current && posRef?.current) {
        const { x, y, scale } = posRef.current;
        containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -90%) scale(${scale})`;
      }

      // Calculate vector from character head to mouse cursor
      let targetDx = 0;
      let targetDy = 0;

      if (hovered && STATION_DIRECTIONS[hovered]) {
        targetDx = STATION_DIRECTIONS[hovered].x;
        targetDy = STATION_DIRECTIONS[hovered].y;
      } else if (containerRef.current && s.idleTimer < 5.0 && s.mouseX > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.35;
        targetDx = s.mouseX - centerX;
        targetDy = s.mouseY - centerY;
      }

      const dist = Math.hypot(targetDx, targetDy);
      const angle = Math.atan2(targetDy, targetDx);

      // 1. Clamped Eye Pupil Following
      const maxPupilRadius = 4.2;
      const targetPupilX = dist > 2 ? Math.min(dist / 35, maxPupilRadius) * Math.cos(angle) : 0;
      const targetPupilY = dist > 2 ? Math.min(dist / 45, maxPupilRadius * 0.7) * Math.sin(angle) : 0;
      s.currPupilX += (targetPupilX - s.currPupilX) * 0.22;
      s.currPupilY += (targetPupilY - s.currPupilY) * 0.22;

      if (leftPupilRef.current && rightPupilRef.current) {
        leftPupilRef.current.setAttribute("transform", `translate(${s.currPupilX}, ${s.currPupilY})`);
        rightPupilRef.current.setAttribute("transform", `translate(${s.currPupilX}, ${s.currPupilY})`);
      }

      // 2. Head Tilt & Rotation
      const targetHeadRot = Math.max(-14, Math.min(14, targetDx / 32));
      const targetHeadTilt = Math.max(-10, Math.min(10, targetDy / 42));
      s.currHeadRot += (targetHeadRot - s.currHeadRot) * 0.14;
      s.currHeadTilt += (targetHeadTilt - s.currHeadTilt) * 0.14;

      if (headGroupRef.current) {
        headGroupRef.current.setAttribute(
          "transform",
          `translate(140, 120) rotate(${s.currHeadRot}) translate(-140, -120)`
        );
      }

      // 3. Hair Secondary Spring Physics (lags behind head rotation)
      s.currHairLag += (s.currHeadRot - s.currHairLag) * 0.08;
      if (hairGroupRef.current) {
        hairGroupRef.current.setAttribute(
          "transform",
          `translate(140, 70) rotate(${-s.currHairLag * 0.3}) translate(-140, -70)`
        );
      }

      // 4. Torso Idle Breathing & Lean
      const targetTorsoRot = Math.max(-4, Math.min(4, targetDx / 85));
      s.currTorsoRot += (targetTorsoRot - s.currTorsoRot) * 0.1;
      const breathScale = !reducedMotion ? 1.0 + Math.sin(now * 0.0024) * 0.015 : 1.0;

      if (torsoRef.current) {
        torsoRef.current.setAttribute(
          "transform",
          `translate(140, 205) rotate(${s.currTorsoRot}) scale(1, ${breathScale}) translate(-140, -205)`
        );
      }

      // 5. Eyebrows & Mouth Expression on Hover
      if (browsRef.current) {
        const browLift = hovered ? -4 : 0;
        browsRef.current.setAttribute("transform", `translate(0, ${browLift})`);
      }
      if (mouthRef.current) {
        const mouthScale = hovered ? 1.15 : 1.0;
        mouthRef.current.setAttribute("transform", `translate(140, 134) scale(${mouthScale}) translate(-140, -134)`);
      }

      // 6. Arm Pointing IK & Natural Idle Stance
      if (s.pointingTimer > 0) {
        s.pointingTimer -= delta;
        if (s.pointingTimer > 0.25) {
          s.pointingBlend += (1.0 - s.pointingBlend) * 0.2;
        } else {
          s.pointingBlend += (0.0 - s.pointingBlend) * 0.16;
        }
      } else {
        s.pointingBlend += (0.0 - s.pointingBlend) * 0.16;
      }

      // Left Arm
      if (leftArmRef.current) {
        if (s.pointingArm === "left" && s.pointingBlend > 0.01) {
          const targetArmAngle = s.pointingAngle - 180;
          const armRot = THREE_lerp(0, targetArmAngle, s.pointingBlend);
          leftArmRef.current.setAttribute(
            "transform",
            `translate(96, 162) rotate(${armRot}) translate(-96, -162)`
          );
        } else {
          const idleArm = !reducedMotion ? Math.sin(now * 0.002) * 3 : 0;
          leftArmRef.current.setAttribute(
            "transform",
            `translate(96, 162) rotate(${idleArm}) translate(-96, -162)`
          );
        }
      }

      // Right Arm
      if (rightArmRef.current) {
        if (s.pointingArm === "right" && s.pointingBlend > 0.01) {
          const armRot = THREE_lerp(0, s.pointingAngle, s.pointingBlend);
          rightArmRef.current.setAttribute(
            "transform",
            `translate(184, 162) rotate(${armRot}) translate(-184, -162)`
          );
        } else {
          const idleArm = !reducedMotion ? -Math.sin(now * 0.002) * 3 : 0;
          rightArmRef.current.setAttribute(
            "transform",
            `translate(184, 162) rotate(${idleArm}) translate(-184, -162)`
          );
        }
      }

      // 7. Random Eye Blink Routine (every 3.5 to 5.5s)
      s.blinkTimer -= delta;
      if (s.blinkTimer <= 0) {
        s.isBlinking = true;
        s.blinkTimer = 3.2 + Math.random() * 2.8;
        setTimeout(() => {
          s.isBlinking = false;
        }, 130);
      }
      if (eyelidsRef.current) {
        eyelidsRef.current.style.opacity = s.isBlinking ? "1" : "0";
      }

      // 8. Glowing Yellow Foot Aura Pulse
      if (auraRef.current) {
        const auraPulse = 1.0 + Math.sin(now * 0.004) * (hovered ? 0.12 : 0.05);
        auraRef.current.setAttribute(
          "transform",
          `translate(140, 298) scale(${auraPulse}) translate(-140, -298)`
        );
      }
    };

    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [hovered, reducedMotion, posRef]);

  return (
    <div className={`doodle-container ${isStatic ? "static" : ""}`} ref={containerRef}>
      {/* Speech Bubble Doodle */}
      <div className="doodle-speech-wrap" ref={speechWrapRef}>
        <div className="doodle-speech-bubble">
          <span>💬</span>
          <span ref={speechTextRef}>Hey! Explore my desk ✨</span>
        </div>
      </div>

      {/* Floating Nametag */}
      <div className="doodle-nametag">
        <span className="doodle-nametag-dot" />
        <span>BRYSON // ENG</span>
      </div>

      {/* Main Vector Illustration SVG */}
      <svg
        className="doodle-svg"
        viewBox="0 0 280 330"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for Cel-Shading */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C88E68" />
            <stop offset="100%" stopColor="#BA7F5A" />
          </linearGradient>
          <linearGradient id="teeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#346F55" />
            <stop offset="100%" stopColor="#25513D" />
          </linearGradient>
          <linearGradient id="shortsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E2B40" />
            <stop offset="100%" stopColor="#131B29" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C232E" />
            <stop offset="100%" stopColor="#0E1217" />
          </linearGradient>
        </defs>

        {/* 1. Ground Drop Shadow & Glowing Yellow Energy Aura Ring */}
        <ellipse
          cx="140"
          cy="300"
          rx="58"
          ry="15"
          fill="rgba(0,0,0,0.4)"
        />
        <ellipse
          ref={auraRef}
          cx="140"
          cy="298"
          rx="52"
          ry="14"
          fill="none"
          stroke={hovered ? "#F2E900" : "#38BDF8"}
          strokeWidth="3.5"
          strokeDasharray="6 4"
          opacity={hovered ? "0.9" : "0.45"}
        />

        {/* 2. Lower Body: Athletic Navy Shorts with White Side Stripe & Sneakers */}
        <g id="doodle-legs">
          {/* Left Leg */}
          <rect
            x="115"
            y="235"
            width="20"
            height="46"
            rx="10"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
          />
          {/* Right Leg */}
          <rect
            x="145"
            y="235"
            width="20"
            height="46"
            rx="10"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
          />
          {/* Left Sneaker */}
          <path
            d="M106 276 Q125 272 138 276 L138 290 Q122 292 104 290 Z"
            fill="#FFFFFF"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M104 286 L138 286" stroke="#25513D" strokeWidth="2.5" />
          {/* Right Sneaker */}
          <path
            d="M142 276 Q155 272 174 276 L176 290 Q158 292 142 290 Z"
            fill="#FFFFFF"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M142 286 L176 286" stroke="#25513D" strokeWidth="2.5" />

          {/* Navy Shorts */}
          <path
            d="M110 206 L170 206 L174 246 Q157 248 144 242 L140 240 L136 242 Q123 248 106 246 Z"
            fill="url(#shortsGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* White Athletic Side Stripes (from photo) */}
          <path d="M112 210 L108 244" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M168 210 L172 244" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 3. Upper Body: Forest Green Crew-Neck Tee & Chest Graphic */}
        <g id="doodle-torso" ref={torsoRef}>
          {/* Main Athletic Torso */}
          <path
            d="M100 152 Q140 148 180 152 L172 212 Q140 216 108 212 Z"
            fill="url(#teeGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Vintage Mountain Wave Chest Graphic (from photo) */}
          <path
            d="M118 178 Q128 172 140 178 Q152 172 162 178"
            fill="none"
            stroke="#DFCEAC"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M122 184 Q131 180 140 184 Q149 180 158 184"
            fill="none"
            stroke="#E28348"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Crew-Neckline Collar */}
          <path
            d="M126 150 Q140 159 154 150"
            fill="none"
            stroke="#1D4030"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Thin Gold Chain Necklace (from photo) */}
          <path
            d="M130 153 Q140 162 150 153"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* 4. Left Arm & Smartwatch (Pivot at shoulder: 96, 162) */}
        <g id="doodle-arm-left" ref={leftArmRef}>
          {/* Left Sleeve */}
          <path
            d="M104 152 L90 162 L97 178 L108 170 Z"
            fill="url(#teeGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Muscular Left Arm */}
          <path
            d="M93 172 Q86 195 86 215 Q86 226 94 225 Q102 224 100 205 Q102 185 98 172 Z"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Black Sports Watch on Left Wrist (from photo) */}
          <rect
            x="84"
            y="212"
            width="14"
            height="7"
            rx="2.5"
            fill="#090D13"
            stroke="#0A0E14"
            strokeWidth="2"
          />
          <rect x="88" y="213.5" width="6" height="4" rx="1" fill="#38BDF8" />
          {/* Hand with Pointing Finger */}
          <circle cx="92" cy="230" r="7.5" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="2.5" />
          <path d="M92 233 L92 242" stroke="url(#skinGrad)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M92 233 L92 242" stroke="#0A0E14" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 5. Right Arm (Pivot at shoulder: 184, 162) */}
        <g id="doodle-arm-right" ref={rightArmRef}>
          {/* Right Sleeve */}
          <path
            d="M176 152 L190 162 L183 178 L172 170 Z"
            fill="url(#teeGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Muscular Right Arm */}
          <path
            d="M187 172 Q194 195 194 215 Q194 226 186 225 Q178 224 180 205 Q178 185 182 172 Z"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Hand with Pointing Finger */}
          <circle cx="188" cy="230" r="7.5" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="2.5" />
          <path d="M188 233 L188 242" stroke="url(#skinGrad)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M188 233 L188 242" stroke="#0A0E14" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 6. Head, Eyes, Smirk & Voluminous Curly Hair (Pivot at neck: 140, 120) */}
        <g id="doodle-head" ref={headGroupRef}>
          {/* Neck */}
          <rect
            x="132"
            y="134"
            width="16"
            height="18"
            rx="6"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3"
          />

          {/* Ears */}
          <circle cx="106" cy="115" r="8" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="3" />
          <circle cx="106" cy="115" r="4" fill="#995D3B" />
          <circle cx="174" cy="115" r="8" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="3" />
          <circle cx="174" cy="115" r="4" fill="#995D3B" />

          {/* Handsome Face Contour & Defined Jawline */}
          <path
            d="M110 98 Q110 74 140 74 Q170 74 170 98 Q170 128 152 136 Q140 141 128 136 Q110 128 110 98 Z"
            fill="url(#skinGrad)"
            stroke="#0A0E14"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Sculpted Nose Bridge & Nostril */}
          <path
            d="M138 108 L142 116 L137 118"
            fill="none"
            stroke="#995D3B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Confident Smirk (from photo) */}
          <g id="doodle-mouth" ref={mouthRef}>
            <path
              d="M132 126 Q142 132 151 127"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Smile dimple */}
            <path d="M151 125 Q153 127 152 129" fill="none" stroke="#0A0E14" strokeWidth="2.5" />
          </g>

          {/* Expressive Almond Eyes & Eyebrows */}
          <g id="doodle-brows" ref={browsRef}>
            {/* Thick Dark Left Eyebrow */}
            <path
              d="M120 98 Q129 93 135 97"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Thick Dark Right Eyebrow */}
            <path
              d="M145 97 Q151 93 160 98"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Left Eye */}
          <g id="eye-left">
            <ellipse cx="128" cy="106" rx="8" ry="6.5" fill="#FFFFFF" stroke="#0A0E14" strokeWidth="2.5" />
            <g id="pupil-left" ref={leftPupilRef}>
              <circle cx="128" cy="106" r="4.2" fill="#1C140F" />
              <circle cx="129.5" cy="104.5" r="1.5" fill="#FFFFFF" />
            </g>
          </g>

          {/* Right Eye */}
          <g id="eye-right">
            <ellipse cx="152" cy="106" rx="8" ry="6.5" fill="#FFFFFF" stroke="#0A0E14" strokeWidth="2.5" />
            <g id="pupil-right" ref={rightPupilRef}>
              <circle cx="152" cy="106" r="4.2" fill="#1C140F" />
              <circle cx="153.5" cy="104.5" r="1.5" fill="#FFFFFF" />
            </g>
          </g>

          {/* Eyelids for Blinking */}
          <g id="eyelids" ref={eyelidsRef} style={{ opacity: 0, transition: "opacity 0.08s ease" }}>
            <path d="M120 106 Q128 110 136 106" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="3" />
            <path d="M144 106 Q152 110 160 106" fill="url(#skinGrad)" stroke="#0A0E14" strokeWidth="3" />
          </g>

          {/* 7. Voluminous Dark Curly/Wavy Mop-Top Hair (Signature feature from photo) */}
          <g id="doodle-hair" ref={hairGroupRef}>
            {/* Base Volume Dome */}
            <path
              d="M102 96 Q92 78 106 62 Q122 46 142 46 Q164 46 176 62 Q188 78 178 96 Q184 106 174 114 Q166 94 158 92 Q142 88 126 92 Q116 94 108 114 Q98 106 102 96 Z"
              fill="url(#hairGrad)"
              stroke="#0A0E14"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Curly Texture Clumps on Top Crown */}
            <path
              d="M108 66 Q116 54 128 58 Q140 48 152 56 Q166 52 172 66"
              fill="none"
              stroke="#2B3647"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Front Bouncy Waves & Loose Curls on Forehead (from photo) */}
            <path
              d="M112 88 Q118 78 126 84 Q134 76 142 84 Q150 78 158 84 Q166 78 170 88"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Loose Curly Fringe Strands */}
            <path
              d="M124 84 Q128 92 126 95"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M142 84 Q146 94 143 97"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M154 84 Q158 92 156 95"
              fill="none"
              stroke="#0A0E14"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

// Simple linear interpolation helper
function THREE_lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}
