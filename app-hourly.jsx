// Hourly hotels — pick room (cards). Uses HOURLY_ROOMS + HourlyDetailDialog.

const TWEAK_DEFAULTS_H = /*EDITMODE-BEGIN*/{
  "defaultMode": "duration",
  "showHero": true,
  "stickyHeader": true,
  "columns": 3,
  "compactTimelineOnCard": true
}/*EDITMODE-END*/;

function fmtH(n) { return n.toLocaleString("cs-CZ"); }

// ─── Top nav adapted: hourly is its own segment ──────────────────────────────
function HourlyTopNav() {
  return (
    <nav style={{
      height: 60, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <a href="Hourly-Pick-Room.html" style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        textDecoration: "none",
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }} />
        Hotel Balický
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 22 }}>
        <a href="Hourly-Pick-Room.html" style={{
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
          color: "var(--ink-1)", textDecoration: "none", padding: "8px 12px", borderRadius: 6, position: "relative",
        }}>
          Hodinová rezervace
          <span style={{ position: "absolute", left: 12, right: 12, bottom: -19, height: 2, background: "var(--brand)" }} />
        </a>
        <a href="Pick-Room-Grid-View.html" style={{
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
          color: "var(--ink-3)", textDecoration: "none", padding: "8px 12px", borderRadius: 6,
        }}>
          Standardní pobyt
        </a>
        <a href="Wellness-Booking.html" style={{
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
          color: "var(--ink-3)", textDecoration: "none", padding: "8px 12px", borderRadius: 6,
        }}>
          Wellness
        </a>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <button style={{
          appearance: "none", cursor: "pointer", background: "white",
          border: "1px solid var(--border)", borderRadius: 6,
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
          padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          🇨🇿 CS · CZK
          <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
        </button>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
          padding: "7px 12px", borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="users" size={14} strokeWidth={1.8} color="var(--ink-2)" />
          Přihlásit
        </button>
      </div>
    </nav>
  );
}

