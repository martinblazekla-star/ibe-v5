// Mobile Pick Room — list view optimized for narrow viewports
// 375px design width (iPhone), but works fluid

const { useState: useStateMR } = React;

function fmtMR(n) { return n.toLocaleString("cs-CZ"); }

function MobileNav() {
  return (
    <nav style={{
      height: 56, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <button aria-label="Menu" style={{
        appearance: "none", border: "none", background: "transparent", cursor: "pointer", padding: 6,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink-1)" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <a href="#" onClick={e => e.preventDefault()} style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "var(--brand)" }} />
        Balický
      </a>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--ink-1)",
          padding: "6px 10px", borderRadius: 6, cursor: "pointer",
        }}>🇨🇿 CZK</button>
        <button aria-label="Přihlásit" style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          padding: 8, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="users" size={15} color="var(--ink-1)" strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
}

function MobileSearchSummary({ onEdit }) {
  return (
    <button onClick={onEdit} style={{
      width: "100%", appearance: "none", textAlign: "left", cursor: "pointer",
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      boxShadow: "0 2px 10px rgba(16,24,40,.06)",
      padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 10, background: "color-mix(in oklch, var(--brand) 8%, white)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flexShrink: 0,
      }}>
        <Icon name="search" size={18} strokeWidth={2.2} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.25 }}>
          Pá 15. – Ne 17. května
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
          2 noci · 2 dospělí · 1 pokoj
        </div>
      </div>
      <Icon name="chevron-down" size={16} color="var(--ink-3)" strokeWidth={2} />
    </button>
  );
}

