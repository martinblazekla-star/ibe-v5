// Proposal Engine data — 3 scenarios (wedding / conference / group)
// Each scenario has up to 3 variants (Basic / Standard / Premium)
// Items grouped by category: stay, food, venue, activities, other

const PROPOSAL_SCENARIOS = {
  svatba: {
    id: "svatba",
    label: "Svatební víkend",
    proposalNumber: "NAB-2026-0148",
    hotel: {
      name: "Vila Regenhart",
      address: "Třída míru 54, Jeseník",
      logo: "VR",
    },
    title: "Svatební víkend pro Annu & Tomáše",
    subtitle: "Privátní pronájem vily na celý víkend",
    intro: "Milá Anno a Tomáši,\n\npřipravili jsme pro vás víkendovou nabídku celého objektu Vila Regenhart včetně zahrady, gala večeře a hudebního doprovodu. Termín i počet hostů jsou předjednáni — finální skladbu menu a sezení sladíme na osobní schůzce.",
    dateLabel: "12. – 14. září 2026",
    dateStart: "2026-09-12",
    dateEnd: "2026-09-14",
    nights: 2,
    guests: { adults: 58, children: 4 },
    rooms: 22,
    expiresDays: 10,
    contact: {
      name: "Martina Krejčí",
      role: "Sales & Events",
      email: "events@regenhart.cz",
      phone: "+420 777 666 444",
      avatarBg: "#7A5AE0",
      initials: "MK",
    },
    photos: [
      { src: "assets/room-1.png", caption: "Hlavní salon" },
      { src: "assets/room-2.png", caption: "Apartmán pro novomanžele" },
      { src: "assets/room-3.png", caption: "Jednolůžkový pokoj" },
    ],
    schedule: [
      { day: "Pátek 12. 9.", time: "15:00", title: "Příjezd a check-in hostí", loc: "Recepce", cat: "ubytovani" },
      { day: "Pátek 12. 9.", time: "18:00", title: "Welcome drink na zahradě", loc: "Zahrada", cat: "aktivita" },
      { day: "Pátek 12. 9.", time: "19:30", title: "Lehká večeře (raut)", loc: "Restaurace", cat: "strava" },
      { day: "Sobota 13. 9.", time: "10:00", title: "Snídaně formou bufetu", loc: "Restaurace", cat: "strava" },
      { day: "Sobota 13. 9.", time: "14:00", title: "Svatební obřad", loc: "Zahradní altán", cat: "aktivita" },
      { day: "Sobota 13. 9.", time: "15:30", title: "Přípitek a focení", loc: "Park", cat: "aktivita" },
      { day: "Sobota 13. 9.", time: "18:00", title: "Slavnostní gala večeře (4 chody)", loc: "Velký sál", cat: "strava" },
      { day: "Sobota 13. 9.", time: "21:00", title: "DJ + live kapela", loc: "Velký sál", cat: "aktivita" },
      { day: "Neděle 14. 9.", time: "10:00", title: "Snídaně", loc: "Restaurace", cat: "strava" },
      { day: "Neděle 14. 9.", time: "12:00", title: "Check-out a rozloučení", loc: "Recepce", cat: "ubytovani" },
    ],
    variants: [
      {
        id: "basic",
        name: "Základní balíček",
        sub: "Ubytování, snídaně, jednoduchý raut",
        highlights: ["22 pokojů na 2 noci", "Welcome drink + raut", "Snídaně formou bufetu", "Pronájem zahradního altánu"],
        items: [
          { cat: "Ubytování", label: "22 pokojů, 2 noci", qty: "22 × 2", unit: 4200, total: 184800 },
          { cat: "Stravování", label: "Snídaně (60 osob × 2 dny)", qty: "120 ×", unit: 350, total: 42000 },
          { cat: "Stravování", label: "Welcome raut + nápoje", qty: "60 ×", unit: 480, total: 28800 },
          { cat: "Pronájem prostor", label: "Pronájem zahradního altánu", qty: "1 den", unit: 12000, total: 12000 },
          { cat: "Ostatní", label: "Květinová výzdoba (základní)", qty: "1×", unit: 6500, total: 6500 },
        ],
        deposit: 80000,
        cancellation: "Bez storno poplatku do 30 dnů před akcí.",
      },
      {
        id: "standard",
        name: "Standardní balíček",
        sub: "Gala večeře, hudba, květinová výzdoba",
        recommended: true,
        highlights: ["22 pokojů na 2 noci", "Gala večeře (4 chody)", "DJ celý večer", "Květinová výzdoba", "Welcome drink + raut"],
        items: [
          { cat: "Ubytování", label: "22 pokojů, 2 noci", qty: "22 × 2", unit: 4200, total: 184800 },
          { cat: "Stravování", label: "Snídaně (60 osob × 2 dny)", qty: "120 ×", unit: 350, total: 42000 },
          { cat: "Stravování", label: "Welcome raut + nápoje", qty: "60 ×", unit: 480, total: 28800 },
          { cat: "Stravování", label: "Gala večeře — 4 chody", qty: "60 ×", unit: 1450, total: 87000 },
          { cat: "Pronájem prostor", label: "Velký sál + zahrada", qty: "1 víkend", unit: 32000, total: 32000 },
          { cat: "Aktivity", label: "DJ celý večer (21:00–02:00)", qty: "5 h", unit: 18000, total: 18000 },
          { cat: "Ostatní", label: "Květinová výzdoba sál + altán", qty: "1×", unit: 14000, total: 14000 },
        ],
        deposit: 150000,
        cancellation: "Storno zdarma do 45 dnů, pak 50 % do 14 dnů, plné při zrušení do 7 dnů.",
      },
      {
        id: "premium",
        name: "Premium All-Inclusive",
        sub: "Live kapela, sommelier, full bar, fotograf",
        highlights: ["22 pokojů + apartmán pro nevěstu", "Gala večeře (5 chodů)", "Live kapela + DJ", "Sommelier párování vín", "Open bar 5 h", "Profi fotograf 8 h"],
        items: [
          { cat: "Ubytování", label: "22 pokojů, 2 noci", qty: "22 × 2", unit: 4200, total: 184800 },
          { cat: "Ubytování", label: "Apartmán pro novomanžele", qty: "2 noci", unit: 6800, total: 13600 },
          { cat: "Stravování", label: "Snídaně (60 osob × 2 dny)", qty: "120 ×", unit: 350, total: 42000 },
          { cat: "Stravování", label: "Welcome raut s prosecco baru", qty: "60 ×", unit: 720, total: 43200 },
          { cat: "Stravování", label: "Gala večeře — 5 chodů + sommelier", qty: "60 ×", unit: 2200, total: 132000 },
          { cat: "Stravování", label: "Open bar (premium) 5 h", qty: "60 ×", unit: 950, total: 57000 },
          { cat: "Pronájem prostor", label: "Privátní pronájem celé vily", qty: "1 víkend", unit: 58000, total: 58000 },
          { cat: "Aktivity", label: "Live kapela 4 h + DJ 4 h", qty: "8 h", unit: 42000, total: 42000 },
          { cat: "Aktivity", label: "Profi fotograf 8 h", qty: "8 h", unit: 24000, total: 24000 },
          { cat: "Ostatní", label: "Květinová výzdoba (luxusní)", qty: "1×", unit: 28000, total: 28000 },
        ],
        deposit: 280000,
        cancellation: "Storno zdarma do 60 dnů, pak 50 % do 21 dnů, plné při zrušení do 14 dnů.",
      },
    ],
  },

  konference: {
    id: "konference",
    label: "Korporátní konference",
    proposalNumber: "NAB-2026-0162",
    hotel: {
      name: "Hotel Balický",
      address: "Komenského 12, Olomouc",
      logo: "HB",
    },
    title: "Roční konference Helios Tech",
    subtitle: "Dvoudenní firemní setkání pro 40 účastníků",
    intro: "Dobrý den paní Veroniko,\n\nposíláme vám nabídku na vaši dvoudenní výroční konferenci. Zahrnuje pronájem hlavního sálu a 2 breakout místností, plnou penzi, coffee breaky a ubytování pro všech 40 účastníků v jednolůžkové konfiguraci.",
    dateLabel: "8. – 9. října 2026",
    dateStart: "2026-10-08",
    dateEnd: "2026-10-09",
    nights: 1,
    guests: { adults: 40, children: 0 },
    rooms: 40,
    expiresDays: 7,
    contact: {
      name: "Petr Doležal",
      role: "MICE manager",
      email: "mice@balicky.cz",
      phone: "+420 778 222 333",
      avatarBg: "#0EA5E9",
      initials: "PD",
    },
    photos: [
      { src: "assets/room-2.png", caption: "Hlavní konferenční sál" },
      { src: "assets/room-3.png", caption: "Breakout místnost" },
      { src: "assets/room-1.png", caption: "Standardní pokoj" },
    ],
    schedule: [
      { day: "Čtvrtek 8. 10.", time: "08:00", title: "Příjezd a registrace, ranní káva", loc: "Lobby", cat: "ubytovani" },
      { day: "Čtvrtek 8. 10.", time: "09:00", title: "Úvodní keynote", loc: "Hlavní sál", cat: "aktivita" },
      { day: "Čtvrtek 8. 10.", time: "10:30", title: "Coffee break", loc: "Foyer", cat: "strava" },
      { day: "Čtvrtek 8. 10.", time: "11:00", title: "Panely (2 paralelní)", loc: "Breakout A + B", cat: "aktivita" },
      { day: "Čtvrtek 8. 10.", time: "12:30", title: "Pracovní oběd", loc: "Restaurace", cat: "strava" },
      { day: "Čtvrtek 8. 10.", time: "14:00", title: "Workshopy", loc: "Hlavní sál + breakout", cat: "aktivita" },
      { day: "Čtvrtek 8. 10.", time: "15:30", title: "Coffee break", loc: "Foyer", cat: "strava" },
      { day: "Čtvrtek 8. 10.", time: "16:00", title: "Closing keynote dne 1", loc: "Hlavní sál", cat: "aktivita" },
      { day: "Čtvrtek 8. 10.", time: "19:00", title: "Networking večeře", loc: "Restaurace", cat: "strava" },
      { day: "Pátek 9. 10.", time: "07:00", title: "Snídaně", loc: "Restaurace", cat: "strava" },
      { day: "Pátek 9. 10.", time: "09:00", title: "Hlavní program — den 2", loc: "Hlavní sál", cat: "aktivita" },
      { day: "Pátek 9. 10.", time: "12:30", title: "Closing oběd", loc: "Restaurace", cat: "strava" },
      { day: "Pátek 9. 10.", time: "14:00", title: "Check-out", loc: "Recepce", cat: "ubytovani" },
    ],
    variants: [
      {
        id: "essentials",
        name: "Essentials",
        sub: "Sál + ubytování + plná penze",
        highlights: ["Pronájem hlavního sálu", "40× jednolůžkový pokoj", "Plná penze (snídaně, oběd, večeře)", "2× coffee break / den"],
        items: [
          { cat: "Ubytování", label: "40 jednolůžkových pokojů, 1 noc", qty: "40 ×", unit: 2400, total: 96000 },
          { cat: "Stravování", label: "Snídaně den 2", qty: "40 ×", unit: 280, total: 11200 },
          { cat: "Stravování", label: "Obědy (oba dny)", qty: "80 ×", unit: 420, total: 33600 },
          { cat: "Stravování", label: "Networking večeře", qty: "40 ×", unit: 680, total: 27200 },
          { cat: "Stravování", label: "Coffee breaky (4×)", qty: "160 ×", unit: 180, total: 28800 },
          { cat: "Pronájem prostor", label: "Pronájem hlavního sálu (2 dny)", qty: "2 dny", unit: 18000, total: 36000 },
        ],
        deposit: 70000,
        cancellation: "Storno zdarma do 21 dnů. Po této lhůtě 60 % z hodnoty pronájmu.",
      },
      {
        id: "business",
        name: "Business Plus",
        sub: "Sál + 2 breakouts, AV, moderátor, večerní program",
        recommended: true,
        highlights: ["Hlavní sál + 2 breakout místnosti", "Profi AV technika a moderátor", "40× pokoj + 4× upgrade", "Plná penze + premium coffee breaks", "Networking večeře s živou hudbou"],
        items: [
          { cat: "Ubytování", label: "40 jednolůžkových pokojů, 1 noc", qty: "40 ×", unit: 2400, total: 96000 },
          { cat: "Ubytování", label: "Upgrade 4 pokojů na Junior Suite", qty: "4 ×", unit: 800, total: 3200 },
          { cat: "Stravování", label: "Snídaně den 2", qty: "40 ×", unit: 280, total: 11200 },
          { cat: "Stravování", label: "Obědy (oba dny) — premium", qty: "80 ×", unit: 520, total: 41600 },
          { cat: "Stravování", label: "Networking večeře + ochutnávka vín", qty: "40 ×", unit: 950, total: 38000 },
          { cat: "Stravování", label: "Premium coffee breaky (4×)", qty: "160 ×", unit: 260, total: 41600 },
          { cat: "Pronájem prostor", label: "Hlavní sál (2 dny)", qty: "2 dny", unit: 18000, total: 36000 },
          { cat: "Pronájem prostor", label: "2× breakout místnost (2 dny)", qty: "2 dny", unit: 9000, total: 18000 },
          { cat: "Aktivity", label: "AV technika + moderátor", qty: "2 dny", unit: 22000, total: 44000 },
          { cat: "Aktivity", label: "Živá hudba k networking večeři", qty: "3 h", unit: 12000, total: 12000 },
        ],
        deposit: 120000,
        cancellation: "Storno zdarma do 30 dnů, 50 % do 14 dnů, plné při zrušení do 7 dnů.",
      },
      {
        id: "executive",
        name: "Executive Retreat",
        sub: "Privátní pronájem patra, koncert, teambuilding",
        highlights: ["Privátní pronájem konferenčního patra", "VIP suite pro speakery (4×)", "Soukromý chef tasting menu", "Wellness večerní program", "Teambuilding den 2"],
        items: [
          { cat: "Ubytování", label: "40 pokojů Premium, 1 noc", qty: "40 ×", unit: 3200, total: 128000 },
          { cat: "Ubytování", label: "4× VIP suite pro speakery", qty: "4 ×", unit: 5800, total: 23200 },
          { cat: "Stravování", label: "Snídaně den 2", qty: "40 ×", unit: 380, total: 15200 },
          { cat: "Stravování", label: "Pracovní obědy (oba dny)", qty: "80 ×", unit: 680, total: 54400 },
          { cat: "Stravování", label: "Chef tasting menu (6 chodů)", qty: "40 ×", unit: 1850, total: 74000 },
          { cat: "Stravování", label: "Premium coffee + barista", qty: "2 dny", unit: 22000, total: 44000 },
          { cat: "Pronájem prostor", label: "Privátní celé konf. patro", qty: "2 dny", unit: 48000, total: 96000 },
          { cat: "Aktivity", label: "AV + překlad + moderátor", qty: "2 dny", unit: 38000, total: 76000 },
          { cat: "Aktivity", label: "Teambuilding (escape room + lanovka)", qty: "1 den", unit: 56000, total: 56000 },
          { cat: "Aktivity", label: "Privátní wellness večer", qty: "3 h", unit: 28000, total: 28000 },
        ],
        deposit: 220000,
        cancellation: "Storno zdarma do 45 dnů, 50 % do 21 dnů, plné při zrušení do 10 dnů.",
      },
    ],
  },

  skupina: {
    id: "skupina",
    label: "Skupinový wellness pobyt",
    proposalNumber: "NAB-2026-0177",
    hotel: {
      name: "Lázně Jeseník",
      address: "Pasteurova 12, Jeseník",
      logo: "LJ",
    },
    title: "Wellness víkend pro skupinu přátel",
    subtitle: "Prodloužený víkend pro 20 osob s plnou penzí",
    intro: "Vážená paní Hano,\n\nposíláme nabídku na prodloužený víkend pro 20 osob — wellness, plnou penzi a privátní procedury. Termín je předjednán, kapacita pokojů je rezervována podmínečně 14 dnů od přijetí nabídky.",
    dateLabel: "23. – 26. října 2026",
    dateStart: "2026-10-23",
    dateEnd: "2026-10-26",
    nights: 3,
    guests: { adults: 18, children: 2 },
    rooms: 11,
    expiresDays: 14,
    contact: {
      name: "Lucie Šimečková",
      role: "Group reservations",
      email: "skupiny@lazne-jesenik.cz",
      phone: "+420 720 555 100",
      avatarBg: "#16A34A",
      initials: "LŠ",
    },
    photos: [
      { src: "assets/room-3.png", caption: "Dvoulůžkový pokoj Comfort" },
      { src: "assets/room-1.png", caption: "Lázeňská hala" },
      { src: "assets/room-2.png", caption: "Apartmán Suite" },
    ],
    schedule: [
      { day: "Pátek 23. 10.", time: "15:00", title: "Check-in a uvítací drink", loc: "Recepce", cat: "ubytovani" },
      { day: "Pátek 23. 10.", time: "17:00", title: "Komentovaná prohlídka lázní", loc: "Lázeňská hala", cat: "aktivita" },
      { day: "Pátek 23. 10.", time: "19:00", title: "Slavnostní večeře", loc: "Restaurace", cat: "strava" },
      { day: "Sobota 24. 10.", time: "08:00", title: "Snídaně", loc: "Restaurace", cat: "strava" },
      { day: "Sobota 24. 10.", time: "10:00", title: "Skupinové procedury (sauna + masáže)", loc: "Wellness", cat: "aktivita" },
      { day: "Sobota 24. 10.", time: "13:00", title: "Oběd", loc: "Restaurace", cat: "strava" },
      { day: "Sobota 24. 10.", time: "15:00", title: "Volný čas + bazén", loc: "Lázně", cat: "aktivita" },
      { day: "Sobota 24. 10.", time: "19:00", title: "Tematická večeře", loc: "Restaurace", cat: "strava" },
      { day: "Neděle 25. 10.", time: "08:00", title: "Snídaně", loc: "Restaurace", cat: "strava" },
      { day: "Neděle 25. 10.", time: "10:00", title: "Výlet do okolí (volitelně)", loc: "Sraz lobby", cat: "aktivita" },
      { day: "Pondělí 26. 10.", time: "10:00", title: "Snídaně + check-out", loc: "Restaurace", cat: "ubytovani" },
    ],
    variants: [
      {
        id: "comfort",
        name: "Comfort",
        sub: "Plná penze + lázeňský vstup",
        recommended: true,
        highlights: ["11 pokojů na 3 noci", "Plná penze (3×)", "Neomezený vstup do lázní", "1× skupinová masáž"],
        items: [
          { cat: "Ubytování", label: "11 pokojů Comfort, 3 noci", qty: "11 × 3", unit: 2800, total: 92400 },
          { cat: "Stravování", label: "Snídaně (20 osob × 3 dny)", qty: "60 ×", unit: 320, total: 19200 },
          { cat: "Stravování", label: "Obědy (20 × 2 dny)", qty: "40 ×", unit: 380, total: 15200 },
          { cat: "Stravování", label: "Večeře (20 × 3 dny)", qty: "60 ×", unit: 520, total: 31200 },
          { cat: "Aktivity", label: "Vstup do lázní (neomezeně)", qty: "20 × 3", unit: 180, total: 10800 },
          { cat: "Aktivity", label: "Skupinová masáž (45 min)", qty: "20 ×", unit: 520, total: 10400 },
        ],
        deposit: 40000,
        cancellation: "Storno zdarma do 14 dnů před nástupem.",
      },
      {
        id: "spa",
        name: "Spa Premium",
        sub: "Suite upgrade + procedury à la carte",
        highlights: ["11 pokojů Suite", "Plná penze (3×)", "Privátní wellness 2× h", "2× procedura na osobu z menu", "Welcome rituál"],
        items: [
          { cat: "Ubytování", label: "11× Apartmán Suite, 3 noci", qty: "11 × 3", unit: 3900, total: 128700 },
          { cat: "Stravování", label: "Snídaně (20 osob × 3 dny)", qty: "60 ×", unit: 380, total: 22800 },
          { cat: "Stravování", label: "Obědy (20 × 2 dny)", qty: "40 ×", unit: 480, total: 19200 },
          { cat: "Stravování", label: "Slavnostní večeře (3×)", qty: "60 ×", unit: 780, total: 46800 },
          { cat: "Aktivity", label: "Privátní wellness 2× 2 h", qty: "4 h", unit: 6500, total: 26000 },
          { cat: "Aktivity", label: "2× procedura na osobu", qty: "40 ×", unit: 690, total: 27600 },
          { cat: "Ostatní", label: "Welcome rituál (lázně, drink, dárek)", qty: "20 ×", unit: 320, total: 6400 },
        ],
        deposit: 60000,
        cancellation: "Storno zdarma do 21 dnů, 50 % do 7 dnů.",
      },
    ],
  },
};

