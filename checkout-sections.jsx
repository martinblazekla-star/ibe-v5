// Checkout main app — uses checkout-primitives.jsx

function LoyaltyBanner() {
  const [collapsed, setCollapsed] = React.useState(false);
  if (collapsed) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 8%, white), color-mix(in oklch, var(--brand) 3%, white))",
      border: "1px solid color-mix(in oklch, var(--brand) 18%, white)", borderRadius: 12,
      padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
    }}>
      <span style={{
        width: 44, height: 44, borderRadius: 10, background: "white",
        border: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flexShrink: 0,
      }}>
        <Icon name="sparkle" size={22} strokeWidth={2} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink-1)" }}>
          Staňte se členem Balický Club a ušetřete 5 % na této rezervaci
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.45 }}>
          Registrace zdarma · sleva platí ihned · navíc body za každý pobyt, pozdní check-out zdarma a další výhody.
        </div>
      </div>
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
        padding: "10px 16px", borderRadius: 8, letterSpacing: "0.02em",
      }}>Zaregistrovat se</button>
      <button onClick={() => setCollapsed(true)} aria-label="Zavřít" style={{
        appearance: "none", border: "none", background: "transparent", cursor: "pointer",
        color: "var(--ink-3)", padding: 4,
      }}>
        <Icon name="x" size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = React.useState({
    firstName: "", lastName: "", email: "", phone: "",
    country: "CZ", lang: "cs", street: "", city: "", zip: "",
  });
  const set = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <CheckoutSection num="1" title="Kontaktní údaje" sub="Pošleme vám na ně potvrzení rezervace.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Jméno" required><Input value={form.firstName} onChange={set("firstName")} placeholder="Jan" /></Field>
        <Field label="Příjmení" required><Input value={form.lastName} onChange={set("lastName")} placeholder="Novák" /></Field>
        <Field label="E-mail" required hint="Pošleme sem voucher"><Input type="email" value={form.email} onChange={set("email")} placeholder="jan.novak@example.cz" /></Field>
        <Field label="Telefon" required hint="Pro rychlou komunikaci"><Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+420 777 123 456" /></Field>
        <Field label="Země" required>
          <Select value={form.country} onChange={set("country")}>
            <option value="CZ">Česká republika</option>
            <option value="SK">Slovensko</option>
            <option value="DE">Německo</option>
            <option value="AT">Rakousko</option>
            <option value="PL">Polsko</option>
            <option value="HU">Maďarsko</option>
          </Select>
        </Field>
        <Field label="Jazyk komunikace">
          <Select value={form.lang} onChange={set("lang")}>
            <option value="cs">Čeština</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </Select>
        </Field>
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "var(--neutral-50)", borderRadius: 8, border: "1px solid var(--border-soft)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink-1)", cursor: "pointer" }}>
          <span style={{
            width: 16, height: 16, borderRadius: 4, border: "1.5px solid var(--border)",
            background: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}></span>
          <span>Fakturační adresa je jiná než kontaktní</span>
        </label>
      </div>
    </CheckoutSection>
  );
}

function BookingForSection() {
  const [forWhom, setForWhom] = React.useState("self");
  return (
    <CheckoutSection num="2" title="Pro koho rezervujete?" sub="Pokud rezervujete pro jinou osobu, doplníme jméno hosta.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { id: "self", label: "Rezervuji pro sebe", sub: "Použijeme údaje z kontaktu" },
          { id: "other", label: "Rezervuji pro jinou osobu", sub: "Zadám jméno hosta" },
        ].map(opt => {
          const selected = forWhom === opt.id;
          return (
            <label key={opt.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
              border: `1.5px solid ${selected ? "var(--brand)" : "var(--border)"}`,
              background: selected ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${selected ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{selected && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{opt.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{opt.sub}</div>
              </div>
            </label>
          );
        })}
      </div>
      {forWhom === "other" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <Field label="Jméno hosta" required><Input value="" onChange={() => {}} placeholder="Jméno" /></Field>
          <Field label="Příjmení hosta" required><Input value="" onChange={() => {}} placeholder="Příjmení" /></Field>
        </div>
      )}
    </CheckoutSection>
  );
}

function AddonsSection() {
  const items = [
    { id: "parking", icon: "voucher", label: "Parkování v garáži", sub: "250 Kč / noc · max 1 vozidlo", price: 500, deltaText: "+ 500 Kč", hint: "Kapacita omezena" },
    { id: "welcome", icon: "sparkle", label: "Welcome drink na pokoji", sub: "Lahev sektu Bohemia + ovoce při příjezdu", price: 590, deltaText: "+ 590 Kč" },
    { id: "late", icon: "calendar", label: "Pozdní check-out do 14:00", sub: "Podléhá dostupnosti", price: 800, deltaText: "+ 800 Kč" },
    { id: "wellness", icon: "leaf", label: "60 min wellness pro 2", sub: "Sauna, vířivka, pára", price: 1200, deltaText: "+ 1 200 Kč", popular: true },
  ];
  const [selected, setSelected] = React.useState({});
  const toggle = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  return (
    <CheckoutSection num="3" title="Vylepšete svůj pobyt" sub="Volitelné doplňky se přičtou k celkové ceně. Můžete přidat i později.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map(a => {
          const on = !!selected[a.id];
          return (
            <button key={a.id} onClick={() => toggle(a.id)} style={{
              appearance: "none", cursor: "pointer", textAlign: "left",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, padding: "14px 16px",
              fontFamily: "var(--font-ui)",
              display: "flex", alignItems: "flex-start", gap: 12, position: "relative",
            }}>
              {a.popular && (
                <span style={{
                  position: "absolute", top: -8, right: 12,
                  fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: "white",
                  background: "var(--accent)", padding: "3px 8px", borderRadius: 4,
                }}>Oblíbené</span>
              )}
              <span style={{
                width: 20, height: 20, borderRadius: 5,
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                background: on ? "var(--brand)" : "white", marginTop: 2,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <Icon name="check" size={13} color="white" strokeWidth={3} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name={a.icon} size={15} color="var(--ink-3)" strokeWidth={1.8} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{a.label}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{a.sub}</div>
                {a.hint && <div style={{ fontSize: 11.5, color: "var(--brand)", marginTop: 4, fontWeight: 600 }}>{a.hint}</div>}
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)", whiteSpace: "nowrap" }}>{a.deltaText}</span>
            </button>
          );
        })}
      </div>
    </CheckoutSection>
  );
}

