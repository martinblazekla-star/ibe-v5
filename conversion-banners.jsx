// Anti-OTA conversion banners + loyalty CTAs across the process

function BestPriceGuarantee({ compact, onDismiss }) {
  // Now always uses the compact one-line variant — the large multi-section version
  // was over-dominating the top of the page.
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
      background: "white", border: "1px solid var(--border)", borderRadius: 8, flexWrap: "wrap",
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 8px", borderRadius: 4, background: "var(--accent)",
        color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        <Icon name="check" size={11} strokeWidth={2.6} />
        Garance −8 % vs OTA
      </span>
      <Benefit>Bez rezervačních poplatků</Benefit>
      <Benefit>Storno zdarma do 7 dní</Benefit>
      <Benefit>Welcome drink zdarma</Benefit>
      <Benefit>Body do Balický Clubu</Benefit>
      <a href="#" onClick={e => e.preventDefault()} style={{
        marginLeft: "auto", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--ink-3)",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        <Icon name="info" size={12} strokeWidth={2} />
        Jak funguje garance
      </a>
    </div>
  );
}

function Benefit({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-1)", fontWeight: 500 }}>
      <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

// ─────────────────── Member Sign-Up CTA (when not logged in) ───────────────────

function MemberSignUpBanner({ onSignUp }) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener("loyalty-change", onChange);
    return () => window.removeEventListener("loyalty-change", onChange);
  }, []);
  if (window.__loyaltyUser) return null;

  // Compact inline ribbon — sleva is the hook, no big illustration
  return (
    <div style={{
      background: "color-mix(in oklch, var(--brand) 5%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
      borderRadius: 8, padding: "9px 14px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Icon name="sparkle" size={15} color="var(--brand)" strokeWidth={2.2} />
      <div style={{ flex: 1, fontSize: 13, color: "var(--ink-1)" }}>
        <strong>Zaregistrujte se a získejte 5 % slevu</strong>
        <span style={{ color: "var(--ink-3)", marginLeft: 6 }}>na tuto rezervaci · zdarma · platí ihned</span>
      </div>
      <button onClick={() => window.mockLogin?.()} style={{
        appearance: "none", border: "1.5px solid var(--brand)", background: "white", cursor: "pointer",
        color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
        padding: "6px 12px", borderRadius: 6,
      }}>Vytvořit účet</button>
    </div>
  );
}

// ─────────────────── Active member ribbon (when logged in) ───────────────────

function MemberActiveRibbon() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener("loyalty-change", onChange);
    return () => window.removeEventListener("loyalty-change", onChange);
  }, []);
  const u = window.__loyaltyUser;
  if (!u) return null;
  return (
    <div style={{
      padding: "9px 14px", borderRadius: 8,
      background: "var(--accent-tint)", border: "1px solid color-mix(in oklch, var(--accent) 25%, white)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Icon name="check" size={15} color="var(--accent-dark)" strokeWidth={2.6} />
      <div style={{ flex: 1, fontSize: 13, color: "var(--accent-dark)" }}>
        <strong>Vítejte zpět, {u.name.split(" ")[0]}.</strong>{" "}
        <span style={{ fontWeight: 500, opacity: 0.9 }}>
          Členská sleva {u.discount} % aktivní · získáte {Math.round(u.points / 10)} bodů.
        </span>
      </div>
      <span style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "var(--accent-dark)",
        background: "white", padding: "3px 8px", borderRadius: 4,
      }}>{u.tierIcon} {u.tier}</span>
    </div>
  );
}

// ─────────────────── Why book direct comparison strip ───────────────────

function WhyBookDirect() {
  const items = [
    { icon: "🏨", title: "Přímo s hotelem", line1: "Bez prostředníka", line2: "Komunikujeme s Vámi přímo" },
    { icon: "💰", title: "Nejnižší cena", line1: "Garantujeme −8 %", line2: "Vs Booking.com, Expedia, …" },
    { icon: "🎁", title: "Bonusy zdarma", line1: "Welcome drink, pozdní check-out", line2: "Členské výhody, body, slevy" },
    { icon: "✓", title: "Flexibilita", line1: "Storno zdarma do 7 dní", line2: "Změny přes recepci kdykoli" },
  ];
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "16px 22px",
    }}>
      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
        textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12,
      }}>4 důvody rezervovat přímo u nás</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--neutral-100)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>{it.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>
                {it.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 1, lineHeight: 1.4 }}>{it.line1}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.4 }}>{it.line2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.BestPriceGuarantee = BestPriceGuarantee;
window.MemberSignUpBanner = MemberSignUpBanner;
window.MemberActiveRibbon = MemberActiveRibbon;
window.WhyBookDirect = WhyBookDirect;
