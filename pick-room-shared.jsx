// Shared chrome for all Pick Room views (list / table / grid)

function PickRoomNav({ active = "ubytovani" }) {
  const items = [
    { id: "ubytovani", label: "Ubytování", href: "Pick-Room-Table-View.html" },
    { id: "balicky", label: "Balíčky", href: "Pick-Package.html" },
    { id: "wellness", label: "Wellness", href: "Wellness-Booking.html" },
    { id: "vouchery", label: "Vouchery", href: "Voucher-Sale.html" },
    { id: "hodnoceni", label: "Hodnocení", href: "Reviews.html" },
    { id: "mapa", label: "Mapa", href: "Concierge.html" },
  ];

  const [openMenu, setOpenMenu] = React.useState(null);
  const [lcValue, setLcValue] = React.useState({ lang: "cs", currency: "CZK" });
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener("loyalty-change", onChange);
    return () => window.removeEventListener("loyalty-change", onChange);
  }, []);

  const user = window.__loyaltyUser;

  return (
    <nav style={{
      height: 60, background: "white", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 32px", gap: 28,
    }}>
      <a href="Pick-Room-Table-View.html" style={{
        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "0.04em",
        color: "var(--brand)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
        textDecoration: "none",
      }}>
        <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--brand)" }}></span>
        Hotel Balický
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 22 }}>
        {items.map(it => (
          <a key={it.id} href={it.href} onClick={e => { if (it.href === "#") e.preventDefault(); }} style={{
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600,
            color: active === it.id ? "var(--ink-1)" : "var(--ink-3)",
            textDecoration: "none", padding: "8px 12px", borderRadius: 6, position: "relative",
          }}>
            {it.label}
            {active === it.id && <span style={{ position: "absolute", left: 12, right: 12, bottom: -19, height: 2, background: "var(--brand)" }} />}
          </a>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        {/* Lang / currency pill */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpenMenu(openMenu === "lc" ? null : "lc")} style={{
            appearance: "none", cursor: "pointer",
            background: openMenu === "lc" ? "var(--neutral-100)" : "white",
            border: "1px solid var(--border)", borderRadius: 6,
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
            padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span>{(LANGUAGES.find(l => l.id === lcValue.lang) || LANGUAGES[0]).flag}</span>
            <span style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>{lcValue.lang} · {lcValue.currency}</span>
            <Icon name="chevron-down" size={13} strokeWidth={2.2} color="var(--ink-3)" />
          </button>
          {openMenu === "lc" && window.LangCurrencyPicker && (
            <Dropdown open onClose={() => setOpenMenu(null)} width={500} align="right">
              <window.LangCurrencyPicker
                value={lcValue}
                onChange={(v) => setLcValue(v)}
                onClose={() => setOpenMenu(null)}
              />
            </Dropdown>
          )}
        </div>

        {/* Login / Member */}
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
          {openMenu === "user" && (
            <Dropdown open onClose={() => setOpenMenu(null)} width={420} align="right">
              {user
                ? <window.LoyaltyMemberZone user={user} onClose={() => setOpenMenu(null)} />
                : <window.LoginDropdown onClose={() => setOpenMenu(null)} />}
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
}

function PickRoomSearchBar() {
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const [dateRange, setDateRange] = React.useState({
    start: new Date(2026, 4, 15),
    end: new Date(2026, 4, 17),
  });
  const [guestsCfg, setGuestsCfg] = React.useState({
    rooms: [{ id: 1, adults: 2, teens: 0, kids: 0, infants: 0 }],
  });
  const [voucherCfg, setVoucherCfg] = React.useState({ code: "", status: "idle", discount: null });

  const nights = window.diffDaysSearch ? window.diffDaysSearch(dateRange.start, dateRange.end) : 0;
  const totalGuests = guestsCfg.rooms.reduce((s, r) => s + r.adults + r.teens + r.kids + r.infants, 0);
  const roomCount = guestsCfg.rooms.length;

  const dateLabel = `${window.fmtShort?.(dateRange.start) || ""} – ${window.fmtShort?.(dateRange.end) || ""} · ${nights} ${nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}`;
  const guestsLabel = `${totalGuests} ${totalGuests === 1 ? "host" : totalGuests < 5 ? "hosté" : "hostů"} · ${roomCount} ${roomCount === 1 ? "pokoj" : roomCount < 5 ? "pokoje" : "pokojů"}`;
  const voucherLabel = voucherCfg.status === "ok" && voucherCfg.code ? `Kód: ${voucherCfg.code.toUpperCase()}` : "Zadejte kód";

  // expose active discount on window for AppliedDiscountStrip
  React.useEffect(() => {
    window.__voucherDiscount = voucherCfg.status === "ok" ? voucherCfg.discount : null;
    window.__longStayDiscount = nights >= 3;
    window.dispatchEvent(new CustomEvent("discount-change"));
  }, [voucherCfg, nights]);

  const Field = ({ id, icon, label, value, placeholder, active }) => (
    <button onClick={() => setOpenDropdown(openDropdown === id ? null : id)} style={{
      appearance: "none", textAlign: "left",
      background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
      border: "none", cursor: "pointer",
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
      borderRight: "1px solid var(--border)",
      borderBottom: active ? "2px solid var(--brand)" : "2px solid transparent",
      marginBottom: active ? -2 : 0,
    }}>
      <Icon name={icon} size={18} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
          color: placeholder && !active ? "var(--ink-3)" : "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{value}</div>
      </div>
    </button>
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        background: "white", borderRadius: 10, border: "1px solid var(--border)",
        boxShadow: "0 2px 10px rgba(16,24,40,.05)",
        display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", alignItems: "stretch", overflow: "hidden",
      }}>
        <Field id="date" icon="calendar" label="Termín" value={dateLabel} active={openDropdown === "date"} />
        <Field id="guests" icon="users" label="Hosté" value={guestsLabel} active={openDropdown === "guests"} />
        <Field id="voucher" icon="voucher" label="Voucher" value={voucherLabel} placeholder={voucherCfg.status !== "ok"} active={openDropdown === "voucher"} />
        <button style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "0 24px", letterSpacing: "0.02em",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="search" size={16} strokeWidth={2.4} />
          Změnit hledání
        </button>
      </div>

      {/* Dropdowns */}
      {openDropdown === "date" && window.DateRangePicker && (
        <Dropdown open onClose={() => setOpenDropdown(null)} width={1100} align="left">
          <window.DateRangePicker
            value={dateRange}
            onChange={(v) => setDateRange(v)}
            onClose={() => setOpenDropdown(null)}
          />
        </Dropdown>
      )}
      {openDropdown === "guests" && window.GuestsPicker && (
        <Dropdown open onClose={() => setOpenDropdown(null)} width={480} align="left">
          <window.GuestsPicker
            value={guestsCfg}
            onChange={(v) => setGuestsCfg(v)}
            onClose={() => setOpenDropdown(null)}
          />
        </Dropdown>
      )}
      {openDropdown === "voucher" && window.VoucherPicker && (
        <Dropdown open onClose={() => setOpenDropdown(null)} width={460} align="right">
          <window.VoucherPicker
            value={voucherCfg}
            onChange={(v) => setVoucherCfg(v)}
            onClose={() => setOpenDropdown(null)}
          />
        </Dropdown>
      )}

      <AppliedDiscountStrip />
    </div>
  );
}

function AppliedDiscountStrip() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const onChange = () => force();
    window.addEventListener("discount-change", onChange);
    return () => window.removeEventListener("discount-change", onChange);
  }, []);
  const v = window.__voucherDiscount;
  const longStay = window.__longStayDiscount;
  const items = [];
  if (v) items.push({ label: v.label, sub: `Kód ${v.code}`, value: v.value });
  if (longStay) items.push({ label: "Sleva za delší pobyt 15 %", sub: "Pobyt od 3 nocí · automaticky aplikováno", value: "−15 %" });

  if (!items.length) return null;
  return (
    <div style={{
      marginTop: 10, padding: "10px 14px", borderRadius: 8,
      background: "var(--accent-tint)", border: "1px solid color-mix(in oklch, var(--accent) 25%, white)",
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 8, background: "var(--accent)", color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon name="check" size={15} strokeWidth={2.6} />
      </span>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: i < items.length - 1 ? 14 : 0, borderRight: i < items.length - 1 ? "1px solid color-mix(in oklch, var(--accent) 25%, white)" : "none" }}>
          <span style={{
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--accent-dark)",
            background: "white", padding: "3px 8px", borderRadius: 4,
          }}>{it.value}</span>
          <span style={{ fontSize: 13, color: "var(--accent-dark)", fontWeight: 600 }}>{it.label}</span>
          <span style={{ fontSize: 12, color: "var(--accent-dark)", opacity: 0.7 }}>· {it.sub}</span>
        </div>
      ))}
    </div>
  );
}

