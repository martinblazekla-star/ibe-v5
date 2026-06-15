// Reviews page — score summary + filterable list of guest reviews
const { useState: useStateR, useMemo: useMemoR } = React;

function fmtR(n) { return n.toLocaleString("cs-CZ"); }

// ---- helpers
function scoreColor(s, max = 10) {
  const v = s / max;
  if (v >= 0.9) return "#1F8A5B";
  if (v >= 0.8) return "#3F9B6F";
  if (v >= 0.7) return "#C99500";
  return "#A6151D";
}
function scoreLabel(s) {
  if (s >= 9) return "Vynikající";
  if (s >= 8) return "Velmi dobré";
  if (s >= 7) return "Dobré";
  return "Slušné";
}

// ---- Score hero
function ScoreHero({ summary }) {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 14,
      padding: "26px 28px",
      display: "grid", gridTemplateColumns: "minmax(280px, 360px) 1fr",
      gap: 32, alignItems: "stretch",
    }}>
      {/* Big score */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingRight: 28, borderRight: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 16,
            background: "linear-gradient(135deg, #6B1C8C 0%, #550173 60%, #3F0156 100%)",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", flexShrink: 0,
            boxShadow: "0 8px 22px rgba(85,1,115,0.28)",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>
              {summary.score.toFixed(1)}
            </div>
            <div style={{ fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85, marginTop: 4 }}>
              / 10
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
              {summary.scoreLabel}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.45 }}>
              Na základě <strong style={{ color: "var(--ink-1)" }}>{fmtR(summary.totalReviews)}</strong> ověřených hodnocení
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <Icon key={i} name="star" size={16} color="#F4B400" strokeWidth={0} />
              ))}
              <span style={{ fontSize: 12.5, color: "var(--ink-2)", marginLeft: 4, fontWeight: 600 }}>4.6 / 5</span>
            </div>
          </div>
        </div>
        <div style={{
          background: "var(--accent-tint)", padding: "10px 14px", borderRadius: 8,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Icon name="thumbs-up" size={18} color="var(--accent-dark)" strokeWidth={2} />
          <div style={{ fontSize: 13.5, color: "var(--accent-dark)", fontWeight: 600 }}>
            <strong>{summary.recommendPct} %</strong> hostů by hotel doporučilo svým přátelům
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {summary.sources.map(s => (
            <div key={s.name} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "9px 12px", border: "1px solid var(--border-soft)", borderRadius: 8,
            }}>
              <span style={{
                width: 6, height: 32, borderRadius: 3, background: s.color, flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-1)" }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{fmtR(s.count)} hodnocení</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
                {s.score} <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 500 }}>/ {s.max || 10}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Category breakdown */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)", margin: 0, letterSpacing: "-0.005em" }}>
            Co hosté hodnotí
          </h3>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Průměrné skóre v kategoriích</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 28px" }}>
          {summary.categories.map(c => (
            <div key={c.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13.5, marginBottom: 4 }}>
                <span style={{ color: "var(--ink-1)", fontWeight: 500 }}>{c.label}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: scoreColor(c.score) }}>
                  {c.score.toFixed(1)}
                </span>
              </div>
              <div style={{ height: 6, background: "var(--neutral-100)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(c.score / 10) * 100}%`,
                  background: scoreColor(c.score), borderRadius: 3,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Filter bar
function ReviewFilters({ filter, setFilter, sort, setSort, total }) {
  const Pill = ({ id, label, count }) => {
    const active = filter === id;
    return (
      <button onClick={() => setFilter(id)} style={{
        appearance: "none", border: `1px solid ${active ? "var(--ink-1)" : "var(--border)"}`,
        background: active ? "var(--ink-1)" : "white",
        color: active ? "white" : "var(--ink-2)",
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
        padding: "7px 13px", borderRadius: 999, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        {label}
        <span style={{
          fontSize: 11, opacity: 0.7, fontWeight: 500,
        }}>{count}</span>
      </button>
    );
  };
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10,
      padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>
          Typ pobytu
        </span>
        <Pill id="all" label="Všechny" count={total} />
        <Pill id="par" label="Páry" count={3} />
        <Pill id="rodina" label="Rodiny" count={1} />
        <Pill id="business" label="Pracovní" count={1} />
        <Pill id="solo" label="Sólo" count={1} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Seřadit:</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          appearance: "none", border: "1px solid var(--border)", borderRadius: 6,
          padding: "7px 28px 7px 12px", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "var(--ink-1)",
          background: "white",
          backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
          backgroundSize: "5px 5px",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
        }}>
          <option value="recent">Nejnovější</option>
          <option value="score-desc">Nejvyšší skóre</option>
          <option value="score-asc">Nejnižší skóre</option>
        </select>
      </div>
    </div>
  );
}

// ---- Review card
function ReviewCard({ r }) {
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
    }}>
      <header style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #F2E6F5 0%, #E0CDE9 100%)",
          color: "var(--brand-dark)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
          flexShrink: 0,
        }}>{r.initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
              {r.name}
            </strong>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{r.flag} {r.country}</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
            {r.date} · {r.stayType} · {r.room}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 8,
            background: scoreColor(r.score),
            color: "white",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
          }}>
            {r.score.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
            {scoreLabel(r.score)} · {r.source}
          </div>
        </div>
      </header>

      <div>
        <h4 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
          margin: "0 0 6px", letterSpacing: "-0.005em", lineHeight: 1.3,
        }}>
          „{r.title}"
        </h4>
        <p style={{ fontSize: 14, color: "var(--ink-2)", margin: 0, lineHeight: 1.55, textWrap: "pretty" }}>
          {r.body}
        </p>
      </div>

      {(r.pros || r.cons) && (
        <div style={{ display: "grid", gridTemplateColumns: r.pros && r.cons ? "1fr 1fr" : "1fr", gap: 10 }}>
          {r.pros && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45 }}>
              <Icon name="check" size={15} color="var(--accent)" strokeWidth={2.4} />
              <span><strong style={{ color: "var(--accent-dark)", fontWeight: 700 }}>Líbilo se:</strong> {r.pros}</span>
            </div>
          )}
          {r.cons && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45 }}>
              <Icon name="x" size={15} color="#A6151D" strokeWidth={2.4} />
              <span><strong style={{ color: "#A6151D", fontWeight: 700 }}>Nelíbilo se:</strong> {r.cons}</span>
            </div>
          )}
        </div>
      )}

      {r.reply && (
        <div style={{
          background: "#FAF5FC", borderLeft: "3px solid var(--brand)",
          padding: "12px 14px", borderRadius: "0 8px 8px 0",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--brand-dark)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />
            Odpověď hotelu
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
            {r.reply}
          </div>
        </div>
      )}
    </article>
  );
}

