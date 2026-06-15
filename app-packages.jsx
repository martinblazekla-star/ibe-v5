// Pick Package view — emotional, anti-OTA, conversion-focused
const { useState: useStatePkg } = React;

const TWEAK_DEFAULTS_PKG = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "showRoomsLink": true,
  "stickyHeader": true
}/*EDITMODE-END*/;

function fmtP(n) { return n.toLocaleString("cs-CZ"); }

// — Reused chrome —

function TopNavPkg() { return <PickRoomNav active="balicky" />; }

function SearchBarPkg() {
  const Field = ({ icon, label, value, placeholder }) => (
    <button style={{
      appearance: "none", textAlign: "left", background: "white", border: "none", cursor: "pointer",
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
      borderRight: "1px solid var(--border)",
    }}>
      <Icon name={icon} size={18} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
          color: placeholder ? "var(--ink-3)" : "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{value}</div>
      </div>
    </button>
  );
  return (
    <div style={{
      background: "white", borderRadius: 10, border: "1px solid var(--border)",
      boxShadow: "0 2px 10px rgba(16,24,40,.05)",
      display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", alignItems: "stretch", overflow: "hidden",
    }}>
      <Field icon="calendar" label="Termín" value="Pá 15. května – Po 18. května · 3 noci" />
      <Field icon="users" label="Hosté" value="2 dospělí · 0 dětí" />
      <Field icon="voucher" label="Voucher" value="Zadejte kód" placeholder />
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "0 24px", letterSpacing: "0.02em",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon name="search" size={16} strokeWidth={2.4} />
        Změnit hledání
      </button>
    </div>
  );
}

// — Package-specific —

function CategoryStrip({ active, setActive }) {
  const cats = [
    { id: "all", label: "Všechny balíčky", count: 4 },
    { id: "couples", label: "Pro páry", count: 1 },
    { id: "wellness", label: "Wellness", count: 1 },
    { id: "family", label: "Rodinné", count: 1 },
    { id: "city", label: "City break", count: 1 },
    { id: "seasonal", label: "Sezónní", count: 0 },
  ];
  return (
    <div style={{
      display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
      paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 18,
    }}>
      {cats.map(c => {
        const isActive = active === c.id;
        return (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            appearance: "none", cursor: "pointer",
            border: `1.5px solid ${isActive ? "var(--brand)" : "var(--border)"}`,
            background: isActive ? "var(--brand)" : "white",
            color: isActive ? "white" : "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
            padding: "8px 14px", borderRadius: 999,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {c.label}
            <span style={{
              fontSize: 11.5, fontWeight: 700, padding: "1px 6px", borderRadius: 999,
              background: isActive ? "rgba(255,255,255,0.18)" : "var(--neutral-100)",
              color: isActive ? "white" : "var(--ink-3)",
            }}>{c.count}</span>
          </button>
        );
      })}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Seřadit:</span>
        <select style={{
          appearance: "none", border: "1px solid var(--border)", borderRadius: 6, background: "white",
          padding: "7px 28px 7px 12px", fontSize: 13, fontWeight: 600, color: "var(--ink-1)", cursor: "pointer",
          backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
          backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
        }}>
          <option>Doporučené</option>
          <option>Cena (od nejnižší)</option>
          <option>Největší úspora</option>
        </select>
      </div>
    </div>
  );
}

function HeroPkg() {
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
          <Icon name="sparkle" size={12} strokeWidth={2.2} />
          Exkluzivně přes náš web
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2,
        }}>
          Balíčky, které jinde nenajdete — ušetřete až 30 %
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          Připravili jsme pro vás tematické pobyty, které kombinují ubytování s gastronomií, wellness a zážitky. Vždy s lepší cenou než samostatně.
        </div>
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-2)",
        background: "white", padding: "14px 18px", borderRadius: 10, border: "1px solid var(--border)", minWidth: 220,
      }}>
        <Trust>Nejnižší cena zaručena</Trust>
        <Trust>Bez rezervačních poplatků</Trust>
        <Trust>Storno zdarma do 7 dní</Trust>
      </div>
    </div>
  );
}

function Trust({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
      <span>{children}</span>
    </div>
  );
}

