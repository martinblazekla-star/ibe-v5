// LTR Confirmation — celebratory but practical
// Differences from short-term:
// - Document download (signed contract, ID handover protocol)
// - Move-in checklist + key handover instructions
// - NO post-purchase wellness upsell — just practical timeline

function fmtLTRC(n) { return n.toLocaleString("cs-CZ"); }

function LTRCNav() {
  return (
    <nav style={{
      height: 60, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <a href="LTR-Pick-Room.html" style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        textDecoration: "none",
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }}></span>
        Hotel Balický · Dlouhodobé bydlení
      </a>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--ink-2)" }}>
        <span>+420 234 567 890</span>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
          padding: "7px 12px", borderRadius: 6, cursor: "pointer",
        }}>Moje rezervace</button>
      </div>
    </nav>
  );
}

function LTRCSuccessHero() {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 14,
      padding: "36px 40px", boxShadow: "0 2px 14px rgba(16,24,40,.04)",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "5px 11px", borderRadius: 999,
        background: "var(--accent-tint)", color: "var(--accent-dark)",
        fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
      }}>
        <Icon name="check" size={14} strokeWidth={2.8} />
        Rezervace přijata
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
        margin: "12px 0 4px", letterSpacing: "-0.015em", lineHeight: 1.15,
      }}>
        Vítejte, Jane. Vaše bydlení je rezervováno.
      </h1>
      <p style={{ fontSize: 15, color: "var(--ink-2)", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 700 }}>
        Smlouvu, fakturu a další pokyny jsme odeslali na <strong style={{ color: "var(--ink-1)" }}>jan.novak@example.cz</strong>. Smlouvu nám prosím pošlete podepsanou zpět do 7 dní.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "11px 18px", borderRadius: 8, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="check" size={15} strokeWidth={2.4} />
          Stáhnout smlouvu (PDF)
        </button>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
          padding: "11px 16px", borderRadius: 8,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="image" size={15} strokeWidth={1.8} />
          Stáhnout fakturu
        </button>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
          padding: "11px 16px", borderRadius: 8,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="calendar" size={15} strokeWidth={1.8} />
          Přidat do kalendáře
        </button>
      </div>
    </div>
  );
}

function LTRCDetail({ booking }) {
  const room = booking.room;
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
    }}>
      <header style={{
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            Č. rezervace
          </div>
          <div style={{
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
            background: "var(--neutral-100)", padding: "3px 10px", borderRadius: 6, letterSpacing: "0.04em", marginTop: 4, display: "inline-block",
          }}>HB-LTR-2026-09128</div>
        </div>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6,
        }}>Kontaktovat property manažera</button>
      </header>
      <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 30px" }}>
        <LTRCRow icon="bed" label="Byt" value={`${room?.name} (č. ${room?.number})`} sub={`${room?.floor}. patro · ${room?.size} m²`} />
        <LTRCRow icon="calendar" label="Nájem" value={`${booking.moveIn} → ${booking.moveOut}`} sub={`${booking.length} měsíců · ${booking.rate?.name}`} />
        <LTRCRow icon="check" label="Měsíční nájem" value={`${fmtLTRC(booking.monthlyMin)}–${fmtLTRC(booking.monthlyMax)} Kč`} sub="Vč. energií a internetu" />
        <LTRCRow icon="voucher" label="Kauce" value={`${fmtLTRC(room?.deposit || 35000)} Kč`} sub="Vratná po skončení nájmu" />
      </div>
      <div style={{
        margin: "0 22px 22px", padding: "16px 18px", background: "var(--neutral-50)",
        border: "1px solid var(--border-soft)", borderRadius: 10,
      }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
          Stav plateb
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13.5 }}>
          <PayLine label="Rezervační poplatek" value={`${fmtLTRC(room?.bookingFee || 3000)} Kč`} status="paid" />
          <PayLine label="První nájem (září 2026)" value={`${fmtLTRC(booking.monthlyMin)} Kč`} status="pending" hint="Splatnost 25. 8. 2026" />
          <PayLine label="Vratná kauce" value={`${fmtLTRC(room?.deposit || 35000)} Kč`} status="pending" hint="Splatnost 25. 8. 2026" />
        </div>
      </div>
    </section>
  );
}

function LTRCRow({ icon, label, value, sub }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8, background: "var(--neutral-100)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--ink-3)",
      }}>
        <Icon name={icon} size={15} strokeWidth={1.8} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-1)", marginTop: 2 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function PayLine({ label, value, status, hint }) {
  const isPaid = status === "paid";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 20, height: 20, borderRadius: "50%",
          background: isPaid ? "var(--accent)" : "var(--neutral-100)", color: isPaid ? "white" : "var(--ink-3)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {isPaid ? <Icon name="check" size={12} strokeWidth={2.8} /> : <Icon name="info" size={12} strokeWidth={2.2} />}
        </span>
        <div>
          <div style={{ color: "var(--ink-1)", fontWeight: 600 }}>{label}</div>
          {hint && <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{hint}</div>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{value}</span>
        <span style={{
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "3px 7px", borderRadius: 4,
          background: isPaid ? "var(--accent-tint)" : "#FFF7E6",
          color: isPaid ? "var(--accent-dark)" : "#7A4A0F",
        }}>{isPaid ? "Zaplaceno" : "Čekající"}</span>
      </div>
    </div>
  );
}