function MobileTrustStrip() {
  return (
    <div style={{
      display: "flex", overflowX: "auto", gap: 8, paddingBottom: 4, marginInline: -16, paddingInline: 16,
    }}>
      {[
        { label: "Garance −8 % vs OTA", primary: true },
        { label: "Bez poplatků" },
        { label: "Storno zdarma" },
        { label: "Body do Clubu" },
      ].map((c, i) => (
        <span key={i} style={{
          flexShrink: 0,
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 10px", borderRadius: 999,
          background: c.primary ? "var(--accent)" : "white",
          color: c.primary ? "white" : "var(--ink-1)",
          border: c.primary ? "none" : "1px solid var(--border)",
          fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}>
          <Icon name="check" size={11} color={c.primary ? "white" : "var(--accent)"} strokeWidth={2.6} />
          {c.label}
        </span>
      ))}
    </div>
  );
}

function MobileRoomCard({ room, onSelect }) {
  const cheapest = room.rates.length ? Math.min(...room.rates.map(r => r.price)) : null;
  const original = room.rates.find(r => r.originalPrice)?.originalPrice;
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
    }}>
      <div style={{
        position: "relative", aspectRatio: "16 / 10",
        background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`,
        filter: room.soldOut ? "grayscale(1) brightness(.85)" : "none",
      }}>
        {room.soldOut && <div style={{ position: "absolute", inset: 0, background: "rgba(15,18,22,0.55)" }} />}
        <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {room.tags.slice(0, 1).map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--ink-1)",
              background: "rgba(255,255,255,0.94)", padding: "4px 7px", borderRadius: 4,
            }}>{t}</span>
          ))}
        </div>
        {room.remaining && room.remaining <= 2 && !room.soldOut && (
          <span style={{
            position: "absolute", right: 10, top: 10,
            display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px",
            background: "rgba(166,21,29,0.95)", borderRadius: 6,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10.5, color: "white",
          }}>
            <Icon name="flame" size={10} strokeWidth={2.4} />
            Poslední {room.remaining}
          </span>
        )}
        <span style={{
          position: "absolute", right: 10, bottom: 10,
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 600,
          color: "white", background: "rgba(15,18,22,0.6)",
          padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={11} strokeWidth={1.8} /> 4
        </span>
        {room.soldOut && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "white",
              background: "rgba(15,18,22,0.85)", padding: "6px 12px", borderRadius: 6, letterSpacing: "0.04em",
            }}>Vyprodáno</span>
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", lineHeight: 1.25 }}>
          {room.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 6, color: "var(--ink-2)", fontSize: 12.5 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="person" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.capacity}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="size" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.size} m²
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="bed" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.beds.split(" ")[0]}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.4 }}>
          {room.amenities.slice(0, 3).join(" · ")}{room.amenities.length > 3 && " …"}
        </div>
      </div>

      {!room.soldOut && (
        <div style={{
          padding: "12px 16px", borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--brand) 2%, white)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }}>
          <div>
            {original && (
              <div style={{ fontSize: 11, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                {fmtMR(original)} Kč
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}>od</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
                {fmtMR(cheapest)}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-1)" }}>Kč</span>
            </div>
            <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>za 2 noci · {room.rates.length} sazby</div>
          </div>
          <button onClick={() => onSelect(room)} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "11px 18px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            Vybrat
            <Icon name="chevron-right" size={13} strokeWidth={2.4} />
          </button>
        </div>
      )}
      {room.soldOut && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)" }}>
          <button style={{
            width: "100%", appearance: "none", border: "1px solid var(--ink-1)", background: "white", color: "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "10px 14px", borderRadius: 8, cursor: "pointer",
          }}>Náhradní termín</button>
        </div>
      )}
    </article>
  );
}

function MobileRateSheet({ room, onClose, onSelect }) {
  if (!room) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: "16px 16px 0 0", width: "100%", maxHeight: "88vh",
        display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp .2s ease-out",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ padding: "8px 16px 0", display: "flex", justifyContent: "center" }}>
          <span style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2 }} />
        </div>
        <header style={{
          padding: "12px 18px 14px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Vyberte sazbu
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)", marginTop: 2, letterSpacing: "-0.005em" }}>
              {room.name}
            </div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={16} strokeWidth={2.2} /></button>
        </header>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", background: "var(--neutral-50)", display: "flex", flexDirection: "column", gap: 10 }}>
          {room.rates.map(rate => (
            <div key={rate.id} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 10,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)" }}>{rate.name}</span>
                {rate.badge && (
                  <span style={{
                    display: "inline-flex", padding: "2px 7px",
                    background: "var(--accent-tint)", color: "var(--accent-dark)",
                    fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, borderRadius: 4,
                  }}>{rate.badge}</span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
                  borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent-dark)", fontSize: 11.5, fontWeight: 600,
                }}>
                  <Icon name="check" size={10} strokeWidth={2.4} /> {rate.meal.replace(" v ceně", "")}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
                  borderRadius: 999, background: rate.cancellable ? "var(--accent-tint)" : "var(--neutral-100)",
                  color: rate.cancellable ? "var(--accent-dark)" : "var(--ink-3)", fontSize: 11.5, fontWeight: 600,
                }}>
                  <Icon name={rate.cancellable ? "check" : "x"} size={10} strokeWidth={2.4} />
                  {rate.cancellable ? "Storno zdarma" : "Nevratná"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 10 }}>
                <div>
                  {rate.originalPrice && (
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                      {fmtMR(rate.originalPrice)} Kč
                    </div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", lineHeight: 1.05 }}>
                    {fmtMR(rate.price)} Kč
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>za 2 noci</div>
                </div>
                <button onClick={() => onSelect(rate)} style={{
                  appearance: "none", border: "none", cursor: "pointer",
                  background: "var(--brand)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                  padding: "10px 18px", borderRadius: 8, letterSpacing: "0.02em",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  Rezervovat
                  <Icon name="chevron-right" size={13} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav({ onSearch }) {
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
      background: "white", borderTop: "1px solid var(--border)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
    }}>
      {[
        { icon: "search", label: "Hledat", active: true, onClick: onSearch },
        { icon: "calendar", label: "Balíčky" },
        { icon: "voucher", label: "Voucher" },
        { icon: "users", label: "Účet" },
      ].map((it, i) => (
        <button key={i} onClick={it.onClick} style={{
          appearance: "none", border: "none", background: "transparent", cursor: "pointer",
          padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: it.active ? "var(--brand)" : "var(--ink-3)",
        }}>
          <Icon name={it.icon} size={20} strokeWidth={it.active ? 2.2 : 1.8} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function AppMobile() {
  const [sheetRoom, setSheetRoom] = useStateMR(null);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
      paddingBottom: 70,
    }}>
      <MobileNav />
      <div style={{ padding: "12px 16px" }}>
        <MobileSearchSummary onEdit={() => {}} />
      </div>
      <div style={{ padding: "0 16px 6px" }}>
        <MobileTrustStrip />
      </div>

      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        padding: "10px 16px 8px",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
            5 dostupných pokojů
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>2 noci · 2 dospělí</div>
        </div>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--ink-1)",
          padding: "6px 10px", borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Seřadit
          <Icon name="chevron-down" size={12} strokeWidth={2} />
        </button>
      </div>

      <main style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {(window.ROOMS || []).map(r => (
          <MobileRoomCard key={r.id} room={r} onSelect={setSheetRoom} />
        ))}
      </main>

      <MobileBottomNav onSearch={() => {}} />

      <MobileRateSheet
        room={sheetRoom}
        onClose={() => setSheetRoom(null)}
        onSelect={() => { window.location.href = "Checkout.html"; }}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppMobile />);
