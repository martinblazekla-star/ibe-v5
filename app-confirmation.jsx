// Confirmation page — post-purchase, conversion for return visits

const TWEAK_DEFAULTS_CF = /*EDITMODE-BEGIN*/{
  "showLoyalty": true,
  "showReferral": true,
  "showTimeline": true,
  "showUpsell": true
}/*EDITMODE-END*/;

function fmtCF(n) { return n.toLocaleString("cs-CZ"); }

function NavCF() {
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

function SuccessHero() {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 14,
      padding: "36px 40px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 32, alignItems: "center",
      boxShadow: "0 2px 14px rgba(16,24,40,.04)",
    }}>
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 11px", borderRadius: 999,
          background: "var(--accent-tint)", color: "var(--accent-dark)",
          fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          <Icon name="check" size={14} strokeWidth={2.8} />
          Rezervace potvrzena
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
          margin: "12px 0 4px", letterSpacing: "-0.015em", lineHeight: 1.15,
        }}>
          Děkujeme, Jane.<br/>Těšíme se na Vás.
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-2)", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 560 }}>
          Potvrzení rezervace jsme odeslali na <strong style={{ color: "var(--ink-1)" }}>jan.novak@example.cz</strong>. Můžete si stáhnout voucher nebo přidat pobyt do kalendáře.
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
            Stáhnout voucher (PDF)
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
          <button style={{
            appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
            color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
            padding: "11px 16px", borderRadius: 8,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <Icon name="users" size={15} strokeWidth={1.8} />
            Sdílet rezervaci
          </button>
        </div>
      </div>
      {/* QR placeholder */}
      <div style={{
        width: 160, height: 160, borderRadius: 12, background: "white",
        border: "1px solid var(--border)", padding: 10, flexShrink: 0,
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: 8,
          backgroundImage: `
            linear-gradient(45deg, var(--ink-1) 25%, transparent 25%),
            linear-gradient(-45deg, var(--ink-1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, var(--ink-1) 75%),
            linear-gradient(-45deg, transparent 75%, var(--ink-1) 75%)
          `,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              padding: "6px 10px", background: "white", border: "1px solid var(--ink-1)", borderRadius: 6,
              fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, color: "var(--ink-1)", letterSpacing: "0.05em",
            }}>VOUCHER</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationDetails() {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
    }}>
      <header style={{
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--ink-3)",
          }}>Detail rezervace</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)" }}>
              Č. rezervace
            </span>
            <span style={{
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
              background: "var(--neutral-100)", padding: "3px 10px", borderRadius: 6, letterSpacing: "0.04em",
            }}>HB-2026-58291</span>
          </div>
        </div>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6,
        }}>Upravit rezervaci</button>
      </header>
      <div style={{ padding: "20px 20px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 30px" }}>
        <DetailRow icon="calendar" label="Příjezd" value="Pá 15. května 2026" sub="Check-in od 15:00" />
        <DetailRow icon="calendar" label="Odjezd" value="Ne 17. května 2026" sub="Check-out do 11:00" />
        <DetailRow icon="users" label="Hosté" value="2 dospělí · 0 dětí" sub="Jan Novák" />
        <DetailRow icon="bed" label="Pokoj" value="Dvoulůžkový Deluxe (č. 107)" sub="King size · 30 m² · výhled do zahrady" />
        <DetailRow icon="check" label="Sazba" value="Flexibilní cena" sub="Snídaně v ceně" />
        <DetailRow icon="check" label="Storno podmínky" value="Zrušení zdarma" sub="do 19. dubna 2026" accent />
      </div>
      <div style={{ padding: "16px 20px", margin: "16px 20px 20px", background: "var(--neutral-50)", borderRadius: 10, border: "1px solid var(--border-soft)" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
        }}>Cenový souhrn</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5 }}>
          <PriceLine label="Ubytování · 2 noci" value="9 800 Kč" />
          <PriceLine label="Welcome drink na pokoji" value="590 Kč" />
          <PriceLine label="Krytá garáž · 2 noci" value="700 Kč" />
          <PriceLine label="Daně a poplatky" value="v ceně" muted />
        </div>
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Zaplaceno celkem</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
            11 090 Kč
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          Platba zpracována kartou •••• 4242
        </div>
      </div>
    </section>
  );
}

function DetailRow({ icon, label, value, sub, accent }) {
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
        <div style={{ fontSize: 14.5, fontWeight: 600, color: accent ? "var(--accent-dark)" : "var(--ink-1)", marginTop: 2 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function PriceLine({ label, value, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: muted ? "var(--ink-3)" : "var(--ink-2)" }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: muted ? "var(--ink-3)" : "var(--ink-1)" }}>{value}</span>
    </div>
  );
}

