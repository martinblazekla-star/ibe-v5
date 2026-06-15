// Room row component — the heart of the list view
const { useState } = React;

function fmt(n) { return n.toLocaleString("cs-CZ"); }

function Pill({ children, color = "neutral" }) {
  const palette = {
    neutral: { bg: "var(--neutral-50)", fg: "var(--ink-2)", bd: "var(--border)" },
    success: { bg: "color-mix(in oklch, var(--accent) 10%, white)", fg: "var(--accent-ink)", bd: "color-mix(in oklch, var(--accent) 30%, white)" },
    brand: { bg: "color-mix(in oklch, var(--brand) 8%, white)", fg: "var(--brand)", bd: "color-mix(in oklch, var(--brand) 25%, white)" },
    warn: { bg: "#FFF7E6", fg: "#9A6A00", bd: "#F2D88B" },
  };
  const c = palette[color] || palette.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600,
      letterSpacing: "0.01em", lineHeight: 1,
      padding: "5px 8px", borderRadius: 999,
      background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Spec({ icon, children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.2 }}>
      <Icon name={icon} size={16} color="var(--ink-3)" strokeWidth={1.8} />
      <span style={{ fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function RateRow({ rate, nights, onSelect, density }) {
  const pad = density === "compact" ? "10px 14px" : "14px 16px";
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto auto",
      gap: 16,
      alignItems: "center",
      padding: pad,
      borderTop: "1px solid var(--border)",
      background: rate.badge ? "color-mix(in oklch, var(--accent) 4%, white)" : "white",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
            {rate.name}
          </span>
          {rate.badge && (
            <Pill color="success">
              <Icon name="flame" size={12} strokeWidth={2} />
              {rate.badge}
            </Pill>
          )}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.35 }}>
          {rate.meal}
        </div>
      </div>
      <div style={{ minWidth: 0, fontSize: 13, color: rate.cancellable ? "var(--accent-ink)" : "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name={rate.cancellable ? "check" : "x"} size={14} strokeWidth={2.2} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{rate.cancellation}</span>
      </div>
      <div style={{ textAlign: "right", minWidth: 140 }}>
        {rate.originalPrice && (
          <div style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
            {fmt(rate.originalPrice)} Kč
          </div>
        )}
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", lineHeight: 1.1, marginTop: rate.originalPrice ? 2 : 0 }}>
          {fmt(rate.price)} Kč
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
          za {nights} noci celkem
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSelect(rate)}
        style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--accent)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "10px 18px", borderRadius: 6, letterSpacing: "0.02em",
          transition: "transform 120ms ease, background 120ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-dark)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
      >
        Vybrat
      </button>
    </div>
  );
}

