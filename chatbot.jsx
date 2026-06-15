// Marie — AI booking assistant. Sits over the Pick Room / Table view.
// Uses window.claude.complete for free-form Q&A; parses [ROOMS:…] / [RATE:…] hints
// from the response to embed structured room cards with "Přidat" actions.

const { useState: useStateAI, useEffect: useEffectAI, useRef: useRefAI, useMemo: useMemoAI } = React;

// ------------------------------------------------------------ Small SVG icons
function AIIcon({ name, size = 16, stroke = 2, color = "currentColor" }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "sparkle":
      return <svg {...p}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /><path d="M19 4l.6 1.6L21 6l-1.4.4L19 8l-.6-1.6L17 6l1.4-.4z" /></svg>;
    case "send":
      return <svg {...p}><path d="M5 12l16-8-7 18-2-7-7-3z" /></svg>;
    case "close":
      return <svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case "chevron-right":
      return <svg {...p}><polyline points="9 6 15 12 9 18" /></svg>;
    case "check":
      return <svg {...p}><polyline points="20 6 9 17 4 12" /></svg>;
    case "info":
      return <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="11" /><circle cx="12" cy="8" r="0.6" fill={color} stroke={color} /></svg>;
    case "minimize":
      return <svg {...p}><line x1="6" y1="14" x2="18" y2="14" /></svg>;
    case "refresh":
      return <svg {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><polyline points="21 3 21 8 16 8" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><polyline points="3 21 3 16 8 16" /></svg>;
    case "gift":
      return <svg {...p}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>;
    case "plus":
      return <svg {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case "arrow-right":
      return <svg {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "package":
      return <svg {...p}><path d="M16.5 9.4 7.5 4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    case "upgrade":
      return <svg {...p}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>;
    case "clock":
      return <svg {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
    case "car":
      return <svg {...p}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="15.5" r="0.5" fill={color} /><circle cx="16.5" cy="15.5" r="0.5" fill={color} /></svg>;
    case "glass":
      return <svg {...p}><path d="M8 3h8l-1 7a3 3 0 0 1-6 0z" /><line x1="12" y1="13" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" /></svg>;
    case "coffee":
      return <svg {...p}><path d="M4 9h13v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><line x1="7" y1="3" x2="7" y2="6" /><line x1="11" y1="3" x2="11" y2="6" /></svg>;
    default:
      return null;
  }
}

// ------------------------------------------------------------ Avatar
function MarieAvatar({ size = 32, glow = false }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #7C2EA0 0%, #550173 60%, #3F0156 100%)",
      color: "white",
      boxShadow: glow ? "0 0 0 4px rgba(124,46,160,0.18), 0 6px 14px rgba(63,1,86,0.35)" : "0 2px 6px rgba(63,1,86,0.30)",
      position: "relative",
    }}>
      <AIIcon name="sparkle" size={Math.round(size * 0.55)} stroke={1.6} color="white" />
    </span>
  );
}

// ------------------------------------------------------------ Suggested prompts
const QUICK_PROMPTS = [
  { icon: "gift",    label: "Sestavit nabídku na míru", q: "Sestavit nabídku na míru" },
  { icon: "package", label: "Doporuč mi balíček", q: "Doporuč mi balíček" },
  { icon: "plus",    label: "Doplňky a vylepšení pobytu", q: "Doplňky a vylepšení pobytu" },
  { icon: "upgrade", label: "Vyplatí se mi upgrade pokoje?", q: "Vyplatí se mi upgrade pokoje?" },
];

// ------------------------------------------------------------ System prompt
function buildSystemPrompt() {
  const rooms = (window.ROOMS || []).map(r => ({
    id: r.id, name: r.name, capacity: r.capacity, size: r.size, beds: r.beds, view: r.view,
    tags: r.tags, amenities: r.amenities, soldOut: !!r.soldOut, remaining: r.remaining,
    rates: (r.rates || []).map(rt => ({ id: rt.id, name: rt.name, meal: rt.meal, cancellable: rt.cancellable, price: rt.price, originalPrice: rt.originalPrice, badge: rt.badge })),
  }));
  return `Jsi Marie, přátelská AI asistentka pro hotelovou rezervaci (české IBE). Pomáháš hostům najít vhodný pokoj a tarif.

PRAVIDLA:
- Odpovídej VÝHRADNĚ česky, vykáním, přirozeným tónem.
- Buď stručná: 2–4 krátké věty. Nevypisuj seznamy delší než 4 položky.
- Neopakuj zbytečné fráze ("Samozřejmě," "Jistě,"). Jdi rovnou k věci.
- Pokud doporučuješ konkrétní pokoj(e), na ÚPLNÝ KONEC odpovědi přidej řádek ve tvaru: [ROOMS: 107, 201] (jen ID pokojů, max 3).
- Pokud doporučuješ jeden konkrétní tarif, použij místo toho: [RATE: 107:deluxe-nrf]
- Tento řádek bude skryt — text odpovědi ho nezmiňuj.
- Pokud uživatel chce přidat pokoj do rezervace, doporuč konkrétní RATE a v textu řekni "Mohu vám ho rovnou přidat? Klikněte na 'Přidat' u nabídky níže."

SESTAVENÍ NABÍDKY NA MÍRU:
- Když si host řekne o nabídku na míru / personalizovanou nabídku, NEJDŘÍV se krátce doptej na to, co ještě nevíš (počet hostů a dětí, příležitost pobytu, zájem o wellness/snídani, přibližný rozpočet). Ptej se po jedné–dvou věcech, ne na vše najednou.
- Až budeš mít dost informací, sestav JEDNU konkrétní nabídku a na ÚPLNÝ KONEC odpovědi přidej JEDEN řádek s platným JSON ve tvaru:
[OFFER: {"roomId":201,"rateId":"deluxe-flex","nights":2,"guests":2,"meal":"halfboard","addons":[{"label":"Párová masáž 60 min","price":2400},{"label":"Pozdní check-out","price":690}],"headline":"Romantický wellness víkend","rationale":"Krátké zdůvodnění."}]
- meal je jedno z: "none" (bez stravy), "halfboard" (polopenze), "fullboard" (plná penze).
- roomId a rateId MUSÍ existovat v datech níže. addons jsou volitelné doplňky/wellness s rozumnou cenou v Kč (jednorázově za pobyt). headline je krátký název nabídky, rationale jedna věta proč se hodí.
- V textu před [OFFER] napiš 1–2 věty úvodu (např. "Připravila jsem pro Vás tuto nabídku…"). Cenu nevypisuj do textu — spočítá se automaticky v kartě.
- Po sestavení se hosta zeptej, zda chce něco upravit.

KONTEXT:
- Pobyt: ${window.NIGHTS || 2} noci, hosté: ${window.GUESTS || "2 dospělí"}
- Ceny v Kč za celý pobyt (vč. daní). Polopenze +590 Kč/os./noc, plná penze +1190 Kč/os./noc.

DOSTUPNÉ POKOJE:
${JSON.stringify(rooms, null, 0)}`;
}

