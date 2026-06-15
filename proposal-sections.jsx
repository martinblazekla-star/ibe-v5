// Reusable section building blocks for Proposal Engine
// PriceTable, RoomsBlock, Timeline, ContactCard, LoyaltyTeaser, SummaryCard,
// GranularEditPanel, ExtrasPicker

// ─────────────────────────────────────────────────────────────
// PriceTable — categorized line items with subtotals + VAT toggle
function ProposalPriceTable({ items, withVat, onToggleVat, deposit, note }) {
  const subtotals = window.proposalSubtotalByCategory(items);
  const totals = window.proposalTotals(items);
  const grouped = subtotals.map(({ cat }) => ({
    cat,
    items: items.filter((i) => i.cat === cat),
  }));

  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 22px", borderBottom: "1px solid var(--border-soft)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
            color: "var(--ink-1)", letterSpacing: "-0.005em",
          }}>Cenová nabídka</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            Položky po kategoriích, ceny s DPH i bez.
          </div>
        </div>
        <div style={{ display: "inline-flex", padding: 3, background: "var(--neutral-100)", borderRadius: 8 }}>
          {[
            { id: false, label: "Bez DPH" },
            { id: true, label: "S DPH" },
          ].map((o) => {
            const on = withVat === o.id;
            return (
              <button key={String(o.id)} onClick={() => onToggleVat(o.id)} style={{
                appearance: "none", cursor: "pointer", border: "none",
                background: on ? "white" : "transparent",
                color: on ? "var(--ink-1)" : "var(--ink-3)",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5, letterSpacing: "0.01em",
                padding: "6px 14px", borderRadius: 6,
                boxShadow: on ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "8px 22px 6px" }}>
        {grouped.map(({ cat, items: catItems }, idx) => {
          const catSum = catItems.reduce((s, i) => s + i.total, 0);
          const rate = window.PROPOSAL_VAT[cat] ?? 0.21;
          const catNet = catSum / (1 + rate);
          return (
            <div key={cat} style={{ paddingTop: idx === 0 ? 8 : 14, paddingBottom: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 6, background: "color-mix(in oklch, var(--brand) 8%, white)",
                  color: "var(--brand)", flexShrink: 0,
                }}>
                  <Icon name={window.PROPOSAL_CATEGORY_ICONS[cat] || "tag"} size={12} strokeWidth={2.2} />
                </span>
                <span style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-2)", whiteSpace: "nowrap",
                }}>{cat}</span>
                <span style={{ flex: 1, borderBottom: "1px dashed var(--border)" }} />
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-1)",
                  whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
                }}>
                  {window.fmtProposal(withVat ? catSum : catNet)} Kč
                </span>
              </div>
              {catItems.map((it, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "baseline",
                  padding: "6px 0",
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-1)" }}>
                      {it.label}
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {it.qty} · {window.fmtProposal(withVat ? it.unit * (1 + rate) : it.unit)} Kč
                  </div>
                  <div style={{
                    fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-1)",
                    minWidth: 100, textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
                  }}>
                    {window.fmtProposal(withVat ? it.total : it.total / (1 + rate))} Kč
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div style={{ padding: "14px 22px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "3px 0" }}>
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Mezisoučet bez DPH</span>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-1)", whiteSpace: "nowrap" }}>
            {window.fmtProposal(totals.net)} Kč
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "3px 0" }}>
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>DPH</span>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-1)", whiteSpace: "nowrap" }}>
            {window.fmtProposal(totals.vat)} Kč
          </span>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          padding: "10px 0 0", marginTop: 8, borderTop: "1px solid var(--border)",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
            Celkem s DPH
          </span>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
            letterSpacing: "-0.01em", whiteSpace: "nowrap",
          }}>
            {window.fmtProposal(totals.gross)} Kč
          </span>
        </div>
        {deposit != null && (
          <div style={{
            marginTop: 10, padding: "10px 14px", background: "white", borderRadius: 8, border: "1px solid var(--border-soft)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--ink-1)" }}>
                Záloha při potvrzení nabídky
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
                Doplatek 14 dnů před nástupem.
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--brand)" }}>
              {window.fmtProposal(deposit)} Kč
            </span>
          </div>
        )}
        {note && (
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 10, lineHeight: 1.5 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero gallery — 1 main + 2 thumbs, or full-width based on layout
function ProposalGallery({ photos, layout = "classic" }) {
  const [openLightbox, setOpenLightbox] = React.useState(false);
  if (layout === "editorial") {
    return (
      <div style={{
        position: "relative", borderRadius: 14, overflow: "hidden",
        height: 460,
        background: `url(${photos[0].src}) center/cover`,
        boxShadow: "0 8px 28px rgba(15,18,22,.18)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)",
        }} />
        <div style={{
          position: "absolute", left: 24, bottom: 20, right: 24,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={() => setOpenLightbox(true)} style={{
            appearance: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.92)", border: "none", borderRadius: 8,
            padding: "9px 14px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            color: "var(--ink-1)", display: "inline-flex", alignItems: "center", gap: 6,
            backdropFilter: "blur(8px)",
          }}>
            <Icon name="image" size={14} strokeWidth={1.8} />
            Zobrazit všechny fotky ({photos.length + 17})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, height: 420 }}>
      <div style={{
        borderRadius: 12, background: `url(${photos[0].src}) center/cover`,
        position: "relative", overflow: "hidden",
      }} />
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
        <div style={{ borderRadius: 12, background: `url(${photos[1].src}) center/cover` }} />
        <div style={{ borderRadius: 12, background: `url(${photos[2].src}) center/cover`, position: "relative", overflow: "hidden" }}>
          <button onClick={() => setOpenLightbox(true)} style={{
            position: "absolute", right: 10, bottom: 10,
            appearance: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 6,
            padding: "8px 12px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
            color: "var(--ink-1)", display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="image" size={12} strokeWidth={2} />
            Zobrazit všechny ({photos.length + 17})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline — schedule with day grouping
function ProposalTimeline({ schedule }) {
  const byDay = React.useMemo(() => {
    const map = new Map();
    schedule.forEach((s) => {
      if (!map.has(s.day)) map.set(s.day, []);
      map.get(s.day).push(s);
    });
    return [...map.entries()];
  }, [schedule]);

  const catColor = {
    ubytovani: { bg: "color-mix(in oklch, var(--brand) 12%, white)", color: "var(--brand)" },
    strava: { bg: "#FFF7E6", color: "#7A4A0F" },
    aktivita: { bg: "#E8F4EE", color: "#10623E" },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{
          margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
          color: "var(--ink-1)", letterSpacing: "-0.005em",
        }}>Časový harmonogram akce</h3>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
          Časy a místa jednotlivých bodů programu. Doladíme na společné schůzce.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {byDay.map(([day, evts], di) => (
          <div key={day} style={{
            background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              padding: "10px 18px", background: "var(--neutral-50)", borderBottom: "1px solid var(--border-soft)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: 6, background: "var(--brand)", color: "white",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
              }}>{di + 1}</span>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
                letterSpacing: "-0.005em",
              }}>{day}</span>
              <span style={{ fontSize: 12, color: "var(--ink-3)", marginLeft: "auto" }}>
                {evts.length} {evts.length === 1 ? "položka" : evts.length < 5 ? "položky" : "položek"}
              </span>
            </div>
            <ol style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
              {evts.map((e, i) => {
                const c = catColor[e.cat] || catColor.aktivita;
                return (
                  <li key={i} style={{
                    display: "grid", gridTemplateColumns: "78px 1fr auto", gap: 14, alignItems: "baseline",
                    padding: "10px 18px",
                    borderTop: i === 0 ? "none" : "1px solid var(--border-soft)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
                      fontVariantNumeric: "tabular-nums",
                    }}>{e.time}</span>
                    <span style={{
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--ink-1)",
                    }}>{e.title}</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 12, color: c.color, background: c.bg,
                      padding: "3px 8px", borderRadius: 999, fontWeight: 600,
                    }}>{e.loc}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RoomsBlock — list of rooms in the variant
function ProposalRoomsBlock({ scenario, variant, editable, onEdit }) {
  // Generate room cards based on items (use Ubytování items)
  const roomItems = variant.items.filter((i) => i.cat === "Ubytování");
  // Short storno summary — first sentence only
  const stornoShort = (variant.cancellation || "").split(/[,.]/)[0].trim();
  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h3 style={{
          margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
          color: "var(--ink-1)", letterSpacing: "-0.005em",
        }}>Ubytování a pokoje</h3>
        {editable && (
          <button onClick={onEdit} style={{
            appearance: "none", cursor: "pointer", border: "none", background: "transparent",
            color: "var(--brand)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
            display: "inline-flex", alignItems: "center", gap: 4, padding: 0,
            letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Upravit preference <Icon name="chevron-right" size={12} strokeWidth={2.4} />
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roomItems.map((r, i) => (
          <div key={i} style={{
            background: "white", border: "1px solid var(--border)", borderRadius: 10,
            padding: 14, display: "grid", gridTemplateColumns: "120px minmax(0, 1fr) auto", gap: 16, alignItems: "center",
          }}>
            <div style={{
              borderRadius: 8, height: 88, width: 120, flexShrink: 0,
              background: `var(--neutral-100) url(${scenario.photos[i % scenario.photos.length].src}) center/cover no-repeat`,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink-1)",
                letterSpacing: "-0.005em",
              }}>{r.label}</div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 6, fontSize: 12.5, color: "var(--ink-2)",
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="tag" size={11.5} strokeWidth={1.8} color="var(--ink-3)" />
                  Standardní cena
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="info" size={11.5} strokeWidth={1.8} color="var(--ink-3)" />
                  {stornoShort}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="leaf" size={11.5} strokeWidth={1.8} color="var(--ink-3)" />
                  Snídaně v ceně
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>za celý pobyt</div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
                whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
              }}>
                {window.fmtProposal(r.total)} Kč
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ContactCard — agent
function ProposalContactCard({ contact, compact }) {
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: compact ? "14px 16px" : "18px 20px",
      display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center",
    }}>
      <span style={{
        width: compact ? 42 : 56, height: compact ? 42 : 56, borderRadius: "50%",
        background: contact.avatarBg, color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: compact ? 14 : 17,
      }}>{contact.initials}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
          {contact.role}
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: compact ? 14.5 : 16, color: "var(--ink-1)", marginTop: 2,
          letterSpacing: "-0.005em",
        }}>{contact.name}</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.5 }}>
          {contact.email}
          {!compact && <><br />{contact.phone}</>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LoyaltyTeaser — points motivator
function ProposalLoyaltyTeaser({ scenario, totalAmount }) {
  const user = window.__loyaltyUser;
  const pointsToEarn = Math.round(totalAmount / 100);
  return (
    <div style={{
      padding: "14px 18px", borderRadius: 12,
      background: "linear-gradient(135deg, color-mix(in oklch, var(--brand) 8%, white) 0%, color-mix(in oklch, var(--brand) 3%, white) 100%)",
      border: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <span style={{
        width: 40, height: 40, borderRadius: 10, background: "white",
        color: "var(--brand)", border: "1px solid color-mix(in oklch, var(--brand) 18%, white)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="sparkle" size={20} strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
          {user
            ? `${user.tier} člen Balický Clubu`
            : "Získejte body za potvrzení nabídky"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.4 }}>
          Po potvrzení {window.fmtProposal(totalAmount)} Kč získáte
          <strong style={{ color: "var(--brand)" }}> {window.fmtProposal(pointsToEarn)} bodů</strong>
          {user && ` · do dalšího tieru ${user.pointsToNextTier} bodů`}.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GranularEditPanel — guests / meal / dates editing
function GranularEditPanel({ scenario, edits, onEdit }) {
  const baseGuests = scenario.guests.adults + scenario.guests.children;
  const meals = [
    { id: "breakfast", label: "Snídaně", delta: 0 },
    { id: "halfboard", label: "Polopenze", delta: 280 },
    { id: "fullboard", label: "Plná penze", delta: 580 },
  ];

  const dateShift = edits.dateShift || 0;
  const guests = edits.guests ?? baseGuests;
  const meal = edits.meal || "breakfast";

  const dateAdjustedStart = new Date(scenario.dateStart);
  dateAdjustedStart.setDate(dateAdjustedStart.getDate() + dateShift);
  const monthsCs = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];
  const fmtDate = (d) => `${d.getDate()}. ${monthsCs[d.getMonth()]}`;

  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            color: "var(--ink-1)", letterSpacing: "-0.005em",
          }}>Upravit detaily před potvrzením</h3>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
            Cena se přepočítá automaticky.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {/* Guests */}
        <div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Počet osob
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8,
            background: "white",
          }}>
            <button onClick={() => onEdit({ guests: Math.max(1, guests - 1) })} style={{
              appearance: "none", cursor: "pointer", border: "none", background: "transparent",
              padding: "8px 12px", color: "var(--ink-1)",
            }}><Icon name="minus" size={14} strokeWidth={2.4} /></button>
            <span style={{
              padding: "8px 16px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
              minWidth: 32, textAlign: "center", borderLeft: "1px solid var(--border-soft)",
              borderRight: "1px solid var(--border-soft)",
            }}>{guests}</span>
            <button onClick={() => onEdit({ guests: guests + 1 })} style={{
              appearance: "none", cursor: "pointer", border: "none", background: "transparent",
              padding: "8px 12px", color: "var(--ink-1)",
            }}><Icon name="plus" size={14} strokeWidth={2.4} /></button>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 6 }}>
            Původní: {baseGuests} {guests !== baseGuests && <strong style={{ color: "var(--brand)" }}>·  {guests > baseGuests ? "+" : ""}{guests - baseGuests}</strong>}
          </div>
        </div>

        {/* Meals */}
        <div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Strava
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {meals.map((m) => {
              const on = meal === m.id;
              return (
                <button key={m.id} onClick={() => onEdit({ meal: m.id })} style={{
                  appearance: "none", cursor: "pointer", flex: 1,
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "color-mix(in oklch, var(--brand) 6%, white)" : "white",
                  color: on ? "var(--brand)" : "var(--ink-1)",
                  fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 600, fontSize: 12,
                  padding: "8px 4px", borderRadius: 8,
                }}>{m.label}</button>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 6 }}>
            +0–580 Kč / osobu / noc
          </div>
        </div>

        {/* Date shift */}
        <div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Termín posun (±3 dny)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range" min={-3} max={3} step={1} value={dateShift}
              onChange={(e) => onEdit({ dateShift: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: dateShift === 0 ? "var(--ink-3)" : "var(--brand)",
              minWidth: 40, textAlign: "right", fontVariantNumeric: "tabular-nums",
            }}>{dateShift > 0 ? "+" : ""}{dateShift} {dateShift === 1 || dateShift === -1 ? "den" : "dny"}</span>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 6 }}>
            {fmtDate(dateAdjustedStart)} — viz harmonogram
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ExtrasPicker — pick add-on services
function ProposalExtrasPicker({ selected, onChange }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{
          margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
          color: "var(--ink-1)", letterSpacing: "-0.005em",
        }}>Volitelné služby a doplňky</h3>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
          Vyberte si, co k pobytu chcete přidat. Lze upravit i později.
        </div>
      </div>
      <div style={{
        background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      }}>
        {window.PROPOSAL_EXTRAS.map((ex, i) => {
          const qty = selected[ex.id] || 0;
          const on = qty > 0;
          return (
            <div key={ex.id} style={{
              display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, alignItems: "center",
              padding: "12px 18px",
              borderTop: i === 0 ? "none" : "1px solid var(--border-soft)",
              background: on ? "color-mix(in oklch, var(--brand) 3%, white)" : "white",
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
                }}>{ex.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{ex.sub}</div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8,
                background: "white",
              }}>
                <button onClick={() => onChange({ ...selected, [ex.id]: Math.max(0, qty - 1) })} disabled={qty === 0} style={{
                  appearance: "none", cursor: qty === 0 ? "not-allowed" : "pointer", border: "none", background: "transparent",
                  padding: "6px 10px", color: qty === 0 ? "var(--ink-4)" : "var(--ink-1)",
                }}><Icon name="minus" size={13} strokeWidth={2.4} /></button>
                <span style={{
                  padding: "6px 12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                  minWidth: 24, textAlign: "center", borderLeft: "1px solid var(--border-soft)",
                  borderRight: "1px solid var(--border-soft)", color: qty === 0 ? "var(--ink-3)" : "var(--ink-1)",
                  fontVariantNumeric: "tabular-nums",
                }}>{qty}</span>
                <button onClick={() => onChange({ ...selected, [ex.id]: qty + 1 })} style={{
                  appearance: "none", cursor: "pointer", border: "none", background: "transparent",
                  padding: "6px 10px", color: "var(--ink-1)",
                }}><Icon name="plus" size={13} strokeWidth={2.4} /></button>
              </div>
              <div style={{ textAlign: "right", minWidth: 96 }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                  color: on ? "var(--brand)" : "var(--ink-1)", whiteSpace: "nowrap",
                }}>
                  +{window.fmtProposal(ex.price * (qty || 1))} Kč
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, whiteSpace: "nowrap" }}>za {ex.unit}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ProposalInlineUpsell — IBE-style addons grid (used inline on the detail page)
// Matches the AddonsSection from the standard checkout: 2-column grid of
// selectable cards with checkbox, icon, label, sub, price delta, optional
// "Popular" pill.
function ProposalInlineUpsell({ selected, onChange }) {
  const items = window.PROPOSAL_EXTRAS;
  const iconMap = {
    wine: "sparkle", fruit: "leaf", flowers: "leaf",
    transfer: "voucher", insurance: "info", parking: "voucher",
  };
  const popularIds = new Set(["wine", "parking"]);
  const selectedCount = items.filter((ex) => (selected[ex.id] || 0) > 0).length;

  const toggle = (ex) => {
    const qty = selected[ex.id] || 0;
    onChange({ ...selected, [ex.id]: qty > 0 ? 0 : 1 });
  };
  const setQty = (ex, q) => {
    onChange({ ...selected, [ex.id]: Math.max(0, q) });
  };

  return (
    <div>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
            color: "var(--ink-1)", letterSpacing: "-0.005em",
          }}>Vylepšete svoji nabídku</h3>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.5 }}>
            Volitelné doplňky se přičtou k celkové ceně. Můžete přidat i později.
          </div>
        </div>
        {selectedCount > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 999,
            background: "color-mix(in oklch, var(--brand) 8%, white)", color: "var(--brand)",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.04em",
          }}>
            <Icon name="check" size={11} strokeWidth={2.6} />
            {selectedCount} {selectedCount === 1 ? "doplněk přidán" : selectedCount < 5 ? "doplňky přidány" : "doplňků přidáno"}
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map((ex) => {
          const qty = selected[ex.id] || 0;
          const on = qty > 0;
          const popular = popularIds.has(ex.id);
          const total = ex.price * Math.max(1, qty);
          return (
            <div key={ex.id} style={{
              position: "relative",
              border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              borderRadius: 10, padding: "14px 16px",
              fontFamily: "var(--font-ui)",
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              {popular && (
                <span style={{
                  position: "absolute", top: -8, right: 12,
                  fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: "white",
                  background: "var(--accent)", padding: "3px 8px", borderRadius: 4,
                }}>Oblíbené</span>
              )}
              <button
                onClick={() => toggle(ex)}
                aria-pressed={on}
                style={{
                  appearance: "none", cursor: "pointer", padding: 0,
                  width: 20, height: 20, borderRadius: 5,
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "var(--brand)" : "white", marginTop: 2, flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{on && <Icon name="check" size={13} color="white" strokeWidth={3} />}</button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <button
                  onClick={() => toggle(ex)}
                  style={{
                    appearance: "none", border: "none", background: "transparent", cursor: "pointer",
                    textAlign: "left", padding: 0, width: "100%",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name={iconMap[ex.id] || "tag"} size={15} color="var(--ink-3)" strokeWidth={1.8} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{ex.label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{ex.sub}</div>
                </button>

                {on && (
                  <div style={{
                    marginTop: 10, display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8,
                      background: "white",
                    }}>
                      <button onClick={() => setQty(ex, qty - 1)} style={{
                        appearance: "none", cursor: "pointer", border: "none", background: "transparent",
                        padding: "5px 9px", color: "var(--ink-1)",
                      }}><Icon name="minus" size={12} strokeWidth={2.4} /></button>
                      <span style={{
                        padding: "5px 10px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5,
                        minWidth: 22, textAlign: "center", borderLeft: "1px solid var(--border-soft)",
                        borderRight: "1px solid var(--border-soft)", fontVariantNumeric: "tabular-nums",
                      }}>{qty}</span>
                      <button onClick={() => setQty(ex, qty + 1)} style={{
                        appearance: "none", cursor: "pointer", border: "none", background: "transparent",
                        padding: "5px 9px", color: "var(--ink-1)",
                      }}><Icon name="plus" size={12} strokeWidth={2.4} /></button>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>za {ex.unit}</span>
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                  color: on ? "var(--brand)" : "var(--ink-1)", whiteSpace: "nowrap",
                }}>+ {window.fmtProposal(total)} Kč</div>
                {!on && (
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, whiteSpace: "nowrap" }}>za {ex.unit}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat — small numeric stat for hero header
function ProposalStat({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        width: 36, height: 36, borderRadius: 8, background: "color-mix(in oklch, var(--brand) 7%, white)",
        color: "var(--brand)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}><Icon name={icon} size={16} strokeWidth={1.8} /></span>
      <div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--ink-3)",
        }}>{label}</div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          letterSpacing: "-0.005em", marginTop: 1,
        }}>{value}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ProposalPriceTable, ProposalGallery, ProposalTimeline, ProposalRoomsBlock,
  ProposalContactCard, ProposalLoyaltyTeaser, GranularEditPanel, ProposalExtrasPicker,
  ProposalInlineUpsell, ProposalStat,
});
