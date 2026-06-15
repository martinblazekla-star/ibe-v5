// LTR Multi-property — Map view-specific helpers
//
// Reuses CzechMapIllustration + grouping from multi-property-cz-map.jsx,
// adds:
//   • LtrUniversityMarker  — short-name pill anchored to CZ coords
//   • LtrMonthlyPin        — building pin showing monthly nájem
//   • LtrClusterPin        — cluster pin (Praha + Brno)

(function () {
  // ─── University marker ────────────────────────────────────────────────────

  function LtrUniversityMarker({ uni, dimmed, highlighted, style }) {
    const featured = highlighted;
    return (
      <div style={{
        position: "absolute", transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: featured ? 8 : 5,
        opacity: dimmed ? 0.35 : 1,
        ...style,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: featured ? "var(--brand-dark)" : "rgba(255,255,255,0.92)",
          color: featured ? "white" : "var(--brand-dark)",
          padding: "3px 9px", borderRadius: 999,
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11.5,
          letterSpacing: "0.04em",
          border: `1.5px dashed ${featured ? "var(--brand-dark)" : "var(--brand)"}`,
          boxShadow: featured ? "0 4px 12px rgba(31,138,91,0.35)" : "none",
          whiteSpace: "nowrap",
        }}>
          <Icon name="book" size={10} strokeWidth={2.4} color={featured ? "white" : "var(--brand-dark)"} />
          {uni.short}
        </div>
      </div>
    );
  }

  // ─── Monthly price pin (building) ─────────────────────────────────────────

  function LtrMonthlyPin({ building, hovered, selected, isicMode, style, onClick, onMouseEnter, onMouseLeave }) {
    const price = isicMode && building.studentPrice ? building.studentPrice : building.monthlyFrom;
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
          zIndex: featured ? 30 : 12,
        }}>
        <div style={{
          background: featured ? "var(--brand)" : "white",
          color: featured ? "white" : "var(--ink-1)",
          padding: "5px 11px", borderRadius: 999,
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
          letterSpacing: "-0.005em",
          boxShadow: featured
            ? "0 6px 22px rgba(31,138,91,0.45)"
            : "0 2px 8px rgba(15,18,22,0.14)",
          border: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
          display: "inline-flex", alignItems: "center", gap: 5,
          whiteSpace: "nowrap",
          transition: "all 0.14s ease-out",
          transform: featured ? "scale(1.08)" : "scale(1)",
        }}>
          {isicMode && featured && <Icon name="book" size={10} strokeWidth={2.4} color="white" />}
          {window.fmtLtrmp(price)} Kč/m.
        </div>
        <div style={{
          width: 10, height: 10, background: featured ? "var(--brand)" : "white",
          margin: "-4px auto 0", transform: "rotate(45deg)",
          borderRight: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
          borderBottom: `1.5px solid ${featured ? "var(--brand)" : "white"}`,
        }} />
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: featured ? "var(--brand)" : "var(--ink-1)",
          margin: "2px auto 0",
          boxShadow: `0 0 0 3px ${featured ? "rgba(31,138,91,0.22)" : "rgba(31,36,41,0.18)"}`,
        }} />
      </button>
    );
  }

  // ─── Cluster pin (multiple buildings in same city) ────────────────────────

  function LtrClusterPin({ count, fromPrice, hovered, selected, style, onClick, onMouseEnter, onMouseLeave }) {
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
          zIndex: featured ? 30 : 18,
        }}>
        <div style={{
          background: featured ? "var(--brand-dark)" : "var(--brand)",
          color: "white", borderRadius: 999,
          padding: "8px 13px",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
          boxShadow: featured
            ? "0 8px 26px rgba(23,107,71,0.55)"
            : "0 4px 16px rgba(31,138,91,0.40)",
          border: "2px solid white",
          display: "inline-flex", alignItems: "center", gap: 8,
          whiteSpace: "nowrap",
          transition: "all 0.14s ease-out",
          transform: featured ? "scale(1.07)" : "scale(1)",
        }}>
          <span style={{
            background: "white", color: "var(--brand-dark)", borderRadius: 999,
            minWidth: 22, height: 22, padding: "0 6px",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13,
          }}>{count}</span>
          <span style={{ fontWeight: 700 }}>od {window.fmtLtrmp(fromPrice)} Kč</span>
        </div>
      </button>
    );
  }

  Object.assign(window, {
    LtrUniversityMarker,
    LtrMonthlyPin,
    LtrClusterPin,
  });
})();
