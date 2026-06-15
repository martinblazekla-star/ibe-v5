// Room detail dialog — opens from "Detail pokoje" links across pick-room views

function RoomDetailDialog({ open, room, onClose, onPickRate }) {
  const [imgIdx, setImgIdx] = React.useState(0);
  React.useEffect(() => { if (open) setImgIdx(0); }, [open, room?.id]);
  if (!open || !room) return null;

  // Mock multiple photos: same image repeated, in real implementation room.images
  const images = [room.image, room.image, room.image, room.image, room.image];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 1000,
        maxHeight: "92vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "grid", gridTemplateColumns: "440px minmax(0, 1fr)",
      }}>
        {/* Gallery */}
        <div style={{ background: "var(--neutral-100)", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: 1, minHeight: 380, overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `url(${images[imgIdx]}) center / cover no-repeat`,
              filter: room.soldOut ? "grayscale(0.5)" : "none",
            }} />
            <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
              {room.tags.slice(0, 2).map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase", color: "var(--ink-1)",
                  background: "rgba(255,255,255,0.94)", padding: "4px 9px", borderRadius: 4,
                }}>{t}</span>
              ))}
            </div>
            <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} style={navBtn("left")}>
              <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Icon name="chevron-right" size={16} strokeWidth={2.4} /></span>
            </button>
            <button onClick={() => setImgIdx((imgIdx + 1) % images.length)} style={navBtn("right")}>
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </button>
            <div style={{
              position: "absolute", left: "50%", bottom: 14, transform: "translateX(-50%)",
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 600,
              color: "white", background: "rgba(15,18,22,0.65)",
              padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5,
            }}>
              <Icon name="image" size={12} strokeWidth={1.8} />
              {imgIdx + 1} / {images.length}
            </div>
          </div>
          <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, background: "white", borderTop: "1px solid var(--border)" }}>
            {images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                appearance: "none", cursor: "pointer", border: `2px solid ${i === imgIdx ? "var(--brand)" : "transparent"}`,
                padding: 0, background: `url(${img}) center / cover no-repeat var(--neutral-100)`,
                aspectRatio: "4 / 3", borderRadius: 6, overflow: "hidden",
                opacity: i === imgIdx ? 1 : 0.7,
              }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", maxHeight: "92vh" }}>
          {/* Header */}
          <header style={{
            padding: "18px 22px 14px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                Detail pokoje
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", marginTop: 2, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {room.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>č. {room.number}</div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </header>

          {/* Scrollable */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Specs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 13.5, color: "var(--ink-2)" }}>
              {[
                { icon: "person", label: `${room.capacity} hostů` },
                { icon: "size", label: `${room.size} m²` },
                { icon: "bed", label: room.beds },
                { icon: "view", label: room.view },
              ].map((s, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name={s.icon} size={15} color="var(--ink-3)" strokeWidth={1.8} />
                  <span style={{ fontWeight: 500 }}>{s.label}</span>
                </span>
              ))}
            </div>

            {/* Description */}
            <div>
              <SectionTitleRD>O pokoji</SectionTitleRD>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                {room.name} je prostorný pokoj s designovým nábytkem, hedvábným povlečením a vlastní koupelnou s deštníkovou sprchou.
                Příjemná atmosféra a klidné prostředí — ideální pro páry i obchodní cesty. Ranní káva v posteli i večerní výhled z velkých oken.
              </p>
            </div>

            {/* Amenities full list */}
            <div>
              <SectionTitleRD>Vybavení pokoje</SectionTitleRD>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px" }}>
                {room.amenities.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-1)" }}>
                    <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rates list */}
            {!room.soldOut && room.rates.length > 0 && (
              <div>
                <SectionTitleRD>Dostupné sazby</SectionTitleRD>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {room.rates.map(rate => (
                    <div key={rate.id} style={{
                      background: "white", border: "1px solid var(--border)", borderRadius: 10,
                      padding: "12px 14px",
                      display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 14, alignItems: "center",
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)" }}>{rate.name}</span>
                          {rate.badge && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
                              background: "var(--accent-tint)", color: "var(--accent-dark)",
                              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
                            }}>
                              <Icon name="flame" size={10} strokeWidth={2.4} /> {rate.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                          <Chip>{rate.meal.replace(" v ceně", "")}</Chip>
                          <Chip accent={rate.cancellable} muted={!rate.cancellable}>
                            <Icon name={rate.cancellable ? "check" : "x"} size={10} strokeWidth={2.4} />
                            {rate.cancellable ? "Storno zdarma" : "Nevratná"}
                          </Chip>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {rate.originalPrice && (
                          <div style={{ fontSize: 11.5, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                            {rate.originalPrice.toLocaleString("cs-CZ")} Kč
                          </div>
                        )}
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", lineHeight: 1.05, marginTop: rate.originalPrice ? 2 : 0 }}>
                          {rate.price.toLocaleString("cs-CZ")} Kč
                        </div>
                        <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>za 2 noci</div>
                      </div>
                      <button onClick={() => onPickRate && onPickRate(room, rate)} style={{
                        appearance: "none", border: "none", cursor: "pointer",
                        background: "var(--brand)", color: "white",
                        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                        padding: "9px 14px", borderRadius: 6, letterSpacing: "0.02em",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}>
                        Vybrat
                        <Icon name="chevron-right" size={13} strokeWidth={2.4} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitleRD({ children }) {
  return (
    <div style={{
      fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
      textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
    }}>{children}</div>
  );
}

function Chip({ children, accent, muted }) {
  let bg = "var(--neutral-100)", color = "var(--ink-2)";
  if (accent) { bg = "var(--accent-tint)"; color = "var(--accent-dark)"; }
  if (muted) { bg = "var(--neutral-100)"; color = "var(--ink-3)"; }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 6px", borderRadius: 999, background: bg,
      color, fontSize: 11.5, fontWeight: 600,
    }}>{children}</span>
  );
}

function navBtn(side) {
  return {
    appearance: "none", border: "none", cursor: "pointer",
    background: "rgba(255,255,255,0.92)",
    width: 36, height: 36, borderRadius: "50%",
    color: "var(--ink-1)", boxShadow: "0 2px 8px rgba(0,0,0,.15)",
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [side]: 14,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
}

window.RoomDetailDialog = RoomDetailDialog;