// ---- CTA banner
function ReviewsCTA() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #6B1C8C 0%, #550173 60%, #3F0156 100%)",
      borderRadius: 14, padding: "26px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      color: "white",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em" }}>
          Přesvědčily Vás recenze našich hostů?
        </div>
        <div style={{ fontSize: 14, opacity: 0.92, marginTop: 6, lineHeight: 1.45 }}>
          Rezervujte přímo u nás se zárukou nejnižší ceny — bez rezervačních poplatků a se slevou 8 % pro členy Balický Clubu.
        </div>
      </div>
      <a href="Pick-Room-Table-View.html" style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: "white", color: "var(--brand-dark)",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
        padding: "13px 22px", borderRadius: 8, letterSpacing: "0.02em",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
        flexShrink: 0,
      }}>
        Rezervovat pobyt
        <Icon name="chevron-right" size={15} strokeWidth={2.4} color="var(--brand-dark)" />
      </a>
    </div>
  );
}

// ---- App
function ReviewsApp() {
  const [filter, setFilter] = useStateR("all");
  const [sort, setSort] = useStateR("recent");

  const visible = useMemoR(() => {
    let list = [...window.REVIEWS];
    if (filter !== "all") {
      const map = { par: "Pár", rodina: "Rodina", business: "Pracovní", solo: "Sólo" };
      list = list.filter(r => r.stayType.startsWith(map[filter] || ""));
    }
    if (sort === "score-desc") list.sort((a, b) => b.score - a.score);
    else if (sort === "score-asc") list.sort((a, b) => a.score - b.score);
    return list;
  }, [filter, sort]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      <PickRoomNav active="hodnoceni" />
      <div style={{ background: "var(--surface)", padding: "16px 32px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <PickRoomBreadcrumb label="Hodnocení hostů" />
        </div>
      </div>
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 32px 60px", display: "flex", flexDirection: "column", gap: 18 }}>
        <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginTop: 4 }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--ink-1)",
              margin: 0, letterSpacing: "-0.015em", lineHeight: 1.15,
            }}>
              Co o nás říkají hosté
            </h1>
            <p style={{ fontSize: 14.5, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
              Hodnocení ze všech rezervačních platforem na jednom místě — od skutečných hostů, kteří u nás bydleli.
            </p>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 11px", borderRadius: 999,
            background: "var(--accent-tint)", color: "var(--accent-dark)",
            fontSize: 12.5, fontWeight: 700,
          }}>
            <Icon name="check" size={13} color="var(--accent-dark)" strokeWidth={2.6} />
            Ověřené recenze
          </div>
        </header>

        <ScoreHero summary={window.REVIEWS_SUMMARY} />

        <ReviewFilters filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} total={window.REVIEWS.length} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {visible.map(r => <ReviewCard key={r.id} r={r} />)}
        </div>

        {visible.length === 0 && (
          <div style={{
            background: "white", border: "1px dashed var(--border)", borderRadius: 12,
            padding: "32px", textAlign: "center", color: "var(--ink-3)", fontSize: 14,
          }}>
            Pro vybraný typ pobytu nemáme žádné recenze.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <button style={{
            appearance: "none", border: "1px solid var(--ink-1)", background: "white",
            color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "11px 22px", borderRadius: 8, cursor: "pointer",
          }}>
            Načíst další hodnocení
          </button>
        </div>

        <ReviewsCTA />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ReviewsApp />);
