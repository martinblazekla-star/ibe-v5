// Proposal flow steps after detail:
//   Step 2: Forms (proposal-specific data — guests, logistics)
//   Step 3: Checkout (contact + payment + signature + consents — IBE-styled)
//   Done:   Confirmation (standard IBE-style success page)

// ─────────────────────────────────────────────────────────────
// Step 2: Forms
function ProposalFormsStep({ scenario, variant, extras, formState, onChangeForm, onBack, onContinue }) {
  const forms = [
    {
      id: "guests",
      title: "Detaily o hostech",
      desc: "Potřebujeme znát alergie, omezení a preference vašich hostů, abychom mohli připravit menu.",
      fields: [
        { id: "leadName", label: "Kontaktní osoba", type: "text", required: true, placeholder: "Jméno a příjmení" },
        { id: "allergies", label: "Alergie a stravovací omezení (souhrnně)", type: "textarea", required: true, placeholder: "Např. 3× vegetariánská, 1× bezlepková…" },
        { id: "kids", label: "Mám s sebou děti do 12 let", type: "checkbox", required: false },
      ],
    },
    {
      id: "schedule",
      title: "Logistika a příjezd",
      desc: "Předběžné informace o příjezdu hostů, dopravě a parkování.",
      fields: [
        { id: "arrivalTime", label: "Předpokládaný čas příjezdu prvních hostů", type: "text", required: true, placeholder: "Např. 14:00" },
        { id: "transport", label: "Většina hostů přijede", type: "radio", required: true, options: ["Vlastním autem", "Hromadnou dopravou", "Smíšeně"] },
        { id: "notes", label: "Cokoli dalšího nám chcete sdělit?", type: "textarea", required: false, placeholder: "Speciální přání, požadavky na pokoje…" },
      ],
    },
  ];

  const totals = window.proposalTotals(variant.items);
  const extrasTotal = Object.entries(extras || {}).reduce((sum, [id, qty]) => {
    const ex = window.PROPOSAL_EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price * qty : 0);
  }, 0);
  const grandTotal = totals.gross + extrasTotal;

  return (
    <>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 28px" }}>
        <button onClick={onBack} style={{
          appearance: "none", border: "none", background: "transparent", cursor: "pointer",
          color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          display: "inline-flex", alignItems: "center", gap: 6, padding: 0,
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
            <Icon name="chevron-right" size={12} strokeWidth={2.4} />
          </span>
          Zpět na přehled nabídky
        </button>

        <h1 style={{
          margin: "10px 0 6px",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          letterSpacing: "-0.015em", lineHeight: 1.15,
        }}>Doplňující formuláře</h1>
        <div style={{ fontSize: 14.5, color: "var(--ink-2)", maxWidth: 680, lineHeight: 1.5 }}>
          Pro hladký průběh akce potřebujeme pár doplňujících informací. Vše lze upravit i později.
        </div>

        {/* Forms */}
        <section style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          {forms.map((f) => (
            <FormCard key={f.id} form={f} state={formState[f.id] || {}}
              onChange={(s) => onChangeForm(f.id, s)} />
          ))}
        </section>

        {/* Summary mini-bar */}
        <div style={{
          marginTop: 28, padding: "16px 20px", background: "white",
          border: "1px solid var(--border)", borderRadius: 12,
          display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
              {variant.name}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>
              {scenario.dateLabel} · {scenario.guests.adults + scenario.guests.children} osob · {scenario.rooms} pokojů
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>Celkem s DPH</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
              {window.fmtProposal(grandTotal)} Kč
            </div>
            {extrasTotal > 0 && <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>z toho extras +{window.fmtProposal(extrasTotal)} Kč</div>}
          </div>
        </div>
      </main>

      {/* Action bar */}
      <div style={{
        position: "sticky", bottom: 0, background: "white", borderTop: "1px solid var(--border)",
        padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
        boxShadow: "0 -4px 20px rgba(15,18,22,0.06)",
      }}>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          Krok 2 z 3 · Formuláře
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onBack} style={{
            appearance: "none", cursor: "pointer", border: "1px solid var(--border)",
            background: "white", color: "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
            padding: "11px 18px", borderRadius: 8,
          }}>Zpět</button>
          <button onClick={onContinue} style={{
            appearance: "none", cursor: "pointer", border: "none",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "12px 22px", borderRadius: 8, letterSpacing: "0.05em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            Pokračovat k platbě
            <Icon name="chevron-right" size={14} strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </>
  );
}

function FormCard({ form, state, onChange }) {
  const [open, setOpen] = React.useState(true);
  const filled = form.fields.filter((f) => f.required && !state[f.id]).length === 0;
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        appearance: "none", cursor: "pointer", border: "none", background: "transparent",
        width: "100%", padding: "16px 20px",
        display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center", textAlign: "left",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
            {form.title}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.5 }}>
            {form.desc}
          </div>
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 999,
          background: filled ? "var(--accent-tint)" : "#FFF7E6",
          color: filled ? "var(--accent-dark)" : "#7A4A0F",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>{filled ? "Vyplněno" : "Čeká"}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--ink-3)", display: "inline-flex" }}>
          <Icon name="chevron-down" size={14} strokeWidth={2.2} />
        </span>
      </button>
      {open && (
        <div style={{
          padding: "16px 20px 20px", borderTop: "1px solid var(--border-soft)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {form.fields.map((field) => (
            <FormField key={field.id} field={field} value={state[field.id]} onChange={(v) => onChange({ ...state, [field.id]: v })} />
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const labelEl = (
    <label style={{
      display: "block", marginBottom: 6,
      fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5, color: "var(--ink-2)",
    }}>
      {field.label}
      {field.required && <span style={{ color: "var(--brand)", marginLeft: 4 }}>*</span>}
    </label>
  );
  if (field.type === "checkbox") {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: "var(--brand)" }} />
        <span style={{ fontSize: 13.5, color: "var(--ink-1)" }}>{field.label}</span>
      </label>
    );
  }
  if (field.type === "radio") {
    return (
      <div>
        {labelEl}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {field.options.map((opt) => {
            const on = value === opt;
            return (
              <button key={opt} onClick={() => onChange(opt)} style={{
                appearance: "none", cursor: "pointer",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                background: on ? "color-mix(in oklch, var(--brand) 5%, white)" : "white",
                color: on ? "var(--brand)" : "var(--ink-1)",
                fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 600, fontSize: 13,
                padding: "8px 14px", borderRadius: 8,
              }}>{opt}</button>
            );
          })}
        </div>
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          value={value || ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", minHeight: 70, padding: "10px 12px",
            border: "1px solid var(--border)", borderRadius: 8,
            fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-1)",
            outline: "none", resize: "vertical",
          }}
        />
      </div>
    );
  }
  return (
    <div>
      {labelEl}
      <input type="text"
        value={value || ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 12px",
          border: "1px solid var(--border)", borderRadius: 8,
          fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-1)",
          outline: "none",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IBE-style section primitives (mirrored from checkout-primitives.jsx so the
// Proposal checkout uses the same visual language as the standard IBE)
function PSection({ title, sub, num, children }) {
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

function PField({ label, hint, required, children }) {
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

function PInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
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

// ─────────────────────────────────────────────────────────────
// Step 3: Checkout — uses IBE-style sections (contact / payment / signature /
// consents). Sticky summary on the right reflects the chosen variant + extras.
function ProposalCheckoutStep({ scenario, variant, extras, onBack, onComplete }) {
  const user = window.__loyaltyUser;
  const [billing, setBilling] = React.useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "+420 ",
    company: "",
    ico: "",
    street: "", city: "", zip: "",
    country: "CZ",
  });
  const [consents, setConsents] = React.useState({ terms: false, cancellation: false, marketing: false });
  const [paymentMode, setPaymentMode] = React.useState("deposit"); // deposit | full
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [signed, setSigned] = React.useState(false);

  const totals = window.proposalTotals(variant.items);
  const extrasTotal = Object.entries(extras || {}).reduce((sum, [id, qty]) => {
    const ex = window.PROPOSAL_EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price * qty : 0);
  }, 0);
  const grandTotal = totals.gross + extrasTotal;
  const payNow = paymentMode === "deposit" ? variant.deposit : grandTotal;

  const canSubmit = consents.terms && consents.cancellation && signed && billing.email && billing.firstName && billing.lastName;

  const paymentMethods = [
    { id: "card", label: "Platební karta", sub: "Visa, Mastercard, AMEX · platba ihned", icon: "voucher" },
    { id: "bank", label: "Bankovní převod", sub: "Faktura na e-mail · splatnost 5 dnů", icon: "info" },
    { id: "applepay", label: "Apple Pay / Google Pay", sub: "Rychlá platba mobilem", icon: "sparkle" },
    { id: "onsite", label: "Platba na místě", sub: "Při příjezdu · vyžaduje předautorizaci karty", icon: "calendar" },
  ];

  return (
    <main style={{
      maxWidth: 1180, margin: "0 auto", padding: "24px 32px 80px",
      display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start",
    }}>
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={onBack} style={{
          appearance: "none", border: "none", background: "transparent", cursor: "pointer",
          color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          display: "inline-flex", alignItems: "center", gap: 6, padding: 0,
          letterSpacing: "0.04em", textTransform: "uppercase", alignSelf: "flex-start",
        }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
            <Icon name="chevron-right" size={12} strokeWidth={2.4} />
          </span>
          Zpět k formulářům
        </button>

        <div>
          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
            letterSpacing: "-0.015em",
          }}>Potvrzení a platba</h1>
          <div style={{ fontSize: 14.5, color: "var(--ink-2)", marginTop: 4 }}>
            Zkontrolujte údaje, podepište souhlas a uhraďte zálohu. Pak je nabídka platná.
          </div>
        </div>

        {/* 1. Contact + billing */}
        <PSection num="1" title="Kontaktní a fakturační údaje" sub="Předvyplníme z loyalty profilu, můžete upravit.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <PField label="Jméno" required><PInput value={billing.firstName} onChange={(v) => setBilling({ ...billing, firstName: v })} placeholder="Jan" /></PField>
            <PField label="Příjmení" required><PInput value={billing.lastName} onChange={(v) => setBilling({ ...billing, lastName: v })} placeholder="Novák" /></PField>
            <PField label="E-mail" required hint="Pošleme sem smlouvu"><PInput type="email" value={billing.email} onChange={(v) => setBilling({ ...billing, email: v })} placeholder="jan.novak@example.cz" /></PField>
            <PField label="Telefon" required hint="Pro rychlou komunikaci"><PInput type="tel" value={billing.phone} onChange={(v) => setBilling({ ...billing, phone: v })} placeholder="+420 777 123 456" /></PField>
            <PField label="Firma (volitelně)"><PInput value={billing.company} onChange={(v) => setBilling({ ...billing, company: v })} placeholder="Helios Tech s.r.o." /></PField>
            <PField label="IČO (volitelně)"><PInput value={billing.ico} onChange={(v) => setBilling({ ...billing, ico: v })} placeholder="12345678" /></PField>
            <div style={{ gridColumn: "1 / -1" }}>
              <PField label="Fakturační adresa"><PInput value={billing.street} onChange={(v) => setBilling({ ...billing, street: v })} placeholder="Ulice, č.p., město, PSČ" /></PField>
            </div>
          </div>
        </PSection>

        {/* 2. Payment amount */}
        <PSection num="2" title="Výše platby" sub="Můžete zaplatit zálohu nebo rovnou plnou částku.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <PayAmountOption
              on={paymentMode === "deposit"}
              onClick={() => setPaymentMode("deposit")}
              title="Záloha"
              sub="Doplatek 14 dnů před nástupem"
              amount={`${window.fmtProposal(variant.deposit)} Kč`}
              note={`z ${window.fmtProposal(grandTotal)} Kč`}
            />
            <PayAmountOption
              on={paymentMode === "full"}
              onClick={() => setPaymentMode("full")}
              title="Plná částka"
              sub="Vyrovnáno hned, žádný doplatek"
              amount={`${window.fmtProposal(grandTotal)} Kč`}
              note="Bez doplatku"
            />
          </div>
        </PSection>

        {/* 3. Payment method */}
        <PSection num="3" title="Způsob platby" sub="Platba je zabezpečená a šifrovaná.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paymentMethods.map((m) => {
              const on = paymentMethod === m.id;
              return (
                <label key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                  borderRadius: 10, cursor: "pointer",
                }}>
                  <input type="radio" checked={on} onChange={() => setPaymentMethod(m.id)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
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
          {paymentMethod === "card" && (
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <PField label="Číslo karty" required><PInput value="" onChange={() => {}} placeholder="1234 5678 9012 3456" /></PField>
              <PField label="Platnost" required><PInput value="" onChange={() => {}} placeholder="MM / YY" /></PField>
              <PField label="CVV" required><PInput value="" onChange={() => {}} placeholder="123" /></PField>
            </div>
          )}
        </PSection>

        {/* 4. Signature */}
        <PSection num="4" title="Elektronický podpis" sub="Stvrzujete souhlas s nabídkou a smluvními podmínkami.">
          {!signed ? (
            <div>
              <div style={{
                width: "100%", height: 100,
                border: "1.5px dashed var(--border)", borderRadius: 10,
                background: "var(--neutral-50)", display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 4,
              }}>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Klikněte pro elektronický podpis</span>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{billing.firstName} {billing.lastName}</span>
              </div>
              <button onClick={() => setSigned(true)} disabled={!billing.firstName || !billing.lastName} style={{
                marginTop: 10, appearance: "none", cursor: (!billing.firstName || !billing.lastName) ? "not-allowed" : "pointer",
                border: "1px solid var(--border)", background: "white", color: "var(--ink-1)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                padding: "9px 14px", borderRadius: 8,
                opacity: (!billing.firstName || !billing.lastName) ? 0.5 : 1,
              }}>Podepsat elektronicky</button>
            </div>
          ) : (
            <div style={{
              padding: "16px 20px", borderRadius: 10, background: "var(--accent-tint)",
              border: "1px solid color-mix(in oklch, var(--accent) 30%, white)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", color: "white",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="check" size={18} strokeWidth={2.8} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--accent-dark)" }}>
                  Podepsáno · {billing.firstName} {billing.lastName}
                </div>
                <div style={{ fontFamily: "Brush Script MT, cursive", fontStyle: "italic", fontSize: 22, color: "var(--ink-1)", marginTop: 2 }}>
                  {billing.firstName} {billing.lastName}
                </div>
              </div>
              <button onClick={() => setSigned(false)} style={{
                appearance: "none", cursor: "pointer", background: "transparent", border: "none",
                color: "var(--accent-dark)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
                textDecoration: "underline",
              }}>Změnit</button>
            </div>
          )}
        </PSection>

        {/* 5. Consents + CTA */}
        <div style={{
          background: "white", border: "1px solid var(--border)", borderRadius: 12,
          padding: "22px 24px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CheckBox value={consents.terms} onChange={(v) => setConsents({ ...consents, terms: v })} required>
              Souhlasím s <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand)" }}>obchodními podmínkami</a> a uzavřením smlouvy.
            </CheckBox>
            <CheckBox value={consents.cancellation} onChange={(v) => setConsents({ ...consents, cancellation: v })} required>
              Souhlasím se <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand)" }}>storno podmínkami</a>. {variant.cancellation}
            </CheckBox>
            <CheckBox value={consents.marketing} onChange={(v) => setConsents({ ...consents, marketing: v })}>
              Mám zájem o občasné newslettery s nabídkami a výhodami pro stálé klienty.
            </CheckBox>
          </div>
          <button onClick={onComplete} disabled={!canSubmit} style={{
            marginTop: 18, width: "100%", appearance: "none", border: "none",
            cursor: canSubmit ? "pointer" : "not-allowed",
            background: canSubmit ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
            opacity: canSubmit ? 1 : 0.55, color: "white",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            padding: "16px 20px", borderRadius: 10, letterSpacing: "0.01em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <Icon name="check" size={18} strokeWidth={2.6} />
            Závazně potvrdit za {window.fmtProposal(payNow)} Kč
          </button>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
            <Trust>Bezpečná platba SSL</Trust>
            <Trust>3D Secure</Trust>
            <Trust>Bez rezervačních poplatků</Trust>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", lineHeight: 1.5, padding: "0 20px" }}>
          Kliknutím na „Závazně potvrdit" potvrzujete nabídku a souhlasíte s podmínkami. Po dokončení dostanete potvrzení e-mailem.
        </div>
      </div>

      {/* Sticky summary */}
      <CheckoutSummary scenario={scenario} variant={variant} extras={extras}
        totals={totals} extrasTotal={extrasTotal} grandTotal={grandTotal} payNow={payNow} paymentMode={paymentMode} />
    </main>
  );
}

function PayAmountOption({ on, onClick, title, sub, amount, note }) {
  return (
    <button onClick={onClick} style={{
      appearance: "none", cursor: "pointer", textAlign: "left",
      border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
      background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
      padding: "14px 16px", borderRadius: 10,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: on ? "var(--brand)" : "var(--ink-1)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>{amount}</div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>{note}</div>
      </div>
    </button>
  );
}

function CheckBox({ value, onChange, required, children }) {
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

function Trust({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-2)" }}>
      <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

function CheckoutSummary({ scenario, variant, extras, totals, extrasTotal, grandTotal, payNow, paymentMode }) {
  const extraItems = window.PROPOSAL_EXTRAS
    .map((ex) => ({ ex, qty: extras[ex.id] || 0 }))
    .filter(({ qty }) => qty > 0);
  return (
    <aside style={{
      position: "sticky", top: 20, alignSelf: "flex-start",
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(16,24,40,.04)",
    }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "color-mix(in oklch, var(--brand) 3%, white)" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4,
        }}>Vaše nabídka</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
          {scenario.hotel.name}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
          Nabídka {scenario.proposalNumber}
        </div>
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid var(--border)" }}>
        <SumIconLine icon="calendar">{scenario.dateLabel}</SumIconLine>
        <SumIconLine icon="users">{scenario.guests.adults + scenario.guests.children} osob · {scenario.rooms} pokojů</SumIconLine>
        <SumIconLine icon="sparkle"><strong style={{ color: "var(--ink-1)" }}>{variant.name}</strong></SumIconLine>
      </div>

      {/* Line items */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <PriceRow label={variant.name} value={`${window.fmtProposal(totals.gross)} Kč`} />
        {extraItems.length > 0 && (
          <>
            {extraItems.map(({ ex, qty }) => (
              <PriceRow key={ex.id} small label={`${ex.label}${qty > 1 ? ` × ${qty}` : ""}`} value={`+${window.fmtProposal(ex.price * qty)} Kč`} />
            ))}
          </>
        )}
        <PriceRow label="DPH (v ceně)" value={`${window.fmtProposal(totals.vat)} Kč`} muted />
      </div>

      <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Celkem s DPH</span>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)", letterSpacing: "-0.01em",
        }}>{window.fmtProposal(grandTotal)} Kč</span>
      </div>

      <div style={{ padding: "14px 18px", background: "color-mix(in oklch, var(--brand) 4%, white)" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--brand)",
        }}>K platbě nyní</div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          letterSpacing: "-0.015em", marginTop: 2,
        }}>{window.fmtProposal(payNow)} Kč</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
          {paymentMode === "deposit" ? `Doplatek 14 dnů před nástupem` : "Plná částka — bez doplatku"}
        </div>
      </div>

      <div style={{ padding: "12px 18px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          <span><strong style={{ color: "var(--ink-1)", fontWeight: 700 }}>{scenario.contact.name}</strong> připraví podklady</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)", marginTop: 6 }}>
          <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
          <span>Smlouva přijde e-mailem do <strong style={{ color: "var(--ink-1)" }}>15 minut</strong></span>
        </div>
      </div>
    </aside>
  );
}

function SumIconLine({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span>{children}</span>
    </div>
  );
}

function PriceRow({ label, value, muted, small }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: small ? 12.5 : 13, color: muted ? "var(--ink-3)" : "var(--ink-2)", gap: 8 }}>
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ fontWeight: muted ? 500 : 600, color: muted ? "var(--ink-3)" : "var(--ink-1)", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confirmation — mirrors the standard IBE confirmation layout
//   Hero · ReservationDetails · Timeline · HotelInfo · Loyalty · Footer
function ProposalConfirmation({ scenario, variant, extras, onRestart }) {
  const totals = window.proposalTotals(variant.items);
  const extrasTotal = Object.entries(extras || {}).reduce((sum, [id, qty]) => {
    const ex = window.PROPOSAL_EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price * qty : 0);
  }, 0);
  const grandTotal = totals.gross + extrasTotal;
  const extraItems = window.PROPOSAL_EXTRAS
    .map((ex) => ({ ex, qty: extras[ex.id] || 0 }))
    .filter(({ qty }) => qty > 0);

  const user = window.__loyaltyUser;
  const guestName = user?.name || "Vážený kliente";
  const firstName = (user?.name || "").split(" ")[0] || "";
  const email = user?.email || `kontakt@${scenario.hotel.name.toLowerCase().replace(/\s+/g, "")}.cz`;

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 32px 80px", display: "flex", flexDirection: "column", gap: 18 }}>
      <ConfHero firstName={firstName} email={email} scenario={scenario} />
      <ConfReservationDetails scenario={scenario} variant={variant} totals={totals} extrasTotal={extrasTotal} grandTotal={grandTotal} extraItems={extraItems} guestName={guestName} />
      <ConfTimeline scenario={scenario} />
      <ConfHotelInfo scenario={scenario} />
      <ConfContactBlock scenario={scenario} />
      <ConfFooter onRestart={onRestart} />
    </main>
  );
}

