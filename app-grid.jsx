// Pick Room — GRID CARD view: 3-up cards with rate dialog
const { useState: useStateGV } = React;

const TWEAK_DEFAULTS_GV = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "stickyHeader": true,
  "sortBy": "recommended",
  "columns": 3
}/*EDITMODE-END*/;

function fmtG(n) { return n.toLocaleString("cs-CZ"); }

// — Rate picker dialog: shown after a room card click —

function RatePickerDialog({ open, room, onClose, onPick }) {
  if (!open || !room) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 720, maxHeight: "92vh", overflow: "hidden",
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", display: "flex", flexDirection: "column",
      }}>
        <header style={{
          padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Dostupné sazby</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)", marginTop: 2 }}>{room.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1 }}>č. {room.number} · {room.capacity} osob · {room.size} m²</div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px", background: "var(--neutral-50)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {room.rates.map(rate => (
              <div key={rate.id} style={{
                background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px",
                display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 16, alignItems: "center",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{rate.name}</span>
                    {rate.badge && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
                        background: "var(--accent-tint)", color: "var(--accent-dark)",
                        fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
                      }}>
                        <Icon name="flame" size={11} strokeWidth={2.4} /> {rate.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      padding: "2px 6px", borderRadius: 999, background: "var(--accent-tint)",
                      color: "var(--accent-dark)", fontSize: 12, fontWeight: 600,
                    }}>
                      <Icon name="check" size={10} strokeWidth={2.4} /> {rate.meal.replace(" v ceně", "")}
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      padding: "2px 6px", borderRadius: 999,
                      background: rate.cancellable ? "var(--accent-tint)" : "var(--neutral-100)",
                      color: rate.cancellable ? "var(--accent-dark)" : "var(--ink-3)",
                      fontSize: 12, fontWeight: 600,
                    }}>
                      <Icon name={rate.cancellable ? "check" : "x"} size={10} strokeWidth={2.4} /> {rate.cancellable ? "Storno zdarma" : "Nevratná"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 110 }}>
                  {rate.originalPrice && (
                    <div style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                      {fmtG(rate.originalPrice)} Kč
                    </div>
                  )}
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-1)",
                    lineHeight: 1.05, marginTop: rate.originalPrice ? 2 : 0, letterSpacing: "-0.005em",
                  }}>
                    {fmtG(rate.price)} <span style={{ fontSize: 12, fontWeight: 600 }}>Kč</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>za 2 noci</div>
                </div>
                <button onClick={() => onPick(rate)} style={{
                  appearance: "none", border: "none", cursor: "pointer",
                  background: "var(--brand)", color: "white",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
                  padding: "10px 16px", borderRadius: 6, letterSpacing: "0.02em",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  Vybrat
                  <Icon name="chevron-right" size={13} strokeWidth={2.4} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomGridCard({ room, selections, onOpen, onOpenConfig }) {
  const cheapest = room.rates.length ? Math.min(...room.rates.map(r => r.price)) : null;
  const original = room.rates.find(r => r.originalPrice)?.originalPrice;
  const selectedCount = Object.values(selections).filter(s => s.room?.id === room.id).reduce((sum, s) => sum + s.qty, 0);

  return (
    <article style={{
      background: "white", border: `1.5px solid ${selectedCount > 0 ? "var(--brand)" : "var(--border)"}`, borderRadius: 12,
      overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 160ms ease, transform 160ms ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(16,24,40,.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      {/* Image */}
      <div style={{
        position: "relative", aspectRatio: "16 / 10",
        background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`,
        filter: room.soldOut ? "grayscale(1) brightness(.85)" : "none",
      }}>
        {room.soldOut && <div style={{ position: "absolute", inset: 0, background: "rgba(15,18,22,0.55)" }} />}
        <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6 }}>
          {room.tags.slice(0, 2).map(tg => (
            <span key={tg} style={{
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
              color: "var(--ink-1)", background: "rgba(255,255,255,0.94)",
              padding: "4px 8px", borderRadius: 4,
            }}>{tg}</span>
          ))}
        </div>
        {room.remaining && room.remaining <= 2 && !room.soldOut && (
          <div style={{
            position: "absolute", right: 10, top: 10,
            display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px",
            background: "rgba(166,21,29,0.95)", borderRadius: 6,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5, color: "white", letterSpacing: "0.02em",
          }}>
            <Icon name="flame" size={11} strokeWidth={2.4} />
            Poslední {room.remaining}
          </div>
        )}
        <div style={{
          position: "absolute", right: 10, bottom: 10,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
          color: "white", background: "rgba(15,18,22,0.6)",
          padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={12} strokeWidth={1.8} />
          <span>{room.tags.includes("Suite") || room.tags.includes("Apartmán") ? "8" : "4"} foto</span>
        </div>
        {room.soldOut && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white",
              background: "rgba(15,18,22,0.85)", padding: "8px 16px", borderRadius: 8, letterSpacing: "0.04em",
            }}>Vyprodáno v tomto termínu</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
              margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
            }}>{room.name}</h3>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>č. {room.number}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", color: "var(--ink-2)", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="person" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.capacity}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="size" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.size} m²
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="bed" size={14} color="var(--ink-3)" strokeWidth={1.8} /> {room.beds}
          </span>
        </div>

        <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
          {room.amenities.slice(0, 4).join(" · ")}{room.amenities.length > 4 && " · …"}
        </div>

        <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } })); }} style={{
          marginTop: "auto", fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 700,
          color: "var(--brand)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Detail pokoje · galerie →
        </a>
      </div>

      {/* Price + CTA */}
      {room.soldOut ? (
        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)" }}>
          <button style={{
            width: "100%", appearance: "none", border: "1px solid var(--ink-1)", background: "white", color: "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "10px 14px", borderRadius: 8, cursor: "pointer",
          }}>Náhradní termín</button>
        </div>
      ) : (
        <div style={{
          padding: "14px 18px", borderTop: "1px solid var(--border)",
          background: selectedCount > 0 ? "var(--accent-tint)" : "color-mix(in oklch, var(--brand) 2%, white)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            {original && (
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                {fmtG(original)} Kč
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>od</span>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
                lineHeight: 1.05, letterSpacing: "-0.01em",
              }}>{fmtG(cheapest)}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Kč</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>
              {room.rates.length} {room.rates.length > 1 ? "varianty" : "varianta"} · 2 noci
            </div>
          </div>
          <button onClick={() => onOpen(room)} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: selectedCount > 0 ? "var(--ink-1)" : "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "11px 16px", borderRadius: 8, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {selectedCount > 0 ? <><Icon name="check" size={13} strokeWidth={2.6} /> {selectedCount}× vybráno</> : <>Vybrat sazbu <Icon name="chevron-right" size={14} strokeWidth={2.4} /></>}
          </button>
        </div>
      )}
    </article>
  );
}

function HeroGV() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
      padding: "12px 18px", borderRadius: 8, marginBottom: 14,
      background: "color-mix(in oklch, var(--brand) 4%, white)",
      border: "1px solid color-mix(in oklch, var(--brand) 12%, white)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="sparkle" size={18} color="var(--brand)" strokeWidth={2} />
        <div style={{ fontSize: 14, color: "var(--ink-1)" }}>
          <strong>Ve Vašem termínu jsou dostupné výhodné balíčky.</strong> Romantický víkend od 7 200 Kč · Wellness pobyt od 8 900 Kč.
        </div>
      </div>
      <a href="Pick-Package.html" style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--brand)",
        textDecoration: "none", letterSpacing: "0.02em",
      }}>Zobrazit balíčky →</a>
    </div>
  );
}

function AppGV() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_GV);
  const [selections, setSelections] = useStateGV({});
  const [pickerRoom, setPickerRoom] = useStateGV(null);
  const [configRate, setConfigRate] = useStateGV(null);
  const [filters, setFilters] = useStateGV(window.ROOM_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateGV(false);

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  const sortedRooms = React.useMemo(() => {
    const rs = [...window.ROOMS];
    if (t.sortBy === "price-asc") {
      rs.sort((a, b) => {
        const pa = a.rates.length ? Math.min(...a.rates.map(r => r.price)) : Infinity;
        const pb = b.rates.length ? Math.min(...b.rates.map(r => r.price)) : Infinity;
        return pa - pb;
      });
    } else if (t.sortBy === "price-desc") {
      rs.sort((a, b) => {
        const pa = a.rates.length ? Math.min(...a.rates.map(r => r.price)) : 0;
        const pb = b.rates.length ? Math.min(...b.rates.map(r => r.price)) : 0;
        return pb - pa;
      });
    } else if (t.sortBy === "size") {
      rs.sort((a, b) => b.size - a.size);
    }
    return rs;
  }, [t.sortBy]);

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <PickRoomNav active="ubytovani" />
      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <PickRoomBreadcrumb />
          <PickRoomSearchBar />
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px 140px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          <BestPriceGuarantee />
          <MemberActiveRibbon />
          <MemberSignUpBanner />
        </div>
        <ResultsHeader
          count={sortedRooms.length}
          viewId="grid"
          sortValue={t.sortBy}
          onSort={(v) => setTweak("sortBy", v)}
          extra={
            <window.RoomFiltersButton
              activeCount={window.countActiveRoomFilters(filters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${t.columns}, minmax(0, 1fr))`,
          gap: 16,
        }}>
          {sortedRooms.map(room => (
            <RoomGridCard
              key={room.id}
              room={room}
              selections={selections}
              onOpen={(r) => setPickerRoom(r)}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <WhyBookDirect />
        </div>

        <PickRoomFooter />
      </main>

      <PickRoomReservationBar selections={selections} onClear={() => setSelections({})} />

      <RatePickerDialog
        open={!!pickerRoom}
        room={pickerRoom}
        onClose={() => setPickerRoom(null)}
        onPick={(rate) => {
          setConfigRate({ room: pickerRoom, rate, initialRooms: 1 });
          setPickerRoom(null);
        }}
      />

      <window.RateConfigDialog
        open={!!configRate}
        room={configRate?.room}
        rate={configRate?.rate}
        initialRooms={configRate?.initialRooms}
        onClose={() => setConfigRate(null)}
        onConfirm={(cfg) => {
          const key = `${configRate.room.id}-${configRate.rate.id}`;
          setSelections(prev => ({ ...prev, [key]: { room: configRate.room, rate: configRate.rate, qty: cfg.rooms, cfg } }));
          setConfigRate(null);
        }}
      />

      <DetailDialogsHost onPickRoomRate={(room, rate) => setConfigRate({ room, rate, initialRooms: 1 })} />

      <window.RoomFiltersDialog
        open={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
        onReset={() => setFilters(window.ROOM_FILTER_DEFAULTS)}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
          <TweakToggle label="Banner s balíčky" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakRadio label="Sloupce" value={t.columns} onChange={v => setTweak("columns", v)} options={[
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
          ]} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppGV />);
