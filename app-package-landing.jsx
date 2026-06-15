// Single package landing page — editorial / story-driven

function fmtLP(n) { return n.toLocaleString("cs-CZ"); }

function PackageHero({ pkg }) {
  return (
    <section style={{
      position: "relative", height: 720, overflow: "hidden",
      background: `url(${pkg.image}) center / cover no-repeat var(--neutral-100)`,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(15,18,22,0.2) 0%, rgba(15,18,22,0.75) 100%)",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 40px 72px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, alignItems: "end" }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
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
              <span style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "white",
                background: "rgba(255,255,255,0.15)", padding: "5px 11px", borderRadius: 4,
                backdropFilter: "blur(8px)",
              }}>Pobytový balíček · {pkg.nights} noci</span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 60, color: "white",
              margin: 0, letterSpacing: "-0.02em", lineHeight: 1.05, textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>{pkg.name}</h1>
            <p style={{
              fontSize: 18, color: "rgba(255,255,255,0.92)", lineHeight: 1.5, marginTop: 20, marginBottom: 0,
              maxWidth: 620,
            }}>{pkg.tagline}</p>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.96)", borderRadius: 16, padding: "26px 28px",
            boxShadow: "0 20px 60px rgba(15,18,22,.25)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                Balíček od
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 14, color: "var(--ink-3)", textDecoration: "line-through" }}>
                  {fmtLP(pkg.originalPrice)} Kč
                </span>
                <span style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, color: "var(--accent-dark)",
                  background: "var(--accent-tint)", padding: "2px 7px", borderRadius: 4,
                }}>−{fmtLP(pkg.savings)} Kč</span>
              </div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
                letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 4,
              }}>{fmtLP(pkg.fromPrice)} <span style={{ fontSize: 17 }}>Kč</span></div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>za {pkg.nights} noci · 2 osoby</div>
            </div>
            <a href="Pick-Package.html" style={{
              appearance: "none", border: "none", cursor: "pointer", background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
              padding: "14px 18px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
              textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              Vybrat termín a rezervovat
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </a>
            <div style={{
              display: "flex", flexDirection: "column", gap: 5, paddingTop: 4,
            }}>
              {[
                "Garance nejnižší ceny",
                "Storno zdarma do 7 dní",
                `Ušetříte ${fmtLP(pkg.savings)} Kč vs samostatně`,
              ].map((t, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-2)" }}>
                  <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection({ pkg }) {
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
        }}>Pro koho je tento pobyt</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 42, color: "var(--ink-1)",
          margin: "0 0 24px", letterSpacing: "-0.018em", lineHeight: 1.15,
        }}>
          Pro páry, které si chtějí{" "}
          <span style={{ color: "var(--brand)" }}>opravdu dopřát</span>.
        </h2>
        <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.65, margin: 0, maxWidth: 780, marginInline: "auto" }}>
          {pkg.description} Připraven pro 48 hodin, kdy se zastaví čas. Bez plánu, bez kalendáře, jen vy dva.
        </p>
      </div>
    </section>
  );
}

