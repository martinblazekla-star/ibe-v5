// Pick Room — SINGLE ROOM view (within booking engine)
// Maximum conversion focus on ONE room. IBE chrome, marketing-grade layout, integrated rates table.

const { useState: useStateSR } = React;

const TWEAK_DEFAULTS_SR = /*EDITMODE-BEGIN*/{
  "stickyHeader": true,
  "soldOut": false
}/*EDITMODE-END*/;

function fmtSR(n) { return n.toLocaleString("cs-CZ"); }

function GalleryRow({ room }) {
  const imgs = [room.image, "assets/room-2.png", "assets/room-3.png", room.image, "assets/room-1.png"];
  const [mainIdx, setMainIdx] = useStateSR(0);
  return (
    <section>
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, height: 440,
      }}>
        <div style={{
          background: `url(${imgs[mainIdx]}) center / cover no-repeat var(--neutral-100)`,
          borderRadius: 12, gridRow: "span 2", position: "relative",
        }}>
          <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
            {room.tags.slice(0, 2).map(t => (
              <span key={t} style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--ink-1)",
                background: "rgba(255,255,255,0.94)", padding: "5px 9px", borderRadius: 4,
              }}>{t}</span>
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: `url(${imgs[i]}) center / cover no-repeat var(--neutral-100)`,
            borderRadius: 12, position: "relative", cursor: "pointer",
          }} onClick={() => setMainIdx(i)}>
            {i === 4 && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: 12,
                background: "rgba(15,18,22,0.55)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              }}>
                <Icon name="image" size={16} strokeWidth={1.8} />
                +8 fotek
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RoomTitleBar({ room }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--brand)",
      }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />
        Pokoj č. {room.number}
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
        margin: "8px 0 0", letterSpacing: "-0.018em", lineHeight: 1.1,
      }}>{room.name}</h1>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "8px 22px", marginTop: 14, color: "var(--ink-2)", fontSize: 14.5,
      }}>
        {[
          { icon: "person", label: `${room.capacity} hostů` },
          { icon: "size", label: `${room.size} m²` },
          { icon: "bed", label: room.beds },
          { icon: "view", label: room.view },
        ].map((s, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Icon name={s.icon} size={16} color="var(--ink-3)" strokeWidth={1.8} />
            <span style={{ fontWeight: 500 }}>{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RoomCopy({ room }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 12px", letterSpacing: "-0.01em",
      }}>O pokoji</h2>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65, margin: "0 0 10px" }}>
        {room.name} je prostorný pokoj s pečlivě vybraným designovým nábytkem, hedvábným povlečením a velkou koupelnou s deštníkovou sprchou.
        Velká okna otevírají {room.view.toLowerCase()}, jemné osvětlení, klimatizace, vlastní mini-bar.
      </p>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
        Ideální pro páry hledající klid, obchodní cesty s důrazem na pohodlí, nebo víkendovou útěkovou variantu z reality. Ranní káva v posteli a snídaně jako z restaurace.
      </p>
    </section>
  );
}

