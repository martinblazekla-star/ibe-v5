// Upsell sections 2 — wellness slot picker + extras shop list + special package upsell

// ── Wellness ────────────────────────────────────────────────

function WellnessSection({ value, setValue }) {
  const procedures = [
    { id: "massage60", name: "Klasická masáž", duration: 60, price: 1290, image: "🌿" },
    { id: "couples", name: "Páro­vá masáž", duration: 90, price: 2890, image: "💆" },
    { id: "facial", name: "Pleťové ošetření", duration: 45, price: 990, image: "✨" },
    { id: "sauna", name: "Privátní sauna", duration: 90, price: 1490, image: "🧖" },
  ];
  const days = [
    { id: "d1", label: "Pá 15. 5.", short: "Pá", date: "15" },
    { id: "d2", label: "So 16. 5.", short: "So", date: "16" },
    { id: "d3", label: "Ne 17. 5.", short: "Ne", date: "17" },
  ];
  const slots = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30", "20:00"];

  const sel = value || { procedure: null, day: null, slot: null };
  const set = (patch) => setValue({ ...sel, ...patch });

  return (
    <UpsellCard icon="leaf" title="Hotelové wellness" sub="Rezervujte si proceduru s garancí termínu — při rezervaci předem 15 % sleva" badge="−15 % předem">
      {/* Step 1: procedure */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
        }}>1 · Vyberte proceduru</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {procedures.map(p => {
            const on = sel.procedure === p.id;
            return (
              <button key={p.id} onClick={() => set({ procedure: p.id })} style={{
                appearance: "none", cursor: "pointer", textAlign: "left",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                borderRadius: 10, padding: "11px 14px",
                fontFamily: "var(--font-ui)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 22, lineHeight: 1, filter: "grayscale(0.2)" }}>{p.image}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{p.duration} min</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", textDecoration: "line-through" }}>
                    {Math.round(p.price / 0.85).toLocaleString("cs-CZ")} Kč
                  </div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
                    {p.price.toLocaleString("cs-CZ")} Kč
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: day */}
      {sel.procedure && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
          }}>2 · Vyberte den</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {days.map(d => {
              const on = sel.day === d.id;
              return (
                <button key={d.id} onClick={() => set({ day: d.id })} style={{
                  appearance: "none", cursor: "pointer", flex: "0 0 80px",
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                  borderRadius: 10, padding: "10px 8px",
                  fontFamily: "var(--font-ui)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.short}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink-1)" }}>{d.date}</span>
                  <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}>května</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: slot */}
      {sel.procedure && sel.day && (
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
          }}>3 · Volný čas</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {slots.map((s, i) => {
              const on = sel.slot === s;
              const disabled = i === 2 || i === 4; // mock booked slots
              return (
                <button key={s} disabled={disabled} onClick={() => set({ slot: s })} style={{
                  appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: disabled ? "var(--neutral-50)" : (on ? "var(--brand)" : "white"),
                  color: disabled ? "var(--ink-3)" : (on ? "white" : "var(--ink-1)"),
                  fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
                  padding: "7px 14px", borderRadius: 8,
                  textDecoration: disabled ? "line-through" : "none",
                  opacity: disabled ? 0.6 : 1,
                }}>{s}</button>
              );
            })}
          </div>
          {sel.slot && (
            <div style={{
              marginTop: 12, padding: "10px 12px", background: "var(--accent-tint)", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--accent-dark)", fontWeight: 600,
            }}>
              <Icon name="check" size={14} strokeWidth={2.6} />
              Termín {days.find(d => d.id === sel.day)?.label} v {sel.slot} je k dispozici.
            </div>
          )}
        </div>
      )}
    </UpsellCard>
  );
}

// ── Extras shop ────────────────────────────────────────────────