function SpecialRequests() {
  const [val, setVal] = React.useState("");
  return (
    <CheckoutSection num="4" title="Speciální požadavky" sub="Pokusíme se vyhovět, ale nejsou závazně garantované.">
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3}
        placeholder="Např. tichý pokoj, vyšší patro, alergie..."
        style={{
          width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
          padding: "11px 14px", fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-1)",
          background: "white", outline: "none", resize: "vertical",
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {["Tichý pokoj", "Vyšší patro", "Manželská postel", "Bezbariérový pokoj", "Brzký check-in"].map(tag => (
          <button key={tag} onClick={() => setVal(v => v ? `${v}, ${tag}` : tag)} style={{
            appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)",
            padding: "5px 11px", borderRadius: 999,
          }}>+ {tag}</button>
        ))}
      </div>
    </CheckoutSection>
  );
}

function PaymentSection() {
  const [method, setMethod] = React.useState("card");
  const methods = [
    { id: "card", label: "Platební karta", sub: "Visa, Mastercard, AMEX · platba ihned", icon: "voucher" },
    { id: "applepay", label: "Apple Pay / Google Pay", sub: "Rychlá platba mobilem", icon: "sparkle" },
    { id: "bank", label: "Bankovní převod", sub: "Pokyny zašleme e-mailem", icon: "info" },
    { id: "onsite", label: "Platba na místě", sub: "Při příjezdu · vyžaduje předautorizaci karty", icon: "calendar" },
  ];
  return (
    <CheckoutSection num="5" title="Způsob platby" sub="Platba je zabezpečená a šifrovaná. Karta se autorizuje, finální cena se strhne podle storno podmínek.">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {methods.map(m => {
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
              <Icon name={m.icon} size={20} color="var(--ink-3)" strokeWidth={1.8} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{m.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{m.sub}</div>
              </div>
            </label>
          );
        })}
      </div>
      {method === "card" && (
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          <Field label="Číslo karty" required><Input value="" onChange={() => {}} placeholder="1234 5678 9012 3456" /></Field>
          <Field label="Platnost" required><Input value="" onChange={() => {}} placeholder="MM / YY" /></Field>
          <Field label="CVV" required><Input value="" onChange={() => {}} placeholder="123" /></Field>
        </div>
      )}
    </CheckoutSection>
  );
}

function ConsentsAndCTA({ total }) {
  const [terms, setTerms] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "22px 24px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Check value={terms} onChange={setTerms} required>
          Souhlasím s <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>obchodními podmínkami</a>,{" "}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>storno podmínkami</a> a{" "}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)" }}>ochranou osobních údajů</a>.
        </Check>
        <Check value={marketing} onChange={setMarketing}>
          Mám zájem o občasné newslettery s nabídkami a výhodami pro stálé hosty (max 1× měsíčně, lze kdykoli odhlásit).
        </Check>
      </div>
      <button disabled={!terms}
        onClick={() => { if (terms) window.location.href = "Confirmation.html"; }}
        style={{
        marginTop: 18, width: "100%", appearance: "none", border: "none",
        cursor: terms ? "pointer" : "not-allowed",
        background: terms ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
        opacity: terms ? 1 : 0.55,
        color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
        padding: "16px 20px", borderRadius: 10, letterSpacing: "0.01em",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <Icon name="check" size={18} strokeWidth={2.6} />
        Závazně rezervovat za {fmtC(total)} Kč
      </button>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
        <Trust2>Bezpečná platba SSL</Trust2>
        <Trust2>Bez rezervačních poplatků</Trust2>
        <Trust2>Storno zdarma do 19. dubna 2026</Trust2>
      </div>
    </div>
  );
}

function Check({ value, onChange, required, children }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.5 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 4, marginTop: 1, flexShrink: 0,
        border: `1.5px solid ${value ? "var(--brand)" : "var(--border)"}`,
        background: value ? "var(--brand)" : "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }} onClick={() => onChange(!value)}>{value && <Icon name="check" size={12} color="white" strokeWidth={3} />}</span>
      <span>{children} {required && <span style={{ color: "#A6151D" }}>*</span>}</span>
    </label>
  );
}

function Trust2({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-2)" }}>
      <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

window.LoyaltyBanner = LoyaltyBanner;
window.ContactSection = ContactSection;
window.BookingForSection = BookingForSection;
window.AddonsSection = AddonsSection;
window.SpecialRequests = SpecialRequests;
window.PaymentSection = PaymentSection;
window.ConsentsAndCTA = ConsentsAndCTA;