// Editable extra services (granular edit)
const PROPOSAL_EXTRAS = [
  { id: "wine", label: "Lahev Veuve Clicquot Brut Nature", sub: "Šumivé víno 0.75 l", price: 1290, unit: "kus" },
  { id: "fruit", label: "Ovocná mísa na pokoj", sub: "Výběr čerstvého ovoce", price: 250, unit: "kus" },
  { id: "flowers", label: "Kytice růží na pokoji", sub: "30 ks růží", price: 890, unit: "kus" },
  { id: "transfer", label: "Transfer limuzínou", sub: "Hotel – letiště nebo naopak", price: 750, unit: "kus" },
  { id: "insurance", label: "Pojištění HotelStorno™ ERV", sub: "Pro případ náhlého zrušení", price: 400, unit: "osoba" },
  { id: "parking", label: "Parkování v garáži", sub: "Krytá garáž, na celý pobyt", price: 200, unit: "den" },
];

// VAT rates per category
const PROPOSAL_VAT = {
  "Ubytování": 0.12,
  "Stravování": 0.12,
  "Pronájem prostor": 0.21,
  "Aktivity": 0.21,
  "Ostatní": 0.21,
};

const PROPOSAL_CATEGORY_ICONS = {
  "Ubytování": "bed",
  "Stravování": "leaf",
  "Pronájem prostor": "size",
  "Aktivity": "sparkle",
  "Ostatní": "tag",
};

