// Stylized Prague map + price-bubble pins + clusters + pin popover
// Used by Pick Room — Map View (app-map.jsx).
//
// Internal coord system: 1000 × 800 (a square-ish bounding box around Prague).
// All apartment coords in data-map.jsx use this space.

const MAP_W = 1000;
const MAP_H = 800;

// — Stylized Prague illustration (no third-party tiles) —

function PragueIllustration({ theme }) {
  // Palette per theme — abstract, low-contrast, designed not to compete with pins.
  const P = theme === "sage" ? {
    land:    "#EEF1ED",
    landDk:  "#E3E8E2",
    water:   "#C8DCE2",
    waterEd: "#B5CBD2",
    park:    "#D8E6CF",
    parkDk:  "#C8DBBE",
    road:    "#E2E6E8",
    roadMaj: "#D4D9DC",
    rail:    "#D1D5D7",
    block:   "#E7EBE6",
    label:   "#8A938E",
  } : theme === "warm" ? {
    land:    "#F2EEE5",
    landDk:  "#EAE3D5",
    water:   "#CADDE4",
    waterEd: "#B6CCD4",
    park:    "#D9E1C9",
    parkDk:  "#CCD6B8",
    road:    "#E7E1D4",
    roadMaj: "#DAD2C0",
    rail:    "#D5CFC2",
    block:   "#ECE6D8",
    label:   "#9A8F78",
  } : { // light (default)
    land:    "#F1F3F4",
    landDk:  "#E6E9EB",
    water:   "#CDD9E2",
    waterEd: "#B7C5D1",
    park:    "#D9E5D3",
    parkDk:  "#CADBC0",
    road:    "#E5E8EA",
    roadMaj: "#D5D9DC",
    rail:    "#D1D5D8",
    block:   "#E9EBEC",
    label:   "#8A8F94",
  };

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      {/* Land background */}
      <rect width={MAP_W} height={MAP_H} fill={P.land} />

      {/* Big urban blocks (very subtle texture) */}
      <g fill={P.block} opacity="0.65">
        <rect x="60" y="60" width="180" height="140" rx="6" />
        <rect x="260" y="80" width="120" height="100" rx="6" />
        <rect x="600" y="60" width="180" height="100" rx="6" />
        <rect x="800" y="100" width="160" height="180" rx="6" />
        <rect x="60" y="240" width="220" height="180" rx="6" />
        <rect x="300" y="300" width="120" height="120" rx="6" />
        <rect x="780" y="320" width="180" height="180" rx="6" />
        <rect x="60" y="500" width="220" height="240" rx="6" />
        <rect x="600" y="540" width="180" height="200" rx="6" />
        <rect x="800" y="540" width="160" height="200" rx="6" />
      </g>

      {/* Major roads (radial pattern through Old Town) */}
      <g stroke={P.roadMaj} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M 0 460 L 540 430" />
        <path d="M 540 430 L 980 480" />
        <path d="M 540 430 L 920 220" />
        <path d="M 540 430 L 660 60" />
        <path d="M 540 430 L 300 60" />
        <path d="M 540 430 L 460 780" />
        <path d="M 540 430 L 760 780" />
      </g>

      {/* Secondary roads (lattice) */}
      <g stroke={P.road} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M 0 240 L 1000 260" />
        <path d="M 0 320 L 1000 340" />
        <path d="M 0 560 L 1000 540" />
        <path d="M 0 640 L 1000 620" />
        <path d="M 0 720 L 1000 700" />
        <path d="M 220 0 L 240 800" />
        <path d="M 360 0 L 380 800" />
        <path d="M 700 0 L 720 800" />
        <path d="M 820 0 L 840 800" />
      </g>

      {/* Vltava river — broad ribbon, curving through */}
      <path
        d="M 540 800
           C 520 720, 460 660, 430 580
           C 410 520, 410 480, 400 440
           C 390 400, 410 360, 440 320
           C 470 280, 500 260, 520 200
           C 540 140, 530 80, 560 0
           L 620 0
           C 590 100, 600 180, 580 240
           C 560 300, 530 340, 510 390
           C 490 430, 490 480, 510 540
           C 530 600, 580 680, 620 800
           Z"
        fill={P.water}
        stroke={P.waterEd}
        strokeWidth="2"
      />

      {/* River islands (small ovals) */}
      <ellipse cx="560" cy="430" rx="14" ry="42" fill={P.land} opacity="0.95" />
      <ellipse cx="565" cy="310" rx="11" ry="28" fill={P.land} opacity="0.95" />

      {/* Parks (large pale-green organic shapes) */}
      <g fill={P.park} stroke={P.parkDk} strokeWidth="1.5">
        {/* Letenské sady */}
        <path d="M 410 240 C 440 220, 540 220, 580 250 C 600 270, 600 290, 580 310 C 540 330, 460 330, 420 310 C 400 290, 400 260, 410 240 Z" />
        {/* Stromovka */}
        <path d="M 340 130 C 380 100, 460 110, 470 140 C 470 170, 440 200, 400 200 C 360 200, 320 170, 340 130 Z" />
        {/* Petřínské sady */}
        <path d="M 290 420 C 320 380, 370 380, 380 420 C 390 470, 360 530, 320 540 C 280 540, 270 480, 290 420 Z" />
        {/* Riegrovy sady */}
        <path d="M 670 380 C 720 360, 760 380, 770 420 C 770 450, 720 470, 680 460 C 650 450, 640 410, 670 380 Z" />
        {/* Vyšehrad park */}
        <path d="M 460 660 C 490 640, 530 650, 540 680 C 540 710, 510 730, 480 720 C 450 710, 440 680, 460 660 Z" />
      </g>

      {/* Park labels */}
      <g fill={P.label} fontFamily="Source Sans 3, sans-serif" fontSize="11" fontWeight="600"
         style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}>
        <text x="490" y="280">Letenské sady</text>
        <text x="370" y="160">Stromovka</text>
        <text x="305" y="500">Petřín</text>
        <text x="680" y="425">Riegrovy s.</text>
        <text x="475" y="695">Vyšehrad</text>
      </g>

      {/* Vltava label */}
      <g fill={P.waterEd} fontFamily="Source Sans 3, sans-serif" fontSize="12" fontWeight="700" opacity="0.85"
         style={{ letterSpacing: "0.25em", textTransform: "uppercase" }}>
        <text x="430" y="660" transform="rotate(-72 430 660)">VLTAVA</text>
      </g>

      {/* District labels (very faint) */}
      <g fill={P.label} fontFamily="Source Sans 3, sans-serif" fontSize="10" fontWeight="700"
         opacity="0.6" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
        <text x="468" y="370">Staré Město</text>
        <text x="612" y="540">Vinohrady</text>
        <text x="630" y="285">Karlín</text>
        <text x="285" y="615">Smíchov</text>
        <text x="340" y="445">Malá Strana</text>
        <text x="540" y="195">Holešovice</text>
        <text x="785" y="560">Strašnice</text>
        <text x="510" y="500">Nové Město</text>
      </g>

      {/* Subtle compass mark, bottom-right */}
      <g transform="translate(940, 740)" fill={P.label} opacity="0.55">
        <circle r="14" fill="none" stroke={P.label} strokeWidth="1" />
        <text x="-3" y="-18" fontFamily="Source Sans 3, sans-serif" fontSize="10" fontWeight="700">N</text>
        <path d="M 0 -10 L 4 4 L 0 0 L -4 4 Z" fill={P.label} />
      </g>
    </svg>
  );
}

