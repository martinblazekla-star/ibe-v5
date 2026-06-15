// Concierge / Map page — how to get here + basic concierge information
const { useState: useStateC } = React;

const HOTEL = {
  name: "Hotel Balický",
  address: "Národní 18, 110 00 Praha 1",
  gps: "50.0815° N · 14.4178° E",
  phone: "+420 257 111 111",
  email: "concierge@hotelbalicky.cz",
  reception: "Recepce 24/7",
  languages: "Čeština · Angličtina · Němčina · Ruština",
};

const TRANSPORT = [
  {
    id: "car", icon: "car", title: "Autem",
    time: "12 min od D1 / Centrum",
    summary: "Soukromá garáž s elektrickými dobíječkami přímo v hotelu.",
    parking: { price: "450 Kč / noc", note: "Předem rezervujte v rezervaci pobytu — kapacita 24 stání." },
    steps: [
      "Sjeďte z D1 na exit 1 (Praha-centrum)",
      "Pokračujte po nábřeží směrem na Národní třídu",
      "Vjezd do garáže najdete z ulice Konviktská",
    ],
  },
  {
    id: "train", icon: "train", title: "Vlakem",
    time: "8 min pěšky z Hl. nádraží",
    summary: "Z hlavního nádraží jste u nás pohodlně a rychle pěšky nebo tramvají.",
    parking: null,
    steps: [
      "Z Hlavního nádraží východ směr Wilsonova",
      "Tramvaj č. 9 nebo 22, výstup Národní divadlo",
      "Pěšky 3 minuty po Národní třídě",
    ],
  },
  {
    id: "plane", icon: "plane", title: "Letadlem",
    time: "35 min z VHA",
    summary: "Letiště Václava Havla — taxi, autobus 119 + metro nebo náš transfer.",
    parking: null,
    steps: [
      "Taxi (zhruba 700 Kč) přímo do hotelu",
      "Bus 119 → Nádraží Veleslavín → metro A do Staroměstské",
      "Soukromý transfer s řidičem od 1 200 Kč (rezervace na recepci)",
    ],
  },
  {
    id: "mhd", icon: "bus", title: "MHD",
    time: "Tram 2 min · Metro 5 min",
    summary: "Síť pražské MHD je hned u dveří — denní jízdenka 120 Kč.",
    parking: null,
    steps: [
      "Tramvaj 9, 18, 22 — stanice „Národní divadlo“",
      "Metro B — stanice „Národní třída“",
      "Jízdenku zakoupíte v automatu na zastávce nebo v aplikaci PID Lítačka",
    ],
  },
];

const NEARBY = {
  pamatky: [
    { name: "Karlův most", dist: "350 m", walk: "5 min", note: "Nejslavnější most v Praze", emoji: "🌉" },
    { name: "Staroměstské náměstí", dist: "650 m", walk: "9 min", note: "Orloj, Týnský chrám", emoji: "🏛" },
    { name: "Národní divadlo", dist: "120 m", walk: "2 min", note: "Sousedíme přes ulici", emoji: "🎭" },
    { name: "Pražský hrad", dist: "1.2 km", walk: "18 min", note: "Tramvaj 22 přímo nahoru", emoji: "🏰" },
  ],
  restaurace: [
    { name: "U Modré kachničky", dist: "200 m", walk: "3 min", note: "Tradiční česká kuchyně", emoji: "🍽" },
    { name: "Café Slavia", dist: "150 m", walk: "2 min", note: "Legendární kavárna 1881", emoji: "☕" },
    { name: "Field Restaurant", dist: "450 m", walk: "6 min", note: "Michelin ★ moderní gastro", emoji: "⭐" },
    { name: "Lokál Dlouhááá", dist: "550 m", walk: "7 min", note: "Tankové pivo, klasika", emoji: "🍺" },
  ],
  wellness: [
    { name: "Hotelové wellness", dist: "v hotelu", walk: "—", note: "Pro hosty zdarma od 7:00", emoji: "🧖" },
    { name: "Lázně Saint-Charles", dist: "1.8 km", walk: "Tram 8 min", note: "Termální koupele", emoji: "💆" },
    { name: "Yoga Karma", dist: "400 m", walk: "5 min", note: "Studio jógy", emoji: "🧘" },
  ],
};

