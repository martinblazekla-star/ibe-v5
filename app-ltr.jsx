// Long-term rental Pick view (list)
const { useState: useStateLT } = React;

const TWEAK_DEFAULTS_LT = /*EDITMODE-BEGIN*/{
  "stickyHeader": true,
  "showStudentBadge": true
}/*EDITMODE-END*/;

function fmtLT(n) { return n.toLocaleString("cs-CZ"); }

function LTRSearchBar({ termLabel, onOpenDates }) {
  return (
    <div style={{
      background: "white", borderRadius: 10, border: "1px solid var(--border)",
      boxShadow: "0 2px 10px rgba(16,24,40,.05)",
      display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", alignItems: "stretch", overflow: "hidden",
    }}>
      <button onClick={onOpenDates} style={ltrField}>
        <Icon name="calendar" size={18} color="var(--brand)" strokeWidth={1.8} />
        <div style={{ minWidth: 0 }}>
          <div style={ltrFieldLabel}>Termín nastěhování</div>
          <div style={ltrFieldValue}>{termLabel}</div>
        </div>
      </button>
      <button style={ltrField}>
        <Icon name="users" size={18} color="var(--brand)" strokeWidth={1.8} />
        <div style={{ minWidth: 0 }}>
          <div style={ltrFieldLabel}>Počet osob</div>
          <div style={ltrFieldValue}>1 osoba</div>
        </div>
      </button>
      <button style={ltrField}>
        <Icon name="voucher" size={18} color="var(--brand)" strokeWidth={1.8} />
        <div style={{ minWidth: 0 }}>
          <div style={ltrFieldLabel}>Účel / status</div>
          <div style={ltrFieldValue}>Student · ISIC</div>
        </div>
      </button>
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "0 24px", letterSpacing: "0.02em",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon name="search" size={16} strokeWidth={2.4} />
        Hledat
      </button>
    </div>
  );
}

const ltrField = {
  appearance: "none", textAlign: "left", background: "white", border: "none", cursor: "pointer",
  padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
  borderRight: "1px solid var(--border)",
};
const ltrFieldLabel = {
  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--ink-3)",
};
const ltrFieldValue = {
  fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--ink-1)",
  lineHeight: 1.25, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
};

function LTRTrustStrip() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
      background: "white", border: "1px solid var(--border)", borderRadius: 8, flexWrap: "wrap",
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 8px", borderRadius: 4, background: "var(--brand)",
        color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        <Icon name="check" size={11} strokeWidth={2.6} />
        Přímo s majitelem
      </span>
      <span style={ltrTrust}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Bez agentury · 0 % provize</span>
      <span style={ltrTrust}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Smlouva v ČJ i EN</span>
      <span style={ltrTrust}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Kauce vratná po skončení</span>
      <span style={ltrTrust}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Výpověď 1 měsíční nájem</span>
    </div>
  );
}
const ltrTrust = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-1)", fontWeight: 500 };

