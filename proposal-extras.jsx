// Variant comparison view + decline / share / chatbot dialogs

// ─────────────────────────────────────────────────────────────
// VariantComparison — shown when scenario has multiple variants
function VariantComparison({ scenario, onPick }) {
  const variants = scenario.variants;
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
      {/* Intro */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
          background: "color-mix(in oklch, var(--brand) 8%, white)", color: "var(--brand)",
          borderRadius: 999, fontFamily: "var(--font-ui)", fontSize: 11.5, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <Icon name="sparkle" size={11} strokeWidth={2.2} />
          Vyberte variantu
        </div>
        <h1 style={{
          margin: "14px 0 8px",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30,
          color: "var(--ink-1)", letterSpacing: "-0.015em", lineHeight: 1.15,
        }}>{scenario.title}</h1>
        <div style={{ fontSize: 14.5, color: "var(--ink-2)", maxWidth: 640, margin: "0 auto" }}>
          Připravili jsme {variants.length} varianty této nabídky. Vyberte tu, která vám sedí — detail najdete na další stránce.
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${variants.length}, minmax(0, 1fr))`,
        gap: 18, alignItems: "stretch",
      }}>
        {variants.map((v) => {
          const totals = window.proposalTotals(v.items);
          return (
            <article key={v.id} style={{
              position: "relative",
              background: "white",
              border: v.recommended ? "2px solid var(--brand)" : "1px solid var(--border)",
              borderRadius: 14, overflow: "hidden",
              boxShadow: v.recommended ? "0 12px 32px rgba(85,1,115,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column",
              transform: v.recommended ? "translateY(-6px)" : "none",
            }}>
              {v.recommended && (
                <div style={{
                  background: "var(--brand)", color: "white",
                  padding: "8px 16px", textAlign: "center",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11.5,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Icon name="sparkle" size={12} strokeWidth={2.4} />
                  Doporučená varianta
                </div>
              )}
              <div style={{ padding: "22px 22px 18px" }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)",
                }}>Varianta</div>
                <h2 style={{
                  margin: "4px 0 4px",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
                  color: "var(--ink-1)", letterSpacing: "-0.01em",
                }}>{v.name}</h2>
                <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {v.sub}
                </div>

                <div style={{
                  margin: "16px 0 14px",
                  padding: "12px 14px", background: "var(--neutral-50)",
                  borderRadius: 10, border: "1px solid var(--border-soft)",
                }}>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                    Celkem s DPH
                  </div>
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 6, marginTop: 2,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--ink-1)",
                      letterSpacing: "-0.015em",
                    }}>{window.fmtProposal(totals.gross)} Kč</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                    Bez DPH: {window.fmtProposal(totals.net)} Kč · DPH {window.fmtProposal(totals.vat)} Kč
                  </div>
                </div>

                <ul style={{ listStyle: "none", margin: "0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                  {v.highlights.map((h, i) => (
                    <li key={i} style={{
                      display: "grid", gridTemplateColumns: "16px 1fr", gap: 8, alignItems: "flex-start",
                      fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.4,
                    }}>
                      <Icon name="check" size={14} strokeWidth={2.6} color="var(--accent)" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div style={{
                  padding: "10px 12px", background: "white", border: "1px dashed var(--border)",
                  borderRadius: 8, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5,
                }}>
                  <strong style={{ color: "var(--ink-1)" }}>Záloha {window.fmtProposal(v.deposit)} Kč</strong>{" "}
                  · {v.cancellation}
                </div>
              </div>
              <div style={{
                marginTop: "auto", padding: "16px 22px 22px",
                borderTop: "1px solid var(--border-soft)",
              }}>
                <button onClick={() => onPick(v)} style={{
                  appearance: "none", cursor: "pointer", border: "none", width: "100%",
                  background: v.recommended ? "var(--brand)" : "white",
                  color: v.recommended ? "white" : "var(--brand)",
                  border: v.recommended ? "none" : "1.5px solid var(--brand)",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                  padding: "12px 18px", borderRadius: 10, letterSpacing: "0.02em",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  Vybrat tuto variantu
                  <Icon name="chevron-right" size={14} strokeWidth={2.4} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div style={{
        marginTop: 28, padding: "16px 20px", background: "white",
        border: "1px solid var(--border)", borderRadius: 12,
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
      }}>
        <Icon name="info" size={20} strokeWidth={1.8} color="var(--ink-3)" />
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
            Nemůžete se rozhodnout?
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2 }}>
            Domluvte si call s naší specialistkou — provede vás každou variantou a doporučí, co dává smysl pro váš termín.
          </div>
        </div>
        <button style={{
          appearance: "none", cursor: "pointer",
          border: "1px solid var(--border)", background: "white", color: "var(--ink-1)",
          fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "10px 18px", borderRadius: 8,
        }}>Domluvit 15min call</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DeclineDialog
function DeclineDialog({ open, onClose, onSubmit }) {
  const [reason, setReason] = React.useState(null);
  const [note, setNote] = React.useState("");
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 520,
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid var(--border-soft)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <h3 style={{
              margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-1)",
            }}>Odmítnout nabídku</h3>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
              Pomozte nám zlepšit naše budoucí nabídky.
            </div>
          </div>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={16} strokeWidth={2.2} /></button>
        </div>
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10,
          }}>Důvod odmítnutí</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {window.PROPOSAL_DECLINE_REASONS.map((r) => {
              const on = reason === r.id;
              return (
                <button key={r.id} onClick={() => setReason(r.id)} style={{
                  appearance: "none", cursor: "pointer", textAlign: "left",
                  border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                  background: on ? "color-mix(in oklch, var(--brand) 4%, white)" : "white",
                  color: on ? "var(--brand)" : "var(--ink-1)",
                  fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 600, fontSize: 13.5,
                  padding: "10px 14px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: `1.5px solid ${on ? "var(--brand)" : "var(--border)"}`,
                    background: on ? "var(--brand)" : "white", position: "relative", flexShrink: 0,
                  }}>{on && <span style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "white" }} />}</span>
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: "8px 24px 16px" }}>
          <div style={{
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6,
          }}>Doplňující informace (volitelně)</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Co bychom mohli příště udělat jinak?"
            style={{
              width: "100%", minHeight: 80, padding: "10px 12px", border: "1px solid var(--border)",
              borderRadius: 8, fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-1)",
              resize: "vertical", outline: "none",
            }}
          />
        </div>
        <div style={{
          padding: "14px 24px", background: "var(--neutral-50)", borderTop: "1px solid var(--border-soft)",
          display: "flex", justifyContent: "flex-end", gap: 8,
        }}>
          <button onClick={onClose} style={{
            appearance: "none", cursor: "pointer", border: "1px solid var(--border)", background: "white",
            color: "var(--ink-1)", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
            padding: "9px 16px", borderRadius: 6,
          }}>Zpět k nabídce</button>
          <button onClick={() => onSubmit({ reason, note })} disabled={!reason} style={{
            appearance: "none", cursor: reason ? "pointer" : "not-allowed",
            border: "none", background: reason ? "#B42318" : "color-mix(in oklch, #B42318 40%, var(--neutral-100))",
            color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
            padding: "10px 18px", borderRadius: 6, letterSpacing: "0.02em",
            opacity: reason ? 1 : 0.7,
          }}>Odeslat odmítnutí</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ShareDialog — QR + URL
function ShareDialog({ open, onClose, scenario }) {
  const [copied, setCopied] = React.useState(false);
  if (!open) return null;
  const url = `https://booking.${scenario.hotel.name.toLowerCase().replace(/\s+/g, "")}.cz/p/${scenario.proposalNumber}`;
  const handleCopy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,18,22,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 14, width: "100%", maxWidth: 460,
        boxShadow: "0 30px 80px rgba(15,18,22,.25)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid var(--border-soft)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-1)" }}>
            Sdílet nabídku
          </h3>
          <button onClick={onClose} aria-label="Zavřít" style={{
            appearance: "none", border: "none", background: "var(--neutral-100)", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)",
          }}><Icon name="x" size={16} strokeWidth={2.2} /></button>
        </div>
        <div style={{ padding: "22px 22px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {/* QR code (SVG-rendered fake pattern) */}
          <div style={{
            width: 180, height: 180, padding: 10, background: "white",
            border: "1px solid var(--border)", borderRadius: 12,
          }}>
            <FakeQR seed={scenario.proposalNumber} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>
              Naskenujte QR kód mobilem
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
              Nebo zkopírujte odkaz a sdílejte ho e-mailem.
            </div>
          </div>
        </div>
        <div style={{
          padding: "14px 22px 18px", display: "flex", gap: 8, alignItems: "center",
          borderTop: "1px solid var(--border-soft)",
        }}>
          <div style={{
            flex: 1, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 6,
            fontSize: 12, color: "var(--ink-2)", fontFamily: "ui-monospace, SF Mono, Menlo, monospace",
            background: "var(--neutral-50)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{url}</div>
          <button onClick={handleCopy} style={{
            appearance: "none", cursor: "pointer", border: "none",
            background: copied ? "var(--accent)" : "var(--brand)", color: "white",
            fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
            padding: "10px 14px", borderRadius: 6, letterSpacing: "0.02em",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            {copied ? <><Icon name="check" size={13} strokeWidth={2.6} /> Zkopírováno</> : "Kopírovat"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Faux QR-code pattern — deterministic from seed string
function FakeQR({ seed }) {
  const grid = React.useMemo(() => {
    const size = 17;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const cells = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        h = (h * 1103515245 + 12345) >>> 0;
        cells.push((h >>> 16) & 1);
      }
      // Force the 3 corner squares to be solid
    }
    const setCell = (x, y, v) => { cells[y * size + x] = v; };
    const drawCorner = (cx, cy) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const onEdge = x === 0 || y === 0 || x === 6 || y === 6;
        const inCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        setCell(cx + x, cy + y, onEdge || inCore ? 1 : 0);
      }
    };
    drawCorner(0, 0);
    drawCorner(size - 7, 0);
    drawCorner(0, size - 7);
    return { cells, size };
  }, [seed]);
  return (
    <svg viewBox={`0 0 ${grid.size} ${grid.size}`} style={{ width: "100%", height: "100%", display: "block" }}>
      {grid.cells.map((v, i) => v ? (
        <rect key={i}
          x={i % grid.size} y={Math.floor(i / grid.size)}
          width="1" height="1" fill="var(--ink-1)" />
      ) : null)}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Chatbot widget — floating bottom-right with conversation
function ChatbotWidget({ scenario }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: "bot", text: `Ahoj, jsem asistent ${scenario.hotel.name}. Vidím, že si prohlížíte nabídku #${scenario.proposalNumber}. Můžu se na něco zeptat?` },
  ]);
  const [input, setInput] = React.useState("");

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: "Děkuji za dotaz — odpověď připravuji a propojuji vás s naší specialistkou. Mezitím můžete kliknout na 'Domluvit call' nahoře." }]);
    }, 700);
  };

  const suggestions = [
    "Jak je to s parkováním?",
    "Lze přidat další noc?",
    "Co je v ceně?",
    "Chci mluvit s živou osobou",
  ];

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", right: 24, bottom: 96, zIndex: 99,
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--brand)", color: "white", border: "none", cursor: "pointer",
        boxShadow: "0 10px 30px rgba(85,1,115,0.4)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }} aria-label="Chatbot">
        {open
          ? <Icon name="x" size={22} strokeWidth={2.2} />
          : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>}
      </button>
      {open && (
        <div style={{
          position: "fixed", right: 24, bottom: 164, zIndex: 99,
          width: 360, height: 480, borderRadius: 14, background: "white",
          boxShadow: "0 20px 60px rgba(15,18,22,.25)", border: "1px solid var(--border)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 18px", background: "var(--brand)", color: "white",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="sparkle" size={16} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>
                Asistent {scenario.hotel.name}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 1 }}>
                Zná detail vaší nabídky · obvykle odpoví do 2 minut
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: "var(--neutral-50)" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: m.role === "user" ? "var(--brand)" : "white",
                color: m.role === "user" ? "white" : "var(--ink-1)",
                padding: "9px 13px", borderRadius: 12,
                fontSize: 13.5, lineHeight: 1.45,
                border: m.role === "bot" ? "1px solid var(--border-soft)" : "none",
              }}>{m.text}</div>
            ))}
            {messages.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} style={{
                    appearance: "none", cursor: "pointer", background: "white",
                    border: "1px solid var(--border)", borderRadius: 999,
                    padding: "6px 10px", fontSize: 12, color: "var(--ink-1)",
                    fontFamily: "var(--font-ui)",
                  }}>{s}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} style={{
            display: "flex", gap: 6, padding: "12px 14px", borderTop: "1px solid var(--border-soft)", background: "white",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Zeptejte se na cokoli k nabídce…"
              style={{
                flex: 1, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8,
                fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--ink-1)", outline: "none",
              }}
            />
            <button type="submit" style={{
              appearance: "none", cursor: "pointer", border: "none",
              background: "var(--brand)", color: "white",
              fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5,
              padding: "8px 14px", borderRadius: 8,
            }}>Odeslat</button>
          </form>
        </div>
      )}
    </>
  );
}

Object.assign(window, { VariantComparison, DeclineDialog, ShareDialog, ChatbotWidget });
