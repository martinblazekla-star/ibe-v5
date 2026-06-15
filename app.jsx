// Main app: navigation, search bar, results header, list, summary, tweaks
const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "cozy",
  "showImage": true,
  "accent": "#1F8A5B",
  "sortBy": "recommended",
  "showHero": true
}/*EDITMODE-END*/;

const ACCENT_SWATCHES = {
  "#1F8A5B": { accent: "#1F8A5B", accentDark: "#176B47", accentInk: "#10623E" },
  "#550173": { accent: "#550173", accentDark: "#3F0156", accentInk: "#400159" },
  "#1F2429": { accent: "#1F2429", accentDark: "#0E1216", accentInk: "#1F2429" },
};

function TopNav() {
  return (
    <nav style={{
      height: 64, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase",
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)", marginRight: 8, verticalAlign: -1 }}></span>
        Hotel Balický
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 28 }}>
        <NavLink active>Ubytování</NavLink>
        <NavLink>Balíčky</NavLink>
        <NavLink>Služby</NavLink>
        <NavLink>Kontakt</NavLink>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18, fontSize: 14, color: "var(--ink-2)" }}>
        <span style={{ fontFamily: "var(--font-ui)" }}>CZ · CZK</span>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
          padding: "8px 14px", borderRadius: 6, cursor: "pointer",
        }}>Přihlásit</button>
      </div>
    </nav>
  );
}

function NavLink({ children, active }) {
  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
      color: active ? "var(--ink-1)" : "var(--ink-3)",
      textDecoration: "none", padding: "8px 12px", borderRadius: 6,
      position: "relative",
    }}>
      {children}
      {active && <span style={{
        position: "absolute", left: 12, right: 12, bottom: -19, height: 2,
        background: "var(--brand)", borderRadius: 1,
      }} />}
    </a>
  );
}

function SearchBar() {
  return (
    <div style={{
      background: "white", borderRadius: 12, border: "1px solid var(--border)",
      boxShadow: "0 4px 18px rgba(16,24,40,.06)",
      display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", alignItems: "stretch",
      overflow: "hidden",
    }}>
      <SearchField icon="calendar" label="Termín pobytu" value="Pá 15. května – Ne 17. května" sub="2 noci" />
      <SearchField icon="users" label="Hosté" value="2 dospělí" sub="bez dětí" />
      <SearchField icon="voucher" label="Voucher / kód" value="Zadejte kód" sub="zlevněné sazby" placeholder />
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "0 28px", letterSpacing: "0.02em",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon name="search" size={16} strokeWidth={2.4} />
        Hledat
      </button>
    </div>
  );
}

function SearchField({ icon, label, value, sub, placeholder }) {
  return (
    <button style={{
      appearance: "none", textAlign: "left", background: "white", border: "none", cursor: "pointer",
      padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
      borderRight: "1px solid var(--border)",
    }}>
      <Icon name={icon} size={20} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {label}
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: placeholder ? "var(--ink-3)" : "var(--ink-1)",
          lineHeight: 1.25, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{value}</div>
      </div>
    </button>
  );
}

