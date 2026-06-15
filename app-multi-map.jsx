// Multi-property — Map View (cards left + CZ map right)
//
// Layout:
//   1. MpNav
//   2. Sticky search bar (Destinace + Termín + Hosté + Pouze pro členy)
//   3. MpResultsHeader (count + FilterButton + ViewSwitcher + Sort)
//   4. Split: scrollable list of hotel rows (left)  |  sticky CZ map (right)
//   5. MpFooter

const { useState: useStateMpM } = React;

const TWEAK_DEFAULTS_MPM = /*EDITMODE-BEGIN*/{
  "mapTheme": "light",
  "split": "50/50",
  "showRoomsLeft": true,
  "highlightFromCard": true,
  "clusterRadius": 28
}/*EDITMODE-END*/;

function AppMpMap() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_MPM);
  const [filters, setFilters] = useStateMpM(window.MP_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateMpM(false);
  const [sortBy, setSortBy] = useStateMpM("recommended");
  const [destination, setDestination] = useStateMpM("all");
  const [memberOnly, setMemberOnly] = useStateMpM(false);
  const [detailHotel, setDetailHotel] = useStateMpM(null);
  const [hoveredHotelId, setHoveredHotelId] = useStateMpM(null);
  const [openedGroupId, setOpenedGroupId] = useStateMpM(null);

  const cardRefs = React.useRef({});

  const effectiveFilters = React.useMemo(() => {
    const f = { ...filters };
    if (destination !== "all") f.cities = [destination, ...(f.cities || []).filter(c => c !== destination)];
    return f;
  }, [filters, destination]);

  const filteredHotels = React.useMemo(() => {
    let hs = window.MP_HOTELS.filter(h => window.hotelMatchesFilter(h, effectiveFilters, { memberMode: memberOnly }));
    if (sortBy === "price-asc") {
      hs.sort((a, b) => (memberOnly ? a.memberPrice : a.fromPrice) - (memberOnly ? b.memberPrice : b.fromPrice));
    } else if (sortBy === "price-desc") {
      hs.sort((a, b) => (memberOnly ? b.memberPrice : b.fromPrice) - (memberOnly ? a.memberPrice : a.fromPrice));
    } else if (sortBy === "rating") {
      hs.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "stars") {
      hs.sort((a, b) => b.stars - a.stars || b.rating - a.rating);
    }
    return hs;
  }, [effectiveFilters, sortBy, memberOnly]);

  const groups = React.useMemo(
    () => window.mpGroupHotels(filteredHotels, t.clusterRadius),
    [filteredHotels, t.clusterRadius]
  );

  const groupByHotelId = React.useMemo(() => {
    const m = new Map();
    groups.forEach(g => g.hotels.forEach(h => m.set(h.id, g)));
    return m;
  }, [groups]);

  function reserve(hotel) {
    window.location.href = `Pick-Room-Table-View.html?hotel=${hotel.id}`;
  }

  function focusHotel(hotel) {
    const g = groupByHotelId.get(hotel.id);
    if (g) setOpenedGroupId(g.id);
    if (cardRefs.current[hotel.id]) {
      cardRefs.current[hotel.id].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <window.MpNav active="hotely" />

      {/* Sticky search bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 60,
        background: "var(--surface)", padding: "18px 36px 14px",
        boxShadow: "0 2px 0 var(--border-soft)",
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <window.MpSearchBar
            destination={destination}
            onDestination={setDestination}
            memberOnly={memberOnly}
            onMemberOnly={setMemberOnly}
          />
        </div>
      </div>

      <main style={{ maxWidth: 1480, margin: "0 auto", padding: "16px 36px 60px" }}>
        <window.MpResultsHeader
          count={filteredHotels.length}
          viewId="map"
          sortValue={sortBy}
          onSort={setSortBy}
          extra={
            <window.MpFiltersButton
              activeCount={window.countActiveMpFilters(effectiveFilters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        <MapSplit split={t.split}
          left={
            <HotelRowList
              hotels={filteredHotels}
              hoveredHotelId={hoveredHotelId}
              memberMode={memberOnly}
              showRoomsLeft={t.showRoomsLeft}
              cardRefs={cardRefs}
              onHover={(id) => t.highlightFromCard && setHoveredHotelId(id)}
              onClickCard={(h) => {
                const g = groupByHotelId.get(h.id);
                if (g) setOpenedGroupId(g.id);
              }}
              onOpenDetail={(h) => setDetailHotel(h)}
              onReserve={(h) => reserve(h)}
            />
          }
          right={
            <MapPanel
              theme={t.mapTheme}
              groups={groups}
              hoveredHotelId={hoveredHotelId}
              openedGroupId={openedGroupId}
              memberMode={memberOnly}
              onHoverPin={setHoveredHotelId}
              onClickPin={(g) => {
                setOpenedGroupId(g.id);
                const first = g.hotels[0];
                if (first && cardRefs.current[first.id]) {
                  cardRefs.current[first.id].scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
              }}
              onClosePopover={() => setOpenedGroupId(null)}
              onOpenDetail={(h) => setDetailHotel(h)}
              onReserve={(h) => reserve(h)}
              filteredCount={filteredHotels.length}
            />
          }
        />

        <window.MpFooter />
      </main>

      <window.HotelDetailDialog
        open={!!detailHotel}
        hotel={detailHotel}
        memberMode={memberOnly}
        onClose={() => setDetailHotel(null)}
        onReserve={(h) => reserve(h)}
      />

      <window.MpFiltersDialog
        open={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
        onReset={() => setFilters(window.MP_FILTER_DEFAULTS)}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mapa">
          <TweakRadio label="Téma" value={t.mapTheme} onChange={v => setTweak("mapTheme", v)}
            options={[
              { value: "light", label: "Světlé" },
              { value: "sage",  label: "Šalvěj" },
              { value: "warm",  label: "Teplé" },
            ]} />
          <TweakSlider label="Radius clusterů" value={t.clusterRadius} min={0} max={80} step={4}
            onChange={v => setTweak("clusterRadius", v)} unit="px" />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio label="Poměr karty / mapa" value={t.split} onChange={v => setTweak("split", v)}
            options={[
              { value: "60/40", label: "60 / 40" },
              { value: "50/50", label: "50 / 50" },
              { value: "40/60", label: "40 / 60" },
            ]} />
          <TweakToggle label="Zbývající pokoje na kartě" value={t.showRoomsLeft} onChange={v => setTweak("showRoomsLeft", v)} />
          <TweakToggle label="Hover karty → pin" value={t.highlightFromCard} onChange={v => setTweak("highlightFromCard", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function MapSplit({ split, left, right }) {
  const ratio = split === "50/50" ? "1fr 1fr" : split === "40/60" ? "1fr 1.5fr" : "1.5fr 1fr";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: ratio, gap: 22, alignItems: "start", marginTop: 8,
    }}>
      <div style={{ minWidth: 0 }}>{left}</div>
      <div style={{
        position: "sticky", top: 158,
        height: "calc(100vh - 178px)", minHeight: 560,
      }}>{right}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Hotel rows (compact list cards on the left)
// ───────────────────────────────────────────────────────────────────────────

function HotelRowList({ hotels, hoveredHotelId, memberMode, showRoomsLeft, cardRefs, onHover, onClickCard, onOpenDetail, onReserve }) {
  if (hotels.length === 0) {
    return (
      <div style={{
        background: "white", border: "1px dashed var(--border)", borderRadius: 12,
        padding: "32px 24px", textAlign: "center", color: "var(--ink-3)",
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-1)" }}>
          Žádné hotely v této kombinaci filtrů
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Zkuste rozšířit destinaci nebo cenové rozpětí.</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {hotels.map(h => (
        <div key={h.id} ref={el => { if (el) cardRefs.current[h.id] = el; }}>
          <HotelRow
            hotel={h}
            memberMode={memberMode}
            highlighted={hoveredHotelId === h.id}
            showRoomsLeft={showRoomsLeft}
            onHover={onHover}
            onClickCard={onClickCard}
            onOpenDetail={onOpenDetail}
            onReserve={onReserve}
          />
        </div>
      ))}
    </div>
  );
}

function HotelRow({ hotel, memberMode, highlighted, showRoomsLeft, onHover, onClickCard, onOpenDetail, onReserve }) {
  return (
    <article
      onMouseEnter={() => onHover(hotel.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClickCard(hotel)}
      style={{
        background: "white", borderRadius: 12, overflow: "hidden",
        border: `1px solid ${highlighted ? "var(--brand)" : "var(--border)"}`,
        boxShadow: highlighted ? "0 4px 18px rgba(85,1,115,0.18)" : "0 1px 2px rgba(16,24,40,.04)",
        display: "grid", gridTemplateColumns: "180px 1fr",
        cursor: "pointer",
        transition: "border-color 0.14s, box-shadow 0.14s",
      }}>
      {/* Image */}
      <div style={{
        position: "relative", minHeight: 168,
        background: `url(${hotel.image}) center/cover var(--neutral-100)`,
      }}>
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <window.MpHotelTypeBadge type={hotel.type} stars={hotel.stars} />
        </div>
        {showRoomsLeft && hotel.roomsAvailable <= 3 && (
          <div style={{
            position: "absolute", left: 10, bottom: 10,
            background: "white", color: "#A6151D",
            padding: "3px 7px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10.5,
            display: "inline-flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 5px rgba(15,18,22,0.10)",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            <Icon name="flame" size={10} strokeWidth={2.4} color="#A6151D" />
            Poslední {hotel.roomsAvailable}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: "14px 16px 14px 18px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--brand)", marginBottom: 3,
            }}>{hotel.city} · {hotel.cityArea}</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16.5, color: "var(--ink-1)",
              margin: 0, lineHeight: 1.22, letterSpacing: "-0.005em",
            }}>{hotel.name}</h3>
          </div>
          <window.MpRatingBlock rating={hotel.rating} reviews={hotel.reviews} />
        </div>

        <window.MpAmenityRow amenities={hotel.amenities} limit={4} />

        <div style={{
          marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10,
        }}>
          <window.MpPriceBlock hotel={hotel} memberMode={memberMode} align="left" />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onOpenDetail(hotel); }} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
              color: "var(--ink-1)", padding: "7px 12px", borderRadius: 6, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail</button>
            <button onClick={(e) => { e.stopPropagation(); onReserve(hotel); }} style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
              padding: "8px 13px", borderRadius: 6, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
            }}>
              Rezervovat
              <Icon name="chevron-right" size={12} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Map panel (right): CZ illustration + pins + popover
