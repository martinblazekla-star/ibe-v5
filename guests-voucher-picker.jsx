// Guests + multi-room picker dropdown

function GuestsPicker({ value, onChange, onClose }) {
  const [rooms, setRooms] = React.useState(value?.rooms || [
    { id: 1, adults: 2, teens: 0, kids: 0, infants: 0 },
  ]);

  const categories = [
    { id: "adults", label: "Dospělí", sub: "18+ let", min: 1, max: 6 },
    { id: "teens", label: "Mládež", sub: "13–17 let", min: 0, max: 4 },
    { id: "kids", label: "Děti", sub: "3–12 let · sleva 50 %", min: 0, max: 4 },
    { id: "infants", label: "Kojenci", sub: "0–2 let · zdarma", min: 0, max: 2 },
  ];

  const setRoom = (idx, key, val) => {
    setRooms(prev => prev.map((r, i) => i === idx ? { ...r, [key]: val } : r));
  };
  const addRoom = () => {
    setRooms(prev => [...prev, { id: Date.now(), adults: 2, teens: 0, kids: 0, infants: 0 }]);
  };
  const removeRoom = (idx) => {
    setRooms(prev => prev.filter((_, i) => i !== idx));
  };

  const total = rooms.reduce((s, r) => ({
    adults: s.adults + r.adults, teens: s.teens + r.teens, kids: s.kids + r.kids, infants: s.infants + r.infants,
  }), { adults: 0, teens: 0, kids: 0, infants: 0 });
  const totalGuests = total.adults + total.teens + total.kids + total.infants;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "14px 18px", borderBottom: "1px solid var(--border-soft)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
            Hosté a pokoje
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
            Pro každý pokoj zvlášť. Cena se upraví podle věku hostů.
          </div>
        </div>
        <div style={{
          background: "var(--neutral-100)", padding: "6px 12px", borderRadius: 999,
          fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)",
        }}>
          {rooms.length} {rooms.length === 1 ? "pokoj" : rooms.length < 5 ? "pokoje" : "pokojů"} · {totalGuests} {totalGuests === 1 ? "host" : totalGuests < 5 ? "hosté" : "hostů"}
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 480, overflowY: "auto", background: "var(--neutral-50)" }}>
        {rooms.map((r, idx) => {
          const roomTotal = r.adults + r.teens + r.kids + r.infants;
          return (
            <div key={r.id} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--border-soft)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "color-mix(in oklch, var(--neutral-100) 30%, white)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%", background: "var(--brand)", color: "white",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                  }}>{idx + 1}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
                    Pokoj {idx + 1}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    {roomTotal} {roomTotal === 1 ? "host" : roomTotal < 5 ? "hosté" : "hostů"}
                  </span>
                </div>
                {rooms.length > 1 && (
                  <button onClick={() => removeRoom(idx)} aria-label="Odebrat pokoj" style={{
                    appearance: "none", border: "none", background: "transparent", cursor: "pointer",
                    color: "var(--ink-3)", padding: 4, display: "inline-flex", alignItems: "center", gap: 4,
                    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
                  }}>
                    <Icon name="x" size={14} strokeWidth={2.2} />
                    Odebrat
                  </button>
                )}
              </div>
              <div style={{ padding: "8px 16px" }}>
                {categories.map((cat, ci) => (
                  <div key={cat.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "10px 0",
                    borderBottom: ci < categories.length - 1 ? "1px solid var(--border-soft)" : "none",
                  }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{cat.label}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{cat.sub}</div>
                    </div>
                    <MiniStepper value={r[cat.id]} setValue={(v) => setRoom(idx, cat.id, v)} min={cat.min} max={cat.max} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button onClick={addRoom} disabled={rooms.length >= 5} style={{
          appearance: "none", cursor: rooms.length >= 5 ? "not-allowed" : "pointer",
          border: "1.5px dashed var(--border)", background: "white", color: "var(--ink-1)",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
          padding: "11px 16px", borderRadius: 10, opacity: rooms.length >= 5 ? 0.5 : 1,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icon name="plus" size={14} strokeWidth={2.4} />
          Přidat další pokoj
        </button>
      </div>

      <div style={{
        padding: "12px 18px", borderTop: "1px solid var(--border-soft)", background: "white",
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
      }}>
        <button onClick={onClose} style={{
          appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
          color: "var(--ink-2)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6,
        }}>Zrušit</button>
        <button onClick={() => { onChange({ rooms }); onClose(); }} style={{
          appearance: "none", cursor: "pointer", border: "none", background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "9px 18px", borderRadius: 6, letterSpacing: "0.02em",
        }}>Použít</button>
      </div>
    </div>
  );
}

function MiniStepper({ value, setValue, min, max }) {
  const btnStyle = (disabled) => ({
    appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
    border: `1.5px solid ${disabled ? "var(--border-soft)" : "var(--border)"}`,
    background: "white", color: disabled ? "var(--ink-3)" : "var(--ink-1)",
    width: 30, height: 30, borderRadius: 8,
    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <button onClick={() => setValue(Math.max(min, value - 1))} disabled={value <= min} style={btnStyle(value <= min)}>−</button>
      <span style={{ minWidth: 18, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>
        {value}
      </span>
      <button onClick={() => setValue(Math.min(max, value + 1))} disabled={value >= max} style={btnStyle(value >= max)}>+</button>
    </div>
  );
}

window.GuestsPicker = GuestsPicker;

// ─────────────────── Voucher picker ───────────────────

function VoucherPicker({ value, onChange, onClose }) {
  const [code, setCode] = React.useState(value?.code || "");
  const [status, setStatus] = React.useState(value?.status || "idle"); // idle | loading | ok | error
  const [appliedDiscount, setAppliedDiscount] = React.useState(value?.discount || null);

  const apply = () => {
    if (!code.trim()) return;
    setStatus("loading");
    setTimeout(() => {
      const up = code.trim().toUpperCase();
      // Mock validation
      if (up === "WELCOME10") {
        setStatus("ok"); setAppliedDiscount({ code: up, label: "Sleva 10 %", value: "−10 %" });
      } else if (up === "EARLYBIRD15") {
        setStatus("ok"); setAppliedDiscount({ code: up, label: "Early bird sleva 15 %", value: "−15 %" });
      } else if (up === "VIP25") {
        setStatus("ok"); setAppliedDiscount({ code: up, label: "VIP sleva 25 %", value: "−25 %" });
      } else {
        setStatus("error"); setAppliedDiscount(null);
      }
    }, 500);
  };

  const clear = () => { setCode(""); setStatus("idle"); setAppliedDiscount(null); };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
          Voucher nebo slevový kód
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.5 }}>
          Máte dárkový voucher, partner&shy;ský nebo firemní kód? Zadejte ho a uplatníme okamžitě.
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={code} onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
            placeholder="Např. WELCOME10"
            onKeyDown={(e) => e.key === "Enter" && apply()}
            style={{
              flex: 1, appearance: "none",
              border: `1.5px solid ${status === "error" ? "#A6151D" : status === "ok" ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 8, padding: "11px 14px",
              fontFamily: "var(--font-ui)", fontSize: 14.5, fontWeight: 600,
              color: "var(--ink-1)", background: "white", outline: "none",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}
          />
          <button onClick={apply} disabled={!code.trim() || status === "loading"} style={{
            appearance: "none", cursor: (!code.trim() || status === "loading") ? "not-allowed" : "pointer",
            border: "none", background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "0 18px", borderRadius: 8, letterSpacing: "0.02em",
            opacity: (!code.trim() || status === "loading") ? 0.5 : 1,
          }}>
            {status === "loading" ? "Ověřuji…" : "Použít"}
          </button>
        </div>

        {status === "ok" && appliedDiscount && (
          <div style={{
            padding: "12px 14px", background: "var(--accent-tint)", border: "1px solid color-mix(in oklch, var(--accent) 25%, white)",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8, background: "var(--accent)", color: "white",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name="check" size={17} strokeWidth={2.6} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--accent-dark)" }}>
                {appliedDiscount.label} aktivována
              </div>
              <div style={{ fontSize: 12, color: "var(--accent-dark)", marginTop: 1, opacity: 0.8 }}>
                Kód {appliedDiscount.code} · platí pro tuto rezervaci
              </div>
            </div>
            <button onClick={clear} style={{
              appearance: "none", border: "none", background: "transparent", cursor: "pointer",
              color: "var(--accent-dark)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
              padding: 4,
            }}>Odebrat</button>
          </div>
        )}

        {status === "error" && (
          <div style={{
            padding: "12px 14px", background: "#FFF1F1", border: "1px solid #F5C6C6",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 10,
            fontSize: 13, color: "#A6151D",
          }}>
            <Icon name="x" size={16} strokeWidth={2.6} />
            <div>
              <strong>Kód není platný.</strong>{" "}
              <span style={{ fontWeight: 400 }}>Zkontrolujte správnost nebo platnost voucheru.</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: 8, padding: "10px 0 0", borderTop: "1px solid var(--border-soft)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>
            Tip · jak získat slevu
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--ink-2)" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
              <span>Registrace zdarma do <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Balický Clubu</a> = sleva 5 % automaticky</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
              <span>Rezervace ≥ 30 dní předem = Early bird sleva 15 %</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
              <span>Dárkové vouchery zakoupené na našem webu</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        padding: "12px 18px", borderTop: "1px solid var(--border-soft)", background: "var(--neutral-50)",
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
      }}>
        <button onClick={() => { onChange({ code: status === "ok" ? code : "", status, discount: appliedDiscount }); onClose(); }} style={{
          appearance: "none", cursor: "pointer", border: "none", background: status === "ok" ? "var(--brand)" : "var(--neutral-100)",
          color: status === "ok" ? "white" : "var(--ink-2)",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "9px 18px", borderRadius: 6,
        }}>{status === "ok" ? "Uložit a zavřít" : "Zavřít"}</button>
      </div>
    </div>
  );
}

window.VoucherPicker = VoucherPicker;
