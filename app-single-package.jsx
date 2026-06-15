// Pick Package — SINGLE PACKAGE view (within booking engine)
// Maximum conversion focus on ONE package. IBE chrome + dedicated single-package layout.

const { useState: useStateSP } = React;

const TWEAK_DEFAULTS_SP = /*EDITMODE-BEGIN*/{
  "stickyHeader": true,
  "soldOut": false
}/*EDITMODE-END*/;

function fmtSP(n) { return n.toLocaleString("cs-CZ"); }

function PkgHeroSplit({ pkg }) {
  return (
    <section style={{
      display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 0,
      background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
      boxShadow: "0 2px 10px rgba(16,24,40,.04)",
    }}>
      <div style={{
        position: "relative",
        background: `url(${pkg.image}) center / cover no-repeat var(--neutral-100)`, minHeight: 460,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,18,22,0.15) 0%, rgba(15,18,22,0.55) 100%)",
        }} />
        <div style={{ position: "absolute", left: 22, top: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pkg.badge && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "white",
              background: "var(--brand)", padding: "5px 11px", borderRadius: 4,
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              <Icon name="flame" size={11} strokeWidth={2.4} />
              {pkg.badge}
            </span>
          )}
          {pkg.savings > 0 && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
              textTransform: "uppercase", color: "var(--accent-dark)",
              background: "white", padding: "5px 11px", borderRadius: 4,
            }}>Ušetříte {Math.round((pkg.savings / pkg.originalPrice) * 100)} %</span>
          )}
        </div>
        <div style={{ position: "absolute", left: 22, bottom: 22, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pkg.tags.map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 600, color: "white",
              background: "rgba(15,18,22,0.45)", backdropFilter: "blur(6px)",
              padding: "4px 9px", borderRadius: 4,
            }}>{t}</span>
          ))}
        </div>
        <button style={{
          position: "absolute", right: 22, bottom: 22, appearance: "none", cursor: "pointer",
          background: "rgba(255,255,255,0.92)", border: "none",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5, color: "var(--ink-1)",
          padding: "7px 12px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="image" size={13} strokeWidth={1.8} />
          Galerie (12)
        </button>
      </div>
      <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--brand)", marginBottom: 12,
        }}>Pobytový balíček · {pkg.nights} noci</div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.015em", lineHeight: 1.15,
        }}>{pkg.name}</h1>
        <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, margin: "12px 0 18px" }}>
          {pkg.tagline}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 14, color: "var(--ink-3)", textDecoration: "line-through" }}>
            {fmtSP(pkg.originalPrice)} Kč
          </span>
          <span style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, color: "var(--accent-dark)",
            background: "var(--accent-tint)", padding: "3px 8px", borderRadius: 4, letterSpacing: "0.02em",
          }}>−{fmtSP(pkg.savings)} Kč</span>
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--ink-1)",
          letterSpacing: "-0.018em", lineHeight: 1.05,
        }}>{fmtSP(pkg.fromPrice)} <span style={{ fontSize: 18 }}>Kč</span></div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4 }}>za {pkg.nights} noci · 2 osoby</div>
      </div>
    </section>
  );
}

