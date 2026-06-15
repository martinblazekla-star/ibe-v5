// Date utility helpers
const MONTH_NAMES = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
const MONTH_GENITIVE = ["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince"];
const WEEKDAYS = ["po","út","st","čt","pá","so","ne"];

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function addMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function isSameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function diffDays(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
function fmtCzech(d) { return `${d.getDate()}. ${MONTH_GENITIVE[d.getMonth()]}`; }
function fmtShort(d) { return `${WEEKDAYS[(d.getDay()+6)%7]}. ${d.getDate()}. ${d.getMonth()+1}.`; }
function dKey(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

const TODAY = new Date(2026, 4, 14);

// ─────────────────── Mock availability ───────────────────

// Per-day pricing + state. State: available | soldOut | closeToArrival | closeToDeparture | minStay2
const AVAILABILITY_OVERRIDES = {
  // sold out batches
  "2026-4-26": { state: "soldOut" }, "2026-4-27": { state: "soldOut" },
  "2026-5-15": { state: "soldOut" }, "2026-5-16": { state: "soldOut" },
  // close to arrival / departure
  "2026-4-23": { state: "closeToArrival", text: "V tento den nelze přijet. Lze proto­jen projet nebo odjet." },
  "2026-5-28": { state: "closeToDeparture", text: "V tento den nelze odjet. Vyberte odjezd o den dříve nebo později." },
  // min stay
  "2026-4-30": { state: "minStay2", text: "Minimální délka pobytu je 2 noci." },
  "2026-5-1": { state: "minStay2", text: "Minimální délka pobytu je 2 noci." },
  "2026-5-8": { state: "minStay2", text: "Minimální délka pobytu je 2 noci." },
};

function getPrice(date) {
  const day = date.getDay();
  const weekend = (day === 5 || day === 6) ? 900 : (day === 0 ? 400 : 0);
  const base = 2200 + weekend;
  // Late May / early June slightly pricier
  if (date.getMonth() === 5) return base + 300;
  return base;
}

function getAvailability(date) {
  const today = startOfDay(TODAY);
  if (date < today) return { state: "past" };
  const k = dKey(date);
  if (AVAILABILITY_OVERRIDES[k]) return { ...AVAILABILITY_OVERRIDES[k], price: getPrice(date) };
  return { state: "available", price: getPrice(date) };
}

// ─────────────────── Dropdown shell ───────────────────

function Dropdown({ open, onClose, children, width = 720, align = "left", anchorStyle = null }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  // anchorStyle (explicit left/right px) wins over the coarse align keyword,
  // so a dropdown can be pinned under the exact field that triggered it.
  const alignStyle = anchorStyle
    ? anchorStyle
    : align === "right" ? { right: 0 } : align === "center" ? { left: "50%", transform: "translateX(-50%)" } : { left: 0 };
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "transparent" }} />
      <div style={{
        position: "absolute", top: "calc(100% + 8px)", zIndex: 81,
        width, maxWidth: "calc(100vw - 64px)", ...alignStyle,
        background: "white", border: "1px solid var(--border)", borderRadius: 12,
        boxShadow: "0 20px 50px rgba(15,18,22,.18)", overflow: "visible",
      }}>{children}</div>
    </>
  );
}

window.Dropdown = Dropdown;

// ─────────────────── Date Tile ───────────────────

const TILE_W = 72;
const TILE_H = 76;