window.AppliedDiscountStrip = AppliedDiscountStrip;

function PickRoomBreadcrumb({ label = "Vybrat pokoj" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
      <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
      <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
      <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function ViewSwitcher({ current }) {
  const views = [
    { id: "grid", label: "Karty", icon: "grid", href: "Pick-Room-Grid-View.html" },
    { id: "list", label: "Seznam", icon: "list", href: "Pick-Room-List-View.html" },
    { id: "table", label: "Tabulka", icon: "table", href: "Pick-Room-Table-View.html" },
    { id: "map", label: "Mapa", icon: "map-pin", href: "Pick-Room-Map-View.html" },
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
            padding: "6px 11px", borderRadius: 6, textDecoration: "none",
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

function PickRoomFooter() {
  return (
    <div style={{
      marginTop: 56, padding: "24px 0", borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)",
    }}>
      <div>Powered by IBE v4 · © Hotel Balický</div>
      <div style={{ display: "flex", gap: 18 }}>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Storno podmínky</a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Obchodní podmínky</a>
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Ochrana osobních údajů</a>
      </div>
    </div>
  );
}

function PickRoomReservationBar({ selections, onClear }) {
  const items = Object.values(selections).filter(s => s.qty > 0);
  if (!items.length) return null;
  const total = items.reduce((s, it) => s + it.rate.price * it.qty, 0);
  const roomsCount = items.reduce((s, it) => s + it.qty, 0);

  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
      background: "white", borderTop: "1px solid var(--border)",
      boxShadow: "0 -8px 24px rgba(16,24,40,.10)",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{
          width: 38, height: 38, borderRadius: 8, background: "var(--accent-tint)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)",
        }}>
          <Icon name="check" size={20} strokeWidth={2.6} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>
            {roomsCount} {roomsCount === 1 ? "pokoj" : roomsCount < 5 ? "pokoje" : "pokojů"} ve Vaší rezervaci
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {items.map((it, i) => (
              <span key={i}>{i > 0 ? " · " : ""}{it.qty}× {it.room.name} ({it.rate.name})</span>
            ))}
          </div>
        </div>
        <button onClick={onClear} style={{
          appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
          padding: "10px 14px", borderRadius: 6, cursor: "pointer",
        }}>Vyprázdnit</button>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Celkem za 2 noci</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", lineHeight: 1.05 }}>
            {total.toLocaleString("cs-CZ")} Kč
          </div>
        </div>
        <a href="Upsell.html" style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "13px 24px", borderRadius: 6, letterSpacing: "0.02em", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Pokračovat
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

function ResultsHeader({ count, viewId, sortValue, onSort, extra }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--border)", gap: 16, flexWrap: "wrap",
    }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
          margin: 0, letterSpacing: "-0.005em",
        }}>Dostupné pokoje · {count} typů</h2>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
          Vyberte počet pokojů u libovolné sazby — můžete kombinovat různé pokoje.
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {extra}
        <ViewSwitcher current={viewId} />
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
            <option value="size">Velikost pokoje</option>
          </select>
        </div>
      </div>
    </div>
  );
}

