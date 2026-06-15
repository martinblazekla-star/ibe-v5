// Table-style room list — OTA tabular layout, denser, multi-rate as rows
const { useState: useStateT, useEffect: useEffectT, useMemo: useMemoT } = React;

const TWEAK_DEFAULTS_T = /*EDITMODE-BEGIN*/{
  "accent": "#1F8A5B",
  "showBenefits": true,
  "stickyHeader": true,
  "showHero": true,
  "aiChatbot": true
}/*EDITMODE-END*/;

const ACCENT_T = {
  "#1F8A5B": { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" },
  "#550173": { accent: "#550173", accentDark: "#3F0156", accentTint: "#F2E6F5" },
  "#1F2429": { accent: "#1F2429", accentDark: "#0E1216", accentTint: "#EDEFF1" },
};

function fmtT(n) { return n.toLocaleString("cs-CZ"); }

function TopNavT() { return <PickRoomNav active="ubytovani" />; }

function SearchBarT() { return <PickRoomSearchBar />; }

function SearchFieldT({ icon, label, value, placeholder }) {
  return (
    <button style={{
      appearance: "none", textAlign: "left", background: "white", border: "none", cursor: "pointer",
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
      borderRight: "1px solid var(--border)",
    }}>
      <Icon name={icon} size={18} color="var(--brand)" strokeWidth={1.8} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {label}
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
          color: placeholder ? "var(--ink-3)" : "var(--ink-1)",
          lineHeight: 1.25, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{value}</div>
      </div>
    </button>
  );
}

function RoomCard({ room }) {
  return (
    <div style={{
      padding: "16px", borderRight: "1px solid var(--border)", height: "100%",
      display: "flex", flexDirection: "column", gap: 12,
      background: "color-mix(in oklch, var(--neutral-100) 30%, white)",
    }}>
      <div style={{ position: "relative", height: 170, borderRadius: 8, overflow: "hidden", background: "var(--neutral-100)" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `url(${room.image}) center / cover no-repeat`,
          filter: room.soldOut ? "grayscale(1)" : "none",
        }} />
        <div style={{
          position: "absolute", left: 8, top: 8, display: "flex", gap: 6,
        }}>
          {room.tags.slice(0, 1).map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--ink-1)",
              background: "rgba(255,255,255,0.94)",
              padding: "4px 7px", borderRadius: 4,
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          position: "absolute", right: 8, bottom: 8,
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600,
          color: "white", background: "rgba(15,18,22,0.6)",
          padding: "3px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="image" size={12} strokeWidth={1.8} />
          <span>{room.tags.includes("Suite") || room.tags.includes("Apartmán") ? "8" : "4"} foto</span>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)",
            margin: 0, lineHeight: 1.25, letterSpacing: "-0.005em",
          }}>{room.name}</h3>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)" }}>č. {room.number}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, color: "var(--ink-2)", fontSize: 13.5 }}>
          <SpecT icon="person">{room.capacity} hostů</SpecT>
          <SpecT icon="size">{room.size} m²</SpecT>
          <SpecT icon="bed">{room.beds}</SpecT>
          <SpecT icon="view">{room.view}</SpecT>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, color: "var(--ink-2)", fontSize: 13, paddingTop: 10, borderTop: "1px solid var(--border-soft)" }}>
        {room.amenities.slice(0, 5).map(a => (
          <span key={a} style={{ display: "inline-flex", alignItems: "flex-start", gap: 6 }}>
            <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
            {a}
          </span>
        ))}
        {room.amenities.length > 5 && (
          <span style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>+ {room.amenities.length - 5} dalších</span>
        )}
      </div>
      {room.remaining && room.remaining <= 2 && !room.soldOut && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px",
          background: "#FFF1F1", border: "1px solid #F5C6C6", borderRadius: 6,
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, color: "#A6151D", alignSelf: "flex-start",
        }}>
          <Icon name="flame" size={12} strokeWidth={2.2} />
          Poslední {room.remaining} {room.remaining === 1 ? "pokoj" : "pokoje"}
        </div>
      )}
      <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } })); }} style={{
        fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700, marginTop: "auto",
        color: "var(--brand)", textDecoration: "none",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        Detail pokoje · galerie
        <Icon name="chevron-right" size={13} strokeWidth={2.4} />
      </a>
    </div>
  );
}