function ConfHero({ firstName, email, scenario }) {
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
          Nabídka potvrzena
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
          margin: "12px 0 4px", letterSpacing: "-0.015em", lineHeight: 1.15,
        }}>
          Děkujeme{firstName ? `, ${firstName}` : ""}.<br/>Vaše akce je v plánu.
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-2)", margin: "10px 0 0", lineHeight: 1.5, maxWidth: 560 }}>
          Potvrzení a smlouvu jsme odeslali na <strong style={{ color: "var(--ink-1)" }}>{email}</strong>.
          Do 24 hodin se vám ozve <strong style={{ color: "var(--ink-1)" }}>{scenario.contact.name}</strong> pro doladění detailů.
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
            Sdílet potvrzení
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
            }}>SMLOUVA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfReservationDetails({ scenario, variant, totals, extrasTotal, grandTotal, extraItems, guestName }) {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
    }}>
      <header style={{
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--ink-3)",
          }}>Detail nabídky</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)" }}>
              Č. nabídky
            </span>
            <span style={{
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
              background: "var(--neutral-100)", padding: "3px 10px", borderRadius: 6, letterSpacing: "0.04em",
            }}>{scenario.proposalNumber}</span>
          </div>
        </div>
        <button style={{
          appearance: "none", border: "1px solid var(--border)", background: "white", cursor: "pointer",
          color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6,
        }}>Upravit detaily</button>
      </header>

      <div style={{ padding: "20px 20px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 30px" }}>
        <ConfDetailRow icon="calendar" label="Termín akce" value={scenario.dateLabel} sub={`${scenario.nights} ${scenario.nights === 1 ? "noc" : scenario.nights < 5 ? "noci" : "nocí"}`} />
        <ConfDetailRow icon="users" label="Hosté" value={`${scenario.guests.adults} dospělých${scenario.guests.children ? ` · ${scenario.guests.children} dětí` : ""}`} sub={guestName} />
        <ConfDetailRow icon="bed" label="Ubytování" value={`${scenario.rooms} pokojů`} sub={`Hotel ${scenario.hotel.name}`} />
        <ConfDetailRow icon="sparkle" label="Varianta" value={variant.name} sub={variant.sub} />
        <ConfDetailRow icon="check" label="Záloha (uhrazeno)" value={`${window.fmtProposal(variant.deposit)} Kč`} sub="Zaplaceno kartou •••• 4242" accent />
        <ConfDetailRow icon="info" label="Storno podmínky" value="Viz smlouva" sub={variant.cancellation} />
      </div>

      <div style={{ padding: "16px 20px", margin: "16px 20px 20px", background: "var(--neutral-50)", borderRadius: 10, border: "1px solid var(--border-soft)" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
        }}>Cenový souhrn</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5 }}>
          <ConfPriceLine label={`${variant.name} · ${scenario.nights} ${scenario.nights === 1 ? "noc" : scenario.nights < 5 ? "noci" : "nocí"}`} value={`${window.fmtProposal(totals.gross)} Kč`} />
          {extraItems.length > 0 && extraItems.map(({ ex, qty }) => (
            <ConfPriceLine key={ex.id} label={`${ex.label}${qty > 1 ? ` × ${qty}` : ""}`} value={`${window.fmtProposal(ex.price * qty)} Kč`} />
          ))}
          <ConfPriceLine label="DPH (v ceně)" value={`${window.fmtProposal(totals.vat)} Kč`} muted />
        </div>
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Celkem k zaplacení</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
            {window.fmtProposal(grandTotal)} Kč
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span>Záloha (zaplacena)</span>
          <span style={{ color: "var(--accent-dark)", fontWeight: 600 }}>{window.fmtProposal(variant.deposit)} Kč</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span>Doplatek (14 dnů před nástupem)</span>
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{window.fmtProposal(Math.max(0, grandTotal - variant.deposit))} Kč</span>
        </div>
      </div>
    </section>
  );
}