function PackageCard({ pkg, onSelect }) {
  const savingPct = Math.round((pkg.savings / pkg.originalPrice) * 100);
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      display: "grid", gridTemplateColumns: "minmax(340px, 1fr) minmax(0, 1.4fr) 240px",
      transition: "box-shadow 160ms ease, border-color 160ms ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,24,40,.08)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,.04)"; }}>
      {/* Image */}
      <div style={{ position: "relative", minHeight: 280, background: `url(${pkg.image}) center / cover no-repeat var(--neutral-100)` }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,18,22,0) 55%, rgba(15,18,22,0.55) 100%)",
        }} />
        <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pkg.badge && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "white",
              background: "var(--brand)", padding: "5px 9px", borderRadius: 4,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <Icon name="flame" size={11} strokeWidth={2.4} /> {pkg.badge}
            </span>
          )}
          {savingPct >= 20 && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--accent-dark)",
              background: "white", padding: "5px 9px", borderRadius: 4,
            }}>
              Ušetříte {savingPct} %
            </span>
          )}
        </div>
        <div style={{
          position: "absolute", left: 12, bottom: 12, display: "flex", gap: 6, flexWrap: "wrap",
        }}>
          {pkg.tags.map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 600, color: "white",
              background: "rgba(15,18,22,0.45)", backdropFilter: "blur(6px)",
              padding: "4px 9px", borderRadius: 4,
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          position: "absolute", right: 12, bottom: 12,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
          color: "white", background: "rgba(15,18,22,0.6)",
          padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={12} strokeWidth={1.8} />
          <span>12 foto</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
            margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
          }}>{pkg.name}</h3>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.4 }}>
            {pkg.tagline}
          </div>
        </div>
        <p style={{
          fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: 0,
        }}>{pkg.description}</p>
        <div style={{
          marginTop: 4, padding: "12px 14px", background: "var(--neutral-50)",
          borderRadius: 8, border: "1px solid var(--border-soft)",
        }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
          }}>V balíčku zahrnuto</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
            {pkg.inclusions.map((inc, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: "var(--ink-1)", lineHeight: 1.35,
              }}>
                <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
                <span>{inc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{
        padding: "22px 22px", background: "color-mix(in oklch, var(--brand) 2%, white)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)",
          }}>Cena za balíček</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "line-through" }}>
              {fmtP(pkg.originalPrice)} Kč
            </span>
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, color: "var(--accent-dark)",
              background: "var(--accent-tint)", padding: "2px 6px", borderRadius: 4,
            }}>
              −{fmtP(pkg.savings)} Kč
            </span>
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--ink-1)",
            lineHeight: 1.05, marginTop: 2, letterSpacing: "-0.01em",
          }}>
            {fmtP(pkg.fromPrice)} <span style={{ fontSize: 16, fontWeight: 600 }}>Kč</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
            za {pkg.nights} noci · 2 osoby
          </div>
          <div style={{
            marginTop: 12, padding: "10px 12px", background: "white", border: "1px solid var(--border)",
            borderRadius: 8, display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--ink-2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
              <span>Storno zdarma do 7 dní</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
              <span>Bez rezervačních poplatků</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-package-detail", { detail: { pkg } }))} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
            padding: "13px 16px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            Vybrat balíček
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-package-detail", { detail: { pkg } }))} style={{
            appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
            color: "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
            padding: "9px 14px", borderRadius: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            Detail balíčku
          </button>
        </div>
      </div>
    </article>
  );
}

function RoomsLink() {
  return (
    <div style={{
      marginTop: 28, padding: "20px 24px", background: "white",
      border: "1px solid var(--border)", borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 8, background: "var(--neutral-100)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
        }}>
          <Icon name="bed" size={20} strokeWidth={1.8} />
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
            Hledáte jen ubytování bez balíčku?
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
            Prohlédněte si dostupné pokoje a vyberte si standardní sazbu.
          </div>
        </div>
      </div>
      <a href="Pick-Room-Table-View.html" style={{
        appearance: "none", border: "1px solid var(--ink-1)", background: "white", color: "var(--ink-1)",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "11px 18px", borderRadius: 8, cursor: "pointer", textDecoration: "none",
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        Zobrazit pokoje
        <Icon name="chevron-right" size={14} strokeWidth={2.4} />
      </a>
    </div>
  );
}

function AppPkg() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_PKG);
  const [cat, setCat] = useStatePkg("all");
  const [selected, setSelected] = useStatePkg(null);

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <TopNavPkg />
      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Vybrat balíček</span>
          </div>
          <SearchBarPkg />
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px 80px" }}>
        {t.showHero && <HeroPkg />}
        <CategoryStrip active={cat} setActive={setCat} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {window.PACKAGES.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onSelect={(p) => setSelected(p)} />
          ))}
        </div>
        {t.showRoomsLink && <RoomsLink />}
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

      {selected && (
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
                {selected.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
                {selected.tagline}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
              padding: "10px 14px", borderRadius: 6, cursor: "pointer",
            }}>Změnit</button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Cena balíčku</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
                {fmtP(selected.fromPrice)} Kč
              </div>
            </div>
            <button style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              padding: "13px 24px", borderRadius: 6, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Pokračovat
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      <DetailDialogsHost />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
          <TweakToggle label="Marketing hero" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Link na pokoje (na konci)" value={t.showRoomsLink} onChange={v => setTweak("showRoomsLink", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppPkg />);