// ───────────────────────────────────────────────────────────────────────────

function MapPanel({ theme, groups, hoveredHotelId, openedGroupId, memberMode, onHoverPin, onClickPin, onClosePopover, onOpenDetail, onReserve, filteredCount }) {
  const openedGroup = openedGroupId ? groups.find(g => g.id === openedGroupId) : null;

  return (
    <div onClick={onClosePopover} style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--border)",
      background: "white",
      boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
    }}>
      <window.CzechMapIllustration theme={theme} />

      {/* Pin layer */}
      <div style={{ position: "absolute", inset: 0 }}>
        {groups.map(g => {
          const xPct = (g.coords.x / window.CZ_W) * 100;
          const yPct = (g.coords.y / window.CZ_H) * 100;
          const hotelIds = g.hotels.map(h => h.id);
          const hovered = hotelIds.includes(hoveredHotelId);
          const selected = openedGroupId === g.id;

          if (g.kind === "cluster") {
            const minPrice = Math.min(...g.hotels.map(h => memberMode ? h.memberPrice : h.fromPrice));
            return (
              <window.MpClusterPin
                key={g.id}
                count={g.hotels.length}
                fromPrice={minPrice}
                hovered={hovered}
                selected={selected}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onClick={() => onClickPin(g)}
                onMouseEnter={() => onHoverPin(g.hotels[0].id)}
                onMouseLeave={() => onHoverPin(null)}
              />
            );
          }
          const h = g.hotels[0];
          return (
            <window.MpPricePin
              key={g.id}
              hotel={h}
              memberMode={memberMode}
              hovered={hovered}
              selected={selected}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              onClick={() => onClickPin(g)}
              onMouseEnter={() => onHoverPin(h.id)}
              onMouseLeave={() => onHoverPin(null)}
            />
          );
        })}
      </div>

      {/* Popover */}
      {openedGroup && (
        <div style={{
          position: "absolute",
          left: `${(openedGroup.coords.x / window.CZ_W) * 100}%`,
          top: `${(openedGroup.coords.y / window.CZ_H) * 100}%`,
          zIndex: 40,
        }}>
          <HotelPopover
            group={openedGroup}
            side={(openedGroup.coords.x / window.CZ_W) < 0.55 ? "right" : "left"}
            memberMode={memberMode}
            onClose={onClosePopover}
            onOpenDetail={onOpenDetail}
            onReserve={onReserve}
          />
        </div>
      )}

      {/* Top-left status chip */}
      <div style={{
        position: "absolute", left: 14, top: 14,
        background: "white", borderRadius: 8, padding: "7px 12px",
        boxShadow: "0 2px 8px rgba(15,18,22,0.10)",
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5, color: "var(--ink-2)",
        whiteSpace: "nowrap",
      }} onClick={(e) => e.stopPropagation()}>
        <Icon name="map-pin" size={13} color="var(--brand)" strokeWidth={2} />
        {filteredCount} {window.cz(filteredCount, "hotel", "hotely", "hotelů")} v Česku
      </div>

      {/* Zoom controls */}
      <div style={{
        position: "absolute", right: 14, top: 14, display: "flex", flexDirection: "column", gap: 6,
      }} onClick={(e) => e.stopPropagation()}>
        <window.MpMapCtrlBtn><Icon name="plus" size={15} strokeWidth={2.4} /></window.MpMapCtrlBtn>
        <window.MpMapCtrlBtn><Icon name="minus" size={15} strokeWidth={2.4} /></window.MpMapCtrlBtn>
      </div>

      {/* Bottom search-while-moving */}
      <div style={{
        position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)",
        background: "white", borderRadius: 999, padding: "8px 14px",
        boxShadow: "0 4px 16px rgba(15,18,22,0.12)",
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5, color: "var(--ink-1)",
        border: "1px solid var(--border)",
      }} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" defaultChecked style={{ accentColor: "var(--brand)", width: 14, height: 14 }} />
        Hledat při posunu mapy
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Hotel popover (anchored to pin)
// ───────────────────────────────────────────────────────────────────────────

