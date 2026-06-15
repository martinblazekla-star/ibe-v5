// Checkout app: summary + composition

function Summary({ cart, total }) {
  return (
    <aside style={{
      position: "sticky", top: 20, alignSelf: "flex-start",
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(16,24,40,.04)",
    }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "color-mix(in oklch, var(--brand) 3%, white)" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4,
        }}>Vaše rezervace</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
          {cart.hotel}
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid var(--border)" }}>
        <SumLine icon="calendar">{cart.arrival} → {cart.departure}</SumLine>
        <SumLine icon="users">{cart.nights} {cart.nights === 1 ? "noc" : cart.nights < 5 ? "noci" : "nocí"} · 2 dospělí</SumLine>
        <a href="Pick-Room-Table-View.html" style={{ fontSize: 12, color: "var(--brand)", fontWeight: 700, textDecoration: "none", marginTop: 2 }}>
          Změnit termín nebo hosty →
        </a>
      </div>

      {/* Rooms */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 14 }}>
        {cart.rooms.map((r, i) => (
          <div key={r.id} style={{ display: "flex", gap: 12 }}>
            <div style={{
              width: 64, height: 56, borderRadius: 6, background: `url(${r.image}) center / cover no-repeat var(--neutral-100)`,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)", lineHeight: 1.25 }}>
                {r.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                č. {r.number} · {r.rate}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                <Mini>{r.meal}</Mini>
                <Mini accent>Storno do 19.4.</Mini>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                  Změnit
                </a>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
                  {fmtC(r.price)} Kč
                </span>
              </div>
            </div>
          </div>
        ))}
        <button style={{
          appearance: "none", border: "1.5px dashed var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "9px 12px", borderRadius: 8,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icon name="plus" size={14} strokeWidth={2.4} />
          Přidat další pokoj
        </button>
      </div>

      {/* Price breakdown */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <Row label={`Ubytování · ${cart.nights} noci`} value={`${fmtC(cart.rooms[0].price)} Kč`} />
        <Row label="Doplňky" value="0 Kč" muted />
        <Row label="Daně a poplatky" value="v ceně" muted />
      </div>

      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Celkem</span>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)", letterSpacing: "-0.01em",
        }}>{fmtC(total)} Kč</span>
      </div>

      <div style={{ padding: "0 18px 16px" }}>
        <div style={{
          padding: "10px 12px", background: "var(--accent-tint)",
          borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="sparkle" size={15} color="var(--accent-dark)" strokeWidth={2.2} />
          <span style={{ fontSize: 12.5, color: "var(--accent-dark)", fontWeight: 600 }}>
            Nejvýhodnější cena — o 8 % nižší než na OTA.
          </span>
        </div>
      </div>

      <div style={{ padding: "12px 18px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 4px rgba(34,197,94,.18)" }} />
          <span><strong style={{ color: "var(--ink-1)", fontWeight: 700 }}>4 lidé</strong> právě prohlížejí tento hotel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)", marginTop: 6 }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          <span>Naposledy rezervováno před <strong style={{ color: "var(--ink-1)" }}>12 minutami</strong></span>
        </div>
      </div>
    </aside>
  );
}

function SumLine({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span>{children}</span>
    </div>
  );
}

function Mini({ children, accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
      padding: "2px 6px", borderRadius: 4,
      background: accent ? "var(--accent-tint)" : "var(--neutral-100)",
      color: accent ? "var(--accent-dark)" : "var(--ink-2)",
    }}>{accent && <Icon name="check" size={10} strokeWidth={2.6} />}{children}</span>
  );
}

function Row({ label, value, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: muted ? "var(--ink-3)" : "var(--ink-2)" }}>
      <span>{label}</span>
      <span style={{ fontWeight: muted ? 500 : 600, color: muted ? "var(--ink-3)" : "var(--ink-1)" }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────

function AppCO() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_CO);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const total = window.CART.rooms.reduce((s, r) => s + r.price, 0);

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <TopNavCO />
      <ProgressBar step={2} />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {t.showLoyaltyBanner && <LoyaltyBanner />}
            <ContactSection />
            {t.showBookingFor && <BookingForSection />}
            {t.showAddons && <AddonsSection />}
            <SpecialRequests />
            <PaymentSection />
            <ConsentsAndCTA total={total} />
            <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5, padding: "0 20px" }}>
              Kliknutím na „Závazně rezervovat" potvrzujete rezervaci a souhlasíte s podmínkami. Po dokončení dostanete potvrzení e-mailem.
            </div>
          </div>
          <Summary cart={window.CART} total={total} />
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Marketing prvky">
          <TweakToggle label="Loyalty banner" value={t.showLoyaltyBanner} onChange={v => setTweak("showLoyaltyBanner", v)} />
          <TweakToggle label="Social proof v summary" value={t.showSocialProof} onChange={v => setTweak("showSocialProof", v)} />
        </TweakSection>
        <TweakSection label="Sekce formuláře">
          <TweakToggle label="Pro koho rezervujete" value={t.showBookingFor} onChange={v => setTweak("showBookingFor", v)} />
          <TweakToggle label="Doplňky k pobytu" value={t.showAddons} onChange={v => setTweak("showAddons", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppCO />);