function SpecT({ icon, children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1.2 }}>
      <Icon name={icon} size={15} color="var(--ink-3)" strokeWidth={1.8} />
      <span style={{ fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function RateTableHead() {
  const Th = ({ children, w, align = "left" }) => (
    <th style={{
      textAlign: align, padding: "10px 14px", width: w,
      fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--ink-3)",
      background: "var(--neutral-100)", borderBottom: "1px solid var(--border)",
    }}>{children}</th>
  );
  return (
    <thead>
      <tr>
        <Th>Co je v ceně</Th>
        <Th w="180">Vaše volby</Th>
        <Th align="right" w="160">Cena za 2 noci</Th>
        <Th align="center" w="120">Počet pokojů</Th>
        <Th align="right" w="150"></Th>
      </tr>
    </thead>
  );
}

function RateTableRow({ rate, qty, onQty, onReserve, onOpenWithRooms, isReserved, showBenefits }) {
  const Td = ({ children, align = "left", style }) => (
    <td style={{
      padding: "14px 14px", verticalAlign: "top", textAlign: align,
      borderBottom: "1px solid var(--border-soft)",
      background: isReserved ? "var(--accent-tint)" : "transparent",
      ...style,
    }}>{children}</td>
  );

  const benefits = [
    rate.cancellable
      ? { icon: "check", color: "var(--accent)", label: rate.cancellation, strong: true }
      : { icon: "x", color: "var(--ink-3)", label: "Nelze stornovat" },
  ];

  return (
    <tr>
      <Td>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {rate.name}
          {rate.badge && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px",
              background: "var(--accent-tint)", color: "var(--accent-dark)",
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, borderRadius: 4,
              letterSpacing: "0.02em",
            }}>
              <Icon name="flame" size={11} strokeWidth={2.4} />
              {rate.badge}
            </span>
          )}
        </div>
        {showBenefits && (
          <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {benefits.map((b, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 6,
                fontSize: 13, color: b.strong ? "var(--accent-dark)" : "var(--ink-2)",
                fontWeight: b.strong ? 600 : 400,
              }}>
                <Icon name={b.icon} size={14} color={b.color} strokeWidth={2.2} />
                <span>{b.label}</span>
              </li>
            ))}
          </ul>
        )}
      </Td>
      <Td>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 7px", borderRadius: 999, background: "var(--accent-tint)",
            color: "var(--accent-dark)", fontSize: 12, fontWeight: 600,
          }}>
            <Icon name="check" size={11} strokeWidth={2.4} /> {rate.meal.replace(" v ceně", "")}
          </span>
          {rate.cancellable && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 7px", borderRadius: 999, background: "var(--accent-tint)",
              color: "var(--accent-dark)", fontSize: 12, fontWeight: 600,
            }}>
              <Icon name="check" size={11} strokeWidth={2.4} /> Zrušení zdarma
            </span>
          )}
          {!rate.cancellable && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 7px", borderRadius: 999, background: "var(--neutral-100)",
              color: "var(--ink-3)", fontSize: 12, fontWeight: 600,
            }}>
              <Icon name="x" size={11} strokeWidth={2.4} /> Nevratná
            </span>
          )}
        </div>
      </Td>
      <Td align="right">
        {rate.originalPrice && (
          <div style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
            {fmtT(rate.originalPrice)} Kč
          </div>
        )}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
          lineHeight: 1.05, marginTop: rate.originalPrice ? 4 : 0, letterSpacing: "-0.01em",
        }}>
          {fmtT(rate.price)} Kč
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
          včetně daní a poplatků
        </div>
      </Td>
      <Td align="center">
        <select
          value={qty}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (n > 0) onOpenWithRooms(n);
            else onQty(0);
          }}
          style={{
            appearance: "none", border: "1px solid var(--border)", borderRadius: 6,
            padding: "8px 28px 8px 12px", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
            color: "var(--ink-1)", background: "white",
            backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
            backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
            backgroundSize: "5px 5px",
            backgroundRepeat: "no-repeat",
            cursor: "pointer", minWidth: 70,
          }}
        >
          {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </Td>
      <Td align="right">
        <button onClick={onReserve} style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: isReserved ? "var(--ink-1)" : "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "10px 16px", borderRadius: 6, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {isReserved ? "Přidáno" : "Rezervovat"}
          {!isReserved && <Icon name="chevron-right" size={14} strokeWidth={2.4} />}
          {isReserved && <Icon name="check" size={14} strokeWidth={2.6} />}
        </button>
      </Td>
    </tr>
  );
}

function RoomBlock({ room, selections, setSelections, showBenefits, onOpenConfig }) {
  return (
    <section style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10,
      overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,.04)", marginBottom: 18,
      display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)",
    }}>
      <RoomCard room={room} />
      {!room.soldOut ? (
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <RateTableHead />
          <tbody>
            {room.rates.map(r => {
              const key = `${room.id}-${r.id}`;
              const qty = selections[key]?.qty ?? 0;
              const isReserved = qty > 0;
              return (
                <RateTableRow
                  key={r.id}
                  rate={r}
                  qty={qty}
                  showBenefits={showBenefits}
                  isReserved={isReserved}
                  onQty={(n) => setSelections(prev => ({ ...prev, [key]: { room, rate: r, qty: n } }))}
                  onReserve={() => onOpenConfig(r, 1)}
                  onOpenWithRooms={(n) => onOpenConfig(r, n)}
                />
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ padding: "32px 22px", display: "flex", alignItems: "center", gap: 18, background: "var(--neutral-50)", alignSelf: "stretch" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
              Ve Vašem termínu nedostupné
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>
              Zkuste náhradní termín — pokoj může být dostupný v jiných datech.
            </div>
          </div>
          <button style={{
            appearance: "none", border: "1px solid var(--ink-1)", background: "white", color: "var(--ink-1)",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            padding: "10px 18px", borderRadius: 6, cursor: "pointer",
          }}>Najít náhradní termín</button>
        </div>
      )}
    </section>
  );
}

function HeroT() {
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
      <a href="#" onClick={e => e.preventDefault()} style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--brand)",
        textDecoration: "none", letterSpacing: "0.02em",
      }}>Zobrazit balíčky →</a>
    </div>
  );
}