// Decline reason categories
const PROPOSAL_DECLINE_REASONS = [
  { id: "price", label: "Cena nevyhovuje" },
  { id: "term", label: "Termín nevyhovuje" },
  { id: "capacity", label: "Kapacita nedostačuje" },
  { id: "competitor", label: "Vybrali jsme konkurenci" },
  { id: "cancelled", label: "Akce se nekoná" },
  { id: "other", label: "Jiný důvod" },
];

window.PROPOSAL_SCENARIOS = PROPOSAL_SCENARIOS;
window.PROPOSAL_EXTRAS = PROPOSAL_EXTRAS;
window.PROPOSAL_VAT = PROPOSAL_VAT;
window.PROPOSAL_CATEGORY_ICONS = PROPOSAL_CATEGORY_ICONS;
window.PROPOSAL_DECLINE_REASONS = PROPOSAL_DECLINE_REASONS;

// Helpers
window.fmtProposal = (n) => Math.round(n).toLocaleString("cs-CZ");
window.proposalSubtotalByCategory = (items) => {
  const map = new Map();
  items.forEach((it) => {
    map.set(it.cat, (map.get(it.cat) || 0) + it.total);
  });
  return [...map.entries()].map(([cat, sum]) => ({ cat, sum }));
};
window.proposalTotals = (items) => {
  let net = 0, vat = 0;
  items.forEach((it) => {
    const rate = PROPOSAL_VAT[it.cat] ?? 0.21;
    const itemNet = it.total / (1 + rate);
    net += itemNet;
    vat += it.total - itemNet;
  });
  return { net, vat, gross: net + vat };
};
