// Checkout — single-page, conversion-focused
// Left: contact + addons + special requests + payment + consents + final CTA
// Right: sticky summary with line items + trust strip + social proof

const { useState: useStateCO, useEffect: useEffectCO } = React;

const TWEAK_DEFAULTS_CO = /*EDITMODE-BEGIN*/{
  "showLoyaltyBanner": true,
  "showSocialProof": true,
  "showAddons": true,
  "showBookingFor": true
}/*EDITMODE-END*/;

function fmtC(n) { return n.toLocaleString("cs-CZ"); }

// Mock reservation cart — would come from previous step state
const CART = {
  hotel: "Hotel Balický",
  arrival: "Pá 15. května 2026",
  departure: "Ne 17. května 2026",
  nights: 2,
  rooms: [
    {
      id: 1,
      name: "Dvoulůžkový pokoj Deluxe",
      number: "107",
      rate: "Flexibilní cena",
      meal: "Snídaně v ceně",
      cancellation: "Zrušení zdarma do 19. dubna 2026",
      guests: { adults: 2, kids: 0 },
      image: "assets/room-1.png",
      price: 4900,
    },
  ],
  addons: [],
};

// — Top nav, breadcrumb, progress —

function TopNavCO() {
  return (
    <nav style={{
      height: 60, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <a href="Pick-Room-Table-View.html" style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        textDecoration: "none",
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }}></span>
        Hotel Balický
      </a>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--ink-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
          Bezpečná platba SSL
        </span>
        <span>+420 234 567 890</span>
      </div>
    </nav>
  );
}

function ProgressBar({ step = 2 }) {
  const steps = [
    { id: 1, label: "Výběr ubytování", done: true },
    { id: 2, label: "Vaše údaje a platba", active: true },
    { id: 3, label: "Potvrzení rezervace", future: true },
  ];
  return (
    <div style={{
      background: "white", borderBottom: "1px solid var(--border)",
      padding: "20px 32px",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: s.future ? 0.55 : 1 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: s.done ? "var(--accent)" : (s.active ? "var(--brand)" : "var(--neutral-100)"),
                color: s.done || s.active ? "white" : "var(--ink-3)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.done ? <Icon name="check" size={15} strokeWidth={2.8} /> : s.id}
              </span>
              <span style={{
                fontFamily: "var(--font-ui)", fontWeight: s.active ? 700 : 600, fontSize: 14,
                color: s.active ? "var(--ink-1)" : "var(--ink-2)",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{
                flex: 1, height: 2, borderRadius: 1,
                background: steps[i + 1].future ? "var(--border)" : "var(--accent)",
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// — Form primitives —

function Field({ label, hint, required, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>
          {label} {required && <span style={{ color: "#A6151D" }}>*</span>}
        </span>
        {hint && <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
        padding: "11px 14px", fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-1)",
        background: "white", outline: "none",
      }}
      onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px color-mix(in oklch, var(--brand) 12%, transparent)"; }}
      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
      padding: "11px 38px 11px 14px", fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-1)",
      background: "white", cursor: "pointer",
      backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
      backgroundPosition: "calc(100% - 18px) 50%, calc(100% - 13px) 50%",
      backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
    }}>{children}</select>
  );
}

function CheckoutSection({ title, sub, children, num }) {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "22px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
        {num && (
          <span style={{
            width: 30, height: 30, borderRadius: 8, background: "var(--neutral-100)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-2)",
          }}>{num}</span>
        )}
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.005em",
          }}>{title}</h2>
          {sub && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </section>
  );
}

window.CART = CART;
window.fmtC = fmtC;
window.TopNavCO = TopNavCO;
window.ProgressBar = ProgressBar;
window.Field = Field;
window.Input = Input;
window.Select = Select;
window.CheckoutSection = CheckoutSection;
