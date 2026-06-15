// Multi-property mode — LTR (Long-Term Rental) shared chrome
//
// Components:
//   • LtrMpNav            — nav with collection-level identity (Balický Living)
//   • LtrMpHero           — trust strip + collection intro
//   • LtrMpSearchBar      — Město + Nastěhování + Délka + Student / Erasmus toggle
//   • LtrMpResultsHeader  — count + filter + view switch + sort
//   • LtrMpViewSwitcher   — Karty ↔ Mapa
//   • LtrMpFiltersButton  — opens filter dialog
//   • LtrMpFiltersDialog  — full filter modal
//   • LtrMpPriceBlock     — monthly + deposit + student price
//   • LtrMpRatingBlock    — score + reviews
//   • LtrMpUniversityBadges — list of nearby universities with proximity
//   • LtrMpAmenityRow     — building amenity chips
//   • LtrMpTypeBadge      — type label
//   • LtrMpAvailabilityChip — "Volné od X · N pokojů"
//   • LtrMpFooter

(function () {
  const { useState: useStateLM } = React;

  // ──────────────────────────────────────────────────────────────────────────
  //  Nav
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpNav({ active = "bydleni" }) {
    const items = [
      { id: "bydleni",    label: "Bydlení",          href: "LTR-Multi-Property-Cards.html" },
      { id: "univerzity", label: "Univerzitní města", href: "#" },
      { id: "erasmus",    label: "Erasmus zóna",      href: "#" },
      { id: "jak",        label: "Jak to funguje",   href: "#" },
      { id: "kontakt",    label: "Kontakt",          href: "#" },
    ];
    const [openMenu, setOpenMenu] = useStateLM(null);
    const [lcValue, setLcValue]   = useStateLM({ lang: "cs", currency: "CZK" });
    const user = window.__loyaltyUser;

    return (
      <nav style={{
        height: 64, background: "white", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", padding: "0 32px", gap: 24,
      }}>
        <a href="LTR-Multi-Property-Cards.html" style={{
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
            }}>Living</span>
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 16 }}>
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
          {/* Saved building counter */}
          <button style={{
            appearance: "none", background: "white", border: "1px solid var(--border)",
            borderRadius: 6, padding: "7px 12px", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--ink-1)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="heart" size={14} color="var(--ink-2)" strokeWidth={1.8} />
            Uložené (3)
          </button>

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

          <button style={{
            appearance: "none", background: "var(--brand)", color: "white",
            border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.02em",
          }}>
            <Icon name="person" size={14} strokeWidth={2} />
            Přihlásit
          </button>
        </div>
      </nav>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Hero — student-aware intro band
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpHero({ buildingsCount, citiesCount }) {
    return (
      <div style={{
        background: "color-mix(in oklch, var(--brand) 6%, white)",
        borderBottom: "1px solid color-mix(in oklch, var(--brand) 14%, white)",
      }}>
        <div style={{
          maxWidth: 1380, margin: "0 auto", padding: "26px 36px 24px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 30, flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 0, maxWidth: 640 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--brand)", marginBottom: 6,
              display: "inline-flex", alignItems: "center", gap: 7,
            }}>
              <Icon name="book" size={12} color="var(--brand)" strokeWidth={2.2} />
              Balický Living · Studentské bydlení v ČR
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30,
              color: "var(--ink-1)", margin: 0, letterSpacing: "-0.012em", lineHeight: 1.18,
            }}>
              Studentské bydlení v {citiesCount} univerzitních městech ČR.
            </h1>
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: 14.5, color: "var(--ink-2)",
              margin: "10px 0 0", maxWidth: 620, lineHeight: 1.55,
            }}>
              Vyber kdy se chceš nastěhovat a na jak dlouho. Energie a internet už zahrnuty —
              žádné překvapení v zimě. Smlouva v angličtině pro Erasmus.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { icon: "check",  lbl: "Bez agentury",        sub: "0 % provize" },
              { icon: "check",  lbl: "Vše v ceně",          sub: "energie, internet, voda" },
              { icon: "check",  lbl: "ISIC sleva",          sub: "až −12 % pro studenty" },
              { icon: "check",  lbl: "Smlouva v EN",        sub: "pro Erasmus & cizince" },
            ].map((b, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 10, border: "1px solid var(--border-soft)",
                padding: "10px 13px", width: 178, whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, background: "var(--brand-tint)",
                  color: "var(--brand-dark)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                }}>
                  <Icon name={b.icon} size={14} strokeWidth={2.6} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.2,
                  }}>{b.lbl}</div>
                  <div style={{
                    fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.3,
                  }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Search bar — Město + Nastěhování + Délka + Student/Erasmus toggle
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpSearchBar({ city, onCity, moveInLabel, onOpenMoveIn, lengthMonths, onLength, audience, onAudience }) {
    const [openDropdown, setOpenDropdown] = useStateLM(null);
    const [anchor, setAnchor] = useStateLM({ left: 0 });
    const barRef = React.useRef(null);

    // Measure the clicked field at click time (refs aren't reliably populated
    // during the render pass) and stash an explicit left/right offset so the
    // dropdown pins under the field that opened it. If a left-anchored panel
    // would spill past the bar's right edge, anchor it by its right edge.
    function toggleDropdown(id, el, panelW) {
      if (openDropdown === id) { setOpenDropdown(null); return; }
      const bar = barRef.current;
      if (el && bar) {
        const left = el.offsetLeft, barW = bar.offsetWidth, fw = el.offsetWidth;
        setAnchor(left + panelW > barW ? { right: Math.max(0, barW - (left + fw)) } : { left });
      } else {
        setAnchor({ left: 0 });
      }
      setOpenDropdown(id);
    }

    function Field({ id, icon, label, value, active, onClick }) {
      return (
        <button onClick={onClick} style={{
          appearance: "none", textAlign: "left",
          background: active ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
          border: "none", cursor: "pointer",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
          borderRight: "1px solid var(--border)",
          borderBottom: active ? "2px solid var(--brand)" : "2px solid transparent",
          marginBottom: active ? -2 : 0,
        }}>
          <Icon name={icon} size={18} color="var(--brand-dark)" strokeWidth={1.8} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--ink-3)",
            }}>{label}</div>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
              color: "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{value}</div>
          </div>
        </button>
      );
    }

    const cityLabel = city === "all" ? "Celá ČR" : city;
    const audienceLabels = {
      "any":      { l: "Kdokoliv",          s: "Veřejná cena" },
      "student":  { l: "Student · ISIC",    s: "Sleva pro studenty" },
      "erasmus":  { l: "Erasmus / cizinec", s: "Smlouva v EN" },
      "couple":   { l: "Pár / 2 osoby",     s: "Šíře pokojů pro 2" },
    };

    return (
      <div ref={barRef} style={{ position: "relative" }}>
        <div style={{
          background: "white", borderRadius: 12, border: "1px solid var(--border)",
          boxShadow: "0 4px 14px rgba(16,24,40,.06)",
          display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1fr 1.1fr auto", alignItems: "stretch", overflow: "hidden",
        }}>
          <Field id="city" icon="map-pin" label="Univerzitní město" value={cityLabel}
                 active={openDropdown === "city"} onClick={(e) => toggleDropdown("city", e.currentTarget, 460)} />
          <Field id="movein" icon="calendar" label="Nastěhování"     value={moveInLabel}
                 active={false} onClick={onOpenMoveIn} />

          {/* Length — numeric stepper-style field */}
          <button onClick={(e) => toggleDropdown("length", e.currentTarget, 420)} style={{
            appearance: "none", textAlign: "left",
            background: openDropdown === "length" ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
            border: "none", cursor: "pointer",
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
            borderRight: "1px solid var(--border)",
            borderBottom: openDropdown === "length" ? "2px solid var(--brand)" : "2px solid transparent",
            marginBottom: openDropdown === "length" ? -2 : 0,
          }}>
            <Icon name="size" size={18} color="var(--brand-dark)" strokeWidth={1.8} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--ink-3)",
              }}>Délka nájmu</div>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
                color: "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
              }}>{lengthMonths} {window.cz(lengthMonths, "měsíc", "měsíce", "měsíců")}</div>
            </div>
          </button>

          {/* Audience selector */}
          <button onClick={(e) => toggleDropdown("audience", e.currentTarget, 420)} style={{
            appearance: "none", textAlign: "left",
            background: openDropdown === "audience" ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
            border: "none", cursor: "pointer",
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
            borderRight: "1px solid var(--border)",
            borderBottom: openDropdown === "audience" ? "2px solid var(--brand)" : "2px solid transparent",
            marginBottom: openDropdown === "audience" ? -2 : 0,
          }}>
            <Icon name="users" size={18} color="var(--brand-dark)" strokeWidth={1.8} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--ink-3)",
              }}>Pro koho</div>
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
                color: "var(--ink-1)", lineHeight: 1.25, marginTop: 1,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{audienceLabels[audience].l}</div>
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

        {openDropdown === "city" && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={460} anchorStyle={anchor}>
            <LtrCityPicker value={city} onChange={v => { onCity(v); setOpenDropdown(null); }} />
          </window.Dropdown>
        )}
        {openDropdown === "length" && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={420} anchorStyle={anchor}>
            <LengthPicker value={lengthMonths} onChange={v => onLength(v)} onClose={() => setOpenDropdown(null)} />
          </window.Dropdown>
        )}
        {openDropdown === "audience" && (
          <window.Dropdown open onClose={() => setOpenDropdown(null)} width={420} anchorStyle={anchor}>
            <AudiencePicker value={audience} onChange={v => { onAudience(v); setOpenDropdown(null); }} />
          </window.Dropdown>
        )}
      </div>
    );
  }

  function LtrCityPicker({ value, onChange }) {
    const counts = React.useMemo(() => {
      const m = new Map();
      window.LTRMP_BUILDINGS.forEach(b => m.set(b.city, (m.get(b.city) || 0) + 1));
      return m;
    }, []);
    const cities = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return (
      <div style={{ padding: "18px 20px 14px", background: "white" }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          marginBottom: 12,
        }}>Univerzitní město</div>
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
            {window.LTRMP_BUILDINGS.length} budov
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
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{city}</span>
                <span style={{ opacity: on ? 0.8 : 0.55, fontWeight: 600, fontSize: 11.5 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function LengthPicker({ value, onChange, onClose }) {
    const presets = [
      { l: "Semestr",        m: 5,  sub: "Erasmus / 1 semestr" },
      { l: "Akademický rok", m: 9,  sub: "Sept → květen" },
      { l: "Celý rok",       m: 12, sub: "12 měsíců" },
      { l: "Více let",       m: 24, sub: "Bc. / Mgr. studium" },
    ];
    return (
      <div style={{ padding: "18px 20px 16px", background: "white" }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          marginBottom: 12,
        }}>Délka nájmu</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {presets.map(p => {
            const on = value === p.m;
            return (
              <button key={p.m} onClick={() => onChange(p.m)} style={{
                appearance: "none", cursor: "pointer", textAlign: "left",
                background: on ? "color-mix(in oklch, var(--brand) 10%, white)" : "white",
                border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
                borderRadius: 8, padding: "11px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: "var(--font-ui)",
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{p.l}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{p.sub}</div>
                </div>
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
                  color: on ? "var(--brand-dark)" : "var(--ink-2)",
                }}>{p.m} m.</span>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6,
          }}>Vlastní délka</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => onChange(Math.max(3, value - 1))} style={stepBtn}>−</button>
            <input type="number" value={value} min={3} max={36}
                   onChange={e => onChange(Math.max(3, Math.min(36, parseInt(e.target.value, 10) || 3)))}
                   style={{
                     flex: 1, border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px",
                     fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16,
                     textAlign: "center", color: "var(--ink-1)", outline: "none",
                   }} />
            <button onClick={() => onChange(Math.min(36, value + 1))} style={stepBtn}>+</button>
            <span style={{ fontSize: 13, color: "var(--ink-3)", marginLeft: 4 }}>měsíců</span>
          </div>
          <button onClick={onClose} style={{
            marginTop: 12, width: "100%",
            appearance: "none", border: "none", cursor: "pointer",
            background: "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13.5,
            padding: "10px", borderRadius: 6,
          }}>Potvrdit</button>
        </div>
      </div>
    );
  }

  const stepBtn = {
    appearance: "none", border: "1px solid var(--border)", background: "white",
    width: 32, height: 32, borderRadius: 6, cursor: "pointer",
    fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)",
  };

  function AudiencePicker({ value, onChange }) {
    const items = [
      { id: "any",     icon: "users",  l: "Kdokoliv",          s: "Veřejná cena" },
      { id: "student", icon: "book",   l: "Student · ISIC",    s: "Sleva pro studenty (až −12 %)" },
      { id: "erasmus", icon: "globe",  l: "Erasmus / cizinec", s: "Smlouva v EN, podpora s vízem" },
      { id: "couple",  icon: "users",  l: "Pár / 2 osoby",     s: "Filtrujeme pokoje pro 2" },
    ];
    return (
      <div style={{ padding: "18px 20px", background: "white" }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-1)",
          marginBottom: 12,
        }}>Pro koho hledáme</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map(it => {
            const on = value === it.id;
            return (
              <button key={it.id} onClick={() => onChange(it.id)} style={{
                appearance: "none", cursor: "pointer", textAlign: "left",
                background: on ? "color-mix(in oklch, var(--brand) 10%, white)" : "white",
                border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
                borderRadius: 8, padding: "11px 14px",
                display: "flex", alignItems: "center", gap: 12,
                fontFamily: "var(--font-ui)",
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: on ? "var(--brand-tint)" : "var(--neutral-100)",
                  color: on ? "var(--brand-dark)" : "var(--ink-2)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                }}>
                  <Icon name={it.icon} size={16} strokeWidth={2} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{it.l}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>{it.s}</div>
                </div>
                {on && <Icon name="check" size={16} color="var(--brand-dark)" strokeWidth={2.6} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Type badge
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpTypeBadge({ type, short = false }) {
    const t = window.LTRMP_TYPES.find(x => x.id === type);
    if (!t) return null;
    const colors = {
      "student-hall": { bg: "#E8F4EE", fg: "#176B47" },
      "co-living":    { bg: "#F5EBF8", fg: "#5A1576" },
      "private":      { bg: "#EEF0F4", fg: "#384058" },
    }[type];
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: colors.bg, color: colors.fg,
        padding: "3px 9px", borderRadius: 999,
        fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5,
        letterSpacing: "0.02em", whiteSpace: "nowrap",
      }}>
        <Icon name={type === "private" ? "tag" : type === "co-living" ? "users" : "book"} size={11} strokeWidth={2.0} color={colors.fg} />
        {short ? t.short : t.label}
      </span>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  University proximity badges
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpUniversityBadges({ buildings, limit = 3, size = "md" }) {
    const items = (buildings || []).slice(0, limit);
    if (!items.length) return null;
    const big = size === "lg";
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((entry, i) => {
          const uni = window.ltrmpUniversityById(entry.id);
          if (!uni) return null;
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--neutral-100)", color: "var(--ink-1)",
              padding: big ? "5px 10px" : "4px 9px", borderRadius: 999,
              fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: big ? 12.5 : 12,
              whiteSpace: "nowrap",
            }}>
              <span style={{
                background: "var(--brand-tint)", color: "var(--brand-dark)",
                padding: "1px 6px", borderRadius: 4,
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: big ? 11 : 10.5,
                letterSpacing: "0.04em",
              }}>{uni.short}</span>
              <Icon name={entry.walkMin != null ? "walk" : "tram"} size={11} color="var(--ink-3)" strokeWidth={1.8} />
              <span>{window.ltrmpProximityLabel(entry)}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Price block — monthly + deposit + ISIC discount
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpPriceBlock({ building, isicMode, size = "md", align = "right" }) {
    const big = size === "lg";
    const price = isicMode && building.studentPrice ? building.studentPrice : building.monthlyFrom;
    const showOrig = isicMode && building.studentPrice && building.studentPrice < building.monthlyFrom;
    const showStudentHint = !isicMode && building.studentPrice && building.studentPrice < building.monthlyFrom;

    return (
      <div style={{ textAlign: align, lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 10.5, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)",
        }}>
          {isicMode ? "Studentský nájem od" : "Měsíční nájem od"}
        </div>
        {showOrig && (
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--ink-3)",
            textDecoration: "line-through", marginTop: 4,
          }}>{window.fmtLtrmp(building.monthlyFrom)} Kč</div>
        )}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: big ? 26 : 22, color: isicMode ? "var(--brand-dark)" : "var(--ink-1)",
          marginTop: 2, letterSpacing: "-0.01em",
        }}>
          {window.fmtLtrmp(price)} <span style={{ fontSize: big ? 14 : 13, fontWeight: 600 }}>Kč/měs.</span>
        </div>
        <div style={{
          fontFamily: "var(--font-ui)", fontSize: 11.5, color: "var(--ink-3)", marginTop: 3,
        }}>
          + kauce {building.depositMonths}× měsíční nájem
          {building.utilities === "included" && <> · <span style={{ color: "var(--brand-dark)", fontWeight: 700 }}>energie v ceně</span></>}
          {building.utilities === "estimate" && <> · energie ~{window.fmtLtrmp(building.utilitiesCost)} Kč</>}
        </div>
        {showStudentHint && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10.5,
            color: "var(--brand-dark)", marginTop: 6,
            background: "var(--brand-tint)",
            padding: "3px 7px", borderRadius: 4, letterSpacing: "0.02em",
          }}>
            <Icon name="sparkle" size={10} strokeWidth={2.2} color="var(--brand-dark)" />
            ISIC {window.fmtLtrmp(building.studentPrice)} Kč/měs.
          </div>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Rating block
  // ──────────────────────────────────────────────────────────────────────────

  function ratingWord(s) {
    if (s >= 9.5) return "Výjimečné";
    if (s >= 9.0) return "Vynikající";
    if (s >= 8.5) return "Velmi dobré";
    if (s >= 8.0) return "Dobré";
    return "Slušné";
  }

  function LtrMpRatingBlock({ rating, reviews, size = "md" }) {
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
          }}>{window.fmtLtrmp(reviews)} {window.cz(reviews, "hodnocení", "hodnocení", "hodnocení")}</span>
        </span>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Amenity row
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpAmenityRow({ amenities, limit = 5 }) {
    const items = (amenities || []).slice(0, limit).map(a => window.LTRMP_AMENITY_LIST.find(x => x.id === a)).filter(Boolean);
    const remaining = (amenities || []).length - items.length;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px", alignItems: "center", color: "var(--ink-3)", fontSize: 12 }}>
        {items.map(it => (
          <span key={it.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <Icon name={it.icon} size={12} strokeWidth={1.8} color="var(--ink-3)" />
            {it.label}
          </span>
        ))}
        {remaining > 0 && (
          <span style={{ fontWeight: 700, color: "var(--brand)", whiteSpace: "nowrap" }}>+ {remaining} dalších</span>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Availability chip
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpAvailabilityChip({ building, size = "sm" }) {
    const big = size === "md";
    const lowAvail = building.unitsAvailable <= 5;
    const noAvail = building.unitsAvailable === 0;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: big ? "4px 10px" : "3px 8px",
          background: "var(--brand-tint)", color: "var(--brand-dark)",
          fontSize: big ? 12 : 11.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}>
          <Icon name="calendar" size={big ? 12 : 11} strokeWidth={2.2} color="var(--brand-dark)" />
          Volné od {building.moveInFrom}
        </span>
        {noAvail ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: big ? "4px 10px" : "3px 8px",
            background: "var(--danger-tint)", color: "var(--danger)",
            fontSize: big ? 12 : 11.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}>Plně obsazeno · waitlist</span>
        ) : lowAvail ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: big ? "4px 10px" : "3px 8px",
            background: "#FEF3C7", color: "#92400E",
            fontSize: big ? 12 : 11.5, fontWeight: 700, borderRadius: 4, letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}>
            <Icon name="flame" size={big ? 12 : 11} strokeWidth={2.4} color="#92400E" />
            Posledních {building.unitsAvailable} {window.cz(building.unitsAvailable, "pokoj", "pokoje", "pokojů")}
          </span>
        ) : (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: big ? "4px 10px" : "3px 8px",
            background: "var(--neutral-100)", color: "var(--ink-2)",
            fontSize: big ? 12 : 11.5, fontWeight: 600, borderRadius: 4,
            whiteSpace: "nowrap",
          }}>
            {building.unitsAvailable} z {building.totalUnits} pokojů
          </span>
        )}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: big ? "4px 10px" : "3px 8px",
          background: "var(--neutral-100)", color: "var(--ink-2)",
          fontSize: big ? 12 : 11.5, fontWeight: 600, borderRadius: 4,
          whiteSpace: "nowrap",
        }}>
          {building.minMonths}–{building.maxMonths} měsíců
        </span>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  //  Results header + filter button + view switcher
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpViewSwitcher({ current }) {
    const views = [
      { id: "cards", label: "Karty", icon: "grid",    href: "LTR-Multi-Property-Cards.html" },
      { id: "map",   label: "Mapa",  icon: "map-pin", href: "LTR-Multi-Property-Map.html" },
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

  function LtrMpResultsHeader({ count, viewId, sortValue, onSort, extra }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)", gap: 16, flexWrap: "wrap",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--ink-1)",
            margin: 0, letterSpacing: "-0.008em",
          }}>{count} {window.cz(count, "budova", "budovy", "budov")} v Balický Living</h2>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
            Vyber budovu, podívej se na dostupné pokoje, sjednej online a podepiš smlouvu.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {extra}
          <LtrMpViewSwitcher current={viewId} />
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
              <option value="price-asc">Nájem (od nejnižšího)</option>
              <option value="price-desc">Nájem (od nejvyššího)</option>
              <option value="rating">Hodnocení</option>
              <option value="distance">Nejbližší univerzitě</option>
              <option value="availability">Nejvíce volných pokojů</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  function LtrMpFiltersButton({ activeCount, onClick, label = "Filtrovat" }) {
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

  // ──────────────────────────────────────────────────────────────────────────
  //  Filters dialog
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpFiltersDialog({ open, value, onClose, onApply, onReset }) {
    const [draft, setDraft] = useStateLM(value || window.LTRMP_FILTER_DEFAULTS);
    React.useEffect(() => { if (open) setDraft(value || window.LTRMP_FILTER_DEFAULTS); }, [open]);

    const cityCounts = React.useMemo(() => {
      const m = new Map();
      window.LTRMP_BUILDINGS.forEach(b => m.set(b.city, (m.get(b.city) || 0) + 1));
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

    const active = window.countLtrmpFilters(draft);
    const cities = window.LTRMP_CITIES;

    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px",
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "white", borderRadius: 14, width: "100%", maxWidth: 760,
          boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
          display: "flex", flexDirection: "column", maxHeight: "92vh",
        }}>
          <header style={{
            padding: "18px 24px 14px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>Balický Living</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-1)", marginTop: 2 }}>Filtry</div>
            </div>
            <button onClick={onClose} aria-label="Zavřít" style={{
              appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
              width: 34, height: 34, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
            }}><Icon name="x" size={18} strokeWidth={2.2} /></button>
          </header>

          <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Toggles */}
            <FilterSection title="Status">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <FilterToggle
                  on={draft.isicOnly}
                  onClick={() => setKey("isicOnly", !draft.isicOnly)}
                  icon="book" label="Jen s ISIC slevou"
                  desc="Sleva pro studenty s platným ISIC"
                />
                <FilterToggle
                  on={draft.unitsOnly}
                  onClick={() => setKey("unitsOnly", !draft.unitsOnly)}
                  icon="check" label="Jen budovy s volnými pokoji"
                  desc="Skrýt fully booked"
                />
                <FilterToggle
                  on={draft.petFriendly}
                  onClick={() => setKey("petFriendly", !draft.petFriendly)}
                  icon="leaf" label="Pet friendly"
                  desc="Mazlíček povolen"
                />
              </div>
            </FilterSection>

            {/* Cities */}
            <FilterSection title="Univerzitní město">
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

            {/* Universities */}
            <FilterSection title="Blízko univerzity">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {window.LTRMP_UNIVERSITIES.map(u => {
                  const on = (draft.universities || []).includes(u.id);
                  const count = window.LTRMP_BUILDINGS.filter(b => (b.nearbyUniversities || []).some(n => n.id === u.id)).length;
                  if (count === 0) return null;
                  return (
                    <FilterChip key={u.id} on={on} onClick={() => toggleArr("universities", u.id)}
                      label={<><strong style={{ fontWeight: 800 }}>{u.short}</strong> {u.city}</>}
                      count={count} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Building type */}
            <FilterSection title="Typ bydlení">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {window.LTRMP_TYPES.map(t => {
                  const on = (draft.types || []).includes(t.id);
                  const count = window.LTRMP_BUILDINGS.filter(b => b.type === t.id).length;
                  return (
                    <FilterChipBig key={t.id} on={on} onClick={() => toggleArr("types", t.id)}
                      label={t.label} count={count} desc={t.desc} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Tags */}
            <FilterSection title="Komunita / atmosféra">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[...window.LTRMP_TAG_GROUPS.audience, ...window.LTRMP_TAG_GROUPS.vibe].map(t => {
                  const on = (draft.tags || []).includes(t.id);
                  const count = window.LTRMP_BUILDINGS.filter(b => (b.buildingTags || []).includes(t.id)).length;
                  if (count === 0) return null;
                  return (
                    <FilterChip key={t.id} on={on} onClick={() => toggleArr("tags", t.id)}
                      label={<><Icon name={t.icon} size={11} strokeWidth={1.8} color={on ? "white" : "var(--ink-2)"} /> {t.id}</>}
                      count={count} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Amenities */}
            <FilterSection title="Vybavení budovy">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {window.LTRMP_AMENITY_LIST.map(a => {
                  const on = (draft.amenities || []).includes(a.id);
                  const count = window.LTRMP_BUILDINGS.filter(b => (b.amenities || []).includes(a.id)).length;
                  if (count === 0) return null;
                  return (
                    <FilterChip key={a.id} on={on} onClick={() => toggleArr("amenities", a.id)}
                      label={<><Icon name={a.icon} size={11} strokeWidth={1.8} color={on ? "white" : "var(--ink-2)"} /> {a.label}</>}
                      count={count} />
                  );
                })}
              </div>
            </FilterSection>

            {/* Budget */}
            <FilterSection title="Měsíční nájem">
              <BudgetSlider value={draft.budget} onChange={(r) => setKey("budget", r)} />
            </FilterSection>
          </div>

          <footer style={{
            padding: "14px 24px", borderTop: "1px solid var(--border)", background: "var(--neutral-50)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <button onClick={() => { setDraft(window.LTRMP_FILTER_DEFAULTS); onReset && onReset(); }} style={{
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
              Zobrazit budovy
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

  function FilterChipBig({ on, onClick, label, count, desc }) {
    return (
      <button onClick={onClick} style={{
        appearance: "none", cursor: "pointer", textAlign: "left",
        background: on ? "color-mix(in oklch, var(--brand) 8%, white)" : "white",
        border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
        borderRadius: 10, padding: "10px 14px", flex: "1 1 200px",
        fontFamily: "var(--font-ui)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{label}</span>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>{count}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </button>
    );
  }

  function FilterToggle({ on, onClick, icon, label, desc }) {
    return (
      <button onClick={onClick} style={{
        appearance: "none", cursor: "pointer", textAlign: "left",
        background: on ? "color-mix(in oklch, var(--brand) 10%, white)" : "white",
        border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
        borderRadius: 10, padding: "11px 14px", flex: "1 1 200px",
        fontFamily: "var(--font-ui)",
        display: "flex", alignItems: "center", gap: 11,
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: on ? "var(--brand)" : "var(--neutral-100)",
          color: on ? "white" : "var(--ink-2)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
        }}>
          <Icon name={icon} size={15} strokeWidth={2} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>{label}</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{desc}</div>
        </div>
      </button>
    );
  }

  function BudgetSlider({ value, onChange }) {
    const { min: lo, max: hi } = window.LTRMP_BUDGET_BOUNDS;
    const cur = value || [lo, hi];
    const presets = [
      { l: "Vše", r: null },
      { l: "do 8 000",     r: [lo, 8000] },
      { l: "8 – 13 000",   r: [8000, 13000] },
      { l: "13 – 20 000",  r: [13000, 20000] },
      { l: "20 000+",      r: [20000, hi] },
    ];
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
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
          <NumberBox label="Od" value={cur[0]} min={lo} max={hi}
                     onChange={v => onChange([v, cur[1]])} />
          <span style={{ color: "var(--ink-3)", fontSize: 13 }}>—</span>
          <NumberBox label="Do" value={cur[1]} min={lo} max={hi}
                     onChange={v => onChange([cur[0], v])} />
          <span style={{ color: "var(--ink-3)", fontSize: 12.5, marginLeft: "auto" }}>Kč / měs.</span>
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

  // ──────────────────────────────────────────────────────────────────────────
  //  Footer
  // ──────────────────────────────────────────────────────────────────────────

  function LtrMpFooter() {
    return (
      <div style={{
        marginTop: 56, padding: "24px 0", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)", flexWrap: "wrap", gap: 12,
      }}>
        <div>Powered by IBE v4 · © Balický Living · Studentské bydlení v ČR</div>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Vzorová smlouva</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>FAQ pro studenty</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>ISIC podmínky</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--ink-3)", textDecoration: "none" }}>Erasmus FAQ</a>
        </div>
      </div>
    );
  }

  Object.assign(window, {
    LtrMpNav,
    LtrMpHero,
    LtrMpSearchBar,
    LtrMpResultsHeader,
    LtrMpViewSwitcher,
    LtrMpFiltersButton,
    LtrMpFiltersDialog,
    LtrMpTypeBadge,
    LtrMpUniversityBadges,
    LtrMpPriceBlock,
    LtrMpRatingBlock,
    LtrMpAmenityRow,
    LtrMpAvailabilityChip,
    LtrMpFooter,
    ltrmpRatingWord: ratingWord,
  });
})();