// ------------------------------------------------------------ Offer builder helpers
const MEAL_PPN = { none: 0, halfboard: 590, fullboard: 1190 };
const MEAL_LABEL = { none: "Bez stravy", halfboard: "Polopenze", fullboard: "Plná penze" };

function buildOffer(spec) {
  if (!spec || typeof spec !== "object") return null;
  const room = (window.ROOMS || []).find(r => r.id === Number(spec.roomId));
  if (!room) return null;
  const rate = (room.rates || []).find(x => x.id === spec.rateId) || (room.rates || [])[0];
  if (!rate) return null;
  const nights = Math.max(1, Number(spec.nights) || (window.NIGHTS || 2));
  const guests = Math.max(1, Number(spec.guests) || 2);
  const mealKey = MEAL_PPN[spec.meal] != null ? spec.meal : "none";
  const roomPrice = rate.price || 0;
  const mealPrice = MEAL_PPN[mealKey] * guests * nights;
  const addons = Array.isArray(spec.addons)
    ? spec.addons.filter(a => a && a.label).map(a => ({ label: String(a.label), price: Math.max(0, Number(a.price) || 0) }))
    : [];
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = roomPrice + mealPrice + addonsTotal;
  return {
    room, rate, nights, guests, mealKey,
    mealLabel: MEAL_LABEL[mealKey], mealPrice, roomPrice, addons, addonsTotal, total,
    headline: spec.headline || "Nabídka na míru",
    rationale: spec.rationale || "",
  };
}

// ============================================================
//  MOCK ENGINE — scripted demo data (no live API). Pure prototype.
// ============================================================
const CHAT_OFFERS = {
  romance: {
    roomId: 201, rateId: "exec-half", nights: 2, guests: 2, meal: "halfboard",
    addons: [
      { label: "Párová masáž 60 min", price: 2400 },
      { label: "Lahev sektu + ovoce na pokoj", price: 790 },
      { label: "Pozdní check-out do 14:00", price: 690 },
    ],
    headline: "Romantický pobyt pro dva",
    rationale: "Executive s výhledem do parku, polopenze a privátní wellness pro nezapomenutelnou oslavu.",
  },
  family: {
    roomId: 301, rateId: "fam-flex", nights: 2, guests: 4, meal: "none",
    addons: [
      { label: "Dětská postýlka + uvítací balíček", price: 0 },
      { label: "Parkování v garáži (2 noci)", price: 700 },
      { label: "Pozdní check-out do 14:00", price: 690 },
    ],
    headline: "Rodinná dovolená v klidu",
    rationale: "Prostorný apartmán pro 2+2, snídaně v ceně a vše pro pohodový pobyt s dětmi.",
  },
  business: {
    roomId: 107, rateId: "deluxe-flex", nights: 2, guests: 1, meal: "none",
    addons: [
      { label: "Brzký check-in (od 11:00)", price: 590 },
      { label: "Parkování v garáži (2 noci)", price: 700 },
      { label: "Snídaně do pokoje", price: 540 },
    ],
    headline: "Pracovní cesta bez starostí",
    rationale: "Flexibilní storno, klidný pokoj s pracovním stolem a vše pro produktivní ráno.",
  },
  wellness: {
    roomId: 201, rateId: "exec-half", nights: 2, guests: 2, meal: "halfboard",
    addons: [
      { label: "Privátní sauna 90 min", price: 1290 },
      { label: "Masáž zad a šíje 2×", price: 2400 },
      { label: "Vstup do wellness (2 dny)", price: 1200 },
    ],
    headline: "Wellness víkend",
    rationale: "Polopenze a kompletní relaxační program — sauna i masáže pro úplný odpočinek.",
  },
};

const CHAT_PACKAGES = [
  {
    id: "wellness", name: "Wellness víkend pro dva", image: "assets/room-2.png",
    tagline: "2 noci · privátní sauna · 2 masáže", badge: "Bestseller",
    inclusions: ["2 noci v pokoji Executive", "Polopenze (snídaně + večeře)", "Privátní sauna 90 min", "2× masáž 60 min", "Pozdní check-out"],
    price: 12900, originalPrice: 15300,
  },
  {
    id: "romance", name: "Romantika s lahví sektu", image: "assets/room-1.png",
    tagline: "2 noci · sekt · výzdoba pokoje", badge: "Pro páry",
    inclusions: ["2 noci v pokoji Deluxe", "Snídaně do pokoje", "Lahev sektu + ovoce na uvítanou", "Romantická výzdoba pokoje", "Pozdní check-out do 14:00"],
    price: 8900, originalPrice: 10200,
  },
];