// — Pin: price bubble — Airbnb-like rounded pill anchored above its coord.

function PricePin({ group, hovered, selected, onClick, onMouseEnter, onMouseLeave, style }) {
  const isMulti = group.items.length > 1;
  const cheapest = Math.min(...group.items.map(it => Math.min(...it.rates.map(r => r.price))));
  const active = hovered || selected;
  const bg = active ? "var(--ink-1)" : "white";
  const fg = active ? "white" : "var(--ink-1)";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        appearance: "none", cursor: "pointer", border: "none", padding: 0,
        background: "transparent",
        ...style,
      }}
    >
      <div style={{
        background: bg, color: fg,
        boxShadow: active
          ? "0 6px 18px rgba(15,18,22,0.28), 0 0 0 2px white"
          : "0 2px 6px rgba(15,18,22,0.18), 0 0 0 2px white",
        borderRadius: 999, padding: "5px 11px",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.01em",
        whiteSpace: "nowrap", lineHeight: 1.15,
        display: "inline-flex", alignItems: "center", gap: 5,
        transition: "background 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
        transform: active ? "scale(1.08)" : "scale(1)",
        transformOrigin: "bottom center",
      }}>
        {isMulti && (
          <span style={{
            background: active ? "color-mix(in oklch, var(--brand) 60%, white)" : "var(--brand)",
            color: "white",
            width: 18, height: 18, borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
          }}>{group.items.length}</span>
        )}
        <span>{cheapest.toLocaleString("cs-CZ")} Kč</span>
      </div>
      {/* arrow */}
      <div style={{
        width: 0, height: 0, margin: "0 auto",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `6px solid ${active ? "#1F2429" : "white"}`,
        filter: active ? "drop-shadow(0 2px 2px rgba(15,18,22,0.25))" : "drop-shadow(0 1px 1px rgba(15,18,22,0.20))",
        marginTop: -1,
      }} />
    </button>
  );
}