function Room({ room, nights, onSelect, expanded, onToggle, density, showImage }) {
  const cheapest = room.rates.length ? Math.min(...room.rates.map(r => r.price)) : null;
  const original = room.rates.find(r => r.originalPrice)?.originalPrice;
  const imgH = density === "compact" ? 152 : 176;
  const imgW = density === "compact" ? 200 : 232;
  const rowPad = density === "compact" ? "16px 18px" : "20px 22px";

  return (
    <article style={{
      background: "white",
      border: "1px solid var(--border)",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      transition: "box-shadow 160ms ease, border-color 160ms ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,24,40,.08)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,.04)"; }}
    >
      <div style={{ display: "grid", gridTemplateColumns: showImage ? `${imgW}px minmax(0,1fr) auto` : "minmax(0,1fr) auto", gap: 22, padding: rowPad, alignItems: "stretch" }}>
        {showImage && (
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "var(--neutral-100)", height: imgH }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `url(${room.image}) center / cover no-repeat`,
              filter: room.soldOut ? "grayscale(1) brightness(.85)" : "none",
            }} />
            {room.soldOut && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,18,22,0.55)" }} />
            )}
            <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6 }}>
              {room.tags.slice(0, 1).map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", color: "var(--ink-1)",
                  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
                  padding: "4px 8px", borderRadius: 4,
                }}>{t}</span>
              ))}
            </div>
            <div style={{
              position: "absolute", right: 10, bottom: 10,
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
              color: "white", background: "rgba(15,18,22,0.55)",
              padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
            }}>
              <Icon name="image" size={12} strokeWidth={1.8} />
              <span>4</span>
            </div>
          </div>
        )}

        {/* Middle column: room info */}
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: density === "compact" ? 8 : 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: density === "compact" ? 18 : 20,
                color: "var(--ink-1)", margin: 0, lineHeight: 1.2, letterSpacing: "-0.005em",
              }}>
                {room.name}
              </h3>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)", fontWeight: 500 }}>
                č. {room.number}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, flexWrap: "wrap" }}>
              <Spec icon="person">{room.capacity}</Spec>
              <Spec icon="size">{room.size} m²</Spec>
              <Spec icon="bed">{room.beds}</Spec>
              <Spec icon="view">{room.view}</Spec>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {room.amenities.slice(0, 5).map(a => (
              <span key={a} style={{
                fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-2)",
                padding: "4px 9px", border: "1px solid var(--border)", borderRadius: 999, background: "white",
              }}>{a}</span>
            ))}
            {room.amenities.length > 5 && (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--brand)", padding: "4px 9px", fontWeight: 600 }}>
                +{room.amenities.length - 5} dalších
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {room.note && room.remaining && room.remaining <= 2 && (
              <Pill color="warn">
                <Icon name="flame" size={12} strokeWidth={2} />
                Poslední {room.remaining} {room.remaining === 1 ? "pokoj" : "pokoje"}
              </Pill>
            )}
            {room.note && (!room.remaining || room.remaining > 2) && (
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{room.note}</span>
            )}
            <a href="#" onClick={(e) => e.preventDefault()} style={{
              fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
              color: "var(--brand)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              Detail pokoje
              <Icon name="chevron-right" size={14} strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Right column: price + select */}
        <div style={{
          minWidth: 200, display: "flex", flexDirection: "column",
          justifyContent: "space-between", alignItems: "flex-end", gap: 12,
          borderLeft: "1px solid var(--border)", paddingLeft: 22,
        }}>
          {room.soldOut ? (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
                Vyprodáno
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, maxWidth: 200 }}>
                V termínu nedostupný pokoj. Zkuste náhradní termín.
              </div>
              <button type="button" style={{
                marginTop: 10, appearance: "none", border: "1px solid var(--border)",
                background: "white", color: "var(--ink-1)",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
                padding: "8px 14px", borderRadius: 6, cursor: "pointer",
              }}>Náhradní termín</button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1, marginBottom: 4 }}>
                  od · za {nights} noci
                </div>
                {original && (
                  <div style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                    {fmt(original)} Kč
                  </div>
                )}
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: density === "compact" ? 24 : 28, color: "var(--ink-1)",
                  lineHeight: 1.05, marginTop: 2, letterSpacing: "-0.01em",
                }}>
                  {fmt(cheapest)} <span style={{ fontSize: density === "compact" ? 14 : 16, fontWeight: 600 }}>Kč</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                  {room.rates.length} {room.rates.length > 1 ? "varianty" : "varianta"} cen
                </div>
              </div>
              <button
                type="button"
                onClick={onToggle}
                style={{
                  appearance: "none", border: "none", cursor: "pointer",
                  background: expanded ? "var(--ink-1)" : "var(--accent)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                  padding: "11px 18px", borderRadius: 6, letterSpacing: "0.02em",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "background 120ms ease",
                  width: "100%", justifyContent: "center",
                }}
              >
                {expanded ? "Skrýt varianty" : "Vybrat sazbu"}
                <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} strokeWidth={2.4} />
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && !room.soldOut && (
        <div>
          {room.rates.map(r => (
            <RateRow key={r.id} rate={r} nights={nights} onSelect={onSelect} density={density} />
          ))}
        </div>
      )}
    </article>
  );
}

window.Room = Room;
window.fmt = fmt;
