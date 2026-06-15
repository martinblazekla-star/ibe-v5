// Pick Room — MAP VIEW
// Airbnb-inspired apartment selector: scrolling card list (left) + sticky
// Prague map with price-bubble pins (right). Click a pin → mini popover.

const { useState: useStateMV, useMemo: useMemoMV, useRef: useRefMV, useEffect: useEffectMV } = React;

const TWEAK_DEFAULTS_MV = /*EDITMODE-BEGIN*/{
  "mapTheme": "light",
  "pinStyle": "price",
  "clusterRadius": 0,
  "split": "60/40",
  "showRating": true,
  "highlightFromCard": true
}/*EDITMODE-END*/;

function fmtMV(n) { return n.toLocaleString("cs-CZ"); }

// — Mini popover anchored to a pin —

function PinPopover({ group, side, onClose, onOpenDetail, onSelect }) {
  const [idx, setIdx] = useStateMV(0);
  useEffectMV(() => { setIdx(0); }, [group?.id]);
  if (!group) return null;

  const items = group.items;
  const ap = items[idx];
  const minPrice = Math.min(...ap.rates.map(r => r.price));
  const origRate = ap.rates.find(r => r.originalPrice);

  // Position the popover next to the pin (left/right of pin so it stays on map).
  // `side` = "left" or "right" — auto-chosen by AppMV based on pin's map x.
  const placement = {
    transform: side === "right"
      ? "translate(16px, -50%)"
      : "translate(calc(-100% - 16px), -50%)",
  };

  return (
    <div onClick={(e) => e.stopPropagation()} style={{
      position: "absolute", zIndex: 30, width: 320,
      background: "white", borderRadius: 14,
      boxShadow: "0 16px 44px rgba(15,18,22,0.22), 0 0 0 1px rgba(15,18,22,0.05)",
      overflow: "hidden",
      ...placement,
    }}>
      {/* Image with arrows */}
      <div style={{ position: "relative", aspectRatio: "16 / 11", background: `url(${ap.image}) center / cover no-repeat var(--neutral-100)` }}>
        <button onClick={onClose} aria-label="Zavřít" style={{
          position: "absolute", right: 8, top: 8,
          appearance: "none", border: "none", cursor: "pointer",
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.96)", color: "var(--ink-1)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(15,18,22,0.15)",
        }}><Icon name="x" size={15} strokeWidth={2.4} /></button>

        {ap.badge && (
          <span style={{
            position: "absolute", left: 10, top: 10,
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase", color: "var(--ink-1)",
            background: "rgba(255,255,255,0.96)", padding: "4px 8px", borderRadius: 4,
          }}>{ap.badge}</span>
        )}

        {items.length > 1 && (
          <>
            <button onClick={() => setIdx((idx - 1 + items.length) % items.length)} style={popArrow("left")}>
              <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Icon name="chevron-right" size={13} strokeWidth={2.6} /></span>
            </button>
            <button onClick={() => setIdx((idx + 1) % items.length)} style={popArrow("right")}>
              <Icon name="chevron-right" size={13} strokeWidth={2.6} />
            </button>
            <div style={{
              position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)",
              display: "flex", gap: 4,
            }}>
              {items.map((_, i) => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: i === idx ? "white" : "rgba(255,255,255,0.55)",
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.length > 1 && (
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--brand)" }}>
            {idx + 1} / {items.length} · {ap.building}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h4 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, lineHeight: 1.25,
            color: "var(--ink-1)", letterSpacing: "-0.005em",
          }}>{ap.name}</h4>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0, marginTop: 2 }}>
            <Icon name="star" size={12} color="var(--ink-1)" />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-1)" }}>{ap.rating.toFixed(2)}</span>
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>({ap.reviews})</span>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          {ap.neighborhood} · {ap.distance}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 12.5, color: "var(--ink-2)", marginTop: 2 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="person" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {ap.capacity}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="size" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {ap.size} m²
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="bed" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {ap.beds}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
          {origRate && (
            <span style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through" }}>
              {fmtMV(origRate.originalPrice)} Kč
            </span>
          )}
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>od</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
            {fmtMV(minPrice)}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Kč</span>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)", marginLeft: 2 }}>· 2 noci</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={() => onOpenDetail(ap)} style={{
            flex: 1, appearance: "none", cursor: "pointer",
            background: "white", border: "1px solid var(--border)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
            padding: "9px 10px", borderRadius: 7,
          }}>Detail</button>
          <button onClick={() => onSelect(ap)} style={{
            flex: 1, appearance: "none", cursor: "pointer",
            background: "var(--brand)", border: "none", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "9px 10px", borderRadius: 7, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>Vybrat sazbu <Icon name="chevron-right" size={12} strokeWidth={2.6} /></button>
        </div>
      </div>
    </div>
  );
}

