// Unavailable state component — for Pick Room Single and Pick Package Single
// Shows: empty status + alternative dates + alternative rooms (or packages)

function UnavailableBlock({ subjectLabel, subjectName, suggestionRooms = [], suggestionPackages = [], altDates = [] }) {
  return (
    <section style={{ marginTop: 12 }}>
      {/* Headline status */}
      <div style={{
        background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          padding: "26px 28px",
          background: "linear-gradient(135deg, #FFF1F1 0%, #FFE5E5 100%)",
          borderBottom: "1px solid #F5C6C6",
          display: "flex", alignItems: "center", gap: 18,
        }}>
          <span style={{
            width: 56, height: 56, borderRadius: 14, background: "white",
            border: "1px solid #F5C6C6",
            display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#A6151D", flexShrink: 0,
          }}>
            <Icon name="x" size={28} strokeWidth={2.4} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#A6151D",
            }}>{subjectLabel}</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
              margin: "4px 0 0", letterSpacing: "-0.01em", lineHeight: 1.25,
            }}>
              {subjectName} ve Vašem termínu nedostupný
            </h2>
            <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
              Pá 15. — Ne 17. května 2026 je obsazené. Nabízíme však <strong>{altDates.length > 0 ? "náhradní termíny" : "alternativy"}</strong> nebo podobné dostupné možnosti.
            </div>
          </div>
        </div>

        {/* Alternative dates */}
        {altDates.length > 0 && (
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Icon name="calendar" size={13} color="var(--ink-3)" strokeWidth={1.8} />
              Volné termíny pro stejný typ
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {altDates.map((d, i) => (
                <button key={i} style={{
                  appearance: "none", cursor: "pointer",
                  border: "1.5px solid var(--border)", background: "white",
                  fontFamily: "var(--font-ui)", textAlign: "left",
                  padding: "12px 14px", borderRadius: 10,
                  display: "flex", flexDirection: "column", gap: 4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "color-mix(in oklch, var(--brand) 3%, white)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {d.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
                    {d.range}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>od</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
                      {d.price.toLocaleString("cs-CZ")} Kč
                    </span>
                    {d.savings && (
                      <span style={{
                        fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, color: "var(--accent-dark)",
                        background: "var(--accent-tint)", padding: "1px 5px", borderRadius: 3, marginLeft: "auto",
                      }}>−{d.savings} %</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <a href="#" onClick={e => e.preventDefault()} style={{
              display: "inline-flex", alignItems: "center", gap: 4, marginTop: 14,
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
              color: "var(--brand)", textDecoration: "none",
            }}>
              Otevřít kalendář dostupnosti
              <Icon name="chevron-right" size={13} strokeWidth={2.4} />
            </a>
          </div>
        )}

        {/* Alternative rooms / packages */}
        {(suggestionRooms.length > 0 || suggestionPackages.length > 0) && (
          <div style={{ padding: "20px 24px" }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
              {suggestionPackages.length > 0
                ? "Dostupné balíčky ve Vašem termínu"
                : "Volné pokoje ve Vašem termínu"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {suggestionRooms.map(r => {
                const cheapest = r.rates.length ? Math.min(...r.rates.map(rr => rr.price)) : null;
                return (
                  <a key={r.id} href="Pick-Room-Grid-View.html" style={{
                    display: "block", textDecoration: "none",
                    background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
                  }}>
                    <div style={{
                      aspectRatio: "16 / 10", background: `url(${r.image}) center / cover no-repeat var(--neutral-100)`,
                    }} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.3 }}>
                        {r.name}
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 4, color: "var(--ink-3)", fontSize: 12 }}>
                        <span>{r.capacity}</span>
                        <span>{r.size} m²</span>
                        <span>{r.beds}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <div>
                          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>od · 2 noci</span>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", lineHeight: 1 }}>
                            {cheapest?.toLocaleString("cs-CZ")} Kč
                          </div>
                        </div>
                        <span style={{
                          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, color: "var(--brand)",
                          display: "inline-flex", alignItems: "center", gap: 4,
                        }}>
                          Zobrazit
                          <Icon name="chevron-right" size={13} strokeWidth={2.4} />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
              {suggestionPackages.map(p => (
                <a key={p.id} href="Pick-Package.html" style={{
                  display: "block", textDecoration: "none",
                  background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
                }}>
                  <div style={{
                    aspectRatio: "16 / 10", background: `url(${p.image}) center / cover no-repeat var(--neutral-100)`,
                    position: "relative",
                  }}>
                    {p.badge && (
                      <span style={{
                        position: "absolute", left: 10, top: 10,
                        fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                        textTransform: "uppercase", color: "white",
                        background: "var(--brand)", padding: "3px 7px", borderRadius: 4,
                      }}>{p.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{p.tagline}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <div>
                        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>od · {p.nights} noci</span>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", lineHeight: 1 }}>
                          {p.fromPrice.toLocaleString("cs-CZ")} Kč
                        </div>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, color: "var(--brand)",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        Zobrazit
                        <Icon name="chevron-right" size={13} strokeWidth={2.4} />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Waitlist CTA */}
        <div style={{
          padding: "16px 24px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)",
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}>
          <Icon name="info" size={18} color="var(--brand)" strokeWidth={2} />
          <div style={{ flex: 1, fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.45 }}>
            <strong>Chcete být informováni o uvolnění?</strong>{" "}
            <span style={{ color: "var(--ink-3)" }}>Nastavíme hlídání a dáme Vám vědět e-mailem do hodiny.</span>
          </div>
          <button style={{
            appearance: "none", cursor: "pointer", border: "1.5px solid var(--brand)", background: "white",
            color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "8px 14px", borderRadius: 6,
          }}>Hlídat dostupnost</button>
        </div>
      </div>
    </section>
  );
}

window.UnavailableBlock = UnavailableBlock;
