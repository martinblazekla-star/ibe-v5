// Voucher sale main app — single page with live preview

const TWEAK_DEFAULTS_V = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "showOccasions": true,
  "previewDesign": "classic"
}/*EDITMODE-END*/;

function NavV() { return <PickRoomNav active="vouchery" />; }

function HeroV() {
  return (
    <div style={{
      background: "color-mix(in oklch, var(--brand) 6%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 12%, white)",
      borderRadius: 12, padding: "22px 26px", marginBottom: 18,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    }}>
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--brand)",
          padding: "4px 9px", background: "white", border: "1px solid color-mix(in oklch, var(--brand) 18%, white)",
          borderRadius: 4, marginBottom: 10,
        }}>
          <span style={{ fontSize: 13 }}>🎁</span>
          Dárek, který potěší
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2,
        }}>
          Dárkový voucher Hotelu Balický
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
          Darujte zážitek místo věci. Voucher dostane obdarovaný do hodiny v PDF nebo poštou v dárkové obálce. Platnost 12 měsíců, lze prodloužit.
        </div>
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-2)",
        background: "white", padding: "14px 18px", borderRadius: 10, border: "1px solid var(--border)", minWidth: 240,
      }}>
        <T3>Doručíme do 60 minut</T3>
        <T3>Platnost 12 měsíců</T3>
        <T3>Přenosný · bez registrace</T3>
      </div>
    </div>
  );
}