function DateTile({ date, state, price, selected, isStart, isEnd, inRange, isToday, restrictionText, onClick, onMouseEnter, onMouseLeave }) {
  const disabled = state === "past" || state === "soldOut";

  let bg = "transparent", border = "1px solid transparent", numColor = "var(--ink-1)", priceColor = "var(--ink-3)", numWeight = 600, deco = "none";
  let priceText = price ? `od ${price.toLocaleString("cs-CZ")} Kč` : "";

  if (state === "past") {
    numColor = "var(--ink-4)"; priceColor = "var(--ink-4)"; deco = "line-through";
    priceText = "";
  } else if (state === "soldOut") {
    bg = "white"; numColor = "#E73737"; priceColor = "#E73737"; priceText = "vyprodáno";
    deco = "line-through";
  } else if (state === "closeToArrival" || state === "closeToDeparture" || state === "minStay2") {
    bg = "white"; border = "1px dashed var(--border)"; numColor = "var(--ink-1)"; priceColor = "var(--ink-3)";
  } else if (state === "available") {
    bg = "white";
    if (inRange) { bg = "color-mix(in oklch, var(--brand) 7%, white)"; numColor = "var(--brand)"; priceColor = "var(--brand)"; numWeight = 700; }
  }

  if (selected) {
    bg = "var(--brand)"; numColor = "white"; priceColor = "rgba(255,255,255,0.85)"; numWeight = 700; border = "1px solid transparent";
  }

  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onClick(date, state, restrictionText)}
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(date, state, restrictionText, e.currentTarget)}
      onMouseLeave={() => onMouseLeave && onMouseLeave()}
      style={{
        appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
        width: TILE_W, height: TILE_H,
        background: bg, border, borderRadius: 6, padding: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
        position: "relative",
      }}>
      <div style={{
        marginTop: 8, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: numWeight,
        color: numColor, lineHeight: 1.1, textDecoration: deco, letterSpacing: "-0.005em",
      }}>{date.getDate()}</div>
      {priceText && (
        <div style={{
          marginTop: 6, fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: state === "soldOut" ? 600 : 500,
          color: priceColor, lineHeight: 1.2, textAlign: "center",
        }}>{priceText}</div>
      )}
      {isToday && !selected && (
        <span style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--brand)" }} />
      )}
      {restrictionText && state !== "soldOut" && state !== "past" && (
        <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: "var(--ink-3)" }} />
      )}
    </button>
  );
}

// ─────────────────── Month Grid ───────────────────

