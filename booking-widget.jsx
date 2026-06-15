// Standalone Booking Widget — embeddable on any marketing page
// Floating bottom-right OR inline placement (variant prop)
// Use: <BookingWidget room={room} variant="floating" /> or variant="inline"

function fmtBW(n) { return n.toLocaleString("cs-CZ"); }

function BookingWidget({ room, pkg, variant = "floating", title }) {
  // Either a room (with rates) or a package
  const cheapestPrice = room
    ? (room.rates.length ? Math.min(...room.rates.map(r => r.price)) : null)
    : pkg?.fromPrice;
  const originalPrice = pkg?.originalPrice || room?.rates?.find(r => r.originalPrice)?.originalPrice;
  const savings = pkg?.savings;
  const subjectLabel = room ? `Pokoj č. ${room.number}` : (pkg ? "Pobytový balíček" : "");
  const subjectName = room ? room.name : (pkg ? pkg.name : title);
  const nights = pkg?.nights || 2;
  const ctaHref = room ? "Pick-Room-Grid-View.html" : "Pick-Package.html";

  const wrapBaseStyle = {
    background: "white", border: "1px solid var(--border)", borderRadius: 14,
    boxShadow: "0 14px 40px rgba(15,18,22,.15)",
    padding: "20px 22px",
    width: 340,
  };
  const wrapStyle = variant === "floating"
    ? { ...wrapBaseStyle, position: "fixed", right: 24, bottom: 24, zIndex: 50 }
    : { ...wrapBaseStyle, position: "relative", boxShadow: "0 6px 18px rgba(15,18,22,.08)" };

  return (
    <aside style={wrapStyle}>
      {/* Subject label */}
      {subjectName && variant !== "floating" && (
        <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border-soft)" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            {subjectLabel}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginTop: 2, letterSpacing: "-0.005em", lineHeight: 1.3 }}>
            {subjectName}
          </div>
        </div>
      )}

      {/* Price block */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            Od · za {nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}
          </div>
          {originalPrice && (
            <div style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", marginTop: 4, lineHeight: 1 }}>
              {fmtBW(originalPrice)} Kč
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
            letterSpacing: "-0.01em", lineHeight: 1,
          }}>{fmtBW(cheapestPrice)} <span style={{ fontSize: 15, fontWeight: 600 }}>Kč</span></div>
          {savings && (
            <div style={{
              display: "inline-flex", alignItems: "center", marginTop: 4,
              padding: "2px 6px", borderRadius: 4, background: "var(--accent-tint)", color: "var(--accent-dark)",
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.02em",
            }}>−{fmtBW(savings)} Kč</div>
          )}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        <BWField icon="calendar" label="Termín" value="Pá 15. 5. – Ne 17. 5." />
        <BWField icon="users" label="Hosté" value="2 dospělí · 1 pokoj" />
      </div>

      {/* CTA */}
      <a href={ctaHref} style={{
        display: "block", appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
        padding: "13px 16px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
        textAlign: "center",
      }}>Zkontrolovat dostupnost</a>

      {/* Trust strip */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
        <BWTrust>Garantujeme nejnižší cenu</BWTrust>
        <BWTrust>Storno zdarma do 7 dní</BWTrust>
        <BWTrust>Bez rezervačních poplatků</BWTrust>
      </div>
    </aside>
  );
}

function BWField({ icon, label, value }) {
  return (
    <button style={{
      appearance: "none", textAlign: "left", background: "white", border: "1px solid var(--border)", borderRadius: 8,
      padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
    }}>
      <Icon name={icon} size={15} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)", lineHeight: 1.3 }}>{value}</div>
      </div>
    </button>
  );
}

function BWTrust({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-2)" }}>
      <Icon name="check" size={11} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

window.BookingWidget = BookingWidget;