// -------------------------------------------------------------------- Map illustration
function MapIllustration() {
  return (
    <div style={{
      position: "relative", borderRadius: 14, overflow: "hidden",
      background: "linear-gradient(135deg, #F4F6F8 0%, #EAEEF1 100%)",
      border: "1px solid var(--border)",
      aspectRatio: "16 / 11",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
    }}>
      <svg viewBox="0 0 480 330" width="100%" height="100%" style={{ display: "block" }} preserveAspectRatio="xMidYMid slice">
        {/* River */}
        <path d="M -10 240 C 80 220, 140 280, 220 240 S 360 200, 500 230 L 500 350 L -10 350 Z" fill="#CFE2EE" opacity="0.85" />
        <path d="M -10 240 C 80 220, 140 280, 220 240 S 360 200, 500 230" fill="none" stroke="#A8C9DC" strokeWidth="1.2" />

        {/* Parks */}
        <rect x="40" y="60" width="80" height="60" rx="6" fill="#E2EEDC" opacity="0.9" />
        <rect x="50" y="70" width="60" height="40" rx="4" fill="#D2E5C7" opacity="0.7" />
        <rect x="360" y="30" width="80" height="55" rx="6" fill="#E2EEDC" opacity="0.9" />

        {/* Streets — horizontal */}
        {[40, 90, 140, 190].map((y, i) => (
          <line key={"h" + i} x1="0" y1={y} x2="480" y2={y} stroke="#D7DCDF" strokeWidth="1.5" />
        ))}
        {/* Streets — vertical */}
        {[80, 160, 240, 320, 400].map((x, i) => (
          <line key={"v" + i} x1={x} y1="0" x2={x} y2="270" stroke="#D7DCDF" strokeWidth="1.5" />
        ))}
        {/* Wider streets */}
        <line x1="0" y1="160" x2="480" y2="160" stroke="#C9CFD2" strokeWidth="3" />
        <line x1="240" y1="0" x2="240" y2="270" stroke="#C9CFD2" strokeWidth="3" />

        {/* Building blocks (hinted) */}
        <rect x="86" y="46" width="68" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="170" y="46" width="60" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="86" y="96" width="68" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="170" y="96" width="60" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="248" y="46" width="64" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="328" y="96" width="60" height="38" rx="3" fill="white" opacity="0.55" />
        <rect x="170" y="166" width="60" height="20" rx="3" fill="white" opacity="0.55" />
        <rect x="250" y="166" width="62" height="20" rx="3" fill="white" opacity="0.55" />

        {/* Nearby labels (small dots) */}
        <NearbyDot x={350} y={70} label="Staroměstské nám." />
        <NearbyDot x={190} y={210} label="Karlův most" />
        <NearbyDot x={270} y={210} label="Národní divadlo" />
        <NearbyDot x={120} y={60} label="Pražský hrad" align="left" />

        {/* Hotel pin — central */}
        <g transform="translate(240 140)">
          <circle r="32" fill="rgba(85,1,115,0.10)">
            <animate attributeName="r" values="22;40;22" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.30;0;0.30" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle r="22" fill="rgba(85,1,115,0.15)" />
          <path d="M 0 -18 C 9 -18, 16 -11, 16 -2 C 16 8, 0 22, 0 22 C 0 22, -16 8, -16 -2 C -16 -11, -9 -18, 0 -18 Z"
                fill="#550173" stroke="white" strokeWidth="2.4" />
          <circle r="5" fill="white" />
        </g>

        {/* Hotel label */}
        <g transform="translate(240 184)">
          <rect x="-58" y="0" width="116" height="22" rx="4" fill="#550173" />
          <text x="0" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Source Sans 3, sans-serif">
            HOTEL BALICKÝ
          </text>
        </g>
      </svg>

      {/* Map controls (decorative) */}
      <div style={{
        position: "absolute", right: 14, top: 14, display: "flex", flexDirection: "column", gap: 4,
      }}>
        {["plus", "minus"].map(n => (
          <button key={n} style={{
            appearance: "none", border: "1px solid var(--border)", cursor: "pointer",
            background: "white", width: 30, height: 30, borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 3px rgba(16,24,40,0.10)",
          }}>
            <Icon name={n} size={14} color="var(--ink-2)" strokeWidth={2.4} />
          </button>
        ))}
      </div>
      <div style={{
        position: "absolute", left: 14, bottom: 14,
        background: "rgba(255,255,255,0.92)", borderRadius: 6, padding: "5px 10px",
        fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.04em",
        border: "1px solid var(--border)",
      }}>
        Schematická mapa · klikněte pro otevření v Google Maps
      </div>
    </div>
  );
}

