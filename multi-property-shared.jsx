// Multi-property mode — shared chrome (Balický Collection)
//   • MpNav            — collection-level navigation (different from PickRoomNav)
//   • MpSearchBar      — Destinace + Termín + Hosté + Pouze pro členy toggle
//   • MpHero           — collection hero band (welcome / value props)
//   • MpResultsHeader  — count + filter button + view switcher + sort
//   • MpViewSwitcher   — Cards ↔ Mapa
//   • MpFiltersButton  — opens MpFiltersDialog
//   • MpFiltersDialog  — full filter modal
//   • MpStarRow        — small reusable star icon row
//   • MpRatingBlock    — score badge + word + reviews count
//   • MpPriceBlock     — fromPrice + (optional) original + member chip
//   • MpAmenityRow     — amenity icon chips
//   • MpHotelTypeBadge — type chip (City / Wellness / Boutique / Resort)
//   • MpFooter         — chain-level footer

(function () {
  const { useState: useStateMp } = React;

  // ───────────────────────────────────────────────────────────────────────────
  //  Nav
  // ───────────────────────────────────────────────────────────────────────────

  function MpNav({ active = "hotely" }) {
    const items = [
      { id: "hotely",      label: "Hotely",        href: "Multi-Property-Cards.html" },
      { id: "destinace",   label: "Destinace",     href: "#" },
      { id: "clenstvi",    label: "Členský klub",  href: "#" },
      { id: "darkovy",     label: "Dárkové vouchery", href: "Voucher-Sale.html" },
      { id: "o-nas",       label: "O kolekci",     href: "#" },
    ];
    const [openMenu, setOpenMenu] = useStateMp(null);
    const [lcValue, setLcValue]   = useStateMp({ lang: "cs", currency: "CZK" });
    const [, force] = React.useReducer((x) => x + 1, 0);
    React.useEffect(() => {
      const onChange = () => force();
      window.addEventListener("loyalty-change", onChange);
      return () => window.removeEventListener("loyalty-change", onChange);
    }, []);
    const user = window.__loyaltyUser;

    return (
      <nav style={{
        height: 64, background: "white", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", padding: "0 36px", gap: 28,
      }}>
        <a href="Multi-Property-Cards.html" style={{
          textDecoration: "none", display: "flex", alignItems: "center", gap: 11,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: 8,
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15,
            letterSpacing: "-0.02em",
          }}>B</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15,
              color: "var(--ink-1)", letterSpacing: "0.02em", textTransform: "uppercase",
            }}>Balický</span>
            <span style={{
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 11,
              color: "var(--ink-3)", letterSpacing: "0.18em", textTransform: "uppercase",
            }}>Collection</span>
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 24 }}>
          {items.map(it => (
            <a key={it.id} href={it.href}
               onClick={e => { if (it.href === "#") e.preventDefault(); }}
               style={{
                 fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
                 color: active === it.id ? "var(--ink-1)" : "var(--ink-3)",
                 textDecoration: "none", padding: "8px 12px", borderRadius: 6, position: "relative",
               }}>
              {it.label}
              {active === it.id && <span style={{
                position: "absolute", left: 12, right: 12, bottom: -21, height: 2, background: "var(--brand)",
              }} />}
            </a>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setOpenMenu(openMenu === "lc" ? null : "lc")} style={{
              appearance: "none", cursor: "pointer",
              background: openMenu === "lc" ? "var(--neutral-100)" : "white",
              border: "1px solid var(--border)", borderRadius: 6,
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
              padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span>{(window.LANGUAGES?.find(l => l.id === lcValue.lang) || { flag: "🇨🇿" }).flag}</span>
              <span style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>{lcValue.lang} · {lcValue.currency}</span>
              <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
            </button>
            {openMenu === "lc" && window.LangCurrencyPicker && (
              <window.Dropdown open onClose={() => setOpenMenu(null)} width={500} align="right">
                <window.LangCurrencyPicker value={lcValue} onChange={(v) => setLcValue(v)} onClose={() => setOpenMenu(null)} />
              </window.Dropdown>
            )}
          </div>

          <div style={{ position: "relative" }}>
            {user ? (
              <button onClick={() => setOpenMenu(openMenu === "user" ? null : "user")} style={{
                appearance: "none", cursor: "pointer",
                background: openMenu === "user" ? "var(--neutral-100)" : "white",
                border: "1px solid var(--border)", borderRadius: 999,
                padding: "4px 12px 4px 4px", display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--brand)", color: "white",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                }}>{user.initials}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)" }}>
                  {user.name.split(" ")[0]}
                </span>
                <span style={{
                  fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
                  background: "var(--accent-tint)", color: "var(--accent-dark)",
                  padding: "2px 6px", borderRadius: 4,
                }}>−{user.discount} %</span>
                <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
              </button>
            ) : (
              <button onClick={() => setOpenMenu(openMenu === "user" ? null : "user")} style={{
                appearance: "none", border: "1px solid var(--border)",
                background: openMenu === "user" ? "var(--neutral-100)" : "white",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
                padding: "7px 12px", borderRadius: 6, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="users" size={14} strokeWidth={1.8} color="var(--ink-2)" />
                Přihlásit
              </button>
            )}
            {openMenu === "user" && window.Dropdown && (
              <window.Dropdown open onClose={() => setOpenMenu(null)} width={420} align="right">
                {user
                  ? <window.LoyaltyMemberZone user={user} onClose={() => setOpenMenu(null)} />
                  : <window.LoginDropdown onClose={() => setOpenMenu(null)} />}
              </window.Dropdown>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Hero band
  // ───────────────────────────────────────────────────────────────────────────

  function MpHero({ totalHotels, cities, shown }) {
    return (
      <div style={{
        background: "color-mix(in oklch, var(--brand) 6%, white)",
        borderBottom: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
      }}>
        <div style={{
          maxWidth: 1380, margin: "0 auto", padding: "28px 36px 26px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30, flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--brand)", marginBottom: 6,
            }}>Balický Collection · Česko</div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30,
              color: "var(--ink-1)", margin: 0, letterSpacing: "-0.012em", lineHeight: 1.15,
            }}>
              {totalHotels} hotelů v {cities} {window.cz(cities, "destinaci", "destinacích", "destinacích")}.<br />
              Nejlepší cena přímo u nás.
            </h1>
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-2)",
              margin: "10px 0 0", maxWidth: 640, lineHeight: 1.55,
            }}>
              Vyberte termín a najděte nejlevnější hotel napříč naší kolekcí — od historických boutique
              objektů přes lázně až po horské resorty. Členové klubu šetří dalších 10 %.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { lbl: "Garance nejlepší ceny", sub: "při rezervaci přímo u nás" },
              { lbl: "Členský klub zdarma",   sub: "−10 % na všechny rezervace" },
              { lbl: "Jeden účet pro vše",    sub: "rezervace, body, profil" },
            ].map((b, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 10, border: "1px solid var(--border-soft)",
                padding: "11px 16px", width: 210, whiteSpace: "nowrap",
              }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.2,
                }}>{b.lbl}</div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.3,
                }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Search bar — Destinace + Termín + Hosté + Pouze pro členy toggle
  // ───────────────────────────────────────────────────────────────────────────

  function MpSearchBar({ destination, onDestination, memberOnly, onMemberOnly }) {
    const [openDropdown, setOpenDropdown] = useStateMp(null);

    const [dateRange, setDateRange] = useStateMp({
      start: new Date(2026, 4, 15),
      end:   new Date(2026, 4, 17),
    });
    const [guestsCfg, setGuestsCfg] = useStateMp({
      rooms: [{ id: 1, adults: 2, teens: 0, kids: 0, infants: 0 }],
    });

    const nights = window.diffDaysSearch ? window.diffDaysSearch(dateRange.start, dateRange.end) : 2;
    const totalGuests = guestsCfg.rooms.reduce((s, r) => s + r.adults + r.teens + r.kids + r.infants, 0);
    const roomCount = guestsCfg.rooms.length;

    const dateLabel = `${window.fmtShort?.(dateRange.start) || "Pá 15. 5."} – ${window.fmtShort?.(dateRange.end) || "Ne 17. 5."} · ${nights} ${window.cz(nights, "noc", "noci", "nocí")}`;
    const guestsLabel = `${totalGuests} ${window.cz(totalGuests, "host", "hosté", "hostů")} · ${roomCount} ${window.cz(roomCount, "pokoj", "pokoje", "pokojů")}`;
    const destLabel = destination === "all"
      ? "Celá ČR"
      : destination;

    const Field = ({ id, icon, label, value, active, valueColor }) => (
      <button onClick={() => setOpenDropdown(openDropdown === id ? null : id)} style={{
        appearance: "none", textAlign: "left",
        background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
        border: "none", cursor: "pointer",
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
        borderRight: "1px solid var(--border)",
        borderBottom: active ? "2px solid var(--brand)" : "2px solid transparent",
        marginBottom: active ? -2 : 0,
      }}>
        <Icon name={icon} size={18} color="var(--brand)" strokeWidth={1.8} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--ink-3)",
          }}>{label}</div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
            color: valueColor || "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{value}</div>
        </div>
      </button>
    );

    return (
      <div style={{ position: "relative" }}>
        <div style={{
          background: "white", borderRadius: 12, border: "1px solid var(--border)",
          boxShadow: "0 4px 14px rgba(16,24,40,.06)",
          display: "grid", gridTemplateColumns: "1.3fr 1.4fr 1fr auto auto", alignItems: "stretch", overflow: "hidden",
        }}>
          <Field id="destination" icon="map-pin" label="Destinace" value={destLabel} active={openDropdown === "destination"} />
          <Field id="date"        icon="calendar" label="Termín"    value={dateLabel} active={openDropdown === "date"} />
          <Field id="guests"      icon="users"   label="Hosté"     value={guestsLabel} active={openDropdown === "guests"} />

          {/* Members-only toggle field */}
          <button onClick={() => onMemberOnly(!memberOnly)} style={{
            appearance: "none", border: "none", cursor: "pointer", textAlign: "left",
            background: memberOnly ? "color-mix(in oklch, var(--brand) 8%, white)" : "white",
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
            borderRight: "1px solid var(--border)",
          }}>
            <span style={{
              width: 32, height: 18, borderRadius: 999, position: "relative",
              background: memberOnly ? "var(--brand)" : "var(--border)",
              transition: "background 0.15s",
            }}>
              <span style={{
                position: "absolute", top: 2, left: memberOnly ? 16 : 2,
                width: 14, height: 14, borderRadius: "50%", background: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,.2)", transition: "left 0.15s",
              }} />
            </span>
            <div>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--ink-3)",
              }}>Pouze pro členy</div>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600,
                color: memberOnly ? "var(--brand)" : "var(--ink-3)",
                marginTop: 1, whiteSpace: "nowrap",
              }}>{memberOnly ? "Cena s −10 %" : "Veřejná cena"}</div>
            </div>
          </button>

          <button style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "0 26px", letterSpacing: "0.02em",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon name="search" size={16} strokeWidth={2.4} />
            Hledat
          </button>
        </div>

        {/* Destination dropdown — simple chip list with city counts */}
        {openDropdown === "destination" && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={460} align="left">
            <DestinationPicker
              value={destination}
              onChange={(v) => { onDestination(v); setOpenDropdown(null); }}
            />
          </window.Dropdown>
        )}
        {openDropdown === "date" && window.DateRangePicker && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={1100} align="left">
            <window.DateRangePicker value={dateRange} onChange={(v) => setDateRange(v)} onClose={() => setOpenDropdown(null)} />
          </window.Dropdown>
        )}
        {openDropdown === "guests" && window.GuestsPicker && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={480} align="left">
            <window.GuestsPicker value={guestsCfg} onChange={(v) => setGuestsCfg(v)} onClose={() => setOpenDropdown(null)} />
          </window.Dropdown>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Destination picker — list of cities with counts
  // ───────────────────────────────────────────────────────────────────────────

  function DestinationPicker({ value, onChange }) {
    const counts = React.useMemo(() => {
      const m = new Map();
      window.MP_HOTELS.forEach(h => m.set(h.city, (m.get(h.city) || 0) + 1));
      return m;
    }, []);
    const cities = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    return (
      <div style={{ padding: "18px 20px 14px", background: "white" }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          marginBottom: 12,
        }}>Vyberte destinaci</div>
        <button onClick={() => onChange("all")} style={{
          appearance: "none", cursor: "pointer", width: "100%", textAlign: "left",
          background: value === "all" ? "color-mix(in oklch, var(--brand) 8%, white)" : "white",
          border: `1px solid ${value === "all" ? "var(--brand)" : "var(--border)"}`,
          borderRadius: 8, padding: "11px 14px", marginBottom: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "var(--font-ui)",
        }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>Celá ČR</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600 }}>
            {window.MP_HOTELS.length} hotelů
          </span>
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {cities.map(([city, count]) => {
            const on = value === city;
            return (
              <button key={city} onClick={() => onChange(city)} style={{
                appearance: "none", cursor: "pointer", textAlign: "left",
                background: on ? "var(--ink-1)" : "white",
                color: on ? "white" : "var(--ink-1)",
                border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
                borderRadius: 8, padding: "9px 12px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              }}>
                <span>{city}</span>
                <span style={{ opacity: on ? 0.8 : 0.55, fontWeight: 600, fontSize: 11.5 }}>
                  {count} {window.cz(count, "hotel", "hotely", "hotelů")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Dropdown helper (lifted from existing pattern — used by search bar fields)
  // ───────────────────────────────────────────────────────────────────────────

  function Dropdown({ open, onClose, children, width, align = "left", anchorStyle = null }) {
    if (!open) return null;
    // anchorStyle (explicit left/right px) pins the panel under the field that
    // opened it; falls back to the coarse align keyword when not provided.
    const posStyle = anchorStyle || { [align]: 0 };
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
        <div style={{
          position: "absolute", zIndex: 100,
          top: "calc(100% + 8px)",
          ...posStyle, width,
          background: "white", borderRadius: 12, border: "1px solid var(--border)",
          boxShadow: "0 16px 40px rgba(16,24,40,.18)", overflow: "hidden",
        }}>{children}</div>
      </>
    );
  }

  window.Dropdown = window.Dropdown || Dropdown;

  // ───────────────────────────────────────────────────────────────────────────
  //  Star row
  // ───────────────────────────────────────────────────────────────────────────

  function MpStarRow({ count, size = 11 }) {
    return (
      <span style={{ display: "inline-flex", gap: 2, color: "#E0A50F" }}>
        {Array.from({ length: count }).map((_, i) => (
          <Icon key={i} name="star" size={size} color="#E0A50F" strokeWidth={0} />
        ))}
      </span>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Rating block (score chip + word + reviews)
  // ───────────────────────────────────────────────────────────────────────────

  function ratingWord(s) {
    if (s >= 9.5) return "Výjimečné";
    if (s >= 9.0) return "Vynikající";
    if (s >= 8.5) return "Velmi dobré";
    if (s >= 8.0) return "Dobré";
    return "Slušné";
  }

  function MpRatingBlock({ rating, reviews, size = "md" }) {
    const big = size === "lg";
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--brand)", color: "white", borderRadius: 6,
          padding: big ? "5px 9px" : "3px 7px",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: big ? 16 : 13, letterSpacing: "-0.005em",
        }}>{rating.toFixed(1)}</span>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{
            fontFamily: "var(--font-ui)", fontWeight: 700,
            fontSize: big ? 14 : 12.5, color: "var(--ink-1)",
          }}>{ratingWord(rating)}</span>
          <span style={{
            fontFamily: "var(--font-ui)", fontWeight: 500,
            fontSize: big ? 12 : 11, color: "var(--ink-3)", marginTop: 1,
          }}>{window.fmtMp(reviews)} hodnocení</span>
        </span>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Price block — fromPrice + (optional) original + member chip
  // ───────────────────────────────────────────────────────────────────────────

  function MpPriceBlock({ hotel, memberMode, size = "md", align = "right" }) {
    const big = size === "lg";
    const price = memberMode && hotel.memberPrice ? hotel.memberPrice : hotel.fromPrice;
    const showOriginal = !memberMode && hotel.originalPrice && hotel.originalPrice > price;
    const showMemberHint = !memberMode && hotel.memberPrice && hotel.memberPrice < hotel.fromPrice;

    return (
      <div style={{ textAlign: align, lineHeight: 1.1 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)" }}>
          {memberMode ? "Členská cena od" : "Cena od"}
        </div>
        {showOriginal && (
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)",
            textDecoration: "line-through", marginTop: 4,
          }}>{window.fmtMp(hotel.originalPrice)} Kč</div>
        )}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: big ? 26 : 22, color: memberMode ? "var(--brand)" : "var(--ink-1)",
          marginTop: 2, letterSpacing: "-0.01em",
        }}>
          {window.fmtMp(price)} <span style={{ fontSize: big ? 14 : 13, fontWeight: 600 }}>Kč</span>
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)", marginTop: 2,
        }}>za 2 noci · vč. daní</div>
        {showMemberHint && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10.5,
            color: "var(--brand)", marginTop: 6,
            background: "color-mix(in oklch, var(--brand) 8%, white)",
            padding: "3px 7px", borderRadius: 4, letterSpacing: "0.02em",
          }}>
            <Icon name="sparkle" size={10} strokeWidth={2.2} color="var(--brand)" />
            Pro členy {window.fmtMp(hotel.memberPrice)} Kč
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Type badge (City / Wellness / Boutique / Resort)
  // ───────────────────────────────────────────────────────────────────────────

  function MpHotelTypeBadge({ type, stars }) {
    const t = window.MP_HOTEL_TYPES.find(x => x.id === type);
    if (!t) return null;
    const colors = {
      city:     { bg: "#EEF0F4", fg: "#384058" },
      wellness: { bg: "#E8F4EE", fg: "#1B6B45" },
      boutique: { bg: "#F5EBF8", fg: "#5A1576" },
      resort:   { bg: "#FBEFE3", fg: "#7A4514" },
    }[type] || { bg: "var(--neutral-100)", fg: "var(--ink-2)" };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: colors.bg, color: colors.fg,
        padding: "3px 9px", borderRadius: 999,
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5,
        letterSpacing: "0.02em", whiteSpace: "nowrap",
      }}>
        <Icon name={window.MP_TYPE_ICON[type]} size={11} strokeWidth={2.0} color={colors.fg} />
        {t.label}
        {stars && (
          <span style={{ display: "inline-flex", gap: 1, marginLeft: 2 }}>
            {Array.from({ length: stars }).map((_, i) =>
              <Icon key={i} name="star" size={9} color={colors.fg} strokeWidth={0} />
            )}
          </span>
        )}
      </span>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Amenity row (icon chips)
  // ───────────────────────────────────────────────────────────────────────────

  function MpAmenityRow({ amenities, limit = 5, size = 12 }) {
    const items = (amenities || []).slice(0, limit).map(a => window.MP_AMENITY_LIST.find(x => x.id === a)).filter(Boolean);
    const remaining = (amenities || []).length - items.length;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", color: "var(--ink-3)", fontSize: 12 }}>
        {items.map(it => (
          <span key={it.id} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name={it.icon} size={size} strokeWidth={1.8} color="var(--ink-3)" />
            {it.label}
          </span>
        ))}
        {remaining > 0 && (
          <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>+ {remaining}</span>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Hotel badge row (Bestseller / Členská cena / atd.)
  // ───────────────────────────────────────────────────────────────────────────

  function MpHotelBadges({ badges, discountPct }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {discountPct > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "var(--accent-tint)", color: "var(--accent-dark)",
            padding: "3px 8px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            <Icon name="flame" size={11} color="var(--accent-dark)" strokeWidth={2.4} />
            −{discountPct} %
          </span>
        )}
        {(badges || []).map(b => (
          <span key={b} style={{
            background: "var(--ink-1)", color: "white",
            padding: "3px 8px", borderRadius: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>{b}</span>
        ))}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Results header & view switcher
  // ───────────────────────────────────────────────────────────────────────────

  function MpViewSwitcher({ current }) {
    const views = [
      { id: "cards", label: "Karty", icon: "grid",    href: "Multi-Property-Cards.html" },
      { id: "map",   label: "Mapa",  icon: "map-pin", href: "Multi-Property-Map.html" },
    ];
    return (
      <div style={{
        display: "inline-flex", border: "1px solid var(--border)", borderRadius: 8, background: "white",
        padding: 3, gap: 2,
      }}>
        {views.map(v => {
          const on = current === v.id;
          return (
            <a key={v.id} href={v.href} style={{
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
              padding: "6px 12px", borderRadius: 6, textDecoration: "none",
              background: on ? "var(--neutral-100)" : "transparent",
              color: on ? "var(--ink-1)" : "var(--ink-3)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <Icon name={v.icon} size={14} strokeWidth={1.8} />
              {v.label}
            </a>
          );
        })}
      </div>
    );
  }

  function MpResultsHeader({ count, viewId, sortValue, onSort, extra }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)", gap: 16, flexWrap: "wrap",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.008em",
          }}>{count} {window.cz(count, "hotel", "hotely", "hotelů")} v Balický Collection</h2>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
            Vyberte hotel a otevře se rezervace pro daný objekt s pre-vyplněným termínem.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {extra}
          <MpViewSwitcher current={viewId} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Seřadit:</span>
            <select value={sortValue} onChange={(e) => onSort(e.target.value)} style={{
              appearance: "none", border: "1px solid var(--border)", borderRadius: 6, background: "white",
              padding: "7px 28px 7px 12px", fontSize: 13, fontWeight: 600, color: "var(--ink-1)", cursor: "pointer",
              backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
              backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
              backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
            }}>
              <option value="recommended">Doporučené</option>
              <option value="price-asc">Cena (od nejnižší)</option>
              <option value="price-desc">Cena (od nejvyšší)</option>
              <option value="rating">Hodnocení</option>
              <option value="stars">Hvězdičky</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  function MpFiltersButton({ activeCount, onClick, label = "Filtrovat" }) {
    return (
      <button onClick={onClick} style={{
        appearance: "none", cursor: "pointer",
        background: activeCount > 0 ? "var(--ink-1)" : "white",
        color: activeCount > 0 ? "white" : "var(--ink-1)",
        border: `1px solid ${activeCount > 0 ? "var(--ink-1)" : "var(--border)"}`,
        borderRadius: 6, padding: "7px 12px",
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <Icon name="filter" size={14} strokeWidth={1.8} />
        {label}
        {activeCount > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999,
            background: "white", color: "var(--ink-1)",
            fontSize: 11, fontWeight: 700,
          }}>{activeCount}</span>
        )}
      </button>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Filters dialog
  // ───────────────────────────────────────────────────────────────────────────

  function MpFiltersDialog({ open, value, onClose, onApply, onReset }) {
    const [draft, setDraft] = useStateMp(value || window.MP_FILTER_DEFAULTS);
    React.useEffect(() => { if (open) setDraft(value || window.MP_FILTER_DEFAULTS); }, [open]);

    const cityCounts = React.useMemo(() => {
      const m = new Map();
      window.MP_HOTELS.forEach(h => m.set(h.city, (m.get(h.city) || 0) + 1));
      return m;
    }, []);

    if (!open) return null;

    function toggleArr(key, val) {
      setDraft(d => {
        const cur = d[key] || [];
        return { ...d, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
      });
    }
    function setKey(key, val) { setDraft(d => ({ ...d, [key]: val })); }

    const active = window.countActiveMpFilters(draft);
    const cities = window.MP_CITIES;

    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "white", borderRadius: 14, width: "100%", maxWidth: 720,
          boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
          display: "flex", flexDirection: "column", maxHeight: "92vh",
        }}>
          <header style={{
            padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Balický Collection</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", marginTop: 2 }}>Filtry</div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </header>

          <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Cities */}
            <FilterSection title="Destinace">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cities.map(city => {
                  const on = (draft.cities || []).includes(city);
                  return (
                    <FilterChip key={city} on={on} onClick={() => toggleArr("cities", city)}
                      label={city} count={cityCounts.get(city)} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Type */}
            <FilterSection title="Typ hotelu">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {window.MP_HOTEL_TYPES.map(t => {
                  const on = (draft.types || []).includes(t.id);
                  const count = window.MP_HOTELS.filter(h => h.type === t.id).length;
                  return (
                    <FilterChip key={t.id} on={on} onClick={() => toggleArr("types", t.id)} label={t.label} count={count} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Stars */}
            <FilterSection title="Hvězdičky">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[3, 4, 5].map(s => {
                  const on = (draft.stars || []).includes(s);
                  const count = window.MP_HOTELS.filter(h => h.stars === s).length;
                  return (
                    <FilterChip key={s} on={on} onClick={() => toggleArr("stars", s)}
                      label={<><MpStarRow count={s} size={11} /></>}
                      count={count}
                    />
                  );
                })}
              </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimální hodnocení">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[{v: 0, l: "Vše"}, {v: 8, l: "8.0+ Dobré"}, {v: 8.5, l: "8.5+"}, {v: 9, l: "9.0+ Vynikající"}, {v: 9.5, l: "9.5+ Výjimečné"}].map(opt => {
                  const on = draft.minRating === opt.v;
                  return (
                    <button key={opt.v} onClick={() => setKey("minRating", opt.v)} style={{
                      appearance: "none", cursor: "pointer",
                      background: on ? "var(--ink-1)" : "white",
                      color: on ? "white" : "var(--ink-1)",
                      border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
                      borderRadius: 999, padding: "7px 12px", whiteSpace: "nowrap",
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
                    }}>{opt.l}</button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Amenities */}
            <FilterSection title="Vybavení">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {window.MP_AMENITY_LIST.map(a => {
                  const on = (draft.amenities || []).includes(a.id);
                  const count = window.MP_HOTELS.filter(h => h.amenities.includes(a.id)).length;
                  return (
                    <FilterChip key={a.id} on={on} onClick={() => toggleArr("amenities", a.id)}
                      label={<><Icon name={a.icon} size={11} strokeWidth={1.8} color={on ? "white" : "var(--ink-2)"} /> {a.label}</>}
                      count={count}
                    />
                  );
                })}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection title="Cena za 2 noci">
              <PriceSlider value={draft.priceRange} onChange={(r) => setKey("priceRange", r)} />
            </FilterSection>
          </div>

          <footer style={{
            padding: "14px 24px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <button onClick={() => { setDraft(window.MP_FILTER_DEFAULTS); onReset && onReset(); }} style={{
              appearance: "none", border: "none", background: "transparent", cursor: "pointer",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
              padding: "8px 4px", textDecoration: "underline",
            }}>Vymazat filtry</button>
            <button onClick={() => onApply(draft)} style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              padding: "11px 22px", borderRadius: 6, letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              Zobrazit hotely
              {active > 0 && <span style={{ opacity: 0.75, fontWeight: 600 }}>({active})</span>}
            </button>
          </footer>
        </div>
      </div>
    );
  }

  function FilterSection({ title, children }) {
    return (
      <div>
        <div style={{
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
        }}>{title}</div>
        {children}
      </div>
    );
  }

  function FilterChip({ on, onClick, label, count }) {
    return (
      <button onClick={onClick} style={{
        appearance: "none", cursor: "pointer",
        background: on ? "var(--ink-1)" : "white",
        color: on ? "white" : "var(--ink-1)",
        border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
        borderRadius: 999, padding: "7px 12px",
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
        whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        {on && <Icon name="check" size={11} strokeWidth={2.6} />}
        {label}
        {count !== undefined && (
          <span style={{ opacity: 0.55, fontWeight: 600, fontSize: 11 }}>{count}</span>
        )}
      </button>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Price slider (dual handle)
  // ───────────────────────────────────────────────────────────────────────────

  function PriceSlider({ value, onChange }) {
    const { min: lo, max: hi } = window.MP_PRICE_BOUNDS;
    const cur = value || [lo, hi];
    const [a, b] = cur;

    function set(idx, v) {
      const c = [...cur];
      c[idx] = v;
      if (c[0] > c[1]) c[idx] = c[1 - idx];
      onChange(c[0] === lo && c[1] === hi ? null : c);
    }
    const presets = [
      { l: "Vše", r: null },
      { l: "do 3 000",  r: [lo, 3000] },
      { l: "3 – 5 000", r: [3000, 5000] },
      { l: "5 – 7 000", r: [5000, 7000] },
      { l: "7 000+",    r: [7000, hi] },
    ];
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {presets.map((p, i) => {
            const on = !value && !p.r || (value && p.r && value[0] === p.r[0] && value[1] === p.r[1]);
            return (
              <button key={i} onClick={() => onChange(p.r)} style={{
                appearance: "none", cursor: "pointer",
                background: on ? "var(--ink-1)" : "white",
                color: on ? "white" : "var(--ink-1)",
                border: `1px solid ${on ? "var(--ink-1)" : "var(--border)"}`,
                borderRadius: 999, padding: "6px 12px",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
              }}>{p.l}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <NumberBox label="Od" value={a} min={lo} max={hi} onChange={v => set(0, v)} />
          <span style={{ color: "var(--ink-3)", fontSize: 13 }}>—</span>
          <NumberBox label="Do" value={b} min={lo} max={hi} onChange={v => set(1, v)} />
          <span style={{ color: "var(--ink-3)", fontSize: 12.5, marginLeft: "auto" }}>v Kč</span>
        </div>
      </div>
    );
  }

  function NumberBox({ label, value, min, max, onChange }) {
    return (
      <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "var(--ink-3)",
        }}>{label}</span>
        <input type="number" value={value} min={min} max={max}
               onChange={e => onChange(Math.max(min, Math.min(max, parseInt(e.target.value, 10) || 0)))}
          style={{
            border: "1px solid var(--border)", borderRadius: 6,
            padding: "8px 10px", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
            color: "var(--ink-1)", outline: "none",
          }} />
      </label>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Footer
  // ───────────────────────────────────────────────────────────────────────────

  function MpFooter() {
    return (
      <div style={{
        marginTop: 56, padding: "24px 0", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)", flexWrap: "wrap", gap: 12,
      }}>
        <div>Powered by IBE v4 · © Balický Collection · 10 hotelů po ČR</div>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Storno podmínky</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Obchodní podmínky</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Ochrana osobních údajů</a>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  Export to window
  // ───────────────────────────────────────────────────────────────────────────

  Object.assign(window, {
    MpNav,
    MpHero,
    MpSearchBar,
    MpResultsHeader,
    MpViewSwitcher,
    MpFiltersButton,
    MpFiltersDialog,
    MpStarRow,
    MpRatingBlock,
    MpPriceBlock,
    MpHotelTypeBadge,
    MpAmenityRow,
    MpHotelBadges,
    MpFooter,
    mpRatingWord: ratingWord,
  });
})();