function HotelPopover({ group, side, memberMode, onClose, onOpenDetail, onReserve }) {
  const [idx, setIdx] = useStateMpM(0);
  React.useEffect(() => { setIdx(0); }, [group.id]);
  const total = group.hotels.length;
  const hotel = group.hotels[Math.min(idx, total - 1)];

  const POPOVER_W = 320;
  const offsetX = side === "right" ? 22 : -POPOVER_W - 22;

  return (
    <div onClick={(e) => e.stopPropagation()} style={{
      position: "absolute", width: POPOVER_W,
      left: offsetX, top: -160,
      background: "white", borderRadius: 12,
      boxShadow: "0 20px 50px rgba(15,18,22,0.25)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {/* Image */}
      <div style={{
        position: "relative", height: 140,
        background: `url(${hotel.image}) center/cover var(--neutral-100)`,
      }}>
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <window.MpHotelTypeBadge type={hotel.type} stars={hotel.stars} />
        </div>
        <button onClick={onClose} aria-label="Zavřít" style={{
          position: "absolute", right: 10, top: 10,
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)", color: "var(--ink-1)",
          border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="x" size={14} strokeWidth={2.4} />
        </button>
        {total > 1 && (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 10,
            display: "flex", justifyContent: "center", gap: 4,
          }}>
            <span style={{
              background: "rgba(15,18,22,0.62)", color: "white",
              padding: "3px 9px", borderRadius: 999,
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <button onClick={() => setIdx((idx - 1 + total) % total)} style={popoverArrowStyle("left")}>
                <Icon name="chevron-right" size={11} strokeWidth={2.4} color="white" />
              </button>
              {idx + 1} / {total}
              <button onClick={() => setIdx((idx + 1) % total)} style={popoverArrowStyle("right")}>
                <Icon name="chevron-right" size={11} strokeWidth={2.4} color="white" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--brand)",
          }}>{hotel.city} · {hotel.cityArea}</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
            margin: "2px 0 0", lineHeight: 1.22, letterSpacing: "-0.005em",
          }}>{hotel.name}</h3>
        </div>

        <window.MpRatingBlock rating={hotel.rating} reviews={hotel.reviews} />
        <window.MpAmenityRow amenities={hotel.amenities} limit={3} />

        <div style={{
          marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--border-soft)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10,
        }}>
          <window.MpPriceBlock hotel={hotel} memberMode={memberMode} align="left" />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <button onClick={() => onOpenDetail(hotel)} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
              color: "var(--ink-1)", padding: "6px 11px", borderRadius: 6, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail</button>
            <button onClick={() => onReserve(hotel)} style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
              padding: "7px 11px", borderRadius: 6, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
            }}>
              Rezervovat
              <Icon name="chevron-right" size={11} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function popoverArrowStyle(direction) {
  return {
    appearance: "none", border: "none", background: "transparent", cursor: "pointer",
    padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
    transform: direction === "left" ? "rotate(180deg)" : "none",
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppMpMap />);