// — Cluster pin: circle showing item count, larger.

function ClusterPin({ cluster, hovered, onClick, onMouseEnter, onMouseLeave, style }) {
  const total = cluster.items.length;
  const prices = cluster.items.flatMap(it => it.rates.map(r => r.price));
  const min = Math.min(...prices);
  const size = total >= 6 ? 56 : total >= 3 ? 48 : 42;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        appearance: "none", cursor: "pointer", border: "none", padding: 0, background: "transparent",
        ...style,
      }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: hovered ? "var(--ink-1)" : "var(--brand)",
        color: "white",
        boxShadow: hovered
          ? "0 6px 18px rgba(15,18,22,0.30), 0 0 0 6px rgba(15,18,22,0.10)"
          : "0 4px 14px rgba(85,1,115,0.30), 0 0 0 6px rgba(85,1,115,0.16)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em",
        transition: "background 140ms ease, transform 140ms ease, box-shadow 140ms ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}>
        <div style={{ fontSize: total >= 6 ? 17 : 15 }}>{total}</div>
        <div style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 600, marginTop: 1 }}>od {min.toLocaleString("cs-CZ")}</div>
      </div>
    </button>
  );
}

// — Group apartments first by buildingId (always merged), optionally cluster by proximity.

function groupApartments(apartments, clusterRadius) {
  // 1) bucket by building
  const byBld = new Map();
  apartments.forEach(ap => {
    const k = ap.buildingId;
    if (!byBld.has(k)) byBld.set(k, { id: `b-${k}`, kind: "building", items: [], coords: ap.coords, buildingId: k });
    byBld.get(k).items.push(ap);
  });
  const buildings = Array.from(byBld.values());

  if (!clusterRadius || clusterRadius <= 0) return buildings;

  // 2) cluster buildings by proximity (single-pass)
  const used = new Set();
  const clusters = [];
  buildings.forEach((b, i) => {
    if (used.has(i)) return;
    let cx = b.coords.x, cy = b.coords.y;
    const merged = [b];
    used.add(i);
    buildings.forEach((other, j) => {
      if (j <= i || used.has(j)) return;
      const dx = other.coords.x - cx;
      const dy = other.coords.y - cy;
      if (Math.hypot(dx, dy) <= clusterRadius) {
        merged.push(other);
        used.add(j);
      }
    });
    if (merged.length === 1) {
      clusters.push(b);
    } else {
      // compute centroid
      const sx = merged.reduce((s, m) => s + m.coords.x, 0) / merged.length;
      const sy = merged.reduce((s, m) => s + m.coords.y, 0) / merged.length;
      clusters.push({
        id: `c-${merged.map(m => m.buildingId).join("-")}`,
        kind: "cluster",
        items: merged.flatMap(m => m.items),
        buildings: merged,
        coords: { x: sx, y: sy },
      });
    }
  });
  return clusters;
}

window.PragueIllustration = PragueIllustration;
window.PricePin = PricePin;
window.ClusterPin = ClusterPin;
window.groupApartments = groupApartments;
window.MAP_W = MAP_W;
window.MAP_H = MAP_H;
