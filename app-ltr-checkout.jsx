// LTR Checkout — streamlined, friction-free, single page
// Differences from standard checkout:
// - Monthly price headline (not total)
// - Deposit + booking fee called out distinctly
// - Identity verification (passport/ID upload)
// - Student status check (ISIC)
// - NO upsell wellness/welcome drink — long-term renters don't need it
// - Pay ONLY the booking fee now, deposit + first rent due 7 days before move-in

const { useState: useStateLTC } = React;

const TWEAK_DEFAULTS_LTC = /*EDITMODE-BEGIN*/{
  "showStudent": true
}/*EDITMODE-END*/;

// Mock booking
window.LTR_BOOKING = {
  room: window.LTR_ROOMS?.[0],
  rate: window.LTR_ROOMS?.[0]?.rates?.[1] || window.LTR_ROOMS?.[0]?.rates?.[0],
  moveIn: "1. září 2026",
  moveOut: "31. května 2027",
  length: 9,
  monthlyMin: 16800,
  monthlyMax: 18480,
};

function fmtLTC(n) { return n.toLocaleString("cs-CZ"); }

function LTCNav() {
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
          Bezpečná platba SSL
        </span>
        <span>+420 234 567 890</span>
      </div>
    </nav>
  );
}

function LTCProgress() {
  const steps = [
    { id: 1, label: "Výběr bytu", done: true },
    { id: 2, label: "Vaše údaje a platba", active: true },
    { id: 3, label: "Potvrzení a smlouva", future: true },
  ];
  return (
    <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "20px 32px" }}>
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
              }}>{s.done ? <Icon name="check" size={15} strokeWidth={2.8} /> : s.id}</span>
              <span style={{
                fontFamily: "var(--font-ui)", fontWeight: s.active ? 700 : 600, fontSize: 14,
                color: s.active ? "var(--ink-1)" : "var(--ink-2)",
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ flex: 1, height: 2, borderRadius: 1, background: steps[i + 1].future ? "var(--border)" : "var(--accent)" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LTCSection({ num, title, sub, children }) {
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

function LTCInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
        padding: "11px 14px", fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-1)",
        background: "white", outline: "none",
      }}
    />
  );
}

function LTCField({ label, hint, required, children }) {
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

function ContactInfo() {
  const [f, setF] = useStateLTC({ first: "", last: "", email: "", phone: "", dob: "", citizenship: "CZ" });
  const set = (k) => (v) => setF(prev => ({ ...prev, [k]: v }));
  return (
    <LTCSection num="1" title="Kontaktní údaje" sub="Pošleme vám smlouvu a klíče.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <LTCField label="Jméno" required><LTCInput value={f.first} onChange={set("first")} placeholder="Jan" /></LTCField>
        <LTCField label="Příjmení" required><LTCInput value={f.last} onChange={set("last")} placeholder="Novák" /></LTCField>
        <LTCField label="E-mail" required><LTCInput type="email" value={f.email} onChange={set("email")} placeholder="jan.novak@example.cz" /></LTCField>
        <LTCField label="Telefon" required><LTCInput type="tel" value={f.phone} onChange={set("phone")} placeholder="+420 777 123 456" /></LTCField>
        <LTCField label="Datum narození" required><LTCInput type="date" value={f.dob} onChange={set("dob")} placeholder="" /></LTCField>
        <LTCField label="Občanství" required>
          <select value={f.citizenship} onChange={(e) => set("citizenship")(e.target.value)} style={{
            width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
            padding: "11px 38px 11px 14px", fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-1)",
            background: "white", cursor: "pointer",
            backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
            backgroundPosition: "calc(100% - 18px) 50%, calc(100% - 13px) 50%",
            backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
          }}>
            <option value="CZ">Česká republika</option>
            <option value="SK">Slovensko</option>
            <option value="EU">Občan EU</option>
            <option value="OTHER">Jiné (mimo EU)</option>
          </select>
        </LTCField>
      </div>
    </LTCSection>
  );
}