window.PickRoomNav = PickRoomNav;
window.PickRoomSearchBar = PickRoomSearchBar;
window.PickRoomBreadcrumb = PickRoomBreadcrumb;
window.PickRoomFooter = PickRoomFooter;
window.PickRoomReservationBar = PickRoomReservationBar;
window.ResultsHeader = ResultsHeader;
window.ViewSwitcher = ViewSwitcher;

// ─────────────────────────────────────────────────────────────────────────────
//  Shared room-filters: button + modal
//  Used by table / list / grid views so the filter UI is consistent with the
//  map view's FilterButton + FilterDialog pattern.
// ─────────────────────────────────────────────────────────────────────────────

const ROOM_FILTER_DEFAULTS = {
  meal: [],         // ["breakfast","halfboard","optional"]
  cancellation: [], // ["free","nonrefundable"]
  roomType: [],     // ["standard","deluxe","executive","apartman","suite"]
  bed: [],          // ["king","twin","multi"]
};

function countActiveRoomFilters(f) {
  return (f.meal?.length || 0)
       + (f.cancellation?.length || 0)
       + (f.roomType?.length || 0)
       + (f.bed?.length || 0);
}

function RoomFiltersButton({ activeCount, onClick }) {
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
      Filtrovat
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

const ROOM_FILTER_SECTIONS = [
  {
    key: "meal", title: "Strava",
    options: [
      { id: "breakfast", label: "Snídaně v ceně", count: 4 },
      { id: "halfboard", label: "Polopenze", count: 1 },
      { id: "optional", label: "Volitelná strava", count: 2 },
    ],
  },
  {
    key: "cancellation", title: "Storno podmínky",
    options: [
      { id: "free", label: "Zrušení zdarma", count: 3 },
      { id: "nonrefundable", label: "Nevratné", count: 4 },
    ],
  },
  {
    key: "roomType", title: "Typ pokoje",
    options: [
      { id: "standard", label: "Standard", count: 1 },
      { id: "deluxe", label: "Deluxe", count: 1 },
      { id: "executive", label: "Executive", count: 1 },
      { id: "apartman", label: "Apartmán", count: 1 },
      { id: "suite", label: "Suite", count: 1 },
    ],
  },
  {
    key: "bed", title: "Velikost lůžka",
    options: [
      { id: "king", label: "King size", count: 3 },
      { id: "twin", label: "Twin", count: 1 },
      { id: "multi", label: "Více lůžek", count: 1 },
    ],
  },
];

function RoomFiltersDialog({ open, value, onClose, onApply, onReset }) {
  const [draft, setDraft] = React.useState(value || ROOM_FILTER_DEFAULTS);
  React.useEffect(() => { if (open) setDraft(value || ROOM_FILTER_DEFAULTS); }, [open]);
  if (!open) return null;

  function toggle(key, val) {
    setDraft(d => {
      const cur = d[key] || [];
      return { ...d, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  }
  const active = countActiveRoomFilters(draft);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 640,
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
        display: "flex", flexDirection: "column", maxHeight: "92vh",
      }}>
        <header style={{
          padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Upřesnit výběr</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", marginTop: 2 }}>Filtry</div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
          {ROOM_FILTER_SECTIONS.map(sec => (
            <div key={sec.key}>
              <div style={{
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
              }}>{sec.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {sec.options.map(opt => {
                  const on = (draft[sec.key] || []).includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => toggle(sec.key, opt.id)} style={{
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
                      {opt.label}
                      <span style={{ opacity: 0.55, fontWeight: 600, fontSize: 11 }}>{opt.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer style={{
          padding: "14px 24px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={() => { setDraft(ROOM_FILTER_DEFAULTS); onReset && onReset(); }} style={{
            appearance: "none", border: "none", background: "transparent", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
            padding: "8px 4px", textDecoration: "underline",
          }}>Vymazat filtry</button>
          <button onClick={() => onApply(draft)} style={{
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "10px 18px", borderRadius: 6, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            Zobrazit pokoje
            {active > 0 && <span style={{ opacity: 0.75, fontWeight: 600 }}>({active} {active === 1 ? "filtr" : active < 5 ? "filtry" : "filtrů"})</span>}
          </button>
        </footer>
      </div>
    </div>
  );
}

window.ROOM_FILTER_DEFAULTS = ROOM_FILTER_DEFAULTS;
window.countActiveRoomFilters = countActiveRoomFilters;
window.RoomFiltersButton = RoomFiltersButton;
window.RoomFiltersDialog = RoomFiltersDialog;
