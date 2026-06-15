// LTR Single Room — focused landing inside the booking engine for ONE rental room
// The dialog flow (term selection + rate selection + summary) is moved inline as the main page

const { useState: useStateSLR } = React;

const LTRM_MONTHS_NAMES_SLR = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const LTRM_MONTHS_SHORT_SLR = ["LED","ÚNO","BŘE","DUB","KVĚ","ČVN","ČVC","SRP","ZÁŘ","ŘÍJ","LIS","PRO"];
const SLR_TODAY = new Date(2026, 4, 14);

function slrAddMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); r.setDate(1); return r; }
function slrKey(d) { return `${d.getFullYear()}-${d.getMonth()}`; }
function slrDaysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function slrDiffMonths(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1; }
function fmtSLR(n) { return n.toLocaleString("cs-CZ"); }

function slrPriceHeat(factor) {
  if (factor <= 0.97) return { bg: "#E8F4EE", color: "#10623E" };
  if (factor <= 1.00) return { bg: "#F1F4F6", color: "var(--ink-1)" };
  if (factor <= 1.04) return { bg: "#FDECD8", color: "#7A4A0F" };
  if (factor <= 1.08) return { bg: "#FAD8B4", color: "#5C3309" };
  return { bg: "#F5B884", color: "#4A2806" };
}

function slrBuildMonths(room, count = 14) {
  const start = slrAddMonths(SLR_TODAY, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = slrAddMonths(start, i);
    const past = d.getFullYear() < SLR_TODAY.getFullYear() || (d.getFullYear() === SLR_TODAY.getFullYear() && d.getMonth() < SLR_TODAY.getMonth());
    const found = window.LTR_MONTHS?.find(x => x.month === d.getMonth() + 1) || { factor: 1.00 };
    return {
      date: d,
      key: slrKey(d),
      monthName: LTRM_MONTHS_SHORT_SLR[d.getMonth()],
      year: String(d.getFullYear()).slice(-2),
      factor: found.factor,
      monthlyPrice: Math.round(room.monthlyFrom * found.factor),
      past,
    };
  });
}

// — Gallery —

function SLRGallery({ room }) {
  const imgs = [room.image, "assets/room-2.png", "assets/room-3.png", room.image, "assets/room-1.png"];
  return (
    <section>
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, height: 420,
      }}>
        <div style={{
          background: `url(${imgs[0]}) center / cover no-repeat var(--neutral-100)`,
          borderRadius: 12, gridRow: "span 2", position: "relative",
        }}>
          <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
            {room.tags.slice(0, 2).map(t => (
              <span key={t} style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--ink-1)",
                background: "rgba(255,255,255,0.94)", padding: "5px 9px", borderRadius: 4,
              }}>{t}</span>
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: `url(${imgs[i]}) center / cover no-repeat var(--neutral-100)`,
            borderRadius: 12, position: "relative",
          }}>
            {i === 4 && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: 12,
                background: "rgba(15,18,22,0.55)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              }}>
                <Icon name="image" size={16} strokeWidth={1.6} />
                +8 fotek
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// — Title bar —

function SLRTitleBar({ room }) {
  return (
    <div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--brand)",
      }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />
        Dlouhodobé bydlení · č. {room.number}
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "var(--ink-1)",
        margin: "8px 0 0", letterSpacing: "-0.018em", lineHeight: 1.1,
      }}>{room.name}</h1>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px 22px", marginTop: 12, color: "var(--ink-2)", fontSize: 14,
      }}>
        {[
          { icon: "person", label: `${room.capacity} osob` },
          { icon: "size", label: `${room.size} m²` },
          { icon: "bed", label: room.beds },
          { icon: "view", label: room.view },
        ].map((s, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name={s.icon} size={15} color="var(--ink-3)" strokeWidth={1.8} />
            <span style={{ fontWeight: 500 }}>{s.label}</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
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
      </div>
    </div>
  );
}

// — Copy & amenities —

function SLRCopy({ room }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
        margin: "0 0 12px", letterSpacing: "-0.01em",
      }}>O bytě</h2>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65, margin: "0 0 10px" }}>
        Plně vybavený {room.name.toLowerCase()} v klidné části Karlína. Kuchyňka s indukční deskou, troubou a myčkou, vlastní koupelna, pracovní stůl s ergonomickou židlí, rychlý internet 1 Gbps.
        Energie a internet jsou součástí měsíčního nájmu — žádné překvapení v zimě.
      </p>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
        Vhodné pro studenta, mladého profesionála nebo páry. Možnost prodloužení smlouvy o další roky, výpovědní lhůta 1 měsíční nájem.
      </p>
    </section>
  );
}

