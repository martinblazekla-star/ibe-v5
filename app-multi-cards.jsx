// Multi-property — Cards View (grid of hotel cards)
//
// Layout:
//   1. MpNav
//   2. MpHero (collection-level intro band)
//   3. Sticky search bar (Destinace + Termín + Hosté + Pouze pro členy toggle)
//   4. MpResultsHeader (count + FilterButton + ViewSwitcher + Sort)
//   5. Grid of HotelCards (3-col responsive)
//   6. MpFooter
//
// Card click "Detail" → opens HotelDetailDialog
// Card click "Rezervovat"/footer Rezervovat → navigates to Pick-Room-Table-View.html?hotel={id}

const { useState: useStateMpC } = React;

const TWEAK_DEFAULTS_MPC = /*EDITMODE-BEGIN*/{
  "showHero": true,
  "density": "comfortable",
  "columns": 3,
  "showBadges": true,
  "showRoomsLeft": true,
  "stickySearch": true
}/*EDITMODE-END*/;

function AppMpCards() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_MPC);
  const [filters, setFilters] = useStateMpC(window.MP_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useStateMpC(false);
  const [sortBy, setSortBy] = useStateMpC("recommended");
  const [destination, setDestination] = useStateMpC("all");
  const [memberOnly, setMemberOnly] = useStateMpC(false);
  const [detailHotel, setDetailHotel] = useStateMpC(null);

  // Combined filters (destination from search bar + filter dialog filters)
  const effectiveFilters = React.useMemo(() => {
    const f = { ...filters };
    if (destination !== "all") f.cities = [destination, ...(f.cities || []).filter(c => c !== destination)];
    return f;
  }, [filters, destination]);

  const sortedHotels = React.useMemo(() => {
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

  function reserve(hotel) {
    // Open the hotel's single-property IBE with a pre-filled hotel id.
    window.location.href = `Pick-Room-Table-View.html?hotel=${hotel.id}`;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <window.MpNav active="hotely" />

      {t.showHero && (
        <window.MpHero
          totalHotels={window.MP_HOTELS.length}
          cities={window.MP_CITIES.length}
          shown={sortedHotels.length}
        />
      )}

      {/* Sticky search bar */}
      <div style={{
        position: t.stickySearch ? "sticky" : "relative", top: 0, zIndex: 60,
        background: "var(--surface)", padding: "18px 36px 14px",
        boxShadow: t.stickySearch ? "0 2px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <window.MpSearchBar
            destination={destination}
            onDestination={setDestination}
            memberOnly={memberOnly}
            onMemberOnly={setMemberOnly}
          />
        </div>
      </div>

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: "20px 36px 60px" }}>
        <window.MpResultsHeader
          count={sortedHotels.length}
          viewId="cards"
          sortValue={sortBy}
          onSort={setSortBy}
          extra={
            <window.MpFiltersButton
              activeCount={window.countActiveMpFilters(effectiveFilters)}
              onClick={() => setFilterOpen(true)}
            />
          }
        />

        {sortedHotels.length === 0 ? (
          <EmptyState onReset={() => { setFilters(window.MP_FILTER_DEFAULTS); setDestination("all"); }} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${t.columns}, minmax(0, 1fr))`,
            gap: t.density === "compact" ? 16 : 22,
          }}>
            {sortedHotels.map(h => (
              <HotelCard
                key={h.id}
                hotel={h}
                memberMode={memberOnly}
                density={t.density}
                showBadges={t.showBadges}
                showRoomsLeft={t.showRoomsLeft}
                onOpenDetail={() => setDetailHotel(h)}
                onReserve={() => reserve(h)}
              />
            ))}
          </div>
        )}

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
          <TweakToggle label="Badge (Bestseller, −%)" value={t.showBadges} onChange={v => setTweak("showBadges", v)} />
          <TweakToggle label="Zbývající pokoje" value={t.showRoomsLeft} onChange={v => setTweak("showRoomsLeft", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Hotel card
// ───────────────────────────────────────────────────────────────────────────

function HotelCard({ hotel, memberMode, density, showBadges, showRoomsLeft, onOpenDetail, onReserve }) {
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
        backgroundImage: `url(${hotel.image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        background: hotel.image ? `url(${hotel.image}) center/cover` : "var(--neutral-100)",
      }}>
        {/* Top-left chips */}
        <div style={{ position: "absolute", left: 12, top: 12, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <window.MpHotelTypeBadge type={hotel.type} stars={hotel.stars} />
        </div>

        {/* Top-right badge */}
        {showBadges && (
          <div style={{ position: "absolute", right: 12, top: 12, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
            <window.MpHotelBadges badges={hotel.badges?.slice(0, 1) || []} discountPct={hotel.discountPct} />
          </div>
        )}

        {/* Bottom-left: image count */}
        <div style={{
          position: "absolute", left: 12, bottom: 12,
          background: "rgba(15,18,22,0.62)", color: "white",
          padding: "3px 8px", borderRadius: 4,
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 11,
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={11} strokeWidth={1.8} />
          {1 + (hotel.secondaryImages?.length || 0)}
        </div>

        {/* Bottom-right: rooms left */}
        {showRoomsLeft && hotel.roomsAvailable <= 3 && (
          <div style={{
            position: "absolute", right: 12, bottom: 12,
            background: "white", color: "#A6151D",
            padding: "4px 9px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
            display: "inline-flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 6px rgba(15,18,22,0.12)",
            letterSpacing: "0.02em", textTransform: "uppercase",
          }}>
            <Icon name="flame" size={11} strokeWidth={2.4} color="#A6151D" />
            Poslední {hotel.roomsAvailable}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", gap: compact ? 8 : 10,
        padding: compact ? "13px 15px 14px" : "16px 18px 18px",
      }}>
        {/* Location label */}
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--brand)",
        }}>{hotel.city} · {hotel.cityArea}</div>

        {/* Name */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: compact ? 17 : 18, color: "var(--ink-1)",
          margin: 0, lineHeight: 1.22, letterSpacing: "-0.005em", textWrap: "balance",
        }}>{hotel.name}</h3>

        {/* Rating */}
        <window.MpRatingBlock rating={hotel.rating} reviews={hotel.reviews} />

        {/* Amenities */}
        <window.MpAmenityRow amenities={hotel.amenities} limit={compact ? 3 : 4} />

        {/* Footer row: price + actions */}
        <div style={{
          marginTop: "auto", paddingTop: compact ? 10 : 12,
          borderTop: "1px solid var(--border-soft)",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end",
        }}>
          <window.MpPriceBlock hotel={hotel} memberMode={memberMode} align="left" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={onOpenDetail} style={{
              appearance: "none", border: "1px solid var(--border)", background: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              color: "var(--ink-1)", padding: "8px 14px", borderRadius: 7, cursor: "pointer",
              whiteSpace: "nowrap",
            }}>Detail</button>
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

function EmptyState({ onReset }) {
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
        Žádné hotely této kombinaci filtrů
      </div>
      <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
        Zkuste rozšířit destinaci, cenové rozpětí nebo zmírnit filtry vybavení.
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

ReactDOM.createRoot(document.getElementById("root")).render(<AppMpCards />);