function ConfDetailRow({ icon, label, value, sub, accent }) {
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
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </div>
  );
}

function ConfPriceLine({ label, value, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: muted ? "var(--ink-3)" : "var(--ink-2)", gap: 8 }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, color: muted ? "var(--ink-3)" : "var(--ink-1)", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function ConfTimeline({ scenario }) {
  const items = [
    { when: "Hned teď", title: "Smlouva a faktura v e-mailu", sub: "Voucher na zálohu a podepsaná smlouva v příloze", icon: "check", done: true },
    { when: "Do 24 hodin", title: `${scenario.contact.name} se Vám ozve`, sub: "Doladíme menu, sezení a finální detaily programu", icon: "users" },
    { when: "30 dnů před akcí", title: "Provozní brief", sub: "Předáme rooming list, harmonogram a kontakt na supervisora", icon: "voucher" },
    { when: "14 dnů před akcí", title: "Doplatek a finální podklady", sub: "Uhradíte doplatek, dostanete přístupy a koordinátora", icon: "calendar" },
    { when: "V den akce", title: "Přivítáme Vás", sub: "Welcome drink a osobní průvodce po objektu", icon: "sparkle" },
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

function ConfHotelInfo({ scenario }) {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
        margin: "0 0 14px", letterSpacing: "-0.005em",
      }}>Praktické informace</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ConfInfoBlock title="Adresa" icon="view">
          {scenario.hotel.name}<br/>
          {scenario.hotel.address}
          <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "block", marginTop: 6, color: "var(--brand)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            Otevřít v mapách →
          </a>
        </ConfInfoBlock>
        <ConfInfoBlock title="Sales kontakt" icon="users">
          {scenario.contact.name}<br/>
          {scenario.contact.email}<br/>
          {scenario.contact.phone}
        </ConfInfoBlock>
        <ConfInfoBlock title="Doprava" icon="voucher">
          Parkování v ceně<br/>
          Transfer z letiště na vyžádání<br/>
          GPS souřadnice ve smlouvě
        </ConfInfoBlock>
        <ConfInfoBlock title="Důležité časy" icon="calendar">
          Check-in: od 15:00<br/>
          Check-out: do 11:00<br/>
          Recepce 24/7
        </ConfInfoBlock>
      </div>
    </section>
  );
}

