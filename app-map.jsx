// Pick Room — MAP VIEW (main app shell)

const MV_APARTS = window.APARTMENTS;

function AppMV() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_MV);
  const [selections, setSelections] = useStateMV({});
  const [hoveredBld, setHoveredBld] = useStateMV(null);
  const [openedGroupId, setOpenedGroupId] = useStateMV(null);
  const [pickerAp, setPickerAp] = useStateMV(null);
  const [configRate, setConfigRate] = useStateMV(null);
  const [filters, setFilters] = useStateMV(window.FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateMV(false);
  const [sortBy, setSortBy] = useStateMV("recommended");

  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  // Filter apartments
  const filteredAparts = useMemoMV(() => {
    let rs = MV_APARTS.filter(a => window.apartmentMatchesFilter(a, filters));

    if (sortBy === "price-asc") {
      rs.sort((a, b) => Math.min(...a.rates.map(r => r.price)) - Math.min(...b.rates.map(r => r.price)));
    } else if (sortBy === "price-desc") {
      rs.sort((a, b) => Math.min(...b.rates.map(r => r.price)) - Math.min(...a.rates.map(r => r.price)));
    } else if (sortBy === "rating") {
      rs.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "size") {
      rs.sort((a, b) => b.size - a.size);
    }
    return rs;
  }, [filters, sortBy]);

  // Group for pins
  const groups = useMemoMV(() => groupApartments(filteredAparts, t.clusterRadius), [filteredAparts, t.clusterRadius]);

  // Selected apartment count
  const selectedCount = Object.values(selections).reduce((s, sel) => s + sel.qty, 0);

  // Refs for card scrolling
  const cardRefs = useRefMV({});
  const scrollAreaRef = useRefMV(null);

  // Group lookup
  const groupAtBuilding = useMemoMV(() => {
    const m = new Map();
    groups.forEach(g => {
      if (g.kind === "cluster") g.buildings.forEach(b => m.set(b.buildingId, g));
      else m.set(g.buildingId, g);
    });
    return m;
  }, [groups]);

  // Counts of apartments per neighborhood (for filter chips)
  const nbCounts = useMemoMV(() => {
    const m = new Map();
    MV_APARTS.forEach(a => m.set(a.neighborhood, (m.get(a.neighborhood) || 0) + 1));
    return m;
  }, []);

  function openDetailFor(apartment) {
    setPickerAp(apartment);
  }

  // Adapt an apartment to the shape RoomDetailDialog expects.
  // Apartment data lacks `number` and `view`; substitute building / floor.
  function apartmentAsRoom(ap) {
    if (!ap) return null;
    return {
      ...ap,
      number: ap.building,
      view: ap.floor || ap.neighborhood,
      soldOut: false,
    };
  }

  function reserveFor(apartment) {
    // Primary CTA — skip rate-picker and open the rate configurator directly
    // with the cheapest rate, matching Table view behaviour.
    const cheapest = apartment.rates.slice().sort((a, b) => a.price - b.price)[0];
    if (!cheapest) return;
    setConfigRate({
      room: { ...apartment, image: apartment.image, number: apartment.building },
      rate: cheapest,
      apartment,
      initialRooms: 1,
    });
    setOpenedGroupId(null);
  }

  function pickRate(apartment, rate) {
    // Used by Detail → ApRatePicker. Pass the user-chosen rate through to the configurator.
    setConfigRate({
      room: { ...apartment, image: apartment.image, number: apartment.building },
      rate,
      apartment,
      initialRooms: 1,
    });
    setPickerAp(null);
    setOpenedGroupId(null);
  }

  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <PickRoomNav active="ubytovani" />

      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: "0 1px 0 var(--border-soft)",
      }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <PickRoomBreadcrumb label="Vybrat apartmán z mapy" />
          <PickRoomSearchBar />
        </div>
      </div>

      <main style={{ maxWidth: 1480, margin: "0 auto", padding: "14px 32px 140px" }}>
        <ResultsHeader
          count={filteredAparts.length}
          viewId="map"
          sortValue={sortBy}
          onSort={setSortBy}
          extra={
            <FilterButton
              activeCount={window.countActiveFilters(filters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        <MapSplit
          split={t.split}
          left={
            <ApartmentList
              apartments={filteredAparts}
              hoveredBld={hoveredBld}
              onHoverCard={(bld) => t.highlightFromCard && setHoveredBld(bld)}
              onCardClick={(ap) => {
                setOpenedGroupId(groupAtBuilding.get(ap.buildingId)?.id || null);
              }}
              onSelect={reserveFor}
              showRating={t.showRating}
              cardRefs={cardRefs}
              scrollAreaRef={scrollAreaRef}
            />
          }
          right={
            <MapPanel
              groups={groups}
              theme={t.mapTheme}
              hoveredBld={hoveredBld}
              openedGroupId={openedGroupId}
              onHoverPin={setHoveredBld}
              onClickPin={(g) => {
                setOpenedGroupId(g.id);
                // If single-building cluster opens, scroll-sync the first apartment card.
                const firstAp = g.items[0];
                if (firstAp && cardRefs.current[firstAp.id]) {
                  cardRefs.current[firstAp.id].scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
              }}
              onClosePopover={() => setOpenedGroupId(null)}
              onOpenDetail={openDetailFor}
              onSelectRate={reserveFor}
            />
          }
        />

        <PickRoomFooter />
      </main>

      <PickRoomReservationBar selections={selections} onClear={() => setSelections({})} />

      <window.RoomDetailDialog
        open={!!pickerAp}
        room={apartmentAsRoom(pickerAp)}
        onClose={() => setPickerAp(null)}
        onPickRate={(_room, rate) => pickRate(pickerAp, rate)}
      />

      <window.RateConfigDialog
        open={!!configRate}
        room={configRate?.room}
        rate={configRate?.rate}
        initialRooms={configRate?.initialRooms}
        onClose={() => setConfigRate(null)}
        onConfirm={(cfg) => {
          const ap = configRate.apartment;
          const key = `${ap.id}-${configRate.rate.id}`;
          setSelections(prev => ({
            ...prev,
            [key]: { room: configRate.room, apartment: ap, rate: configRate.rate, qty: cfg.rooms, cfg },
          }));
          setConfigRate(null);
        }}
      />

      <window.FilterDialog
        open={filterOpen}
        value={filters}
        counts={nbCounts}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mapa">
          <TweakRadio label="Téma" value={t.mapTheme} onChange={v => setTweak("mapTheme", v)}
            options={[
              { value: "light", label: "Světlé" },
              { value: "sage", label: "Šalvěj" },
              { value: "warm", label: "Teplé" },
            ]} />
          <TweakSlider label="Radius clusterů" value={t.clusterRadius} min={0} max={180} step={10}
            onChange={v => setTweak("clusterRadius", v)} unit="px" />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio label="Poměr karty / mapa" value={t.split} onChange={v => setTweak("split", v)}
            options={[
              { value: "60/40", label: "60 / 40" },
              { value: "50/50", label: "50 / 50" },
              { value: "40/60", label: "40 / 60" },
            ]} />
          <TweakToggle label="Hodnocení na kartě" value={t.showRating} onChange={v => setTweak("showRating", v)} />
          <TweakToggle label="Hover karty → pin" value={t.highlightFromCard} onChange={v => setTweak("highlightFromCard", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// — Layout shell —

function FilterButton({ activeCount, onClick }) {
  return (
    <button onClick={onClick} style={{
      appearance: "none", cursor: "pointer",
      background: activeCount > 0 ? "var(--ink-1)" : "white",
      color: activeCount > 0 ? "white" : "var(--ink-1)",
      border: `1px solid ${activeCount > 0 ? "var(--ink-1)" : "var(--border)"}`,
      fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
      padding: "7px 13px", borderRadius: 8, letterSpacing: "0.01em",
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      <Icon name="filter" size={14} strokeWidth={1.8} />
      Filtrovat
      {activeCount > 0 && (
        <span style={{
          background: "var(--brand)", color: "white",
          fontSize: 11, fontWeight: 700,
          width: 18, height: 18, borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginLeft: 2,
        }}>{activeCount}</span>
      )}
    </button>
  );
}

function MapSplit({ split, left, right }) {
  const ratio = split === "50/50" ? "1fr 1fr" : split === "40/60" ? "1fr 1.5fr" : "1.5fr 1fr";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: ratio, gap: 24,
      alignItems: "start", marginTop: 14,
    }}>
      <div style={{ minWidth: 0 }}>{left}</div>
      <div style={{
        position: "sticky", top: 168,
        height: "calc(100vh - 184px)", minHeight: 520,
      }}>{right}</div>
    </div>
  );
}

// — Filter chips row —

function NeighborhoodChips({ value, onChange, counts, priceFilter, onPriceFilter }) {
  const items = [
    { id: "all", label: "Vše", count: MV_APARTS.length },
    ...window.APARTMENT_NEIGHBORHOODS.map(n => ({ id: n, label: n, count: counts.get(n) || 0 })),
  ];
  const prices = [
    { id: "all", label: "Vše" },
    { id: "lt5", label: "< 5 000 Kč" },
    { id: "5-8", label: "5 – 8 000 Kč" },
    { id: "gt8", label: "8 000+ Kč" },
  ];
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 10, marginBottom: 6, marginTop: -6,
    }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)", marginRight: 4 }}>Lokalita</span>
        {items.map(it => {
          const on = value === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              appearance: "none", cursor: "pointer",
              background: on ? "var(--ink-1)" : "white",
              border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
              color: on ? "white" : "var(--ink-1)",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
              padding: "6px 11px", borderRadius: 999,
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              {it.label}
              <span style={{ opacity: 0.6, fontSize: 11, fontWeight: 600 }}>{it.count}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)", marginRight: 4 }}>Cena za 2 noci</span>
        {prices.map(p => {
          const on = priceFilter === p.id;
          return (
            <button key={p.id} onClick={() => onPriceFilter(p.id)} style={{
              appearance: "none", cursor: "pointer",
              background: on ? "var(--ink-1)" : "white",
              border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
              color: on ? "white" : "var(--ink-1)",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
              padding: "6px 11px", borderRadius: 999,
            }}>{p.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// — Card list panel —

function ApartmentList({ apartments, hoveredBld, onHoverCard, onCardClick, onSelect, showRating, cardRefs, scrollAreaRef }) {
  return (
    <div ref={scrollAreaRef} style={{
      display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 16, paddingTop: 8,
    }}>
      {apartments.length === 0 && (
        <div style={{
          gridColumn: "1 / -1",
          background: "white", border: "1px dashed var(--border)", borderRadius: 12,
          padding: "32px 24px", textAlign: "center", color: "var(--ink-3)",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-1)" }}>
            Žádné apartmány v této kombinaci filtrů
          </div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Zkuste rozšířit lokalitu nebo cenové rozpětí.</div>
        </div>
      )}
      {apartments.map(ap => (
        <div key={ap.id} ref={el => { if (el) cardRefs.current[ap.id] = el; }}>
          <ApartmentCard
            ap={ap}
            hovered={hoveredBld === ap.buildingId}
            onHover={onHoverCard}
            onClick={onCardClick}
            onSelect={onSelect}
            showRating={showRating}
          />
        </div>
      ))}
    </div>
  );
}

// — Map panel: illustration + pins + popover —

function MapPanel({ groups, theme, hoveredBld, openedGroupId, onHoverPin, onClickPin, onClosePopover, onOpenDetail, onSelectRate }) {
  const openedGroup = openedGroupId ? groups.find(g => g.id === openedGroupId) : null;

  return (
    <div onClick={onClosePopover} style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--border)",
      background: "white",
      boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
    }}>
      <PragueIllustration theme={theme} />

      {/* Pin layer */}
      <div style={{ position: "absolute", inset: 0 }}>
        {groups.map(g => {
          const xPct = (g.coords.x / MAP_W) * 100;
          const yPct = (g.coords.y / MAP_H) * 100;
          const buildingIds = g.kind === "cluster"
            ? g.buildings.map(b => b.buildingId)
            : [g.buildingId];
          const hovered = buildingIds.includes(hoveredBld);
          const selected = openedGroupId === g.id;

          if (g.kind === "cluster") {
            return (
              <ClusterPin
                key={g.id}
                cluster={g}
                hovered={hovered || selected}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onClick={() => onClickPin(g)}
                onMouseEnter={() => onHoverPin(buildingIds[0])}
                onMouseLeave={() => onHoverPin(null)}
              />
            );
          }
          return (
            <PricePin
              key={g.id}
              group={g}
              hovered={hovered}
              selected={selected}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              onClick={() => onClickPin(g)}
              onMouseEnter={() => onHoverPin(g.buildingId)}
              onMouseLeave={() => onHoverPin(null)}
            />
          );
        })}
      </div>

      {/* Popover */}
      {openedGroup && (
        <div style={{
          position: "absolute",
          left: `${(openedGroup.coords.x / MAP_W) * 100}%`,
          top: `${(openedGroup.coords.y / MAP_H) * 100}%`,
          zIndex: 30,
        }}>
          <PinPopover
            group={openedGroup}
            side={(openedGroup.coords.x / MAP_W) < 0.55 ? "right" : "left"}
            onClose={onClosePopover}
            onOpenDetail={onOpenDetail}
            onSelect={onSelectRate}
          />
        </div>
      )}

      {/* Map controls (zoom mock) */}
      <div style={{
        position: "absolute", right: 14, top: 14, display: "flex", flexDirection: "column", gap: 6,
      }} onClick={(e) => e.stopPropagation()}>
        <MapCtrlBtn><Icon name="plus" size={15} strokeWidth={2.4} /></MapCtrlBtn>
        <MapCtrlBtn><Icon name="minus" size={15} strokeWidth={2.4} /></MapCtrlBtn>
      </div>
      <div style={{
        position: "absolute", left: 14, top: 14,
        background: "white", borderRadius: 8, padding: "6px 10px",
        boxShadow: "0 2px 8px rgba(15,18,22,0.10)",
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--ink-2)",
      }} onClick={(e) => e.stopPropagation()}>
        <Icon name="map-pin" size={13} color="var(--brand)" strokeWidth={2} />
        {groups.length} {groups.length === 1 ? "lokalita" : groups.length < 5 ? "lokality" : "lokalit"} v Praze
      </div>

      {/* Search-as-I-move chip (bottom-center) */}
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

function MapCtrlBtn({ children }) {
  return (
    <button style={{
      appearance: "none", border: "none", cursor: "pointer",
      width: 34, height: 34, borderRadius: 8, background: "white",
      boxShadow: "0 2px 8px rgba(15,18,22,0.12)",
      display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-1)",
    }}>{children}</button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppMV />);
