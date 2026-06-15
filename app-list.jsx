// Pick Room — LIST view: compact horizontal rows with rates inline
const { useState: useStateLV } = React;

const TWEAK_DEFAULTS_LV = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "showImage": true,
  "stickyHeader": true,
  "sortBy": "recommended"
}/*EDITMODE-END*/;

function fmtL(n) { return n.toLocaleString("cs-CZ"); }

function SpecLV({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.2 }}>
      <Icon name={icon} size={14} color="var(--ink-3)" strokeWidth={1.8} />
      <span style={{ fontWeight: 500 }}>{children}</span>
    </span>
  );
}

function RateLine({ rate, onSelect, qty, onQty }) {
  return (
    <div style={{
      padding: "12px 16px", borderTop: "1px solid var(--border-soft)",
      display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto", alignItems: "center", gap: 14,
      background: qty > 0 ? "var(--accent-tint)" : "transparent",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)" }}>{rate.name}</span>
          {rate.badge && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 6px",
              background: "var(--accent-tint)", color: "var(--accent-dark)",
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
            }}>
              <Icon name="flame" size={10} strokeWidth={2.4} /> {rate.badge}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            padding: "2px 6px", borderRadius: 999, background: "var(--accent-tint)",
            color: "var(--accent-dark)", fontSize: 11.5, fontWeight: 600,
          }}>
            <Icon name="check" size={10} strokeWidth={2.4} /> {rate.meal.replace(" v ceně", "")}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            padding: "2px 6px", borderRadius: 999,
            background: rate.cancellable ? "var(--accent-tint)" : "var(--neutral-100)",
            color: rate.cancellable ? "var(--accent-dark)" : "var(--ink-3)",
            fontSize: 11.5, fontWeight: 600,
          }}>
            <Icon name={rate.cancellable ? "check" : "x"} size={10} strokeWidth={2.4} /> {rate.cancellable ? "Storno zdarma" : "Nevratná"}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "right", minWidth: 110 }}>
        {rate.originalPrice && (
          <div style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
            {fmtL(rate.originalPrice)} Kč
          </div>
        )}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
          lineHeight: 1.05, marginTop: rate.originalPrice ? 2 : 0, letterSpacing: "-0.005em",
        }}>
          {fmtL(rate.price)} <span style={{ fontSize: 12, fontWeight: 600 }}>Kč</span>
        </div>
        <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>za 2 noci</div>
      </div>
      <select value={qty} onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        if (n > 0) onSelect(n);
        else onQty(0);
      }} style={{
        appearance: "none", border: "1px solid var(--border)", borderRadius: 6, background: "white",
        padding: "7px 26px 7px 10px", fontSize: 13, fontWeight: 600, color: "var(--ink-1)", cursor: "pointer", minWidth: 60,
        backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
        backgroundPosition: "calc(100% - 12px) 50%, calc(100% - 8px) 50%",
        backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
      }}>
        {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={() => onSelect(1)} style={{
        appearance: "none", border: "none", cursor: "pointer",
        background: qty > 0 ? "var(--ink-1)" : "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        padding: "8px 14px", borderRadius: 6, letterSpacing: "0.02em",
        display: "inline-flex", alignItems: "center", gap: 5,
      }}>
        {qty > 0 ? <><Icon name="check" size={13} strokeWidth={2.6} /> Vybráno</> : <>Rezervovat <Icon name="chevron-right" size={13} strokeWidth={2.4} /></>}
      </button>
    </div>
  );
}

