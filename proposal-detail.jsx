// Proposal detail page — 2 layout variants:
// "classic"  → Figma-style 2-column with sticky sidebar
// "editorial" → Cinematic single-column with hero, big type, stats strip

// ─────────────────────────────────────────────────────────────
// Hero / header section (varies by layout)
function ProposalHero({ scenario, variant, layout, daysLeft, totalAmount }) {
  if (layout === "editorial") {
    return (
      <div>
        <window.ProposalGallery photos={scenario.photos} layout="editorial" />
        <div style={{ paddingTop: 24 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 999,
            background: "color-mix(in oklch, var(--brand) 8%, white)", color: "var(--brand)",
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            <Icon name="sparkle" size={11} strokeWidth={2.4} />
            Nabídka {scenario.proposalNumber}
          </div>
          <h1 style={{
            margin: "14px 0 8px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
            letterSpacing: "-0.02em", lineHeight: 1.1, textWrap: "balance",
          }}>{scenario.title}</h1>
          <div style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 680 }}>
            {scenario.subtitle}{variant.recommended && <> · <strong style={{ color: "var(--brand)" }}>{variant.name}</strong></>}
          </div>

          {/* Stats strip */}
          <div style={{
            margin: "22px 0 0", padding: "16px 22px",
            background: "white", border: "1px solid var(--border)", borderRadius: 12,
            display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 22,
          }}>
            <window.ProposalStat icon="calendar" label="Termín" value={scenario.dateLabel} />
            <window.ProposalStat icon="users" label="Hosté" value={`${scenario.guests.adults + scenario.guests.children} osob`} />
            <window.ProposalStat icon="bed" label="Pokoje" value={`${scenario.rooms} pokojů, ${scenario.nights} ${scenario.nights === 1 ? "noc" : scenario.nights < 5 ? "noci" : "nocí"}`} />
            <window.ProposalStat icon="info" label="Platnost" value={`${daysLeft} dní`} />
          </div>
        </div>
      </div>
    );
  }

  // Classic
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)",
          }}>
            Nabídka {scenario.proposalNumber} · {variant.name}
          </div>
          <h1 style={{
            margin: "6px 0 6px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--ink-1)",
            letterSpacing: "-0.015em", lineHeight: 1.15,
          }}>{scenario.title}</h1>
          <div style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
            {scenario.subtitle}
          </div>
        </div>
      </div>
      <window.ProposalGallery photos={scenario.photos} layout="classic" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sidebar summary card (classic layout)
function ProposalSidebar({ scenario, variant, daysLeft, edits, extras, onConfirm, onDecline }) {
  const totals = window.proposalTotals(variant.items);
  const extrasTotal = Object.entries(extras || {}).reduce((sum, [id, qty]) => {
    const ex = window.PROPOSAL_EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price * qty : 0);
  }, 0);
  const grandTotal = totals.gross + extrasTotal;

  return (
    <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Expiry pill */}
      <div style={{
        padding: "10px 14px", borderRadius: 10, background: "#FFF7E6", color: "#7A4A0F",
        border: "1px solid #F2D88B",
        display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
      }}>
        <Icon name="info" size={14} strokeWidth={2.2} />
        Tato nabídka expiruje za {daysLeft} {daysLeft === 1 ? "den" : daysLeft < 5 ? "dny" : "dní"}
      </div>

      <div style={{
        background: "white", border: "1px solid var(--border)", borderRadius: 12,
        padding: "18px 20px",
      }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)",
        }}>Shrnutí nabídky</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 12 }}>
          <SummaryRow icon="calendar" value={scenario.dateLabel} sub={`${scenario.nights} ${scenario.nights === 1 ? "noc" : scenario.nights < 5 ? "noci" : "nocí"}`} />
          <SummaryRow icon="users" value={`${scenario.guests.adults} dospělí${scenario.guests.children ? `, ${scenario.guests.children} dětí` : ""}`} />
          <SummaryRow icon="bed" value={`${scenario.rooms} pokojů`} sub={variant.name} />
          {Object.values(extras || {}).some((q) => q > 0) && (
            <SummaryRow icon="sparkle" value={`${Object.values(extras).filter((q) => q > 0).length} extra služeb`} />
          )}
        </div>

        <div style={{ height: 1, background: "var(--border-soft)", margin: "14px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Celkem s DPH
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>
              vč. všech poplatků
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink-1)",
              letterSpacing: "-0.015em",
            }}>{window.fmtProposal(grandTotal)} Kč</div>
            {extrasTotal > 0 && (
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
                z toho extras +{window.fmtProposal(extrasTotal)} Kč
              </div>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 12, padding: "9px 12px",
          background: "var(--neutral-50)", borderRadius: 8, border: "1px solid var(--border-soft)",
          fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5,
        }}>
          Záloha <strong style={{ color: "var(--brand)" }}>{window.fmtProposal(variant.deposit)} Kč</strong> při potvrzení.
          Doplatek 14 dnů před nástupem.
        </div>

        <button onClick={onConfirm} style={{
          marginTop: 14, width: "100%",
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
          padding: "13px 18px", borderRadius: 10, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          Pokračovat k potvrzení
          <Icon name="chevron-right" size={15} strokeWidth={2.4} />
        </button>

        <button onClick={onDecline} style={{
          marginTop: 8, width: "100%",
          appearance: "none", border: "none", cursor: "pointer",
          background: "transparent", color: "var(--ink-3)",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
          padding: "8px 18px", borderRadius: 8, letterSpacing: "0.04em", textTransform: "uppercase",
          textDecoration: "underline",
        }}>Odmítnout nabídku</button>
      </div>

      <window.ProposalContactCard contact={scenario.contact} compact />
    </div>
  );
}

