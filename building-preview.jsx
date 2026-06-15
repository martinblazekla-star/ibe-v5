// Multi-property LTR — Building Preview component
//
// Renders a real exterior photo of a modern building (free Unsplash CDN),
// assigned deterministically per building.id so each card reads as a distinct
// property. If a photo fails to load, it falls back to the inline-SVG
// architectural illustration (variants by building.type).
//
// Usage: <BuildingPreview building={b} />  (fills its parent absolutely)

(function () {
  // ────────────────────────────────────────────────────────────────────────
  //  Real photo pool — modern buildings, free Unsplash CDN (hotlink-friendly)
  // ────────────────────────────────────────────────────────────────────────
  const PHOTO_IDS = [
    "1486406146926-c627a92ad1ab",
    "1487958449943-2429e8be8625",
    "1449157291145-7efd050a4d0e",
    "1496564203457-11bb12075d90",
    "1480714378408-67cf0d13bc1b",
    "1493246507139-91e8fad9978e",
    "1431576901776-e539bd916ba2",
    "1459535653751-d571815e906b",
    "1452960962994-acf4fd70b632",
    "1503174971373-b1f69850bded",
    "1494145904049-0dca59b4bbad",
    "1460472178825-e5240623afd5",
  ];
  function photoUrl(id) {
    return `https://images.unsplash.com/photo-${id}?q=80&fm=jpg&w=800&fit=crop&crop=entropy`;
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Deterministic hash for building.id → palette / lighting
  // ────────────────────────────────────────────────────────────────────────
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  const PALETTES = [
    // afternoon warm
    {
      sky: ["#F8C28A", "#FFE3B6", "#FFF7E1"],
      sun: "#FFC97A", sunOpacity: 0.55,
      silhouette: "#9B7E60",
      tree: "#5C7E4E", treeDark: "#3D5A33",
      street: "#7A7269", curb: "#54514B",
      facade: "#E8D5B7", facadeStroke: "#A28567", facadeShadow: "rgba(70,40,15,0.18)",
      roof: "#7E5C3E",
      windowLit: "#FFE9A8", windowDark: "#3D4F66", windowFrame: "#8E7A60",
      door: "#5C3A26", signColor: "#6F4A2A",
      cloud: "#FFF6E1", cloudOpacity: 0.5,
    },
    // morning light blue
    {
      sky: ["#A5C9E0", "#D3E4F0", "#F0F6FA"],
      sun: "#FFE9B0", sunOpacity: 0.45,
      silhouette: "#7388A0",
      tree: "#4F7146", treeDark: "#36502F",
      street: "#7A7975", curb: "#525047",
      facade: "#E1DCD3", facadeStroke: "#9F9A8E", facadeShadow: "rgba(20,30,50,0.16)",
      roof: "#5A6068",
      windowLit: "#FFE0A0", windowDark: "#3D4F66", windowFrame: "#7C7466",
      door: "#3D3530", signColor: "#5A554E",
      cloud: "#FFFFFF", cloudOpacity: 0.7,
    },
    // overcast cool
    {
      sky: ["#D2D6DC", "#E3E6EA", "#F1F2F4"],
      sun: "#F4EBD0", sunOpacity: 0.30,
      silhouette: "#8A8E94",
      tree: "#4F6E48", treeDark: "#395234",
      street: "#76757A", curb: "#52525A",
      facade: "#D5D2CC", facadeStroke: "#92908A", facadeShadow: "rgba(20,25,35,0.13)",
      roof: "#5E5E64",
      windowLit: "#FFD98C", windowDark: "#3A4B5E", windowFrame: "#74716C",
      door: "#3A3A3E", signColor: "#5A5A60",
      cloud: "#FFFFFF", cloudOpacity: 0.9,
    },
    // late afternoon / pink twilight
    {
      sky: ["#E8A5B4", "#F5C9CC", "#FBE6DF"],
      sun: "#FFB689", sunOpacity: 0.55,
      silhouette: "#83617A",
      tree: "#465E40", treeDark: "#324530",
      street: "#7A6E6E", curb: "#5A4F4F",
      facade: "#E8C2B6", facadeStroke: "#A57F75", facadeShadow: "rgba(80,30,30,0.18)",
      roof: "#7A4848",
      windowLit: "#FFD98C", windowDark: "#473655", windowFrame: "#8F6E68",
      door: "#5A2E28", signColor: "#7A3F40",
      cloud: "#FFE5DC", cloudOpacity: 0.6,
    },
  ];

  function paletteFor(building) {
    return PALETTES[hash(building.id) % PALETTES.length];
  }

  // Deterministic "is this window lit?" — depends on palette darkness too
  function lightingMask(buildingId, floor, col, totalFloors) {
    const h = hash(`${buildingId}-${floor}-${col}`);
    // Higher floors more lit; first floor (ground) always lit
    if (floor === totalFloors - 1) return true;
    if (floor === 0) return h % 7 < 5;
    return h % 6 < 2;
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Public component
  // ────────────────────────────────────────────────────────────────────────

  // Photo-first preview with SVG illustration fallback on load error
  function BuildingPreview({ building }) {
    const idx = hash(building.id) % PHOTO_IDS.length;
    const [failed, setFailed] = React.useState(false);
    if (failed) return <BuildingIllustration building={building} />;
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "var(--neutral-100)" }}>
        <img
          src={photoUrl(PHOTO_IDS[idx])}
          alt={building.name || "Budova"}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  function BuildingIllustration({ building }) {
    const p = paletteFor(building);
    return (
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        background: `linear-gradient(180deg, ${p.sky[0]} 0%, ${p.sky[1]} 55%, ${p.sky[2]} 100%)`,
      }}>
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
          <defs>
            <linearGradient id={`facade-${building.id}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={p.facade} stopOpacity="0.85" />
              <stop offset="60%" stopColor={p.facade} stopOpacity="1" />
              <stop offset="100%" stopColor={p.facade} stopOpacity="0.78" />
            </linearGradient>
            <linearGradient id={`window-glow-${building.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={p.windowLit} stopOpacity="1" />
              <stop offset="100%" stopColor={p.windowLit} stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Sun / moon */}
          <circle cx="318" cy="50" r="20" fill={p.sun} opacity={p.sunOpacity} />
          <circle cx="318" cy="50" r="34" fill={p.sun} opacity={p.sunOpacity * 0.4} />

          {/* Clouds */}
          <ellipse cx="70" cy="55" rx="36" ry="9"  fill={p.cloud} opacity={p.cloudOpacity * 0.8} />
          <ellipse cx="230" cy="35" rx="28" ry="7"  fill={p.cloud} opacity={p.cloudOpacity} />
          <ellipse cx="160" cy="70" rx="22" ry="5"  fill={p.cloud} opacity={p.cloudOpacity * 0.7} />

          {/* Distant city silhouette */}
          <SilhouetteSkyline id={building.id} fill={p.silhouette} />

          {/* Trees — left */}
          <g>
            <ellipse cx="36" cy="218" rx="22" ry="32" fill={p.treeDark} />
            <ellipse cx="48" cy="212" rx="26" ry="36" fill={p.tree} />
            <rect x="40" y="232" width="5" height="20" fill="#4D3520" />
          </g>
          {/* Trees — right */}
          <g>
            <ellipse cx="370" cy="225" rx="18" ry="26" fill={p.treeDark} />
            <ellipse cx="380" cy="220" rx="20" ry="28" fill={p.tree} />
            <rect x="376" y="238" width="4" height="18" fill="#4D3520" />
          </g>

          {/* Main building */}
          {building.type === "student-hall" && <StudentHall p={p} id={building.id} />}
          {building.type === "co-living"    && <CoLiving p={p} id={building.id} />}
          {building.type === "private"      && <PrivateApt p={p} id={building.id} />}

          {/* Foreground: street + curb */}
          <rect x="0" y="246" width="400" height="14" fill={p.street} />
          <rect x="0" y="244" width="400" height="2"  fill={p.curb}   />
          {/* Lamp post */}
          <g>
            <rect x="110" y="200" width="2" height="50" fill={p.curb} />
            <circle cx="111" cy="200" r="4" fill={p.windowLit} opacity="0.9" />
            <circle cx="111" cy="200" r="9" fill={p.windowLit} opacity="0.25" />
          </g>
          {/* Tiny pedestrian silhouette */}
          <g opacity="0.7">
            <ellipse cx="200" cy="252" rx="2" ry="2" fill="#2A1F1A" />
            <rect x="199" y="246" width="2.5" height="6" fill="#2A1F1A" />
          </g>
        </svg>
      </div>
    );
  }

  function SilhouetteSkyline({ id, fill }) {
    // Procedural skyline (5-7 rectangles + a few pitched roofs)
    const h = hash(id);
    const baseY = 195;
    const rects = [];
    let x = -10;
    while (x < 410) {
      const w = 30 + ((h ^ x) % 28);
      const dh = 26 + ((h ^ (x * 31)) % 60);
      const pitched = ((h ^ x) % 3) === 0;
      if (pitched) {
        rects.push(
          <g key={x}>
            <rect x={x} y={baseY - dh} width={w} height={dh} fill={fill} />
            <polygon points={`${x},${baseY - dh} ${x + w/2},${baseY - dh - 12} ${x + w},${baseY - dh}`} fill={fill} />
          </g>
        );
      } else {
        rects.push(<rect key={x} x={x} y={baseY - dh} width={w} height={dh} fill={fill} />);
      }
      x += w - 2;
    }
    return <g opacity="0.35">{rects}</g>;
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Facade variants
  // ────────────────────────────────────────────────────────────────────────

  // Tall modern student-hall block — 6 floors, regular grid, flat roof
  function StudentHall({ p, id }) {
    const xStart = 80, xEnd = 340, yTop = 45, yBottom = 244;
    const w = xEnd - xStart, h = yBottom - yTop;
    const floors = 7, cols = 9;
    const floorH = h / floors;
    const colW = w / cols;
    const elements = [];
    // Facade base
    elements.push(<rect key="base" x={xStart} y={yTop} width={w} height={h} fill={`url(#facade-${id})`} stroke={p.facadeStroke} strokeWidth="0.8" />);
    // Vertical accent stripe
    elements.push(<rect key="accent" x={xStart + w - 38} y={yTop} width="6" height={h} fill={p.roof} opacity="0.55" />);
    // Roof line
    elements.push(<rect key="roof" x={xStart - 4} y={yTop - 5} width={w + 8} height="6" fill={p.roof} />);
    // Floor dividers
    for (let i = 1; i < floors; i++) {
      elements.push(<line key={`fd${i}`} x1={xStart} y1={yTop + i * floorH} x2={xEnd} y2={yTop + i * floorH} stroke={p.facadeStroke} strokeWidth="0.6" opacity="0.4" />);
    }
    // Windows
    for (let fi = 0; fi < floors; fi++) {
      for (let ci = 0; ci < cols; ci++) {
        // Ground floor reserved for entrance
        if (fi === floors - 1 && ci >= 3 && ci <= 5) continue;
        const wx = xStart + ci * colW + colW * 0.15;
        const wy = yTop + fi * floorH + floorH * 0.22;
        const ww = colW * 0.7;
        const wh = floorH * 0.55;
        const lit = lightingMask(id, fi, ci, floors);
        elements.push(
          <rect key={`w-${fi}-${ci}`} x={wx} y={wy} width={ww} height={wh}
                fill={lit ? `url(#window-glow-${id})` : p.windowDark}
                stroke={p.windowFrame} strokeWidth="0.5" />
        );
      }
    }
    // Ground entrance (glass door)
    const doorX = xStart + 3 * colW + colW * 0.15;
    const doorY = yTop + (floors - 1) * floorH + floorH * 0.1;
    const doorW = colW * 3 - colW * 0.3;
    const doorH = floorH * 0.85;
    elements.push(
      <g key="entry">
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill={p.windowDark} opacity="0.85" stroke={p.facadeStroke} strokeWidth="0.6" />
        <line x1={doorX + doorW/2} y1={doorY} x2={doorX + doorW/2} y2={doorY + doorH} stroke={p.facadeStroke} strokeWidth="0.6" />
        <rect x={doorX + 4} y={doorY + doorH - 8} width={doorW - 8} height="3" fill={p.windowLit} opacity="0.8" />
      </g>
    );
    // Building shadow
    elements.push(<rect key="shadow" x={xStart} y={yBottom} width={w} height="4" fill={p.facadeShadow} />);
    return <g>{elements}</g>;
  }

  // Classic 19th-century townhouse for co-living — 5 floors, ornate windows, cornice
  function CoLiving({ p, id }) {
    const xStart = 90, xEnd = 330, yTop = 65, yBottom = 244;
    const w = xEnd - xStart, h = yBottom - yTop;
    const floors = 5, cols = 6;
    const floorH = h / floors;
    const colW = w / cols;
    const elements = [];
    // Facade with subtle pilaster texture
    elements.push(<rect key="base" x={xStart} y={yTop} width={w} height={h} fill={`url(#facade-${id})`} stroke={p.facadeStroke} strokeWidth="1" />);
    // Cornice (thick ornate top)
    elements.push(<rect key="cornice1" x={xStart - 6} y={yTop - 10} width={w + 12} height="10" fill={p.roof} />);
    elements.push(<rect key="cornice2" x={xStart - 3} y={yTop - 16} width={w + 6} height="6" fill={p.roof} opacity="0.7" />);
    // Pediment in middle (decorative)
    elements.push(<polygon key="pediment" points={`${xStart + w/2 - 22},${yTop - 16} ${xStart + w/2},${yTop - 32} ${xStart + w/2 + 22},${yTop - 16}`} fill={p.roof} opacity="0.85" />);
    // Floor dividers (stronger, ornate)
    for (let i = 1; i < floors; i++) {
      const y = yTop + i * floorH;
      elements.push(<rect key={`div${i}`} x={xStart - 2} y={y - 2} width={w + 4} height="4" fill={p.roof} opacity="0.45" />);
    }
    // Windows (taller, with arched lintels)
    for (let fi = 0; fi < floors; fi++) {
      for (let ci = 0; ci < cols; ci++) {
        if (fi === floors - 1 && ci === Math.floor(cols / 2)) continue; // door
        const wx = xStart + ci * colW + colW * 0.22;
        const wy = yTop + fi * floorH + floorH * 0.15;
        const ww = colW * 0.56;
        const wh = floorH * 0.65;
        const lit = lightingMask(id, fi, ci, floors);
        elements.push(
          <g key={`w-${fi}-${ci}`}>
            {/* Arched lintel */}
            <rect x={wx - 2} y={wy - 3} width={ww + 4} height="3" fill={p.roof} opacity="0.6" />
            <rect x={wx} y={wy} width={ww} height={wh}
                  fill={lit ? `url(#window-glow-${id})` : p.windowDark}
                  stroke={p.windowFrame} strokeWidth="0.6" />
            {/* Mullion cross */}
            <line x1={wx + ww/2} y1={wy} x2={wx + ww/2} y2={wy + wh} stroke={p.windowFrame} strokeWidth="0.5" />
            <line x1={wx} y1={wy + wh/2} x2={wx + ww} y2={wy + wh/2} stroke={p.windowFrame} strokeWidth="0.5" />
            {/* Sill */}
            <rect x={wx - 2} y={wy + wh} width={ww + 4} height="2" fill={p.roof} opacity="0.6" />
          </g>
        );
      }
    }
    // Ground-floor entrance (ornate door)
    const doorX = xStart + Math.floor(cols/2) * colW + colW * 0.22;
    const doorY = yTop + (floors - 1) * floorH + floorH * 0.05;
    const doorW = colW * 0.56;
    const doorH = floorH * 0.9;
    elements.push(
      <g key="entry">
        <rect x={doorX - 2} y={doorY - 4} width={doorW + 4} height="4" fill={p.roof} />
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill={p.door} stroke={p.roof} strokeWidth="0.8" />
        <line x1={doorX + doorW/2} y1={doorY + 4} x2={doorX + doorW/2} y2={doorY + doorH} stroke={p.roof} strokeWidth="0.6" />
        <circle cx={doorX + doorW * 0.35} cy={doorY + doorH * 0.55} r="1.4" fill={p.windowLit} />
      </g>
    );
    // Steps
    elements.push(<rect key="steps1" x={doorX - 6} y={doorY + doorH} width={doorW + 12} height="3" fill={p.roof} opacity="0.5" />);
    elements.push(<rect key="steps2" x={doorX - 10} y={doorY + doorH + 3} width={doorW + 20} height="3" fill={p.roof} opacity="0.4" />);
    return <g>{elements}</g>;
  }

  // Modern private apartment building — glass-strip windows, balconies
  function PrivateApt({ p, id }) {
    const xStart = 80, xEnd = 350, yTop = 50, yBottom = 244;
    const w = xEnd - xStart, h = yBottom - yTop;
    const floors = 8;
    const floorH = h / floors;
    const elements = [];
    // Base facade (slightly off-white)
    elements.push(<rect key="base" x={xStart} y={yTop} width={w} height={h} fill={`url(#facade-${id})`} stroke={p.facadeStroke} strokeWidth="0.6" />);
    // Roof: thin parapet
    elements.push(<rect key="roof" x={xStart - 2} y={yTop - 4} width={w + 4} height="4" fill={p.roof} />);
    // Glass strip windows (horizontal continuous bands)
    for (let fi = 0; fi < floors; fi++) {
      const y = yTop + fi * floorH + floorH * 0.18;
      const stripH = floorH * 0.55;
      // Outer band
      elements.push(<rect key={`s-${fi}`} x={xStart + 6} y={y} width={w - 12} height={stripH} fill={p.windowDark} opacity="0.85" stroke={p.windowFrame} strokeWidth="0.4" />);
      // Mullions (dividers every 38px)
      for (let mx = xStart + 6 + 38; mx < xEnd - 6; mx += 38) {
        elements.push(<line key={`m-${fi}-${mx}`} x1={mx} y1={y} x2={mx} y2={y + stripH} stroke={p.windowFrame} strokeWidth="0.5" />);
      }
      // Lit panels
      const panelsCount = Math.floor((w - 12) / 38);
      for (let pi = 0; pi < panelsCount; pi++) {
        if (lightingMask(id, fi, pi, floors)) {
          const px = xStart + 6 + pi * 38 + 1;
          elements.push(<rect key={`lit-${fi}-${pi}`} x={px} y={y} width="36" height={stripH} fill={`url(#window-glow-${id})`} opacity="0.85" />);
        }
      }
    }
    // Balconies on every other floor — small horizontal rails
    for (let fi = 1; fi < floors; fi += 2) {
      const y = yTop + fi * floorH + floorH * 0.78;
      elements.push(<rect key={`b1-${fi}`} x={xStart + 30} y={y} width="60" height="2" fill={p.roof} opacity="0.7" />);
      elements.push(<rect key={`b2-${fi}`} x={xStart + 30} y={y} width="60" height="6" fill={p.roof} opacity="0.18" />);
      elements.push(<rect key={`b3-${fi}`} x={xStart + w - 90} y={y} width="60" height="2" fill={p.roof} opacity="0.7" />);
      elements.push(<rect key={`b4-${fi}`} x={xStart + w - 90} y={y} width="60" height="6" fill={p.roof} opacity="0.18" />);
    }
    // Entrance lobby
    const doorX = xStart + w/2 - 30;
    const doorY = yBottom - floorH * 0.85;
    const doorW = 60;
    const doorH2 = floorH * 0.85;
    elements.push(
      <g key="entry">
        <rect x={doorX} y={doorY} width={doorW} height={doorH2} fill={p.windowDark} opacity="0.85" stroke={p.facadeStroke} strokeWidth="0.6" />
        <rect x={doorX + 4} y={doorY + 4} width={doorW - 8} height={doorH2 - 8} fill={p.windowLit} opacity="0.4" />
        <line x1={doorX + doorW/2} y1={doorY} x2={doorX + doorW/2} y2={doorY + doorH2} stroke={p.windowFrame} strokeWidth="0.5" />
      </g>
    );
    // Building shadow
    elements.push(<rect key="shadow" x={xStart} y={yBottom} width={w} height="4" fill={p.facadeShadow} />);
    return <g>{elements}</g>;
  }

  window.BuildingPreview = BuildingPreview;
})();
