// Wellness data + slot dialog

window.WELLNESS = [
  {
    id: "couples", category: "couples", name: "Páro­vá masáž", emoji: "💆", duration: 90, price: 2890,
    desc: "Synchronní masáž pro dva v privátním studiu — relaxační i hluboká tkáňová.",
    therapists: ["Anna Nováková", "Petr Dvořák", "Bára Krejčová"], popular: true,
  },
  {
    id: "swedish60", category: "massage", name: "Klasická švédská masáž", emoji: "🌿", duration: 60, price: 1290,
    desc: "Klasická relaxační masáž celého těla. Uvolní svaly a sníží napětí.",
    therapists: ["Anna Nováková", "Petr Dvořák", "Tomáš Veselý", "Bára Krejčová"],
  },
  {
    id: "swedish90", category: "massage", name: "Klasická masáž 90 min", emoji: "🌿", duration: 90, price: 1690,
    desc: "Hlubší relaxace, prodloužená masáž zad, šíje a nohou.",
    therapists: ["Anna Nováková", "Petr Dvořák"],
  },
  {
    id: "hotstone", category: "massage", name: "Hot stone masáž", emoji: "🔥", duration: 75, price: 1890,
    desc: "Masáž s teplými lávovými kameny. Uvolnění hlubokých svalových vrstev.",
    therapists: ["Anna Nováková", "Bára Krejčová"], popular: true,
  },
  {
    id: "facial", category: "beauty", name: "Pleťové ošetření Premium", emoji: "✨", duration: 45, price: 990,
    desc: "Hloubkové čištění, peeling, hydratační maska a masáž obličeje.",
    therapists: ["Petra Hrubá", "Veronika Marková"],
  },
  {
    id: "peeling", category: "beauty", name: "Tělový peeling", emoji: "🍯", duration: 50, price: 1190,
    desc: "Solný peeling se zázvorem a citronovou trávou. Pokožka jako hedvábí.",
    therapists: ["Petra Hrubá"],
  },
  {
    id: "sauna", category: "sauna", name: "Privátní sauna", emoji: "🧖", duration: 90, price: 1490,
    desc: "Privátní sauna pro 2 osoby — finská i parní, ledová sprcha.",
    therapists: [],
  },
  {
    id: "salt", category: "sauna", name: "Solná jeskyně", emoji: "🧂", duration: 45, price: 590,
    desc: "Halo­terapie — ideální pro relaxaci a podporu dýchacích cest.",
    therapists: [],
  },
  {
    id: "bundle", category: "package", name: "Wellness den pro 2", emoji: "💎", duration: 240, price: 4990,
    desc: "Celodenní balíček: sauna 90 min · masáž 60 min každý · peeling · prosecco.",
    therapists: ["Anna Nováková", "Bára Krejčová", "Petr Dvořák"], bundle: true, badge: "Bestseller",
    saving: 1200,
  },
];

window.WELLNESS_DAYS = [
  { id: "d1", short: "Pá", date: 15, full: "Pá 15. 5." },
  { id: "d2", short: "So", date: 16, full: "So 16. 5." },
  { id: "d3", short: "Ne", date: 17, full: "Ne 17. 5." },
  { id: "d4", short: "Po", date: 18, full: "Po 18. 5." },
  { id: "d5", short: "Út", date: 19, full: "Út 19. 5." },
];

window.WELLNESS_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

// Generate fake availability — bookedSet by [procedureId,dayId,slot]
window.wellnessAvailability = (procedureId, dayId, slot) => {
  const key = `${procedureId}-${dayId}-${slot}`;
  // deterministic pseudo-random
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (h % 5) !== 0; // 4 of 5 available
};

// ────────────── Slot picker dialog ──────────────

