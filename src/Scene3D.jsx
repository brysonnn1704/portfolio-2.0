import { RoundedBox, Html, ContactShadows, Grid, Sparkles } from "@react-three/drei";
import { DoodleCharacter } from "./DoodleCharacter.jsx";
import { SpaceAtmosphere } from "./SpaceEffects.jsx";

function InteractiveStation({
  id,
  position,
  rotation = [0, 0, 0],
  label,
  icon,
  n,
  pinOffset = 0.95,
  hitboxSize = [1.6, 1.4, 1.4],
  hovered,
  setHovered,
  onPick,
  playBlip,
  children,
}) {
  const isHovered = hovered === id;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(id);
    document.body.style.cursor = "pointer";
    playBlip?.("hover");
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered((curr) => (curr === id ? null : curr));
    document.body.style.cursor = "auto";
  };

  const handleClick = (e) => {
    e.stopPropagation();
    playBlip?.("click");
    onPick(id);
  };

  return (
    <group
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Generous invisible hitbox so clicking anywhere near the station triggers cleanly */}
      <mesh visible={false} position={[0, 0.4, 0]}>
        <boxGeometry args={hitboxSize} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Main 3D Model with clean orientation facing inwards */}
      <group rotation={rotation} scale={isHovered ? 1.04 : 1}>
        {children}
      </group>

      {/* Stable, Beautiful Floating HTML Badge */}
      <Html position={[0, pinOffset, 0]} center distanceFactor={8} zIndexRange={[50, 0]}>
        <button
          className={`pin-tag ${isHovered ? "active" : ""}`}
          onClick={handleClick}
          type="button"
          aria-label={`Open ${label}`}
        >
          <span className="pin-dot" />
          <span className="pin-num">{n}</span>
          <span className="pin-label">{icon} {label}</span>
          <span className="pin-arrow">↗</span>
        </button>
      </Html>

      {/* Uniform Ground Pedestal Ring on desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] - 0.448, 0]}>
        <ringGeometry args={[0.32, 0.38, 32]} />
        <meshBasicMaterial
          color={isHovered ? "#F2E900" : "#38BDF8"}
          transparent
          opacity={isHovered ? 0.45 : 0.14}
        />
      </mesh>

      {/* Ground light aura on hover */}
      {isHovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] - 0.447, 0]}>
          <ringGeometry args={[0.38, 0.82, 36]} />
          <meshBasicMaterial color="#F2E900" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
}

// 01: Workstation Monitor (Projects)
function Workstation({ hovered }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Monitor Stand Base */}
      <mesh position={[0, -0.22, -0.05]} castShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.03, 32]} />
        <meshStandardMaterial color={hovered ? "#3B4758" : "#222B38"} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Stand Arm */}
      <mesh position={[0, 0.05, -0.1]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.52, 0.05]} />
        <meshStandardMaterial color="#2E3846" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Curved Screen Frame */}
      <RoundedBox args={[1.35, 0.78, 0.05]} radius={0.02} smoothness={4} position={[0, 0.32, 0]} castShadow>
        <meshStandardMaterial color={hovered ? "#2D3848" : "#1A232E"} metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {/* Display Screen */}
      <mesh position={[0, 0.32, 0.028]}>
        <planeGeometry args={[1.26, 0.69]} />
        <meshStandardMaterial
          color={hovered ? "#0B1522" : "#070E17"}
          emissive={hovered ? "#F2E900" : "#38BDF8"}
          emissiveIntensity={hovered ? 0.22 : 0.12}
          roughness={0.2}
        />
      </mesh>
      {/* Window Controls */}
      <mesh position={[-0.56, 0.61, 0.031]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[-0.52, 0.61, 0.031]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      <mesh position={[-0.48, 0.61, 0.031]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      {/* Code Editor Syntax Bars */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[-0.28 + (i % 3) * 0.08, 0.52 - i * 0.055, 0.031]}>
          <planeGeometry args={[0.42 + (i % 2) * 0.2, 0.022]} />
          <meshBasicMaterial color={i % 2 === 0 ? (hovered ? "#F2E900" : "#38BDF8") : "#94A3B8"} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Mechanical Keyboard on Desk */}
      <RoundedBox args={[0.72, 0.035, 0.28]} radius={0.015} smoothness={4} position={[0, -0.22, 0.32]} castShadow>
        <meshStandardMaterial color={hovered ? "#2C3746" : "#1A222D"} roughness={0.5} />
      </RoundedBox>
      {[0, 1, 2, 3].map((r) => (
        <mesh key={r} position={[0, -0.198, 0.24 + r * 0.055]}>
          <boxGeometry args={[0.64, 0.015, 0.04]} />
          <meshStandardMaterial color={hovered ? "#475569" : "#334155"} roughness={0.6} />
        </mesh>
      ))}
      {/* Mouse */}
      <RoundedBox args={[0.1, 0.04, 0.16]} radius={0.02} smoothness={4} position={[0.48, -0.21, 0.34]} castShadow>
        <meshStandardMaterial color={hovered ? "#475569" : "#242F3E"} metalness={0.4} roughness={0.4} />
      </RoundedBox>
    </group>
  );
}