function AmenitiesGrid({ room }) {
  // Group amenities into categories
  const grouped = {
    "Spánek a koupelna": room.amenities.filter(a => /post|sprch|vana|koupel/i.test(a)),
    "Technologie": room.amenities.filter(a => /tv|televiz|wifi|telef/i.test(a)),
    "Komfort": room.amenities.filter(a => /klimat|pracov|trezor|mini|kavov/i.test(a)),
  };
  // Fallback: split evenly
  const all = room.amenities;
  if (!Object.values(grouped).some(g => g.length)) {
    const third = Math.ceil(all.length / 3);
    grouped["Vybavení"] = all.slice(0, third);
    grouped["Komfort"] = all.slice(third, third * 2);
    grouped["Další"] = all.slice(third * 2);
  }

  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 16px", letterSpacing: "-0.01em",
      }}>Vybavení pokoje</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        {Object.entries(grouped).filter(([, items]) => items.length > 0).map(([cat, items]) => (
          <div key={cat}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8,
            }}>{cat}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((a, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13.5, color: "var(--ink-1)" }}>
                  <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function RatesTable({ room, onSelectRate }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)",
        margin: "0 0 8px", letterSpacing: "-0.01em",
      }}>Vyberte sazbu</h2>
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 18 }}>
        {room.rates.length} {room.rates.length > 1 ? "varianty" : "varianta"} cen pro vybraný termín. Garantujeme nejnižší cenu.
      </div>
      <div style={{
        background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "var(--neutral-100)" }}>
              {["Co je v ceně", "Vaše volby", "Cena za 2 noci", "Počet pokojů", ""].map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 2 ? "right" : (i === 3 ? "center" : "left"),
                  padding: "12px 16px", width: i === 1 ? 200 : (i === 2 ? 170 : (i === 3 ? 120 : (i === 4 ? 150 : "auto"))),
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-3)",
                  borderBottom: "1px solid var(--border)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {room.rates.map(rate => (
              <tr key={rate.id}>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{rate.name}</span>
                    {rate.badge && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px",
                        background: "var(--accent-tint)", color: "var(--accent-dark)",
                        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
                      }}>
                        <Icon name="flame" size={11} strokeWidth={2.4} /> {rate.badge}
                      </span>
                    )}
                  </div>
                  <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    <li style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: rate.cancellable ? "var(--accent-dark)" : "var(--ink-3)", fontWeight: rate.cancellable ? 600 : 400 }}>
                      <Icon name={rate.cancellable ? "check" : "x"} size={13} color={rate.cancellable ? "var(--accent)" : "var(--ink-3)"} strokeWidth={2.2} />
                      <span>{rate.cancellation}</span>
                    </li>
                  </ul>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <Chip2 accent><Icon name="check" size={10} strokeWidth={2.4} /> {rate.meal.replace(" v ceně", "")}</Chip2>
                    {rate.cancellable
                      ? <Chip2 accent><Icon name="check" size={10} strokeWidth={2.4} /> Storno zdarma</Chip2>
                      : <Chip2 muted><Icon name="x" size={10} strokeWidth={2.4} /> Nevratná</Chip2>}
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {rate.originalPrice && (
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", textDecoration: "line-through", lineHeight: 1 }}>
                      {fmtSR(rate.originalPrice)} Kč
                    </div>
                  )}
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--ink-1)", lineHeight: 1.05, marginTop: rate.originalPrice ? 3 : 0, letterSpacing: "-0.01em" }}>
                    {fmtSR(rate.price)} Kč
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>vč. daní a poplatků</div>
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <select onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (n > 0) onSelectRate(rate, n);
                  }} defaultValue="0" style={{
                    appearance: "none", border: "1px solid var(--border)", borderRadius: 6, background: "white",
                    padding: "8px 28px 8px 12px", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
                    color: "var(--ink-1)", cursor: "pointer", minWidth: 70,
                    backgroundImage: "linear-gradient(45deg, transparent 50%, #6D7073 50%), linear-gradient(135deg, #6D7073 50%, transparent 50%)",
                    backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
                    backgroundSize: "5px 5px", backgroundRepeat: "no-repeat",
                  }}>
                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <button onClick={() => onSelectRate(rate, 1)} style={{
                    appearance: "none", border: "none", cursor: "pointer",
                    background: "var(--brand)", color: "white",
                    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                    padding: "10px 16px", borderRadius: 6, letterSpacing: "0.02em",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                    Rezervovat
                    <Icon name="chevron-right" size={14} strokeWidth={2.4} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const tdStyle = {
  padding: "16px 16px", verticalAlign: "top",
  borderBottom: "1px solid var(--border-soft)",
};

function Chip2({ children, accent, muted }) {
  let bg = "var(--neutral-100)", color = "var(--ink-2)";
  if (accent) { bg = "var(--accent-tint)"; color = "var(--accent-dark)"; }
  if (muted) { bg = "var(--neutral-100)"; color = "var(--ink-3)"; }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 7px", borderRadius: 999, background: bg, color, fontSize: 11.5, fontWeight: 600,
    }}>{children}</span>
  );
}