function SummaryRow({ icon, value, sub }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 10, alignItems: "flex-start" }}>
      <Icon name={icon} size={15} strokeWidth={1.8} color="var(--brand)" />
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, color: "var(--ink-1)" }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom action bar (always-visible)
function ProposalBottomBar({ scenario, variant, extras, onConfirm, onDecline, label = "K POTVRZENÍ" }) {
  const totals = window.proposalTotals(variant.items);
  const extrasTotal = Object.entries(extras || {}).reduce((sum, [id, qty]) => {
    const ex = window.PROPOSAL_EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price * qty : 0);
  }, 0);
  const grandTotal = totals.gross + extrasTotal;

  return (
    <div style={{
      position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "white", borderTop: "1px solid var(--border)",
      padding: "12px 32px",
      display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 18, alignItems: "center",
      boxShadow: "0 -4px 20px rgba(15,18,22,0.06)",
    }}>
      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-2)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {scenario.rooms} pokojů · {scenario.nights} {scenario.nights === 1 ? "noc" : scenario.nights < 5 ? "noci" : "nocí"} · {scenario.guests.adults + scenario.guests.children} osob · {variant.name}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>Celkem s DPH</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {window.fmtProposal(grandTotal)} Kč
        </div>
      </div>
      <button onClick={onDecline} style={{
        appearance: "none", cursor: "pointer", border: "1px solid var(--border)",
        background: "white", color: "var(--ink-1)",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        padding: "11px 18px", borderRadius: 8,
      }}>Odmítnout</button>
      <button onClick={onConfirm} style={{
        appearance: "none", cursor: "pointer", border: "none",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
        padding: "12px 22px", borderRadius: 8, letterSpacing: "0.05em",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        {label}
        <Icon name="chevron-right" size={14} strokeWidth={2.6} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ProposalDetail — main page, switches between layouts
function ProposalDetail({ scenario, variant, layout, daysLeft, tweaks, edits, onEdit, extras, onChangeExtras, onConfirm, onDecline, onSwitchVariant }) {
  const showLoyalty = tweaks.showLoyalty;
  const showTimeline = tweaks.showTimeline;
  const showGranular = tweaks.granularEdit;
  const [withVat, setWithVat] = React.useState(true);

  const totals = window.proposalTotals(variant.items);

  // Editorial layout
  if (layout === "editorial") {
    return (
      <>
        <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px 24px" }}>
          <ProposalHero scenario={scenario} variant={variant} layout="editorial" daysLeft={daysLeft} totalAmount={totals.gross} />

          {scenario.variants.length > 1 && (
            <section style={{ marginTop: 28 }}>
              <VariantSwitcher scenario={scenario} variant={variant} onSwitch={onSwitchVariant} />
            </section>
          )}

          {/* Intro letter */}
          <section style={{ marginTop: 26 }}>
            <div style={{
              padding: "18px 22px", background: "white",
              border: "1px solid var(--border)", borderRadius: 12,
              borderLeft: "3px solid var(--brand)",
              whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.65, color: "var(--ink-1)",
            }}>{scenario.intro}</div>
            <div style={{ marginTop: 12 }}>
              <window.ProposalContactCard contact={scenario.contact} />
            </div>
          </section>

          {showLoyalty && (
            <section style={{ marginTop: 26 }}>
              <window.ProposalLoyaltyTeaser scenario={scenario} totalAmount={totals.gross} />
            </section>
          )}

          {showGranular && (
            <section style={{ marginTop: 26 }}>
              <window.GranularEditPanel scenario={scenario} edits={edits} onEdit={onEdit} />
            </section>
          )}

          <section style={{ marginTop: 30 }}>
            <window.ProposalRoomsBlock scenario={scenario} variant={variant} editable={showGranular} />
          </section>

          <section style={{ marginTop: 30 }}>
            <window.ProposalPriceTable
              items={variant.items} withVat={withVat} onToggleVat={setWithVat}
              deposit={variant.deposit}
              note={`${variant.cancellation} Při zadání všech proměnných (počet osob, strava) se cena přepočítá.`}
            />
          </section>

          <section style={{ marginTop: 30 }}>
            <window.ProposalInlineUpsell selected={extras} onChange={onChangeExtras} />
          </section>

          {showTimeline && (
            <section style={{ marginTop: 30 }}>
              <window.ProposalTimeline schedule={scenario.schedule} />
            </section>
          )}
        </main>
        <ProposalBottomBar scenario={scenario} variant={variant} extras={extras}
          onConfirm={onConfirm} onDecline={onDecline} />
      </>
    );
  }

  // Classic layout — 2-column
  return (
    <>
      <main style={{
        maxWidth: 1280, margin: "0 auto", padding: "28px 32px 24px",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 28,
      }}>
        <div style={{ minWidth: 0 }}>
          <ProposalHero scenario={scenario} variant={variant} layout="classic" daysLeft={daysLeft} totalAmount={totals.gross} />

          {scenario.variants.length > 1 && (
            <section style={{ marginTop: 24 }}>
              <VariantSwitcher scenario={scenario} variant={variant} onSwitch={onSwitchVariant} />
            </section>
          )}

          <section style={{ marginTop: 24, padding: "20px 22px", background: "white",
            border: "1px solid var(--border)", borderRadius: 12,
          }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 4 }}>
              Úvodní zpráva
            </div>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-1)" }}>
              {scenario.intro}
            </div>
          </section>

          {showLoyalty && (
            <section style={{ marginTop: 24 }}>
              <window.ProposalLoyaltyTeaser scenario={scenario} totalAmount={totals.gross} />
            </section>
          )}

          {showGranular && (
            <section style={{ marginTop: 24 }}>
              <window.GranularEditPanel scenario={scenario} edits={edits} onEdit={onEdit} />
            </section>
          )}

          <section style={{ marginTop: 28 }}>
            <window.ProposalRoomsBlock scenario={scenario} variant={variant} editable={showGranular} />
          </section>

          <section style={{ marginTop: 28 }}>
            <window.ProposalPriceTable
              items={variant.items} withVat={withVat} onToggleVat={setWithVat}
              deposit={variant.deposit}
              note={variant.cancellation}
            />
          </section>

          <section style={{ marginTop: 28 }}>
            <window.ProposalInlineUpsell selected={extras} onChange={onChangeExtras} />
          </section>

          {showTimeline && (
            <section style={{ marginTop: 28 }}>
              <window.ProposalTimeline schedule={scenario.schedule} />
            </section>
          )}
        </div>

        <aside>
          <ProposalSidebar
            scenario={scenario}
            variant={variant}
            daysLeft={daysLeft}
            edits={edits}
            extras={extras}
            onConfirm={onConfirm}
            onDecline={onDecline}
          />
        </aside>
      </main>
      <ProposalBottomBar scenario={scenario} variant={variant} extras={extras}
        onConfirm={onConfirm} onDecline={onDecline} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// VariantSwitcher — prominent variant picker shown at the top of the
// detail page when a scenario has multiple variants. Highlights, full
// price, recommended badge and inline pick CTA.
function VariantSwitcher({ scenario, variant, onSwitch }) {
  if (scenario.variants.length < 2) return null;
  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)",
          }}>Krok 1 · Vyberte variantu</div>
          <h2 style={{
            margin: "4px 0 4px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
            color: "var(--ink-1)", letterSpacing: "-0.01em",
          }}>Připravili jsme {scenario.variants.length} {scenario.variants.length === 2 ? "varianty" : "varianty"} nabídky</h2>
          <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 600 }}>
            Přepínejte mezi variantami — detail níže se okamžitě překreslí. Vybranou variantu potvrdíte až v dalším kroku.
          </div>
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${scenario.variants.length}, minmax(0, 1fr))`,
        gap: 12, alignItems: "stretch",
      }}>
        {scenario.variants.map((v) => {
          const on = v.id === variant.id;
          const totals = window.proposalTotals(v.items);
          return (
            <article key={v.id} style={{
              position: "relative",
              background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
              border: on
                ? "2px solid var(--brand)"
                : (v.recommended ? "1.5px solid color-mix(in oklch, var(--brand) 30%, white)" : "1px solid var(--border)"),
              borderRadius: 12, overflow: "hidden",
              boxShadow: on ? "0 8px 24px rgba(85,1,115,0.12)" : "0 1px 2px rgba(0,0,0,0.03)",
              display: "flex", flexDirection: "column",
              transition: "transform .15s ease",
            }}>
              {v.recommended && (
                <div style={{
                  background: on ? "var(--brand)" : "color-mix(in oklch, var(--brand) 8%, white)",
                  color: on ? "white" : "var(--brand)",
                  padding: "6px 14px",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <Icon name="sparkle" size={11} strokeWidth={2.4} />
                  Doporučujeme
                </div>
              )}
              <div style={{ padding: "16px 18px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
                      color: on ? "var(--brand)" : "var(--ink-1)", letterSpacing: "-0.01em",
                    }}>{v.name}</h3>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.45 }}>
                      {v.sub}
                    </div>
                  </div>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                    background: on ? "var(--brand)" : "white", flexShrink: 0, marginTop: 2,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>{on && <Icon name="check" size={13} color="white" strokeWidth={3} />}</span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
                    letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums",
                  }}>{window.fmtProposal(totals.gross)} Kč</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>s DPH</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>
                  Záloha {window.fmtProposal(v.deposit)} Kč
                </div>

                <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  {v.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} style={{
                      display: "grid", gridTemplateColumns: "14px 1fr", gap: 8, alignItems: "flex-start",
                      fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.4,
                    }}>
                      <Icon name="check" size={12} strokeWidth={2.6} color={on ? "var(--brand)" : "var(--accent)"} />
                      <span>{h}</span>
                    </li>
                  ))}
                  {v.highlights.length > 4 && (
                    <li style={{ fontSize: 12, color: "var(--ink-3)", marginLeft: 22, marginTop: 2 }}>
                      + {v.highlights.length - 4} dalších v detailu níže
                    </li>
                  )}
                </ul>

                <button onClick={() => onSwitch(v)} disabled={on} style={{
                  marginTop: 14, appearance: "none",
                  cursor: on ? "default" : "pointer",
                  border: on ? "none" : `1.5px solid ${v.recommended ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "var(--brand)" : (v.recommended ? "var(--brand)" : "white"),
                  color: on ? "white" : (v.recommended ? "white" : "var(--ink-1)"),
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
                  padding: "9px 14px", borderRadius: 8,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {on ? <><Icon name="check" size={13} strokeWidth={2.6} /> Vybráno</> : "Vybrat tuto variantu"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { ProposalDetail, ProposalBottomBar });
