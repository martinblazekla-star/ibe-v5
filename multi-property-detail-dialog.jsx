// Multi-property — Hotel detail dialog
//   Opened from hotel card / map popover. Tabs: Popis / Vybavení / Recenze.
//   Header: gallery + name + city + rating.
//   Footer: price + memberHint + Rezervovat (opens Pick Room — Table View for that hotel).

(function () {
  const { useState: useStateD } = React;

  function HotelDetailDialog({ open, hotel, memberMode, onClose, onReserve }) {
    const [tab, setTab] = useStateD("popis");
    const [imgIdx, setImgIdx] = useStateD(0);

    React.useEffect(() => { if (open) { setTab("popis"); setImgIdx(0); } }, [open, hotel?.id]);
    if (!open || !hotel) return null;

    const allImages = [hotel.image, ...(hotel.secondaryImages || [])];
    const totalImages = allImages.length;

    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 250, background: "rgba(15,18,22,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "white", borderRadius: 16, width: "100%", maxWidth: 1080,
          maxHeight: "92vh", boxShadow: "0 30px 80px rgba(15,18,22,.28)",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {/* HEADER (gallery + meta) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>
            {/* Gallery side */}
            <div style={{ position: "relative", background: "var(--neutral-100)" }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${allImages[imgIdx]})`,
                backgroundSize: "cover", backgroundPosition: "center",
              }} />
              {/* type + badge */}
              <div style={{ position: "absolute", left: 16, top: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <window.MpHotelTypeBadge type={hotel.type} />
                <window.MpHotelBadges badges={hotel.badges} discountPct={hotel.discountPct} />
              </div>
              {/* image counter */}
              <div style={{
                position: "absolute", right: 16, top: 16,
                background: "rgba(15,18,22,0.6)", color: "white",
                padding: "4px 10px", borderRadius: 999,
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="image" size={12} strokeWidth={1.8} />
                {imgIdx + 1} / {totalImages}
              </div>
              {/* arrows */}
              <button onClick={() => setImgIdx((imgIdx - 1 + totalImages) % totalImages)} style={navBtnStyle("left")}>
                <Icon name="chevron-right" size={18} strokeWidth={2.4} />
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % totalImages)} style={navBtnStyle("right")}>
                <Icon name="chevron-right" size={18} strokeWidth={2.4} />
              </button>
              {/* thumbnail dots */}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 14,
                display: "flex", justifyContent: "center", gap: 5,
              }}>
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: i === imgIdx ? 22 : 7, height: 7, borderRadius: 999, border: "none", cursor: "pointer",
                    background: i === imgIdx ? "white" : "rgba(255,255,255,0.55)",
                    transition: "all 0.18s",
                  }} />
                ))}
              </div>
            </div>

            {/* Meta side */}
            <div style={{ padding: "26px 30px 22px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
              <button onClick={onClose} aria-label="Zavřít" style={{
                position: "absolute", top: 18, right: 18, width: 34, height: 34, borderRadius: 8,
                background: "var(--neutral-100)", color: "var(--ink-2)", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="x" size={18} strokeWidth={2.2} />
              </button>

              <div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--brand)", marginBottom: 6,
                }}>{hotel.city} · {hotel.cityArea}</div>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, margin: 0,
                  color: "var(--ink-1)", letterSpacing: "-0.012em", lineHeight: 1.15, paddingRight: 40,
                }}>{hotel.name}</h2>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <window.MpStarRow count={hotel.stars} size={13} />
                  <span style={{ color: "var(--ink-3)", fontSize: 13 }}>·</span>
                  <window.MpRatingBlock rating={hotel.rating} reviews={hotel.reviews} size="lg" />
                </div>
              </div>

              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="map-pin" size={13} strokeWidth={1.8} />
                {hotel.address}
              </div>

              {/* Mini availability strip */}
              <div style={{
                marginTop: 4, padding: "12px 14px", borderRadius: 10,
                background: "color-mix(in oklch, var(--accent) 6%, white)",
                border: "1px solid color-mix(in oklch, var(--accent) 22%, white)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--accent)", color: "white",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="check" size={14} strokeWidth={2.6} />
                </span>
                <div style={{ fontSize: 13, color: "var(--accent-dark)", lineHeight: 1.35 }}>
                  <strong style={{ fontWeight: 700 }}>{hotel.roomsAvailable} {window.cz(hotel.roomsAvailable, "pokoj dostupný", "pokoje dostupné", "pokojů dostupných")}</strong>{" "}
                  ve Vašem termínu · Pá 15. 5. – Ne 17. 5. (2 noci)
                </div>
              </div>

              {/* Highlights */}
              <div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 7,
                }}>Co hotel nabízí</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(hotel.highlights || []).map(h => (
                    <span key={h} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "var(--neutral-100)", color: "var(--ink-1)",
                      padding: "5px 11px", borderRadius: 999,
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
                    }}>
                      <Icon name="check" size={11} color="var(--accent)" strokeWidth={2.6} />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{
            display: "flex", padding: "0 30px", gap: 4,
            borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            background: "var(--neutral-50)",
          }}>
            {[
              { id: "popis",   label: "Popis & lokalita" },
              { id: "vybaveni", label: `Vybavení (${hotel.amenities.length})` },
              { id: "recenze", label: `Recenze (${window.fmtMp(hotel.reviews)})` },
            ].map(it => {
              const on = tab === it.id;
              return (
                <button key={it.id} onClick={() => setTab(it.id)} style={{
                  appearance: "none", border: "none", background: "transparent",
                  padding: "13px 14px", cursor: "pointer", position: "relative",
                  fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
                  color: on ? "var(--ink-1)" : "var(--ink-3)",
                }}>
                  {it.label}
                  {on && <span style={{
                    position: "absolute", left: 14, right: 14, bottom: -1, height: 2, background: "var(--brand)",
                  }} />}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "22px 30px 26px",
            display: "flex", flexDirection: "column", gap: 22,
          }}>
            {tab === "popis" && <PopisTab hotel={hotel} />}
            {tab === "vybaveni" && <VybaveniTab hotel={hotel} />}
            {tab === "recenze" && <RecenzeTab hotel={hotel} />}
          </div>

          {/* FOOTER — sticky CTA */}
          <div style={{
            borderTop: "1px solid var(--border)", padding: "14px 30px",
            background: "white", display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
          }}>
            <window.MpPriceBlock hotel={hotel} memberMode={memberMode} size="lg" align="left" />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={onClose} style={{
                appearance: "none", border: "1px solid var(--border)", background: "white",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
                color: "var(--ink-2)", padding: "11px 16px", borderRadius: 8, cursor: "pointer",
              }}>Zavřít detail</button>
              <button onClick={() => onReserve(hotel)} style={{
                appearance: "none", border: "none", cursor: "pointer",
                background: "var(--brand)", color: "white",
                fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14.5,
                padding: "12px 22px", borderRadius: 8, letterSpacing: "0.02em",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                Pokračovat na výběr pokoje
                <Icon name="chevron-right" size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function navBtnStyle(side) {
    return {
      position: "absolute", top: "50%", [side]: 14, transform: "translateY(-50%)",
      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)",
      border: "none", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-1)",
      boxShadow: "0 2px 10px rgba(15,18,22,0.15)",
      ...(side === "left" ? { transform: "translateY(-50%) rotate(180deg)" } : {}),
    };
  }

  // ─── Popis tab ────────────────────────────────────────────────────────────

  function PopisTab({ hotel }) {
    return (
      <>
        <section>
          <h3 style={sectionTitleStyle}>O hotelu</h3>
          <p style={{
            fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-2)",
            lineHeight: 1.7, margin: 0, textWrap: "pretty",
          }}>{hotel.description}</p>
        </section>

        <section style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 22, alignItems: "stretch",
        }}>
          <div>
            <h3 style={sectionTitleStyle}>Co je v okolí</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {(hotel.nearby || []).map((n, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, paddingLeft: 2,
                  fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-2)",
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 6, background: "var(--neutral-100)",
                    color: "var(--ink-2)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name="walk" size={14} strokeWidth={1.8} />
                  </span>
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Mini map */}
          <div>
            <h3 style={sectionTitleStyle}>Mapa lokality</h3>
            <MiniMap hotel={hotel} />
          </div>
        </section>
      </>
    );
  }

  // Mini map — stylized circle plot with the city as a pin and a few nearby points.
  function MiniMap({ hotel }) {
    // Use schematic CZ position as background reference; zoom on this hotel.
    return (
      <div style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--border)", minHeight: 200,
        background: "linear-gradient(135deg, #F5F1E8 0%, #EDE6D6 100%)",
      }}>
        {/* Background — stylised street grid */}
        <svg viewBox="0 0 400 240" preserveAspectRatio="none"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="streets" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M0 24 L48 24" stroke="#D9D2C0" strokeWidth="1.2" />
              <path d="M24 0 L24 48" stroke="#D9D2C0" strokeWidth="1.2" />
              <path d="M0 8 L48 8"   stroke="#E6E0D0" strokeWidth="0.6" />
              <path d="M0 40 L48 40" stroke="#E6E0D0" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="400" height="240" fill="url(#streets)" />
          {/* River-like arc */}
          <path d="M-20 140 Q 80 100 200 130 T 420 90" stroke="#BFD6E0" strokeWidth="14" fill="none" opacity="0.6" />
          {/* Park */}
          <ellipse cx="290" cy="180" rx="58" ry="28" fill="#D6E4CB" opacity="0.7" />
        </svg>
        {/* Hotel pin (centered) */}
        <div style={{
          position: "absolute", left: "50%", top: "48%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <span style={{
            background: "var(--brand)", color: "white",
            padding: "5px 12px", borderRadius: 999,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
            boxShadow: "0 4px 14px rgba(85,1,115,0.35)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="map-pin" size={12} strokeWidth={2.2} />
            {hotel.name.split(" ").slice(0, 2).join(" ")}
          </span>
        </div>
        {/* Address overlay */}
        <div style={{
          position: "absolute", left: 12, bottom: 12, right: 12,
          background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "8px 11px",
          fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-2)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="navigation" size={13} strokeWidth={1.8} color="var(--brand)" />
          <span style={{ flex: 1 }}>{hotel.address}</span>
          <span style={{
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
            color: "var(--brand)", letterSpacing: "0.04em", textTransform: "uppercase",
            cursor: "pointer",
          }}>Otevřít v Mapách</span>
        </div>
      </div>
    );
  }

  // ─── Vybavení tab ─────────────────────────────────────────────────────────

  function VybaveniTab({ hotel }) {
    const groups = [
      { title: "Wellness & relax",  ids: ["wellness", "spa", "pool", "fitness"] },
      { title: "Strava a nápoje",   ids: ["restaurace", "bar"] },
      { title: "Služby & komfort",  ids: ["concierge", "wifi", "parking", "pet"] },
    ];
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22 }}>
        {groups.map(g => {
          const items = g.ids.map(id => window.MP_AMENITY_LIST.find(a => a.id === id));
          return (
            <div key={g.title}>
              <h3 style={sectionTitleStyle}>{g.title}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map(a => {
                  const has = hotel.amenities.includes(a.id);
                  return (
                    <div key={a.id} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      fontFamily: "var(--font-ui)", fontSize: 13.5,
                      color: has ? "var(--ink-1)" : "var(--ink-4)",
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: has ? "var(--accent-tint)" : "var(--neutral-100)",
                        color: has ? "var(--accent-dark)" : "var(--ink-4)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon name={has ? "check" : "x"} size={12} strokeWidth={2.4} />
                      </span>
                      <span style={{ fontWeight: has ? 600 : 500, textDecoration: has ? "none" : "line-through" }}>
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── Recenze tab ──────────────────────────────────────────────────────────

  function RecenzeTab({ hotel }) {
    return (
      <>
        {/* Platform breakdown */}
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center",
          padding: "18px 22px", background: "var(--neutral-50)",
          border: "1px solid var(--border)", borderRadius: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              background: "var(--brand)", color: "white",
              padding: "10px 14px", borderRadius: 10,
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26,
              letterSpacing: "-0.02em",
            }}>{hotel.rating.toFixed(1)}</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
                {window.mpRatingWord(hotel.rating)}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                {window.fmtMp(hotel.reviews)} hodnocení napříč platformami
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {(hotel.reviewsByPlatform || []).map(p => (
              <div key={p.source} style={{
                background: "white", border: "1px solid var(--border)", borderRadius: 8,
                padding: "8px 11px", minWidth: 110,
              }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  {p.source}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>{p.score}</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>· {window.fmtMp(p.count)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <section>
          <h3 style={sectionTitleStyle}>Klíčové recenze</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(hotel.topReviews || []).map((r, i) => (
              <div key={i} style={{
                border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px",
                background: "white",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: "50%", background: "var(--brand-tint)",
                    color: "var(--brand)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                  }}>{r.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{r.date}</div>
                  </div>
                  <span style={{
                    background: "var(--brand)", color: "white",
                    padding: "3px 9px", borderRadius: 6,
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                  }}>{r.score.toFixed(1)}</span>
                </div>
                <p style={{
                  margin: 0, fontFamily: "var(--font-ui)", fontSize: 13.5,
                  color: "var(--ink-2)", lineHeight: 1.6,
                }}>{r.body}</p>
              </div>
            ))}
          </div>
          <a href="Reviews.html" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            color: "var(--brand)", textDecoration: "none",
          }}>
            Zobrazit všech {window.fmtMp(hotel.reviews)} recenzí
            <Icon name="chevron-right" size={13} strokeWidth={2.4} />
          </a>
        </section>
      </>
    );
  }

  const sectionTitleStyle = {
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
    color: "var(--ink-1)", margin: "0 0 10px",
  };

  window.HotelDetailDialog = HotelDetailDialog;
})();
