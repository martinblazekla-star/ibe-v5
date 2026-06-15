// Login dropdown + Loyalty member zone
// Global user state on window.__loyaltyUser

window.__loyaltyUser = null; // null = logged out

// Helper to log in (mock)
function mockLogin() {
  window.__loyaltyUser = {
    name: "Jan Novák",
    email: "jan.novak@example.cz",
    initials: "JN",
    tier: "Stříbrný",
    tierIcon: "🥈",
    tierColor: "#9093A0",
    nextTier: "Zlatý",
    nextTierIcon: "🥇",
    points: 2840,
    pointsToNextTier: 1160,
    pointsTotal: 4000,
    discount: 5,
    memberSince: "duben 2024",
    upcomingStays: 1,
    benefits: [
      "Sleva 5 % na každou rezervaci",
      "Welcome drink zdarma",
      "Pozdní check-out do 13:00",
      "Body za každý pobyt",
    ],
  };
  window.dispatchEvent(new CustomEvent("loyalty-change"));
}

function logout() {
  window.__loyaltyUser = null;
  window.dispatchEvent(new CustomEvent("loyalty-change"));
}

function LoginDropdown({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = React.useState("jan.novak@example.cz");
  const [password, setPassword] = React.useState("");
  const [view, setView] = React.useState("login"); // login | register

  const inputStyle = {
    width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
    padding: "10px 14px", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)",
    background: "white", outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Loyalty teaser at top */}
      <div style={{
        padding: "14px 18px",
        background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 10%, white), color-mix(in oklch, var(--brand) 3%, white))",
        borderBottom: "1px solid var(--border-soft)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{
          width: 36, height: 36, borderRadius: 8, background: "white", color: "var(--brand)",
          border: "1px solid color-mix(in oklch, var(--brand) 18%, white)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="sparkle" size={18} strokeWidth={2} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
            Balický Club
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 1, lineHeight: 1.4 }}>
            5 % sleva, body za pobyt, pozdní check-out zdarma.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {[
          { id: "login", label: "Přihlášení" },
          { id: "register", label: "Vytvořit účet" },
        ].map(t => {
          const on = view === t.id;
          return (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              flex: 1, appearance: "none", cursor: "pointer", border: "none", background: "transparent",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
              color: on ? "var(--brand)" : "var(--ink-3)",
              padding: "11px 0", borderBottom: `2px solid ${on ? "var(--brand)" : "transparent"}`,
              marginBottom: -1,
            }}>{t.label}</button>
          );
        })}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Social */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button style={socialBtnStyle}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>G</span> Google
          </button>
          <button style={socialBtnStyle}>
            <span style={{ fontWeight: 700, fontSize: 14 }}></span> Apple
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink-3)", fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span>nebo</span>
          <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {view === "register" && (
          <input placeholder="Vaše jméno" style={inputStyle} />
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={inputStyle} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Heslo" style={inputStyle} />

        {view === "login" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-2)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--brand)" }} />
              Zapamatovat si mě
            </label>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12.5, color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
              Zapomenuté heslo?
            </a>
          </div>
        )}

        <button
          onClick={() => { mockLogin(); onClose(); }}
          style={{
            appearance: "none", cursor: "pointer", border: "none",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "12px 16px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
          }}>
          {view === "login" ? "Přihlásit se" : "Vytvořit účet a získat 5 % slevu"}
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </button>

        {view === "register" && (
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5, marginTop: 2 }}>
            Vytvořením účtu souhlasíte s <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>obchodními podmínkami</a> a <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>ochranou údajů</a>.
          </div>
        )}
      </div>
    </div>
  );
}

const socialBtnStyle = {
  appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
  fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, color: "var(--ink-1)",
  padding: "9px 12px", borderRadius: 8,
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
};

function LoyaltyMemberZone({ user, onClose }) {
  const pct = Math.round((user.points / user.pointsTotal) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Member header */}
      <div style={{
        padding: "18px 20px",
        background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
        color: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white",
            border: "2px solid rgba(255,255,255,0.4)",
          }}>{user.initials}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>{user.name}</div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 1 }}>{user.email}</div>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.18)", padding: "5px 10px", borderRadius: 999,
            fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
            backdropFilter: "blur(6px)",
          }}>
            <span>{user.tierIcon}</span>
            <span>{user.tier}</span>
          </span>
        </div>

        {/* Progress to next tier */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 6 }}>
            <span style={{ opacity: 0.85 }}>Do tieru {user.nextTier} {user.nextTierIcon}</span>
            <span style={{ fontWeight: 700 }}>{user.pointsToNextTier.toLocaleString("cs-CZ")} bodů</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "white", borderRadius: 999 }} />
          </div>
        </div>
      </div>

      {/* Points + discount */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
        <div style={{ padding: "12px 18px", borderRight: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>Vaše body</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", marginTop: 2, letterSpacing: "-0.01em" }}>
            {user.points.toLocaleString("cs-CZ")}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>= cca {Math.round(user.points * 0.5).toLocaleString("cs-CZ")} Kč</div>
        </div>
        <div style={{ padding: "12px 18px" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>Vaše sleva</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--accent-dark)", marginTop: 2, letterSpacing: "-0.01em" }}>
            −{user.discount} %
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>na všechny rezervace</div>
        </div>
      </div>

      {/* Benefits list */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>
          Aktivní výhody
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {user.benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-1)" }}>
              <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "8px 0" }}>
        {[
          { icon: "calendar", label: "Moje rezervace", badge: user.upcomingStays },
          { icon: "sparkle", label: "Body a odměny", badge: null },
          { icon: "users", label: "Profil a údaje", badge: null },
          { icon: "info", label: "Nastavení", badge: null },
        ].map((m, i) => (
          <a key={i} href="#" onClick={e => e.preventDefault()} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "9px 18px",
            fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)",
            textDecoration: "none",
          }}>
            <Icon name={m.icon} size={16} color="var(--ink-3)" strokeWidth={1.8} />
            <span style={{ flex: 1 }}>{m.label}</span>
            {m.badge != null && m.badge > 0 && (
              <span style={{
                background: "var(--brand)", color: "white", fontSize: 11, fontWeight: 700,
                padding: "2px 7px", borderRadius: 999,
              }}>{m.badge}</span>
            )}
            <Icon name="chevron-right" size={14} color="var(--ink-3)" strokeWidth={2} />
          </a>
        ))}
      </div>

      <div style={{ padding: "10px 18px 14px", borderTop: "1px solid var(--border-soft)" }}>
        <button onClick={() => { logout(); onClose(); }} style={{
          appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
          color: "var(--ink-2)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6, width: "100%",
        }}>Odhlásit se</button>
      </div>
    </div>
  );
}

window.LoginDropdown = LoginDropdown;
window.LoyaltyMemberZone = LoyaltyMemberZone;
window.mockLogin = mockLogin;
window.logout = logout;
