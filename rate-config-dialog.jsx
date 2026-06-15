// Rate configuration dialog — opens after clicking "Rezervovat"
// Conversion-focused: guests, meals, small add-ons, live price, loyalty hint

// Local money formatter — kept inside the file so the dialog works regardless
// of which host view loads it (table/list/grid/map all use it).
const rcdFmt = (n) => n.toLocaleString("cs-CZ");

function RateConfigDialog({ open, room, rate, initialRooms, onClose, onConfirm }) {
  const guestCategories = [
    { id: "adults", label: "Dospělí", sub: "13 a více let", min: 1, max: 6, priceHint: null },
    { id: "teens", label: "Mládež", sub: "13–17 let", min: 0, max: 4, priceHint: null },
    { id: "kids", label: "Děti", sub: "3–12 let", min: 0, max: 4, priceHint: "−50 %" },
    { id: "infants", label: "Kojenci", sub: "0–2 let", min: 0, max: 2, priceHint: "zdarma" },
  ];
  const [guests, setGuests] = React.useState({ adults: 2, teens: 0, kids: 0, infants: 0 });
  const [meal, setMeal] = React.useState("included");
  const [addons, setAddons] = React.useState({});
  const [rooms, setRooms] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setGuests({ adults: 2, teens: 0, kids: 0, infants: 0 });
      setMeal("included");
      setAddons({});
      setRooms(initialRooms || 1);
    }
  }, [open, rate?.id, initialRooms]);

  const setGuest = (id, n) => setGuests(prev => ({ ...prev, [id]: n }));
  const totalGuests = guests.adults + guests.teens + guests.kids + guests.infants;
  const payingGuests = guests.adults + guests.teens + guests.kids; // infants free

  if (!open || !rate || !room) return null;

  // ---- pricing ----
  const nights = window.NIGHTS || 2;
  const basePrice = rate.price;

  const mealOptions = [
    { id: "included", label: rate.meal, sub: "Zahrnuto v ceně", deltaPerNight: 0 },
    { id: "halfboard", label: "Polopenze", sub: "Snídaně + 3-chodová večeře", deltaPerNight: 590 },
    { id: "fullboard", label: "Plná penze", sub: "Snídaně, oběd, večeře", deltaPerNight: 1190 },
  ];
  const mealDelta = (mealOptions.find(m => m.id === meal)?.deltaPerNight || 0) * payingGuests * nights;

  const addonCatalog = [
    { id: "welcome", label: "Welcome drink na pokoji", sub: "Láhev sektu Bohemia + ovoce", price: 590, per: "rezervace" },
    { id: "parking", label: "Parkování v garáži", sub: "Krytá garáž v hotelu", price: 250, per: "noc", multiplier: nights },
    { id: "pet", label: "Domácí mazlíček", sub: "Až 15 kg, miska + deka v ceně", price: 500, per: "rezervace" },
    { id: "latecheckout", label: "Pozdní check-out (do 14:00)", sub: "Podléhá dostupnosti", price: 800, per: "rezervace" },
  ];
  const addonsTotal = addonCatalog.reduce(
    (sum, a) => sum + (addons[a.id] ? a.price * (a.multiplier || 1) : 0), 0
  );

  const roomsTotal = basePrice * rooms + mealDelta * rooms;
  const total = roomsTotal + addonsTotal;

  // ---- render ----
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "32px 24px", animation: "rcdFade .15s ease-out",
    }} onClick={onClose}>
      <style>{`
        @keyframes rcdFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rcdSlide { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 14, width: "100%", maxWidth: 900,
          maxHeight: "92vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px",
          animation: "rcdSlide .2s ease-out",
        }}
      >
        {/* Left: configurator */}
        <div style={{ overflowY: "auto", maxHeight: "92vh" }}>
          <div style={{
            padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
            position: "sticky", top: 0, background: "white", zIndex: 1,
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4,
              }}>Konfigurace sazby</div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {rate.name}
                {rate.badge && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px",
                    background: "var(--accent-tint)", color: "var(--accent-dark)",
                    fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, borderRadius: 4,
                  }}>
                    <Icon name="flame" size={11} strokeWidth={2.4} /> {rate.badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{room.name} · č. {room.number}</div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--ink-2)",
            }}>
              <Icon name="x" size={18} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14, background: "var(--neutral-50)" }}>
            {/* Multi-room */}
            <Section label="Počet pokojů" hint="Stejnou sazbu lze rezervovat pro více pokojů">
              <Stepper value={rooms} setValue={setRooms} min={1} max={5} suffix={rooms === 1 ? "pokoj" : rooms < 5 ? "pokoje" : "pokojů"} />
            </Section>

            {/* Guests */}
            <Section label="Hosté" hint="Cena se upraví podle počtu a věku hostů">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {guestCategories.map((cat, i) => (
                  <div key={cat.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "12px 0",
                    borderBottom: i < guestCategories.length - 1 ? "1px solid var(--border-soft)" : "none",
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)", display: "flex", alignItems: "baseline", gap: 8 }}>
                        {cat.label}
                        {cat.priceHint && (
                          <span style={{
                            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
                            color: "var(--accent-dark)", background: "var(--accent-tint)",
                            padding: "2px 6px", borderRadius: 4, letterSpacing: "0.02em",
                          }}>{cat.priceHint}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{cat.sub}</div>
                    </div>
                    <Stepper value={guests[cat.id]} setValue={(n) => setGuest(cat.id, n)} min={cat.min} max={cat.max} suffix="" />
                  </div>
                ))}
              </div>
            </Section>

            {/* Meals */}
            <Section label="Stravování" hint="Výhodněji než si přiobjednat na místě">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mealOptions.map(opt => {
                  const selected = meal === opt.id;
                  return (
                    <label key={opt.id} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                      border: `1.5px solid ${selected ? "var(--brand)" : "var(--border)"}`,
                      background: selected ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                      borderRadius: 10, cursor: "pointer",
                    }}>
                      <Radio checked={selected} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-1)" }}>{opt.label}</div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{opt.sub}</div>
                      </div>
                      <div style={{
                        fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700,
                        color: opt.deltaPerNight === 0 ? "var(--accent-dark)" : "var(--ink-2)",
                      }}>
                        {opt.deltaPerNight === 0 ? "v ceně" : `+ ${rcdFmt(opt.deltaPerNight)} Kč / os. / noc`}
                      </div>
                    </label>
                  );
                })}
              </div>
            </Section>

            {/* Add-ons */}
            <Section label="Doplňky k pobytu" hint="Vyberte si extra služby — můžete také později">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {addonCatalog.map(a => {
                  const on = !!addons[a.id];
                  return (
                    <button
                      key={a.id}
                      onClick={() => setAddons(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                      style={{
                        appearance: "none", cursor: "pointer", textAlign: "left",
                        border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                        background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                        borderRadius: 10, padding: "12px 14px",
                        fontFamily: "var(--font-ui)",
                        display: "flex", alignItems: "flex-start", gap: 10,
                      }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                        background: on ? "var(--brand)" : "white", marginTop: 2,
                        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>{on && <Icon name="check" size={12} color="white" strokeWidth={3} />}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)", lineHeight: 1.25 }}>{a.label}</div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.35 }}>{a.sub}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-1)", marginTop: 6 }}>
                          {rcdFmt(a.price)} Kč <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>/ {a.per}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Loyalty hint */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              background: "color-mix(in oklch, var(--brand) 5%, white)",
              border: "1px solid color-mix(in oklch, var(--brand) 14%, white)", borderRadius: 10,
            }}>
              <span style={{
                width: 34, height: 34, borderRadius: 8, background: "white", border: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flexShrink: 0,
              }}>
                <Icon name="sparkle" size={17} strokeWidth={2.2} />
              </span>
              <div style={{ flex: 1, fontSize: 13, color: "var(--ink-1)", lineHeight: 1.4 }}>
                <strong>Staňte se členem Balický Club</strong> a získejte 5 % slevu na tuto rezervaci a další výhody zdarma.
              </div>
              <a href="#" onClick={e => e.preventDefault()} style={{
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--brand)",
                textDecoration: "none", whiteSpace: "nowrap",
              }}>Přihlásit se →</a>
            </div>
          </div>
        </div>

        {/* Right: live summary */}
        <aside style={{
          background: "var(--neutral-50)", borderLeft: "1px solid var(--border)",
          padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16,
          maxHeight: "92vh", overflowY: "auto",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
            }}>Vaše rezervace</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
              <SumRow icon="calendar">17. – 19. dubna 2026 · {nights} noci</SumRow>
              <SumRow icon="person">{totalGuests} {totalGuests === 1 ? "host" : (totalGuests < 5 ? "hosté" : "hostů")}</SumRow>
              <SumRow icon="bed">{rooms}× {room.name}</SumRow>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <PriceRow label={`Sazba × ${rooms}`} value={`${rcdFmt(basePrice * rooms)} Kč`} />
            {mealDelta > 0 && (
              <PriceRow label={`Stravování × ${rooms}`} value={`+ ${rcdFmt(mealDelta * rooms)} Kč`} />
            )}
            {addonsTotal > 0 && (
              <PriceRow label="Doplňky" value={`+ ${rcdFmt(addonsTotal)} Kč`} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)" }}>
              <span>Daně a poplatky</span>
              <span>v ceně</span>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid var(--border)", paddingTop: 14,
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Celkem</span>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)", letterSpacing: "-0.01em",
            }}>{rcdFmt(total)} Kč</span>
          </div>

          <button onClick={() => onConfirm({ guests, meal, addons, rooms, total })} style={{
            appearance: "none", border: "none", cursor: "pointer", width: "100%",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
            padding: "14px 16px", borderRadius: 8, letterSpacing: "0.01em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            Pokračovat k údajům
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>

          <button onClick={() => onConfirm({ guests, meal, addons, rooms, total, addAnother: true })} style={{
            appearance: "none", cursor: "pointer", width: "100%",
            background: "white", color: "var(--ink-1)",
            border: "1.5px dashed var(--border)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
            padding: "11px 16px", borderRadius: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: -8,
          }}>
            <Icon name="plus" size={14} strokeWidth={2.4} />
            Přidat další pokoj
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: -4 }}>
            <TrustLine icon="check">Nejlepší cena zaručena</TrustLine>
            <TrustLine icon="check">Bez rezervačních poplatků</TrustLine>
            <TrustLine icon="check">{rate.cancellable ? rate.cancellation : "Bez možnosti storna"}</TrustLine>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10,
      padding: "16px 18px",
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
        }}>{label}</div>
        {hint && <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Stepper({ value, setValue, min = 0, max = 9, suffix }) {
  const dec = () => setValue(Math.max(min, value - 1));
  const inc = () => setValue(Math.min(max, value + 1));
  const btn = (active, disabled) => ({
    appearance: "none", border: `1.5px solid ${disabled ? "var(--border-soft)" : "var(--border)"}`,
    width: 36, height: 36, borderRadius: 8, background: "white",
    cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "var(--ink-3)" : "var(--ink-1)",
    fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <button onClick={dec} disabled={value <= min} style={btn(false, value <= min)}>−</button>
      <div style={{
        minWidth: 64, textAlign: "center",
        fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-1)",
      }}>
        {value} <span style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--ink-3)" }}>{suffix}</span>
      </div>
      <button onClick={inc} disabled={value >= max} style={btn(false, value >= max)}>+</button>
    </div>
  );
}

function GuestRow({ label, sub, value, setValue, min, max }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
      </div>
      <Stepper value={value} setValue={setValue} min={min} max={max} suffix="" />
    </div>
  );
}

function Radio({ checked }) {
  return (
    <span style={{
      width: 18, height: 18, borderRadius: "50%",
      border: `1.5px solid ${checked ? "var(--brand)" : "var(--border)"}`,
      background: "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {checked && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}
    </span>
  );
}

function SumRow({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span>{children}</span>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)" }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{value}</span>
    </div>
  );
}

function TrustLine({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)" }}>
      <Icon name={icon} size={13} color="var(--accent)" strokeWidth={2.4} />
      <span>{children}</span>
    </div>
  );
}

window.RateConfigDialog = RateConfigDialog;
