// Single room landing page — editorial / lifestyle feel

function fmtLR(n) { return n.toLocaleString("cs-CZ"); }

function RoomHero({ room }) {
  return (
    <section style={{
      position: "relative", height: 640, overflow: "hidden", background: `url(${room.image}) center / cover no-repeat var(--neutral-100)`,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(15,18,22,0) 35%, rgba(15,18,22,0.65) 100%)",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "0 40px 56px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 18,
          }}>
            Pokoj č. {room.number} · {room.tags[0]}
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 64, color: "white",
            margin: 0, letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: 800,
          }}>{room.name}</h1>
          <div style={{
            marginTop: 22, display: "flex", alignItems: "center", gap: 24, color: "rgba(255,255,255,0.9)", fontSize: 15,
          }}>
            {[
              { icon: "person", label: `${room.capacity} hostů` },
              { icon: "size", label: `${room.size} m²` },
              { icon: "bed", label: room.beds },
              { icon: "view", label: room.view },
            ].map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Icon name={s.icon} size={17} color="rgba(255,255,255,0.9)" strokeWidth={1.6} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button style={{
        position: "absolute", right: 40, bottom: 40, appearance: "none", cursor: "pointer",
        background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)",
        color: "white", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
        padding: "10px 16px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <Icon name="image" size={15} strokeWidth={1.8} />
        Zobrazit galerii (12 fotek)
      </button>
    </section>
  );
}