function popArrow(side) {
  return {
    position: "absolute", top: "50%", [side]: 8, transform: "translateY(-50%)",
    appearance: "none", border: "none", cursor: "pointer",
    width: 24, height: 24, borderRadius: "50%",
    background: "rgba(255,255,255,0.95)", color: "var(--ink-1)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 6px rgba(15,18,22,0.18)",
  };
}

// — Apartment card (left list) —

function ApartmentCard({ ap, hovered, selected, onHover, onClick, showRating, onOpenDetail, onSelect }) {
  const minPrice = Math.min(...ap.rates.map(r => r.price));
  const origRate = ap.rates.find(r => r.originalPrice);
  const tone = hovered || selected;

  return (
    <article
      onMouseEnter={() => onHover(ap.buildingId)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(ap)}
      style={{
        cursor: "pointer",
        background: "white",
        border: `1.5px solid ${selected ? "var(--brand)" : tone ? "color-mix(in oklch, var(--brand) 30%, var(--border))" : "var(--border)"}`,
        borderRadius: 14, overflow: "hidden",
        boxShadow: tone ? "0 8px 22px rgba(16,24,40,0.10)" : "0 1px 2px rgba(16,24,40,0.04)",
        transition: "box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease",
        transform: tone ? "translateY(-2px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        background: `url(${ap.image}) center / cover no-repeat var(--neutral-100)`,
        position: "relative", aspectRatio: "16 / 10",
      }}>
        {ap.badge && (
          <span style={{
            position: "absolute", left: 10, top: 10,
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase", color: "var(--ink-1)",
            background: "rgba(255,255,255,0.96)", padding: "4px 8px", borderRadius: 4,
          }}>{ap.badge}</span>
        )}
        <div style={{
          position: "absolute", right: 10, bottom: 10,
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 600,
          color: "white", background: "rgba(15,18,22,0.55)",
          padding: "3px 7px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={11} strokeWidth={1.8} />
          8 foto
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--brand)" }}>
              {ap.neighborhood}
            </div>
            <h3 style={{
              margin: "3px 0 0", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, lineHeight: 1.25,
              color: "var(--ink-1)", letterSpacing: "-0.005em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{ap.name}</h3>
          </div>
          {showRating && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              <Icon name="star" size={13} color="var(--ink-1)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-1)" }}>{ap.rating.toFixed(2)}</span>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>({ap.reviews})</span>
            </div>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          {ap.building} · {ap.distance}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 13, color: "var(--ink-2)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="person" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {ap.capacity}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="size" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {ap.size} m²
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="bed" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {ap.beds}
          </span>
        </div>

        <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.4,
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
        }}>
          {ap.amenities.slice(0, 4).join(" · ")}
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
          <div>
            {origRate && (
              <div style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                {fmtMV(origRate.originalPrice)} Kč
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>od</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                {fmtMV(minPrice)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Kč</span>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>· 2 noci</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(ap); }}
            style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
              padding: "9px 14px", borderRadius: 7, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
            Vybrat sazbu <Icon name="chevron-right" size={12} strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </article>
  );
}

// — Compact rate-picker dialog (shared shape with grid view's RatePicker) —

function ApRatePicker({ open, apartment, onClose, onPick }) {
  if (!open || !apartment) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 720,
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
        display: "flex", flexDirection: "column", maxHeight: "92vh",
      }}>
        <header style={{
          padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Dostupné sazby</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", marginTop: 2 }}>{apartment.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1 }}>{apartment.building} · {apartment.capacity} osob · {apartment.size} m²</div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px", background: "var(--neutral-50)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {apartment.rates.map(rate => (
              <div key={rate.id} style={{
                background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px",
                display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: 16, alignItems: "center",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{rate.name}</span>
                    {rate.badge && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
                        background: "var(--accent-tint)", color: "var(--accent-dark)",
                        fontSize: 10.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
                      }}><Icon name="flame" size={11} strokeWidth={2.4} /> {rate.badge}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 6px", borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent-dark)", fontSize: 12, fontWeight: 600 }}>
                      {rate.meal}
                    </span>
                    <span style={{ padding: "2px 6px", borderRadius: 999, background: rate.cancellable ? "var(--accent-tint)" : "var(--neutral-100)", color: rate.cancellable ? "var(--accent-dark)" : "var(--ink-3)", fontSize: 12, fontWeight: 600 }}>
                      {rate.cancellable ? "Storno zdarma" : "Nevratná"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 100 }}>
                  {rate.originalPrice && (
                    <div style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through" }}>
                      {fmtMV(rate.originalPrice)} Kč
                    </div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.005em" }}>
                    {fmtMV(rate.price)} <span style={{ fontSize: 12, fontWeight: 600 }}>Kč</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 1 }}>za 2 noci</div>
                </div>
                <button onClick={() => onPick(rate)} style={{
                  appearance: "none", border: "none", cursor: "pointer",
                  background: "var(--brand)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                  padding: "10px 16px", borderRadius: 6, letterSpacing: "0.02em",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>Vybrat <Icon name="chevron-right" size={12} strokeWidth={2.4} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// — Filters dialog (replaces inline chips) —

const FILTER_DEFAULTS = {
  neighborhoods: [],   // empty = all
  priceMin: 0,
  priceMax: 12000,
  capacity: "any",     // any | 2 | 3 | 4
  amenities: [],       // ids
  minRating: 0,
};

const AMENITY_OPTIONS = [
  { id: "kitchen",  label: "Plně vybavená kuchyň", match: ["Plně vybavená kuchyň"] },
  { id: "washer",   label: "Pračka",               match: ["Pračka", "Pračka & sušička"] },
  { id: "ac",       label: "Klimatizace",          match: ["Klimatizace"] },
  { id: "balcony",  label: "Balkon / terasa",      match: ["Balkon", "Terasa 18 m²"] },
  { id: "fastwifi", label: "Rychlý WiFi 600+ Mbps",match: ["WiFi 600 Mbps", "WiFi 1 Gbps"] },
];

function apartmentMatchesFilter(ap, f) {
  if (f.neighborhoods.length && !f.neighborhoods.includes(ap.neighborhood)) return false;
  const cheap = Math.min(...ap.rates.map(r => r.price));
  if (cheap < f.priceMin || cheap > f.priceMax) return false;
  if (f.capacity !== "any") {
    const cap = parseInt(String(ap.capacity).split(/[+]/)[0], 10);
    if (cap < parseInt(f.capacity, 10)) return false;
  }
  for (const aid of f.amenities) {
    const opt = AMENITY_OPTIONS.find(o => o.id === aid);
    if (!opt) continue;
    const has = ap.amenities.some(am => opt.match.some(m => am.includes(m)));
    if (!has) return false;
  }
  if (f.minRating && ap.rating < f.minRating) return false;
  return true;
}

function countActiveFilters(f) {
  let n = 0;
  if (f.neighborhoods.length) n += 1;
  if (f.priceMin !== FILTER_DEFAULTS.priceMin || f.priceMax !== FILTER_DEFAULTS.priceMax) n += 1;
  if (f.capacity !== "any") n += 1;
  if (f.amenities.length) n += 1;
  if (f.minRating) n += 1;
  return n;
}

function FilterDialog({ open, value, counts, totalMatch, onClose, onApply, onReset }) {
  const [draft, setDraft] = useStateMV(value);
  useEffectMV(() => { if (open) setDraft(value); }, [open, value]);
  if (!open) return null;

  const previewMatch = MV_APARTS.filter(a => apartmentMatchesFilter(a, draft)).length;

  function toggleArr(key, val) {
    setDraft(d => {
      const cur = d[key];
      return { ...d, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 680,
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
        display: "flex", flexDirection: "column", maxHeight: "92vh",
      }}>
        <header style={{
          padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Upřesnit výběr</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", marginTop: 2 }}>Filtry</div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Lokalita */}
          <FilterGroup label="Lokalita" hint="Vyberte 1 nebo více čtvrtí. Bez výběru = všechny.">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {window.APARTMENT_NEIGHBORHOODS.map(n => {
                const on = draft.neighborhoods.includes(n);
                const c = counts.get(n) || 0;
                return (
                  <button key={n} onClick={() => toggleArr("neighborhoods", n)} style={chipStyle(on)}>
                    {on && <Icon name="check" size={11} strokeWidth={2.6} />}
                    {n}
                    <span style={{ opacity: 0.55, fontWeight: 600, fontSize: 11 }}>{c}</span>
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Cena */}
          <FilterGroup label="Cena za 2 noci" hint={`${fmtMV(draft.priceMin)} – ${fmtMV(draft.priceMax)} Kč`}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "center" }}>
              <PriceField label="Od" value={draft.priceMin} onChange={v => setDraft(d => ({ ...d, priceMin: v }))} max={draft.priceMax} />
              <PriceField label="Do" value={draft.priceMax} onChange={v => setDraft(d => ({ ...d, priceMax: v }))} min={draft.priceMin} />
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {[
                { lo: 0, hi: 4000, label: "Do 4 000 Kč" },
                { lo: 4000, hi: 6000, label: "4 – 6 000 Kč" },
                { lo: 6000, hi: 9000, label: "6 – 9 000 Kč" },
                { lo: 9000, hi: 12000, label: "9 000+ Kč" },
              ].map((p, i) => {
                const on = draft.priceMin === p.lo && draft.priceMax === p.hi;
                return (
                  <button key={i} onClick={() => setDraft(d => ({ ...d, priceMin: p.lo, priceMax: p.hi }))} style={chipStyle(on)}>
                    {p.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Kapacita */}
          <FilterGroup label="Kapacita">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { id: "any", label: "Libovolná" },
                { id: "2", label: "2+ osoby" },
                { id: "3", label: "3+ osoby" },
                { id: "4", label: "4+ osoby" },
              ].map(o => (
                <button key={o.id} onClick={() => setDraft(d => ({ ...d, capacity: o.id }))} style={chipStyle(draft.capacity === o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Vybavení */}
          <FilterGroup label="Vybavení">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {AMENITY_OPTIONS.map(o => {
                const on = draft.amenities.includes(o.id);
                return (
                  <button key={o.id} onClick={() => toggleArr("amenities", o.id)} style={chipStyle(on)}>
                    {on && <Icon name="check" size={11} strokeWidth={2.6} />}
                    {o.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Hodnocení */}
          <FilterGroup label="Min. hodnocení">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { v: 0, label: "Bez omezení" },
                { v: 4.5, label: "4,5+" },
                { v: 4.8, label: "4,8+" },
                { v: 4.9, label: "4,9+ (výjimečné)" },
              ].map(o => (
                <button key={o.v} onClick={() => setDraft(d => ({ ...d, minRating: o.v }))} style={chipStyle(draft.minRating === o.v)}>
                  {o.v > 0 && <Icon name="star" size={11} color="var(--ink-1)" />}
                  {o.label}
                </button>
              ))}
            </div>
          </FilterGroup>
        </div>

        <footer style={{
          padding: "14px 22px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={() => setDraft(FILTER_DEFAULTS)} style={{
            appearance: "none", border: "none", background: "transparent",
            color: "var(--ink-2)", textDecoration: "underline",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Vymazat vše</button>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              <strong style={{ color: "var(--ink-1)" }}>{previewMatch}</strong> {previewMatch === 1 ? "apartmán" : previewMatch < 5 ? "apartmány" : "apartmánů"} odpovídá
            </span>
            <button onClick={() => onApply(draft)} disabled={previewMatch === 0} style={{
              appearance: "none", border: "none", cursor: previewMatch === 0 ? "not-allowed" : "pointer",
              background: previewMatch === 0 ? "var(--ink-4)" : "var(--brand)",
              color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              padding: "11px 18px", borderRadius: 7, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              Zobrazit {previewMatch} {previewMatch === 1 ? "apartmán" : previewMatch < 5 ? "apartmány" : "apartmánů"}
              <Icon name="chevron-right" size={13} strokeWidth={2.4} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FilterGroup({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function chipStyle(on) {
  return {
    appearance: "none", cursor: "pointer",
    background: on ? "var(--ink-1)" : "white",
    border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
    color: on ? "white" : "var(--ink-1)",
    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
    padding: "7px 12px", borderRadius: 999,
    display: "inline-flex", alignItems: "center", gap: 5,
  };
}

function PriceField({ label, value, onChange, min = 0, max = 99999 }) {
  return (
    <label style={{
      display: "flex", flexDirection: "column", gap: 4,
      border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px",
      background: "white",
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <input type="number" value={value} step={500} min={min} max={max}
          onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value || 0, 10))))}
          style={{
            appearance: "none", border: "none", outline: "none", width: "100%",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
            padding: 0, background: "transparent",
          }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Kč</span>
      </div>
    </label>
  );
}

window.FilterDialog = FilterDialog;
window.FILTER_DEFAULTS = FILTER_DEFAULTS;
window.apartmentMatchesFilter = apartmentMatchesFilter;
window.countActiveFilters = countActiveFilters;