function NearbyDot({ x, y, label, align = "right" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="4.5" fill="white" stroke="#6D7073" strokeWidth="1.8" />
      <text
        x={align === "right" ? 9 : -9}
        y="3.5"
        textAnchor={align === "right" ? "start" : "end"}
        fill="#484C4F"
        fontSize="10"
        fontWeight="600"
        fontFamily="Source Sans 3, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

// -------------------------------------------------------------------- Hotel address card
function AddressCard() {
  const [copied, setCopied] = useStateC(false);
  function copy() {
    navigator.clipboard?.writeText(HOTEL.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div style={{
      background: "white", border: "1px solid var(--border)", borderRadius: 12,
      padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14,
      height: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 38, height: 38, borderRadius: 10, background: "var(--brand)", color: "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="map-pin" size={18} color="white" strokeWidth={2} />
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)", lineHeight: 1.2 }}>
            {HOTEL.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>
            {HOTEL.reception} · {HOTEL.languages.split(" · ").length} jazyků
          </div>
        </div>
      </div>

      <div style={{
        background: "var(--neutral-100)", borderRadius: 10, padding: "12px 14px",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ fontSize: 14, color: "var(--ink-1)", lineHeight: 1.4 }}>
          <strong>{HOTEL.address.split(",")[0]}</strong><br />
          {HOTEL.address.split(",").slice(1).join(",").trim()}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="navigation" size={11} color="var(--ink-3)" strokeWidth={2} />
          GPS · {HOTEL.gps}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button onClick={copy} style={{
            appearance: "none", border: "1px solid var(--border)", background: "white",
            color: "var(--ink-1)", fontFamily: "inherit", fontWeight: 600, fontSize: 12,
            padding: "6px 10px", borderRadius: 6, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name={copied ? "check" : "copy"} size={12} color={copied ? "var(--accent-dark)" : "var(--ink-2)"} strokeWidth={2.2} />
            {copied ? "Zkopírováno" : "Kopírovat"}
          </button>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{
            appearance: "none", border: "none", cursor: "pointer", textDecoration: "none",
            background: "var(--brand)", color: "white",
            fontFamily: "inherit", fontWeight: 700, fontSize: 12,
            padding: "6px 12px", borderRadius: 6, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="navigation" size={12} color="white" strokeWidth={2.2} />
            Otevřít v navigaci
          </a>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
        <ContactRow icon="phone" label="Recepce" value={HOTEL.phone} href={`tel:${HOTEL.phone.replace(/\s/g, "")}`} />
        <ContactRow icon="mail" label="Concierge" value={HOTEL.email} href={`mailto:${HOTEL.email}`} />
        <ContactRow icon="globe" label="Jazyky" value={HOTEL.languages} />
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value, href }) {
  const content = (
    <>
      <Icon name={icon} size={15} color="var(--brand)" strokeWidth={2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-1)", fontWeight: 600, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </div>
      </div>
    </>
  );
  const baseStyle = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 0", textDecoration: "none", color: "inherit",
  };
  return href ? <a href={href} style={baseStyle}>{content}</a> : <div style={baseStyle}>{content}</div>;
}

// -------------------------------------------------------------------- Transport tabs
function TransportTabs() {
  const [active, setActive] = useStateC("car");
  const current = TRANSPORT.find(t => t.id === active);
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.01em",
          }}>
            Jak se k nám dostanete
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "4px 0 0", lineHeight: 1.45 }}>
            Vyberte způsob dopravy a my Vám připravíme krok-za-krokem instrukce.
          </p>
        </div>
      </div>

      <div style={{ padding: "14px 22px 0", display: "flex", gap: 8, borderBottom: "1px solid var(--border-soft)" }}>
        {TRANSPORT.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              appearance: "none", border: "none", background: "transparent", cursor: "pointer",
              padding: "10px 14px 12px", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
              color: isActive ? "var(--ink-1)" : "var(--ink-3)",
              borderBottom: `2px solid ${isActive ? "var(--brand)" : "transparent"}`,
              marginBottom: -1,
            }}>
              <Icon name={t.icon} size={17} color={isActive ? "var(--brand)" : "var(--ink-3)"} strokeWidth={2} />
              {t.title}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "20px 22px 22px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 11px", borderRadius: 999, background: "var(--accent-tint)",
              color: "var(--accent-dark)", fontSize: 12.5, fontWeight: 700,
            }}>
              <Icon name="clock" size={13} color="var(--accent-dark)" strokeWidth={2.2} />
              {current.time}
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "0 0 14px", lineHeight: 1.5, textWrap: "pretty" }}>
            {current.summary}
          </p>
          <ol style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {current.steps.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "var(--brand)", color: "white",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11.5, flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: "var(--ink-1)", lineHeight: 1.5, paddingTop: 2 }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside style={{
          background: "var(--neutral-50)", border: "1px solid var(--border-soft)", borderRadius: 10,
          padding: "16px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          {current.parking ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Parkování
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--ink-1)", letterSpacing: "-0.01em" }}>
                {current.parking.price}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
                {current.parking.note}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6, fontSize: 13, color: "var(--ink-2)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Krytá garáž
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Elektrické dobíječky
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Bezpečnostní kamery
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Concierge tip
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-1)", lineHeight: 1.5 }}>
                Pokud vezete více zavazadel, můžeme zařídit <strong>uvítací transfer</strong> přímo od dveří nádraží/letiště. Stačí napsat na concierge@hotelbalicky.cz minimálně 24 hodin předem.
              </div>
              <a href={`mailto:${HOTEL.email}`} style={{
                background: "white", border: "1px solid var(--ink-1)", color: "var(--ink-1)",
                fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                padding: "8px 12px", borderRadius: 6, textDecoration: "none",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 4,
              }}>
                <Icon name="mail" size={13} color="var(--ink-1)" strokeWidth={2.2} />
                Napsat concierge
              </a>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------- Nearby tabs