// 02: Blade Server Rack (Systems & Cloud)
function ServerRack({ hovered }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Rack Chassis */}
      <RoundedBox args={[0.82, 0.94, 0.62]} radius={0.03} smoothness={4} position={[0, 0.18, 0]} castShadow>
        <meshStandardMaterial color={hovered ? "#2D394A" : "#1B2430"} metalness={0.65} roughness={0.35} />
      </RoundedBox>
      {/* 4 Blade Server Modules */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, -0.16 + i * 0.21, 0.315]}>
          <mesh>
            <planeGeometry args={[0.74, 0.17]} />
            <meshStandardMaterial color={hovered ? "#3B4B60" : "#243040"} roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[-0.24, 0, 0.01]}>
            <boxGeometry args={[0.16, 0.04, 0.015]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.04, 0, 0.01]}>
            <boxGeometry args={[0.16, 0.04, 0.015]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.22, 0.03, 0.01]}>
            <circleGeometry args={[0.014, 16]} />
            <meshBasicMaterial color="#34D399" />
          </mesh>
          <mesh position={[0.26, 0.03, 0.01]}>
            <circleGeometry args={[0.014, 16]} />
            <meshBasicMaterial color={hovered ? "#F2E900" : "#F59E0B"} />
          </mesh>
          <mesh position={[0.3, 0.03, 0.01]}>
            <circleGeometry args={[0.014, 16]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          {[0, 1, 2].map((g) => (
            <mesh key={g} position={[0.24, -0.04 + g * 0.02, 0.01]}>
              <planeGeometry args={[0.14, 0.008]} />
              <meshBasicMaterial color="#0A0E14" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.63, 0.22]}>
        <boxGeometry args={[0.76, 0.025, 0.05]} />
        <meshStandardMaterial
          color={hovered ? "#F2E900" : "#38BDF8"}
          emissive={hovered ? "#F2E900" : "#38BDF8"}
          emissiveIntensity={hovered ? 0.75 : 0.35}
        />
      </mesh>
    </group>
  );
}

