// Month-chip date picker for LTR — opens as full-screen modal with sidebar summary
// Per user drawing: month chips with price (color-gradient cheap→expensive),
// move-in/move-out selectors with suggested first/last day, length quick-chips,
// rate variants shown BELOW after term is set.

const LTRM_MONTHS_NAMES = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const LTRM_MONTHS_SHORT = ["LED","ÚNO","BŘE","DUB","KVĚ","ČVN","ČVC","SRP","ZÁŘ","ŘÍJ","LIS","PRO"];
const LTRM_TODAY = new Date(2026, 4, 14);

function ltrmAddMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); r.setDate(1); return r; }
function ltrmKey(d) { return `${d.getFullYear()}-${d.getMonth()}`; }
function fmtLTRM(n) { return n.toLocaleString("cs-CZ"); }
function ltrmDaysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function ltrmDiffMonths(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1; }
function ltrmLast(d) { return new Date(d.getFullYear(), d.getMonth(), ltrmDaysInMonth(d)); }

// Heat color stops for cheap-to-expensive gradient
function priceHeatBg(factor) {
  // factor: 0.96 cheapest → 1.10 priciest
  // <=0.97 = pale green, 0.98-1.00 = neutral, 1.01-1.04 = warm, 1.05+ = strong warm
  if (factor <= 0.97) return { bg: "#E8F4EE", color: "#10623E" };
  if (factor <= 1.00) return { bg: "#F1F4F6", color: "var(--ink-1)" };
  if (factor <= 1.04) return { bg: "#FDECD8", color: "#7A4A0F" };
  if (factor <= 1.08) return { bg: "#FAD8B4", color: "#5C3309" };
  return { bg: "#F5B884", color: "#4A2806" };
}

function buildMonthList(room, count = 14) {
  // Start from this month, but skip if before room availableFrom
  const startView = ltrmAddMonths(LTRM_TODAY, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = ltrmAddMonths(startView, i);
    // Disable months in the past
    const past = d.getFullYear() < LTRM_TODAY.getFullYear() || (d.getFullYear() === LTRM_TODAY.getFullYear() && d.getMonth() < LTRM_TODAY.getMonth());
    const found = window.LTR_MONTHS?.find(x => x.month === d.getMonth() + 1) || { factor: 1.00 };
    return {
      date: d,
      key: ltrmKey(d),
      monthName: LTRM_MONTHS_SHORT[d.getMonth()],
      year: String(d.getFullYear()).slice(-2),
      factor: found.factor,
      monthlyPrice: Math.round(room.monthlyFrom * found.factor),
      past,
    };
  });
}