const HOTEL_ADDONS = [
  { label: "Pozdní check-out do 14:00", price: 690, icon: "clock" },
  { label: "Parkování v garáži (2 noci)", price: 700, icon: "car" },
  { label: "Lahev sektu na pokoj", price: 790, icon: "glass" },
  { label: "Snídaně do pokoje", price: 540, icon: "coffee" },
  { label: "Vstup do wellness (2 dny)", price: 1200, icon: "sparkle" },
];

function buildUpgrade() {
  const rooms = window.ROOMS || [];
  const from = rooms.find(r => r.id === 107);
  const to = rooms.find(r => r.id === 201);
  if (!from || !to) return null;
  const fromRate = (from.rates || []).find(r => r.id === "deluxe-flex") || from.rates[0];
  const toRate = (to.rates || []).find(r => r.id === "exec-flex") || to.rates[0];
  if (!fromRate || !toRate) return null;
  return {
    from, to, fromRate, toRate,
    diff: Math.max(0, toRate.price - fromRate.price),
    benefits: ["+8 m² navíc (38 m²)", "Vana + sprchový kout", "Mini-bar a trezor", "Výhled do parku"],
  };
}

function offerReply(kind) {
  const offer = buildOffer(CHAT_OFFERS[kind]);
  const intros = {
    romance: "Připravila jsem romantickou nabídku pro dva 💕",
    family: "Tady je nabídka ušitá na míru rodině 👨‍👩‍👧",
    business: "Navrhuji efektivní nabídku pro pracovní cestu 💼",
    wellness: "Sestavila jsem relaxační wellness nabídku 🧖",
  };
  return {
    text: (intros[kind] || "Tady je vaše nabídka na míru") + " — vše v jednom, cena je včetně daní. Chcete něco upravit?",
    offer,
    quickReplies: ["Ukázat jiný typ nabídky", "Doplňky a vylepšení"],
  };
}

function mockReply(text) {
  const t = (text || "").toLowerCase();
  const has = (...ws) => ws.some(w => t.indexOf(w) !== -1);

  // Occasion-specific personalized offers (driven by quick-reply chips or free text)
  if (has("romant", "oslav", "výroč", "svatb")) return offerReply("romance");
  if (has("dovolen", "rodinnou")) return offerReply("family");
  if (has("pracovn", "business", "služebn", "konferenc")) return offerReply("business");
  if (has("wellness", "relax", "sauna", "masáž", "odpočin", "láze")) return offerReply("wellness");

  // Entry to tailored-offer flow — ask the occasion
  if (has("na míru", "sestav", "personalizov", "nabídk")) {
    return {
      text: "Ráda vám sestavím nabídku přesně na míru. Jaký pobyt plánujete?",
      quickReplies: ["Romantická oslava 💕", "Rodinná dovolená 👨‍👩‍👧", "Pracovní cesta 💼", "Wellness víkend 🧖"],
    };
  }

  // Room upgrade
  if (has("upgrade", "vyšší", "lepší pokoj", "povýš", "větší pokoj")) {
    return {
      text: "Z Deluxe můžete povýšit na Executive jen za pár stovek navíc — větší pokoj, vana a výhled do parku. Tady je srovnání:",
      upgrade: buildUpgrade(),
      quickReplies: ["Doplňky a vylepšení", "Sestavit nabídku na míru"],
    };
  }

  // Packages
  if (has("balíč", "package", "víkend", "zážit")) {
    return {
      text: "Nejoblíbenější jsou tyto dva balíčky — mají vše v jednom a vyjdou lépe než po jednotlivých položkách:",
      packages: CHAT_PACKAGES,
      quickReplies: ["Sestavit nabídku na míru", "Vyplatí se mi upgrade?"],
    };
  }

  // Upsell / add-ons
  if (has("doplň", "vylepš", "upsell", "extra", "park", "check-out", "sekt", "late")) {
    return {
      text: "K pobytu si můžete přidat oblíbená vylepšení. Vyberte, co se hodí — zbytek doladíme v dalším kroku:",
      upsell: HOTEL_ADDONS,
      quickReplies: ["Doporuč mi balíček", "Sestavit nabídku na míru"],
    };
  }

  // FAQ — flexi vs non-refundable
  if (has("rozdíl", "flexibiln", "nevratn", "storno")) {
    return {
      text: "Flexibilní cena jde zdarma zrušit či změnit až do pár dní před příjezdem — ideální při nejistém termínu. Nevratná je o 10–15 % levnější, ale nelze ji stornovat. Při jistém termínu se vyplatí nevratná.",
      quickReplies: ["Sestavit nabídku na míru", "Doporuč mi balíček"],
    };
  }
  // FAQ — breakfast / meals
  if (has("snídan", "strav", "jídlo", "polopenz")) {
    return {
      text: "Ve snídani je bohatý bufet (teplé i studené, čerstvé pečivo, káva) 7–10 h. Můžete přejít na polopenzi (+590 Kč/os./noc) nebo plnou penzi (+1190 Kč/os./noc).",
      quickReplies: ["Doplňky a vylepšení", "Sestavit nabídku na míru"],
    };
  }

  // Family room recommendation
  if (has("rodin", "dět", "dít")) {
    const fam = (window.ROOMS || []).find(r => r.id === 301);
    return {
      text: "Pro rodinu doporučuji Rodinný apartmán — 52 m², dvě ložnice a obývací prostor. Tady je:",
      rooms: fam ? [fam] : [],
      quickReplies: ["Sestavit rodinnou nabídku", "Doporuč mi balíček"],
    };
  }

  // Cheapest option
  if (has("nejvýhodn", "nejlevn", "ušetř", "levn", "rozpočet", "cena")) {
    const std = (window.ROOMS || []).find(r => r.id === 501);
    const rate = std && (std.rates || []).find(r => r.id === "std-nrf");
    return {
      text: "Nejvýhodnější je Standard s nevratnou cenou — ušetříte a snídani lze dokoupit. Mohu vám ji rovnou přidat:",
      rate: std && rate ? { room: std, rate } : null,
      quickReplies: ["Sestavit nabídku na míru", "Doporuč mi balíček"],
    };
  }

  // Default
  return {
    text: "Ráda pomohu! Můžu sestavit nabídku na míru, doporučit balíček, navrhnout vylepšení pobytu nebo upgrade pokoje. Co vás zajímá?",
    quickReplies: ["Sestavit nabídku na míru", "Doporuč mi balíček", "Doplňky a vylepšení", "Vyplatí se mi upgrade?"],
  };
}

