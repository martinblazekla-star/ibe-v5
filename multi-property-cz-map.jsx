// Multi-property — Czech Republic map illustration + price pins
//
// CZ_W × CZ_H is the SVG-space size of the map. Hotel coords (data-multi-property.jsx
// `mapCoords`) live in this space; we render them in percent of container.
//
// Themes match the Prague Map View vocabulary (light / sage / warm).

(function () {
  const CZ_W = 1000;
  const CZ_H = 640;

  // ───────────────────────────────────────────────────────────────────────────
  //  Stylised CZ outline + neighbouring landmasses
  // ───────────────────────────────────────────────────────────────────────────

  const CZ_OUTLINE_PATH =
    // Simplified CZ shape — ~30 anchor points. Recognisable but not survey-grade.
    "M 70 290 " +
    "Q 60 250 80 215 " +
    "L 110 175 " +
    "L 165 140 " +
    "L 220 100 " +
    "L 310 75 " +
    "L 420 55 " +
    "L 500 50 " +
    "L 560 70 " +
    "L 640 95 " +
    "L 720 120 " +
    "L 780 130 " +
    "L 830 150 " +
    "L 870 195 " +
    "L 925 240 " +
    "L 955 280 " +
    "L 935 330 " +
    "L 880 365 " +
    "L 820 400 " +
    "L 760 420 " +
    "L 700 470 " +
    "L 660 520 " +
    "L 600 545 " +
    "L 510 580 " +
    "L 400 595 " +
    "L 320 575 " +
    "L 250 545 " +
    "L 175 500 " +
    "L 125 445 " +
    "L 90 390 " +
    "L 70 330 " +
    "Z";

  // Neighbour landmasses — drawn behind for context, with country labels.
  // Each path is approximate and stylised.
  const NEIGHBOURS = [
    {
      id: "de",
      label: "DE",
      path: "M -40 220 L 60 220 L 80 290 L 70 360 L 90 410 L -40 410 Z",
      labelAt: [12, 320],
    },
    {
      id: "pl",
      label: "PL",
      path: "M 60 60 L 220 50 L 380 35 L 520 32 L 640 70 L 720 95 L 780 110 L 830 130 L 880 165 L 920 215 L 960 250 L 1040 220 L 1040 -30 L 60 -30 Z",
      labelAt: [560, 30],
    },
    {
      id: "sk",
      label: "SK",
      path: "M 940 285 L 1040 270 L 1040 580 L 760 580 L 730 530 L 700 470 L 760 420 L 820 400 L 870 380 L 920 340 Z",
      labelAt: [990, 430],
    },
    {
      id: "at",
      label: "AT",
      path: "M 130 580 L 250 545 L 320 575 L 420 595 L 510 580 L 590 555 L 660 525 L 720 540 L 770 580 L 770 700 L 100 700 Z",
      labelAt: [420, 645],
    },
  ];

  // City markers (just dots — actual hotel pins overlay them).
  // const REFERENCE_CITIES = [...]; // (we already render hotels themselves)

  // ───────────────────────────────────────────────────────────────────────────
  //  Theme palette
  // ───────────────────────────────────────────────────────────────────────────

  function themePalette(theme) {
    switch (theme) {
      case "sage":
        return {
          bg: "linear-gradient(135deg, #EFF3EE 0%, #E3EBE0 100%)",
          land: "#D7E2D1",
          landStroke: "#A6BB9E",
          neighbour: "#EAECE7",
          neighbourStroke: "#C6CEC4",
          water: "#D7E1E8",
          highlight: "#B5CFC0",
          grid: "rgba(120, 138, 110, 0.10)",
          label: "#5A6E59",
        };
      case "warm":
        return {
          bg: "linear-gradient(135deg, #F7F0E4 0%, #EFE5D1 100%)",
          land: "#F2E6CB",
          landStroke: "#C7A86A",
          neighbour: "#ECE1CC",
          neighbourStroke: "#C8B594",
          water: "#DCE6E8",
          highlight: "#E0C893",
          grid: "rgba(168, 132, 70, 0.08)",
          label: "#7A623A",
        };
      default: // light
        return {
          bg: "linear-gradient(135deg, #F4F6F8 0%, #E8ECEF 100%)",
          land: "#E4E9ED",
          landStroke: "#B7C0C7",
          neighbour: "#EDEFF1",
          neighbourStroke: "#C8CED4",
          water: "#D8E3EC",
          highlight: "#C7D1D8",
          grid: "rgba(100, 110, 124, 0.10)",
          label: "#6A7280",
        };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Full illustration
  // ───────────────────────────────────────────────────────────────────────────

  function CzechMapIllustration({ theme = "light" }) {
    const p = themePalette(theme);
    return (
      <div style={{
        position: "absolute", inset: 0, background: p.bg, overflow: "hidden",
      }}>
        <svg viewBox={`0 0 ${CZ_W} ${CZ_H}`} preserveAspectRatio="xMidYMid meet"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="cz-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 L80 40" stroke={p.grid} strokeWidth="0.8" />
              <path d="M40 0 L40 80" stroke={p.grid} strokeWidth="0.8" />
            </pattern>
            <filter id="cz-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="0" dy="4" result="off" />
              <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <rect width={CZ_W} height={CZ_H} fill="url(#cz-grid)" />

          {/* Neighbour landmasses */}
          {NEIGHBOURS.map(n => (
            <g key={n.id}>
              <path d={n.path} fill={p.neighbour} stroke={p.neighbourStroke} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.95" />
              <text x={n.labelAt[0]} y={n.labelAt[1]}
                    fontFamily="var(--font-ui)" fontSize="22" fontWeight="700"
                    letterSpacing="0.18em" fill={p.label} opacity="0.55"
                    textAnchor="middle">{n.label}</text>
            </g>
          ))}

          {/* CZ landmass */}
          <path d={CZ_OUTLINE_PATH} fill={p.land} stroke={p.landStroke} strokeWidth="1.6"
                strokeLinejoin="round" filter="url(#cz-shadow)" />

          {/* Stylised rivers — Vltava / Labe arc */}
          <g stroke={p.water} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.85">
            <path d="M 320 580 Q 340 480 360 380 T 410 240 Q 430 175 480 105" />
            <path d="M 410 240 Q 520 230 620 220 T 800 200" />
          </g>

          {/* Inland highlights — Krkonoše & Šumava sketch */}
          <g fill={p.highlight} opacity="0.55">
            <path d="M 440 80 q 30 -20 60 0 q -10 25 -30 25 q -25 -2 -30 -25" />
            <path d="M 530 70 q 40 -15 70 0 q -10 22 -35 22 q -30 -3 -35 -22" />
            <path d="M 220 420 q 50 -30 100 -10 q -10 35 -55 35 q -40 -3 -45 -25" />
          </g>

          {/* "CZ" subtle label */}
          <text x="500" y="320" textAnchor="middle"
                fontFamily="var(--font-display)" fontSize="120" fontWeight="800"
                letterSpacing="0.04em" fill={p.landStroke} opacity="0.10">
            ČESKO
          </text>
        </svg>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Price pin (single hotel)
  // ───────────────────────────────────────────────────────────────────────────

  function PricePin({ hotel, hovered, selected, memberMode, style, onClick, onMouseEnter, onMouseLeave }) {
    const price = memberMode && hotel.memberPrice ? hotel.memberPrice : hotel.fromPrice;
    const featured = hovered || selected;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: "absolute", transform: "translate(-50%, -100%)",
          appearance: "none", border: "none", cursor: "pointer", padding: 0,
          background: "transparent",
          ...style,
          zIndex: featured ? 30 : 10,
        }}>
        <div style={{
          background: featured ? "var(--brand)" : "white",
          color: featured ? "white" : "var(--ink-1)",
          padding: "5px 11px", borderRadius: 999,
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          letterSpacing: "-0.005em",
          boxShadow: featured
            ? "0 6px 22px rgba(85,1,115,0.45)"
            : "0 2px 8px rgba(15,18,22,0.14)",
          border: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
          display: "inline-flex", alignItems: "center", gap: 5,
          whiteSpace: "nowrap",
          transition: "all 0.14s ease-out",
          transform: featured ? "scale(1.08)" : "scale(1)",
        }}>
          {memberMode && featured && <Icon name="sparkle" size={11} strokeWidth={2.2} color="white" />}
          {window.fmtMp(price)} Kč
        </div>
        {/* tail */}
        <div style={{
          width: 10, height: 10, background: featured ? "var(--brand)" : "white",
          margin: "-4px auto 0", transform: "rotate(45deg)",
          boxShadow: featured ? "1px 1px 0 var(--brand)" : "0 1px 0 white",
          borderRight: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
          borderBottom: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
        }} />
        {/* anchor dot */}
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: featured ? "var(--brand)" : "var(--ink-1)",
          margin: "2px auto 0",
          boxShadow: `0 0 0 3px ${featured ? "rgba(85,1,115,0.20)" : "rgba(31,36,41,0.18)"}`,
        }} />
      </button>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Cluster pin (multiple hotels in same area — e.g. Praha)
  // ───────────────────────────────────────────────────────────────────────────

  function ClusterPin({ count, fromPrice, hovered, selected, style, onClick, onMouseEnter, onMouseLeave }) {
    const featured = hovered || selected;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: "absolute", transform: "translate(-50%, -50%)",
          appearance: "none", border: "none", cursor: "pointer", padding: 0,
          background: "transparent",
          ...style,
          zIndex: featured ? 30 : 15,
        }}>
        <div style={{
          background: featured ? "var(--brand-dark)" : "var(--brand)",
          color: "white", borderRadius: 999,
          padding: "8px 13px",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
          boxShadow: featured
            ? "0 8px 26px rgba(85,1,115,0.55)"
            : "0 4px 16px rgba(85,1,115,0.35)",
          border: "2px solid white",
          display: "inline-flex", alignItems: "center", gap: 8,
          whiteSpace: "nowrap",
          transition: "all 0.14s ease-out",
          transform: featured ? "scale(1.07)" : "scale(1)",
        }}>
          <span style={{
            background: "white", color: "var(--brand)", borderRadius: 999,
            minWidth: 22, height: 22, padding: "0 6px",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13,
          }}>{count}</span>
          <span style={{ fontWeight: 700 }}>od {window.fmtMp(fromPrice)} Kč</span>
        </div>
      </button>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Group hotels into clusters (by mapCoords proximity)
  // ───────────────────────────────────────────────────────────────────────────

  function groupHotels(hotels, radius = 28) {
    // radius is in SVG-space px (CZ_W=1000). Two hotels merge if their
    // coords are within `radius`.
    const groups = [];
    hotels.forEach(h => {
      let found = false;
      for (const g of groups) {
        const dx = g.cx - h.mapCoords.x;
        const dy = g.cy - h.mapCoords.y;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          g.hotels.push(h);
          // re-center
          g.cx = g.hotels.reduce((s, x) => s + x.mapCoords.x, 0) / g.hotels.length;
          g.cy = g.hotels.reduce((s, x) => s + x.mapCoords.y, 0) / g.hotels.length;
          found = true;
          break;
        }
      }
      if (!found) {
        groups.push({
          id: `g-${h.id}`,
          cx: h.mapCoords.x, cy: h.mapCoords.y,
          hotels: [h],
        });
      }
    });
    // shape: single → kind=single, multi → kind=cluster
    return groups.map(g => ({
      id: g.id, coords: { x: g.cx, y: g.cy },
      kind: g.hotels.length > 1 ? "cluster" : "single",
      hotels: g.hotels,
    }));
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Map controls (zoom + legend)
  // ───────────────────────────────────────────────────────────────────────────

  function MapCtrlBtn({ children, onClick, title }) {
    return (
      <button onClick={onClick} title={title} style={{
        appearance: "none", border: "none", cursor: "pointer",
        width: 34, height: 34, borderRadius: 8, background: "white",
        boxShadow: "0 2px 8px rgba(15,18,22,0.12)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-1)",
      }}>{children}</button>
    );
  }

  Object.assign(window, {
    CZ_W, CZ_H,
    CzechMapIllustration,
    MpPricePin: PricePin,
    MpClusterPin: ClusterPin,
    mpGroupHotels: groupHotels,
    MpMapCtrlBtn: MapCtrlBtn,
  });
})();
