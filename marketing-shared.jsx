// Shared marketing chrome for landing pages (different from booking engine topnav)
const { useState: useStateLP } = React;

function MarketingNav({ active }) {
  const items = [
    { id: "stay", label: "Pobyt", href: "#" },
    { id: "rooms", label: "Pokoje", href: "Pick-Room-Grid-View.html" },
    { id: "packages", label: "Balíčky", href: "Pick-Package.html" },
    { id: "wellness", label: "Wellness", href: "Wellness-Booking.html" },
    { id: "restaurant", label: "Restaurace", href: "#" },
    { id: "story", label: "Příběh hotelu", href: "#" },
    { id: "contact", label: "Kontakt", href: "#" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50, backdropFilter: "saturate(180%) blur(10px)",
      background: "rgba(255,255,255,0.92)", borderBottom: "1px solid var(--border-soft)",
      padding: "0 40px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", height: 68, display: "flex", alignItems: "center", gap: 32 }}>
        <a href="#" onClick={e => e.preventDefault()} style={{
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
          color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none",
        }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }}></span>
          Hotel Balický
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
          {items.map(it => (
            <a key={it.id} href={it.href} onClick={e => { if (it.href === "#") e.preventDefault(); }} style={{
              fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600,
              color: active === it.id ? "var(--ink-1)" : "var(--ink-2)",
              textDecoration: "none", padding: "8px 14px", borderRadius: 6, position: "relative",
            }}>
              {it.label}
              {active === it.id && <span style={{ position: "absolute", left: 14, right: 14, bottom: -22, height: 2, background: "var(--brand)" }} />}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: "var(--font-ui)" }}>CZ · CZK</span>
          <a href="Pick-Room-Grid-View.html" style={{
            appearance: "none", border: "none", cursor: "pointer", background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "10px 18px", borderRadius: 8, letterSpacing: "0.02em", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>Rezervovat pobyt</a>
        </div>
      </div>
    </nav>
  );
}

function MarketingFooter() {
  return (
    <footer style={{ background: "#0E0817", color: "rgba(255,255,255,0.85)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 40px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
              color: "white", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
            }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "white" }}></span>
              Hotel Balický
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: 0, maxWidth: 320 }}>
              Butikový hotel v srdci Prahy. Místo, kde se snoubí historie barokní fasády s moderním designem a osobním přístupem.
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              {["IG","FB","YT"].map(s => (
                <span key={s} style={{
                  width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.1)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, color: "white", letterSpacing: "0.04em",
                }}>{s}</span>
              ))}
            </div>
          </div>
          <FooterCol title="Pobyt" links={["Pokoje", "Balíčky", "Wellness", "Vouchery", "Last minute"]} />
          <FooterCol title="Hotel" links={["O nás", "Restaurace", "Wellness", "Eventy", "Galerie"]} />
          <FooterCol title="Kontakt" links={["Václavské náměstí 12", "110 00 Praha 1", "+420 234 567 890", "rezervace@balicky.cz", "Najít na mapě"]} />
        </div>
        <div style={{
          marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.5)",
        }}>
          <span>© 2026 Hotel Balický. Powered by IBE v4.</span>
          <div style={{ display: "flex", gap: 18 }}>
            {["Obchodní podmínky","Storno podmínky","GDPR","Cookies"].map(x => (
              <a key={x} href="#" onClick={e => e.preventDefault()} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{x}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 14,
      }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(l => (
          <a key={l} href="#" onClick={e => e.preventDefault()} style={{
            fontSize: 13.5, color: "rgba(255,255,255,0.85)", textDecoration: "none",
          }}>{l}</a>
        ))}
      </div>
    </div>
  );
}

window.MarketingNav = MarketingNav;
window.MarketingFooter = MarketingFooter;