function ConfInfoBlock({ title, icon, children }) {
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

function ConfContactBlock({ scenario }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 10%, white), color-mix(in oklch, var(--brand) 4%, white))",
      border: "1px solid color-mix(in oklch, var(--brand) 18%, white)", borderRadius: 12,
      padding: "22px 24px", display: "flex", alignItems: "center", gap: 18,
    }}>
      <span style={{
        width: 56, height: 56, borderRadius: "50%",
        background: scenario.contact.avatarBg, color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
      }}>{scenario.contact.initials}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)" }}>
          Vaše akci povede {scenario.contact.name}
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
          {scenario.contact.role} · ozve se Vám do 24 hodin. Máte něco urgentního? Volejte nebo pište kdykoli.
        </div>
      </div>
      <button style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "12px 18px", borderRadius: 8, whiteSpace: "nowrap",
      }}>Domluvit schůzku</button>
    </div>
  );
}

function ConfFooter({ onRestart }) {
  return (
    <div style={{
      marginTop: 12, padding: "20px 0", borderTop: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
    }}>
      <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
        Powered by IBE v4 · Proposal Engine
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onRestart} style={{
          appearance: "none", cursor: "pointer", border: "1px solid var(--border)",
          background: "white", color: "var(--ink-1)",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "10px 18px", borderRadius: 8,
        }}>Zpět na nabídku</button>
      </div>
    </div>
  );
}

Object.assign(window, { ProposalFormsStep, ProposalCheckoutStep, ProposalConfirmation });