function InclusionsSection({ pkg }) {
  // Match each inclusion with an icon
  const icons = ["bed", "leaf", "voucher", "sparkle", "calendar", "check"];
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
          }}>V balíčku zahrnuto</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.015em",
          }}>Vše, co k dokonalému víkendu patří.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {pkg.inclusions.map((inc, i) => (
            <article key={i} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 14,
              padding: "24px 26px",
            }}>
              <span style={{
                width: 42, height: 42, borderRadius: 10,
                background: "var(--accent-tint)", color: "var(--accent-dark)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <Icon name={icons[i % icons.length]} size={20} strokeWidth={1.8} />
              </span>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
                lineHeight: 1.35, letterSpacing: "-0.005em",
              }}>{inc}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramSection({ pkg }) {
  const days = [
    {
      title: "Den 1 · Pátek",
      time: "od 15:00",
      items: [
        "Příjezd, welcome drink u recepce",
        "Check-in do designového pokoje",
        "Lahev sektu Bohemia a růže na pokoji",
        "Bohatá švédská snídaně 6:30 — 10:30",
      ],
    },
    {
      title: "Den 2 · Sobota",
      time: "celý den",
      items: [
        "Snídaně v hotelové restauraci",
        "60 min wellness pro 2 — sauna + vířivka",
        "Volný program v centru Prahy",
        "Večeře při svíčkách v naší restauraci",
      ],
    },
    {
      title: "Den 3 · Neděle",
      time: "do 14:00",
      items: [
        "Pozdní snídaně až do 11:00",
        "Pozdní check-out do 14:00",
        "Vzpomínka, na kterou se vrací",
      ],
    },
  ];
  return (
    <section style={{ padding: "100px 40px 0", background: "var(--neutral-50)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
          }}>Jak to bude probíhat</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.015em",
          }}>Den po dni — vše promyšlené pro vás.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {days.map((d, i) => (
            <article key={i} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 14,
              padding: "26px 28px",
            }}>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--brand)", marginBottom: 6,
              }}>{d.time}</div>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
                margin: "0 0 16px", letterSpacing: "-0.01em",
              }}>{d.title}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {d.items.map((it, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ pkg }) {
  const imgs = ["assets/room-1.png", "assets/room-2.png", "assets/room-3.png", pkg.image];
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, height: 320 }}>
          {imgs.map((img, i) => (
            <div key={i} style={{
              background: `url(${img}) center / cover no-repeat var(--neutral-100)`,
              borderRadius: 12, gridRow: i === 0 ? "span 2" : "span 1",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const items = [
    { q: "Jaké pokoje jsou v balíčku zahrnuty?", a: "Vyberete si při rezervaci ze tří kategorií — Deluxe, Executive nebo Junior Suite. Cena se přizpůsobí podle vybraného pokoje." },
    { q: "Mohu balíček darovat?", a: "Ano, zakoupíte jej jako dárkový voucher. Voucher pošleme PDF do hodiny nebo poštou v dárkové obálce do 3 dní." },
    { q: "Jaké jsou storno podmínky?", a: "Pobytové balíčky lze stornovat zdarma do 7 dní před příjezdem. Po této lhůtě 50 %, v den příjezdu plná částka." },
    { q: "Lze přidat další služby?", a: "Samozřejmě. V dalším kroku rezervace si můžete dokoupit transfer z letiště, parking, časný check-in nebo další wellness procedury." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
          }}>Časté dotazy</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.015em",
          }}>Vše, co potřebujete vědět.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => {
            const on = open === i;
            return (
              <div key={i} style={{
                background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
              }}>
                <button onClick={() => setOpen(on ? -1 : i)} style={{
                  width: "100%", appearance: "none", border: "none", background: "transparent", cursor: "pointer",
                  padding: "16px 20px", textAlign: "left",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink-1)",
                }}>
                  <span>{it.q}</span>
                  <span style={{ display: "inline-block", transform: on ? "rotate(180deg)" : "rotate(0)", transition: "transform 160ms ease", color: "var(--ink-3)" }}>
                    <Icon name="chevron-down" size={18} strokeWidth={2.2} />
                  </span>
                </button>
                {on && (
                  <div style={{ padding: "0 20px 18px", fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RelatedPackages({ excludeId }) {
  const others = (window.PACKAGES || []).filter(p => p.id !== excludeId).slice(0, 3);
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
        }}>Mohlo by Vás zaujmout</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--ink-1)",
          margin: "0 0 28px", letterSpacing: "-0.015em",
        }}>Další pobytové balíčky</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {others.map(p => (
            <a key={p.id} href="#" onClick={e => e.preventDefault()} style={{
              display: "block", textDecoration: "none", background: "white",
              border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
            }}>
              <div style={{ aspectRatio: "16 / 10", background: `url(${p.image}) center / cover no-repeat var(--neutral-100)` }} />
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)", lineHeight: 1.3, letterSpacing: "-0.005em" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>{p.tagline}</div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>od · {p.nights} noci</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)" }}>
                    {fmtLP(p.fromPrice)} Kč
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppPackageLanding() {
  const pkg = window.PACKAGES[0]; // Romantický víkend
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "white", fontFamily: "var(--font-ui)", color: "var(--ink-1)",
    }}>
      <MarketingNav active="packages" />

      <div style={{ background: "var(--surface)", padding: "10px 40px", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
          <Icon name="chevron-right" size={12} strokeWidth={2} />
          <a href="Pick-Package.html" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Balíčky</a>
          <Icon name="chevron-right" size={12} strokeWidth={2} />
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{pkg.name}</span>
        </div>
      </div>

      <PackageHero pkg={pkg} />
      <StorySection pkg={pkg} />
      <InclusionsSection pkg={pkg} />
      <GallerySection pkg={pkg} />
      <ProgramSection pkg={pkg} />

      {/* Trust strip */}
      <section style={{ padding: "100px 40px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <BestPriceGuarantee />
        </div>
      </section>

      <FAQSection />
      <RelatedPackages excludeId={pkg.id} />

      {/* Final CTA */}
      <section style={{ padding: "100px 40px 0" }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto", borderRadius: 18, overflow: "hidden", position: "relative",
          minHeight: 360,
          background: `linear-gradient(135deg, rgba(85,1,115,0.85), rgba(63,1,86,0.85)), url(${pkg.image}) center / cover no-repeat`,
          color: "white",
          padding: "60px 64px",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 18,
        }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", opacity: 0.85,
          }}>Jste připraveni?</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 44, margin: 0,
            letterSpacing: "-0.018em", lineHeight: 1.1, maxWidth: 700,
          }}>
            Tenhle víkend si rozhodně zasloužíte.
          </h2>
          <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.5, margin: 0, maxWidth: 580 }}>
            Vyberte si termín, který se Vám hodí, a my se postaráme o vše ostatní. Garantujeme nejnižší cenu — přímo u nás.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <a href="Pick-Package.html" style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "white", color: "var(--brand)",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
              padding: "16px 28px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Rezervovat balíček
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </a>
            <a href="Voucher-Sale.html" style={{
              appearance: "none", border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer",
              background: "transparent", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
              padding: "14px 22px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
            }}>Darovat jako voucher</a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppPackageLanding />);