function RoomRow({ room, selections, onOpenConfig, showImage }) {
  return (
    <article style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      display: "grid", gridTemplateColumns: showImage ? "200px minmax(0, 1fr)" : "minmax(0, 1fr)",
    }}>
      {showImage && (
        <div style={{ position: "relative", background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`, minHeight: 220, filter: room.soldOut ? "grayscale(1)" : "none" }}>
          {room.soldOut && <div style={{ position: "absolute", inset: 0, background: "rgba(15,18,22,0.4)" }} />}
          <div style={{ position: "absolute", left: 10, top: 10, display: "flex", gap: 6 }}>
            {room.tags.slice(0, 1).map(tg => (
              <span key={tg} style={{
                fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                color: "var(--ink-1)", background: "rgba(255,255,255,0.94)",
                padding: "4px 7px", borderRadius: 4,
              }}>{tg}</span>
            ))}
          </div>
          <div style={{
            position: "absolute", right: 10, bottom: 10,
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 600,
            color: "white", background: "rgba(15,18,22,0.6)",
            padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="image" size={11} strokeWidth={1.8} />
            <span>{room.tags.includes("Suite") || room.tags.includes("Apartmán") ? "8" : "4"}</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{
          padding: "16px 18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          background: "color-mix(in oklch, var(--neutral-100) 30%, white)",
          borderBottom: room.soldOut ? "none" : "1px solid var(--border)",
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
                margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
              }}>{room.name}</h3>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)" }}>č. {room.number}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <SpecLV icon="person">{room.capacity}</SpecLV>
              <SpecLV icon="size">{room.size} m²</SpecLV>
              <SpecLV icon="bed">{room.beds}</SpecLV>
              <SpecLV icon="view">{room.view}</SpecLV>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, color: "var(--ink-3)", fontSize: 12.5 }}>
              {room.amenities.slice(0, 5).map(a => (
                <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="check" size={11} color="var(--accent)" strokeWidth={2.4} />
                  {a}
                </span>
              ))}
              {room.amenities.length > 5 && (
                <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
                  + {room.amenities.length - 5} dalších
                </a>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {room.remaining && room.remaining <= 2 && !room.soldOut && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 9px",
                background: "#FFF1F1", border: "1px solid #F5C6C6", borderRadius: 6,
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, color: "#A6151D",
              }}>
                <Icon name="flame" size={12} strokeWidth={2.2} />
                Poslední {room.remaining}
              </div>
            )}
            <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } })); }} style={{
              display: "block", marginTop: 8, fontFamily: "var(--font-ui)", fontSize: 12.5, fontWeight: 700,
              color: "var(--brand)", textDecoration: "none",
            }}>Detail · galerie →</a>
          </div>
        </div>

        {/* Rates list */}
        {room.soldOut ? (
          <div style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 18, background: "var(--neutral-50)", flex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Ve Vašem termínu nedostupné</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Zkuste náhradní termín — pokoj může být dostupný v jiných datech.</div>
            </div>
            <button style={{
              appearance: "none", border: "1px solid var(--ink-1)", background: "white", color: "var(--ink-1)",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
              padding: "9px 16px", borderRadius: 6, cursor: "pointer",
            }}>Najít náhradní termín</button>
          </div>
        ) : (
          <div>
            {room.rates.map(r => {
              const key = `${room.id}-${r.id}`;
              const qty = selections[key]?.qty ?? 0;
              return (
                <RateLine
                  key={r.id}
                  rate={r}
                  qty={qty}
                  onSelect={(n) => onOpenConfig(room, r, n)}
                  onQty={() => onOpenConfig(room, r, 0, true)}
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function HeroLV() {
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

function AppLV() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_LV);
  const [selections, setSelections] = useStateLV({});
  const [configRate, setConfigRate] = useStateLV(null);
  const [filters, setFilters] = useStateLV(window.ROOM_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateLV(false);

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
          viewId="list"
          sortValue={t.sortBy}
          onSort={(v) => setTweak("sortBy", v)}
          extra={
            <window.RoomFiltersButton
              activeCount={window.countActiveRoomFilters(filters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sortedRooms.map(room => (
            <RoomRow
              key={room.id}
              room={room}
              selections={selections}
              onOpenConfig={(r, rate, rooms) => setConfigRate({ room: r, rate, initialRooms: rooms })}
              showImage={t.showImage}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <WhyBookDirect />
        </div>

        <PickRoomFooter />
      </main>

      <PickRoomReservationBar selections={selections} onClear={() => setSelections({})} />

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
          <TweakToggle label="Fotka pokoje" value={t.showImage} onChange={v => setTweak("showImage", v)} />
        </TweakSection>
        <TweakSection label="Barvy">
          <div style={{ fontSize: 12, color: "#6D7073", lineHeight: 1.5 }}>
            Štítky využívají zelenou akcentní barvu, CTA a tlačítka primary fialovou. Brand-locked.
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLV />);
