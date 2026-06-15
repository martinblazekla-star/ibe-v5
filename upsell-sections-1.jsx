// Upsell sections — selectable in any order, all optional

function UpsellHero({ savings }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 7%, white), color-mix(in oklch, var(--brand) 2%, white))",
      border: "1px solid color-mix(in oklch, var(--brand) 12%, white)", borderRadius: 12,
      padding: "24px 28px", marginBottom: 18,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    }}>
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--brand)",
          padding: "4px 9px", background: "white", border: "1px solid color-mix(in oklch, var(--brand) 18%, white)",
          borderRadius: 4, marginBottom: 10,
        }}>
          <Icon name="sparkle" size={12} strokeWidth={2.2} />
          Jen krok od dokončení
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2,
        }}>
          Vylepšete svůj pobyt
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          Vyberte si extra služby a doplňky. Při nákupu předem ušetříte oproti dokupování na místě a získáte garanci dostupnosti.
        </div>
      </div>
      <div style={{
        background: "white", padding: "14px 20px", borderRadius: 12, border: "1px solid var(--border)",
        textAlign: "center", minWidth: 200,
      }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Aktuální úspora
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--accent-dark)",
          marginTop: 4, letterSpacing: "-0.01em",
        }}>
          {savings.toLocaleString("cs-CZ")} Kč
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>vs. dokoupení na místě</div>
      </div>
    </div>
  );
}

function UpsellCard({ icon, title, sub, badge, children }) {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
    }}>
      <header style={{
        padding: "16px 20px", borderBottom: "1px solid var(--border-soft)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <span style={{
          width: 36, height: 36, borderRadius: 8, background: "var(--neutral-100)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)", flexShrink: 0,
        }}>
          <Icon name={icon} size={18} strokeWidth={1.8} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
              margin: 0, letterSpacing: "-0.005em",
            }}>{title}</h2>
            {badge && (
              <span style={{
                fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--accent-dark)",
                background: "var(--accent-tint)", padding: "3px 7px", borderRadius: 4,
              }}>{badge}</span>
            )}
          </div>
          {sub && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{sub}</div>}
        </div>
      </header>
      <div style={{ padding: "18px 20px" }}>
        {children}
      </div>
    </section>
  );
}

// ── Room upgrade ────────────────────────────────────────────────

function RoomUpgradeSection({ value, onChange }) {
  const opts = [
    { id: null, label: "Ponechat současný pokoj", sub: "Dvoulůžkový Deluxe (č. 107) · 30 m²", delta: 0, current: true },
    { id: "exec", label: "Upgrade na Executive", sub: "King size + rozkládací · 38 m² · výhled do parku", delta: 900, image: "assets/room-2.png" },
    { id: "suite", label: "Upgrade na Junior Suite", sub: "44 m² · obývací kout · espresso kávovar", delta: 2200, image: "assets/room-1.png", popular: true },
  ];
  return (
    <UpsellCard icon="bed" title="Upgrade pokoje" sub="Za malý doplatek si vyberte prostornější pokoj">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => {
          const on = value === o.id;
          return (
            <label key={o.id || "none"} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              {o.image && (
                <div style={{
                  width: 56, height: 44, borderRadius: 6, flexShrink: 0,
                  background: `url(${o.image}) center / cover no-repeat var(--neutral-100)`,
                }} />
              )}
              {!o.image && (
                <div style={{
                  width: 56, height: 44, borderRadius: 6, flexShrink: 0,
                  background: "var(--neutral-100)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)",
                }}><Icon name="check" size={18} strokeWidth={2.2} /></div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-1)" }}>{o.label}</span>
                  {o.current && <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, color: "var(--ink-3)", padding: "2px 6px", borderRadius: 4, background: "var(--neutral-100)" }}>Současný výběr</span>}
                  {o.popular && <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, color: "var(--accent-dark)", padding: "2px 6px", borderRadius: 4, background: "var(--accent-tint)" }}>Oblíbené</span>}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{o.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: o.delta === 0 ? "var(--ink-3)" : "var(--ink-1)", whiteSpace: "nowrap" }}>
                {o.delta === 0 ? "bez doplatku" : `+ ${o.delta.toLocaleString("cs-CZ")} Kč`}
              </span>
            </label>
          );
        })}
        <a href="#" onClick={e => e.preventDefault()} style={{
          marginTop: 2, fontSize: 13, fontWeight: 700, color: "var(--brand)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={14} strokeWidth={2} />
          Vybrat konkrétní pokoj z mapy hotelu →
        </a>
      </div>
    </UpsellCard>
  );
}

