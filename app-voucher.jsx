// Voucher live preview + main app

function VoucherPreview({ type, value, custom, form, design }) {
  const designs = {
    classic: { bg: "linear-gradient(135deg, #550173, #3F0156)", accent: "#F4D2FF", pattern: "circles" },
    warm:    { bg: "linear-gradient(135deg, #A6651D, #5C3309)", accent: "#FCE3B8", pattern: "lines" },
    minimal: { bg: "linear-gradient(135deg, #1F2429, #484C4F)", accent: "#E2E6E8", pattern: "none" },
    festive: { bg: "linear-gradient(135deg, #8B1A2B, #4A0612)", accent: "#FFD9DD", pattern: "circles" },
  };
  const d = designs[design] || designs.classic;
  const amount = custom ? parseInt(custom, 10) || 0 : value;
  const labelByType = {
    value: amount ? `${amount.toLocaleString("cs-CZ")} Kč` : "Hodnota neuvedena",
    stay: "Pobytový voucher",
    wellness: "Wellness voucher",
  };
  const subByType = {
    value: "K rezervaci čehokoli v hotelu",
    stay: "Romantický víkend pro 2",
    wellness: "Wellness den pro 2",
  };

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden", background: d.bg, color: "white",
      padding: "26px 28px", aspectRatio: "1.586 / 1", position: "relative",
      boxShadow: "0 10px 30px rgba(15,18,22,.15)",
    }}>
      {/* Decorative pattern */}
      {d.pattern === "circles" && (
        <>
          <span style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ position: "absolute", right: 30, bottom: -60, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        </>
      )}
      {d.pattern === "lines" && (
        <span style={{ position: "absolute", inset: 0, opacity: 0.08, background: `repeating-linear-gradient(45deg, white 0 1px, transparent 1px 14px)` }} />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: d.accent }}></span>
          Hotel Balický
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 9px", border: `1px solid ${d.accent}40`, borderRadius: 4, opacity: 0.95,
        }}>Dárkový voucher</div>
      </div>

      {/* Amount / type */}
      <div style={{ position: "relative", marginTop: 22 }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: d.accent, opacity: 0.9,
        }}>
          {type === "value" ? "V hodnotě" : "Voucher na"}
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: type === "value" && amount ? 44 : 28,
          marginTop: 4, letterSpacing: "-0.02em", lineHeight: 1.05,
        }}>{labelByType[type]}</div>
        {type !== "value" && (
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{subByType[type]}</div>
        )}
      </div>

      {/* Personalization */}
      <div style={{
        position: "absolute", left: 28, right: 28, bottom: 28,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: d.accent, opacity: 0.9 }}>Pro</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {form.toName || "Jméno obdarovaného"}
          </div>
          {form.message && (
            <div style={{
              fontSize: 11.5, opacity: 0.85, marginTop: 8, fontStyle: "italic", lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>„{form.message}"</div>
          )}
          {form.fromName && (
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6 }}>— {form.fromName}</div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>Kód voucheru</div>
          <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, marginTop: 3, letterSpacing: "0.05em" }}>HB-G-5829</div>
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 6 }}>Platnost do 14. 5. 2027</div>
        </div>
      </div>
    </div>
  );
}