// ------------------------------------------------------------ Output parser
function parseBotMessage(raw) {
  const text = raw || "";
  const roomsMatch = text.match(/\[ROOMS:\s*([0-9,\s]+)\]/i);
  const rateMatch  = text.match(/\[RATE:\s*([0-9]+):([a-z0-9\-]+)\]/i);
  const offerMatch = text.match(/\[OFFER:\s*(\{[\s\S]*\})\s*\]/i);
  let body = text
    .replace(/\[ROOMS:[^\]]+\]/i, "")
    .replace(/\[RATE:[^\]]+\]/i, "")
    .replace(/\[OFFER:\s*\{[\s\S]*\}\s*\]/i, "")
    .trim();
  const roomIds = roomsMatch ? roomsMatch[1].split(",").map(s => parseInt(s.trim(), 10)).filter(Boolean) : [];
  let rate = null;
  if (rateMatch) {
    const rid = parseInt(rateMatch[1], 10);
    const rateId = rateMatch[2];
    const room = (window.ROOMS || []).find(r => r.id === rid);
    const rt = room?.rates?.find(x => x.id === rateId);
    if (room && rt) rate = { room, rate: rt };
  }
  let offer = null;
  if (offerMatch) {
    try { offer = buildOffer(JSON.parse(offerMatch[1])); } catch (e) { offer = null; }
  }
  const rooms = roomIds.map(id => (window.ROOMS || []).find(r => r.id === id)).filter(Boolean);
  return { body, rooms, rate, offer };
}

