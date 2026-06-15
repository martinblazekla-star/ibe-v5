// LTR Multi-property — Map View
//
// Split layout: scrollable list (left) + CZ map with university markers + monthly pins (right).
// Cards mirror BuildingCard rows.
// Pins are colored by accent (vs. brand purple in OTA map).

const { useState: useStateLMM } = React;

const TWEAK_DEFAULTS_LMM = /*EDITMODE-BEGIN*/{
  "mapTheme": "sage",
  "split": "50/50",
  "showRoomsLeft": true,
  "highlightFromCard": true,
  "clusterRadius": 28,
  "showUniversities": true
}/*EDITMODE-END*/;

function AppLtrMpMap() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_LMM);
  const [filters, setFilters] = useStateLMM(window.LTRMP_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateLMM(false);
  const [sortBy, setSortBy] = useStateLMM("recommended");
  const [city, setCity] = useStateLMM("all");
  const [lengthMonths, setLengthMonths] = useStateLMM(9);
  const [audience, setAudience] = useStateLMM("student");
  const [detailBuilding, setDetailBuilding] = useStateLMM(null);
  const [hoveredId, setHoveredId] = useStateLMM(null);
  const [openedGroupId, setOpenedGroupId] = useStateLMM(null);
  const [moveInPicker, setMoveInPicker] = useStateLMM(false);
  const [moveInLabel, setMoveInLabel] = useStateLMM("1. září 2026");

  const cardRefs = React.useRef({});
  const isicMode = audience === "student" || audience === "erasmus";

  const effectiveFilters = React.useMemo(() => {
    const f = { ...filters };
    if (city !== "all") f.cities = [city, ...(f.cities || []).filter(c => c !== city)];
    if (audience === "student") f.isicOnly = true;
    return f;
  }, [filters, city, audience]);

  const filteredBuildings = React.useMemo(() => {
    let bs = window.LTRMP_BUILDINGS.filter(b => window.ltrmpMatches(b, effectiveFilters, { isicMode }));
    if (sortBy === "price-asc")  bs.sort((a, b) => (isicMode ? a.studentPrice || a.monthlyFrom : a.monthlyFrom) - (isicMode ? b.studentPrice || b.monthlyFrom : b.monthlyFrom));
    if (sortBy === "price-desc") bs.sort((a, b) => (isicMode ? b.studentPrice || b.monthlyFrom : b.monthlyFrom) - (isicMode ? a.studentPrice || a.monthlyFrom : a.monthlyFrom));
    if (sortBy === "rating")     bs.sort((a, b) => b.rating - a.rating);
    if (sortBy === "distance")   bs.sort((a, b) => {
      const aMin = Math.min(...(a.nearbyUniversities || []).map(u => u.walkMin ?? 99));
      const bMin = Math.min(...(b.nearbyUniversities || []).map(u => u.walkMin ?? 99));
      return aMin - bMin;
    });
    if (sortBy === "availability") bs.sort((a, b) => b.unitsAvailable - a.unitsAvailable);
    return bs;
  }, [effectiveFilters, sortBy, isicMode]);

  const groups = React.useMemo(
    () => window.mpGroupHotels(filteredBuildings, t.clusterRadius),
    [filteredBuildings, t.clusterRadius]
  );

  const groupByBuildingId = React.useMemo(() => {
    const m = new Map();
    groups.forEach(g => g.hotels.forEach(b => m.set(b.id, g)));
    return m;
  }, [groups]);

  // Highlighted universities: ones referenced by filtered buildings OR explicitly filtered
  const highlightedUnis = React.useMemo(() => {
    if (effectiveFilters.universities && effectiveFilters.universities.length) return new Set(effectiveFilters.universities);
    const s = new Set();
    filteredBuildings.forEach(b => (b.nearbyUniversities || []).forEach(u => s.add(u.id)));
    return s;
  }, [effectiveFilters, filteredBuildings]);

  function reserve(b) {
    window.location.href = `LTR-Pick-Room.html?building=${b.id}`;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <window.LtrMpNav active="bydleni" />

      <div style={{
        position: "sticky", top: 0, zIndex: 60,
        background: "var(--surface)", padding: "18px 36px 14px",
        boxShadow: "0 2px 0 var(--border-soft)",
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <window.LtrMpSearchBar
            city={city}             onCity={setCity}
            moveInLabel={moveInLabel} onOpenMoveIn={() => setMoveInPicker(true)}
            lengthMonths={lengthMonths} onLength={setLengthMonths}
            audience={audience}     onAudience={setAudience}
          />
        </div>
      </div>

      <main style={{ maxWidth: 1480, margin: "0 auto", padding: "16px 36px 60px" }}>
        <window.LtrMpResultsHeader
          count={filteredBuildings.length}
          viewId="map"
          sortValue={sortBy}
          onSort={setSortBy}
          extra={
            <window.LtrMpFiltersButton
              activeCount={window.countLtrmpFilters(effectiveFilters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        <LtrMapSplit split={t.split}
          left={
            <BuildingRowList
              buildings={filteredBuildings}
              hoveredId={hoveredId}
              isicMode={isicMode}
              showRoomsLeft={t.showRoomsLeft}
              cardRefs={cardRefs}
              onHover={(id) => t.highlightFromCard && setHoveredId(id)}
              onClickCard={(b) => {
                const g = groupByBuildingId.get(b.id);
                if (g) setOpenedGroupId(g.id);
              }}
              onOpenDetail={(b) => setDetailBuilding(b)}
              onReserve={(b) => reserve(b)}
            />
          }
          right={
            <LtrMapPanel
              theme={t.mapTheme}
              groups={groups}
              hoveredId={hoveredId}
              openedGroupId={openedGroupId}
              isicMode={isicMode}
              showUniversities={t.showUniversities}
              highlightedUnis={highlightedUnis}
              filteredBuildings={filteredBuildings}
              onHoverPin={setHoveredId}
              onClickPin={(g) => {
                setOpenedGroupId(g.id);
                const first = g.hotels[0];
                if (first && cardRefs.current[first.id]) {
                  cardRefs.current[first.id].scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
              }}
              onClosePopover={() => setOpenedGroupId(null)}
              onOpenDetail={(b) => setDetailBuilding(b)}
              onReserve={(b) => reserve(b)}
            />
          }
        />

        <window.LtrMpFooter />
      </main>

      <window.LtrMpDetailDialog
        open={!!detailBuilding}
        building={detailBuilding}
        isicMode={isicMode}
        lengthMonths={lengthMonths}
        onClose={() => setDetailBuilding(null)}
        onReserve={(b) => reserve(b)}
      />

      <window.LtrMpFiltersDialog
        open={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
        onReset={() => setFilters(window.LTRMP_FILTER_DEFAULTS)}
      />

      <window.MonthlyDatePickerDialog
        open={moveInPicker}
        room={window.LTR_ROOMS?.[0] || { availableFrom: "1. září 2026", monthlyFrom: 12000 }}
        mode="dates-only"
        onClose={() => setMoveInPicker(false)}
        onConfirm={(result) => {
          if (result && result.moveInDay && result.moveInMonth) {
            const months = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];
            setMoveInLabel(`${result.moveInDay}. ${months[result.moveInMonth.getMonth()]} ${result.moveInMonth.getFullYear()}`);
            if (result.length) setLengthMonths(result.length);
          }
          setMoveInPicker(false);
        }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mapa">
          <TweakRadio label="Téma" value={t.mapTheme} onChange={v => setTweak("mapTheme", v)}
            options={[
              { value: "light", label: "Světlé" },
              { value: "sage",  label: "Šalvěj" },
              { value: "warm",  label: "Teplé" },
            ]} />
          <TweakToggle label="Univerzitní markery" value={t.showUniversities} onChange={v => setTweak("showUniversities", v)} />
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

function LtrMapSplit({ split, left, right }) {
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

function BuildingRowList({ buildings, hoveredId, isicMode, showRoomsLeft, cardRefs, onHover, onClickCard, onOpenDetail, onReserve }) {
  if (buildings.length === 0) {
    return (
      <div style={{
        background: "white", border: "1px dashed var(--border)", borderRadius: 12,
        padding: "32px 24px", textAlign: "center", color: "var(--ink-3)",
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-1)" }}>
          Žádné budovy v této kombinaci filtrů
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Zkus rozšířit město nebo zmírnit filtry.</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {buildings.map(b => (
        <div key={b.id} ref={el => { if (el) cardRefs.current[b.id] = el; }}>
          <BuildingRow
            building={b}
            isicMode={isicMode}
            highlighted={hoveredId === b.id}
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

function BuildingRow({ building, isicMode, highlighted, showRoomsLeft, onHover, onClickCard, onOpenDetail, onReserve }) {
  return (
    <article
      onMouseEnter={() => onHover(building.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClickCard(building)}
      style={{
        background: "white", borderRadius: 12, overflow: "hidden",
        border: `1px solid ${highlighted ? "var(--brand)" : "var(--border)"}`,
        boxShadow: highlighted ? "0 4px 18px rgba(31,138,91,0.18)" : "0 1px 2px rgba(16,24,40,.04)",
        display: "grid", gridTemplateColumns: "180px 1fr",
        cursor: "pointer",
        transition: "border-color 0.14s, box-shadow 0.14s",
      }}>
      {/* Image */}
      <div style={{
        position: "relative", minHeight: 188, overflow: "hidden",
        background: "var(--neutral-100)",
      }}>
        <window.BuildingPreview building={building} />
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <window.LtrMpTypeBadge type={building.type} short />
        </div>
        {showRoomsLeft && building.unitsAvailable <= 5 && building.unitsAvailable > 0 && (
          <div style={{
            position: "absolute", left: 10, bottom: 10,
            background: "white", color: "#92400E",
            padding: "3px 7px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10.5,
            display: "inline-flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 5px rgba(15,18,22,0.10)",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            <Icon name="flame" size={10} strokeWidth={2.4} color="#92400E" />
            {building.unitsAvailable} pokojů
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: "13px 16px 13px 18px", display: "flex", flexDirection: "column", gap: 7, minWidth: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--brand-dark)", marginBottom: 3,
            }}>{building.city} · {building.cityArea}</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
              margin: 0, lineHeight: 1.22, letterSpacing: "-0.005em",
            }}>{building.name}</h3>
          </div>
          <window.LtrMpRatingBlock rating={building.rating} reviews={building.reviews} />
        </div>

        <window.LtrMpUniversityBadges buildings={building.nearbyUniversities} limit={2} />
        <window.LtrMpAvailabilityChip building={building} />

        <div style={{
          marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10,
        }}>
          <window.LtrMpPriceBlock building={building} isicMode={isicMode} align="left" />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onOpenDetail(building); }} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
              color: "var(--ink-1)", padding: "7px 12px", borderRadius: 6, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail</button>
            <button onClick={(e) => { e.stopPropagation(); onReserve(building); }} style={{
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

// ─── Map panel ───────────────────────────────────────────────────────────────

function LtrMapPanel({ theme, groups, hoveredId, openedGroupId, isicMode, showUniversities, highlightedUnis, filteredBuildings, onHoverPin, onClickPin, onClosePopover, onOpenDetail, onReserve }) {
  const openedGroup = openedGroupId ? groups.find(g => g.id === openedGroupId) : null;

  // Deduplicate universities (only show distinct shorts visible in highlighted set)
  const visibleUnis = React.useMemo(() => {
    const seen = new Set();
    const list = [];
    window.LTRMP_UNIVERSITIES.forEach(u => {
      if (seen.has(u.short)) return;
      // If a university has the same short as another, keep first (e.g. Praha has CUNI, ČVUT, VŠE — different shorts → all kept)
      seen.add(u.short);
      list.push(u);
    });
    return list;
  }, []);

  return (
    <div onClick={onClosePopover} style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--border)",
      background: "white",
      boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
    }}>
      <window.CzechMapIllustration theme={theme} />

      {/* University markers */}
      {showUniversities && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {visibleUnis.map(u => {
            const xPct = (u.mapCoords.x / window.CZ_W) * 100;
            const yPct = (u.mapCoords.y / window.CZ_H) * 100;
            const dimmed = highlightedUnis.size > 0 && !highlightedUnis.has(u.id);
            return (
              <window.LtrUniversityMarker key={u.id} uni={u} dimmed={dimmed} highlighted={highlightedUnis.has(u.id)}
                style={{ left: `${xPct}%`, top: `${yPct}%` }} />
            );
          })}
        </div>
      )}

      {/* Building pins */}
      <div style={{ position: "absolute", inset: 0 }}>
        {groups.map(g => {
          const xPct = (g.coords.x / window.CZ_W) * 100;
          const yPct = (g.coords.y / window.CZ_H) * 100;
          const ids = g.hotels.map(b => b.id);
          const hovered = ids.includes(hoveredId);
          const selected = openedGroupId === g.id;

          if (g.kind === "cluster") {
            const minPrice = Math.min(...g.hotels.map(b => isicMode ? (b.studentPrice || b.monthlyFrom) : b.monthlyFrom));
            return (
              <window.LtrClusterPin
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
          const b = g.hotels[0];
          return (
            <window.LtrMonthlyPin
              key={g.id}
              building={b}
              isicMode={isicMode}
              hovered={hovered}
              selected={selected}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              onClick={() => onClickPin(g)}
              onMouseEnter={() => onHoverPin(b.id)}
              onMouseLeave={() => onHoverPin(null)}
            />
          );
        })}
      </div>

      {openedGroup && (
        <div style={{
          position: "absolute",
          left: `${(openedGroup.coords.x / window.CZ_W) * 100}%`,
          top: `${(openedGroup.coords.y / window.CZ_H) * 100}%`,
          zIndex: 40,
        }}>
          <BuildingPopover
            group={openedGroup}
            side={(openedGroup.coords.x / window.CZ_W) < 0.55 ? "right" : "left"}
            isicMode={isicMode}
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
        <Icon name="map-pin" size={13} color="var(--brand-dark)" strokeWidth={2} />
        {filteredBuildings.length} {window.cz(filteredBuildings.length, "budova", "budovy", "budov")} v ČR
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", left: 14, top: 56,
        background: "white", borderRadius: 8, padding: "8px 12px",
        boxShadow: "0 2px 8px rgba(15,18,22,0.10)",
        fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-2)",
        whiteSpace: "nowrap",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: "var(--brand)", color: "white", width: 14, height: 14, borderRadius: "50%",
            border: "1.5px solid white", boxShadow: "0 1px 4px rgba(15,18,22,0.15)",
          }} />
          Budovy Balický Living
        </div>
        {showUniversities && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
            <span style={{
              background: "rgba(255,255,255,0.9)", color: "var(--brand-dark)",
              padding: "1px 5px", borderRadius: 999,
              border: "1.5px dashed var(--brand)",
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 9,
              letterSpacing: "0.04em",
            }}>UNI</span>
            Univerzity
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", right: 14, top: 14, display: "flex", flexDirection: "column", gap: 6,
      }} onClick={(e) => e.stopPropagation()}>
        <window.MpMapCtrlBtn><Icon name="plus" size={15} strokeWidth={2.4} /></window.MpMapCtrlBtn>
        <window.MpMapCtrlBtn><Icon name="minus" size={15} strokeWidth={2.4} /></window.MpMapCtrlBtn>
      </div>
    </div>
  );
}

// ─── Popover (anchored to pin) ──────────────────────────────────────────────

function BuildingPopover({ group, side, isicMode, onClose, onOpenDetail, onReserve }) {
  const [idx, setIdx] = useStateLMM(0);
  React.useEffect(() => { setIdx(0); }, [group.id]);
  const total = group.hotels.length;
  const b = group.hotels[Math.min(idx, total - 1)];

  const POPOVER_W = 320;
  const offsetX = side === "right" ? 22 : -POPOVER_W - 22;

  return (
    <div onClick={(e) => e.stopPropagation()} style={{
      position: "absolute", width: POPOVER_W,
      left: offsetX, top: -180,
      background: "white", borderRadius: 12,
      boxShadow: "0 20px 50px rgba(15,18,22,0.25)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      <div style={{
        position: "relative", height: 132,
        background: "var(--neutral-100)", overflow: "hidden",
      }}>
        <window.BuildingPreview building={b} />
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <window.LtrMpTypeBadge type={b.type} short />
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

      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--brand-dark)",
          }}>{b.city} · {b.cityArea}</div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
            margin: "2px 0 0", lineHeight: 1.22, letterSpacing: "-0.005em",
          }}>{b.name}</h3>
        </div>

        <window.LtrMpRatingBlock rating={b.rating} reviews={b.reviews} />
        <window.LtrMpUniversityBadges buildings={b.nearbyUniversities} limit={2} />

        <div style={{
          marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--border-soft)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10,
        }}>
          <window.LtrMpPriceBlock building={b} isicMode={isicMode} align="left" />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <button onClick={() => onOpenDetail(b)} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
              color: "var(--ink-1)", padding: "6px 11px", borderRadius: 6, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail</button>
            <button onClick={() => onReserve(b)} style={{
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

ReactDOM.createRoot(document.getElementById("root")).render(<AppLtrMpMap />);