// ─── Custom hourly search bar ────────────────────────────────────────────────
function HourlySearchBar({ value, onChange, mode, onModeChange }) {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onDocClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpenDropdown(null); }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const day = value.day;
  const startQH = value.startQH;
  const duration = value.duration;
  const endQH = value.endQH;
  const guests = value.guests;

  const computedEnd = mode === "duration" ? startQH + duration : endQH;
  const crossesMidnight = computedEnd > 96;

  const Field = ({ id, icon, label, primary, secondary, active, width }) => (
    <button onClick={() => setOpenDropdown(openDropdown === id ? null : id)} style={{
      appearance: "none", textAlign: "left",
      background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
      border: "none", cursor: "pointer",
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
      borderRight: "1px solid var(--border)",
      borderBottom: active ? "2px solid var(--brand)" : "2px solid transparent",
      marginBottom: active ? -2 : 0,
      minWidth: width,
    }}>
      <Icon name={icon} size={18} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)",
        }}>{label}</div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
          color: "var(--ink-1)", lineHeight: 1.25, marginTop: 1, whiteSpace: "nowrap",
        }}>
          {primary}
          {secondary && <span style={{ color: "var(--ink-3)", marginLeft: 5, fontWeight: 500 }}>· {secondary}</span>}
        </div>
      </div>
    </button>
  );

  const dayLabel = window.hSameDay(day, window.HOURLY_TODAY) ? "Dnes" :
    window.hSameDay(day, window.hAddDays(window.HOURLY_TODAY, 1)) ? "Zítra" :
    window.hFmtCzech(day);
  const daySecondary = window.hSameDay(day, window.HOURLY_TODAY) || window.hSameDay(day, window.hAddDays(window.HOURLY_TODAY, 1)) ? `${day.getDate()}.${day.getMonth() + 1}.` : null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{
        background: "white", borderRadius: 10, border: "1px solid var(--border)",
        boxShadow: "0 2px 10px rgba(16,24,40,.05)",
        display: "grid",
        gridTemplateColumns: mode === "duration" ? "1.2fr 1.1fr 1.1fr 1fr auto" : "1.2fr 1.1fr 1.1fr 1fr auto",
        alignItems: "stretch", overflow: "hidden",
      }}>
        <Field id="date" icon="calendar" label="Datum" primary={dayLabel} secondary={daySecondary} active={openDropdown === "date"} />
        {mode === "duration" ? (
          <>
            <Field id="time" icon="clock" label="Příjezd" primary={window.qhToLabel(startQH)} active={openDropdown === "time"} />
            <Field id="duration" icon="check" label="Délka pobytu" primary={window.durationToLabel(duration)} secondary={crossesMidnight ? `do ${window.qhToLabel(computedEnd)} ⁺` : `do ${window.qhToLabel(computedEnd)}`} active={openDropdown === "duration"} />
          </>
        ) : (
          <>
            <Field id="time" icon="clock" label="Od" primary={window.qhToLabel(startQH)} active={openDropdown === "time"} />
            <Field id="duration" icon="clock" label="Do" primary={endQH >= 96 ? `${window.qhToLabel(endQH)} ⁺` : window.qhToLabel(endQH)} secondary={window.durationToLabel(computedEnd - startQH)} active={openDropdown === "duration"} />
          </>
        )}
        <Field id="guests" icon="users" label="Hosté" primary={`${guests} ${guests === 1 ? "host" : "hosté"}`} active={openDropdown === "guests"} />
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

      {/* Mode strip — sits below as a subtle row, no visual chrome competing */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span style={{ fontWeight: 600 }}>Způsob výběru:</span>
          <div style={{ display: "inline-flex", padding: 2, background: "white", border: "1px solid var(--border)", borderRadius: 8, gap: 2 }}>
            {[
              { id: "duration", label: "Příjezd + délka" },
              { id: "range", label: "Od – do" },
            ].map(o => {
              const on = mode === o.id;
              return (
                <button key={o.id} onClick={() => onModeChange(o.id)} style={{
                  appearance: "none", cursor: "pointer",
                  background: on ? "var(--ink-1)" : "transparent",
                  color: on ? "white" : "var(--ink-3)",
                  border: "none",
                  fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
                  padding: "5px 10px", borderRadius: 6,
                }}>{o.label}</button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
            Min. 1 hodina · krok 15 minut
          </span>
          {crossesMidnight && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", fontWeight: 600 }}>
              <Icon name="check" size={12} color="var(--brand)" strokeWidth={2.4} />
              Rezervace přes půlnoc
            </span>
          )}
        </div>
      </div>

      {/* Inline dropdowns */}
      {openDropdown === "date" && (
        <HourlyDateDropdown value={day} onChange={(d) => { onChange({ ...value, day: d }); setOpenDropdown(null); }} onClose={() => setOpenDropdown(null)} />
      )}
      {openDropdown === "time" && (
        <HourlyTimeDropdown
          label="Příjezd"
          valueQH={startQH}
          onChange={(q) => { onChange({ ...value, startQH: q, endQH: Math.max(endQH, q + 4) }); setOpenDropdown(null); }}
          onClose={() => setOpenDropdown(null)}
        />
      )}
      {openDropdown === "duration" && mode === "duration" && (
        <HourlyDurationDropdown value={duration} onChange={(d) => { onChange({ ...value, duration: d }); setOpenDropdown(null); }} onClose={() => setOpenDropdown(null)} />
      )}
      {openDropdown === "duration" && mode === "range" && (
        <HourlyTimeDropdown
          label="Odjezd"
          valueQH={endQH}
          maxQH={192}
          minQH={startQH + 4}
          onChange={(q) => { onChange({ ...value, endQH: q }); setOpenDropdown(null); }}
          onClose={() => setOpenDropdown(null)}
          showTomorrow
        />
      )}
      {openDropdown === "guests" && (
        <HourlyGuestsDropdown value={guests} onChange={(g) => onChange({ ...value, guests: g })} onClose={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}

// ─── Dropdowns for the search bar ────────────────────────────────────────────
function DD({ children, width = 360, align = "left" }) {
  const alignStyle = align === "right" ? { right: 0 } : { left: 0 };
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 8px)", ...alignStyle, zIndex: 200,
      width, background: "white", borderRadius: 12,
      boxShadow: "0 18px 60px rgba(15,18,22,0.18)", border: "1px solid var(--border)",
      padding: 16,
    }}>{children}</div>
  );
}

function HourlyDateDropdown({ value, onChange }) {
  const days = Array.from({ length: 21 }, (_, i) => window.hAddDays(window.HOURLY_TODAY, i));
  return (
    <DD width={420}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
        Vyberte datum příjezdu
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {days.map((d, i) => {
          const active = window.hSameDay(value, d);
          return (
            <button key={i} onClick={() => onChange(d)} style={{
              appearance: "none", cursor: "pointer",
              border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
              background: active ? "var(--brand)" : "white",
              color: active ? "white" : "var(--ink-1)",
              borderRadius: 8, padding: "7px 0",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              fontFamily: "var(--font-ui)",
            }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", opacity: active ? 0.9 : 0.55, textTransform: "uppercase" }}>
                {window.H_WEEKDAYS[(d.getDay() + 6) % 7]}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{d.getDate()}.</span>
              <span style={{ fontSize: 9.5, opacity: active ? 0.85 : 0.5 }}>{window.H_MONTHS[d.getMonth()].slice(0, 3)}.</span>
            </button>
          );
        })}
      </div>
    </DD>
  );
}

function HourlyTimeDropdown({ label, valueQH, onChange, minQH = 0, maxQH = 95, showTomorrow = false }) {
  // 24 hours of 15-min slots — render as 24 rows of 4 slots
  const groups = [];
  for (let h = 0; h < 24; h++) {
    const slots = [];
    for (let q = 0; q < 4; q++) {
      const qh = h * 4 + q;
      slots.push(qh);
    }
    groups.push({ h, slots });
  }
  return (
    <DD width={360}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
        {label} — vyberte čas
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, paddingRight: 4 }}>
        {groups.map(g => (
          <div key={g.h} style={{ display: "grid", gridTemplateColumns: "44px repeat(4, 1fr)", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>{String(g.h).padStart(2, "0")}:00</span>
            {g.slots.map(qh => {
              const disabled = qh < minQH || qh > maxQH;
              const on = valueQH === qh || (showTomorrow && valueQH === qh + 96);
              return (
                <button key={qh} disabled={disabled} onClick={() => onChange(qh)} style={{
                  appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
                  border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "var(--brand)" : "white",
                  color: on ? "white" : (disabled ? "var(--ink-4)" : "var(--ink-1)"),
                  fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600,
                  padding: "5px 0", borderRadius: 6,
                  opacity: disabled ? 0.4 : 1,
                }}>
                  :{String((qh % 4) * 15).padStart(2, "0")}
                </button>
              );
            })}
          </div>
        ))}
        {showTomorrow && (
          <>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border)", fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>
              Následující den
            </div>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(h => (
              <div key={h} style={{ display: "grid", gridTemplateColumns: "44px repeat(4, 1fr)", gap: 6, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>{String(h).padStart(2, "0")}:00⁺</span>
                {[0, 1, 2, 3].map(q => {
                  const qh = 96 + h * 4 + q;
                  const on = valueQH === qh;
                  return (
                    <button key={qh} onClick={() => onChange(qh)} style={{
                      appearance: "none", cursor: "pointer",
                      border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
                      background: on ? "var(--brand)" : "white",
                      color: on ? "white" : "var(--ink-1)",
                      fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600,
                      padding: "5px 0", borderRadius: 6,
                    }}>:{String(q * 15).padStart(2, "0")}</button>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </DD>
  );
}

function HourlyDurationDropdown({ value, onChange }) {
  const presets = [
    { qh: 4, label: "1 hodina" },
    { qh: 6, label: "1,5 hodiny" },
    { qh: 8, label: "2 hodiny", common: true },
    { qh: 10, label: "2,5 hodiny" },
    { qh: 12, label: "3 hodiny" },
    { qh: 16, label: "4 hodiny" },
    { qh: 20, label: "5 hodin" },
    { qh: 24, label: "6 hodin" },
    { qh: 32, label: "8 hodin" },
    { qh: 40, label: "10 hodin" },
    { qh: 48, label: "Přes noc (12 h)", overnight: true },
  ];
  return (
    <DD width={300}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
        Délka pobytu
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {presets.map(p => {
          const on = value === p.qh;
          return (
            <button key={p.qh} onClick={() => onChange(p.qh)} style={{
              appearance: "none", cursor: "pointer", textAlign: "left",
              border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 6%, white)" : "white",
              color: "var(--ink-1)", padding: "9px 12px", borderRadius: 8,
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {p.label}
                {p.common && (
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                    color: "var(--brand)", background: "color-mix(in oklch, var(--brand) 8%, white)",
                    padding: "2px 6px", borderRadius: 4,
                  }}>Nejčastější</span>
                )}
                {p.overnight && (
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                    color: "var(--ink-3)", background: "var(--neutral-100)", padding: "2px 6px", borderRadius: 4,
                  }}>Výhodné</span>
                )}
              </span>
              {on && <Icon name="check" size={14} color="var(--brand)" strokeWidth={2.6} />}
            </button>
          );
        })}
      </div>
    </DD>
  );
}

function HourlyGuestsDropdown({ value, onChange }) {
  return (
    <DD width={300} align="right">
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
        Hosté
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Dospělí</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Pokoje pro 1–3 osoby</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => onChange(Math.max(1, value - 1))} style={hqQtyBtn2}>−</button>
          <span style={{ minWidth: 24, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{value}</span>
          <button onClick={() => onChange(Math.min(3, value + 1))} style={hqQtyBtn2}>+</button>
        </div>
      </div>
    </DD>
  );
}

const hqQtyBtn2 = {
  appearance: "none", cursor: "pointer", border: "1.5px solid var(--border)", background: "white",
  width: 30, height: 30, borderRadius: 8, color: "var(--ink-1)",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16,
};

// ─── Compact card-level availability strip ──────────────────────────────────
// Shows the room's 24h day-0 timeline as a thin band, with the user's currently
// configured window highlighted in brand colour.
function CompactTimeline({ room, day, startQH, endQH }) {
  const bookings = window.bookingsFor(room).filter(b => b.startQH < 96).map(b => ({ startQH: b.startQH, endQH: Math.min(b.endQH, 96) }));
  // Project user's selection onto today
  const selStart = startQH < 96 ? startQH : null;
  const selEnd = startQH < 96 ? Math.min(endQH, 96) : null;
  const isToday = window.hSameDay(day, window.HOURLY_TODAY);
  const nowQH = isToday ? window.HOURLY_NOW_QH : -1;
  const fitsUser = startQH < 96 && endQH <= 96
    ? window.isRangeFree(room, startQH, endQH)
    : null;

  return (
    <div>
      {/* hour labels */}
      <div style={{ position: "relative", height: 12, marginBottom: 2 }}>
        {[0, 6, 12, 18, 24].map(h => (
          <span key={h} style={{
            position: "absolute", left: `${(h / 24) * 100}%`, transform: "translateX(-50%)",
            fontSize: 9.5, fontWeight: 600, color: "var(--ink-3)",
          }}>{String(h).padStart(2, "0")}</span>
        ))}
      </div>
      {/* band */}
      <div style={{
        position: "relative", height: 26, borderRadius: 6,
        background: "color-mix(in oklch, var(--accent) 6%, white)",
        border: "1px solid var(--border)", overflow: "hidden",
      }}>
        {/* night bands */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "25%", background: "color-mix(in oklch, var(--ink-1) 6%, transparent)" }} />
        <div style={{ position: "absolute", left: `${(22 / 24) * 100}%`, top: 0, bottom: 0, right: 0, background: "color-mix(in oklch, var(--ink-1) 6%, transparent)" }} />
        {/* gridlines */}
        {[6, 12, 18].map(h => (
          <div key={h} style={{ position: "absolute", top: 0, bottom: 0, left: `${(h / 24) * 100}%`, width: 1, background: "color-mix(in oklch, var(--ink-1) 10%, transparent)" }} />
        ))}
        {/* bookings */}
        {bookings.map((b, i) => (
          <div key={i} style={{
            position: "absolute", top: 3, bottom: 3,
            left: `${(b.startQH / 96) * 100}%`,
            width: `${((b.endQH - b.startQH) / 96) * 100}%`,
            background: "repeating-linear-gradient(135deg, #B6BCC1 0 4px, #A6ACB1 4px 8px)",
            borderRadius: 3,
          }} />
        ))}
        {/* now line */}
        {nowQH > 0 && (
          <div style={{
            position: "absolute", top: -2, bottom: -2,
            left: `${(nowQH / 96) * 100}%`, width: 2,
            background: "var(--brand)",
          }} />
        )}
        {/* user selection */}
        {selStart != null && selEnd != null && selEnd > selStart && (
          <div style={{
            position: "absolute", top: 3, bottom: 3,
            left: `${(selStart / 96) * 100}%`,
            width: `${((selEnd - selStart) / 96) * 100}%`,
            background: fitsUser ? "var(--brand)" : "#A6151D",
            borderRadius: 3,
            boxShadow: "0 1px 4px rgba(85,1,115,.3)",
          }} />
        )}
      </div>
    </div>
  );
}

// ─── Room card ───────────────────────────────────────────────────────────────
function HourlyRoomCard({ room, search, onPick, selection }) {
  const computedEnd = search.mode === "duration" ? search.startQH + search.duration : search.endQH;
  const priced = window.priceForRoom(room, search.startQH, computedEnd);
  const fits = window.isRangeFree(room, search.startQH, computedEnd);
  const selected = !!selection;

  return (
    <article style={{
      background: "white", border: `1.5px solid ${selected ? "var(--brand)" : "var(--border)"}`,
      borderRadius: 12, overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 160ms ease, transform 160ms ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(16,24,40,.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      {/* Image */}
      <div style={{
        position: "relative", aspectRatio: "16 / 10",
        background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`,
      }}>
        <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6 }}>
          {room.tags.slice(0, 2).map(tg => (
            <span key={tg} style={{
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.05em", textTransform: "uppercase",
              color: "var(--ink-1)", background: "rgba(255,255,255,0.94)",
              padding: "4px 8px", borderRadius: 4,
            }}>{tg}</span>
          ))}
        </div>
        {room.remaining && room.remaining <= 2 && (
          <div style={{
            position: "absolute", right: 10, top: 10,
            display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px",
            background: "rgba(166,21,29,0.95)", borderRadius: 6,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5, color: "white",
          }}>
            <Icon name="flame" size={11} strokeWidth={2.4} />
            Poslední {room.remaining}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
            margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
          }}>{room.name}</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>č. {room.number}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", color: "var(--ink-2)", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="person" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.capacity}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="size" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.size} m²
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="bed" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.beds}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
          <span>Dostupnost ({window.hSameDay(search.day, window.HOURLY_TODAY) ? "dnes" : window.hFmtCzech(search.day)})</span>
          {!fits && <span style={{ color: "#A6151D", textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>Váš čas obsazen</span>}
        </div>
        <CompactTimeline room={room} day={search.day} startQH={search.startQH} endQH={computedEnd} />
      </div>

      {/* Price + CTA */}
      <div style={{
        padding: "12px 16px 14px", borderTop: "1px solid var(--border)",
        background: selected ? "var(--accent-tint)" : "color-mix(in oklch, var(--brand) 2%, white)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1 }}>
            Cena za {window.durationToLabel(computedEnd - search.startQH)}
            {priced?.mode === "overnight" && " (přes noc)"}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
            lineHeight: 1.1, letterSpacing: "-0.01em", marginTop: 2,
          }}>
            {priced ? fmtH(priced.total) : "—"} <span style={{ fontSize: 13, fontWeight: 600 }}>Kč</span>
          </div>
          <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 1 }}>
            od {fmtH(room.pricing.base)} Kč / 2 h
          </div>
        </div>
        <button onClick={() => onPick(room)} style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: selected ? "var(--ink-1)" : "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
          padding: "11px 14px", borderRadius: 8, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
        }}>
          {selected ? <><Icon name="check" size={13} strokeWidth={2.6} /> Vybráno</> : <>Vybrat termín <Icon name="chevron-right" size={14} strokeWidth={2.4} /></>}
        </button>
      </div>
    </article>
  );
}

// ─── Hero strip ──────────────────────────────────────────────────────────────
function HourlyHero() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
      padding: "16px 22px", borderRadius: 12, marginBottom: 16,
      background: "color-mix(in oklch, var(--brand) 5%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
    }}>
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--brand)",
          padding: "3px 9px", background: "white",
          border: "1px solid color-mix(in oklch, var(--brand) 18%, white)",
          borderRadius: 4, marginBottom: 8,
        }}>
          <Icon name="clock" size={12} strokeWidth={2.2} />
          Hodinová rezervace
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.005em", lineHeight: 1.2,
        }}>
          Pokoj na pár hodin — od 1 hodiny, po čtvrthodinách
        </h1>
        <div style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 5, maxWidth: 600, lineHeight: 1.5 }}>
          Vyberte si pokoj, čas příjezdu a délku pobytu. Rezervace přes půlnoc i v noci jsou možné.
          Diskrétní check-in, platba na recepci.
        </div>
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--ink-2)",
        background: "white", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", minWidth: 220,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
          Storno zdarma 2 h předem
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
          Diskrétní check-in
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
          Platba kartou nebo hotově
        </span>
      </div>
    </div>
  );
}

// ─── Reservation bar (cart) ──────────────────────────────────────────────────
function HourlyCart({ items, onClear }) {
  if (!items.length) return null;
  const total = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
  return (
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
            {items.length} {items.length === 1 ? "pokoj" : items.length < 5 ? "pokoje" : "pokojů"} v rezervaci
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {items.map((it, i) => (
              <span key={i}>
                {i > 0 ? " · " : ""}
                {it.room.name} · {window.hFmtCzech(it.day)} {window.qhToLabel(it.startQH)}–{window.qhToLabel(it.endQH)}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onClear} style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
          padding: "10px 14px", borderRadius: 6, cursor: "pointer",
        }}>Vyprázdnit</button>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Celkem</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
            {fmtH(total)} Kč
          </div>
        </div>
        <a href="Checkout.html" style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "13px 24px", borderRadius: 6, letterSpacing: "0.02em",
          textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Pokračovat
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

// ─── Main app ────────────────────────────────────────────────────────────────
function AppH() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_H);
  const [mode, setMode] = React.useState(t.defaultMode || "duration");
  const [search, setSearch] = React.useState({
    day: window.HOURLY_TODAY,
    startQH: 64,   // 16:00
    duration: 8,   // 2h
    endQH: 72,     // 18:00
    guests: 2,
  });
  const [picker, setPicker] = React.useState(null);
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => { setMode(t.defaultMode); }, [t.defaultMode]);

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const searchWithMode = { ...search, mode };

  function onCardPick(room) {
    setPicker(room);
  }

  function onDialogConfirm(item) {
    setCart(c => [...c, item]);
    setPicker(null);
  }

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
      paddingBottom: cart.length ? 96 : 0,
    }}>
      <HourlyTopNav />

      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Hodinová rezervace</span>
          </div>
          <HourlySearchBar value={search} onChange={setSearch} mode={mode} onModeChange={setMode} />
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px 80px" }}>
        {t.showHero && <HourlyHero />}

        {/* Results header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--border)",
          gap: 16, flexWrap: "wrap",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
              margin: 0, letterSpacing: "-0.005em",
            }}>Dostupné pokoje · {window.HOURLY_ROOMS.length}</h2>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
              {window.hFmtCzech(search.day)} · {window.qhToLabel(search.startQH)}–{window.qhToLabel(mode === "duration" ? search.startQH + search.duration : search.endQH)}
              {" · "}
              {window.durationToLabel((mode === "duration" ? search.duration : search.endQH - search.startQH))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                <option>Cena (od nejvyšší)</option>
                <option>Velikost pokoje</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${t.columns}, minmax(0, 1fr))`,
          gap: 16,
        }}>
          {window.HOURLY_ROOMS.map(room => (
            <HourlyRoomCard
              key={room.id}
              room={room}
              search={searchWithMode}
              onPick={onCardPick}
              selection={cart.find(c => c.room.id === room.id)}
            />
          ))}
        </div>

        {/* Trust strip */}
        <div style={{
          marginTop: 28, padding: "20px 22px", borderRadius: 12,
          background: "white", border: "1px solid var(--border)",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18,
        }}>
          {[
            { icon: "clock", title: "Po čtvrthodinách", desc: "Plánujte přesně podle svého programu." },
            { icon: "check", title: "Storno zdarma", desc: "Můžete zrušit až 2 hodiny před příjezdem." },
            { icon: "person", title: "Diskrétní check-in", desc: "Soukromý vstup, bez čekání u recepce." },
            { icon: "voucher", title: "Pružné platby", desc: "Kartou, hotově, nebo voucherem." },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: "color-mix(in oklch, var(--brand) 8%, white)",
                color: "var(--brand)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name={t.icon} size={18} strokeWidth={1.8} />
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <PickRoomFooter />
      </main>

      <HourlyCart items={cart} onClear={() => setCart([])} />

      <window.HourlyDetailDialog
        open={!!picker}
        room={picker}
        defaultMode={mode}
        onClose={() => setPicker(null)}
        onConfirm={onDialogConfirm}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Marketing hero" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
          <TweakRadio label="Sloupce karet" value={t.columns} onChange={v => setTweak("columns", v)} options={[
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
          ]} />
        </TweakSection>
        <TweakSection label="Výběr času">
          <TweakRadio label="Výchozí režim" value={t.defaultMode} onChange={v => setTweak("defaultMode", v)} options={[
            { value: "duration", label: "Příjezd + délka" },
            { value: "range", label: "Od – do" },
          ]} />
          <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5, marginTop: 6 }}>
            "Příjezd + délka" je rychlejší pro nejčastější rezervaci 2 h. "Od – do" se hodí
            pro pobyty přes půlnoc (např. 22:00 → 02:00).
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppH />);