function MoveInChecklist() {
  const items = [
    { when: "Do 7 dnů", title: "Podepište smlouvu", sub: "Vytisknete, podepíšete a pošlete sken zpět na rezervace@balicky.cz. Originál odevzdáte při nástupu." },
    { when: "Do 7 dnů", title: "Nahrajte ID dokument", sub: "Pokud jste tak ještě neudělali — nutné pro vystavení smlouvy." },
    { when: "Do 30 dnů", title: "Připravte složení kauce a prvního nájmu", sub: "Pokyny pro převod přijdou e-mailem 30 dní před nástupem." },
    { when: "Den před nástupem", title: "Domluvte si čas předání klíčů", sub: "Property manažer Vás kontaktuje SMS — flexibilní čas 9:00–20:00." },
    { when: "V den nástupu", title: "Předání bytu a klíčů", sub: "Společné prohlídky, sepsání protokolu o stavu, odečet měřičů. Cca 30 minut." },
  ];
  return (
    <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px" }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 16px", letterSpacing: "-0.005em",
      }}>Co Vás čeká do nástupu</h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
        <span aria-hidden="true" style={{
          position: "absolute", left: 17, top: 16, bottom: 16, width: 2, background: "var(--border)",
        }} />
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", position: "relative" }}>
            <span style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "white", border: "2px solid var(--border)", color: "var(--ink-3)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              zIndex: 1, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
            }}>{i + 1}</span>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--brand)" }}>{it.when}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-1)", marginTop: 2 }}>{it.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.5 }}>{it.sub}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PropertyContact() {
  return (
    <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px" }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 14px", letterSpacing: "-0.005em",
      }}>Váš property manažer</h2>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{
          width: 60, height: 60, borderRadius: "50%", background: "var(--brand)", color: "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20,
        }}>MN</span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>Markéta Nováková</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>Property manažerka · CJ, EN, DE</div>
          <div style={{ marginTop: 10, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13.5 }}>
            <a href="tel:+420234567890" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", textDecoration: "none", fontWeight: 700 }}>
              <Icon name="info" size={14} strokeWidth={2} />
              +420 777 123 456
            </a>
            <a href="mailto:marketa@balicky.cz" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", textDecoration: "none", fontWeight: 700 }}>
              <Icon name="check" size={14} strokeWidth={2} />
              marketa@balicky.cz
            </a>
            <a href="#" onClick={e => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand)", textDecoration: "none", fontWeight: 700 }}>
              <Icon name="users" size={14} strokeWidth={2} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticalInfo() {
  return (
    <section style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px" }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 14px", letterSpacing: "-0.005em",
      }}>Praktické informace</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <InfoBlock title="Adresa" icon="view">
          Hotel Balický · LTR<br/>
          Václavské náměstí 12<br/>
          110 00 Praha 1
          <a href="#" onClick={e => e.preventDefault()} style={{ display: "block", marginTop: 6, color: "var(--brand)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            Otevřít v mapách →
          </a>
        </InfoBlock>
        <InfoBlock title="Doprava" icon="voucher">
          Metro A · Můstek (3 min pěšky)<br/>
          Tram 9, 22 · Václavské nám.<br/>
          Parking pod hotelem 2 500 Kč/měs.
        </InfoBlock>
        <InfoBlock title="Co je v ceně" icon="check">
          Energie (elektřina, plyn, voda)<br/>
          Internet 1 Gbps<br/>
          Úklid společných prostor<br/>
          Údržba a opravy
        </InfoBlock>
        <InfoBlock title="Servis 24/7" icon="info">
          Recepce · 24/7<br/>
          Property manažer · po–pá 9:00–18:00<br/>
          Nouzové opravy · vždy
        </InfoBlock>
      </div>
    </section>
  );
}

function InfoBlock({ title, icon, children }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span style={{
        width: 36, height: 36, borderRadius: 8, background: "var(--neutral-100)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--ink-2)",
      }}>
        <Icon name={icon} size={16} strokeWidth={1.8} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-1)" }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.55 }}>{children}</div>
      </div>
    </div>
  );
}

function ReferralLTR() {
  return (
    <section style={{
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 8%, white), color-mix(in oklch, var(--brand) 3%, white))",
      border: "1px solid color-mix(in oklch, var(--brand) 16%, white)", borderRadius: 12,
      padding: "22px 24px", display: "flex", alignItems: "center", gap: 18,
    }}>
      <span style={{ fontSize: 36, lineHeight: 1 }}>🎁</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>
          Doporučte spolubydlícího — sleva 1 měsíční nájem
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
          Pokud Vám doporučíte kamaráda, který si rezervuje na 6+ měsíců, dostane každý z Vás slevu 1 měsíční nájem.
        </div>
      </div>
      <button style={{
        appearance: "none", border: "1.5px solid var(--brand)", background: "white", cursor: "pointer",
        color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
        padding: "10px 16px", borderRadius: 8, whiteSpace: "nowrap",
      }}>Získat odkaz</button>
    </section>
  );
}

function AppLTRConfirmation() {
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const booking = window.LTR_BOOKING || {
    room: window.LTR_ROOMS?.[0],
    rate: window.LTR_ROOMS?.[0]?.rates?.[1] || window.LTR_ROOMS?.[0]?.rates?.[0],
    moveIn: "1. září 2026",
    moveOut: "31. května 2027",
    length: 9,
    monthlyMin: 16800,
    monthlyMax: 18480,
  };

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <LTRCNav />
      {/* Progress complete */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          {[
            { id: 1, label: "Výběr bytu" },
            { id: 2, label: "Vaše údaje a platba" },
            { id: 3, label: "Potvrzení a smlouva" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="check" size={15} strokeWidth={2.8} />
                </span>
                <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>{s.label}</span>
              </div>
              {i < arr.length - 1 && <span style={{ flex: 1, height: 2, borderRadius: 1, background: "var(--accent)" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 32px 80px", display: "flex", flexDirection: "column", gap: 18 }}>
        <LTRCSuccessHero />
        <LTRCDetail booking={booking} />
        <MoveInChecklist />
        <PropertyContact />
        <PracticalInfo />
        <ReferralLTR />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLTRConfirmation />);
