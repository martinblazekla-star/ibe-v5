// Wellness booking main app

const TWEAK_DEFAULTS_W = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "showBundle": true,
  "category": "all"
}/*EDITMODE-END*/;

function NavW() { return <PickRoomNav active="wellness" />; }

function HeroW() {
  return (
    <div style={{
      background: "color-mix(in oklch, var(--brand) 6%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 12%, white)",
      borderRadius: 12, padding: "22px 26px", marginBottom: 20,
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
          <Icon name="leaf" size={12} strokeWidth={2.2} />
          Hotelové wellness
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2,
        }}>
          Rezervujte si pohodu — předem a se slevou
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          Vyberte si proceduru a garantujeme Vám termín. Hosté hotelu mají při rezervaci předem slevu 15 % vs. cena na recepci.
        </div>
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-2)",
        background: "white", padding: "14px 18px", borderRadius: 10, border: "1px solid var(--border)", minWidth: 240,
      }}>
        <T2>Sleva 15 % pro hosty hotelu</T2>
        <T2>Storno zdarma 24 h předem</T2>
        <T2>Platba s pobytem na recepci</T2>
      </div>
    </div>
  );
}

function T2({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

function BundleBanner({ onSelect }) {
  const b = window.WELLNESS.find(p => p.bundle);
  if (!b) return null;
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", alignItems: "center", marginBottom: 18,
    }}>
      <div style={{
        width: 180, height: "100%", minHeight: 140,
        background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 18%, white), color-mix(in oklch, var(--brand) 6%, white))",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64,
      }}>{b.emoji}</div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "white",
          background: "var(--brand)", padding: "3px 9px", borderRadius: 4, marginBottom: 8,
        }}>
          <Icon name="flame" size={11} strokeWidth={2.4} /> {b.badge}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
          {b.name}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
          {b.desc}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> {b.duration} min
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Ušetříte {b.saving.toLocaleString("cs-CZ")} Kč
          </span>
        </div>
      </div>
      <div style={{
        padding: "20px 26px", borderLeft: "1px solid var(--border)",
        background: "color-mix(in oklch, var(--brand) 2%, white)",
        textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10,
      }}>
        <div>
          <span style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through" }}>
            {(b.price + b.saving).toLocaleString("cs-CZ")} Kč
          </span>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
            {b.price.toLocaleString("cs-CZ")} <span style={{ fontSize: 15, fontWeight: 600 }}>Kč</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>za 2 osoby</div>
        </div>
        <button onClick={() => onSelect(b)} style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "11px 16px", borderRadius: 8, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, whiteSpace: "nowrap",
        }}>Vybrat termín</button>
      </div>
    </div>
  );
}

function Categories({ active, setActive }) {
  const cats = [
    { id: "all", label: "Vše" },
    { id: "massage", label: "Masáže" },
    { id: "couples", label: "Pro páry" },
    { id: "beauty", label: "Kosmetika" },
    { id: "sauna", label: "Sauny" },
    { id: "package", label: "Balíčky" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
      {cats.map(c => {
        const on = active === c.id;
        return (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            appearance: "none", cursor: "pointer",
            border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
            background: on ? "var(--brand)" : "white",
            color: on ? "white" : "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
            padding: "8px 14px", borderRadius: 999,
          }}>{c.label}</button>
        );
      })}
    </div>
  );
}

function ProcedureCard({ p, onSelect }) {
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 160ms ease, border-color 160ms ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(16,24,40,.08)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{
        background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 14%, white), color-mix(in oklch, var(--brand) 4%, white))",
        padding: "26px 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative",
      }}>
        {p.emoji}
        {p.popular && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--accent-dark)",
            background: "white", padding: "3px 8px", borderRadius: 4,
          }}>Oblíbené</span>
        )}
      </div>
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
            margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
          }}>{p.name}</h3>
          <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12.5, color: "var(--ink-3)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="calendar" size={12} strokeWidth={1.8} /> {p.duration} min
            </span>
            {p.therapists.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="users" size={12} strokeWidth={1.8} /> {p.therapists.length} terapeutů
              </span>
            )}
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.45, flex: 1 }}>{p.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textDecoration: "line-through" }}>
              {Math.round(p.price / 0.85).toLocaleString("cs-CZ")} Kč
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.005em", lineHeight: 1 }}>
              {p.price.toLocaleString("cs-CZ")} <span style={{ fontSize: 13, fontWeight: 600 }}>Kč</span>
            </div>
          </div>
          <button onClick={() => onSelect(p)} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "9px 14px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            Vybrat termín
            <Icon name="chevron-right" size={14} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}

function WellnessCart({ items, onRemove, onClear }) {
  if (!items.length) return null;
  const total = items.reduce((s, i) => s + i.totalPrice, 0);
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
      background: "white", borderTop: "1px solid var(--border)",
      boxShadow: "0 -8px 24px rgba(16,24,40,.10)",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{
          width: 38, height: 38, borderRadius: 8, background: "var(--accent-tint)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)",
        }}>
          <Icon name="check" size={20} strokeWidth={2.6} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
            {items.length} {items.length === 1 ? "procedura" : items.length < 5 ? "procedury" : "procedur"} v rezervaci
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {items.map((it, i) => (
              <span key={i}>
                {i > 0 ? " · " : ""}
                {it.procedure.name} {window.WELLNESS_DAYS.find(d => d.id === it.day)?.full} {it.slot}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onClear} style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
          padding: "10px 14px", borderRadius: 6, cursor: "pointer",
        }}>Vyprázdnit</button>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Celkem</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
            {total.toLocaleString("cs-CZ")} Kč
          </div>
        </div>
        <a href="Checkout.html" style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "13px 24px", borderRadius: 6, letterSpacing: "0.02em", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Pokračovat
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

function AppW() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_W);
  const [cat, setCat] = React.useState(t.category || "all");
  const [picker, setPicker] = React.useState(null);
  const [cart, setCart] = React.useState([]);

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const list = window.WELLNESS.filter(p => cat === "all" ? !p.bundle : p.category === cat);

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
      paddingBottom: cart.length ? 90 : 0,
    }}>
      <NavW />

      <div style={{ background: "var(--surface)", padding: "16px 32px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Wellness rezervace</span>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 32px 80px" }}>
        {t.showHero && <HeroW />}
        {t.showBundle && cat === "all" && <BundleBanner onSelect={setPicker} />}
        <Categories active={cat} setActive={setCat} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {list.map(p => <ProcedureCard key={p.id} p={p} onSelect={setPicker} />)}
        </div>
        {list.length === 0 && (
          <div style={{
            padding: "60px 20px", textAlign: "center", color: "var(--ink-3)",
            background: "white", border: "1px solid var(--border)", borderRadius: 12,
          }}>
            V této kategorii momentálně nejsou žádné procedury.
          </div>
        )}
      </main>

      <window.WellnessSlotDialog
        open={!!picker}
        procedure={picker}
        onClose={() => setPicker(null)}
        onAdd={(item) => {
          setCart(c => [...c, item]);
          setPicker(null);
        }}
      />

      <WellnessCart items={cart} onClear={() => setCart([])} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Marketing hero" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Bundle banner" value={t.showBundle} onChange={v => setTweak("showBundle", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppW />);