function SocialProof() {
  return (
    <section style={{ marginTop: 36, background: "var(--neutral-50)", borderRadius: 12, padding: "20px 22px", border: "1px solid var(--border-soft)" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--accent-dark)",
            background: "white", padding: "5px 12px", borderRadius: 8, border: "1px solid color-mix(in oklch, var(--accent) 25%, white)",
          }}>9,5 / 10</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>Výjimečné · 312 přímých rezervací</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-1)", lineHeight: 1.5, fontStyle: "italic" }}>
            „Naprosto dokonalý pokoj. Postel z péra, klid uprostřed Prahy a snídaně na úrovni michelinské restaurace."
          </p>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>— Klára M., květen 2026</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", border: "1px solid var(--border)", borderRadius: 8 }}>
          <Icon name="flame" size={16} color="#A6151D" strokeWidth={2.2} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-1)" }}>Tento pokoj je oblíbený</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>14 lidí dnes prohlíželo</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StickySidebar({ room }) {
  return (
    <aside style={{ position: "sticky", top: 92, alignSelf: "flex-start" }}>
      <window.BookingWidget room={room} variant="inline" />
      <div style={{
        marginTop: 14, padding: "14px 16px",
        background: "color-mix(in oklch, var(--brand) 5%, white)",
        border: "1px solid color-mix(in oklch, var(--brand) 14%, white)", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icon name="sparkle" size={15} color="var(--brand)" strokeWidth={2.2} />
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.45 }}>
          <strong>Členská sleva 5 %</strong> — zaregistrujte se a uplatněte ihned.
        </div>
      </div>
    </aside>
  );
}

function AppSingleRoom() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_SR);
  const [configRate, setConfigRate] = useStateSR(null);
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };

  const room = window.ROOMS[0]; // Dvoulůžkový Deluxe

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
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "var(--ink-3)" }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <a href="Pick-Room-Grid-View.html" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Pokoje</a>
            <Icon name="chevron-right" size={12} color="var(--ink-3)" strokeWidth={2} />
            <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{room.name}</span>
          </div>
          <PickRoomSearchBar />
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px 80px" }}>
        <div style={{ marginBottom: 16 }}>
          <BestPriceGuarantee />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 32, alignItems: "start" }}>
          <div>
            <RoomTitleBar room={room} />
            <div style={{ marginTop: 18 }}>
              <GalleryRow room={room} />
            </div>
            <SocialProof />
            <RoomCopy room={room} />
            <AmenitiesGrid room={room} />
            {t.soldOut ? (
              <window.UnavailableBlock
                subjectLabel={`Pokoj č. ${room.number}`}
                subjectName={room.name}
                suggestionRooms={(window.ROOMS || []).filter(r => r.id !== room.id && !r.soldOut).slice(0, 3)}
                altDates={[
                  { label: "O 4 dny později", range: "Út 19. – Čt 21. 5.", price: 4900, savings: null },
                  { label: "Příští týden", range: "Pá 22. – Ne 24. 5.", price: 4900, savings: null },
                  { label: "Konec května", range: "Pá 29. – Ne 31. 5.", price: 5200, savings: null },
                  { label: "Za 2 týdny", range: "Pá 29. 5. – St 3. 6.", price: 8400, savings: 15 },
                ]}
              />
            ) : (
              <RatesTable room={room} onSelectRate={(rate, rooms) => setConfigRate({ room, rate, initialRooms: rooms })} />
            )}
          </div>
          <StickySidebar room={room} />
        </div>

        <PickRoomFooter />
      </main>

      <window.RateConfigDialog
        open={!!configRate}
        room={configRate?.room}
        rate={configRate?.rate}
        initialRooms={configRate?.initialRooms}
        onClose={() => setConfigRate(null)}
        onConfirm={() => { window.location.href = "Upsell.html"; }}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakToggle label="Sticky search bar" value={t.stickyHeader} onChange={v => setTweak("stickyHeader", v)} />
        </TweakSection>
        <TweakSection label="Stav">
          <TweakToggle label="Pokoj vyprodaný" value={t.soldOut} onChange={v => setTweak("soldOut", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppSingleRoom />);