function Timeline() {
  const items = [
    { when: "Hned teď", title: "Potvrzení v e-mailu", sub: "Voucher a faktura jsou v příloze", icon: "check", done: true },
    { when: "7 dní před příjezdem", title: "Připomínka a check-in tipy", sub: "Doporučíme restaurace a aktivity v okolí", icon: "calendar" },
    { when: "Den před příjezdem", title: "Online check-in", sub: "Vyplníte formulář předem — minete frontu na recepci", icon: "voucher" },
    { when: "V den příjezdu", title: "Přivítáme Vás v Balickém", sub: "Welcome drink na recepci · check-in od 15:00", icon: "sparkle" },
  ];
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "22px 24px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 16px", letterSpacing: "-0.005em",
      }}>Co se bude dít dál</h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
        <span aria-hidden="true" style={{
          position: "absolute", left: 17, top: 16, bottom: 16, width: 2, background: "var(--border)",
        }} />
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", position: "relative" }}>
            <span style={{
              width: 36, height: 36, borderRadius: "50%",
              background: it.done ? "var(--accent)" : "white",
              border: it.done ? "none" : "2px solid var(--border)",
              color: it.done ? "white" : "var(--ink-3)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              zIndex: 1,
            }}>
              <Icon name={it.icon} size={16} strokeWidth={2.2} />
            </span>
            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{it.when}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-1)", marginTop: 2 }}>{it.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.4 }}>{it.sub}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PostUpsell() {
  const items = [
    { icon: "🚗", name: "Letištní transfer", sub: "Z PRG · 1 290 Kč / směr", cta: "Přidat" },
    { icon: "⏰", name: "Časný check-in od 12:00", sub: "Garantovaný · 500 Kč", cta: "Přidat" },
    { icon: "💆", name: "Klasická masáž 60 min", sub: "Jeden volný slot 16. 5. · 1 290 Kč", cta: "Rezervovat" },
  ];
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: 0, letterSpacing: "-0.005em",
      }}>Vylepšete svůj pobyt</h2>
      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
        Máte ještě čas. Cokoli zde přidáte připíšeme na Vaši rezervaci.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 8, minHeight: 130,
          }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{it.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{it.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>{it.sub}</div>
            </div>
            <button style={{
              marginTop: "auto", appearance: "none", border: "1.5px solid var(--brand)", background: "white", cursor: "pointer",
              color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
              padding: "8px 12px", borderRadius: 8,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon name="plus" size={13} strokeWidth={2.6} />
              {it.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function HotelInfo() {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 14px", letterSpacing: "-0.005em",
      }}>Praktické informace</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <InfoBlock title="Adresa hotelu" icon="view">
          Hotel Balický<br/>
          Václavské náměstí 12<br/>
          110 00 Praha 1
          <a href="#" onClick={e => e.preventDefault()} style={{ display: "block", marginTop: 6, color: "var(--brand)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            Otevřít v mapách →
          </a>
        </InfoBlock>
        <InfoBlock title="Recepce" icon="users">
          +420 234 567 890<br/>
          rezervace@balicky.cz<br/>
          24/7 česky, anglicky, německy
        </InfoBlock>
        <InfoBlock title="Doprava" icon="voucher">
          Metro A · Můstek (3 min pěšky)<br/>
          PRG letiště · 25 min taxi<br/>
          Parking pod hotelem zarezervován
        </InfoBlock>
        <InfoBlock title="Důležité časy" icon="calendar">
          Check-in: od 15:00<br/>
          Check-out: do 11:00<br/>
          Snídaně: 6:30 — 10:30
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

function LoyaltyBlock() {
  return (
    <div style={{
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 10%, white), color-mix(in oklch, var(--brand) 4%, white))",
      border: "1px solid color-mix(in oklch, var(--brand) 18%, white)", borderRadius: 12,
      padding: "22px 24px", display: "flex", alignItems: "center", gap: 18,
    }}>
      <span style={{
        width: 56, height: 56, borderRadius: 12, background: "var(--brand)", color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon name="sparkle" size={26} strokeWidth={2} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>
          Vytvořte si účet a získejte zpětně 5 % z této rezervace
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
          Registrace zdarma · body za pobyt · pozdní check-out a další výhody pro stálé hosty.
        </div>
      </div>
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "12px 20px", borderRadius: 8, letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}>Zaregistrovat se</button>
    </div>
  );
}

function ReferralBlock() {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "22px 24px", display: "flex", alignItems: "center", gap: 18,
    }}>
      <span style={{ fontSize: 38, lineHeight: 1 }}>🎁</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>
          Doporučte hotel přátelům — oba dostanete 500 Kč
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
          Po jejich první rezervaci připíšeme každému z vás kredit 500 Kč na další pobyt.
        </div>
      </div>
      <button style={{
        appearance: "none", border: "1.5px solid var(--brand)", background: "white", cursor: "pointer",
        color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "11px 18px", borderRadius: 8, whiteSpace: "nowrap",
      }}>Získat odkaz</button>
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      marginTop: 36, padding: "24px 0", borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)",
    }}>
      <div>Powered by IBE v4 · © Hotel Balický</div>
      <div style={{ display: "flex", gap: 18 }}>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Storno podmínky</a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Obchodní podmínky</a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Ochrana osobních údajů</a>
      </div>
    </div>
  );
}

function AppCF() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_CF);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <NavCF />
      {/* Progress complete */}
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          {[
            { id: 1, label: "Výběr ubytování" },
            { id: 2, label: "Vaše údaje a platba" },
            { id: 3, label: "Potvrzení rezervace" },
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
        <SuccessHero />
        <ReservationDetails />
        {t.showTimeline && <Timeline />}
        {t.showUpsell && <PostUpsell />}
        <HotelInfo />
        {t.showLoyalty && <LoyaltyBlock />}
        {t.showReferral && <ReferralBlock />}
        <Footer />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Sekce stránky">
          <TweakToggle label="Co se bude dít dál (timeline)" value={t.showTimeline} onChange={v => setTweak("showTimeline", v)} />
          <TweakToggle label="Post-purchase upsell" value={t.showUpsell} onChange={v => setTweak("showUpsell", v)} />
          <TweakToggle label="Loyalty registrace" value={t.showLoyalty} onChange={v => setTweak("showLoyalty", v)} />
          <TweakToggle label="Referral program" value={t.showReferral} onChange={v => setTweak("showReferral", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppCF />);