function StudentCheck() {
  const [isStudent, setIsStudent] = useStateLTC("yes");
  return (
    <LTCSection num="2" title="Jste student?" sub="ISIC sleva platí pro denní studenty s platným průkazem.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { id: "yes", label: "Ano, mám platný ISIC", sub: "Sleva 7 % na měsíčním nájmu" },
          { id: "no", label: "Ne", sub: "Standardní sazba" },
        ].map(o => {
          const on = isStudent === o.id;
          return (
            <label key={o.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{o.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{o.sub}</div>
              </div>
            </label>
          );
        })}
      </div>
      {isStudent === "yes" && (
        <div style={{ marginTop: 14 }}>
          <LTCField label="Číslo ISIC karty" hint="Ověříme online před nástupem" required>
            <LTCInput value="" onChange={() => {}} placeholder="CZ 250 9999 ..." />
          </LTCField>
        </div>
      )}
    </LTCSection>
  );
}

function IdentityVerification() {
  return (
    <LTCSection num="3" title="Doklad totožnosti" sub="Pro uzavření nájemní smlouvy potřebujeme kopii dokladu. Šifrováno, mazáno po skončení nájmu.">
      <div style={{
        border: "1.5px dashed var(--border)", borderRadius: 10, padding: "22px 18px",
        textAlign: "center", background: "var(--neutral-50)",
      }}>
        <Icon name="image" size={26} color="var(--ink-3)" strokeWidth={1.6} />
        <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>
          Přetáhněte sem foto OP / pasu
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
          nebo <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)", fontWeight: 700 }}>vyberte ze zařízení</a> · JPG, PNG, PDF do 8 MB
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
        Můžete také nahrát později z e-mailu, který obdržíte. Smlouva bude vystavena až po ověření.
      </div>
    </LTCSection>
  );
}

function PaymentSection() {
  const [method, setMethod] = useStateLTC("card");
  return (
    <LTCSection num="4" title="Platba rezervačního poplatku" sub="Nyní hradíte pouze rezervační poplatek 3 000 Kč. Kauce + první nájem 7 dní před nástupem.">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { id: "card", label: "Platební karta", sub: "Visa, Mastercard, AMEX" },
          { id: "applepay", label: "Apple Pay / Google Pay", sub: "Rychlá platba" },
          { id: "bank", label: "Bankovní převod", sub: "Pokyny zašleme e-mailem" },
        ].map(m => {
          const on = method === m.id;
          return (
            <label key={m.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{m.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{m.sub}</div>
              </div>
            </label>
          );
        })}
      </div>
      {method === "card" && (
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          <LTCField label="Číslo karty" required><LTCInput value="" onChange={() => {}} placeholder="1234 5678 9012 3456" /></LTCField>
          <LTCField label="Platnost" required><LTCInput value="" onChange={() => {}} placeholder="MM / YY" /></LTCField>
          <LTCField label="CVV" required><LTCInput value="" onChange={() => {}} placeholder="123" /></LTCField>
        </div>
      )}
    </LTCSection>
  );
}