function MonthGrid({ year, month, start, end, hoverEnd, onPick, onHoverTile, onLeaveTile, today, validate }) {
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = i - offset + 1;
    cells.push(day >= 1 && day <= daysInMonth ? new Date(year, month, day) : null);
  }
  // Only render up to last needed row
  const lastFilled = cells.findLastIndex ? cells.findLastIndex(c => !!c) : (() => {
    for (let i = cells.length - 1; i >= 0; i--) if (cells[i]) return i;
    return -1;
  })();
  const rows = Math.ceil((lastFilled + 1) / 7);

  const previewEnd = end || hoverEnd;

  return (
    <div style={{ flex: 1, padding: "0 4px" }}>
      <div style={{
        textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
        color: "var(--ink-1)", marginBottom: 12, textTransform: "capitalize",
      }}>
        {MONTH_NAMES[month]} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${TILE_W}px)`, gap: 2, justifyContent: "center", marginBottom: 6 }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "6px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${TILE_W}px)`, gap: 2, justifyContent: "center" }}>
        {cells.slice(0, rows * 7).map((d, i) => {
          if (!d) return <div key={i} style={{ width: TILE_W, height: TILE_H }} />;
          const av = getAvailability(d);
          const isStart = start && isSameDay(d, start);
          const isEnd = end && isSameDay(d, end);
          const inRange = start && previewEnd && d > start && d < previewEnd;
          const isToday = isSameDay(d, today);

          return (
            <DateTile
              key={i}
              date={d}
              state={av.state}
              price={av.price}
              restrictionText={av.text}
              selected={isStart || isEnd}
              isStart={isStart}
              isEnd={isEnd}
              inRange={inRange}
              isToday={isToday}
              onClick={onPick}
              onMouseEnter={onHoverTile}
              onMouseLeave={onLeaveTile}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────── Tooltip overlay ───────────────────

function HoverTooltip({ info }) {
  if (!info) return null;
  const r = info.rect;
  return (
    <div style={{
      position: "fixed", top: r.top - 8, left: r.left + r.width / 2,
      transform: "translate(-50%, -100%)", zIndex: 90, pointerEvents: "none",
      background: "#010925", color: "white",
      fontFamily: "var(--font-ui)", fontSize: 13, lineHeight: 1.4,
      padding: "8px 12px", borderRadius: 6, maxWidth: 280,
      boxShadow: "0 4px 14px rgba(0,0,0,.2)",
    }}>
      <strong style={{ color: "white", display: "block", marginBottom: 2 }}>{info.title}</strong>
      <span style={{ opacity: 0.9 }}>{info.text}</span>
      <span style={{
        position: "absolute", left: "50%", top: "100%", transform: "translateX(-50%)",
        width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #010925",
      }} />
    </div>
  );
}

const RESTRICTION_TITLES = {
  closeToArrival: "Příjezd není možný",
  closeToDeparture: "Odjezd není možný",
  minStay2: "Minimální délka pobytu",
  soldOut: "Vyprodáno",
};

// ─────────────────── DateRangePicker ───────────────────

function DateRangePicker({ value, onChange, onClose }) {
  const [start, setStart] = React.useState(value?.start || null);
  const [end, setEnd] = React.useState(value?.end || null);
  const [hoverEnd, setHoverEnd] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(null);
  const [error, setError] = React.useState("");
  const [viewMonth, setViewMonth] = React.useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

  const reset = () => { setStart(null); setEnd(null); setHoverEnd(null); setError(""); };

  const onPick = (d, state, restrictionText) => {
    setError("");
    if (state === "closeToArrival" && (!start || end)) {
      setError("V tento den nelze přijet. Vyberte jiné datum příjezdu.");
      return;
    }
    if (state === "closeToDeparture" && start && !end) {
      setError("V tento den nelze odjet. Vyberte jiné datum odjezdu.");
      return;
    }
    if (!start || (start && end)) {
      setStart(d); setEnd(null); setHoverEnd(null);
    } else if (d < start) {
      setStart(d);
    } else if (isSameDay(d, start)) {
      // nothing
    } else {
      // validate range
      const nights = diffDays(start, d);
      // Sold-out scan
      for (let i = 0; i < nights; i++) {
        const check = addDays(start, i);
        const av = getAvailability(check);
        if (av.state === "soldOut") { setError("Vybraný termín obsahuje vyprodaný den. Vyberte jiný rozsah."); return; }
      }
      // Min stay
      const startAv = getAvailability(start);
      if (startAv.state === "minStay2" && nights < 2) {
        setError("V den příjezdu platí minimální délka pobytu 2 noci.");
        return;
      }
      setEnd(d); setHoverEnd(null);
    }
  };

  const onHoverTile = (d, state, restrictionText, el) => {
    if (start && !end && d > start) setHoverEnd(d);
    if (restrictionText) {
      setTooltip({
        title: RESTRICTION_TITLES[state] || "",
        text: restrictionText,
        rect: el.getBoundingClientRect(),
      });
    } else if (state === "soldOut") {
      setTooltip({
        title: "Vyprodáno",
        text: "Všechny pokoje jsou v tento den obsazené.",
        rect: el.getBoundingClientRect(),
      });
    } else {
      setTooltip(null);
    }
  };

  const onLeaveTile = () => setTooltip(null);

  const nights = (start && end) ? diffDays(start, end) : 0;
  const longStayBonus = nights >= 3;

  const total = (start && end) ? (() => {
    let sum = 0;
    for (let i = 0; i < nights; i++) {
      const av = getAvailability(addDays(start, i));
      if (av.price) sum += av.price;
    }
    return longStayBonus ? Math.round(sum * 0.85) : sum;
  })() : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px 14px", borderBottom: "1px solid var(--border-soft)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${start ? "var(--brand)" : "var(--border)"}`,
            background: "white", minWidth: 150,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>Příjezd</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: start ? "var(--ink-1)" : "var(--ink-3)", marginTop: 2 }}>
              {start ? fmtShort(start) : "Vyberte datum"}
            </div>
          </div>
          <span style={{ display: "inline-block", transform: "rotate(0deg)", color: "var(--ink-3)" }}>
            <Icon name="chevron-right" size={18} strokeWidth={2.2} />
          </span>
          <div style={{
            padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${end ? "var(--brand)" : "var(--border)"}`,
            background: "white", minWidth: 150,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>Odjezd</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: end ? "var(--ink-1)" : "var(--ink-3)", marginTop: 2 }}>
              {end ? fmtShort(end) : "Vyberte datum"}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
          {start && end
            ? <><strong style={{ color: "var(--ink-1)" }}>{nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}</strong> · od {total.toLocaleString("cs-CZ")} Kč</>
            : <>Vyberte datum příjezdu a odjezdu</>}
        </div>
      </div>

      {/* Quick select chips */}
      <div style={{
        padding: "10px 22px 4px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600, marginRight: 4 }}>Rychlý výběr:</span>
        {[
          { label: "Tento víkend", fn: () => {
            const today = startOfDay(TODAY);
            const dayOfWeek = (today.getDay() + 6) % 7;
            const friday = addDays(today, 5 - dayOfWeek);
            setStart(friday); setEnd(addDays(friday, 2)); setError("");
          } },
          { label: "Příští víkend", fn: () => {
            const today = startOfDay(TODAY);
            const dayOfWeek = (today.getDay() + 6) % 7;
            const friday = addDays(today, 5 - dayOfWeek + 7);
            setStart(friday); setEnd(addDays(friday, 2)); setError("");
          } },
          { label: "2 noci", fn: () => { const t = startOfDay(TODAY); setStart(t); setEnd(addDays(t, 2)); setError(""); } },
          { label: "3 noci", fn: () => { const t = startOfDay(TODAY); setStart(t); setEnd(addDays(t, 3)); setError(""); } },
          { label: "Týden", fn: () => { const t = startOfDay(TODAY); setStart(t); setEnd(addDays(t, 7)); setError(""); } },
        ].map((q, i) => (
          <button key={i} onClick={q.fn} style={{
            appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--ink-2)",
            padding: "6px 11px", borderRadius: 999,
          }}>{q.label}</button>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ padding: "16px 14px 6px", display: "flex", alignItems: "flex-start", gap: 8 }}>
        <button onClick={() => setViewMonth(addMonths(viewMonth, -1))} style={navArrowStyle}>
          <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Icon name="chevron-right" size={16} strokeWidth={2.4} /></span>
        </button>
        <MonthGrid year={viewMonth.getFullYear()} month={viewMonth.getMonth()} start={start} end={end} hoverEnd={hoverEnd} onPick={onPick} onHoverTile={onHoverTile} onLeaveTile={onLeaveTile} today={startOfDay(TODAY)} />
        <MonthGrid year={addMonths(viewMonth, 1).getFullYear()} month={addMonths(viewMonth, 1).getMonth()} start={start} end={end} hoverEnd={hoverEnd} onPick={onPick} onHoverTile={onHoverTile} onLeaveTile={onLeaveTile} today={startOfDay(TODAY)} />
        <button onClick={() => setViewMonth(addMonths(viewMonth, 1))} style={navArrowStyle}>
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </button>
      </div>

      {/* Legend */}
      <div style={{
        padding: "10px 22px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
        borderTop: "1px solid var(--border-soft)", fontSize: 12, color: "var(--ink-3)",
      }}>
        <LegendItem swatch={<span style={{ width: 16, height: 16, border: "1px solid var(--border)", borderRadius: 3, background: "white" }} />}>Dostupné</LegendItem>
        <LegendItem swatch={<span style={{ width: 16, height: 16, borderRadius: 3, background: "var(--brand)" }} />}>Vybráno</LegendItem>
        <LegendItem swatch={<span style={{ width: 16, height: 16, borderRadius: 3, background: "color-mix(in oklch, var(--brand) 7%, white)" }} />}>V rozsahu</LegendItem>
        <LegendItem swatch={<span style={{ width: 16, height: 16, borderRadius: 3, background: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#E73737", fontSize: 11, fontWeight: 700, border: "1px solid var(--border)" }}>×</span>}>Vyprodáno</LegendItem>
        <LegendItem swatch={<span style={{ width: 16, height: 16, borderRadius: 3, background: "white", border: "1px dashed var(--ink-3)", position: "relative" }}><span style={{ position: "absolute", top: 1, right: 1, width: 3, height: 3, borderRadius: "50%", background: "var(--ink-3)" }} /></span>}>S omezením</LegendItem>
        <span style={{ marginLeft: "auto", color: "var(--ink-3)", fontSize: 11.5 }}>
          Najetím myší na den s omezením zobrazíte detail
        </span>
      </div>

      {/* Long-stay incentive / Error */}
      {(error || (nights > 0 && nights < 3) || longStayBonus) && (
        <div style={{ padding: "0 22px 12px" }}>
          {error && (
            <div style={{
              padding: "10px 14px", background: "#FFF1F1", border: "1px solid #F5C6C6", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#A6151D",
            }}>
              <Icon name="x" size={16} strokeWidth={2.6} />
              <span>{error}</span>
            </div>
          )}
          {!error && nights > 0 && nights < 3 && (
            <div style={{
              padding: "10px 14px", background: "color-mix(in oklch, var(--brand) 5%, white)",
              border: "1px solid color-mix(in oklch, var(--brand) 14%, white)", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon name="sparkle" size={16} color="var(--brand)" strokeWidth={2} />
              <div style={{ flex: 1, fontSize: 13, color: "var(--ink-1)" }}>
                <strong>Prodlužte pobyt na 3 noci a ušetříte 15 %.</strong>
                <span style={{ color: "var(--ink-3)", marginLeft: 4 }}>Sleva se aplikuje automaticky.</span>
              </div>
              <button onClick={() => {
                if (start) {
                  // try +3 nights but skip sold-out
                  let candidate = addDays(start, 3);
                  setEnd(candidate);
                }
              }} style={{
                appearance: "none", cursor: "pointer", border: "1.5px solid var(--brand)", background: "white",
                color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
                padding: "6px 12px", borderRadius: 6,
              }}>Prodloužit</button>
            </div>
          )}
          {!error && longStayBonus && (
            <div style={{
              padding: "10px 14px", background: "var(--accent-tint)",
              border: "1px solid color-mix(in oklch, var(--accent) 25%, white)", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon name="check" size={16} color="var(--accent-dark)" strokeWidth={2.6} />
              <div style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>
                Sleva 15 % aktivována — pobyt od 3 nocí.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: "12px 22px", borderTop: "1px solid var(--border-soft)", background: "var(--neutral-50)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
          {nights > 0 && start && end ? (
            <span><strong style={{ color: "var(--ink-1)" }}>{fmtCzech(start)} → {fmtCzech(end)}</strong> · {nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}</span>
          ) : <span>Vyberte datum příjezdu a odjezdu</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={reset} style={{
            appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
            color: "var(--ink-2)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
            padding: "8px 14px", borderRadius: 6,
          }}>Resetovat</button>
          <button
            disabled={!start || !end}
            onClick={() => { onChange({ start, end }); onClose(); }}
            style={{
              appearance: "none", cursor: (start && end) ? "pointer" : "not-allowed",
              border: "none", background: (start && end) ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
              opacity: (start && end) ? 1 : 0.6,
              color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, letterSpacing: "0.02em",
            }}>Použít termín</button>
        </div>
      </div>

      <HoverTooltip info={tooltip} />
    </div>
  );
}

function LegendItem({ swatch, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {swatch}
      <span>{children}</span>
    </span>
  );
}

const navArrowStyle = {
  appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
  color: "var(--ink-1)", width: 32, height: 32, borderRadius: 8,
  display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 32, flexShrink: 0,
};

window.DateRangePicker = DateRangePicker;
window.fmtCzech = fmtCzech;
window.fmtShort = fmtShort;
window.diffDaysSearch = diffDays;