function MonthlyDatePickerDialog({ open, room, rate: initialRate, mode, onClose, onConfirm }) {
  const datesOnly = mode === "dates-only";
  const [moveInMonth, setMoveInMonth] = React.useState(null); // Date (first of month)
  const [moveOutMonth, setMoveOutMonth] = React.useState(null);
  const [moveInDay, setMoveInDay] = React.useState(1);
  const [moveOutDay, setMoveOutDay] = React.useState(null);
  const [length, setLength] = React.useState(null); // months
  const [selectedRate, setSelectedRate] = React.useState(null);
  const [breakdownOpen, setBreakdownOpen] = React.useState(false);
  const [hoverMonth, setHoverMonth] = React.useState(null);
  const [editingDay, setEditingDay] = React.useState(null); // "in" | "out" | null

  React.useEffect(() => {
    if (open) {
      setMoveInMonth(null);
      setMoveOutMonth(null);
      setMoveInDay(1);
      setMoveOutDay(null);
      setLength(null);
      setSelectedRate(null);
      setBreakdownOpen(false);
      setEditingDay(null);
    }
  }, [open, room?.id]);

  // Auto-select recommended rate when term is set (must be before any early return for hooks order)
  React.useEffect(() => {
    if (moveInMonth && moveOutMonth && !selectedRate && room?.rates?.length) {
      const recommended = room.rates.length > 1 ? room.rates[1] : room.rates[0];
      setSelectedRate(recommended);
    }
  }, [moveInMonth, moveOutMonth, room?.id]);

  if (!open || !room) return null;

  const monthList = buildMonthList(room, 14);

  // Pick a month chip
  const pickMonth = (m) => {
    if (m.past) return;
    if (!moveInMonth || (moveInMonth && moveOutMonth)) {
      setMoveInMonth(m.date); setMoveInDay(1);
      setMoveOutMonth(null); setMoveOutDay(null); setLength(null);
    } else if (m.date < moveInMonth) {
      setMoveInMonth(m.date); setMoveInDay(1);
    } else {
      setMoveOutMonth(m.date);
      setMoveOutDay(ltrmDaysInMonth(m.date));
      setLength(ltrmDiffMonths(moveInMonth, m.date));
    }
  };

  // Click on a length quick-chip
  const pickLength = (n) => {
    if (!moveInMonth) {
      // Default move-in = first available month
      const first = monthList.find(x => !x.past);
      if (!first) return;
      setMoveInMonth(first.date); setMoveInDay(1);
      const out = ltrmAddMonths(first.date, n - 1);
      setMoveOutMonth(out);
      setMoveOutDay(ltrmDaysInMonth(out));
      setLength(n);
      return;
    }
    const out = ltrmAddMonths(moveInMonth, n - 1);
    setMoveOutMonth(out);
    setMoveOutDay(ltrmDaysInMonth(out));
    setLength(n);
  };

  // Range highlight for chips
  const isInRange = (m) => {
    if (!moveInMonth) return false;
    const end = moveOutMonth || hoverMonth;
    if (!end) return ltrmKey(m.date) === ltrmKey(moveInMonth);
    return m.date >= moveInMonth && m.date <= end;
  };
  const isEdge = (m) => {
    if (moveInMonth && ltrmKey(m.date) === ltrmKey(moveInMonth)) return "in";
    if (moveOutMonth && ltrmKey(m.date) === ltrmKey(moveOutMonth)) return "out";
    return null;
  };

  // Range months for breakdown
  const rangeMonths = (moveInMonth && moveOutMonth) ? (() => {
    const list = [];
    let cur = new Date(moveInMonth);
    while (cur <= moveOutMonth) {
      const found = window.LTR_MONTHS?.find(x => x.month === cur.getMonth() + 1) || { factor: 1 };
      list.push({
        date: new Date(cur),
        label: `${LTRM_MONTHS_NAMES[cur.getMonth()]} ${cur.getFullYear()}`,
        monthly: Math.round((selectedRate?.monthly || room.monthlyFrom) * found.factor),
        factor: found.factor,
      });
      cur = ltrmAddMonths(cur, 1);
    }
    return list;
  })() : [];

  const rentMin = rangeMonths.length ? Math.min(...rangeMonths.map(m => m.monthly)) : null;
  const rentMax = rangeMonths.length ? Math.max(...rangeMonths.map(m => m.monthly)) : null;
  const rentTotal = rangeMonths.reduce((s, m) => s + m.monthly, 0);
  const grandTotal = rentTotal + (room.deposit || 0) + (room.bookingFee || 0);

  const hasTerm = moveInMonth && moveOutMonth;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: 14, width: "100%", maxWidth: 1120,
        maxHeight: "94vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px",
      }}>
        {/* Left: content */}
        <div style={{ overflowY: "auto", maxHeight: "94vh" }}>
          {/* Room header card */}
          <div style={{
            background: "white", padding: "18px 22px", borderBottom: "1px solid var(--border)",
            display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: 16, alignItems: "center",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 6, background: "#FFF7E6", color: "#7A4A0F",
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
              border: "1px solid #F2D88B",
            }}>
              <Icon name="info" size={11} strokeWidth={2.4} />
              Pro tebe drženo · 11:42
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                Vybraný byt
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.005em", marginTop: 2 }}>
                č. {room.number} · {room.name}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 6, color: "var(--ink-3)", fontSize: 12.5, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="bed" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.capacity} osob
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="size" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.size} m²
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="view" size={12} color="var(--ink-3)" strokeWidth={1.8} /> {room.floor}. patro
                </span>
              </div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </div>

          {/* When? */}
          <section style={{ padding: "20px 22px 22px" }}>
            <div style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "20px 22px",
            }}>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
                  margin: 0, letterSpacing: "-0.005em",
                }}>Kdy se nastěhuješ?</h2>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
                  Vyber měsíc nástupu a konce. Konkrétní dny v měsíci si můžeš upravit níže.
                </div>
              </div>

              {/* Month chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {monthList.map(m => {
                  const heat = priceHeatBg(m.factor);
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
                        width: 64,
                        border: edge
                          ? "2px solid var(--brand)"
                          : `1px solid ${inRange ? "var(--brand)" : "var(--border)"}`,
                        background: m.past
                          ? "var(--neutral-50)"
                          : (edge ? "var(--brand)" : (inRange ? "color-mix(in oklch, var(--brand) 86%, white)" : heat.bg)),
                        color: edge ? "white" : (inRange ? "white" : (m.past ? "var(--ink-4)" : heat.color)),
                        borderRadius: 8, padding: "8px 6px",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        fontFamily: "var(--font-ui)",
                        opacity: m.past ? 0.5 : 1,
                      }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em" }}>{m.monthName}</span>
                      <span style={{ fontSize: 9.5, opacity: 0.85 }}>'{m.year}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, marginTop: 1 }}>
                        {Math.round(m.monthlyPrice / 1000)}k
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Heat legend */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14, fontSize: 11.5, color: "var(--ink-3)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: "#E8F4EE" }} />
                  Nejlevnější
                </span>
                <span style={{ display: "inline-block", height: 8, width: 80, borderRadius: 4, background: "linear-gradient(90deg, #E8F4EE 0%, #F1F4F6 30%, #FDECD8 60%, #F5B884 100%)" }} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: "#F5B884" }} />
                  Nejdražší
                </span>
                <span style={{ marginLeft: "auto", color: "var(--ink-3)" }}>Najeď myší na měsíc pro detail</span>
              </div>

              {/* Day refinement */}
              {hasTerm && (
                <div style={{
                  marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)",
                  display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "stretch",
                }}>
                  <DayCell
                    label="Den nástupu"
                    date={new Date(moveInMonth.getFullYear(), moveInMonth.getMonth(), moveInDay)}
                    suggestion={moveInDay === 1}
                    hint="Doporučený den podle dostupnosti"
                    editing={editingDay === "in"}
                    onEdit={() => setEditingDay(editingDay === "in" ? null : "in")}
                    onPickDay={(d) => setMoveInDay(d)}
                    range={[1, ltrmDaysInMonth(moveInMonth)]}
                    current={moveInDay}
                  />
                  <div style={{ alignSelf: "center", color: "var(--ink-3)" }}>
                    <Icon name="chevron-right" size={16} strokeWidth={2.2} />
                  </div>
                  <DayCell
                    label="Den odjezdu"
                    date={new Date(moveOutMonth.getFullYear(), moveOutMonth.getMonth(), moveOutDay)}
                    suggestion={moveOutDay === ltrmDaysInMonth(moveOutMonth)}
                    hint="Poslední den vybraného měsíce"
                    editing={editingDay === "out"}
                    onEdit={() => setEditingDay(editingDay === "out" ? null : "out")}
                    onPickDay={(d) => setMoveOutDay(d)}
                    range={[1, ltrmDaysInMonth(moveOutMonth)]}
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
                  {[3, 6, 12, 24].map(n => {
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

          {/* Rate selection — only after term is set */}
          {hasTerm && !datesOnly && (
            <section style={{ padding: "0 22px 24px" }}>
              <div style={{
                background: "white", border: "1px solid var(--border)", borderRadius: 12,
                padding: "20px 22px",
              }}>
                <div style={{ marginBottom: 14 }}>
                  <h2 style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
                    margin: 0, letterSpacing: "-0.005em",
                  }}>Vyber sazbu</h2>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
                    Liší se podmínkami zrušení. Cena je za měsíc, vše vč. služeb.
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {room.rates.map((rate, idx) => {
                    const on = selectedRate?.id === rate.id;
                    const recommended = idx === 1 || (room.rates.length === 1 && idx === 0);
                    return (
                      <button key={rate.id} onClick={() => setSelectedRate(rate)} style={{
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
                                {idx === 0 ? "Bezplatné zrušení do 14 dnů před nástupem" : (idx === 1 ? "Storno 30 dnů před nástupem" : "Bez možnosti storna")}
                              </span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
                              od {fmtLTRM(rate.monthly)} Kč
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
              </div>
            </section>
          )}
        </div>

        {/* Right: sticky summary */}
        <aside style={{
          background: "white", borderLeft: "1px solid var(--border)",
          padding: "20px 22px", maxHeight: "94vh", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>Shrnutí rezervace</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{room.name}, Karlín</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
            <SumRow label="Nástup" value={moveInMonth ? `${moveInDay}. ${LTRM_MONTHS_NAMES[moveInMonth.getMonth()]} ${moveInMonth.getFullYear()}` : "—"} bold={!!moveInMonth} />
            <SumRow label="Konec" value={moveOutMonth ? `${moveOutDay}. ${LTRM_MONTHS_NAMES[moveOutMonth.getMonth()]} ${moveOutMonth.getFullYear()}` : "—"} bold={!!moveOutMonth} />
            <SumRow label="Délka" value={length ? `${length} ${length === 1 ? "měsíc" : length < 5 ? "měsíce" : "měsíců"}` : "—"} bold={!!length} />
            {!datesOnly && <SumRow label="Sazba" value={selectedRate ? selectedRate.name : (hasTerm ? "Vyber níže" : "—")} bold={!!selectedRate} />}
          </div>

          {/* Monthly rent box */}
          {hasTerm && (
            <div style={{
              padding: "14px 16px", background: "var(--neutral-50)", border: "1px solid var(--border-soft)", borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
                  Měsíční nájem
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                  {fmtLTRM(rentMin)} Kč{rentMax > rentMin && `–${fmtLTRM(rentMax)} Kč`} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)" }}>/ měs.</span>
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
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", maxHeight: 180, overflowY: "auto" }}>
                  {rangeMonths.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
                      <span style={{ color: "var(--ink-2)" }}>{m.label}{m.factor > 1.04 && " ❆"}</span>
                      <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{fmtLTRM(m.monthly)} Kč</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>Nájem celkem</span>
                    <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>{fmtLTRM(rentTotal)} Kč</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking fee */}
          <div style={{ padding: "12px 16px", background: "white", border: "1px solid var(--border-soft)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
                Rezervační poplatek
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                {fmtLTRM(room.bookingFee)} Kč
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>
              Jednorázové, hradí se nyní.
            </div>
          </div>

          {/* Deposit */}
          <div style={{ padding: "12px 16px", background: "white", border: "1px solid var(--border-soft)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>
                Vratná kauce
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                {fmtLTRM(room.deposit)} Kč
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>
              Vratná po skončení nájmu. Hradí se 7 dní před nástupem.
            </div>
          </div>

          <button
            disabled={datesOnly ? !hasTerm : (!hasTerm || !selectedRate)}
            onClick={() => onConfirm && onConfirm({ moveInMonth, moveOutMonth, moveInDay, moveOutDay, length, rate: selectedRate })}
            style={{
              appearance: "none", border: "none",
              cursor: (datesOnly ? hasTerm : (hasTerm && selectedRate)) ? "pointer" : "not-allowed",
              background: (datesOnly ? hasTerm : (hasTerm && selectedRate)) ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
              opacity: (datesOnly ? hasTerm : (hasTerm && selectedRate)) ? 1 : 0.6,
              color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
              padding: "14px 18px", borderRadius: 10, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 160ms ease",
            }}>
            {datesOnly ? "Použít termín" : "Pokračovat"}
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>

          <div style={{
            padding: "10px 14px", background: "var(--accent-tint)", borderRadius: 8,
            display: "flex", alignItems: "flex-start", gap: 8,
            fontSize: 12, color: "var(--accent-dark)", lineHeight: 1.5,
          }}>
            <Icon name="check" size={14} color="var(--accent-dark)" strokeWidth={2.4} />
            <span><strong>Garance nejlepší ceny.</strong> Cenu ti zafixujeme po dokončení rezervace. Nyní platíš pouze rezervační poplatek.</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 11, color: "var(--ink-3)", marginTop: -4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="check" size={11} color="var(--accent)" strokeWidth={2.4} /> SSL šifrováno
            </span>
            <span>★ 4,9 z 2 318 nájmů</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SumRow({ label, value, bold }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{label}</span>
      <span style={{
        fontSize: 13, color: bold ? "var(--ink-1)" : "var(--ink-3)", fontWeight: bold ? 700 : 500,
        textAlign: "right",
      }}>{value}</span>
    </div>
  );
}

function DayCell({ label, date, suggestion, hint, editing, onEdit, onPickDay, range, current }) {
  // Mock per-day availability for the visible month (deterministic):
  // small bands of restrictions to demo coloring like standard IBE.
  const dayState = (d) => {
    if (d < 1) return null;
    const totalKey = `${date.getFullYear()}-${date.getMonth()}-${d}-${label}`;
    let h = 0; for (let i = 0; i < totalKey.length; i++) h = (h * 31 + totalKey.charCodeAt(i)) >>> 0;
    const m = h % 20;
    if (m === 0) return "soldOut";
    if (m === 1 || m === 2) return "restricted";
    return "available";
  };

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
        {date.getDate()}. {LTRM_MONTHS_NAMES[date.getMonth()]} {date.getFullYear()}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{hint}</div>
      {editing && (
        <>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: range[1] }, (_, i) => i + 1).map(d => {
              const state = dayState(d);
              const on = d === current;
              const disabled = state === "soldOut";
              let bg = "white", color = "var(--ink-1)", border = "1px solid var(--border)";
              if (state === "soldOut") { bg = "white"; color = "#E73737"; border = "1px solid var(--border)"; }
              else if (state === "restricted") { bg = "#FFF7E6"; color = "#7A4A0F"; border = "1px solid #F2D88B"; }
              if (on) { bg = "var(--ink-1)"; color = "white"; border = "1px solid var(--ink-1)"; }
              return (
                <button key={d} disabled={disabled} onClick={() => !disabled && onPickDay(d)} style={{
                  appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
                  height: 30, borderRadius: 5, border, background: bg, color,
                  fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: on ? 700 : 600,
                  padding: 0, position: "relative",
                  textDecoration: state === "soldOut" ? "line-through" : "none",
                  opacity: state === "soldOut" ? 0.6 : 1,
                }}>{d}</button>
              );
            })}
          </div>
          <div style={{
            marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            fontSize: 10.5, color: "var(--ink-3)",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "white", border: "1px solid var(--border)" }} /> Volý
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--ink-1)" }} /> Vybrán
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#FFF7E6", border: "1px solid #F2D88B" }} /> S omezením
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "white", border: "1px solid var(--border)", color: "#E73737", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>×</span> Vyprodáno
            </span>
          </div>
        </>
      )}
    </div>
  );
}

window.MonthlyDatePickerDialog = MonthlyDatePickerDialog;