function T3({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Icon name="check" size={14} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

function Occasions({ value, setValue }) {
  const items = [
    { id: "birthday", icon: "🎂", label: "Narozeniny" },
    { id: "anniversary", icon: "💐", label: "Výročí" },
    { id: "christmas", icon: "🎄", label: "Vánoce" },
    { id: "thanks", icon: "🙏", label: "Poděkování" },
    { id: "valentine", icon: "💝", label: "Valentýn" },
    { id: "other", icon: "✨", label: "Jiná příležitost" },
  ];
  return (
    <SectionV num="1" title="Příležitost" sub="Přizpůsobíme design a doporučení">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {items.map(it => {
          const on = value === it.id;
          return (
            <button key={it.id} onClick={() => setValue(it.id)} style={{
              appearance: "none", cursor: "pointer",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, padding: "12px 8px",
              fontFamily: "var(--font-ui)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{it.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)", textAlign: "center" }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </SectionV>
  );
}

function TypeSelector({ value, setValue }) {
  const items = [
    {
      id: "value", icon: "💳", label: "Hodnotový voucher",
      sub: "Volná částka, kterou obdarovaný použije, jak chce",
      examples: "1 000 · 2 500 · 5 000 · vlastní částka",
    },
    {
      id: "stay", icon: "🛏️", label: "Pobytový voucher",
      sub: "Konkrétní pobyt, který obdarovaný zarezervuje",
      examples: "Romantický víkend, Wellness pobyt, Rodinný pobyt",
    },
    {
      id: "wellness", icon: "💆", label: "Wellness voucher",
      sub: "Procedura nebo wellness den s garancí",
      examples: "Masáž 60 min, Wellness den pro 2",
    },
  ];
  return (
    <SectionV num="2" title="Typ voucheru" sub="Co chcete darovat — konkrétní zážitek nebo volná hodnota">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(it => {
          const on = value === it.id;
          return (
            <label key={it.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{it.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-1)" }}>{it.label}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>{it.sub}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>např. {it.examples}</div>
              </div>
            </label>
          );
        })}
      </div>
    </SectionV>
  );
}

function ValueConfig({ value, setValue, custom, setCustom }) {
  const presets = [1000, 2500, 5000, 10000];
  return (
    <SectionV num="3" title="Hodnota voucheru" sub="Vyberte přednastavenou hodnotu nebo zadejte vlastní">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
        {presets.map(p => {
          const on = value === p && !custom;
          return (
            <button key={p} onClick={() => setValue(p)} style={{
              appearance: "none", cursor: "pointer",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
              padding: "16px 8px", borderRadius: 10,
            }}>
              {p.toLocaleString("cs-CZ")} <span style={{ fontSize: 13, fontWeight: 600 }}>Kč</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--ink-3)", fontWeight: 600 }}>Vlastní částka:</span>
        <div style={{ position: "relative", flex: 1, maxWidth: 200 }}>
          <input type="number" min="500" step="100" value={custom || ""} onChange={(e) => setCustom(e.target.value)}
            placeholder="0"
            style={{
              width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
              padding: "10px 50px 10px 14px", fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600,
            }} />
          <span style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: "var(--ink-3)", fontWeight: 600,
          }}>Kč</span>
        </div>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>min. 500 Kč</span>
      </div>
    </SectionV>
  );
}

function Personalize({ form, set }) {
  return (
    <SectionV num="4" title="Komu a od koho" sub="Údaje se vytisknou na voucher">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Pro koho" required>
          <Input value={form.toName} onChange={set("toName")} placeholder="Marie Nováková" />
        </Field>
        <Field label="Od koho" required>
          <Input value={form.fromName} onChange={set("fromName")} placeholder="Jan a Petra" />
        </Field>
      </div>
      <div style={{ marginTop: 14 }}>
        <Field label="Osobní vzkaz" hint={`${(form.message || "").length} / 240 znaků`}>
          <textarea
            value={form.message || ""} onChange={(e) => set("message")(e.target.value.slice(0, 240))}
            rows={3} placeholder="Vše nejlepší k narozeninám! Užij si pobyt..."
            style={{
              width: "100%", appearance: "none", border: "1px solid var(--border)", borderRadius: 8,
              padding: "11px 14px", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--ink-1)",
              background: "white", outline: "none", resize: "vertical",
            }}
          />
        </Field>
      </div>
    </SectionV>
  );
}

function Design({ value, setValue }) {
  const designs = [
    { id: "classic", label: "Klasický", swatch: "linear-gradient(135deg, #550173, #3F0156)" },
    { id: "warm", label: "Teplý", swatch: "linear-gradient(135deg, #A6651D, #5C3309)" },
    { id: "minimal", label: "Minimalistický", swatch: "linear-gradient(135deg, #1F2429, #484C4F)" },
    { id: "festive", label: "Sváteční", swatch: "linear-gradient(135deg, #8B1A2B, #4A0612)" },
  ];
  return (
    <SectionV num="5" title="Design voucheru" sub="Změňte styl podle příležitosti">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {designs.map(d => {
          const on = value === d.id;
          return (
            <button key={d.id} onClick={() => setValue(d.id)} style={{
              appearance: "none", cursor: "pointer",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: "white", borderRadius: 10, padding: 10,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ height: 64, borderRadius: 6, background: d.swatch }} />
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>{d.label}</span>
            </button>
          );
        })}
      </div>
    </SectionV>
  );
}

function Delivery({ method, setMethod, form, set }) {
  const opts = [
    { id: "pdf", label: "PDF e-mailem", sub: "Doručíme do 60 minut", extra: 0, popular: true },
    { id: "print", label: "Tištěná dárková obálka", sub: "Poštou do 3 prac. dní · ČR", extra: 290 },
    { id: "schedule", label: "Naplánovat odeslání", sub: "Doručíme přesně v den, který určíte", extra: 0 },
  ];
  return (
    <SectionV num="6" title="Doručení" sub="Komu a kdy voucher pošleme">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => {
          const on = method === o.id;
          return (
            <label key={o.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, cursor: "pointer",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" }} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{o.label}</span>
                  {o.popular && <span style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, color: "var(--accent-dark)", padding: "2px 6px", borderRadius: 4, background: "var(--accent-tint)" }}>Nejrychlejší</span>}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{o.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: o.extra === 0 ? "var(--accent-dark)" : "var(--ink-1)" }}>
                {o.extra === 0 ? "zdarma" : `+ ${o.extra} Kč`}
              </span>
            </label>
          );
        })}
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label={method === "print" ? "Doručovací jméno" : "E-mail příjemce"} required>
          <Input value={form.recipientContact} onChange={set("recipientContact")} placeholder={method === "print" ? "Marie Nováková" : "marie@example.cz"} />
        </Field>
        {method === "schedule" && (
          <Field label="Datum odeslání" required>
            <Input value={form.scheduleDate} onChange={set("scheduleDate")} type="date" placeholder="" />
          </Field>
        )}
        {method === "print" && (
          <Field label="Adresa" required>
            <Input value={form.recipientAddress} onChange={set("recipientAddress")} placeholder="Ulice, město, PSČ" />
          </Field>
        )}
      </div>
    </SectionV>
  );
}

function SectionV({ num, title, sub, children }) {
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
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.005em",
          }}>{title}</h2>
          {sub && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </section>
  );
}

window.NavV = NavV;
window.HeroV = HeroV;
window.Occasions = Occasions;
window.TypeSelector = TypeSelector;
window.ValueConfig = ValueConfig;
window.Personalize = Personalize;
window.Design = Design;
window.Delivery = Delivery;
window.SectionV = SectionV;