function ExtrasShopSection({ value, setValue }) {
  const items = [
    { id: "welcome", icon: "🍾", name: "Welcome drink na pokoji", sub: "Lahev sektu Bohemia + ovoce", price: 590 },
    { id: "breakfast-room", icon: "🥐", name: "Snídaně na pokoj", sub: "Servírování v čase dle volby", price: 290, per: "osoba" },
    { id: "skipass-1d", icon: "🎿", name: "Skipas Ještěd 1 den", sub: "Dospělý · platí denně", price: 690, per: "osoba" },
    { id: "skipass-3d", icon: "🎿", name: "Skipas Ještěd 3 dny", sub: "Dospělý · za celý pobyt", price: 1690, per: "osoba" },
    { id: "transfer", icon: "🚗", name: "Letištní transfer", sub: "Z/na PRG · auto pro 4 osoby", price: 1290, per: "směr" },
    { id: "bike", icon: "🚴", name: "Půjčení e-kola", sub: "Včetně helmy a navigace", price: 590, per: "den" },
    { id: "champagne", icon: "🥂", name: "Lahev šampaňského", sub: "Veuve Clicquot Brut 0,75 l", price: 1490 },
    { id: "flowers", icon: "💐", name: "Květiny na pokoj", sub: "Sezónní kytice s vzkazem", price: 690 },
  ];
  const setQty = (id, n) => setValue(prev => ({ ...prev, [id]: Math.max(0, Math.min(8, n)) }));
  const get = (id) => value[id] || 0;

  return (
    <UpsellCard icon="tag" title="Drobnosti, které potěší" sub="Vše doručíme na pokoj nebo k recepci v den příjezdu">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map(it => {
          const qty = get(it.id);
          return (
            <div key={it.id} style={{
              border: `1.5px solid ${qty > 0 ? "var(--brand)" : "var(--border)"}`,
              background: qty > 0 ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{it.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{it.sub}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--ink-1)", marginTop: 4 }}>
                  {it.price.toLocaleString("cs-CZ")} Kč {it.per && <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>/ {it.per}</span>}
                </div>
              </div>
              <QtyStepper value={qty} onChange={(n) => setQty(it.id, n)} />
            </div>
          );
        })}
      </div>
    </UpsellCard>
  );
}

function QtyStepper({ value, onChange }) {
  if (value === 0) {
    return (
      <button onClick={() => onChange(1)} style={{
        appearance: "none", cursor: "pointer", border: "1.5px solid var(--brand)", background: "white",
        color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        padding: "7px 12px", borderRadius: 8, whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        <Icon name="plus" size={13} strokeWidth={2.6} />
        Přidat
      </button>
    );
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <button onClick={() => onChange(value - 1)} style={qtyBtnStyle}>−</button>
      <span style={{ minWidth: 18, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={qtyBtnStyle}>+</button>
    </div>
  );
}

const qtyBtnStyle = {
  appearance: "none", cursor: "pointer", border: "1.5px solid var(--border)", background: "white",
  width: 28, height: 28, borderRadius: 6, color: "var(--ink-1)",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ── Package upgrade ────────────────────────────────────────────────

function PackageUpgradeBanner() {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      display: "grid", gridTemplateColumns: "200px minmax(0, 1fr) auto",
      alignItems: "stretch",
    }}>
      <div style={{ background: `url(assets/room-3.png) center / cover no-repeat`, minHeight: 140 }} />
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "var(--brand)",
          padding: "3px 8px", background: "color-mix(in oklch, var(--brand) 8%, white)", borderRadius: 4, marginBottom: 8,
        }}>Doporučujeme</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>
          Vylepšit na balíček „Romantický víkend"
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.45 }}>
          Sekt + růže + 3-chodová večeře + 60 min wellness pro 2 — vše v jednom za výhodnější cenu.
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Ušetříte 1 800 Kč
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Bez omezení storna
          </span>
        </div>
      </div>
      <div style={{
        padding: "16px 22px", background: "color-mix(in oklch, var(--brand) 2%, white)",
        borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 10,
      }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Doplatek za upgrade</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
            + 2 300 Kč
          </div>
        </div>
        <button style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
          padding: "10px 16px", borderRadius: 8, letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}>Upgradovat pobyt</button>
      </div>
    </div>
  );
}

window.WellnessSection = WellnessSection;
window.ExtrasShopSection = ExtrasShopSection;
window.PackageUpgradeBanner = PackageUpgradeBanner;