function ResultsHeader({ count, sortBy, onSort }) {
  const sorts = [
    { id: "recommended", label: "Doporučené" },
    { id: "price-asc", label: "Cena (nejnižší)" },
    { id: "price-desc", label: "Cena (nejvyšší)" },
    { id: "size", label: "Velikost pokoje" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0 14px", borderBottom: "1px solid var(--border)", marginBottom: 16,
    }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.01em",
        }}>
          Dostupné pokoje
        </h2>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>
          {count} typů pokojů · Pá 15. – Ne 17. května · 2 noci · 2 dospělí
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)" }}>Seřadit:</span>
        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, background: "white", padding: 3 }}>
          {sorts.map(s => (
            <button key={s.id} onClick={() => onSort(s.id)} style={{
              appearance: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              padding: "6px 12px", borderRadius: 5,
              background: sortBy === s.id ? "var(--neutral-100)" : "transparent",
              color: sortBy === s.id ? "var(--ink-1)" : "var(--ink-3)",
            }}>{s.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
      marginBottom: 18, padding: "18px 22px", borderRadius: 10,
      background: "color-mix(in oklch, var(--brand) 4%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 12%, white)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 8, background: "var(--brand)", color: "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="sparkle" size={18} strokeWidth={1.8} />
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
            Ve Vašem termínu jsou dostupné výhodné balíčky
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
            Romantický víkend od 7 200 Kč · Wellness pobyt od 8 900 Kč
          </div>
        </div>
      </div>
      <a href="#" onClick={e => e.preventDefault()} style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--brand)",
        textDecoration: "none", letterSpacing: "0.02em", padding: "8px 14px",
        border: "1px solid color-mix(in oklch, var(--brand) 30%, white)", borderRadius: 6, background: "white",
      }}>Zobrazit balíčky →</a>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [expanded, setExpanded] = useStateApp(null);
  const [selected, setSelected] = useStateApp(null);

  const swatch = ACCENT_SWATCHES[t.accent] || ACCENT_SWATCHES["#1F8A5B"];

  const sortedRooms = useMemoApp(() => {
    const rs = [...window.ROOMS];
    if (t.sortBy === "price-asc") {
      rs.sort((a, b) => {
        const pa = a.rates.length ? Math.min(...a.rates.map(r => r.price)) : Infinity;
        const pb = b.rates.length ? Math.min(...b.rates.map(r => r.price)) : Infinity;
        return pa - pb;
      });
    } else if (t.sortBy === "price-desc") {
      rs.sort((a, b) => {
        const pa = a.rates.length ? Math.min(...a.rates.map(r => r.price)) : 0;
        const pb = b.rates.length ? Math.min(...b.rates.map(r => r.price)) : 0;
        return pb - pa;
      });
    } else if (t.sortBy === "size") {
      rs.sort((a, b) => b.size - a.size);
    }
    return rs;
  }, [t.sortBy]);

  // Open the first available room expanded by default for clarity
  useEffectApp(() => {
    if (expanded === null) {
      const first = sortedRooms.find(r => !r.soldOut);
      if (first) setExpanded(first.id);
    }
  }, []);

  return (
    <div style={{
      "--accent": swatch.accent,
      "--accent-dark": swatch.accentDark,
      "--accent-ink": swatch.accentInk,
      minHeight: "100vh", background: "var(--surface)",
      fontFamily: "var(--font-ui)",
    }}>
      <TopNav />

      {/* Sticky search bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "20px 32px 14px",
        boxShadow: "0 1px 0 var(--border-soft)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Vybrat pokoj</span>
          </div>
          <SearchBar />
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 32px 140px" }}>
        {t.showHero && <Hero />}

        <ResultsHeader count={sortedRooms.length} sortBy={t.sortBy} onSort={(v) => setTweak("sortBy", v)} />

        <div style={{ display: "flex", flexDirection: "column", gap: t.density === "compact" ? 10 : 14 }}>
          {sortedRooms.map(room => (
            <Room
              key={room.id}
              room={room}
              nights={window.NIGHTS}
              expanded={expanded === room.id}
              onToggle={() => setExpanded(expanded === room.id ? null : room.id)}
              onSelect={(rate) => {
                setSelected({ room, rate });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              density={t.density}
              showImage={t.showImage}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 56, padding: "24px 0", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)",
        }}>
          <div>Powered by IBE v4 · © Hotel Balický</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Storno podmínky</a>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Obchodní podmínky</a>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Ochrana osobních údajů</a>
          </div>
        </div>
      </main>

      {/* Floating selection summary */}
      {selected && (
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
          background: "white", borderTop: "1px solid var(--border)",
          boxShadow: "0 -6px 24px rgba(16,24,40,.08)",
          padding: "14px 32px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 22 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: "color-mix(in oklch, var(--accent) 12%, white)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent-ink)",
            }}>
              <Icon name="check" size={20} strokeWidth={2.4} />
            </span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                {selected.room.name} · {selected.rate.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
                {window.NIGHTS} noci · {window.GUESTS} · {selected.rate.cancellation}
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Celkem</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
                {fmt(selected.rate.price)} Kč
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
              padding: "10px 14px", borderRadius: 6, cursor: "pointer",
            }}>Změnit</button>
            <button style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              padding: "12px 22px", borderRadius: 6, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Pokračovat
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio label="Hustota řádků" value={t.density} onChange={v => setTweak("density", v)} options={[
            { value: "cozy", label: "Pohodlné" },
            { value: "compact", label: "Kompaktní" },
          ]} />
          <TweakToggle label="Fotka pokoje" value={t.showImage} onChange={v => setTweak("showImage", v)} />
          <TweakToggle label="Banner s balíčky" value={t.showHero} onChange={v => setTweak("showHero", v)} />
        </TweakSection>
        <TweakSection label="Barvy">
          <TweakColor label="Akcent (CTA)" value={t.accent} onChange={v => setTweak("accent", v)}
            options={["#1F8A5B", "#550173", "#1F2429"]}
          />
        </TweakSection>
        <TweakSection label="Řazení">
          <TweakSelect label="Výchozí řazení" value={t.sortBy} onChange={v => setTweak("sortBy", v)} options={[
            { value: "recommended", label: "Doporučené" },
            { value: "price-asc",  label: "Cena (od nejnižší)" },
            { value: "price-desc", label: "Cena (od nejvyšší)" },
            { value: "size",       label: "Velikost pokoje" },
          ]} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