function ConsentsCTA({ booking }) {
  const [terms, setTerms] = useStateLTC(false);
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px" }}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.5 }}>
        <span onClick={() => setTerms(!terms)} style={{
          width: 18, height: 18, borderRadius: 4, marginTop: 1, flexShrink: 0,
          border: `1.5px solid ${terms ? "var(--brand)" : "var(--border)"}`,
          background: terms ? "var(--brand)" : "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{terms && <Icon name="check" size={12} color="white" strokeWidth={3} />}</span>
        <span>
          Souhlasím s <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>nájemní smlouvou</a>,{" "}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>obchodními podmínkami</a> a{" "}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>ochranou osobních údajů</a>.{" "}
          <span style={{ color: "#A6151D" }}>*</span>
        </span>
      </label>
      <a href="LTR-Confirmation.html"
        onClick={(e) => { if (!terms) e.preventDefault(); }}
        style={{
          marginTop: 18, width: "100%", appearance: "none", border: "none",
          cursor: terms ? "pointer" : "not-allowed",
          background: terms ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
          opacity: terms ? 1 : 0.55,
          color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
          padding: "16px 20px", borderRadius: 10, letterSpacing: "0.01em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          textDecoration: "none",
        }}>
        <Icon name="check" size={18} strokeWidth={2.6} />
        Závazně rezervovat za {fmtLTC(booking.room?.bookingFee || 3000)} Kč
      </a>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap", fontSize: 12.5, color: "var(--ink-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Bezpečná platba SSL</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Storno do 14 dní zdarma</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Smlouva v ČJ i EN</span>
      </div>
    </div>
  );
}

function LTCSummary({ booking }) {
  const [breakdownOpen, setBreakdownOpen] = useStateLTC(false);
  const room = booking.room;
  return (
    <aside style={{
      position: "sticky", top: 20, alignSelf: "flex-start",
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(16,24,40,.04)",
    }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "color-mix(in oklch, var(--brand) 3%, white)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>Vaše rezervace</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
          {room?.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>č. {room?.number} · {room?.floor}. patro · {room?.size} m²</div>
      </div>

      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
        <SumLine icon="calendar">{booking.moveIn} → {booking.moveOut}</SumLine>
        <SumLine icon="bed">{booking.length} měsíců · {booking.rate?.name}</SumLine>
      </div>

      {/* Monthly headline */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Měsíční nájem
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)", letterSpacing: "-0.01em", lineHeight: 1.05, marginTop: 4 }}>
          {fmtLTC(booking.monthlyMin)}–{fmtLTC(booking.monthlyMax)} <span style={{ fontSize: 13, fontWeight: 600 }}>Kč/měs.</span>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>
          Cena se mírně liší podle topné sezóny. Energie a internet v ceně.
        </div>
        <button onClick={() => setBreakdownOpen(!breakdownOpen)} style={{
          appearance: "none", border: "none", background: "transparent", cursor: "pointer", padding: 0,
          marginTop: 8, fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 700,
          color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          {breakdownOpen ? "Skrýt rozpad ceny" : "Zobrazit rozpad po měsících"}
          <span style={{ display: "inline-block", transform: breakdownOpen ? "rotate(180deg)" : "none" }}>
            <Icon name="chevron-down" size={11} strokeWidth={2.4} />
          </span>
        </button>
        {breakdownOpen && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border-soft)", maxHeight: 220, overflowY: "auto" }}>
            {window.LTR_MONTHS.slice(0, booking.length).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}>
                <span style={{ color: "var(--ink-2)" }}>{m.name}{m.factor > 1.04 && " ❆"}</span>
                <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{fmtLTC(Math.round((booking.rate?.monthly || 16800) * m.factor))} Kč</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>Nájem celkem</span>
              <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>{fmtLTC(window.LTR_MONTHS.slice(0, booking.length).reduce((s, m) => s + Math.round((booking.rate?.monthly || 16800) * m.factor), 0))} Kč</span>
            </div>
          </div>
        )}
      </div>

      {/* What you pay now / later */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
          Co teď platíte
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", fontSize: 13 }}>
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>Rezervační poplatek</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>{fmtLTC(room?.bookingFee || 3000)} Kč</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>
          Jednorázový, nevratný po podpisu smlouvy.
        </div>
      </div>

      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
          Splatné 7 dní před nástupem
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
          <span style={{ color: "var(--ink-2)" }}>První nájem</span>
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{fmtLTC(booking.monthlyMin)} Kč</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
          <span style={{ color: "var(--ink-2)" }}>Vratná kauce</span>
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{fmtLTC(room?.deposit || 35000)} Kč</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.4 }}>
          Kauce je vratná po skončení nájmu (po protokolu).
        </div>
      </div>

      <div style={{ padding: "12px 18px", background: "var(--neutral-50)", display: "flex", flexDirection: "column", gap: 5 }}>
        <Trust3>Bez agentury · 0 % provize</Trust3>
        <Trust3>Smlouva v ČJ i EN</Trust3>
        <Trust3>Výpověď s 1 měsíční výpovědní lhůtou</Trust3>
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

function Trust3({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

function AppLTRCheckout() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_LTC);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  const booking = window.LTR_BOOKING;

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <LTCNav />
      <LTCProgress />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ContactInfo />
            {t.showStudent && <StudentCheck />}
            <IdentityVerification />
            <PaymentSection />
            <ConsentsCTA booking={booking} />
            <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5, padding: "0 20px" }}>
              Kliknutím potvrzujete rezervaci a souhlas s nájemní smlouvou. Smlouva v ČJ i EN přijde do hodiny e-mailem.
            </div>
          </div>
          <LTCSummary booking={booking} />
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Sekce">
          <TweakToggle label="Student / ISIC sekce" value={t.showStudent} onChange={v => setTweak("showStudent", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLTRCheckout />);
