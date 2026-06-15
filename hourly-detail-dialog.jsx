// Hourly room detail dialog — date strip + visual timeline + duration picker
//
// Timeline rendering: a single horizontal band of 96 quarter-hour slots (24h)
// per day, with bookings, past-now greying, night-hour tinting, and a draggable
// selection. Crossing midnight reveals a second row for the next day.

const HQ_PERHOUR = 4;     // quarter-hours per hour
const HQ_PERDAY = 96;     // quarter-hours per day

// Visual constants
const HQ_TIMELINE_H = 56;        // px tall band
const HQ_HOUR_LABEL_GAP = 2;     // label every 2h
const HQ_NIGHT_START = 22 * HQ_PERHOUR;
const HQ_NIGHT_END = 6 * HQ_PERHOUR;

function HQTimelineRow({
  dayIndex,         // 0=selected day, 1=next day
  dayDate,
  bookings,         // bookings overlapping this day, normalised to 0..96
  nowQH,            // -1 if entirely future; otherwise QH within this day
  selStart,         // selection start QH in this day (may be null / clipped)
  selEnd,           // selection end QH in this day (may be null / clipped)
  onSlotClick,      // (qh) => void  -- click an available slot to set start
  onSlotHover,      // (qh|null) => void
  hoverQH,          // hovered qh (for preview), null when not hovering
  hoverEndQH,       // hovered preview end qh in this day
  duration,         // qh duration (for hover preview)
  room,
  onHandleDragStart,
}) {
  const ref = React.useRef(null);

  function eventToQH(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    return Math.floor(pct * HQ_PERDAY);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Day label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, color: "var(--ink-2)", textTransform: "capitalize" }}>
          {window.hFmtCzech(dayDate)}
        </span>
        {dayIndex === 0 && nowQH >= 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600, color: "var(--ink-3)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />
            Nyní {window.qhToLabel(nowQH)}
          </span>
        )}
      </div>

      {/* Hour ticks above */}
      <div style={{ position: "relative", height: 14, marginBottom: -4 }}>
        {Array.from({ length: 13 }, (_, i) => i * 2).map(h => (
          <div key={h} style={{
            position: "absolute", left: `${(h / 24) * 100}%`, transform: "translateX(-50%)",
            fontSize: 10.5, fontWeight: 600, color: "var(--ink-3)",
          }}>{String(h).padStart(2, "0")}</div>
        ))}
      </div>

      {/* The band itself */}
      <div
        ref={ref}
        onMouseLeave={() => onSlotHover && onSlotHover(null)}
        onMouseMove={(e) => {
          const qh = eventToQH(e);
          onSlotHover && onSlotHover(qh);
        }}
        onClick={(e) => {
          const qh = eventToQH(e);
          onSlotClick && onSlotClick(qh);
        }}
        style={{
          position: "relative", height: HQ_TIMELINE_H, borderRadius: 8,
          background: "color-mix(in oklch, var(--accent) 6%, white)",
          border: "1px solid var(--border)",
          overflow: "hidden", cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Night bands (22-06) */}
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          left: 0,
          width: `${(HQ_NIGHT_END / HQ_PERDAY) * 100}%`,
          background: "color-mix(in oklch, var(--ink-1) 6%, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          left: `${(HQ_NIGHT_START / HQ_PERDAY) * 100}%`,
          right: 0,
          background: "color-mix(in oklch, var(--ink-1) 6%, transparent)",
          pointerEvents: "none",
        }} />

        {/* Hour gridlines */}
        {Array.from({ length: 24 }, (_, h) => h).map(h => (
          <div key={h} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${(h / 24) * 100}%`, width: 1,
            background: h % 6 === 0 ? "color-mix(in oklch, var(--ink-1) 14%, transparent)" : "color-mix(in oklch, var(--ink-1) 5%, transparent)",
            pointerEvents: "none",
          }} />
        ))}

        {/* Bookings (occupied) */}
        {bookings.map((b, i) => {
          const left = (b.startQH / HQ_PERDAY) * 100;
          const width = ((b.endQH - b.startQH) / HQ_PERDAY) * 100;
          return (
            <div key={i} title={`Obsazeno ${window.qhToLabel(b.startQH)}–${window.qhToLabel(b.endQH)}`} style={{
              position: "absolute", top: 4, bottom: 4,
              left: `${left}%`, width: `${width}%`,
              background: "repeating-linear-gradient(135deg, #B6BCC1 0, #B6BCC1 6px, #A6ACB1 6px, #A6ACB1 12px)",
              borderRadius: 4,
              pointerEvents: "none",
            }} />
          );
        })}

        {/* Past mask (only on today's row) */}
        {dayIndex === 0 && nowQH > 0 && (
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: 0, width: `${(nowQH / HQ_PERDAY) * 100}%`,
            background: "repeating-linear-gradient(135deg, transparent 0 6px, rgba(255,255,255,0.55) 6px 12px)",
            backdropFilter: "saturate(40%)",
            pointerEvents: "none",
          }} />
        )}

        {/* Hover preview */}
        {hoverQH !== null && hoverEndQH !== null && hoverEndQH > hoverQH && (
          <div style={{
            position: "absolute", top: 4, bottom: 4,
            left: `${(hoverQH / HQ_PERDAY) * 100}%`,
            width: `${((hoverEndQH - hoverQH) / HQ_PERDAY) * 100}%`,
            background: "color-mix(in oklch, var(--brand) 18%, transparent)",
            border: "1.5px dashed var(--brand)",
            borderRadius: 6,
            pointerEvents: "none",
          }} />
        )}

        {/* Active selection */}
        {selStart !== null && selEnd !== null && selEnd > selStart && (
          <div style={{
            position: "absolute", top: 4, bottom: 4,
            left: `${(selStart / HQ_PERDAY) * 100}%`,
            width: `${((selEnd - selStart) / HQ_PERDAY) * 100}%`,
            background: "var(--brand)",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(85,1,115,.35)",
            pointerEvents: "none",
            color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: "0.02em",
            overflow: "hidden", whiteSpace: "nowrap",
          }}>
            <span style={{ padding: "0 6px" }}>
              {window.qhToLabel(selStart)} – {selEnd >= HQ_PERDAY ? "00:00⁺" : window.qhToLabel(selEnd)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Day chip strip ─────────────────────────────────────────────────────────
function HQDayStrip({ value, onChange }) {
  const today = window.HOURLY_TODAY;
  const days = Array.from({ length: 14 }, (_, i) => window.hAddDays(today, i));

  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
      {days.map((d, i) => {
        const active = window.hSameDay(value, d);
        const label = i === 0 ? "Dnes" : i === 1 ? "Zítra" : window.H_WEEKDAYS[(d.getDay() + 6) % 7];
        return (
          <button key={i} onClick={() => onChange(d)} style={{
            appearance: "none", cursor: "pointer", flexShrink: 0,
            border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
            background: active ? "var(--brand)" : "white",
            color: active ? "white" : "var(--ink-1)",
            borderRadius: 10, padding: "8px 12px 9px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            minWidth: 58,
          }}>
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.06em",
              opacity: active ? 0.9 : 0.6,
            }}>{label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
              {d.getDate()}.{d.getMonth() + 1}.
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Duration chips ─────────────────────────────────────────────────────────
const HQ_DURATIONS = [
  { qh: 4,  label: "1 h" },
  { qh: 6,  label: "1:30" },
  { qh: 8,  label: "2 h",   common: true },
  { qh: 10, label: "2:30" },
  { qh: 12, label: "3 h" },
  { qh: 16, label: "4 h" },
  { qh: 20, label: "5 h" },
  { qh: 24, label: "6 h" },
  { qh: 32, label: "8 h" },
  { qh: 40, label: "10 h" },
  { qh: 48, label: "Přes noc", overnight: true },
];

function HQDurationChips({ value, onChange, room, startQH, baseDate }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {HQ_DURATIONS.map(d => {
        const on = value === d.qh;
        // Test if THIS duration would fit cleanly given startQH
        const fits = startQH != null
          ? window.isRangeFree(room, startQH, startQH + d.qh)
          : true;
        return (
          <button key={d.qh} onClick={() => onChange(d.qh)} style={{
            appearance: "none", cursor: "pointer",
            border: `1.5px solid ${on ? "var(--brand)" : (d.common && !on ? "color-mix(in oklch, var(--brand) 35%, white)" : "var(--border)")}`,
            background: on ? "var(--brand)" : "white",
            color: on ? "white" : (fits ? "var(--ink-1)" : "var(--ink-4)"),
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
            padding: "7px 12px", borderRadius: 8,
            opacity: fits ? 1 : 0.55,
            position: "relative",
          }}>
            {d.label}
            {d.common && !on && (
              <span style={{
                position: "absolute", top: -7, right: -6,
                background: "var(--brand)", color: "white",
                fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>Nejčastější</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Mode toggle (Duration vs Range) ────────────────────────────────────────
function HQModeToggle({ value, onChange }) {
  const opts = [
    { id: "duration", label: "Délka pobytu" },
    { id: "range", label: "Od – do" },
  ];
  return (
    <div style={{
      display: "inline-flex", padding: 3, background: "var(--neutral-100)",
      borderRadius: 8, gap: 2,
    }}>
      {opts.map(o => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            appearance: "none", cursor: "pointer",
            background: on ? "white" : "transparent",
            color: on ? "var(--ink-1)" : "var(--ink-3)",
            border: "none",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
            padding: "6px 12px", borderRadius: 6,
            boxShadow: on ? "0 1px 2px rgba(16,24,40,.06)" : "none",
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// ─── Time picker (Od / Do for range mode) ───────────────────────────────────
function HQTimePicker({ valueQH, onChange, label, min = 0, max = 192 }) {
  // Produce a list of 15-min options between min..max
  const opts = [];
  for (let q = min; q <= max; q++) {
    opts.push(q);
  }
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <span style={{
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)",
      }}>{label}</span>
      <select
        value={valueQH}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{
          appearance: "none", border: "1.5px solid var(--border)", borderRadius: 8,
          padding: "9px 30px 9px 12px",
          fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
          color: "var(--ink-1)", background: "white", cursor: "pointer",
          backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
          backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
          width: "100%",
        }}
      >
        {opts.map(q => (
          <option key={q} value={q}>
            {q >= 96 ? `${window.qhToLabel(q)} (zítra)` : window.qhToLabel(q)}
          </option>
        ))}
      </select>
    </label>
  );
}

// ─── Main dialog ────────────────────────────────────────────────────────────
function HourlyDetailDialog({ open, room, defaultMode = "duration", onClose, onConfirm }) {
  const [day, setDay] = React.useState(window.HOURLY_TODAY);
  const [mode, setMode] = React.useState(defaultMode);
  const [startQH, setStartQH] = React.useState(64);   // 16:00 default
  const [duration, setDuration] = React.useState(8);  // 2h default
  const [endQH, setEndQH] = React.useState(72);       // 18:00 default
  const [hoverQH, setHoverQH] = React.useState(null);
  const [guests, setGuests] = React.useState(2);

  React.useEffect(() => {
    if (open && room) {
      setDay(window.HOURLY_TODAY);
      setMode(defaultMode);
      setStartQH(64);
      setDuration(8);
      setEndQH(72);
      setHoverQH(null);
      setGuests(2);
    }
  }, [open, room, defaultMode]);

  if (!open || !room) return null;

  // Compute current selection in absolute QH (over [0..192])
  const selectedStartAbs = startQH;
  const selectedEndAbs = mode === "duration" ? startQH + duration : endQH;
  const selectedDuration = selectedEndAbs - selectedStartAbs;

  // Compute bookings normalised for today/tomorrow rows (clip to each day)
  const allBookings = window.bookingsFor(room);
  const day0Bookings = allBookings
    .filter(b => b.startQH < HQ_PERDAY)
    .map(b => ({ startQH: b.startQH, endQH: Math.min(b.endQH, HQ_PERDAY) }));
  const day1Bookings = allBookings
    .filter(b => b.endQH > HQ_PERDAY)
    .map(b => ({ startQH: Math.max(0, b.startQH - HQ_PERDAY), endQH: b.endQH - HQ_PERDAY }));

  // Clip selection / hover to each day-row
  function clipToDay(start, end, dayIdx) {
    const dayLo = dayIdx * HQ_PERDAY;
    const dayHi = (dayIdx + 1) * HQ_PERDAY;
    if (end <= dayLo || start >= dayHi) return [null, null];
    return [Math.max(start, dayLo) - dayLo, Math.min(end, dayHi) - dayLo];
  }

  const [selDay0Start, selDay0End] = clipToDay(selectedStartAbs, selectedEndAbs, 0);
  const [selDay1Start, selDay1End] = clipToDay(selectedStartAbs, selectedEndAbs, 1);

  // Hover preview: hovered QH is in the day-row that's being hovered;
  // we don't track which row, just take the hoverQH in whichever row.
  let hoverDay0Start = null, hoverDay0End = null, hoverDay1Start = null, hoverDay1End = null;
  if (hoverQH !== null && mode === "duration") {
    // Hover is set on whichever row the mouse is in (we use day-0 row for hovering since that's the active interaction)
    const hAbs = hoverQH; // hoverQH is row-local but we treat as day-0
    const hAbsEnd = hAbs + duration;
    [hoverDay0Start, hoverDay0End] = clipToDay(hAbs, hAbsEnd, 0);
    [hoverDay1Start, hoverDay1End] = clipToDay(hAbs, hAbsEnd, 1);
  }

  // Pricing
  const priced = window.priceForRoom(room, selectedStartAbs, selectedEndAbs);
  const valid = selectedEndAbs > selectedStartAbs && window.isRangeFree(room, selectedStartAbs, selectedEndAbs);
  const crossesMidnight = selectedEndAbs > HQ_PERDAY;

  function handleSlotClick(qhInDay0) {
    setStartQH(qhInDay0);
    if (mode === "range") setEndQH(Math.max(qhInDay0 + 4, endQH));
  }

  function handleSlotHover(qhOrNull) {
    setHoverQH(qhOrNull);
  }

  const todayLabelQH = window.HOURLY_NOW_QH;
  const isTodaySelected = window.hSameDay(day, window.HOURLY_TODAY);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 940,
        maxHeight: "94vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px",
      }}>
        {/* Left scrollable form */}
        <div style={{ overflowY: "auto", maxHeight: "94vh" }}>
          <div style={{
            padding: "18px 24px 16px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 54, height: 54, borderRadius: 10,
                background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`,
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Hodinová rezervace
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", marginTop: 2 }}>
                  {room.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1 }}>
                  č. {room.number} · {room.capacity} · {room.size} m²
                </div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </div>

          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18, background: "var(--neutral-50)" }}>

            {/* 1 — date */}
            <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                1 · Datum příjezdu
              </div>
              <HQDayStrip value={day} onChange={setDay} />
            </section>

            {/* 2 — mode + interaction */}
            <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  2 · Čas a délka
                </div>
                <HQModeToggle value={mode} onChange={setMode} />
              </div>

              {mode === "duration" ? (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <HQDurationChips value={duration} onChange={setDuration} room={room} startQH={startQH} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Příjezd:</span>
                    <HQTimeSelect value={startQH} onChange={setStartQH} min={0} max={HQ_PERDAY - 1} />
                    <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
                      → odjezd <strong style={{ color: "var(--ink-1)" }}>{window.qhToLabel(selectedEndAbs)}</strong>
                      {selectedEndAbs >= HQ_PERDAY && <span style={{ color: "var(--ink-3)" }}> (následující den)</span>}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                  <HQTimePicker label="Příjezd" valueQH={startQH} onChange={(q) => { setStartQH(q); if (endQH <= q + 3) setEndQH(q + 8); }} min={0} max={HQ_PERDAY - 1} />
                  <HQTimePicker label="Odjezd" valueQH={endQH} onChange={setEndQH} min={startQH + 4} max={192} />
                </div>
              )}
            </section>

            {/* 3 — visual timeline */}
            <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Dostupnost pokoje
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--ink-3)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 14, height: 10, borderRadius: 2, background: "color-mix(in oklch, var(--accent) 6%, white)", border: "1px solid var(--border)" }} />
                    Volné
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 14, height: 10, borderRadius: 2, background: "repeating-linear-gradient(135deg, #B6BCC1 0 4px, #A6ACB1 4px 8px)" }} />
                    Obsazeno
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 14, height: 10, borderRadius: 2, background: "var(--brand)" }} />
                    Vaše rezervace
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <HQTimelineRow
                  dayIndex={0}
                  dayDate={day}
                  bookings={day0Bookings}
                  nowQH={isTodaySelected ? todayLabelQH : -1}
                  selStart={selDay0Start}
                  selEnd={selDay0End}
                  onSlotClick={handleSlotClick}
                  onSlotHover={handleSlotHover}
                  hoverQH={hoverDay0Start}
                  hoverEndQH={hoverDay0End}
                  duration={duration}
                  room={room}
                />
                {(crossesMidnight || mode === "range") && (
                  <HQTimelineRow
                    dayIndex={1}
                    dayDate={window.hAddDays(day, 1)}
                    bookings={day1Bookings}
                    nowQH={-1}
                    selStart={selDay1Start}
                    selEnd={selDay1End}
                    onSlotClick={(qh) => mode === "range" && setEndQH(qh + HQ_PERDAY)}
                    onSlotHover={() => {}}
                    hoverQH={hoverDay1Start}
                    hoverEndQH={hoverDay1End}
                    duration={duration}
                    room={room}
                  />
                )}
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
                <Icon name="check" size={11} color="var(--ink-3)" strokeWidth={2.2} /> Tip: Klikněte na volný úsek pro nastavení času příjezdu. Tmavší pásy 22:00–06:00 = noční tarif.
              </div>
            </section>

            {/* 4 — guests */}
            <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  3 · Hosté
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Maximální kapacita pokoje: {room.capacity}</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setGuests(Math.max(1, guests - 1))} style={hqQtyBtn}>−</button>
                <span style={{ minWidth: 28, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{guests}</span>
                <button onClick={() => setGuests(Math.min(3, guests + 1))} style={hqQtyBtn}>+</button>
              </div>
            </section>
          </div>
        </div>

        {/* Right summary */}
        <aside style={{
          background: "var(--neutral-50)", borderLeft: "1px solid var(--border)",
          padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>Souhrn</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, color: "var(--ink-1)" }}>
              <Row icon="bed">{room.name}</Row>
              <Row icon="calendar">{window.hFmtCzech(day)}{crossesMidnight && ` – ${window.hFmtCzech(window.hAddDays(day, 1))}`}</Row>
              <Row icon="clock">
                {window.qhToLabel(selectedStartAbs)}
                {" – "}
                {window.qhToLabel(selectedEndAbs)}
                {crossesMidnight && <span style={{ color: "var(--ink-3)", marginLeft: 4 }}>(přes půlnoc)</span>}
              </Row>
              <Row icon="check">{window.durationToLabel(selectedDuration)}</Row>
              <Row icon="users">{guests} {guests === 1 ? "host" : "hosté"}</Row>
            </div>
          </div>

          {!valid && (
            <div style={{
              padding: "10px 12px", borderRadius: 8,
              background: "#FFF1F1", border: "1px solid #F5C6C6",
              fontSize: 12.5, color: "#A6151D", lineHeight: 1.5,
            }}>
              <strong>Zvolený rozsah koliduje s rezervací.</strong> Posuňte čas příjezdu nebo zkraťte délku.
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)" }}>
              <span>Tarif {priced?.mode === "overnight" ? "přes noc" : `${window.durationToLabel(selectedDuration)}`}</span>
              <span>{priced ? priced.total.toLocaleString("cs-CZ") + " Kč" : "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Celkem</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
                {priced ? priced.total.toLocaleString("cs-CZ") + " Kč" : "—"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>včetně daní a poplatků</div>
          </div>

          <button
            disabled={!valid || !priced}
            onClick={() => onConfirm && onConfirm({
              room, day, startQH: selectedStartAbs, endQH: selectedEndAbs, guests,
              totalPrice: priced?.total, crossesMidnight,
            })}
            style={{
              appearance: "none", border: "none", cursor: (valid && priced) ? "pointer" : "not-allowed",
              background: (valid && priced) ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
              opacity: (valid && priced) ? 1 : 0.6,
              color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
              padding: "13px 16px", borderRadius: 8, letterSpacing: "0.01em",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            Rezervovat pokoj
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Storno zdarma 2 h předem
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Platba na recepci nebo online
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} /> Diskrétní check-in
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

const hqQtyBtn = {
  appearance: "none", cursor: "pointer", border: "1.5px solid var(--border)", background: "white",
  width: 32, height: 32, borderRadius: 8, color: "var(--ink-1)",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16,
};

function Row({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span>{children}</span>
    </div>
  );
}

function HQTimeSelect({ value, onChange, min, max }) {
  const opts = [];
  for (let q = min; q <= max; q++) opts.push(q);
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      style={{
        appearance: "none", border: "1.5px solid var(--border)", borderRadius: 8,
        padding: "7px 26px 7px 12px",
        fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
        color: "var(--ink-1)", background: "white", cursor: "pointer",
        backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
        backgroundPosition: "calc(100% - 12px) 50%, calc(100% - 7px) 50%",
        backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
      }}
    >
      {opts.map(q => <option key={q} value={q}>{window.qhToLabel(q)}</option>)}
    </select>
  );
}

window.HourlyDetailDialog = HourlyDetailDialog;
