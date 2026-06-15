// Top nav for Proposal Engine — proposal mode shows just one tab ("Nabídka"),
// no booking/voucher tabs. Lang/currency picker + login on the right.

function ProposalNav({ scenario, daysLeft, onOpenShare }) {
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

  const urgentExpiry = daysLeft <= 3;

  return (
    <nav style={{
      height: 68, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 8,
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.04em",
        }}>{scenario.hotel.logo}</span>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          }}>{scenario.hotel.name}</span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)" }}>
            {scenario.hotel.address}
          </span>
        </div>
      </div>

      {/* Tab — just Nabídka */}
      <div style={{ display: "flex", alignItems: "center", height: "100%", marginLeft: 16 }}>
        <div style={{
          position: "relative",
          height: "100%", display: "inline-flex", alignItems: "center",
          padding: "0 6px",
        }}>
          <span style={{
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
            letterSpacing: "0.01em",
          }}>Nabídka</span>
          <span style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 3, borderRadius: "3px 3px 0 0",
            background: "var(--brand)",
          }} />
        </div>
        <span style={{
          marginLeft: 10,
          fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "var(--ink-3)",
        }}>{scenario.proposalNumber}</span>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* Expiry pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 999,
          background: urgentExpiry ? "#FFF1F0" : "#FFF7E6",
          color: urgentExpiry ? "#B42318" : "#7A4A0F",
          border: `1px solid ${urgentExpiry ? "#FECDCA" : "#F2D88B"}`,
          fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.01em",
        }}>
          <Icon name="info" size={12} strokeWidth={2.4} />
          Platí ještě {daysLeft} {daysLeft === 1 ? "den" : daysLeft < 5 ? "dny" : "dní"}
        </div>

        {/* Share */}
        <button onClick={onOpenShare} style={{
          appearance: "none", cursor: "pointer", background: "white",
          border: "1px solid var(--border)", borderRadius: 6,
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
          padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="tag" size={13} strokeWidth={2} color="var(--ink-2)" />
          Sdílet
        </button>

        {/* Lang / currency */}
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

        {/* User */}
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

window.ProposalNav = ProposalNav;