// 03: Field Journal (Resume)
function TechnicalJournal({ hovered }) {
  return (
    <group rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.92, 0.05, 1.18]} radius={0.02} smoothness={4} position={[0, -0.02, 0]} castShadow>
        <meshStandardMaterial color={hovered ? "#3B2E4A" : "#1B2230"} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.86, 0.05, 1.12]} radius={0.01} smoothness={4} position={[0.01, 0.02, 0]} castShadow>
        <meshStandardMaterial color="#F8F6ED" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0.01, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.78, 1.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh position={[0.01, 0.054, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.64, 0.04]} />
        <meshBasicMaterial color={hovered ? "#F2E900" : "#1E293B"} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.08, 0.054, -0.2 + i * 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.012]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
      ))}
      <mesh position={[-0.34, 0.055, 0.1]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[0.05, 0.9]} />
        <meshStandardMaterial
          color={hovered ? "#F2E900" : "#EAB308"}
          emissive={hovered ? "#F2E900" : "#000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
      <group position={[0.55, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.95, 20]} />
          <meshStandardMaterial color={hovered ? "#F2E900" : "#475569"} metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <coneGeometry args={[0.022, 0.08, 20]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// 04: Cinema Camera (Creative)
function CinemaCamera({ hovered }) {
  return (
    <group rotation={[0, -0.28, 0]}>
      <RoundedBox args={[0.68, 0.46, 0.38]} radius={0.03} smoothness={4} position={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial color={hovered ? "#384758" : "#1E2632"} metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.44, 0.34]} radius={0.03} smoothness={4} position={[0.28, 0.09, 0.06]} castShadow>
        <meshStandardMaterial color="#161C24" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.18, 32]} />
        <meshStandardMaterial color="#2B3644" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.1, 0.37]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 32]} />
        <meshStandardMaterial color={hovered ? "#475569" : "#1F2630"} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial
          color={hovered ? "#F2E900" : "#38BDF8"}
          emissive={hovered ? "#F2E900" : "#0284C7"}
          emissiveIntensity={hovered ? 0.45 : 0.25}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>
      <RoundedBox args={[0.24, 0.12, 0.22]} radius={0.02} smoothness={4} position={[-0.04, 0.36, 0]} castShadow>
        <meshStandardMaterial color="#1E2632" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0.28, 0.34, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 20]} />
        <meshStandardMaterial color={hovered ? "#F2E900" : "#E2E8F0"} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.24, 0.34, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.24, 0.2]}>
        <circleGeometry args={[0.016, 16]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// 05: ID Badge (About)
function EngineerBadge({ hovered }) {
  return (
    <group rotation={[0, 0.24, 0]}>
      <RoundedBox args={[0.85, 0.025, 0.58]} radius={0.02} smoothness={4} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial
          color={hovered ? "#3B4758" : "#222D3B"}
          transparent
          opacity={hovered ? 0.85 : 0.65}
          roughness={0.2}
        />
      </RoundedBox>
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.78, 0.52]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.018, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.74, 0.06]} />
        <meshBasicMaterial color={hovered ? "#F2E900" : "#38BDF8"} />
      </mesh>
      <mesh position={[-0.22, 0.018, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, 0.26]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[-0.22, 0.019, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 24]} />
        <meshBasicMaterial color={hovered ? "#F2E900" : "#64748B"} />
      </mesh>
      <mesh position={[0.06, 0.018, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.09, 0.07]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.15, 0.018, 0.02 + i * 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.26, 0.018]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
      ))}
      <mesh position={[0, 0.018, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.035]} />
        <meshBasicMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.02, -0.32]}>
        <boxGeometry args={[0.14, 0.03, 0.08]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

// 06: Cyber Command Terminal (GitHub)
function CyberTerminal({ hovered }) {
  return (
    <group rotation={[0, -0.3, 0]}>
      <RoundedBox args={[0.96, 0.28, 0.68]} radius={0.03} smoothness={4} position={[0, 0.06, 0]} castShadow>
        <meshStandardMaterial color={hovered ? "#2D3848" : "#1A222D"} metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <group position={[0, 0.18, 0.02]} rotation={[-0.32, 0, 0]}>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.82, 0.44]} />
          <meshStandardMaterial
            color="#050B10"
            emissive={hovered ? "#F2E900" : "#10B981"}
            emissiveIntensity={hovered ? 0.35 : 0.22}
            roughness={0.15}
          />
        </mesh>
        <mesh position={[-0.12, 0.12, 0.025]}>
          <planeGeometry args={[0.5, 0.022]} />
          <meshBasicMaterial color={hovered ? "#F2E900" : "#34D399"} />
        </mesh>
        <mesh position={[-0.04, 0.06, 0.025]}>
          <planeGeometry args={[0.66, 0.022]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        <mesh position={[-0.18, 0, 0.025]}>
          <planeGeometry args={[0.38, 0.022]} />
          <meshBasicMaterial color={hovered ? "#F2E900" : "#34D399"} />
        </mesh>
        <mesh position={[-0.08, -0.06, 0.025]}>
          <planeGeometry args={[0.58, 0.022]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
      </group>
      <mesh position={[0, 0.08, 0.35]}>
        <boxGeometry args={[0.74, 0.04, 0.02]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Full 3D Scene Assembly
export function SceneContent({
  onPick,
  hovered,
  setHovered,
  playBlip,
  clickedStation,
  reducedMotion = false,
}) {
  return (
    <>
      {/* Space & Cosmic Atmosphere Effects */}
      <SpaceAtmosphere reducedMotion={reducedMotion} />

      {/* Studio Lighting */}
      <ambientLight intensity={1.8} />
      <hemisphereLight args={["#E2E8F0", "#07090D", 1.2]} />
      <directionalLight
        position={[4.5, 7.5, 4.0]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4.5, 4.5, -2.5]} intensity={1.5} color="#93C5FD" />
      <directionalLight position={[0, 5, -4]} intensity={1.0} color="#FDE047" />
      <pointLight position={[0, 3.2, 0.5]} intensity={1.2} color="#FFFBEB" distance={12} decay={2} />
      <pointLight position={[-2.4, 2.0, 1.8]} intensity={0.9} color="#67E8F9" distance={8} decay={2} />
      <pointLight position={[2.5, 1.8, 1.2]} intensity={0.85} color="#FBBF24" distance={8} decay={2} />

      {/* Stylized Golden Character Rim & Accent Light */}
      <pointLight position={[0, 1.8, -1.2]} intensity={1.5} color="#FDE047" distance={5} decay={2} />
      <pointLight position={[0, 0.8, 1.4]} intensity={0.8} color="#38BDF8" distance={4} decay={2} />

      {/* Ground plane & subtle grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#0B1017" roughness={0.85} metalness={0.15} />
      </mesh>
      <Grid
        position={[0, -0.49, 0]}
        args={[26, 26]}
        cellSize={0.65}
        cellThickness={0.6}
        sectionSize={3.25}
        sectionThickness={1.1}
        sectionColor="#1E293B"
        cellColor="#111827"
        fadeDistance={14}
        fadeStrength={1.2}
        infiniteGrid
      />
      <ContactShadows position={[0, -0.48, 0]} opacity={0.45} scale={13} blur={2.4} far={4.5} />

      {/* Studio Circular Desk Platform */}
      <mesh position={[0, -0.47, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.35, 0.04, 64]} />
        <meshStandardMaterial color="#0E141D" roughness={0.65} metalness={0.25} />
      </mesh>
      {/* Outer Desk Accent Rim */}
      <mesh position={[0, -0.448, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.12, 4.18, 64]} />
        <meshBasicMaterial color="#F2E900" transparent opacity={0.22} />
      </mesh>
      {/* Precision Uniform Orbit Guideline at R = 2.15 (Equal radial spacing across all 6 stations) */}
      <mesh position={[0, -0.448, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.14, 2.16, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.16} />
      </mesh>

      {/* Center 2D Cute Handsome Doodle Character of Bryson */}
      <Html position={[0, -0.45, 0]} center distanceFactor={7.2} zIndexRange={[30, 0]}>
        <DoodleCharacter
          hovered={hovered}
          clickedStation={clickedStation}
          reducedMotion={reducedMotion}
        />
      </Html>

      {/* Center Desk Core Hub Pedestal */}
      <mesh position={[0, -0.448, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.40, 36]} />
        <meshBasicMaterial
          color={hovered ? "#F2E900" : "#38BDF8"}
          transparent
          opacity={hovered ? 0.45 : 0.2}
        />
      </mesh>

      {/* Ambient floating dust particles */}
      <Sparkles count={42} scale={14} size={2.2} speed={0.25} color="#F2E900" opacity={0.3} />

      {/* 6 Stations placed at strictly uniform distance (Radius = 2.15) with 60-degree radial symmetry */}
      {/* 01: Workstation -> Projects (Rear Left) */}
      <InteractiveStation
        id="projects"
        position={[-1.86, 0.18, -1.08]}
        rotation={[0, 0.52, 0]}
        pinOffset={0.96}
        hitboxSize={[1.8, 1.4, 1.4]}
        label="Projects"
        icon="💻"
        n="01"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <Workstation hovered={hovered === "projects"} />
      </InteractiveStation>

      {/* 02: Blade Server -> Systems & Cloud (Rear Center) */}
      <InteractiveStation
        id="systems"
        position={[0, 0.22, -2.15]}
        rotation={[0, 0, 0]}
        pinOffset={1.05}
        hitboxSize={[1.6, 1.5, 1.4]}
        label="Systems & Cloud"
        icon="☁️"
        n="02"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <ServerRack hovered={hovered === "systems"} />
      </InteractiveStation>

      {/* 03: Field Journal -> Resume (Rear Right) */}
      <InteractiveStation
        id="resume"
        position={[1.86, 0.08, -1.08]}
        rotation={[0, -0.52, 0]}
        pinOffset={0.82}
        hitboxSize={[1.6, 1.2, 1.5]}
        label="Resume"
        icon="📄"
        n="03"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <TechnicalJournal hovered={hovered === "resume"} />
      </InteractiveStation>

      {/* 04: Cinema Camera -> Creative (Front Right) */}
      <InteractiveStation
        id="creative"
        position={[1.86, 0.18, 1.08]}
        rotation={[0, -0.4, 0]}
        pinOffset={0.82}
        hitboxSize={[1.5, 1.3, 1.4]}
        label="Creative"
        icon="🎥"
        n="04"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <CinemaCamera hovered={hovered === "creative"} />
      </InteractiveStation>

      {/* 05: ID Badge -> About (Front Center) */}
      <InteractiveStation
        id="about"
        position={[0, 0.04, 2.15]}
        rotation={[0, 0, 0]}
        pinOffset={0.76}
        hitboxSize={[1.5, 1.1, 1.4]}
        label="About"
        icon="🪪"
        n="05"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <EngineerBadge hovered={hovered === "about"} />
      </InteractiveStation>

      {/* 06: Cyber Terminal -> GitHub (Front Left) */}
      <InteractiveStation
        id="github"
        position={[-1.86, 0.1, 1.08]}
        rotation={[0, 0.4, 0]}
        pinOffset={0.82}
        hitboxSize={[1.6, 1.3, 1.4]}
        label="GitHub"
        icon="⚡"
        n="06"
        hovered={hovered}
        setHovered={setHovered}
        onPick={onPick}
        playBlip={playBlip}
      >
        <CyberTerminal hovered={hovered === "github"} />
      </InteractiveStation>
    </>
  );
}
