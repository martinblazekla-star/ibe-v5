// LTR Multi-property — Building Detail Dialog
//
// Tabs:
//   • Pokoje    — room types (inventory preview) with monthly prices
//   • Lokalita  — description, what's around, universities, mini-map, house rules
//   • Smlouva   — contract terms, deposit, utilities, what's included, FAQ
//
// Footer CTA → "Pokračovat na výběr pokoje" navigates to LTR-Pick-Room.html?building={id}

(function () {
  const { useState: useStateLD } = React;

  function LtrMpDetailDialog({ open, building, isicMode, lengthMonths, onClose, onReserve }) {
    const [tab, setTab] = useStateLD("pokoje");
    const [imgIdx, setImgIdx] = useStateLD(0);

    React.useEffect(() => { if (open) { setTab("pokoje"); setImgIdx(0); } }, [open, building?.id]);
    if (!open || !building) return null;

    const allImages = [building.image, ...(building.secondaryImages || [])];
    const totalImages = allImages.length;

    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 250, background: "rgba(15,18,22,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "white", borderRadius: 16, width: "100%", maxWidth: 1100,
          maxHeight: "92vh", boxShadow: "0 30px 80px rgba(15,18,22,.28)",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {/* HEADER */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>
            {/* Gallery */}
            <div style={{ position: "relative", background: "var(--neutral-100)", overflow: "hidden" }}>
              {imgIdx === 0 ? (
                <window.BuildingPreview building={building} />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${allImages[imgIdx]})`,
                  backgroundSize: "cover", backgroundPosition: "center",
                }} />
              )}
              <div style={{ position: "absolute", left: 16, top: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <window.LtrMpTypeBadge type={building.type} />
                {building.buildingTags.slice(0, 1).map(t => (
                  <span key={t} style={{
                    background: "rgba(255,255,255,0.94)", color: "var(--ink-1)",
                    padding: "3px 8px", borderRadius: 4,
                    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>{t}</span>
                ))}
              </div>
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
              <button onClick={() => setImgIdx((imgIdx - 1 + totalImages) % totalImages)} style={navBtnStyle("left")}>
                <Icon name="chevron-right" size={18} strokeWidth={2.4} />
              </button>
              <button onClick={() => setImgIdx((imgIdx + 1) % totalImages)} style={navBtnStyle("right")}>
                <Icon name="chevron-right" size={18} strokeWidth={2.4} />
              </button>
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

            {/* Meta */}
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
                  textTransform: "uppercase", color: "var(--brand-dark)", marginBottom: 6,
                }}>{building.city} · {building.cityArea}</div>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, margin: 0,
                  color: "var(--ink-1)", letterSpacing: "-0.012em", lineHeight: 1.15, paddingRight: 40,
                }}>{building.name}</h2>
                <div style={{ marginTop: 10 }}>
                  <window.LtrMpRatingBlock rating={building.rating} reviews={building.reviews} size="lg" />
                </div>
              </div>

              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-3)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="map-pin" size={13} strokeWidth={1.8} />
                {building.address}
              </div>

              <window.LtrMpAvailabilityChip building={building} size="md" />

              {/* Universities */}
              <div style={{ marginTop: 4 }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 7,
                }}>Blízké univerzity</div>
                <window.LtrMpUniversityBadges buildings={building.nearbyUniversities} limit={4} size="lg" />
              </div>

              {/* Highlights */}
              <div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 7,
                }}>Co budova nabízí</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(building.highlights || []).map(h => (
                    <span key={h} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "var(--neutral-100)", color: "var(--ink-1)",
                      padding: "5px 11px", borderRadius: 999,
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12.5,
                    }}>
                      <Icon name="check" size={11} color="var(--brand)" strokeWidth={2.6} />
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
              { id: "pokoje",  label: `Dostupné pokoje (${building.unitsAvailable})` },
              { id: "lokalita", label: "Lokalita & komunita" },
              { id: "smlouva",  label: "Smlouva & cena" },
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
            {tab === "pokoje"   && <RoomsTab building={building} isicMode={isicMode} />}
            {tab === "lokalita" && <LocationTab building={building} />}
            {tab === "smlouva"  && <ContractTab building={building} isicMode={isicMode} lengthMonths={lengthMonths} />}
          </div>

          {/* FOOTER */}
          <div style={{
            borderTop: "1px solid var(--border)", padding: "14px 30px",
            background: "white", display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
          }}>
            <window.LtrMpPriceBlock building={building} isicMode={isicMode} size="lg" align="left" />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={onClose} style={{
                appearance: "none", border: "1px solid var(--border)", background: "white",
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5,
                color: "var(--ink-2)", padding: "11px 16px", borderRadius: 8, cursor: "pointer",
              }}>Zavřít</button>
              <button onClick={() => onReserve(building)} style={{
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
    const base = {
      position: "absolute", top: "50%", [side]: 14,
      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)",
      border: "none", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-1)",
      boxShadow: "0 2px 10px rgba(15,18,22,0.15)",
    };
    return side === "left"
      ? { ...base, transform: "translateY(-50%) rotate(180deg)" }
      : { ...base, transform: "translateY(-50%)" };
  }

  // ─── Pokoje tab ────────────────────────────────────────────────────────────

  function RoomsTab({ building, isicMode }) {
    return (
      <>
        <section>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8,
          }}>
            <h3 style={sectionTitle}>{(building.roomTypes || []).length} typů pokojů · {building.unitsAvailable} dostupných</h3>
            <span style={{
              fontSize: 12.5, color: "var(--ink-3)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <Icon name="info" size={13} strokeWidth={1.8} color="var(--ink-3)" />
              Ceny jsou za 1 měsíc, energie a internet už zahrnuty
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {(building.roomTypes || []).map((rt, i) => {
              const displayPrice = isicMode && building.studentPrice
                ? Math.round(rt.monthlyFrom * (building.studentPrice / building.monthlyFrom))
                : rt.monthlyFrom;
              return (
                <div key={i} style={{
                  border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px",
                  background: "white",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <div style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10,
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
                      }}>{rt.label}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                        {rt.size} m² · {rt.beds}
                      </div>
                    </div>
                    <span style={{
                      background: "var(--neutral-100)", color: "var(--ink-2)",
                      padding: "3px 8px", borderRadius: 4,
                      fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11,
                      letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{rt.count} {window.cz(rt.count, "pokoj", "pokoje", "pokojů")}</span>
                  </div>

                  <div style={{
                    marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border-soft)",
                    display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)",
                      }}>Od {isicMode ? "ISIC" : ""}</div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19,
                        color: isicMode ? "var(--brand-dark)" : "var(--ink-1)", marginTop: 2,
                      }}>
                        {window.fmtLtrmp(displayPrice)} <span style={{ fontSize: 12.5, fontWeight: 600 }}>Kč/měs.</span>
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700,
                      color: "var(--brand-dark)", letterSpacing: "0.04em", textTransform: "uppercase",
                      display: "inline-flex", alignItems: "center", gap: 3,
                    }}>
                      Vybrat
                      <Icon name="chevron-right" size={11} strokeWidth={2.4} color="var(--brand-dark)" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {building.testimonial && (
          <section style={{
            padding: "18px 22px", background: "var(--neutral-50)",
            border: "1px solid var(--border)", borderRadius: 12,
            display: "flex", gap: 16, alignItems: "flex-start",
          }}>
            <span style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--brand-tint)", color: "var(--brand-dark)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
            }}>{building.testimonial.name.split(" ").map(w => w[0]).join("")}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>
                  {building.testimonial.name}
                </div>
                <span style={{
                  fontSize: 11.5, color: "var(--brand-dark)", fontWeight: 700,
                  background: "var(--brand-tint)", padding: "2px 7px", borderRadius: 4,
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>{building.testimonial.school}</span>
              </div>
              <p style={{
                margin: "6px 0 0", fontFamily: "var(--font-ui)", fontSize: 13.5,
                color: "var(--ink-2)", lineHeight: 1.6, textWrap: "pretty",
              }}>„{building.testimonial.body}"</p>
            </div>
          </section>
        )}
      </>
    );
  }

  // ─── Lokalita tab ──────────────────────────────────────────────────────────

  function LocationTab({ building }) {
    return (
      <>
        <section>
          <h3 style={sectionTitle}>O budově</h3>
          <p style={{
            fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-2)",
            lineHeight: 1.7, margin: 0, textWrap: "pretty",
          }}>{building.description}</p>
          <div style={{
            display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap",
            fontSize: 12.5, color: "var(--ink-3)",
          }}>
            <span><strong style={{ color: "var(--ink-1)" }}>Postaveno:</strong> {building.yearBuilt}</span>
            <span><strong style={{ color: "var(--ink-1)" }}>Pater:</strong> {building.floors}</span>
            <span><strong style={{ color: "var(--ink-1)" }}>Celkem pokojů:</strong> {building.totalUnits}</span>
          </div>
        </section>

        <section style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "stretch",
        }}>
          {/* Universities + amenities */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <h3 style={sectionTitle}>Univerzity v okolí</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(building.nearbyUniversities || []).map((entry, i) => {
                  const uni = window.ltrmpUniversityById(entry.id);
                  if (!uni) return null;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                      border: "1px solid var(--border)", borderRadius: 10, background: "white",
                    }}>
                      <span style={{
                        background: "var(--brand)", color: "white",
                        padding: "4px 10px", borderRadius: 6,
                        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13,
                        letterSpacing: "0.04em", flex: "0 0 auto",
                      }}>{uni.short}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>
                          {uni.name}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
                          {uni.city}
                        </div>
                      </div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
                        color: "var(--brand-dark)",
                      }}>
                        <Icon name={entry.walkMin != null ? "walk" : "tram"} size={14} color="var(--brand-dark)" strokeWidth={2} />
                        {window.ltrmpProximityLabel(entry)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 style={sectionTitle}>Vybavení budovy</h3>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px",
              }}>
                {(building.amenities || []).map(id => {
                  const a = window.LTRMP_AMENITY_LIST.find(x => x.id === id);
                  if (!a) return null;
                  return (
                    <div key={id} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-1)",
                    }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, background: "var(--brand-tint)", color: "var(--brand-dark)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                      }}>
                        <Icon name={a.icon} size={12} strokeWidth={2} />
                      </span>
                      {a.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mini map + house rules */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <h3 style={sectionTitle}>Mapa lokality</h3>
              <MiniMap building={building} />
            </div>
            <div>
              <h3 style={sectionTitle}>Domovní řád</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {(building.houseRules || []).map((r, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-2)",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", flex: "0 0 auto",
                    }} />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  function MiniMap({ building }) {
    return (
      <div style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--border)", minHeight: 180,
        background: "linear-gradient(135deg, #EFF3EE 0%, #E3EBE0 100%)",
      }}>
        <svg viewBox="0 0 400 240" preserveAspectRatio="none"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id={`streets-${building.id}`} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M0 24 L48 24" stroke="#C5D2BD" strokeWidth="1.2" />
              <path d="M24 0 L24 48" stroke="#C5D2BD" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="400" height="240" fill={`url(#streets-${building.id})`} />
          {/* River/road arc */}
          <path d="M-20 140 Q 80 100 200 130 T 420 90" stroke="#BFD6E0" strokeWidth="14" fill="none" opacity="0.6" />
          <ellipse cx="290" cy="180" rx="58" ry="28" fill="#C9DBC0" opacity="0.8" />
        </svg>

        {/* University pins */}
        {(building.nearbyUniversities || []).slice(0, 3).map((entry, i) => {
          const angles = [50, 280, 130];
          const dists = [115, 85, 95];
          const cx = 200 + Math.cos(angles[i] * Math.PI / 180) * dists[i];
          const cy = 120 + Math.sin(angles[i] * Math.PI / 180) * dists[i];
          const uni = window.ltrmpUniversityById(entry.id);
          return (
            <div key={i} style={{
              position: "absolute", left: `${(cx / 400) * 100}%`, top: `${(cy / 240) * 100}%`,
              transform: "translate(-50%, -50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              <span style={{
                background: "white", color: "var(--brand-dark)",
                padding: "3px 8px", borderRadius: 999,
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11,
                letterSpacing: "0.04em",
                boxShadow: "0 2px 6px rgba(15,18,22,0.15)",
                border: "1.5px solid var(--brand)",
              }}>{uni?.short || ""}</span>
            </div>
          );
        })}

        {/* Building pin (centered) */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <span style={{
            background: "var(--brand)", color: "white",
            padding: "5px 12px", borderRadius: 999,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
            boxShadow: "0 4px 14px rgba(31,138,91,0.35)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="map-pin" size={12} strokeWidth={2.2} />
            Budova
          </span>
        </div>

        <div style={{
          position: "absolute", left: 12, bottom: 12, right: 12,
          background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "8px 11px",
          fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-2)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="navigation" size={13} strokeWidth={1.8} color="var(--brand-dark)" />
          <span style={{ flex: 1 }}>{building.address}</span>
        </div>
      </div>
    );
  }

  // ─── Smlouva tab ───────────────────────────────────────────────────────────

  function ContractTab({ building, isicMode, lengthMonths }) {
    const monthly = isicMode && building.studentPrice ? building.studentPrice : building.monthlyFrom;
    const deposit = monthly * building.depositMonths;
    const utilities = building.utilities === "estimate" ? (building.utilitiesCost || 0) : 0;
    const length = lengthMonths || 9;

    const monthlyAll = monthly + utilities;
    const total = monthlyAll * length;
    const upfront = monthly + deposit + building.bookingFee;

    return (
      <>
        <section style={{
          display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22, alignItems: "stretch",
        }}>
          {/* What's included */}
          <div>
            <h3 style={sectionTitle}>Co je v ceně nájmu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { in: true,  label: "Plně zařízený pokoj (postel, stůl, skříň)" },
                { in: true,  label: "WiFi 1 Gbps" },
                { in: building.utilities === "included", label: "Energie, voda, topení" },
                { in: (building.amenities || []).includes("study-room"), label: "Studovna 24/7" },
                { in: (building.amenities || []).includes("gym"),        label: "Posilovna v budově" },
                { in: (building.amenities || []).includes("laundry"),    label: "Prádelna" },
                { in: (building.amenities || []).includes("kitchen-shared"), label: "Sdílená kuchyně" },
                { in: (building.amenities || []).includes("events"),     label: "Komunitní akce" },
              ].map((it, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  fontFamily: "var(--font-ui)", fontSize: 13.5,
                  color: it.in ? "var(--ink-1)" : "var(--ink-4)",
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: it.in ? "var(--brand-tint)" : "var(--neutral-100)",
                    color: it.in ? "var(--brand-dark)" : "var(--ink-4)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                  }}>
                    <Icon name={it.in ? "check" : "x"} size={12} strokeWidth={2.4} />
                  </span>
                  <span style={{ fontWeight: it.in ? 600 : 500, textDecoration: it.in ? "none" : "line-through" }}>
                    {it.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: "12px 14px",
              background: "var(--brand-tint)", borderRadius: 10,
              fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--brand-dark)",
              lineHeight: 1.55,
            }}>
              <strong style={{ fontWeight: 700 }}>Žádné skryté poplatky:</strong> {building.utilities === "included"
                ? "energie, voda, topení i internet jsou už součástí nájmu — neřešíš sám."
                : `energie odhadované na ~${window.fmtLtrmp(building.utilitiesCost)} Kč/měs. Účtujeme přesně podle reálné spotřeby.`}
            </div>
          </div>

          {/* Estimate card */}
          <div style={{
            background: "var(--neutral-50)", border: "1px solid var(--border)", borderRadius: 12,
            padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--ink-3)",
            }}>Odhad nákladů na {length} {window.cz(length, "měsíc", "měsíce", "měsíců")}</div>

            <SumRow label={isicMode ? "Studentský nájem / měs." : "Nájem / měs."} value={`${window.fmtLtrmp(monthly)} Kč`} />
            {utilities > 0 && (
              <SumRow label="Energie odhad / měs." value={`+ ${window.fmtLtrmp(utilities)} Kč`} />
            )}
            <SumRow label="Měsíční náklady celkem" value={`${window.fmtLtrmp(monthlyAll)} Kč`} bold />
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />
            <SumRow label={`Po dobu ${length} ${window.cz(length, "měsíce", "měsíců", "měsíců")}`} value={`${window.fmtLtrmp(total)} Kč`} bold large />

            <div style={{
              marginTop: 8, padding: "11px 13px",
              background: "white", borderRadius: 10, border: "1px solid var(--border-soft)",
            }}>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6,
              }}>K zaplacení při podpisu smlouvy</div>
              <SumRow label="1. měsíční nájem" value={`${window.fmtLtrmp(monthly)} Kč`} small />
              <SumRow label={`Kauce (${building.depositMonths}× nájem, vratná)`} value={`${window.fmtLtrmp(deposit)} Kč`} small />
              <SumRow label="Rezervační poplatek" value={`${window.fmtLtrmp(building.bookingFee)} Kč`} small />
              <hr style={{ border: "none", borderTop: "1px solid var(--border-soft)", margin: "8px 0" }} />
              <SumRow label="Celkem teď" value={`${window.fmtLtrmp(upfront)} Kč`} bold />
            </div>
          </div>
        </section>

        {/* Contract terms */}
        <section>
          <h3 style={sectionTitle}>Podmínky smlouvy</h3>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
          }}>
            {[
              { lbl: "Délka nájmu",       val: `${building.minMonths}–${building.maxMonths} měsíců` },
              { lbl: "Výpověď",           val: "1 měsíc předem" },
              { lbl: "Kauce",             val: `${building.depositMonths}× měsíční nájem (vratná)` },
              { lbl: "Smlouva v jazyce",  val: "Česky + Anglicky" },
              { lbl: "Platba",            val: "Bankovní převod, 1× měsíčně" },
              { lbl: "Možnost prodloužit", val: "Ano, automaticky o 12 měsíců" },
            ].map((it, i) => (
              <div key={i} style={{
                padding: "11px 14px", border: "1px solid var(--border)", borderRadius: 10, background: "white",
              }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--ink-3)",
                }}>{it.lbl}</div>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)", marginTop: 2,
                }}>{it.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 style={sectionTitle}>Časté dotazy</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { q: "Můžu se nastěhovat dřív?", a: "Ano, pokud je pokoj volný. Ozvi se nám a domluvíme — zaplatíš jen poměrnou částku za první kratší měsíc." },
              { q: "Co když dostanu jiné Erasmus místo?", a: "Můžeš zrušit smlouvu zdarma do 30 dnů od přidělení Erasmus místa, max. však do 60 dnů před nastěhováním." },
              { q: "Jak se uplatňuje ISIC sleva?", a: "Při rezervaci nahraješ scan platného ISIC. Sleva se promítne automaticky do měsíčního nájmu." },
              { q: "Můžu si přivést mazlíčka?", a: (building.buildingTags || []).includes("Pet friendly") ? "Ano, mazlíček je vítán — registruj ho při check-inu, pojistka stojí 300 Kč/měs." : "V této budově ne. Najdi prosím budovu s tagem ‚Pet friendly'." },
              { q: "Co se stane s kaucí po skončení nájmu?", a: "Kauci vracíme do 14 dnů po check-outu, pokud nedošlo k poškození pokoje. Provádíme společnou prohlídku." },
            ].map((it, i) => <FaqRow key={i} {...it} />)}
          </div>
        </section>
      </>
    );
  }

  function FaqRow({ q, a }) {
    const [open, setOpen] = useStateLD(false);
    return (
      <div style={{
        border: "1px solid var(--border)", borderRadius: 10, background: "white",
        overflow: "hidden",
      }}>
        <button onClick={() => setOpen(!open)} style={{
          appearance: "none", border: "none", background: "transparent", cursor: "pointer", width: "100%",
          textAlign: "left", padding: "12px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13.5, color: "var(--ink-1)",
        }}>
          {q}
          <Icon name={open ? "chevron-up" : "chevron-down"} size={14} strokeWidth={2.2} color="var(--ink-3)" />
        </button>
        {open && (
          <div style={{
            padding: "0 14px 12px", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6,
          }}>{a}</div>
        )}
      </div>
    );
  }

  function SumRow({ label, value, bold, small, large }) {
    return (
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span style={{
          fontFamily: "var(--font-ui)",
          fontSize: small ? 12.5 : 13.5,
          fontWeight: bold ? 700 : 500,
          color: bold ? "var(--ink-1)" : "var(--ink-2)",
        }}>{label}</span>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: large ? 20 : small ? 13 : 14,
          fontWeight: bold ? 800 : 700,
          color: large ? "var(--brand-dark)" : "var(--ink-1)",
          letterSpacing: "-0.005em",
        }}>{value}</span>
      </div>
    );
  }

  const sectionTitle = {
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
    color: "var(--ink-1)", margin: "0 0 10px",
  };

  window.LtrMpDetailDialog = LtrMpDetailDialog;
})();