function NearbySection() {
  const [tab, setTab] = useStateC("pamatky");
  const map = {
    pamatky: { label: "Památky", icon: "view" },
    restaurace: { label: "Restaurace & kavárny", icon: "tag" },
    wellness: { label: "Wellness", icon: "leaf" },
  };
  const items = NEARBY[tab];
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px 22px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.01em",
          }}>
            V okolí hotelu
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "4px 0 0" }}>
            Tipy našeho concierge — vše v pěším dosahu.
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.keys(map).map(k => {
            const active = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} style={{
                appearance: "none",
                border: `1px solid ${active ? "var(--ink-1)" : "var(--border)"}`,
                background: active ? "var(--ink-1)" : "white",
                color: active ? "white" : "var(--ink-2)",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
                padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                {map[k].label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map(i => (
          <div key={i.name} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px", border: "1px solid var(--border-soft)", borderRadius: 10,
            background: "var(--neutral-50)",
          }}>
            <span style={{
              fontSize: 22, lineHeight: 1, width: 40, height: 40, flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "white", borderRadius: 8, border: "1px solid var(--border-soft)",
            }}>{i.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.25 }}>
                {i.name}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                {i.note}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
                {i.dist}
              </div>
              {i.walk !== "—" && (
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="walk" size={11} color="var(--ink-3)" strokeWidth={2} /> {i.walk}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------- Concierge services
function ConciergeServices() {
  const services = [
    { icon: "navigation", title: "Transfer z letiště", desc: "Soukromé vozidlo s řidičem od 1 200 Kč" },
    { icon: "tag", title: "Rezervace restaurací", desc: "Stoly v michelinských a oblíbených místních" },
    { icon: "voucher", title: "Vstupenky a prohlídky", desc: "Hrad, divadla, koncerty bez čekání" },
    { icon: "sparkle", title: "Speciální překvapení", desc: "Šampaňské, růže, dort — k narozeninám i výročí" },
  ];
  return (
    <div style={{
      background: "linear-gradient(135deg, #FAF5FC 0%, #ffffff 60%)",
      border: "1px solid #EEDFF4", borderRadius: 14, padding: "22px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.01em",
          }}>
            Concierge služby
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "4px 0 0", maxWidth: 540, lineHeight: 1.45 }}>
            Náš tým Vám ochotně připraví cokoli, co Vám zpříjemní pobyt — stačí se zeptat na recepci nebo napsat předem.
          </p>
        </div>
        <a href={`tel:${HOTEL.phone.replace(/\s/g, "")}`} style={{
          background: "var(--brand)", color: "white", textDecoration: "none",
          fontFamily: "inherit", fontWeight: 700, fontSize: 14,
          padding: "11px 18px", borderRadius: 8,
          display: "inline-flex", alignItems: "center", gap: 8, letterSpacing: "0.02em",
        }}>
          <Icon name="phone" size={14} color="white" strokeWidth={2.2} />
          Zavolat na recepci
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {services.map(s => (
          <div key={s.title} style={{
            background: "white", borderRadius: 10, padding: "16px",
            border: "1px solid #EEDFF4",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--brand)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={s.icon} size={17} color="white" strokeWidth={2} />
            </span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.25 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.45 }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------- App
function ConciergeApp() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      <PickRoomNav active="mapa" />
      <div style={{ background: "var(--surface)", padding: "16px 32px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <PickRoomBreadcrumb label="Mapa & doprava" />
        </div>
      </div>
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 32px 60px", display: "flex", flexDirection: "column", gap: 18 }}>
        <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginTop: 4 }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--ink-1)",
              margin: 0, letterSpacing: "-0.015em", lineHeight: 1.15,
            }}>
              Mapa & doprava
            </h1>
            <p style={{ fontSize: 14.5, color: "var(--ink-3)", margin: "6px 0 0", lineHeight: 1.5 }}>
              Vše, co potřebujete vědět, abyste k nám doráželi bez starostí — plus tipy od našeho concierge na nejlepší místa v okolí.
            </p>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 16, alignItems: "stretch" }}>
          <MapIllustration />
          <AddressCard />
        </section>

        <TransportTabs />

        <NearbySection />

        <ConciergeServices />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ConciergeApp />);
