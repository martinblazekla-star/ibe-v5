// Wellness detail dialog — with embedded calendar + day-level sold-out

const WL_MONTHS = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const WL_WEEKDAYS = ["po","út","st","čt","pá","so","ne"];
const WL_TODAY = new Date(2026, 4, 14);

function wlAddDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function wlAddMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }
function wlStartOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function wlSameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function wlShort(d) { return `${WL_WEEKDAYS[(d.getDay()+6)%7]}. ${d.getDate()}. ${d.getMonth()+1}.`; }

// Procedure-specific sold-out by date — deterministic mock
function wellnessSoldOutDay(procedureId, date) {
  const k = `${procedureId}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return (h % 8) === 0; // ~12% sold out
}

function wellnessSlotAvailable(procedureId, date, slot) {
  if (!date || wellnessSoldOutDay(procedureId, date)) return false;
  const k = `${procedureId}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${slot}`;
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return (h % 5) !== 0;
}

window.wellnessSoldOutDay = wellnessSoldOutDay;
window.WELLNESS_SLOTS = window.WELLNESS_SLOTS || ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

function WellnessDayTile({ date, state, selected, today, onClick }) {
  const past = state === "past";
  const soldOut = state === "soldOut";
  const disabled = past || soldOut;

  let bg = "white", border = "1px solid var(--border)", numColor = "var(--ink-1)", subColor = "var(--ink-3)";
  if (past) { numColor = "var(--ink-4)"; subColor = "var(--ink-4)"; border = "1px solid transparent"; bg = "transparent"; }
  if (soldOut) { numColor = "#E73737"; subColor = "#E73737"; bg = "white"; border = "1px solid var(--border)"; }
  if (selected) { bg = "var(--brand)"; numColor = "white"; subColor = "rgba(255,255,255,0.85)"; border = "1px solid var(--brand)"; }

  return (
    <button disabled={disabled} onClick={() => !disabled && onClick(date)} style={{
      appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
      width: "100%", aspectRatio: "1 / 1.08",
      background: bg, border, borderRadius: 8, padding: 0, position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
    }}>
      <span style={{
        fontFamily: "var(--font-display)", fontSize: 15, fontWeight: selected ? 700 : 600,
        color: numColor, lineHeight: 1, textDecoration: past || soldOut ? "line-through" : "none",
      }}>{date.getDate()}</span>
      {soldOut && (
        <span style={{
          fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 600,
          color: "#E73737", lineHeight: 1, letterSpacing: "0.02em", textTransform: "uppercase",
        }}>vyprodáno</span>
      )}
      {today && !selected && !past && !soldOut && (
        <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--brand)" }} />
      )}
    </button>
  );
}

function WellnessCalendar({ procedureId, value, onChange }) {
  const [viewMonth, setViewMonth] = React.useState(() => new Date(WL_TODAY.getFullYear(), WL_TODAY.getMonth(), 1));

  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = i - offset + 1;
    cells.push(day >= 1 && day <= daysInMonth ? new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day) : null);
  }
  // Trim trailing empty rows
  let lastUsed = -1;
  for (let i = cells.length - 1; i >= 0; i--) if (cells[i]) { lastUsed = i; break; }
  const rows = Math.ceil((lastUsed + 1) / 7);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setViewMonth(wlAddMonths(viewMonth, -1))} style={wlNavBtn}>
          <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Icon name="chevron-right" size={14} strokeWidth={2.4} /></span>
        </button>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
          textTransform: "capitalize",
        }}>{WL_MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
        <button onClick={() => setViewMonth(wlAddMonths(viewMonth, 1))} style={wlNavBtn}>
          <Icon name="chevron-right" size={14} strokeWidth={2.4} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {WL_WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.slice(0, rows * 7).map((d, i) => {
          if (!d) return <div key={i} />;
          const past = d < wlStartOfDay(WL_TODAY);
          const soldOut = !past && wellnessSoldOutDay(procedureId, d);
          const state = past ? "past" : (soldOut ? "soldOut" : "available");
          const selected = value && wlSameDay(value, d);
          const today = wlSameDay(d, WL_TODAY);
          return <WellnessDayTile key={i} date={d} state={state} selected={selected} today={today} onClick={onChange} />;
        })}
      </div>
    </div>
  );
}

const wlNavBtn = {
  appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
  color: "var(--ink-1)", width: 28, height: 28, borderRadius: 6,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

function wlChipStyle(active) {
  return {
    appearance: "none", cursor: "pointer",
    border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
    background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
    color: active ? "var(--brand)" : "var(--ink-1)",
    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
    padding: "7px 12px", borderRadius: 999,
  };
}
const wlQtyBtn = {
  appearance: "none", cursor: "pointer", border: "1.5px solid var(--border)", background: "white",
  width: 32, height: 32, borderRadius: 8, color: "var(--ink-1)",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16,
};

function WellnessDetailDialog({ open, procedure, onClose, onAdd }) {
  const [day, setDay] = React.useState(null);
  const [slot, setSlot] = React.useState(null);
  const [therapist, setTherapist] = React.useState("any");
  const [persons, setPersons] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setDay(null); setSlot(null); setTherapist("any");
      setPersons(procedure?.bundle ? 2 : (procedure?.category === "couples" ? 2 : 1));
    }
  }, [open, procedure?.id]);

  if (!open || !procedure) return null;

  const therapists = procedure.therapists || [];
  const totalPrice = procedure.price * (procedure.category === "couples" || procedure.bundle ? 1 : persons);
  const slots = window.WELLNESS_SLOTS;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 880,
        maxHeight: "92vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px",
      }}>
        <div style={{ overflowY: "auto", maxHeight: "92vh" }}>
          <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 32, lineHeight: 1 }}>{procedure.emoji}</span>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Rezervace procedury
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", marginTop: 2 }}>{procedure.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1 }}>{procedure.duration} min · {procedure.price.toLocaleString("cs-CZ")} Kč</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </div>

          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--neutral-50)" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              {procedure.desc}
            </p>

            {/* Calendar */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                1 · Vyberte den
              </div>
              <WellnessCalendar procedureId={procedure.id} value={day} onChange={(d) => { setDay(d); setSlot(null); }} />
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14, fontSize: 11.5, color: "var(--ink-3)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "white", border: "1px solid var(--border)" }} />
                  Volné
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--brand)" }} />
                  Vybráno
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "white", border: "1px solid var(--border)", color: "#E73737", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>×</span>
                  <span style={{ color: "#E73737" }}>Vyprodáno</span>
                </span>
              </div>
            </div>

            {/* Slot */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", opacity: day ? 1 : 0.5 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                2 · Vyberte čas {day && <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "var(--ink-2)" }}>· {wlShort(day)}</span>}
              </div>
              {!day ? (
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Nejprve vyberte den.</div>
              ) : (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {slots.map(s => {
                    const avail = wellnessSlotAvailable(procedure.id, day, s);
                    const on = slot === s;
                    return (
                      <button key={s} disabled={!avail} onClick={() => setSlot(s)} style={{
                        appearance: "none", cursor: avail ? "pointer" : "not-allowed",
                        border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                        background: !avail ? "var(--neutral-50)" : (on ? "var(--brand)" : "white"),
                        color: !avail ? "var(--ink-3)" : (on ? "white" : "var(--ink-1)"),
                        fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600,
                        padding: "8px 14px", borderRadius: 8,
                        textDecoration: !avail ? "line-through" : "none",
                        opacity: !avail ? 0.5 : 1, minWidth: 70,
                      }}>{s}</button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Therapist */}
            {therapists.length > 0 && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                  3 · Terapeut <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· volitelné</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <button onClick={() => setTherapist("any")} style={wlChipStyle(therapist === "any")}>Nezáleží</button>
                  {therapists.map(t => (
                    <button key={t} onClick={() => setTherapist(t)} style={wlChipStyle(therapist === t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Persons */}
            {!procedure.bundle && procedure.category !== "couples" && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                    4 · Počet osob
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Pro každou osobu zvlášť ve stejném čase</div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setPersons(Math.max(1, persons - 1))} style={wlQtyBtn}>−</button>
                  <span style={{ minWidth: 28, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{persons}</span>
                  <button onClick={() => setPersons(Math.min(4, persons + 1))} style={wlQtyBtn}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right summary */}
        <aside style={{
          background: "var(--neutral-50)", borderLeft: "1px solid var(--border)",
          padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Souhrn</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="leaf" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {procedure.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="calendar" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {day ? wlShort(day) : "Vyberte den"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="check" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {slot || "Vyberte čas"}</div>
              {therapists.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="person" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {therapist === "any" ? "Libovolný terapeut" : therapist}</div>}
              {!procedure.bundle && procedure.category !== "couples" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="users" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {persons} {persons === 1 ? "osoba" : "osoby"}</div>
              )}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Cena</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
              {totalPrice.toLocaleString("cs-CZ")} Kč
            </span>
          </div>

          <button
            disabled={!day || !slot}
            onClick={() => onAdd && onAdd({ procedure, day, slot, therapist, persons, totalPrice })}
            style={{
              appearance: "none", border: "none", cursor: (day && slot) ? "pointer" : "not-allowed",
              background: (day && slot) ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
              opacity: (day && slot) ? 1 : 0.6,
              color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
              padding: "13px 16px", borderRadius: 8, letterSpacing: "0.01em",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            Přidat do rezervace
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Storno zdarma 24 h předem
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Garance termínu po potvrzení
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Platba s pobytem na recepci
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

window.WellnessDetailDialog = WellnessDetailDialog;
window.WellnessSlotDialog = WellnessDetailDialog; // backward-compat alias