function RoomStory({ room }) {
  return (
    <section style={{ padding: "80px 40px 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
          }}>O pokoji</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
            margin: "0 0 20px", letterSpacing: "-0.015em", lineHeight: 1.15,
          }}>
            Klidné útočiště s vlastním rukopisem.
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.7, margin: "0 0 14px" }}>
            {room.name} je prostorný pokoj s pečlivě vybraným designovým nábytkem, hedvábným povlečením a velkou koupelnou s deštníkovou sprchou.
            Velká okna otevírají {room.view.toLowerCase()} a po setmění si můžete na lampičce přečíst knihu vybranou personálem.
          </p>
          <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.7, margin: "0 0 14px" }}>
            Ranní káva v posteli, vlastní espresso kávovar, jemné osvětlení s memory funkcí, klimatizace, vlastní mini-bar
            složený s ohledem na vás. Personál hotelu Vás ráno přivítá s českou snídaní, kterou nikde jinde nedostanete.
          </p>
          <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.7, margin: 0 }}>
            Ideální pro páry hledající klid, obchodní cesty s důrazem na pohodlí, nebo víkendovou útěkovou variantu z reality.
          </p>
        </div>
        <aside style={{ background: "var(--neutral-50)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: "26px 28px" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14,
          }}>V pokoji najdete</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
            {room.amenities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13.5, color: "var(--ink-1)" }}>
                <Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} />
                <span>{a}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: "var(--ink-2)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Check-in od 15:00</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Check-out do 11:00</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Pozdní check-out na vyžádání</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="check" size={13} color="var(--accent)" strokeWidth={2.4} /> Welcome drink zdarma</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function GalleryStrip({ room }) {
  const imgs = [room.image, "assets/room-2.png", "assets/room-3.png", room.image];
  return (
    <section style={{ padding: "60px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, height: 460 }}>
        <div style={{ background: `url(${imgs[0]}) center / cover no-repeat var(--neutral-100)`, borderRadius: 14, gridRow: "span 2" }} />
        <div style={{ background: `url(${imgs[1]}) center / cover no-repeat var(--neutral-100)`, borderRadius: 14 }} />
        <div style={{ background: `url(${imgs[2]}) center / cover no-repeat var(--neutral-100)`, borderRadius: 14 }} />
        <div style={{ background: `url(${imgs[3]}) center / cover no-repeat var(--neutral-100)`, borderRadius: 14, position: "relative" }}>
          <button style={{
            position: "absolute", inset: 0, appearance: "none", cursor: "pointer",
            background: "rgba(15,18,22,0.55)", border: "none", color: "white", borderRadius: 14,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Icon name="image" size={22} strokeWidth={1.6} />
            +9 fotek
          </button>
        </div>
        <div style={{
          background: "var(--neutral-50)", border: "1px solid var(--border-soft)", borderRadius: 14,
          padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)" }}>Pokoj v číslech</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              <BigStat label="m²" value={room.size} />
              <BigStat label="hostů" value={room.capacity} />
              <BigStat label="fotek" value="12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigStat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--ink-1)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Reviews() {
  const reviews = [
    { author: "Klára M.", source: "Přímý host · květen 2026", rating: 9.6, text: "Naprosto dokonalý pokoj. Postel z péra, klid uprostřed Prahy a snídaně na úrovni michelinské restaurace. Vrátíme se." },
    { author: "Tomáš N.", source: "Přímý host · duben 2026", rating: 9.8, text: "Recepce nám pomohla s pozdním check-outem v poslední chvíli, povlečení jako z hedvábí, vana ze 70. let nádherně retro. Doporučuji všem." },
    { author: "Helena V.", source: "Přímý host · únor 2026", rating: 9.2, text: "Vrátili jsme se po roce a všechno bylo ještě lepší. Welcome drink, pozornost personálu, klidná noc s krásným ranním výhledem do zahrady." },
  ];
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 36, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
            }}>Co říkají hosté</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--ink-1)",
              margin: 0, letterSpacing: "-0.015em", lineHeight: 1.15,
            }}>9,5 / 10 — výjimečné</h2>
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-3)" }}>
            Hodnocení z <strong style={{ color: "var(--ink-1)" }}>312 rezervací</strong> přímo na našem webu.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {reviews.map((r, i) => (
            <article key={i} style={{
              background: "white", border: "1px solid var(--border)", borderRadius: 14,
              padding: "22px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--accent-dark)",
                  background: "var(--accent-tint)", padding: "4px 10px", borderRadius: 6,
                }}>{r.rating.toFixed(1)}</span>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.source}</div>
              </div>
              <p style={{ fontSize: 14.5, color: "var(--ink-1)", lineHeight: 1.6, margin: "0 0 14px" }}>
                „{r.text}"
              </p>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)" }}>— {r.author}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedRooms({ excludeId }) {
  const others = (window.ROOMS || []).filter(r => r.id !== excludeId && !r.soldOut).slice(0, 3);
  return (
    <section style={{ padding: "100px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--brand)", marginBottom: 14,
        }}>Možná se Vám zalíbí</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--ink-1)",
          margin: "0 0 28px", letterSpacing: "-0.015em",
        }}>Další pokoje v hotelu</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {others.map(r => {
            const cheapest = r.rates.length ? Math.min(...r.rates.map(rr => rr.price)) : null;
            return (
              <a key={r.id} href="#" onClick={e => e.preventDefault()} style={{
                display: "block", textDecoration: "none", background: "white",
                border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
              }}>
                <div style={{
                  aspectRatio: "4 / 3", background: `url(${r.image}) center / cover no-repeat var(--neutral-100)`,
                }} />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)", letterSpacing: "-0.005em" }}>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6, color: "var(--ink-3)", fontSize: 12.5 }}>
                    <span>{r.capacity} hostů</span>
                    <span>{r.size} m²</span>
                    <span>{r.view}</span>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>od</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-1)" }}>
                      {fmtLR(cheapest)} Kč
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Sticky booking widget — uses standalone BookingWidget component
function StickyBookWidget({ room }) {
  return <window.BookingWidget room={room} variant="floating" />;
}

function AppRoomLanding() {
  const room = window.ROOMS[0]; // Dvoulůžkový Deluxe
  const swatch = { accent: "#1F8A5B", accentDark: "#176B47", accentTint: "#E8F4EE" };
  return (
    <div style={{
      "--accent": swatch.accent, "--accent-dark": swatch.accentDark, "--accent-tint": swatch.accentTint,
      minHeight: "100vh", background: "white", fontFamily: "var(--font-ui)", color: "var(--ink-1)",
    }}>
      <MarketingNav active="rooms" />

      <div style={{ background: "var(--surface)", padding: "10px 40px", borderBottom: "1px solid var(--border-soft)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Hotel Balický</a>
          <Icon name="chevron-right" size={12} strokeWidth={2} />
          <a href="Pick-Room-Grid-View.html" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Pokoje</a>
          <Icon name="chevron-right" size={12} strokeWidth={2} />
          <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{room.name}</span>
        </div>
      </div>

      <RoomHero room={room} />
      <RoomStory room={room} />
      <GalleryStrip room={room} />

      {/* Trust strip */}
      <section style={{ padding: "80px 40px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <BestPriceGuarantee />
        </div>
      </section>

      <Reviews />
      <RelatedRooms excludeId={room.id} />

      {/* Final CTA */}
      <section style={{ padding: "100px 40px 0" }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", borderRadius: 18,
          padding: "60px 64px", color: "white",
          display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40, alignItems: "center",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", opacity: 0.85, marginBottom: 14,
            }}>Připraveni rezervovat?</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, margin: 0,
              letterSpacing: "-0.015em", lineHeight: 1.15,
            }}>
              {room.name} čeká právě na Vás.
            </h2>
            <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.6, marginTop: 14, maxWidth: 520 }}>
              Rezervací přímo na našem webu získáte garantovanou nejnižší cenu, welcome drink a body do Balický Clubu. Bez jakýchkoli rezervačních poplatků.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="Pick-Room-Grid-View.html" style={{
              appearance: "none", border: "none", cursor: "pointer",
              background: "white", color: "var(--brand)",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15,
              padding: "16px 22px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
              textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              Zkontrolovat dostupnost
              <Icon name="chevron-right" size={16} strokeWidth={2.4} />
            </a>
            <a href="#" onClick={e => e.preventDefault()} style={{
              appearance: "none", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
              background: "transparent", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14,
              padding: "13px 18px", borderRadius: 10, letterSpacing: "0.02em", textDecoration: "none",
              textAlign: "center",
            }}>Mám otázku — kontaktovat recepci</a>
          </div>
        </div>
      </section>

      <MarketingFooter />
      <StickyBookWidget room={room} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppRoomLanding />);