function SLRAmenities({ room }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
        margin: "0 0 16px", letterSpacing: "-0.01em",
      }}>Vybavení bytu</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px 22px" }}>
        {room.amenities.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "var(--ink-1)" }}>
            <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
            <span>{a}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// — Inline term picker (replaces dialog) —

function SLRTermPicker({ room, value, onChange }) {
  const [moveInMonth, setMoveInMonth] = useStateSLR(value?.moveInMonth || null);
  const [moveOutMonth, setMoveOutMonth] = useStateSLR(value?.moveOutMonth || null);
  const [moveInDay, setMoveInDay] = useStateSLR(value?.moveInDay || 1);
  const [moveOutDay, setMoveOutDay] = useStateSLR(value?.moveOutDay || null);
  const [hoverMonth, setHoverMonth] = useStateSLR(null);
  const [editingDay, setEditingDay] = useStateSLR(null);

  const monthList = slrBuildMonths(room, 14);
  const length = (moveInMonth && moveOutMonth) ? slrDiffMonths(moveInMonth, moveOutMonth) : null;

  // Update parent
  React.useEffect(() => {
    onChange({ moveInMonth, moveOutMonth, moveInDay, moveOutDay, length });
  }, [moveInMonth?.getTime(), moveOutMonth?.getTime(), moveInDay, moveOutDay, length]);

  const pickMonth = (m) => {
    if (m.past) return;
    if (!moveInMonth || (moveInMonth && moveOutMonth)) {
      setMoveInMonth(m.date); setMoveInDay(1);
      setMoveOutMonth(null); setMoveOutDay(null);
    } else if (m.date < moveInMonth) {
      setMoveInMonth(m.date); setMoveInDay(1);
    } else {
      setMoveOutMonth(m.date);
      setMoveOutDay(slrDaysInMonth(m.date));
    }
  };

  const pickLength = (n) => {
    if (!moveInMonth) {
      const first = monthList.find(x => !x.past);
      if (!first) return;
      setMoveInMonth(first.date); setMoveInDay(1);
      const out = slrAddMonths(first.date, n - 1);
      setMoveOutMonth(out); setMoveOutDay(slrDaysInMonth(out));
      return;
    }
    const out = slrAddMonths(moveInMonth, n - 1);
    setMoveOutMonth(out); setMoveOutDay(slrDaysInMonth(out));
  };

  const isInRange = (m) => {
    if (!moveInMonth) return false;
    const end = moveOutMonth || hoverMonth;
    if (!end) return slrKey(m.date) === slrKey(moveInMonth);
    return m.date >= moveInMonth && m.date <= end;
  };
  const isEdge = (m) => {
    if (moveInMonth && slrKey(m.date) === slrKey(moveInMonth)) return "in";
    if (moveOutMonth && slrKey(m.date) === slrKey(moveOutMonth)) return "out";
    return null;
  };

  const hasTerm = moveInMonth && moveOutMonth;

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
        margin: "0 0 6px", letterSpacing: "-0.01em",
      }}>1. Vyberte termín nájmu</h2>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 16 }}>
        Klikněte na měsíc nástupu a měsíc konce. Standardně se stěhuje k prvnímu dni měsíce a odjíždí poslední den.
      </div>

      <div style={{
        background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px",
      }}>
        {/* Month chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {monthList.map(m => {
            const heat = slrPriceHeat(m.factor);
            const inRange = isInRange(m);
            const edge = isEdge(m);
            return (
              <button
                key={m.key}
                disabled={m.past}
                onClick={() => pickMonth(m)}
                onMouseEnter={() => moveInMonth && !moveOutMonth && m.date >= moveInMonth && setHoverMonth(m.date)}
                onMouseLeave={() => setHoverMonth(null)}
                style={{
                  appearance: "none", cursor: m.past ? "not-allowed" : "pointer",
                  width: 78,
                  border: edge ? "2px solid var(--ink-1)" : `1px solid ${inRange ? "var(--ink-1)" : "var(--border)"}`,
                  background: m.past ? "var(--neutral-50)"
                    : (edge ? "var(--ink-1)" : (inRange ? "color-mix(in oklch, var(--ink-1) 88%, white)" : heat.bg)),
                  color: edge ? "white" : (inRange ? "white" : (m.past ? "var(--ink-4)" : heat.color)),
                  borderRadius: 8, padding: "10px 6px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  fontFamily: "var(--font-ui)", opacity: m.past ? 0.5 : 1,
                }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>{m.monthName}</span>
                <span style={{ fontSize: 10, opacity: 0.85 }}>'{m.year}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                  {Math.round(m.monthlyPrice / 1000)}k
                </span>
              </button>
            );
          })}
        </div>

        {/* Heat legend */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "var(--ink-3)", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "#E8F4EE" }} />
            Nejlevnější
          </span>
          <span style={{ display: "inline-block", height: 8, width: 80, borderRadius: 4, background: "linear-gradient(90deg, #E8F4EE 0%, #F1F4F6 30%, #FDECD8 60%, #F5B884 100%)" }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "#F5B884" }} />
            Nejdražší
          </span>
        </div>

        {/* Day refine */}
        {hasTerm && (
          <div style={{
            marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)",
            display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "stretch",
          }}>
            <SLRDayCell
              label="Den nástupu"
              date={new Date(moveInMonth.getFullYear(), moveInMonth.getMonth(), moveInDay)}
              suggestion={moveInDay === 1}
              hint="Doporučený den"
              editing={editingDay === "in"}
              onEdit={() => setEditingDay(editingDay === "in" ? null : "in")}
              onPickDay={setMoveInDay}
              range={[1, slrDaysInMonth(moveInMonth)]}
              current={moveInDay}
            />
            <div style={{ alignSelf: "center", color: "var(--ink-3)" }}>
              <Icon name="chevron-right" size={16} strokeWidth={2.2} />
            </div>
            <SLRDayCell
              label="Den odjezdu"
              date={new Date(moveOutMonth.getFullYear(), moveOutMonth.getMonth(), moveOutDay)}
              suggestion={moveOutDay === slrDaysInMonth(moveOutMonth)}
              hint="Poslední den měsíce"
              editing={editingDay === "out"}
              onEdit={() => setEditingDay(editingDay === "out" ? null : "out")}
              onPickDay={setMoveOutDay}
              range={[1, slrDaysInMonth(moveOutMonth)]}
              current={moveOutDay}
            />
          </div>
        )}

        {/* Length quick chips */}
        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Délka pobytu
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", marginTop: 2 }}>
              {length ? `${length} ${length === 1 ? "měsíc" : length < 5 ? "měsíce" : "měsíců"}` : "Nevybráno"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[3, 6, 9, 12].map(n => {
              const enabled = n >= room.minMonths && n <= room.maxMonths;
              const on = length === n;
              return (
                <button key={n} disabled={!enabled} onClick={() => pickLength(n)} style={{
                  appearance: "none", cursor: enabled ? "pointer" : "not-allowed",
                  border: `1.5px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
                  background: on ? "var(--ink-1)" : "white",
                  color: on ? "white" : "var(--ink-1)",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                  padding: "8px 14px", borderRadius: 8,
                  opacity: enabled ? 1 : 0.4,
                }}>{n} měs.</button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SLRDayCell({ label, date, suggestion, hint, editing, onEdit, onPickDay, range, current }) {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {suggestion && !editing && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em",
              color: "var(--accent-dark)", background: "var(--accent-tint)",
              padding: "2px 6px", borderRadius: 3, textTransform: "uppercase",
            }}>Doporučeno</span>
          )}
          <button onClick={onEdit} style={{
            appearance: "none", border: "none", background: "transparent", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, color: "var(--brand)", letterSpacing: "0.05em",
            textTransform: "uppercase", padding: 0,
          }}>{editing ? "Hotovo" : "Upravit"}</button>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
        {date.getDate()}. {LTRM_MONTHS_NAMES_SLR[date.getMonth()]} {date.getFullYear()}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{hint}</div>
      {editing && (
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: range[1] }, (_, i) => i + 1).map(d => {
            const on = d === current;
            return (
              <button key={d} onClick={() => onPickDay(d)} style={{
                appearance: "none", cursor: "pointer", height: 28, borderRadius: 5,
                border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
                background: on ? "var(--ink-1)" : "white",
                color: on ? "white" : "var(--ink-1)",
                fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: on ? 700 : 600, padding: 0,
              }}>{d}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// — Inline rates picker —

function SLRRates({ room, hasTerm, value, onChange }) {
  return (
    <section style={{ marginTop: 32, opacity: hasTerm ? 1 : 0.5, pointerEvents: hasTerm ? "auto" : "none" }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
        margin: "0 0 6px", letterSpacing: "-0.01em",
      }}>2. Vyberte sazbu</h2>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 16 }}>
        {hasTerm ? "Sazby se liší podmínkami zrušení a délkou smlouvy." : "Nejprve vyberte termín nájmu výše."}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {room.rates.map((rate, idx) => {
          const on = value?.id === rate.id;
          const recommended = idx === 1 || (room.rates.length === 1 && idx === 0);
          return (
            <button key={rate.id} onClick={() => onChange(rate)} style={{
              appearance: "none", cursor: "pointer", textAlign: "left",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 3%, white)" : "white",
              borderRadius: 10, padding: "16px 18px", position: "relative",
            }}>
              {recommended && (
                <span style={{
                  position: "absolute", left: 14, top: -10,
                  fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "white",
                  background: "var(--ink-1)", padding: "3px 8px", borderRadius: 4,
                }}>Doporučeno</span>
              )}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>{rate.name}</span>
                    {rate.badge && (
                      <span style={{
                        fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700,
                        background: "var(--accent-tint)", color: "var(--accent-dark)",
                        padding: "2px 7px", borderRadius: 4, letterSpacing: "0.02em",
                      }}>{rate.badge}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{rate.contract}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", marginTop: 8, fontSize: 12, color: "var(--ink-2)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
                      Energie a služby v ceně
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
                      Vratná kauce 1× měsíční nájem
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
                      {idx === 0 ? "Storno 14 dnů před nástupem" : (idx === 1 ? "Storno 30 dnů před nástupem" : "Bez možnosti storna")}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
                    od {fmtSLR(rate.monthly)} Kč
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>měsíčně, vč. služeb</div>
                  <span style={{
                    display: "inline-block", marginTop: 10,
                    width: 18, height: 18, borderRadius: "50%",
                    border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                    background: on ? "var(--brand)" : "white", position: "relative",
                  }}>
                    {on && <span style={{ position: "absolute", top: 3, left: 3, width: 9, height: 9, borderRadius: "50%", background: "white" }} />}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// — Sticky sidebar summary —

function SLRSidebar({ room, term, rate, onConfirm }) {
  const [breakdownOpen, setBreakdownOpen] = useStateSLR(false);

  const baseMonthly = rate?.monthly || room.monthlyFrom;
  const rangeMonths = (term?.moveInMonth && term?.moveOutMonth) ? (() => {
    const list = [];
    let cur = new Date(term.moveInMonth);
    while (cur <= term.moveOutMonth) {
      const found = window.LTR_MONTHS?.find(x => x.month === cur.getMonth() + 1) || { factor: 1 };
      list.push({
        label: `${LTRM_MONTHS_NAMES_SLR[cur.getMonth()]} ${cur.getFullYear()}`,
        monthly: Math.round(baseMonthly * found.factor),
        factor: found.factor,
      });
      cur = slrAddMonths(cur, 1);
    }
    return list;
  })() : [];

  const rentMin = rangeMonths.length ? Math.min(...rangeMonths.map(m => m.monthly)) : null;
  const rentMax = rangeMonths.length ? Math.max(...rangeMonths.map(m => m.monthly)) : null;
  const rentTotal = rangeMonths.reduce((s, m) => s + m.monthly, 0);

  const hasTerm = term?.moveInMonth && term?.moveOutMonth;
  const ready = hasTerm && rate;

  return (
    <aside style={{
      position: "sticky", top: 92, alignSelf: "flex-start",
      background: "white", border: "1px solid var(--border)", borderRadius: 14,
      overflow: "hidden", boxShadow: "0 4px 18px rgba(16,24,40,.06)",
    }}>
      <div style={{
        padding: "14px 18px", borderBottom: "1px solid var(--border)",
        background: "color-mix(in oklch, var(--brand) 3%, white)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 9px", borderRadius: 6, background: "#FFF7E6", color: "#7A4A0F",
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
          border: "1px solid #F2D88B",
        }}>
          <Icon name="info" size={10} strokeWidth={2.4} />
          Drženo · 11:42
        </span>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-3)" }}>
          {ready ? "Připraveno k rezervaci" : "Vyplňte termín a sazbu"}
        </div>
      </div>

      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <SumLineSLR label="Nástup" value={term?.moveInMonth ? `${term.moveInDay}. ${LTRM_MONTHS_NAMES_SLR[term.moveInMonth.getMonth()]} ${term.moveInMonth.getFullYear()}` : "—"} bold={!!term?.moveInMonth} />
        <SumLineSLR label="Konec" value={term?.moveOutMonth ? `${term.moveOutDay}. ${LTRM_MONTHS_NAMES_SLR[term.moveOutMonth.getMonth()]} ${term.moveOutMonth.getFullYear()}` : "—"} bold={!!term?.moveOutMonth} />
        <SumLineSLR label="Délka" value={term?.length ? `${term.length} ${term.length === 1 ? "měsíc" : term.length < 5 ? "měsíce" : "měsíců"}` : "—"} bold={!!term?.length} />
        <SumLineSLR label="Sazba" value={rate ? rate.name : (hasTerm ? "Vyber níže" : "—")} bold={!!rate} />
      </div>

      {hasTerm && (
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
              Měsíční nájem
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
              {fmtSLR(rentMin)}{rentMax > rentMin && `–${fmtSLR(rentMax)}`} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)" }}>Kč/měs.</span>
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.4 }}>
            Cena se v jednotlivých měsících liší podle sezóny. Vč. energií a služeb.
          </div>
          <button onClick={() => setBreakdownOpen(!breakdownOpen)} style={{
            appearance: "none", cursor: "pointer", border: "none", background: "transparent", padding: 0,
            marginTop: 6, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700,
            color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            {breakdownOpen ? "Skrýt rozpad" : "Zobrazit rozpad po měsících"}
            <span style={{ display: "inline-block", transform: breakdownOpen ? "rotate(180deg)" : "none" }}>
              <Icon name="chevron-down" size={11} strokeWidth={2.4} />
            </span>
          </button>
          {breakdownOpen && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border-soft)", maxHeight: 200, overflowY: "auto" }}>
              {rangeMonths.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
                  <span style={{ color: "var(--ink-2)" }}>{m.label}{m.factor > 1.04 && " ❆"}</span>
                  <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{fmtSLR(m.monthly)} Kč</span>
                </div>
              ))}
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>Nájem celkem</span>
                <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>{fmtSLR(rentTotal)} Kč</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
          Rezervační poplatek
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
          {fmtSLR(room.bookingFee)} Kč
        </span>
      </div>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
          Vratná kauce
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
          {fmtSLR(room.deposit)} Kč
        </span>
      </div>

      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          disabled={!ready}
          onClick={onConfirm}
          style={{
            appearance: "none", border: "none",
            cursor: ready ? "pointer" : "not-allowed",
            background: ready ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
            opacity: ready ? 1 : 0.6,
            color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
            padding: "14px 16px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          Pokračovat k údajům
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </button>
        <div style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.4 }}>
          Nyní hradíte pouze rezervační poplatek {fmtSLR(room.bookingFee)} Kč.<br/>
          Kauce a první nájem 7 dní před nástupem.
        </div>
      </div>

      <div style={{ padding: "10px 18px 14px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 5 }}>
        <Trust4SLR>Bez agentury · 0 % provize</Trust4SLR>
        <Trust4SLR>Smlouva v ČJ i EN</Trust4SLR>
        <Trust4SLR>Výpověď s 1 měsíční výpovědní lhůtou</Trust4SLR>
      </div>
    </aside>
  );
}

function SumLineSLR({ label, value, bold }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{label}</span>
      <span style={{ fontSize: 13, color: bold ? "var(--ink-1)" : "var(--ink-3)", fontWeight: bold ? 700 : 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Trust4SLR({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

// — Main app —

function AppLTRSingleRoom() {
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const room = window.LTR_ROOMS[0];
  const [term, setTerm] = useStateSLR({});
  const [rate, setRate] = useStateSLR(null);

  const hasTerm = term?.moveInMonth && term?.moveOutMonth;

  // Auto-select recommended rate when term is set
  React.useEffect(() => {
    if (hasTerm && !rate && room.rates.length) {
      setRate(room.rates.length > 1 ? room.rates[1] : room.rates[0]);
    }
  }, [hasTerm, room.id]);

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <LTRBookingNav step={1} />

      <div style={{ background: "var(--surface)", padding: "14px 32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)" }}>
          <a href="LTR-Pick-Room.html" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Dlouhodobé bydlení</a>
          <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{room.name}</span>
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 32, alignItems: "start" }}>
          <div>
            <SLRTitleBar room={room} />
            <div style={{ marginTop: 18 }}>
              <SLRGallery room={room} />
            </div>
            <SLRCopy room={room} />
            <SLRAmenities room={room} />
            <SLRTermPicker room={room} value={term} onChange={setTerm} />
            <SLRRates room={room} hasTerm={hasTerm} value={rate} onChange={setRate} />
          </div>
          <SLRSidebar room={room} term={term} rate={rate} onConfirm={() => { window.location.href = "LTR-Checkout.html"; }} />
        </div>
        <PickRoomFooter />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLTRSingleRoom />);