function PkgInclusions({ pkg }) {
  const icons = ["bed", "leaf", "voucher", "sparkle", "calendar", "check"];
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 6px", letterSpacing: "-0.01em",
      }}>V balíčku zahrnuto</h2>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 16 }}>
        Vše uvedeno níže získáte v ceně balíčku. Můžete ještě dokoupit doplňky.
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
      }}>
        {pkg.inclusions.map((inc, i) => (
          <div key={i} style={{
            background: "white", border: "1px solid var(--border)", borderRadius: 10,
            padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--accent-tint)", color: "var(--accent-dark)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name={icons[i % icons.length]} size={16} strokeWidth={1.8} />
            </span>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)", lineHeight: 1.4 }}>{inc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PkgRoomMatrix({ pkg, onPickCombo }) {
  const rooms = (window.ROOMS || []).filter(r => !r.soldOut).slice(0, 3);
  const variants = [
    { id: "breakfast", label: "Snídaně", priceDelta: 0 },
    { id: "halfboard", label: "Polopenze", priceDelta: 1800 },
    { id: "fullboard", label: "Plná penze", priceDelta: 3400 },
  ];
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 6px", letterSpacing: "-0.01em",
      }}>Vyberte pokoj a variantu stravy</h2>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 18 }}>
        Cena se přizpůsobí podle vybraného pokoje a stravy. Termín potvrdíte v dalším kroku.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {rooms.map((r, idx) => {
          const baseRoom = r.rates[0]?.price || 0;
          const adjusted = baseRoom + (pkg.fromPrice - 4900); // mock adjustment
          return (
            <div key={r.id} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
            }}>
              <div style={{
                display: "grid", gridTemplateColumns: "160px minmax(0, 1fr) auto", gap: 0,
                borderBottom: "1px solid var(--border-soft)",
              }}>
                <div style={{ background: `url(${r.image}) center / cover no-repeat var(--neutral-100)`, minHeight: 130 }} />
                <div style={{ padding: "14px 18px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 6, color: "var(--ink-3)", fontSize: 13 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="person" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {r.capacity}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="size" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {r.size} m²</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="bed" size={13} color="var(--ink-3)" strokeWidth={1.8} /> {r.beds}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>
                    {r.amenities.slice(0, 4).join(" · ")}
                  </div>
                </div>
                <div style={{
                  padding: "14px 22px", background: "color-mix(in oklch, var(--brand) 2%, white)",
                  display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 2, minWidth: 150,
                }}>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>od</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
                    {fmtSP(adjusted)} Kč
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>za {pkg.nights} noci</div>
                </div>
              </div>
              {/* Variant row */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
              }}>
                {variants.map((v, vi) => {
                  const totalPrice = adjusted + v.priceDelta;
                  return (
                    <button key={v.id} onClick={() => onPickCombo({ room: r, variant: v, total: totalPrice })} style={{
                      appearance: "none", cursor: "pointer", textAlign: "left",
                      border: "none", borderRight: vi < variants.length - 1 ? "1px solid var(--border-soft)" : "none",
                      background: "white",
                      padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in oklch, var(--brand) 3%, white)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{v.label}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>
                          {v.priceDelta === 0 ? "v ceně" : `+ ${fmtSP(v.priceDelta)} Kč`}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", lineHeight: 1.05 }}>
                          {fmtSP(totalPrice)} Kč
                        </span>
                        <span style={{
                          width: 28, height: 28, borderRadius: 6, background: "var(--brand)", color: "white",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Icon name="chevron-right" size={14} strokeWidth={2.4} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PkgFAQ() {
  const items = [
    { q: "Lze balíček rezervovat na jiný termín?", a: "Ano, v dalším kroku si vyberete přesný termín z dostupných dní. Platí minimum 2–3 noci podle balíčku." },
    { q: "Mohu balíček darovat?", a: "Ano, zakoupíte jej jako dárkový voucher s platností 12 měsíců." },
    { q: "Co když se mi něco změní?", a: "Storno zdarma do 7 dní před příjezdem. Po této lhůtě 50 %, v den příjezdu plná částka." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 14px", letterSpacing: "-0.01em",
      }}>Časté dotazy</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it, i) => {
          const on = open === i;
          return (
            <div key={i} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
            }}>
              <button onClick={() => setOpen(on ? -1 : i)} style={{
                width: "100%", appearance: "none", border: "none", background: "transparent", cursor: "pointer",
                padding: "14px 18px", textAlign: "left",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)",
              }}>
                <span>{it.q}</span>
                <span style={{ display: "inline-block", transform: on ? "rotate(180deg)" : "rotate(0)", color: "var(--ink-3)" }}>
                  <Icon name="chevron-down" size={16} strokeWidth={2.2} />
                </span>
              </button>
              {on && (
                <div style={{ padding: "0 18px 16px", fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                  {it.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PkgStickySidebar({ pkg }) {
  return (
    <aside style={{ position: "sticky", top: 92, alignSelf: "flex-start" }}>
      <window.BookingWidget pkg={pkg} variant="inline" />
      <div style={{
        marginTop: 14, padding: "14px 16px",
        background: "color-mix(in oklch, var(--brand) 5%, white)",
        border: "1px solid color-mix(in oklch, var(--brand) 14%, white)", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icon name="sparkle" size={15} color="var(--brand)" strokeWidth={2.2} />
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.45 }}>
          <strong>Lze darovat</strong> jako voucher · platnost 12 měsíců.
        </div>
        <a href="Voucher-Sale.html" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}>Voucher →</a>
      </div>
    </aside>
  );
}

function AppSinglePackage() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_SP);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  const pkg = window.PACKAGES[0];

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <PickRoomNav active="balicky" />
      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <a href="Pick-Package.html" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Balíčky</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{pkg.name}</span>
          </div>
          <PickRoomSearchBar />
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px 80px" }}>
        <div style={{ marginBottom: 16 }}>
          <BestPriceGuarantee />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 32, alignItems: "start" }}>
          <div>
            <PkgHeroSplit pkg={pkg} />
            <section style={{ marginTop: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
                O balíčku
              </h2>
              <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
                {pkg.description} Připraveno pro 48 hodin, kdy se zastaví čas. Bez plánu, bez kalendáře, jen vy dva.
              </p>
            </section>
            <PkgInclusions pkg={pkg} />
            {t.soldOut ? (
              <window.UnavailableBlock
                subjectLabel="Pobytový balíček"
                subjectName={pkg.name}
                suggestionPackages={(window.PACKAGES || []).filter(p => p.id !== pkg.id).slice(0, 3)}
                altDates={[
                  { label: "Příští víkend", range: "Pá 22. – Ne 24. 5.", price: pkg.fromPrice, savings: null },
                  { label: "Konec května", range: "Pá 29. – Ne 31. 5.", price: pkg.fromPrice + 800, savings: null },
                  { label: "Začátek června", range: "Pá 5. – Ne 7. 6.", price: pkg.fromPrice, savings: null },
                  { label: "Půlčerven", range: "Pá 12. – Po 15. 6.", price: pkg.fromPrice + 1600, savings: 10 },
                ]}
              />
            ) : (
              <PkgRoomMatrix pkg={pkg} onPickCombo={() => { window.location.href = "Checkout.html"; }} />
            )}
            <PkgFAQ />
          </div>
          <PkgStickySidebar pkg={pkg} />
        </div>
        <PickRoomFooter />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
        </TweakSection>
        <TweakSection label="Stav">
          <TweakToggle label="Balíček vyprodaný" value={t.soldOut} onChange={v => setTweak("soldOut", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppSinglePackage />);
