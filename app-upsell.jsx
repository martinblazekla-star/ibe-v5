// Upsell page main app

const TWEAK_DEFAULTS_UP = /*EDITMODE-BEGIN*/{
  "showRoomUpgrade": true,
  "showRoomFeatures": true,
  "showWellness": true,
  "showParking": true,
  "showExtras": true,
  "showPackageUpgrade": true
}/*EDITMODE-END*/;

function fmtU(n) { return n.toLocaleString("cs-CZ"); }

function ProgressBarUp({ step = 2 }) {
  const steps = [
    { id: 1, label: "Výběr ubytování", done: true },
    { id: 2, label: "Vylepšení pobytu", active: true },
    { id: 3, label: "Vaše údaje a platba" },
    { id: 4, label: "Potvrzení" },
  ];
  return (
    <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "20px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: !s.done && !s.active ? 0.5 : 1 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: s.done ? "var(--accent)" : (s.active ? "var(--brand)" : "var(--neutral-100)"),
                color: s.done || s.active ? "white" : "var(--ink-3)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{s.done ? <Icon name="check" size={15} strokeWidth={2.8} /> : s.id}</span>
              <span style={{
                fontFamily: "var(--font-ui)", fontWeight: s.active ? 700 : 600, fontSize: 13.5,
                color: s.active ? "var(--ink-1)" : "var(--ink-2)",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ flex: 1, height: 2, borderRadius: 1, background: steps[i + 1].done || steps[i + 1].active ? "var(--accent)" : "var(--border)" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function UpsellSummary({ extras, total, baseTotal }) {
  const lines = Object.entries(extras).filter(([, v]) => v && (typeof v !== "object" || Object.keys(v).length));
  const ct = lines.length;

  return (
    <aside style={{
      position: "sticky", top: 20, alignSelf: "flex-start",
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(16,24,40,.04)",
    }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "color-mix(in oklch, var(--brand) 3%, white)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>Vaše rezervace</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
          Hotel Balický
        </div>
      </div>

      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{
            width: 64, height: 56, borderRadius: 6, background: `url(assets/room-1.png) center / cover no-repeat var(--neutral-100)`, flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)", lineHeight: 1.25 }}>
              Dvoulůžkový Deluxe
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>2 noci · 2 dospělí · Flexi sazba</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>15. – 17. května 2026</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", marginBottom: 8 }}>
          <span>Základní cena pobytu</span>
          <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>{fmtU(baseTotal)} Kč</span>
        </div>
        {ct > 0 ? (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)" }}>
            <span>Doplňky ({ct})</span>
            <span style={{ fontWeight: 600, color: "var(--ink-1)" }}>+ {fmtU(total - baseTotal)} Kč</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", padding: "10px 0" }}>
            Zatím jste nepřidali žádné doplňky
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Celkem</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
          {fmtU(total)} Kč
        </span>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        <a href="Checkout.html" style={{
          appearance: "none", border: "none", cursor: "pointer", width: "100%",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
          padding: "13px 16px", borderRadius: 8, letterSpacing: "0.01em", textDecoration: "none",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          Pokračovat k údajům
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </a>
        <a href="Checkout.html" style={{
          fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
          color: "var(--ink-3)", textDecoration: "none", textAlign: "center", padding: "6px",
        }}>Pokračovat bez doplňků →</a>
      </div>

      <div style={{ padding: "12px 18px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          <span>Doplňky jsou plně vratné do 7 dní před příjezdem</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          <span>Cenu garantujeme — žádné překvapení na místě</span>
        </div>
      </div>
    </aside>
  );
}

function AppUP() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_UP);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  const [roomUpgrade, setRoomUpgrade] = React.useState(null);
  const [features, setFeatures] = React.useState({});
  const [wellness, setWellness] = React.useState(null);
  const [parking, setParking] = React.useState(null);
  const [extras, setExtras] = React.useState({});

  // Pricing
  const baseTotal = 4900;
  const upgradeCost = roomUpgrade === "exec" ? 900 : roomUpgrade === "suite" ? 2200 : 0;
  const featuresCost = (
    (features.view ? 800 * 2 : 0) +
    (features.pet ? 500 * 2 : 0) +
    (features.balcony ? 400 * 2 : 0) +
    (features.smoking ? 300 : 0)
  );
  const wellnessCost = wellness?.procedure ? ({ massage60: 1290, couples: 2890, facial: 990, sauna: 1490 }[wellness.procedure] || 0) : 0;
  const parkingCost = parking === "outdoor" ? 400 : parking === "garage" ? 700 : parking === "valet" ? 1200 : 0;
  const extrasPrices = { welcome: 590, "breakfast-room": 290, "skipass-1d": 690, "skipass-3d": 1690, transfer: 1290, bike: 590, champagne: 1490, flowers: 690 };
  const extrasCost = Object.entries(extras).reduce((s, [id, qty]) => s + (extrasPrices[id] || 0) * (qty || 0), 0);
  const total = baseTotal + upgradeCost + featuresCost + wellnessCost + parkingCost + extrasCost;

  // total savings calculation (mock — 18% saved vs on-site)
  const totalSavings = Math.round((upgradeCost + featuresCost + wellnessCost + parkingCost + extrasCost) * 0.18) + 350;

  const allExtrasObj = { roomUpgrade, ...features, ...(wellness?.procedure ? { wellness } : {}), parking, ...extras };

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <TopNavCO />
      <ProgressBarUp step={2} />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <UpsellHero savings={totalSavings} />
            {t.showPackageUpgrade && <PackageUpgradeBanner />}
            {t.showRoomUpgrade && <RoomUpgradeSection value={roomUpgrade} onChange={setRoomUpgrade} />}
            {t.showRoomFeatures && <RoomFeaturesSection value={features} setValue={setFeatures} />}
            {t.showWellness && <WellnessSection value={wellness} setValue={setWellness} />}
            {t.showParking && <ParkingSection value={parking} onChange={setParking} />}
            {t.showExtras && <ExtrasShopSection value={extras} setValue={setExtras} />}

            <div style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, marginTop: 4,
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink-1)" }}>
                  Hotovo? Pokračujte k údajům.
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
                  Doplňky můžete kdykoli upravit i v sekci „Moje rezervace" po dokončení.
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="Checkout.html" style={{
                  appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
                  color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
                  padding: "11px 16px", borderRadius: 8, textDecoration: "none",
                }}>Bez doplňků</a>
                <a href="Checkout.html" style={{
                  appearance: "none", border: "none", cursor: "pointer",
                  background: "var(--brand)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                  padding: "12px 22px", borderRadius: 8, letterSpacing: "0.02em", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  Pokračovat
                  <Icon name="chevron-right" size={16} strokeWidth={2.4} />
                </a>
              </div>
            </div>
          </div>
          <UpsellSummary extras={allExtrasObj} total={total} baseTotal={baseTotal} />
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Sekce upsellu">
          <TweakToggle label="Upgrade na balíček" value={t.showPackageUpgrade} onChange={v => setTweak("showPackageUpgrade", v)} />
          <TweakToggle label="Upgrade pokoje" value={t.showRoomUpgrade} onChange={v => setTweak("showRoomUpgrade", v)} />
          <TweakToggle label="Vlastnosti pokoje" value={t.showRoomFeatures} onChange={v => setTweak("showRoomFeatures", v)} />
          <TweakToggle label="Wellness" value={t.showWellness} onChange={v => setTweak("showWellness", v)} />
          <TweakToggle label="Parkování" value={t.showParking} onChange={v => setTweak("showParking", v)} />
          <TweakToggle label="Drobnosti / zboží" value={t.showExtras} onChange={v => setTweak("showExtras", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppUP />);