function FiltersSidebar() {
  const Section = ({ title, children }) => (
    <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border-soft)" }}>
      <div style={{
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
      }}>{title}</div>
      {children}
    </div>
  );
  const Check = ({ label, count, checked }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer", fontSize: 14, color: "var(--ink-1)" }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? "var(--accent)" : "var(--border)"}`,
        background: checked ? "var(--accent)" : "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>{checked && <Icon name="check" size={12} color="white" strokeWidth={3} />}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{count}</span>
    </label>
  );
  return (
    <aside style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 10,
      position: "sticky", top: 110, alignSelf: "flex-start",
    }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="filter" size={16} color="var(--ink-2)" strokeWidth={2} />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Filtry</span>
      </div>
      <Section title="Strava">
        <Check label="Snídaně v ceně" count={4} checked />
        <Check label="Polopenze" count={1} />
        <Check label="Volitelná strava" count={2} />
      </Section>
      <Section title="Storno podmínky">
        <Check label="Zrušení zdarma" count={3} checked />
        <Check label="Nevratné" count={4} />
      </Section>
      <Section title="Typ pokoje">
        <Check label="Standard" count={1} />
        <Check label="Deluxe" count={1} />
        <Check label="Executive" count={1} />
        <Check label="Apartmán" count={1} />
        <Check label="Suite" count={1} />
      </Section>
      <Section title="Velikost lůžka">
        <Check label="King size" count={3} />
        <Check label="Twin" count={1} />
        <Check label="Více lůžek" count={1} />
      </Section>
      <div style={{ padding: "14px 18px" }}>
        <button style={{
          width: "100%", appearance: "none", border: "1px solid var(--border)", background: "white",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-2)",
          padding: "8px", borderRadius: 6, cursor: "pointer",
        }}>Vymazat filtry</button>
      </div>
    </aside>
  );
}

function ReservationBar({ selections, onClear }) {
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
            {fmtT(total)} Kč
          </div>
        </div>
        <button style={{
          appearance: "none", border: "none", cursor: "pointer",
          background: "var(--brand)", color: "white",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
          padding: "13px 24px", borderRadius: 6, letterSpacing: "0.02em",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Pokračovat
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

function AppT() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_T);
  const [selections, setSelections] = useStateT({});
  const [configRate, setConfigRate] = React.useState(null);
  const swatch = ACCENT_T[t.accent] || ACCENT_T["#1F8A5B"];

  return (
    <div style={{
      "--accent": swatch.accent,
      "--accent-dark": swatch.accentDark,
      "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--font-ui)",
    }}>
      <TopNavT />
      <div style={{
        position: t.stickyHeader ? "sticky" : "relative", top: 0, zIndex: 50,
        background: "var(--surface)", padding: "16px 32px 12px",
        boxShadow: t.stickyHeader ? "0 1px 0 var(--border-soft)" : "none",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <PickRoomBreadcrumb />
          <SearchBarT />
        </div>
      </div>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 32px 140px" }}>
        <div>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              <BestPriceGuarantee />
              <MemberActiveRibbon />
              <MemberSignUpBanner />
            </div>
            <ResultsHeader
              count={window.ROOMS.length}
              viewId="table"
              sortValue="recommended"
              onSort={() => {}}
            />

            {window.ROOMS.map(room => (
              <RoomBlock key={room.id} room={room} selections={selections} setSelections={setSelections} showBenefits={t.showBenefits} onOpenConfig={(rate, initialRooms) => setConfigRate({ room, rate, initialRooms })} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <WhyBookDirect />
        </div>
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

      {t.aiChatbot && window.AIChatbot && (
        <window.AIChatbot
          onAddSelection={(room, rate) => setConfigRate({ room, rate, initialRooms: 1 })}
          onOpenRoomDetail={(room) => window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } }))}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
          <TweakToggle label="Banner s balíčky" value={t.showHero} onChange={v => setTweak("showHero", v)} />
          <TweakToggle label="Benefity v řádku" value={t.showBenefits} onChange={v => setTweak("showBenefits", v)} />
          <TweakToggle label="AI asistentka Marie" value={t.aiChatbot} onChange={v => setTweak("aiChatbot", v)} />
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

ReactDOM.createRoot(document.getElementById("root")).render(<AppT />);