// ── Room features ────────────────────────────────────────────────

function RoomFeaturesSection({ value, setValue }) {
  const features = [
    { id: "view", icon: "view", label: "Výhled na pláž", sub: "Garantovaný výhled na moře", price: 800, per: "noc", multiplier: 2 },
    { id: "pet", icon: "leaf", label: "Pokoj vhodný pro psa", sub: "Miska, deka a pelíšek v ceně", price: 500, per: "noc", multiplier: 2 },
    { id: "quiet", icon: "info", label: "Pokoj na tiché straně", sub: "Daleko od výtahu a recepce", price: 0, per: "" },
    { id: "balcony", icon: "size", label: "Pokoj s balkonem", sub: "Posezení venku, ranní káva", price: 400, per: "noc", multiplier: 2 },
    { id: "connected", icon: "users", label: "Propojené pokoje", sub: "Vhodné pro rodiny s dětmi", price: 0, per: "", soldOut: true },
    { id: "smoking", icon: "flame", label: "Možnost kouření", sub: "Omezený počet pokojů", price: 300, per: "rezervace" },
  ];
  const toggle = (id) => setValue(prev => ({ ...prev, [id]: !prev[id] }));
  return (
    <UpsellCard icon="view" title="Vlastnosti pokoje" sub="Vyberte si konkrétní preferenci — garantujeme přidělení vybraného typu">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {features.map(f => {
          const on = !!value[f.id];
          const disabled = f.soldOut;
          return (
            <button key={f.id} onClick={() => !disabled && toggle(f.id)} disabled={disabled} style={{
              appearance: "none", cursor: disabled ? "not-allowed" : "pointer", textAlign: "left",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: disabled ? "var(--neutral-50)" : (on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white"),
              borderRadius: 10, padding: "12px 14px",
              fontFamily: "var(--font-ui)",
              display: "flex", alignItems: "flex-start", gap: 10,
              opacity: disabled ? 0.6 : 1,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 4,
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                background: on ? "var(--brand)" : "white", marginTop: 2,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <Icon name="check" size={12} color="white" strokeWidth={3} />}</span>
              <Icon name={f.icon} size={16} color="var(--ink-3)" strokeWidth={1.8} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{f.label}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.35 }}>{f.sub}</div>
                {disabled && <div style={{ fontSize: 11.5, color: "#A6151D", marginTop: 4, fontWeight: 700 }}>Není dostupné</div>}
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: f.price === 0 ? "var(--accent-dark)" : "var(--ink-1)", whiteSpace: "nowrap" }}>
                {f.price === 0 ? "zdarma" : `+ ${f.price * (f.multiplier || 1)} Kč`}
              </span>
            </button>
          );
        })}
      </div>
    </UpsellCard>
  );
}

// ── Parking ────────────────────────────────────────────────

function ParkingSection({ value, onChange }) {
  const opts = [
    { id: null, label: "Bez parkování", sub: "Veřejná parkoviště v okolí", delta: 0 },
    { id: "outdoor", label: "Venkovní parkoviště", sub: "U hotelu · střežené · 24/7", delta: 200, per: "noc", multiplier: 2 },
    { id: "garage", label: "Krytá garáž", sub: "Pod hotelem · vyhřívaná · 24/7", delta: 350, per: "noc", multiplier: 2, popular: true },
    { id: "valet", label: "Valet parking", sub: "Auto převezmou u recepce", delta: 600, per: "noc", multiplier: 2 },
  ];
  return (
    <UpsellCard icon="voucher" title="Parkování" sub="Zaručíte si místo bez stresu při příjezdu">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {opts.map(o => {
          const on = value === o.id;
          return (
            <label key={o.id || "none"} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer", position: "relative",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{o.label}</span>
                  {o.popular && <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, color: "var(--accent-dark)", padding: "2px 6px", borderRadius: 4, background: "var(--accent-tint)" }}>Doporučené</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{o.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: o.delta === 0 ? "var(--ink-3)" : "var(--ink-1)", whiteSpace: "nowrap" }}>
                {o.delta === 0 ? "—" : `+ ${(o.delta * (o.multiplier || 1)).toLocaleString("cs-CZ")} Kč`}
              </span>
            </label>
          );
        })}
      </div>
    </UpsellCard>
  );
}

window.UpsellHero = UpsellHero;
window.UpsellCard = UpsellCard;
window.RoomUpgradeSection = RoomUpgradeSection;
window.RoomFeaturesSection = RoomFeaturesSection;
window.ParkingSection = ParkingSection;