function LTRRoomCard({ room, onSelectRate }) {
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "220px minmax(0, 1fr) 280px", alignItems: "stretch",
      }}>
        {/* Image */}
        <div style={{ position: "relative", background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`, minHeight: 230 }}>
          <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {room.tags.slice(0, 2).map(t => (
              <span key={t} style={{
                fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em",
                textTransform: "uppercase", color: "var(--ink-1)",
                background: "rgba(255,255,255,0.94)", padding: "4px 7px", borderRadius: 4,
              }}>{t}</span>
            ))}
          </div>
          <div style={{
            position: "absolute", right: 10, bottom: 10,
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 600,
            color: "white", background: "rgba(15,18,22,0.6)",
            padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="image" size={11} strokeWidth={1.8} />
            <span>8</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)",
              margin: 0, lineHeight: 1.2, letterSpacing: "-0.005em",
            }}>{room.name}</h3>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)" }}>č. {room.number} · {room.floor}. patro</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", color: "var(--ink-2)", fontSize: 13.5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="person" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.capacity} {room.capacity === "1" ? "osoba" : "osob"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="size" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.size} m²
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="bed" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.beds}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="view" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.view}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", color: "var(--ink-3)", fontSize: 12.5 }}>
            {room.amenities.slice(0, 5).map(a => (
              <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <Icon name="check" size={11} color="var(--accent)" strokeWidth={2.4} /> {a}
              </span>
            ))}
            {room.amenities.length > 5 && (
              <span style={{ color: "var(--brand)", fontWeight: 700 }}>+ {room.amenities.length - 5} dalších</span>
            )}
          </div>

          {/* Status row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
              background: "var(--accent-tint)", color: "var(--accent-dark)",
              fontSize: 11.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
            }}>
              <Icon name="calendar" size={11} strokeWidth={2.2} />
              Volné od {room.availableFrom}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
              background: "var(--neutral-100)", color: "var(--ink-2)",
              fontSize: 11.5, fontWeight: 600, borderRadius: 4,
            }}>
              {room.minMonths}–{room.maxMonths} měsíců
            </span>
            {room.student && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
                background: "color-mix(in oklch, var(--brand) 8%, white)", color: "var(--brand)",
                fontSize: 11.5, fontWeight: 700, borderRadius: 4,
              }}>ISIC sleva</span>
            )}
            {room.petFriendly && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
                background: "var(--neutral-100)", color: "var(--ink-2)",
                fontSize: 11.5, fontWeight: 600, borderRadius: 4,
              }}>🐾 Pet friendly</span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{
          padding: "18px 22px", background: "color-mix(in oklch, var(--brand) 2%, white)",
          borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Od · měsíční nájem
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--ink-1)",
              lineHeight: 1.05, marginTop: 4, letterSpacing: "-0.01em",
            }}>
              {fmtLT(room.monthlyFrom)} <span style={{ fontSize: 14, fontWeight: 600 }}>Kč/měs.</span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>
              + kauce {fmtLT(room.deposit)} Kč (vratná)
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
              + poplatek {fmtLT(room.bookingFee)} Kč
            </div>
          </div>
          <button onClick={() => onSelectRate(room, room.rates[room.rates.length - 1])} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "12px 16px", borderRadius: 6, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            Vybrat termín
            <Icon name="chevron-right" size={14} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}

function AppLTR() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_LT);
  const [picker, setPicker] = useStateLT(null); // { room, rate, mode }
  const [searchTerm, setSearchTerm] = useStateLT(null); // { moveInMonth, moveOutMonth, moveInDay, moveOutDay, length }
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  const monthsNames = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
  const termLabel = searchTerm
    ? `${searchTerm.moveInDay}. ${monthsNames[searchTerm.moveInMonth.getMonth()]} ${searchTerm.moveInMonth.getFullYear()} · ${searchTerm.length} ${searchTerm.length === 1 ? "měsíc" : searchTerm.length < 5 ? "měsíce" : "měsíců"}`
    : "1. září 2026 · 9 měsíců";

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <PickRoomNav active="ubytovani" />
      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Dlouhodobé bydlení</span>
          </div>
          <LTRSearchBar termLabel={termLabel} onOpenDates={() => setPicker({ room: window.LTR_ROOMS[0], mode: "dates-only" })} />
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px 80px" }}>
        <div style={{ marginBottom: 12 }}>
          <LTRTrustStrip />
        </div>

        {/* Title */}
        <div style={{ marginTop: 18, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.01em",
          }}>Dlouhodobé bydlení · 4 dostupné pokoje</h1>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            Nájem 3–24 měsíců · ceny jsou <strong>za jeden měsíc</strong>. Kauce vratná po skončení nájmu.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {window.LTR_ROOMS.map(r => (
            <LTRRoomCard key={r.id} room={r} onSelectRate={(room, rate) => setPicker({ room, rate })} />
          ))}
        </div>

        <PickRoomFooter />
      </main>

      <window.MonthlyDatePickerDialog
        open={!!picker}
        room={picker?.room}
        rate={picker?.rate}
        mode={picker?.mode}
        onClose={() => setPicker(null)}
        onConfirm={(result) => {
          if (picker?.mode === "dates-only") {
            setSearchTerm(result);
            setPicker(null);
          } else {
            window.location.href = "LTR-Checkout.html";
          }
        }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLTR />);