function AppV() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_V);

  const [occasion, setOccasion] = React.useState("birthday");
  const [type, setType] = React.useState("value");
  const [value, setValue] = React.useState(2500);
  const [custom, setCustom] = React.useState("");
  const [form, setForm] = React.useState({
    toName: "", fromName: "", message: "",
    recipientContact: "", recipientAddress: "", scheduleDate: "",
  });
  const [delivery, setDelivery] = React.useState("pdf");

  const set = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));

  // Sync design with tweak
  const design = t.previewDesign;
  const setDesign = (d) => setTweak("previewDesign", d);

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  // Pricing
  const baseAmount = type === "value" ? (custom ? parseInt(custom, 10) || 0 : value) : (type === "stay" ? 7200 : 4990);
  const deliveryFee = delivery === "print" ? 290 : 0;
  const total = baseAmount + deliveryFee;

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <NavV />

      <div style={{ padding: "16px 32px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Dárkový voucher</span>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 32px 60px" }}>
        {t.showHero && <HeroV />}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {t.showOccasions && <Occasions value={occasion} setValue={setOccasion} />}
            <TypeSelector value={type} setValue={setType} />
            {type === "value" && <ValueConfig value={value} setValue={(v) => { setValue(v); setCustom(""); }} custom={custom} setCustom={setCustom} />}
            {type === "stay" && (
              <SectionV num="3" title="Konkrétní pobyt" sub="Vyberte balíček, který obdarovaný uplatní">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "romantic", name: "Romantický víkend pro 2", price: 7200, sub: "2 noci · sekt · večeře" },
                    { id: "wellness", name: "Wellness pobyt s plnou regenerací", price: 8900, sub: "3 noci · wellness · 2 procedury" },
                    { id: "family", name: "Rodinný pobyt s programem pro děti", price: 9600, sub: "2 noci · aquapark · animátoři" },
                  ].map((p, i) => (
                    <label key={p.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      border: `1.5px solid ${i === 0 ? "var(--brand)" : "var(--border)"}`,
                      background: i === 0 ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                      borderRadius: 10, cursor: "pointer",
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${i === 0 ? "var(--brand)" : "var(--border)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i === 0 && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{p.name}</div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{p.sub}</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>{p.price.toLocaleString("cs-CZ")} Kč</span>
                    </label>
                  ))}
                </div>
              </SectionV>
            )}
            {type === "wellness" && (
              <SectionV num="3" title="Wellness procedura" sub="Vyberte konkrétní zážitek">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { id: "bundle", icon: "💎", name: "Wellness den pro 2", price: 4990, sub: "Sauna · masáž · peeling" },
                    { id: "couples", icon: "💆", name: "Páro­vá masáž 90 min", price: 2890, sub: "Synchronní masáž pro 2" },
                    { id: "swedish60", icon: "🌿", name: "Klasická masáž 60 min", price: 1290, sub: "Relaxace celého těla" },
                    { id: "hotstone", icon: "🔥", name: "Hot stone masáž", price: 1890, sub: "Lávové kameny · 75 min" },
                  ].map((p, i) => (
                    <label key={p.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      border: `1.5px solid ${i === 0 ? "var(--brand)" : "var(--border)"}`,
                      background: i === 0 ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                      borderRadius: 10, cursor: "pointer",
                    }}>
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{p.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{p.sub}</div>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)", marginTop: 4 }}>{p.price.toLocaleString("cs-CZ")} Kč</div>
                      </div>
                    </label>
                  ))}
                </div>
              </SectionV>
            )}
            <Personalize form={form} set={set} />
            <Design value={design} setValue={setDesign} />
            <Delivery method={delivery} setMethod={setDelivery} form={form} set={set} />

            <section style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "22px 24px",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.5 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, marginTop: 1, flexShrink: 0, border: "1.5px solid var(--brand)", background: "var(--brand)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={12} color="white" strokeWidth={3} /></span>
                  <span>Souhlasím s <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>obchodními podmínkami</a> a <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>ochranou osobních údajů</a>. <span style={{ color: "#A6151D" }}>*</span></span>
                </label>
              </div>
              <button style={{
                marginTop: 18, width: "100%", appearance: "none", border: "none", cursor: "pointer",
                background: "var(--brand)", color: "white",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
                padding: "16px 20px", borderRadius: 10, letterSpacing: "0.01em",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                <Icon name="check" size={18} strokeWidth={2.6} />
                Koupit voucher za {total.toLocaleString("cs-CZ")} Kč
              </button>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
                Platba kartou · po platbě dostanete voucher do {delivery === "print" ? "3 prac. dní" : "60 minut"}
              </div>
            </section>
          </div>

          {/* Right: sticky preview */}
          <aside style={{ position: "sticky", top: 20, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                Náhled voucheru
              </div>
              <VoucherPreview type={type} value={value} custom={custom} form={form} design={design} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 12, color: "var(--ink-3)" }}>
                <span>Aktualizuje se v reálném čase</span>
                <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>Stáhnout ukázku</a>
              </div>
            </div>

            <div style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 12,
              padding: "16px 18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Hodnota voucheru</span>
                <span style={{ fontWeight: 600, color: "var(--ink-1)", fontSize: 14 }}>{baseAmount.toLocaleString("cs-CZ")} Kč</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Doručení</span>
                <span style={{ fontWeight: 600, color: deliveryFee === 0 ? "var(--accent-dark)" : "var(--ink-1)", fontSize: 14 }}>
                  {deliveryFee === 0 ? "zdarma" : `+ ${deliveryFee} Kč`}
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Celkem</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
                  {total.toLocaleString("cs-CZ")} Kč
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                <T3>Platnost 12 měsíců · lze prodloužit</T3>
                <T3>Přenosný — bez registrace</T3>
                <T3>Bez storno poplatků 14 dní</T3>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Marketing hero" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Příležitost (krok 1)" value={t.showOccasions} onChange={v => setTweak("showOccasions", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppV />);
