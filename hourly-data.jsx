// Hourly hotel data — rooms with hourly pricing + bookings (occupied slots)
//
// Time is expressed as quarter-hour offsets from start-of-day (0..95 for one day).
// To support cross-midnight stays we work over a 48-hour window: today (0..95)
// and tomorrow (96..191). Slot index N → minute N*15.

window.HOURLY_TODAY = new Date(2026, 4, 22, 0, 0); // Friday
window.HOURLY_NOW_QH = (14 * 4) + 2;               // 14:30 — "current time" for greying out past

// Quarter-hour helpers ─────────────────────────────────────────────────────────
window.qhToLabel = function (qh) {
  const m = ((qh % 96) + 96) % 96;
  const h = Math.floor(m / 4);
  const min = (m % 4) * 15;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

window.qhToDayLabel = function (qh) {
  if (qh < 96) return "dnes";
  if (qh < 192) return "zítra";
  return "+2 dny";
};

window.durationToLabel = function (qh) {
  if (qh <= 0) return "0 min";
  const totalMin = qh * 15;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
};

// Pricing — progressive: first 2h flat base, each next 15 min adds a step.
// Crossing midnight adds a fixed night surcharge.
window.priceForRoom = function (room, startQH, endQH) {
  if (endQH <= startQH) return null;
  const qhDur = endQH - startQH;

  const minQH = 4; // minimum 1 hour
  if (qhDur < minQH) return null;

  // Base for first 2h, then per-15min step.
  // 2h = 8 qh.
  const base = room.pricing.base;
  const stepAfter2h = room.pricing.stepAfter2h; // per 15 min
  const overnightFlat = room.pricing.overnight; // flat for >= 8h overnight (incl. cross-midnight)

  // Overnight detection: any slot ∈ [22:00..06:00) on either day
  const crossesNight = (() => {
    for (let q = startQH; q < endQH; q++) {
      const m = ((q % 96) + 96) % 96;
      const h = Math.floor(m / 4);
      if (h >= 22 || h < 6) return true;
    }
    return false;
  })();

  // If >= 8h AND crosses night → overnight flat (best deal)
  if (qhDur >= 32 && crossesNight && overnightFlat) {
    return { total: overnightFlat, mode: "overnight" };
  }

  const billable = Math.max(0, qhDur - 8); // qh beyond first 2h
  let total = base + billable * stepAfter2h;
  if (crossesNight) total += room.pricing.nightSurcharge;
  return { total, mode: "duration" };
};

// Rooms — based on data.jsx but adapted for hourly use case ───────────────────
window.HOURLY_ROOMS = [
  {
    id: "h-501",
    name: "Dvoulůžkový Standard",
    number: "501",
    image: "assets/room-2.png",
    beds: "Manželská postel",
    capacity: "2 osoby",
    size: 22,
    view: "Vnitroblok",
    tags: ["Standard"],
    amenities: ["Manželská postel", "Sprchový kout", "WiFi zdarma", "Klimatizace", "Televize"],
    remaining: 3,
    pricing: { base: 900, stepAfter2h: 110, nightSurcharge: 300, overnight: 2400 },
    // bookings within day 0 (today) — quarter-hour ranges
    bookings: [
      { startQH: 36, endQH: 44 },   // 09:00–11:00
      { startQH: 56, endQH: 64 },   // 14:00–16:00
      { startQH: 76, endQH: 84 },   // 19:00–21:00
    ],
    bookingsTomorrow: [
      { startQH: 32, endQH: 40 },   // 08:00–10:00 tomorrow
      { startQH: 60, endQH: 70 },   // 15:00–17:30
    ],
  },
  {
    id: "h-107",
    name: "Dvoulůžkový Deluxe",
    number: "107",
    image: "assets/room-1.png",
    beds: "King size postel",
    capacity: "2 osoby",
    size: 30,
    view: "Výhled do zahrady",
    tags: ["Deluxe", "Oblíbené"],
    amenities: ["King size postel", "Vana + sprchový kout", "Smart TV", "WiFi zdarma", "Klimatizace", "Mini-bar"],
    remaining: 2,
    pricing: { base: 1200, stepAfter2h: 150, nightSurcharge: 400, overnight: 3200 },
    bookings: [
      { startQH: 28, endQH: 36 },   // 07:00–09:00
      { startQH: 48, endQH: 60 },   // 12:00–15:00
      { startQH: 72, endQH: 80 },   // 18:00–20:00
    ],
    bookingsTomorrow: [
      { startQH: 40, endQH: 52 },   // 10:00–13:00
    ],
  },
  {
    id: "h-201",
    name: "Dvoulůžkový Executive",
    number: "201",
    image: "assets/room-3.png",
    beds: "King size + rozkládací",
    capacity: "2–3 osoby",
    size: 38,
    view: "Výhled do parku",
    tags: ["Executive"],
    amenities: ["King size postel", "Vana + sprchový kout", "Smart TV", "Mini-bar", "Trezor", "Klimatizace"],
    remaining: null,
    pricing: { base: 1500, stepAfter2h: 180, nightSurcharge: 500, overnight: 3900 },
    bookings: [
      { startQH: 44, endQH: 52 },   // 11:00–13:00
      { startQH: 68, endQH: 76 },   // 17:00–19:00
    ],
    bookingsTomorrow: [
      { startQH: 36, endQH: 48 },
    ],
  },
  {
    id: "h-301",
    name: "Junior Suite",
    number: "301",
    image: "assets/room-1.png",
    beds: "King size + pohovka",
    capacity: "2 osoby",
    size: 44,
    view: "Výhled na náměstí",
    tags: ["Suite", "Luxusní"],
    amenities: ["King size postel", "Obývací kout", "Vířivka", "Smart TV", "Espresso kávovar", "Mini-bar"],
    remaining: 1,
    pricing: { base: 2200, stepAfter2h: 240, nightSurcharge: 600, overnight: 5400 },
    bookings: [
      { startQH: 32, endQH: 40 },
      { startQH: 64, endQH: 80 },   // 16:00–20:00
    ],
    bookingsTomorrow: [
      { startQH: 48, endQH: 60 },
    ],
  },
];

// Build a unified bookings array over 0..192 (today + tomorrow) for a room
window.bookingsFor = function (room) {
  const out = [];
  (room.bookings || []).forEach(b => out.push({ startQH: b.startQH, endQH: b.endQH }));
  (room.bookingsTomorrow || []).forEach(b => out.push({ startQH: b.startQH + 96, endQH: b.endQH + 96 }));
  return out;
};

// Returns true if [startQH, endQH) overlaps any booking
window.isRangeFree = function (room, startQH, endQH) {
  const list = window.bookingsFor(room);
  for (const b of list) {
    if (startQH < b.endQH && b.startQH < endQH) return false;
  }
  return true;
};

// Date helpers ───────────────────────────────────────────────────────────────
window.H_WEEKDAYS = ["po", "út", "st", "čt", "pá", "so", "ne"];
window.H_MONTHS = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

window.hAddDays = function (d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
window.hSameDay = function (a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); };
window.hFmtCzech = function (d) {
  const wd = window.H_WEEKDAYS[(d.getDay() + 6) % 7];
  return `${wd} ${d.getDate()}. ${d.getMonth() + 1}.`;
};
