// Top-level Proposal Engine app
// Steps: variants (if multiple) → detail → forms → checkout → confirmed
// Tweaks: scenario, variantCount, layout, showLoyalty, showChatbot, showTimeline, granularEdit, daysToExpiry

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "scenario": "svatba",
  "variantCount": 3,
  "layout": "classic",
  "showLoyalty": true,
  "showChatbot": true,
  "showTimeline": true,
  "granularEdit": true,
  "daysToExpiry": 10,
  "loggedIn": false
}/*EDITMODE-END*/;

function ProposalApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Build active scenario, slice to requested variant count
  const fullScenario = window.PROPOSAL_SCENARIOS[t.scenario] || window.PROPOSAL_SCENARIOS.svatba;
  const scenario = React.useMemo(() => {
    const count = Math.min(t.variantCount, fullScenario.variants.length);
    let variants = fullScenario.variants.slice(0, count);
    // If only 1 variant requested, pick the recommended one if available
    if (count === 1) {
      const rec = fullScenario.variants.find((v) => v.recommended);
      variants = [rec || fullScenario.variants[0]];
    } else if (count === 2 && fullScenario.variants.length >= 2) {
      // Pick standard + premium (skip the basic)
      const rec = fullScenario.variants.find((v) => v.recommended);
      if (rec) {
        const others = fullScenario.variants.filter((v) => v.id !== rec.id);
        variants = [rec, others[others.length - 1]];
      }
    }
    return { ...fullScenario, variants };
  }, [t.scenario, t.variantCount, fullScenario]);

  // Sync loggedIn tweak ↔ global loyalty user
  React.useEffect(() => {
    if (t.loggedIn && !window.__loyaltyUser) {
      window.mockLogin?.();
    } else if (!t.loggedIn && window.__loyaltyUser) {
      window.logout?.();
    }
  }, [t.loggedIn]);

  // Step machine — detail is the entry point. Variants are picked
  // prominently inside the detail page, not on a separate pre-step.
  const [step, setStep] = React.useState("detail");
  const [variant, setVariant] = React.useState(
    scenario.variants.find((v) => v.recommended) || scenario.variants[0]
  );

  // Reset when scenario or variantCount changes
  React.useEffect(() => {
    setStep("detail");
    setVariant(scenario.variants.find((v) => v.recommended) || scenario.variants[0]);
  }, [scenario.id, scenario.variants.length]);

  // Expose current step to a parent journey shell (postMessage works cross-origin)
  React.useEffect(() => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "journey-step", step: step }, "*");
      }
    } catch (e) {}
  }, [step]);

  // Granular edits + extras + forms state
  const [edits, setEdits] = React.useState({});
  const [extras, setExtras] = React.useState({});
  const [formState, setFormState] = React.useState({});

  // Modal state
  const [declineOpen, setDeclineOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

  const handleSwitchVariant = (v) => setVariant(v);
  const handleDeclineSubmit = (data) => {
    setDeclineOpen(false);
    setStep("declined");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
      <window.ProposalNav
        scenario={scenario}
        daysLeft={t.daysToExpiry}
        onOpenShare={() => setShareOpen(true)}
      />

      {/* Step indicator */}
      {(step === "detail" || step === "forms" || step === "checkout") && (
        <FlowStepper
          step={step === "detail" ? 1 : step === "forms" ? 2 : 3}
        />
      )}

      <div style={{ flex: 1 }}>
        {step === "detail" && (
          <window.ProposalDetail
            scenario={scenario}
            variant={variant}
            layout={t.layout}
            daysLeft={t.daysToExpiry}
            tweaks={t}
            edits={edits}
            onEdit={(patch) => setEdits({ ...edits, ...patch })}
            extras={extras}
            onChangeExtras={setExtras}
            onConfirm={() => { setStep("forms"); window.scrollTo({ top: 0 }); }}
            onDecline={() => setDeclineOpen(true)}
            onSwitchVariant={handleSwitchVariant}
          />
        )}
        {step === "forms" && (
          <window.ProposalFormsStep
            scenario={scenario}
            variant={variant}
            extras={extras}
            onChangeExtras={setExtras}
            formState={formState}
            onChangeForm={(id, s) => setFormState({ ...formState, [id]: s })}
            onBack={() => setStep("detail")}
            onContinue={() => { setStep("checkout"); window.scrollTo({ top: 0 }); }}
          />
        )}
        {step === "checkout" && (
          <window.ProposalCheckoutStep
            scenario={scenario}
            variant={variant}
            extras={extras}
            onBack={() => setStep("forms")}
            onComplete={() => { setStep("confirmed"); window.scrollTo({ top: 0 }); }}
          />
        )}
        {step === "confirmed" && (
          <window.ProposalConfirmation
            scenario={scenario}
            variant={variant}
            extras={extras}
            onRestart={() => {
              setStep("detail");
              setEdits({}); setExtras({}); setFormState({});
            }}
          />
        )}
        {step === "declined" && (
          <DeclinedView scenario={scenario} onRestart={() => {
            setStep("detail");
          }} />
        )}
      </div>

      {/* Modals */}
      <window.DeclineDialog open={declineOpen} onClose={() => setDeclineOpen(false)} onSubmit={handleDeclineSubmit} />
      <window.ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} scenario={scenario} />

      {/* Chatbot */}
      {t.showChatbot && step !== "confirmed" && step !== "declined" && (
        <window.ChatbotWidget scenario={scenario} />
      )}

      {/* Tweaks panel */}
      <TweaksPanel title="Proposal Tweaks">
        <TweakSection label="Scénář">
          <TweakSelect label="Typ akce" value={t.scenario} options={[
            { value: "svatba", label: "Svatba (60 osob, 2 noci)" },
            { value: "konference", label: "Konference (40 osob, 1 noc)" },
            { value: "skupina", label: "Skupinový wellness (20 osob, 3 noci)" },
          ]} onChange={(v) => setTweak("scenario", v)} />
          <TweakRadio label="Variant" value={t.variantCount} options={[
            { value: 1, label: "1" }, { value: 2, label: "2" }, { value: 3, label: "3" },
          ]} onChange={(v) => setTweak("variantCount", Number(v))} />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio label="Styl" value={t.layout} options={[
            { value: "classic", label: "Klasický" },
            { value: "editorial", label: "Editorial" },
          ]} onChange={(v) => setTweak("layout", v)} />
        </TweakSection>

        <TweakSection label="Sekce">
          <TweakToggle label="Loyalty badge + body" value={t.showLoyalty} onChange={(v) => setTweak("showLoyalty", v)} />
          <TweakToggle label="Časový harmonogram" value={t.showTimeline} onChange={(v) => setTweak("showTimeline", v)} />
          <TweakToggle label="Granulární editace" value={t.granularEdit} onChange={(v) => setTweak("granularEdit", v)} />
          <TweakToggle label="Chatbot widget" value={t.showChatbot} onChange={(v) => setTweak("showChatbot", v)} />
          <TweakToggle label="Přihlášený loyalty člen" value={t.loggedIn} onChange={(v) => setTweak("loggedIn", v)} />
        </TweakSection>

        <TweakSection label="Expirace">
          <TweakSlider label="Dní do expirace" value={t.daysToExpiry} min={1} max={30} unit=" dní"
            onChange={(v) => setTweak("daysToExpiry", v)} />
        </TweakSection>

        <TweakSection label="Skok do kroku">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <TweakButton secondary label="1. Detail" onClick={() => setStep("detail")} />
            <TweakButton secondary label="2. Formuláře" onClick={() => setStep("forms")} />
            <TweakButton secondary label="3. Checkout" onClick={() => setStep("checkout")} />
            <TweakButton secondary label="Potvrzeno" onClick={() => setStep("confirmed")} />
            <TweakButton secondary label="Odmítnuto" onClick={() => setStep("declined")} />
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function FlowStepper({ step }) {
  const steps = [
    { id: 1, label: "Nabídka a doplňky" },
    { id: 2, label: "Formuláře" },
    { id: 3, label: "Platba a potvrzení" },
  ];
  return (
    <div style={{
      background: "white", borderBottom: "1px solid var(--border-soft)",
      padding: "10px 32px",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", gap: 14, justifyContent: "center",
      }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: s.id > step ? 0.55 : 1 }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: s.id < step ? "var(--accent)" : (s.id === step ? "var(--brand)" : "var(--neutral-100)"),
                color: s.id <= step ? "white" : "var(--ink-3)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{s.id < step ? <Icon name="check" size={11} strokeWidth={2.8} /> : s.id}</span>
              <span style={{
                fontFamily: "var(--font-ui)", fontWeight: s.id === step ? 700 : 600, fontSize: 13,
                color: s.id === step ? "var(--ink-1)" : "var(--ink-2)", whiteSpace: "nowrap",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ width: 32, height: 2, borderRadius: 1, background: s.id < step ? "var(--accent)" : "var(--border)" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DeclinedView({ scenario, onRestart }) {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 32px 56px", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", margin: "0 auto",
        background: "#FFF1F0", color: "#B42318",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="x" size={36} strokeWidth={2.4} />
      </div>
      <h1 style={{
        margin: "20px 0 6px",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28,
        color: "var(--ink-1)", letterSpacing: "-0.015em",
      }}>Děkujeme za zpětnou vazbu</h1>
      <div style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 540, margin: "0 auto", lineHeight: 1.55 }}>
        Nabídku jsme uložili jako odmítnutou. {scenario.contact.name} se s vámi ozve, jestli pro vás máme něco jiného.
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={onRestart} style={{
          appearance: "none", cursor: "pointer", border: "none",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "12px 22px", borderRadius: 8, letterSpacing: "0.04em",
        }}>Zpět na nabídku</button>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProposalApp />);
