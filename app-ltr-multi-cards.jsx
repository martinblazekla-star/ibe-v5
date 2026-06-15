// LTR Multi-property — Cards View
//
// Building grid (3-col). Each card carries:
//   image (thumbnail) · brand mark · location · name · rating · universities
//   · amenity icons · availability/move-in · monthly price block · CTA

const { useState: useStateLC } = React;

const TWEAK_DEFAULTS_LMC = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "density": "comfortable",
  "columns": 3,
  "showRoomsLeft": true,
  "showUniversityRow": true,
  "stickySearch": true
}/*EDITMODE-END*/;

function AppLtrMpCards() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_LMC);
  const [filters, setFilters] = useStateLC(window.LTRMP_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateLC(false);
  const [sortBy, setSortBy] = useStateLC("recommended");
  const [city, setCity] = useStateLC("all");
  const [lengthMonths, setLengthMonths] = useStateLC(9);
  const [audience, setAudience] = useStateLC("student");
  const [detailBuilding, setDetailBuilding] = useStateLC(null);
  const [moveInPicker, setMoveInPicker] = useStateLC(false);
  const [moveInLabel, setMoveInLabel] = useStateLC("1. září 2026");

  const isicMode = audience === "student" || audience === "erasmus";

  const effectiveFilters = React.useMemo(() => {
    const f = { ...filters };
    if (city !== "all") f.cities = [city, ...(f.cities || []).filter(c => c !== city)];
    if (audience === "student") f.isicOnly = true;
    return f;
  }, [filters, city, audience]);

  const sortedBuildings = React.useMemo(() => {
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

  function reserve(b) {
    window.location.href = `LTR-Pick-Room.html?building=${b.id}`;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <window.LtrMpNav active="bydleni" />

      {t.showHero && (
        <window.LtrMpHero
          buildingsCount={window.LTRMP_BUILDINGS.length}
          citiesCount={window.LTRMP_CITIES.length}
        />
      )}

      <div style={{
        position: t.stickySearch ? "sticky" : "relative", top: 0, zIndex: 60,
        background: "var(--surface)", padding: "18px 36px 14px",
        boxShadow: t.stickySearch ? "0 2px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <window.LtrMpSearchBar
            city={city}             onCity={setCity}
            moveInLabel={moveInLabel} onOpenMoveIn={() => setMoveInPicker(true)}
            lengthMonths={lengthMonths} onLength={setLengthMonths}
            audience={audience}     onAudience={setAudience}
          />
        </div>
      </div>

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: "20px 36px 60px" }}>
        <window.LtrMpResultsHeader
          count={sortedBuildings.length}
          viewId="cards"
          sortValue={sortBy}
          onSort={setSortBy}
          extra={
            <window.LtrMpFiltersButton
              activeCount={window.countLtrmpFilters(effectiveFilters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        {sortedBuildings.length === 0 ? (
          <EmptyStateLM onReset={() => { setFilters(window.LTRMP_FILTER_DEFAULTS); setCity("all"); }} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${t.columns}, minmax(0, 1fr))`,
            gap: t.density === "compact" ? 16 : 22,
          }}>
            {sortedBuildings.map(b => (
              <BuildingCard
                key={b.id}
                building={b}
                isicMode={isicMode}
                density={t.density}
                showRoomsLeft={t.showRoomsLeft}
                showUniversityRow={t.showUniversityRow}
                onOpenDetail={() => setDetailBuilding(b)}
                onReserve={() => reserve(b)}
              />
            ))}
          </div>
        )}

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

      {/* Move-in picker uses existing LTR monthly date picker in dates-only mode */}
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
        <TweakSection label="Layout">
          <TweakRadio label="Sloupce" value={t.columns} onChange={v => setTweak("columns", v)}
            options={[
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
            ]} />
          <TweakRadio label="Hustota" value={t.density} onChange={v => setTweak("density", v)}
            options={[
              { value: "comfortable", label: "Pohodlná" },
              { value: "compact",     label: "Hutná" },
            ]} />
          <TweakToggle label="Hero band" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Sticky search" value={t.stickySearch} onChange={v => setTweak("stickySearch", v)} />
        </TweakSection>
        <TweakSection label="Karta">
          <TweakToggle label="Univerzity na kartě" value={t.showUniversityRow} onChange={v => setTweak("showUniversityRow", v)} />
          <TweakToggle label="Zbývající pokoje" value={t.showRoomsLeft} onChange={v => setTweak("showRoomsLeft", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ─── Building card ──────────────────────────────────────────────────────────

function BuildingCard({ building, isicMode, density, showRoomsLeft, showUniversityRow, onOpenDetail, onReserve }) {
  const compact = density === "compact";
  const imageHeight = compact ? 168 : 210;

  return (
    <article style={{
      background: "white", borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--border)",
      boxShadow: "0 1px 2px rgba(16,24,40,.04)",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 0.18s, transform 0.18s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 6px 22px rgba(16,24,40,.10)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}>
      {/* IMAGE */}
      <div style={{
        position: "relative", height: imageHeight,
        background: "var(--neutral-100)",
        overflow: "hidden",
      }}>
        <window.BuildingPreview building={building} />
        <div style={{ position: "absolute", left: 12, top: 12, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <window.LtrMpTypeBadge type={building.type} />
        </div>

        {/* Save heart */}
        <button onClick={(e) => e.stopPropagation()} aria-label="Uložit" style={{
          position: "absolute", right: 12, top: 12, width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)", color: "var(--ink-2)", border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="heart" size={15} strokeWidth={1.8} />
        </button>

        <div style={{
          position: "absolute", left: 12, bottom: 12,
          background: "rgba(15,18,22,0.62)", color: "white",
          padding: "3px 8px", borderRadius: 4,
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 11,
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={11} strokeWidth={1.8} />
          {1 + (building.secondaryImages?.length || 0)}
        </div>

        {showRoomsLeft && building.unitsAvailable <= 5 && building.unitsAvailable > 0 && (
          <div style={{
            position: "absolute", right: 12, bottom: 12,
            background: "white", color: "#92400E",
            padding: "4px 9px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
            display: "inline-flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 6px rgba(15,18,22,0.12)",
            letterSpacing: "0.02em", textTransform: "uppercase",
          }}>
            <Icon name="flame" size={11} strokeWidth={2.4} color="#92400E" />
            Posledních {building.unitsAvailable}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", gap: compact ? 8 : 10,
        padding: compact ? "13px 15px 14px" : "16px 18px 18px",
      }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--brand-dark)",
        }}>{building.city} · {building.cityArea}</div>

        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: compact ? 17 : 18, color: "var(--ink-1)",
          margin: 0, lineHeight: 1.22, letterSpacing: "-0.005em", textWrap: "balance",
        }}>{building.name}</h3>

        <window.LtrMpRatingBlock rating={building.rating} reviews={building.reviews} />

        {showUniversityRow && (
          <window.LtrMpUniversityBadges buildings={building.nearbyUniversities} limit={compact ? 2 : 3} />
        )}

        <window.LtrMpAmenityRow amenities={building.amenities} limit={compact ? 3 : 5} />

        {/* Availability */}
        <div style={{ marginTop: 2 }}>
          <window.LtrMpAvailabilityChip building={building} />
        </div>

        {/* Footer row */}
        <div style={{
          marginTop: "auto", paddingTop: compact ? 10 : 12,
          borderTop: "1px solid var(--border-soft)",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end",
        }}>
          <window.LtrMpPriceBlock building={building} isicMode={isicMode} align="left" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={onOpenDetail} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              color: "var(--ink-1)", padding: "8px 14px", borderRadius: 7, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail & pokoje</button>
            <button onClick={onReserve} style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
              padding: "9px 14px", borderRadius: 7, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              Rezervovat
              <Icon name="chevron-right" size={13} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyStateLM({ onReset }) {
  return (
    <div style={{
      background: "white", border: "1px dashed var(--border)", borderRadius: 14,
      padding: "48px 24px", textAlign: "center", color: "var(--ink-3)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, background: "var(--neutral-100)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "var(--ink-3)", marginBottom: 14,
      }}>
        <Icon name="search" size={26} strokeWidth={1.8} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink-1)" }}>
        Žádné budovy v této kombinaci filtrů
      </div>
      <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
        Zkus rozšířit město, cenový rozsah nebo zmírnit vybavení.
      </div>
      <button onClick={onReset} style={{
        marginTop: 16, appearance: "none", border: "none", cursor: "pointer",
        background: "var(--brand)", color: "white",
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        padding: "10px 18px", borderRadius: 7,
      }}>Vymazat filtry</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppLtrMpCards />);
