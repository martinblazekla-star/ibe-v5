// Compact nav with stepper for LTR booking flow

function LTRBookingNav({ step = 1 }) {
  const steps = [
    { id: 1, label: "Výběr bytu" },
    { id: 2, label: "Vaše údaje a platba" },
    { id: 3, label: "Potvrzení a smlouva" },
  ];
  const [openLC, setOpenLC] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [lcValue, setLcValue] = React.useState({ lang: "cs", currency: "CZK" });
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener("loyalty-change", onChange);
    return () => window.removeEventListener("loyalty-change", onChange);
  }, []);
  const user = window.__loyaltyUser;
  const flagMap = { cs: "🇨🇿", sk: "🇸🇰", en: "🇬🇧", de: "🇩🇪", pl: "🇵🇱", hu: "🇭🇺" };

  return (
    <nav style={{
      height: 68, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <a href="LTR-Pick-Room.html" style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        textDecoration: "none", flexShrink: 0,
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }}></span>
        Hotel Balický
      </a>

      {/* Stepper */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 700, justifyContent: "center" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: s.id > step ? 0.5 : 1 }}>
              <span style={{
                width: 26, height: 26, borderRadius: "50%",
                background: s.id < step ? "var(--accent)" : (s.id === step ? "var(--brand)" : "var(--neutral-100)"),
                color: s.id <= step ? "white" : "var(--ink-3)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{s.id < step ? <Icon name="check" size={13} strokeWidth={2.8} /> : s.id}</span>
              <span style={{
                fontFamily: "var(--font-ui)", fontWeight: s.id === step ? 700 : 600, fontSize: 13,
                color: s.id === step ? "var(--ink-1)" : "var(--ink-2)", whiteSpace: "nowrap",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ width: 36, height: 2, borderRadius: 1, background: s.id < step ? "var(--accent)" : "var(--border)" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpenLC(!openLC)} style={{
            appearance: "none", cursor: "pointer",
            background: openLC ? "var(--neutral-100)" : "white",
            border: "1px solid var(--border)", borderRadius: 6,
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
            padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span>{flagMap[lcValue.lang]}</span>
            <span style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>{lcValue.lang} · {lcValue.currency}</span>
            <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
          </button>
          {openLC && window.LangCurrencyPicker && (
            <window.Dropdown open onClose={() => setOpenLC(false)} width={500} align="right">
              <window.LangCurrencyPicker value={lcValue} onChange={setLcValue} onClose={() => setOpenLC(false)} />
            </window.Dropdown>
          )}
        </div>

        <div style={{ position: "relative" }}>
          {user ? (
            <button onClick={() => setOpenUser(!openUser)} style={{
              appearance: "none", cursor: "pointer",
              background: openUser ? "var(--neutral-100)" : "white",
              border: "1px solid var(--border)", borderRadius: 999,
              padding: "4px 12px 4px 4px", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", background: "var(--brand)", color: "white",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
              }}>{user.initials}</span>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)" }}>
                {user.name.split(" ")[0]}
              </span>
              <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
            </button>
          ) : (
            <button onClick={() => setOpenUser(!openUser)} style={{
              appearance: "none", border: "1px solid var(--border)",
              background: openUser ? "var(--neutral-100)" : "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
              padding: "7px 12px", borderRadius: 6, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <Icon name="users" size={14} strokeWidth={1.8} color="var(--ink-2)" />
              Přihlásit
            </button>
          )}
          {openUser && (
            <window.Dropdown open onClose={() => setOpenUser(false)} width={420} align="right">
              {user
                ? <window.LoyaltyMemberZone user={user} onClose={() => setOpenUser(false)} />
                : <window.LoginDropdown onClose={() => setOpenUser(false)} />}
            </window.Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
}

window.LTRBookingNav = LTRBookingNav;
