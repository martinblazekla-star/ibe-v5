// Package detail dialog — 3-step flow per Figma "Package detail"
// Step 1: Overview · Step 2: Pick room · Step 3: Pick variant → Reservation

function PackageDetailDialog({ open, pkg, onClose }) {
  const [step, setStep] = React.useState(1);
  const [pickedRoom, setPickedRoom] = React.useState(null);
  const [pickedVariant, setPickedVariant] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setPickedRoom(null);
      setPickedVariant(null);
    }
  }, [open, pkg?.id]);

  if (!open || !pkg) return null;

  // Rooms available for this package (use first 3 of window.ROOMS)
  const rooms = (window.ROOMS || []).filter(r => !r.soldOut).slice(0, 3);

  // Meal variants
  const variants = [
    { id: "breakfast", label: "Snídaně", sub: "2 osoby · bohatá švédská snídaně", priceDelta: 0 },
    { id: "halfboard", label: "Polopenze", sub: "2 osoby · snídaně + 3-chodová večeře", priceDelta: 1800 },
    { id: "fullboard", label: "Plná penze", sub: "2 osoby · snídaně, oběd, večeře", priceDelta: 3400 },
  ];

  const basePrice = pickedRoom?.rates?.[0]?.price || pkg.fromPrice;
  const variantDelta = pickedVariant?.priceDelta || 0;
  const total = basePrice + variantDelta;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 800,
        maxHeight: "92vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Hero header */}
        <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url(${pkg.image}) center / cover no-repeat`,
          }} />
          {step > 1 && (
            <button onClick={() => setStep(s => Math.max(1, s - 1))} style={{
              position: "absolute", left: 16, top: 16, appearance: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              padding: "8px 14px", borderRadius: 6,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ display: "inline-block", transform: "rotate(180deg)" }}><Icon name="chevron-right" size={14} strokeWidth={2.4} /></span>
              Zpět
            </button>
          )}
          <button onClick={onClose} aria-label="Zavřít" style={{
            position: "absolute", right: 16, top: 16, appearance: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)", color: "white",
            width: 36, height: 36, borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          <div style={{ position: "absolute", left: 22, bottom: 18, right: 22 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 6,
            }}>Pobytový balíček</div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white",
              lineHeight: 1.25, letterSpacing: "-0.005em", textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}>{pkg.name}</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{
          padding: "10px 22px", borderBottom: "1px solid var(--border-soft)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {[
            { id: 1, label: "Detail" },
            { id: 2, label: "Ubytování" },
            { id: 3, label: "Varianta" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, opacity: s.id <= step ? 1 : 0.45 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: s.id < step ? "var(--accent)" : (s.id === step ? "var(--brand)" : "var(--neutral-100)"),
                  color: s.id <= step ? "white" : "var(--ink-3)",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{s.id < step ? <Icon name="check" size={12} strokeWidth={2.8} /> : s.id}</span>
                <span style={{
                  fontFamily: "var(--font-ui)", fontWeight: s.id === step ? 700 : 600, fontSize: 12.5,
                  color: s.id === step ? "var(--ink-1)" : "var(--ink-2)",
                }}>{s.label}</span>
              </div>
              {i < arr.length - 1 && <span style={{ flex: 1, height: 1, background: s.id < step ? "var(--accent)" : "var(--border)" }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: step === 1 ? "white" : "var(--neutral-50)" }}>
          {step === 1 && <Step1Detail pkg={pkg} />}
          {step === 2 && <Step2Rooms rooms={rooms} pkg={pkg} picked={pickedRoom} onPick={setPickedRoom} />}
          {step === 3 && <Step3Variant variants={variants} picked={pickedVariant} onPick={setPickedVariant} basePrice={basePrice} />}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px", borderTop: "1px solid var(--border)", background: "white",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
        }}>
          <div>
            {step === 1 && (
              <div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Od</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                  {pkg.fromPrice.toLocaleString("cs-CZ")} Kč
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>za {pkg.nights} noci pro 2</div>
              </div>
            )}
            {(step === 2 || step === 3) && (
              <div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {step === 3 ? "Celkem" : "Od"}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                  {total.toLocaleString("cs-CZ")} Kč
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                  {pickedRoom ? `${pickedRoom.name}` : ""}
                  {pickedVariant ? ` · ${pickedVariant.label}` : ""}
                </div>
              </div>
            )}
          </div>
          {step === 1 && (
            <button onClick={() => setStep(2)} style={ctaPrimary()}>
              Ukázat ceny
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </button>
          )}
          {step === 2 && (
            <button disabled={!pickedRoom} onClick={() => setStep(3)} style={ctaPrimary(!pickedRoom)}>
              Vybrat variantu
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </button>
          )}
          {step === 3 && (
            <button disabled={!pickedVariant} onClick={() => { window.location.href = "Checkout.html"; }} style={ctaPrimary(!pickedVariant)}>
              <Icon name="check" size={16} strokeWidth={2.4} />
              Rezervovat za {total.toLocaleString("cs-CZ")} Kč
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ctaPrimary(disabled) {
  return {
    appearance: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))" : "var(--brand)",
    color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
    padding: "12px 22px", borderRadius: 8, letterSpacing: "0.02em",
    display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? 0.6 : 1, whiteSpace: "nowrap",
  };
}

function Step1Detail({ pkg }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
        {pkg.description}
      </p>
      <div style={{
        background: "var(--neutral-50)", border: "1px solid var(--border-soft)", borderRadius: 10, padding: "16px 18px",
      }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
        }}>Obsah balíčku</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
          {pkg.inclusions.map((inc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.4 }}>
              <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
              <span>{inc}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", color: "var(--ink-2)", fontSize: 13 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Icon name="calendar" size={14} color="var(--ink-3)" strokeWidth={1.8} />
          {pkg.nights} noci minimum
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
          Storno zdarma 7 dní před příjezdem
        </span>
        {pkg.savings > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--accent-dark)", fontWeight: 600 }}>
            <Icon name="flame" size={14} strokeWidth={2.4} />
            Ušetříte {pkg.savings.toLocaleString("cs-CZ")} Kč
          </span>
        )}
      </div>
    </div>
  );
}

function Step2Rooms({ rooms, pkg, picked, onPick }) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 12,
      }}>
        Vyberte si ubytování
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rooms.map(r => {
          const on = picked?.id === r.id;
          const price = r.rates[0]?.price + (pkg.fromPrice - 4900); // mock adjusted price for package
          return (
            <button key={r.id} onClick={() => onPick(r)} style={{
              appearance: "none", cursor: "pointer", textAlign: "left",
              background: "white", border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`, borderRadius: 10,
              padding: 0, overflow: "hidden",
              display: "grid", gridTemplateColumns: "140px minmax(0, 1fr) auto", gap: 0,
            }}>
              <div style={{
                background: `url(${r.image}) center / cover no-repeat var(--neutral-100)`,
                minHeight: 110,
              }} />
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                  {r.name}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 5, color: "var(--ink-3)", fontSize: 12.5 }}>
                  <span><Icon name="person" size={11} strokeWidth={1.8} color="var(--ink-3)" /> {r.capacity}</span>
                  <span><Icon name="size" size={11} strokeWidth={1.8} color="var(--ink-3)" /> {r.size} m²</span>
                  <span><Icon name="bed" size={11} strokeWidth={1.8} color="var(--ink-3)" /> {r.beds}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.4 }}>
                  {r.amenities.slice(0, 4).join(" · ")}
                </div>
              </div>
              <div style={{
                padding: "12px 16px", borderLeft: "1px solid var(--border-soft)",
                background: on ? "var(--accent-tint)" : "color-mix(in oklch, var(--brand) 2%, white)",
                display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 4, minWidth: 140,
              }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>balíček od</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", lineHeight: 1.05 }}>
                  {price.toLocaleString("cs-CZ")} Kč
                </div>
                <div style={{
                  marginTop: 6, fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5,
                  color: on ? "var(--accent-dark)" : "var(--brand)",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  {on ? <><Icon name="check" size={12} strokeWidth={2.6} /> Vybráno</> : <>Vybrat <Icon name="chevron-right" size={12} strokeWidth={2.4} /></>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3Variant({ variants, picked, onPick, basePrice }) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 12,
      }}>
        Vyberte variantu balíčku
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {variants.map(v => {
          const on = picked?.id === v.id;
          const total = basePrice + v.priceDelta;
          return (
            <label key={v.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: "white", border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`, borderRadius: 10,
              cursor: "pointer",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-1)" }} onClick={() => onPick(v)}>{v.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }} onClick={() => onPick(v)}>{v.sub}</div>
              </div>
              <div style={{ textAlign: "right" }} onClick={() => onPick(v)}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", lineHeight: 1.05 }}>
                  {total.toLocaleString("cs-CZ")} Kč
                </div>
                {v.priceDelta > 0 && (
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>+ {v.priceDelta.toLocaleString("cs-CZ")} Kč</div>
                )}
                {v.priceDelta === 0 && (
                  <div style={{ fontSize: 11.5, color: "var(--accent-dark)", fontWeight: 600, marginTop: 2 }}>v ceně</div>
                )}
              </div>
              <input type="radio" name="variant" checked={on} onChange={() => onPick(v)} style={{ display: "none" }} />
            </label>
          );
        })}
      </div>
    </div>
  );
}

window.PackageDetailDialog = PackageDetailDialog;