function WellnessSlotDialog({ open, procedure, onClose, onAdd }) {
  const [day, setDay] = React.useState(null);
  const [slot, setSlot] = React.useState(null);
  const [therapist, setTherapist] = React.useState("any");
  const [persons, setPersons] = React.useState(procedure?.bundle ? 2 : 1);

  React.useEffect(() => {
    if (open) {
      setDay(null); setSlot(null); setTherapist("any");
      setPersons(procedure?.bundle ? 2 : (procedure?.category === "couples" ? 2 : 1));
    }
  }, [open, procedure?.id]);

  if (!open || !procedure) return null;

  const therapists = procedure.therapists || [];
  const totalPrice = procedure.price * (procedure.category === "couples" || procedure.bundle ? 1 : persons);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 820,
        maxHeight: "92vh", overflow: "hidden", boxShadow: "0 30px 80px rgba(15,18,22,.25)",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px",
      }}>
        <div style={{ overflowY: "auto", maxHeight: "92vh" }}>
          <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 32, lineHeight: 1 }}>{procedure.emoji}</span>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Rezervace procedury
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", marginTop: 2 }}>
                  {procedure.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1 }}>{procedure.duration} min · {procedure.price.toLocaleString("cs-CZ")} Kč</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </div>

          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18, background: "var(--neutral-50)" }}>
            {/* Day */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                1 · Vyberte den
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {window.WELLNESS_DAYS.map(d => {
                  const on = day === d.id;
                  return (
                    <button key={d.id} onClick={() => { setDay(d.id); setSlot(null); }} style={{
                      appearance: "none", cursor: "pointer", flex: "0 0 78px",
                      border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                      background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                      borderRadius: 10, padding: "10px 6px",
                      fontFamily: "var(--font-ui)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.short}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink-1)" }}>{d.date}</span>
                      <span style={{ fontSize: 10.5, color: "var(--ink-3)" }}>května</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", opacity: day ? 1 : 0.5 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                2 · Vyberte čas
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {window.WELLNESS_SLOTS.map(s => {
                  const available = day ? window.wellnessAvailability(procedure.id, day, s) : false;
                  const on = slot === s;
                  return (
                    <button key={s} disabled={!available || !day} onClick={() => setSlot(s)} style={{
                      appearance: "none", cursor: (available && day) ? "pointer" : "not-allowed",
                      border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                      background: !available || !day ? "var(--neutral-50)" : (on ? "var(--brand)" : "white"),
                      color: !available || !day ? "var(--ink-3)" : (on ? "white" : "var(--ink-1)"),
                      fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600,
                      padding: "8px 14px", borderRadius: 8,
                      textDecoration: !available && day ? "line-through" : "none",
                      opacity: !available && day ? 0.5 : 1, minWidth: 70,
                    }}>{s}</button>
                  );
                })}
              </div>
              {day && (
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: "white", border: "1.5px solid var(--border)" }}></span>
                    Volné
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--neutral-50)", border: "1.5px solid var(--border)" }}></span>
                    Obsazené
                  </span>
                </div>
              )}
            </div>

            {/* Therapist */}
            {therapists.length > 0 && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                  3 · Terapeut <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· volitelné</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <button onClick={() => setTherapist("any")} style={chipStyle(therapist === "any")}>
                    Nezáleží
                  </button>
                  {therapists.map(t => (
                    <button key={t} onClick={() => setTherapist(t)} style={chipStyle(therapist === t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Persons */}
            {!procedure.bundle && procedure.category !== "couples" && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                    4 · Počet osob
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Pro každou osobu zvlášť ve stejném čase</div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setPersons(Math.max(1, persons - 1))} style={qtyBtnW}>−</button>
                  <span style={{ minWidth: 28, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{persons}</span>
                  <button onClick={() => setPersons(Math.min(4, persons + 1))} style={qtyBtnW}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right summary */}
        <aside style={{
          background: "var(--neutral-50)", borderLeft: "1px solid var(--border)",
          padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>Souhrn</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
              <SLine icon="leaf">{procedure.name}</SLine>
              <SLine icon="calendar">{day ? window.WELLNESS_DAYS.find(d => d.id === day)?.full : "Vyberte den"}</SLine>
              <SLine icon="check">{slot || "Vyberte čas"}</SLine>
              {therapists.length > 0 && <SLine icon="person">{therapist === "any" ? "Libovolný terapeut" : therapist}</SLine>}
              {!procedure.bundle && procedure.category !== "couples" && (
                <SLine icon="users">{persons} {persons === 1 ? "osoba" : "osoby"}</SLine>
              )}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Cena</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
              {totalPrice.toLocaleString("cs-CZ")} Kč
            </span>
          </div>

          <button
            disabled={!day || !slot}
            onClick={() => onAdd({ procedure, day, slot, therapist, persons, totalPrice })}
            style={{
              appearance: "none", border: "none", cursor: (day && slot) ? "pointer" : "not-allowed",
              background: (day && slot) ? "var(--brand)" : "color-mix(in oklch, var(--brand) 40%, var(--neutral-100))",
              opacity: (day && slot) ? 1 : 0.6,
              color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
              padding: "13px 16px", borderRadius: 8, letterSpacing: "0.01em",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            Přidat do rezervace
            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: -4 }}>
            <Tr>Storno zdarma 24 h předem</Tr>
            <Tr>Garance termínu po potvrzení</Tr>
            <Tr>Platba s pobytem na recepci</Tr>
          </div>
        </aside>
      </div>
    </div>
  );
}

function chipStyle(active) {
  return {
    appearance: "none", cursor: "pointer",
    border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
    background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
    color: active ? "var(--brand)" : "var(--ink-1)",
    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
    padding: "7px 12px", borderRadius: 999,
  };
}

const qtyBtnW = {
  appearance: "none", cursor: "pointer", border: "1.5px solid var(--border)", background: "white",
  width: 32, height: 32, borderRadius: 8, color: "var(--ink-1)",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16,
};

function SLine({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span>{children}</span>
    </div>
  );
}

function Tr({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
      <Icon name="check" size={12} color="var(--accent)" strokeWidth={2.4} />
      {children}
    </span>
  );
}

window.WellnessSlotDialog = WellnessSlotDialog;
