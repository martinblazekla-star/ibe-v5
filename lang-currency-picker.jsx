// Language + Currency combined picker
// Opens from "CZ · CZK" pill in top nav

const LANGUAGES = [
  { id: "cs", label: "Čeština", flag: "🇨🇿" },
  { id: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "pl", label: "Polski", flag: "🇵🇱" },
  { id: "hu", label: "Magyar", flag: "🇭🇺" },
];

const CURRENCIES = [
  { id: "CZK", label: "Česká koruna", symbol: "Kč" },
  { id: "EUR", label: "Euro", symbol: "€" },
  { id: "USD", label: "Americký dolar", symbol: "$" },
  { id: "GBP", label: "Britská libra", symbol: "£" },
  { id: "PLN", label: "Polský zlotý", symbol: "zł" },
];

function LangCurrencyPicker({ value, onChange, onClose }) {
  const [lang, setLang] = React.useState(value?.lang || "cs");
  const [currency, setCurrency] = React.useState(value?.currency || "CZK");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "14px 18px", borderBottom: "1px solid var(--border-soft)",
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
          Jazyk a měna
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
          Změňte rozhraní a měnu cenotvorby.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "12px 14px 14px", borderRight: "1px solid var(--border-soft)" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
          }}>Jazyk</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {LANGUAGES.map(l => {
              const on = lang === l.id;
              return (
                <button key={l.id} onClick={() => setLang(l.id)} style={{
                  appearance: "none", cursor: "pointer", textAlign: "left",
                  border: "none", borderRadius: 8,
                  background: on ? "color-mix(in oklch, var(--brand) 5%, white)" : "transparent",
                  color: on ? "var(--brand)" : "var(--ink-1)",
                  fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 500, fontSize: 13.5,
                  padding: "8px 10px", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{l.flag}</span>
                  <span style={{ flex: 1 }}>{l.label}</span>
                  {on && <Icon name="check" size={14} strokeWidth={2.6} color="var(--brand)" />}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
          }}>Měna</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CURRENCIES.map(c => {
              const on = currency === c.id;
              return (
                <button key={c.id} onClick={() => setCurrency(c.id)} style={{
                  appearance: "none", cursor: "pointer", textAlign: "left",
                  border: "none", borderRadius: 8,
                  background: on ? "color-mix(in oklch, var(--brand) 5%, white)" : "transparent",
                  color: on ? "var(--brand)" : "var(--ink-1)",
                  fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 500, fontSize: 13.5,
                  padding: "8px 10px", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{
                    width: 26, textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 700,
                    color: on ? "var(--brand)" : "var(--ink-2)",
                  }}>{c.symbol}</span>
                  <span style={{ flex: 1 }}>{c.id}</span>
                  <span style={{ fontSize: 11.5, color: on ? "var(--brand)" : "var(--ink-3)", fontWeight: 500 }}>{c.label}</span>
                  {on && <Icon name="check" size={14} strokeWidth={2.6} color="var(--brand)" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        padding: "10px 16px", borderTop: "1px solid var(--border-soft)", background: "var(--neutral-50)",
        display: "flex", justifyContent: "flex-end", gap: 8,
      }}>
        <button onClick={onClose} style={{
          appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
          color: "var(--ink-2)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
          padding: "8px 14px", borderRadius: 6,
        }}>Zrušit</button>
        <button onClick={() => { onChange({ lang, currency }); onClose(); }} style={{
          appearance: "none", cursor: "pointer", border: "none", background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "9px 18px", borderRadius: 6, letterSpacing: "0.02em",
        }}>Použít</button>
      </div>
    </div>
  );
}

window.LangCurrencyPicker = LangCurrencyPicker;