// ------------------------------------------------------------ Inline room card (compact)
function ChatRoomCard({ room, onOpenDetail, onAdd }) {
  const bestRate = room.rates && room.rates.length ? room.rates.reduce((a, b) => (b.price < a.price ? b : a)) : null;
  return (
    <div style={{
      borderRadius: 10, border: "1px solid #E2E6E8", background: "white",
      overflow: "hidden", marginTop: 8,
      display: "grid", gridTemplateColumns: "80px 1fr", boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    }}>
      <div style={{
        background: `url(${room.image}) center / cover no-repeat #EEF1F3`,
        minHeight: 86,
      }} />
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5, color: "#1F2429", lineHeight: 1.2 }}>
          {room.name}
        </div>
        <div style={{ fontSize: 11.5, color: "#6D7073", lineHeight: 1.25 }}>
          {room.size} m² · {room.beds} · {room.capacity} hostů
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
          {bestRate ? (
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#1F2429" }}>
              od {bestRate.price.toLocaleString("cs-CZ")} Kč
              <span style={{ fontWeight: 400, fontSize: 11, color: "#6D7073" }}> / {window.NIGHTS || 2} noci</span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: "#A6151D", fontWeight: 600 }}>Nedostupné</span>
          )}
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onOpenDetail} style={btnGhost}>Detail</button>
            {bestRate && <button onClick={() => onAdd(room, bestRate)} style={btnPrimary}>Přidat</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Specific rate card
function ChatRateCard({ room, rate, onAdd, onOpenDetail }) {
  return (
    <div style={{
      borderRadius: 10, border: "1.5px solid #550173", background: "white",
      overflow: "hidden", marginTop: 8, boxShadow: "0 4px 12px rgba(85,1,115,0.10)",
    }}>
      <div style={{
        padding: "6px 12px", background: "linear-gradient(90deg, #F2E6F5 0%, #FAF5FC 100%)",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        color: "#3F0156", display: "flex", alignItems: "center", gap: 6,
      }}>
        <AIIcon name="sparkle" size={12} stroke={2} color="#550173" />
        Doporučená nabídka
      </div>
      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#1F2429", lineHeight: 1.25 }}>
          {room.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <span style={chip}>{rate.name}</span>
          <span style={chip}>{rate.meal.replace(" v ceně", "")}</span>
          <span style={chip}>{rate.cancellable ? "Zrušení zdarma" : "Nevratná"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
          <div>
            {rate.originalPrice && (
              <div style={{ fontSize: 11, color: "#6D7073", textDecoration: "line-through", lineHeight: 1 }}>
                {rate.originalPrice.toLocaleString("cs-CZ")} Kč
              </div>
            )}
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1F2429", lineHeight: 1.1 }}>
              {rate.price.toLocaleString("cs-CZ")} Kč
            </div>
            <div style={{ fontSize: 10.5, color: "#6D7073", marginTop: 1 }}>za {window.NIGHTS || 2} noci · vč. daní</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onOpenDetail} style={btnGhost}>Detail</button>
            <button onClick={() => onAdd(room, rate)} style={btnPrimary}>
              <AIIcon name="check" size={12} stroke={2.4} color="white" /> Přidat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Personalized offer card
function fmtKc(n) { return (n || 0).toLocaleString("cs-CZ") + " Kč"; }

function ChatOfferCard({ offer, onAdd, onContinue, onOpenDetail }) {
  const { room, rate, nights, guests, mealLabel, mealPrice, roomPrice, addons, total, headline, rationale } = offer;
  const nightsLabel = nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí";
  return (
    <div style={{
      borderRadius: 12, border: "1.5px solid #550173", background: "white",
      overflow: "hidden", marginTop: 8, boxShadow: "0 8px 22px rgba(85,1,115,0.14)",
    }}>
      {/* Header */}
      <div style={{
        padding: "9px 13px", background: "linear-gradient(135deg, #6B1C8C 0%, #550173 55%, #3F0156 100%)",
        color: "white", display: "flex", alignItems: "center", gap: 7,
      }}>
        <AIIcon name="gift" size={14} stroke={2} color="white" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Nabídka na míru
        </span>
      </div>

      {/* Hero / title */}
      <div style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: 0, borderBottom: "1px solid #EEF1F3" }}>
        <div style={{ background: `url(${room.image}) center / cover no-repeat #EEF1F3`, minHeight: 78 }} />
        <div style={{ padding: "10px 12px", minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14.5, color: "#1F2429", lineHeight: 1.2 }}>
            {headline}
          </div>
          <div style={{ fontSize: 11.5, color: "#6D7073", marginTop: 3, lineHeight: 1.3 }}>
            {room.name} · {nights} {nightsLabel} · {guests} hosté
          </div>
          {rationale && (
            <div style={{ fontSize: 11.5, color: "#550173", marginTop: 5, lineHeight: 1.35, fontStyle: "italic" }}>
              {rationale}
            </div>
          )}
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: "10px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
        <OfferLine label={`${room.name} — ${rate.name}`} sub={rate.meal ? rate.meal.replace(" v ceně", "") : null} value={fmtKc(roomPrice)} />
        {mealPrice > 0 && <OfferLine label={mealLabel} sub={`${guests}× hosté · ${nights} ${nightsLabel}`} value={"+ " + fmtKc(mealPrice)} />}
        {addons.map((a, i) => (
          <OfferLine key={i} label={a.label} value={"+ " + fmtKc(a.price)} />
        ))}
        <div style={{ height: 1, background: "#EEF1F3", margin: "3px 0" }} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1F2429" }}>Celkem</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#550173" }}>{fmtKc(total)}</span>
        </div>
        <div style={{ fontSize: 10.5, color: "#9A9DA0", textAlign: "right", marginTop: -2 }}>vč. daní · za celý pobyt</div>
      </div>

      {/* CTAs */}
      <div style={{ padding: "0 13px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
        <button onClick={() => onContinue(offer)} style={{
          appearance: "none", border: "none", cursor: "pointer", width: "100%",
          background: "#550173", color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "11px 14px", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          Pokračovat s touto nabídkou
          <AIIcon name="arrow-right" size={15} stroke={2.4} color="white" />
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={() => onAdd(room, rate)} style={{ ...btnGhost, flex: 1, justifyContent: "center", padding: "9px 10px" }}>
            <AIIcon name="plus" size={13} stroke={2.2} color="#1F2429" /> Přidat a vybírat dál
          </button>
          <button onClick={() => onOpenDetail(room)} style={{ ...btnGhost, justifyContent: "center", padding: "9px 12px" }}>
            Detail pokoje
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferLine({ label, sub, value }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: "#1F2429", lineHeight: 1.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 10.5, color: "#9A9DA0", lineHeight: 1.2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1F2429", whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
}

// ------------------------------------------------------------ Upsell / add-ons card
function ChatUpsellCard({ addons, onContinue }) {
  const [picked, setPicked] = useStateAI({});
  const ids = addons.map((_, i) => i);
  const total = ids.reduce((s, i) => s + (picked[i] ? addons[i].price : 0), 0);
  const count = ids.filter(i => picked[i]).length;
  return (
    <div style={{ borderRadius: 12, border: "1px solid #E2E6E8", background: "white", overflow: "hidden", marginTop: 8, boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
      <div style={{ padding: "8px 13px", borderBottom: "1px solid #EEF1F3", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3F0156", display: "flex", alignItems: "center", gap: 6 }}>
        <AIIcon name="plus" size={13} stroke={2.4} color="#550173" /> Vylepšení pobytu
      </div>
      <div style={{ padding: "6px 8px" }}>
        {addons.map((a, i) => {
          const on = !!picked[i];
          return (
            <button key={i} onClick={() => setPicked(p => ({ ...p, [i]: !p[i] }))} style={{
              width: "100%", appearance: "none", border: "none", background: on ? "#FAF5FC" : "transparent",
              cursor: "pointer", padding: "9px 8px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10, textAlign: "left",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: on ? "#550173" : "#F2E6F5", color: on ? "white" : "#550173",
              }}>
                {on ? <AIIcon name="check" size={13} stroke={2.6} color="white" /> : <AIIcon name={a.icon || "plus"} size={13} stroke={2} color="#550173" />}
              </span>
              <span style={{ flex: 1, fontSize: 12.5, color: "#1F2429", lineHeight: 1.25 }}>{a.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: a.price ? "#1F2429" : "#1F8A5B", whiteSpace: "nowrap" }}>{a.price ? "+ " + fmtKc(a.price) : "zdarma"}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "4px 13px 13px" }}>
        <button onClick={() => onContinue()} style={{
          width: "100%", appearance: "none", border: "none", cursor: "pointer",
          background: "#550173", color: "white", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
          padding: "11px 14px", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          {count > 0 ? `Přidat ${count}× · + ${fmtKc(total)}` : "Přidat k pobytu"}
          <AIIcon name="arrow-right" size={15} stroke={2.4} color="white" />
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Package offer card
function ChatPackageCard({ pkg, onReserve, onDetail }) {
  const save = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
  return (
    <div style={{ borderRadius: 12, border: "1px solid #E2E6E8", background: "white", overflow: "hidden", marginTop: 8, boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
      <div style={{ position: "relative", height: 92, background: `url(${pkg.image}) center / cover no-repeat #EEF1F3` }}>
        {pkg.badge && (
          <span style={{ position: "absolute", top: 8, left: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: "rgba(85,1,115,0.92)", color: "white" }}>{pkg.badge}</span>
        )}
      </div>
      <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14.5, color: "#1F2429", lineHeight: 1.2 }}>{pkg.name}</div>
          <div style={{ fontSize: 11.5, color: "#6D7073", marginTop: 2 }}>{pkg.tagline}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {pkg.inclusions.slice(0, 4).map((inc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: "#484C4F", lineHeight: 1.3 }}>
              <AIIcon name="check" size={12} stroke={2.4} color="#1F8A5B" /> <span style={{ flex: 1 }}>{inc}</span>
            </div>
          ))}
          {pkg.inclusions.length > 4 && <div style={{ fontSize: 11, color: "#9A9DA0", paddingLeft: 18 }}>+ {pkg.inclusions.length - 4} další</div>}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 2 }}>
          <div>
            {pkg.originalPrice && <div style={{ fontSize: 11, color: "#6D7073", textDecoration: "line-through", lineHeight: 1 }}>{fmtKc(pkg.originalPrice)}</div>}
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#550173", lineHeight: 1.1 }}>{fmtKc(pkg.price)}</div>
            {save > 0 && <div style={{ fontSize: 10.5, color: "#1F8A5B", fontWeight: 700, marginTop: 1 }}>Ušetříte {fmtKc(save)}</div>}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => onDetail(pkg)} style={btnGhost}>Detail</button>
            <button onClick={() => onReserve(pkg)} style={btnPrimary}>Rezervovat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Room upgrade card
function ChatUpgradeCard({ upgrade, onUpgrade, onOpenDetail }) {
  const { from, to, fromRate, toRate, diff, benefits } = upgrade;
  return (
    <div style={{ borderRadius: 12, border: "1.5px solid #550173", background: "white", overflow: "hidden", marginTop: 8, boxShadow: "0 8px 22px rgba(85,1,115,0.12)" }}>
      <div style={{ padding: "8px 13px", background: "linear-gradient(135deg, #6B1C8C 0%, #550173 55%, #3F0156 100%)", color: "white", display: "flex", alignItems: "center", gap: 7 }}>
        <AIIcon name="upgrade" size={14} stroke={2.2} color="white" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Doporučený upgrade</span>
      </div>
      <div style={{ padding: "11px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0, opacity: 0.7 }}>
            <div style={{ fontSize: 10.5, color: "#9A9DA0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Aktuálně</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1F2429", lineHeight: 1.2 }}>{from.name.replace("Dvoulůžkový pokoj ", "")}</div>
            <div style={{ fontSize: 11, color: "#6D7073" }}>{from.size} m² · {fmtKc(fromRate.price)}</div>
          </div>
          <AIIcon name="arrow-right" size={16} stroke={2.2} color="#550173" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, color: "#550173", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Executive</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1F2429", lineHeight: 1.2 }}>{to.name.replace("Dvoulůžkový pokoj ", "")}</div>
            <div style={{ fontSize: 11, color: "#6D7073" }}>{to.size} m² · {fmtKc(toRate.price)}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {benefits.map((b, i) => (
            <span key={i} style={{ ...chip, fontSize: 10.5 }}>{b}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#6D7073" }}>Doplatek <strong style={{ color: "#1F2429" }}>+ {fmtKc(diff)}</strong> za pobyt</div>
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => onOpenDetail(to)} style={btnGhost}>Detail</button>
            <button onClick={() => onUpgrade(to, toRate)} style={btnPrimary}>
              <AIIcon name="upgrade" size={12} stroke={2.4} color="white" /> Upgradovat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Quick-reply chips
function QuickReplies({ items, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {items.map((q, i) => (
        <button key={i} onClick={() => onPick(q)} style={{
          appearance: "none", border: "1px solid #E2D0EC", background: "white", cursor: "pointer",
          color: "#550173", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
          padding: "7px 12px", borderRadius: 999, lineHeight: 1.2,
        }}>{q}</button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------ Button styles
const btnPrimary = {
  appearance: "none", border: "none", cursor: "pointer",
  background: "#550173", color: "white",
  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12,
  padding: "6px 10px", borderRadius: 5,
  display: "inline-flex", alignItems: "center", gap: 4, letterSpacing: "0.02em",
};
const btnGhost = {
  appearance: "none", border: "1px solid #E2E6E8", cursor: "pointer",
  background: "white", color: "#1F2429",
  fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12,
  padding: "6px 10px", borderRadius: 5,
};
const chip = {
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "2px 7px", borderRadius: 999, background: "#F2E6F5",
  color: "#3F0156", fontSize: 11, fontWeight: 600,
};

// ------------------------------------------------------------ Typing indicator
function Typing() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 12px", background: "white", border: "1px solid #EEF1F3", borderRadius: 12, borderTopLeftRadius: 4, width: "fit-content" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#550173",
          animation: `mariePulse 1.2s ${i * 0.15}s infinite ease-in-out`, display: "inline-block",
        }} />
      ))}
    </div>
  );
}

// ------------------------------------------------------------ Welcome
function WelcomePanel({ onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "4px 2px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MarieAvatar size={44} glow />
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#1F2429" }}>Dobrý den, jsem Marie 👋</div>
          <div style={{ fontSize: 12.5, color: "#6D7073", marginTop: 2 }}>AI asistentka pro výběr pokoje</div>
        </div>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #FAF5FC 0%, white 70%)",
        border: "1px solid #EEDFF4", borderRadius: 10, padding: "12px 14px",
        fontSize: 13.5, color: "#1F2429", lineHeight: 1.5,
      }}>
        Pomohu vám vybrat ideální pokoj na <strong>{window.NIGHTS || 2} noci</strong> pro <strong>{window.GUESTS || "2 dospělé"}</strong>. Můžete se mě zeptat na cokoli — porovnám tarify, doporučím pokoj nebo vám rovnou vyplním rezervaci.
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6D7073", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
        Vyzkoušejte
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => onPick(p.q)} style={{
            appearance: "none", border: "1px solid #E2E6E8", background: "white",
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-ui)", fontSize: 13, color: "#1F2429", lineHeight: 1.3,
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: "#F2E6F5", color: "#550173",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <AIIcon name={p.icon} size={14} stroke={2} color="#550173" />
            </span>
            <span style={{ flex: 1 }}>{p.label}</span>
            <AIIcon name="chevron-right" size={14} stroke={2} color="#6D7073" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Main panel
function AIChatbotPanel({ onClose, onAddToReservation, onOpenRoomDetail, onNavigate }) {
  const [messages, setMessages] = useStateAI([]);  // {role, text, rooms?, rate?}
  const [input, setInput] = useStateAI("");
  const [busy, setBusy] = useStateAI(false);
  const scrollRef = useRefAI(null);
  const inputRef = useRefAI(null);

  useEffectAI(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight + 200;
  }, [messages, busy]);

  useEffectAI(() => {
    inputRef.current?.focus();
  }, []);

  function ask(text) {
    if (!text.trim() || busy) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setBusy(true);
    const reply = mockReply(text.trim());
    const delay = 600 + Math.min(1300, (reply.text || "").length * 11);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", ...reply }]);
      setBusy(false);
    }, delay);
  }

  function reset() {
    setMessages([]);
    setInput("");
  }

  const isEmpty = messages.length === 0;

  return (
    <div style={{
      position: "fixed", right: 22, bottom: 22, zIndex: 9000,
      width: 400, maxWidth: "calc(100vw - 32px)",
      height: 640, maxHeight: "calc(100vh - 44px)",
      background: "white", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(16,24,40,0.24), 0 6px 18px rgba(85,1,115,0.18)",
      border: "1px solid #E2E6E8",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-ui)",
      animation: "marieRise 240ms cubic-bezier(.2,.7,.2,1) both",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, #6B1C8C 0%, #550173 50%, #3F0156 100%)",
        color: "white", display: "flex", alignItems: "center", gap: 12,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <MarieAvatar size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Marie</span>
            <span style={{
              fontSize: 9.5, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
              background: "rgba(255,255,255,0.18)", letterSpacing: "0.06em",
            }}>AI</span>
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.82, display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CD3A6", boxShadow: "0 0 0 2px rgba(124,211,166,0.30)" }} />
            Online — odpovím vám hned
          </div>
        </div>
        {!isEmpty && (
          <button onClick={reset} title="Nový rozhovor" style={{
            appearance: "none", border: "none", background: "rgba(255,255,255,0.14)",
            color: "white", padding: 6, borderRadius: 6, cursor: "pointer", display: "inline-flex",
          }}>
            <AIIcon name="refresh" size={15} stroke={2} color="white" />
          </button>
        )}
        <button onClick={onClose} title="Zavřít" style={{
          appearance: "none", border: "none", background: "rgba(255,255,255,0.14)",
          color: "white", padding: 6, borderRadius: 6, cursor: "pointer", display: "inline-flex",
        }}>
          <AIIcon name="close" size={16} stroke={2} color="white" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "16px 14px",
        background: "linear-gradient(180deg, #FAFAFB 0%, #F5F6F8 100%)",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {isEmpty ? (
          <WelcomePanel onPick={ask} />
        ) : (
          <>
            {messages.map((m, i) => (
              <MessageRow key={i} m={m} onAdd={onAddToReservation} onOpenDetail={onOpenRoomDetail} onContinue={() => onNavigate("Upsell.html")} onNavigate={onNavigate} onQuick={ask} />
            ))}
            {busy && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <MarieAvatar size={26} />
                <Typing />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer / input */}
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} style={{
        padding: "10px 12px 12px", background: "white",
        borderTop: "1px solid #EEF1F3",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#F5F6F8", borderRadius: 999, padding: "4px 4px 4px 14px",
          border: "1px solid transparent",
          transition: "border-color 120ms",
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={busy ? "Marie přemýšlí…" : "Zeptejte se Marie…"}
            disabled={busy}
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontFamily: "inherit", fontSize: 14, color: "#1F2429",
              padding: "9px 0",
            }}
          />
          <button type="submit" disabled={!input.trim() || busy} style={{
            appearance: "none", border: "none", cursor: input.trim() && !busy ? "pointer" : "default",
            width: 36, height: 36, borderRadius: "50%",
            background: input.trim() && !busy ? "#550173" : "#D6D9DC",
            color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "background 120ms",
          }}>
            <AIIcon name="send" size={15} stroke={2.2} color="white" />
          </button>
        </div>
        <div style={{ fontSize: 10.5, color: "#9A9DA0", textAlign: "center", letterSpacing: "0.02em" }}>
          Ukázkový průvodce · ilustrativní data (prototyp).
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------ Message bubble
function MessageRow({ m, onAdd, onOpenDetail, onContinue, onNavigate, onQuick }) {
  if (m.role === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "84%" }}>
        <div style={{
          background: "#550173", color: "white",
          padding: "9px 13px", borderRadius: 14, borderBottomRightRadius: 4,
          fontSize: 13.5, lineHeight: 1.45, whiteSpace: "pre-wrap",
        }}>{m.text}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, maxWidth: "92%" }}>
      <MarieAvatar size={26} />
      <div style={{ minWidth: 0, flex: 1 }}>
        {m.text && (
          <div style={{
            background: "white", border: "1px solid #EEF1F3",
            padding: "9px 13px", borderRadius: 14, borderTopLeftRadius: 4,
            fontSize: 13.5, lineHeight: 1.5, color: "#1F2429", whiteSpace: "pre-wrap",
          }}>{m.text}</div>
        )}
        {m.offer && <ChatOfferCard offer={m.offer} onAdd={onAdd} onContinue={onContinue} onOpenDetail={onOpenDetail} />}
        {m.upgrade && <ChatUpgradeCard upgrade={m.upgrade} onUpgrade={onAdd} onOpenDetail={onOpenDetail} />}
        {m.upsell && <ChatUpsellCard addons={m.upsell} onContinue={() => onNavigate("Upsell.html")} />}
        {m.packages && m.packages.map(p => (
          <ChatPackageCard key={p.id} pkg={p} onReserve={() => onNavigate("Pick-Package-Single-Package.html")} onDetail={() => onNavigate("Pick-Package.html")} />
        ))}
        {m.rate && <ChatRateCard room={m.rate.room} rate={m.rate.rate} onAdd={onAdd} onOpenDetail={() => onOpenDetail(m.rate.room)} />}
        {m.rooms && m.rooms.length > 0 && !m.rate && !m.offer && m.rooms.map(r => (
          <ChatRoomCard key={r.id} room={r} onOpenDetail={() => onOpenDetail(r)} onAdd={onAdd} />
        ))}
        {m.quickReplies && m.quickReplies.length > 0 && <QuickReplies items={m.quickReplies} onPick={onQuick} />}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Floating launcher
function AIChatbotFab({ open, onToggle, unread }) {
  const [hint, setHint] = useStateAI(true);
  useEffectAI(() => {
    const t = setTimeout(() => setHint(false), 7000);
    return () => clearTimeout(t);
  }, []);

  if (open) return null;
  return (
    <div style={{
      position: "fixed", right: 22, bottom: 22, zIndex: 8000,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {hint && (
        <button onClick={onToggle} style={{
          appearance: "none", border: "1px solid #EEDFF4", cursor: "pointer",
          background: "white", color: "#1F2429",
          padding: "10px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 20px rgba(16,24,40,0.10)",
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-ui)",
          animation: "marieFloat 280ms cubic-bezier(.2,.7,.2,1) both",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: "#F2E6F5", color: "#550173", letterSpacing: "0.06em" }}>NOVÉ</span>
          Potřebujete poradit s rezervací?
        </button>
      )}
      <button onClick={onToggle} aria-label="Otevřít AI asistenta" style={{
        appearance: "none", border: "none", cursor: "pointer", position: "relative",
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(135deg, #7C2EA0 0%, #550173 50%, #3F0156 100%)",
        color: "white",
        boxShadow: "0 12px 28px rgba(85,1,115,0.40), 0 4px 10px rgba(16,24,40,0.16)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          position: "absolute", inset: -4, borderRadius: "50%",
          border: "2px solid rgba(124,46,160,0.45)",
          animation: "mariePing 2.4s ease-out infinite",
          pointerEvents: "none",
        }} />
        <AIIcon name="sparkle" size={26} stroke={1.6} color="white" />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2, minWidth: 18, height: 18, padding: "0 5px",
            borderRadius: 999, background: "#1F8A5B", color: "white",
            fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white",
          }}>{unread}</span>
        )}
      </button>
    </div>
  );
}

// ------------------------------------------------------------ Top-level wrapper
function AIChatbot({ onAddSelection, onOpenRoomDetail }) {
  const [open, setOpen] = useStateAI(false);

  function handleAdd(room, rate) {
    onAddSelection?.(room, rate);
  }
  function handleOpenDetail(room) {
    window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } }));
  }
  function handleNavigate(page) {
    // In the journey shell this advances the iframe to the next step.
    if (page) window.location.href = page;
  }

  return (
    <>
      <style>{`
        @keyframes mariePulse {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes mariePing {
          0% { transform: scale(0.9); opacity: 0.8; }
          80% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes marieRise {
          from { transform: translateY(16px) scale(0.98); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes marieFloat {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <AIChatbotFab open={open} onToggle={() => setOpen(true)} unread={0} />
      {open && (
        <AIChatbotPanel
          onClose={() => setOpen(false)}
          onAddToReservation={handleAdd}
          onOpenRoomDetail={handleOpenDetail}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}

window.AIChatbot = AIChatbot;
