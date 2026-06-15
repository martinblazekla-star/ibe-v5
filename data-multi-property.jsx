// Multi-property mode — Balický Collection
// Fictional 10-hotel chain across Czech Republic.
//
// Each hotel exposes:
//   id, name, brand (sub-brand), city, region, stars, type, image[],
//   address, gps:{lat,lng}, mapCoords:{x,y}   ← SVG-space coordinates (1000×640)
//   rating, reviews, reviewsByPlatform[], badges[], tags[], amenities[],
//   description (intl-style intro), highlights[], nearby[]
//   roomsAvailable, fromPrice, originalPrice?
//   topReviews[] (2-3 short ones for dialog)
//
// Coordinates were computed from real lat/lng:
//   x = ((lng-12)/7) * 1000     y = ((51-lat)/2.5) * 640
//
// Hotel image is a placeholder room photo (assets/room-*.png) cycled across
// the chain. We layer city/brand labels visually instead of unique imagery.

window.MP_HOTEL_TYPES = [
  { id: "city",     label: "City Hotel" },
  { id: "wellness", label: "Wellness & Spa" },
  { id: "boutique", label: "Boutique" },
  { id: "resort",   label: "Resort" },
];

window.MP_BRANDS = [
  { id: "grand",    label: "Grand",    desc: "Vlajkové 5★ hotely v krajských metropolích" },
  { id: "town",     label: "Town",     desc: "4★ městské hotely pro businessové i víkendové pobyty" },
  { id: "spa",      label: "Spa",      desc: "Lázeňské resorty s vlastními procedurami" },
  { id: "heritage", label: "Heritage", desc: "Boutique hotely v památkových objektech" },
  { id: "mountain", label: "Mountain", desc: "Horské resorty pro celý rok" },
];

window.MP_HOTELS = [
  {
    id: "praha-grand",
    name: "Balický Grand Praha",
    brand: "grand",
    city: "Praha",
    cityArea: "Staré Město",
    region: "Středočeský",
    stars: 5,
    type: "city",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    address: "Pařížská 14, 110 00 Praha 1",
    gps: { lat: 50.0905, lng: 14.4202 },
    mapCoords: { x: 346, y: 235 },
    rating: 9.4, reviews: 2418,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.3, count: 1280 },
      { source: "Google",      score: 4.7, count:  812 },
      { source: "Tripadvisor", score: 4.6, count:  326 },
    ],
    badges: ["Bestseller", "Členská cena −10 %"],
    tags: ["Centrum", "Historický objekt", "Snídaně v ceně"],
    amenities: ["wellness", "parking", "restaurace", "bar", "fitness", "concierge", "wifi", "pet"],
    description:
      "Vlajková loď kolekce v secesním paláci na Pařížské. Pět minut pěšky od Staroměstského náměstí, " +
      "se střešní terasou s výhledem na Hrad a vyhlášenou restaurací Edvard. " +
      "Zachované art-déco interiéry, knihovna z roku 1908 a největší hotelové spa v centru.",
    highlights: ["Střešní bar & terasa", "Spa 1 200 m²", "24h concierge", "Hotelová limuzína"],
    nearby: ["Staroměstské nám. · 5 min", "Židovské muzeum · 2 min", "Národní divadlo · 12 min"],
    roomsAvailable: 4,
    fromPrice: 6800,
    originalPrice: 7600,
    discountPct: 10,
    memberPrice: 6120,
    topReviews: [
      { name: "Eliška K.", date: "duben 2026", score: 9.8, body: "Nadstandardní servis, krásná restaurace a klidná lokalita i v sezóně. Stálo to za každou korunu." },
      { name: "Tomáš H.",  date: "březen 2026", score: 9.4, body: "Skvělý wellness, příjemný personál, snídaně luxusní. Recepce vyřešila pozdní check-in bez problému." },
    ],
  },

  {
    id: "praha-heritage",
    name: "Balický Heritage Malá Strana",
    brand: "heritage",
    city: "Praha",
    cityArea: "Malá Strana",
    region: "Středočeský",
    stars: 4,
    type: "boutique",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-1.png", "assets/room-3.png"],
    address: "Tržiště 17, 118 00 Praha 1",
    gps: { lat: 50.0865, lng: 14.4042 },
    mapCoords: { x: 335, y: 244 },
    rating: 9.2, reviews: 1106,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.2, count: 612 },
      { source: "Google",      score: 4.7, count: 348 },
      { source: "Tripadvisor", score: 4.8, count: 146 },
    ],
    badges: ["Boutique", "Jen pro dospělé"],
    tags: ["Boutique", "Historický objekt", "Snídaně v ceně"],
    amenities: ["restaurace", "bar", "concierge", "wifi", "pet"],
    description:
      "Renesanční dům pod Pražským hradem s 24 jedinečnými pokoji. Žádný pokoj se nepodobá druhému: " +
      "fresky, trámové stropy a originální art na míru. Hotel je situovaný v klidné uličce nad " +
      "Nerudovou — pět minut pěšky od Karlova mostu, ale bez ruchu turistických tras.",
    highlights: ["24 unikátních pokojů", "Bistro Mlynář", "Concierge & průvodci"],
    nearby: ["Karlův most · 5 min", "Pražský hrad · 8 min", "Vrtbovská zahrada · 2 min"],
    roomsAvailable: 2,
    fromPrice: 5200,
    discountPct: 0,
    memberPrice: 4680,
    topReviews: [
      { name: "Sofia M.", date: "květen 2026", score: 10, body: "Nejkrásnější hotel, kde jsme kdy byli. Personál si pamatoval naše jména už druhý den." },
      { name: "Jan D.",   date: "duben 2026", score: 8.8, body: "Atmosféra na jedničku, jen pozor — část pokojů má omezený výhled. Vyplatí se zaplatit za vyšší kategorii." },
    ],
  },

  {
    id: "karlovy-vary-spa",
    name: "Balický Spa Karlovy Vary",
    brand: "spa",
    city: "Karlovy Vary",
    cityArea: "Lázeňská kolonáda",
    region: "Karlovarský",
    stars: 5,
    type: "wellness",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-1.png", "assets/room-2.png"],
    address: "Mariánskolázeňská 2, 360 01 Karlovy Vary",
    gps: { lat: 50.2306, lng: 12.8731 },
    mapCoords: { x: 124, y: 197 },
    rating: 9.5, reviews: 3210,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.4, count: 1812 },
      { source: "Google",      score: 4.8, count:  978 },
      { source: "Tripadvisor", score: 4.7, count:  420 },
    ],
    badges: ["Top wellness", "Členská cena −10 %"],
    tags: ["Lázně", "Polopenze v ceně", "Termální prameny"],
    amenities: ["wellness", "spa", "parking", "restaurace", "bar", "fitness", "pool", "wifi"],
    description:
      "Historický lázeňský dům přímo na kolonádě. Vlastní pramen, lékařský tým a celoroční " +
      "balíčky léčebných procedur. Polopenze v ceně, dietní kuchyně s vlastním dietologem. " +
      "Bazén s termální vodou je otevřený 6–22 hod.",
    highlights: ["Vlastní pramen v hale", "Lékařský tým 24/7", "Bazén 6–22 hod"],
    nearby: ["Vřídelní kolonáda · 3 min", "Lanovka Diana · 5 min", "Becherovka muzeum · 8 min"],
    roomsAvailable: 7,
    fromPrice: 5400,
    originalPrice: 5900,
    discountPct: 8,
    memberPrice: 4860,
    topReviews: [
      { name: "Marie F.", date: "květen 2026", score: 9.9, body: "Vrátili jsme se po roce a opět skvělé. Lékař si vyhradil 20 minut, procedury byly přesně to, co jsem potřebovala." },
      { name: "Petr B.",  date: "duben 2026", score: 9.2, body: "Strava lehká a chutná. Bazén úžasný brzo ráno, kdy je prázdný." },
    ],
  },

  {
    id: "marianske-spa",
    name: "Balický Spa Mariánské Lázně",
    brand: "spa",
    city: "Mariánské Lázně",
    cityArea: "Lázeňské centrum",
    region: "Karlovarský",
    stars: 5,
    type: "wellness",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    address: "Goethovo nám. 8, 353 01 Mariánské Lázně",
    gps: { lat: 49.9648, lng: 12.7011 },
    mapCoords: { x: 100, y: 266 },
    rating: 9.3, reviews: 1825,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.3, count: 1004 },
      { source: "Google",      score: 4.7, count:  524 },
      { source: "Tripadvisor", score: 4.7, count:  297 },
    ],
    badges: ["Polopenze", "Pet-friendly"],
    tags: ["Lázně", "Plná penze", "Park"],
    amenities: ["wellness", "spa", "parking", "restaurace", "bar", "pool", "wifi", "pet"],
    description:
      "Klasický lázeňský dům s vlastním parkem o rozloze 4 ha. Plně vybavené spa, plná penze " +
      "s ohledem na lázeňské diety. Hudební pavilon přímo u hotelu — koncerty každý čtvrtek.",
    highlights: ["Vlastní park 4 ha", "Plná penze v ceně", "Hudební pavilon"],
    nearby: ["Zpívající fontána · 3 min", "Klášter Teplá · 25 min autem", "Golf 18 jamek · 10 min"],
    roomsAvailable: 11,
    fromPrice: 4600,
    discountPct: 0,
    memberPrice: 4140,
    topReviews: [
      { name: "Alena P.", date: "květen 2026", score: 9.5, body: "Hotel v krásném parku, vyhřátý bazén i v dubnu. Polopenze chutná a dietně velmi pestrá." },
    ],
  },

  {
    id: "brno-town",
    name: "Balický Town Brno",
    brand: "town",
    city: "Brno",
    cityArea: "Centrum",
    region: "Jihomoravský",
    stars: 4,
    type: "city",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-1.png", "assets/room-3.png"],
    address: "Husova 4, 602 00 Brno",
    gps: { lat: 49.1944, lng: 16.6088 },
    mapCoords: { x: 659, y: 463 },
    rating: 8.9, reviews: 1640,
    reviewsByPlatform: [
      { source: "Booking",     score: 8.9, count: 982 },
      { source: "Google",      score: 4.6, count: 451 },
      { source: "Tripadvisor", score: 4.5, count: 207 },
    ],
    badges: ["Pracovní zóna"],
    tags: ["Business", "Konference", "Centrum"],
    amenities: ["parking", "restaurace", "bar", "fitness", "wifi", "concierge"],
    description:
      "Moderní 4★ hotel kousek od Špilberku, ideální pro pracovní cesty i víkendové výlety. " +
      "Konferenční sály pro 8–200 osob, ranní kávovary v lobby od 6:00, parkování v ceně.",
    highlights: ["Konferenční sály 8–200 osob", "Garáže v ceně", "Coworking lobby"],
    nearby: ["Špilberk · 8 min", "Náměstí Svobody · 5 min", "Vlakové nádraží · 10 min"],
    roomsAvailable: 12,
    fromPrice: 2900,
    originalPrice: 3400,
    discountPct: 15,
    memberPrice: 2610,
    topReviews: [
      { name: "Lukáš J.", date: "květen 2026", score: 9.0, body: "Praktický business hotel — rychlý check-in, dobrá WiFi, příjemná snídaně. Doporučuji." },
    ],
  },

  {
    id: "krumlov-heritage",
    name: "Balický Heritage Český Krumlov",
    brand: "heritage",
    city: "Český Krumlov",
    cityArea: "Latrán",
    region: "Jihočeský",
    stars: 4,
    type: "boutique",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-1.png", "assets/room-2.png"],
    address: "Latrán 38, 381 01 Český Krumlov",
    gps: { lat: 48.8127, lng: 14.3175 },
    mapCoords: { x: 331, y: 561 },
    rating: 9.6, reviews: 924,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.5, count: 480 },
      { source: "Google",      score: 4.8, count: 312 },
      { source: "Tripadvisor", score: 4.9, count: 132 },
    ],
    badges: ["Nejlépe hodnocené", "Boutique"],
    tags: ["UNESCO", "Boutique", "Snídaně v ceně"],
    amenities: ["restaurace", "bar", "wifi", "concierge"],
    description:
      "Boutique hotel v renesančním domě v Latránu, pět minut od zámecké brány. " +
      "Devět pokojů, vlastní vinný sklep ze 17. století, ranní snídaně se sýry " +
      "z místní farmy. Hotel je součástí památkové zóny UNESCO.",
    highlights: ["9 unikátních pokojů", "Vinný sklep 17. století", "UNESCO zóna"],
    nearby: ["Zámek · 5 min", "Náměstí Svornosti · 7 min", "Vltava · 1 min"],
    roomsAvailable: 1,
    fromPrice: 4400,
    discountPct: 0,
    memberPrice: 3960,
    topReviews: [
      { name: "Hannah R.", date: "květen 2026", score: 10, body: "A magical place. The breakfast was beautiful and the staff went above and beyond." },
      { name: "David K.",  date: "duben 2026", score: 9.6, body: "Krásně zrekonstruovaný dům, fascinující detaily. Klidné parkování bohužel ne." },
    ],
  },

  {
    id: "spindl-mountain",
    name: "Balický Mountain Špindlerův Mlýn",
    brand: "mountain",
    city: "Špindlerův Mlýn",
    cityArea: "Svatý Petr",
    region: "Královéhradecký",
    stars: 4,
    type: "resort",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    address: "Svatý Petr 142, 543 51 Špindlerův Mlýn",
    gps: { lat: 50.7234, lng: 15.6113 },
    mapCoords: { x: 516, y: 71 },
    rating: 9.1, reviews: 2188,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.0, count: 1124 },
      { source: "Google",      score: 4.7, count:  742 },
      { source: "Tripadvisor", score: 4.6, count:  322 },
    ],
    badges: ["Ski-in / ski-out", "Pet-friendly"],
    tags: ["Hory", "Polopenze", "Ski-in"],
    amenities: ["wellness", "spa", "parking", "restaurace", "bar", "fitness", "pool", "wifi", "pet"],
    description:
      "Horský resort přímo na sjezdovce sv. Petr. V létě cyklotrasy a turistika, v zimě " +
      "ski-in/out přístup. Saunový svět 600 m² s panoramatickými okny, dětská herna a apré-ski bar. " +
      "Polopenze v ceně, dietní kuchyně pro děti.",
    highlights: ["Ski-in / ski-out", "Saunový svět 600 m²", "Půjčovna lyží & kol"],
    nearby: ["Lanovka sv. Petr · 80 m", "Sjezdovka Hromovka · 5 min", "Krkonošský NP"],
    roomsAvailable: 5,
    fromPrice: 4200,
    originalPrice: 4800,
    discountPct: 13,
    memberPrice: 3780,
    topReviews: [
      { name: "Marcela H.", date: "duben 2026", score: 9.4, body: "Strávili jsme týden a děti chtěly zůstat. Saunový svět je pohádka." },
    ],
  },

  {
    id: "olomouc-heritage",
    name: "Balický Heritage Olomouc",
    brand: "heritage",
    city: "Olomouc",
    cityArea: "Horní náměstí",
    region: "Olomoucký",
    stars: 4,
    type: "boutique",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-3.png", "assets/room-1.png"],
    address: "Horní nám. 14, 779 00 Olomouc",
    gps: { lat: 49.5938, lng: 17.2509 },
    mapCoords: { x: 750, y: 361 },
    rating: 9.0, reviews: 712,
    reviewsByPlatform: [
      { source: "Booking",     score: 9.0, count: 412 },
      { source: "Google",      score: 4.7, count: 218 },
      { source: "Tripadvisor", score: 4.6, count:  82 },
    ],
    badges: ["Boutique"],
    tags: ["UNESCO", "Boutique", "Centrum"],
    amenities: ["restaurace", "bar", "wifi", "concierge"],
    description:
      "Boutique hotel v měšťanském domě na Horním náměstí, přímo u sloupu Nejsvětější Trojice. " +
      "Sedmnáct pokojů, vlastní kavárna, raw breakfast a moravská snídaně do 11 hodin. " +
      "Hosté mají zdarma vstup do hanáckého muzea v sousedství.",
    highlights: ["17 pokojů", "Snídaně do 11", "Volný vstup do muzea"],
    nearby: ["Sloup Nejsv. Trojice · 50 m", "Katedrála sv. Václava · 8 min", "Bezručovy sady · 5 min"],
    roomsAvailable: 6,
    fromPrice: 3100,
    discountPct: 0,
    memberPrice: 2790,
    topReviews: [
      { name: "Klára N.", date: "květen 2026", score: 9.4, body: "Krásný, klidný a v centru. Snídaně byla nejlepší, co jsem v hotelu měla." },
    ],
  },

  {
    id: "plzen-town",
    name: "Balický Town Plzeň",
    brand: "town",
    city: "Plzeň",
    cityArea: "Republiky",
    region: "Plzeňský",
    stars: 3,
    type: "city",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-1.png", "assets/room-2.png"],
    address: "Riegrova 10, 301 00 Plzeň",
    gps: { lat: 49.7475, lng: 13.3776 },
    mapCoords: { x: 196, y: 320 },
    rating: 8.6, reviews: 982,
    reviewsByPlatform: [
      { source: "Booking",     score: 8.7, count: 612 },
      { source: "Google",      score: 4.5, count: 248 },
      { source: "Tripadvisor", score: 4.4, count: 122 },
    ],
    badges: ["Nejlevnější", "Pet-friendly"],
    tags: ["Centrum", "Snídaně volitelná"],
    amenities: ["parking", "restaurace", "wifi", "pet"],
    description:
      "Praktický 3★ hotel pět minut od náměstí Republiky. Pivovarské tipy na recepci, " +
      "půjčovna kol zdarma a parkování v zadním dvoře. Vhodný pro krátké městské pobyty.",
    highlights: ["Půjčovna kol zdarma", "Pivovarské tipy", "Parkování ve dvoře"],
    nearby: ["Nám. Republiky · 5 min", "Pivovar Pilsner Urquell · 12 min", "Loosovy interiéry · 8 min"],
    roomsAvailable: 14,
    fromPrice: 1900,
    originalPrice: 2200,
    discountPct: 14,
    memberPrice: 1710,
    topReviews: [
      { name: "Honza M.", date: "duben 2026", score: 8.6, body: "Cenově skvělé, čistý pokoj a slušná snídaně. Není to luxus, ale za ty peníze nemám výhrad." },
    ],
  },

  {
    id: "ostrava-town",
    name: "Balický Town Ostrava",
    brand: "town",
    city: "Ostrava",
    cityArea: "Stodolní",
    region: "Moravskoslezský",
    stars: 4,
    type: "city",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    address: "Stodolní 18, 702 00 Ostrava",
    gps: { lat: 49.8344, lng: 18.2823 },
    mapCoords: { x: 897, y: 300 },
    rating: 8.8, reviews: 1244,
    reviewsByPlatform: [
      { source: "Booking",     score: 8.8, count: 728 },
      { source: "Google",      score: 4.6, count: 374 },
      { source: "Tripadvisor", score: 4.5, count: 142 },
    ],
    badges: ["Členská cena −10 %"],
    tags: ["Business", "Centrum", "Snídaně v ceně"],
    amenities: ["parking", "restaurace", "bar", "fitness", "wifi"],
    description:
      "4★ hotel ve Stodolní ulici, oblíbený pro business cesty do Dolní oblasti Vítkovic. " +
      "Konferenční zázemí, garáže pod hotelem, ranní snídaně formou bufetu. Ke staré tramvajové zastávce minuta pěšky.",
    highlights: ["Garáže pod hotelem", "Konference do 80 osob", "5 min na Karolinu"],
    nearby: ["Dolní Vítkovice · 10 min", "Karolina · 5 min", "Lanové centrum · 8 min"],
    roomsAvailable: 9,
    fromPrice: 2400,
    discountPct: 0,
    memberPrice: 2160,
    topReviews: [
      { name: "Pavel S.", date: "květen 2026", score: 9.0, body: "Pro pracovní cestu ideální — rychle, prakticky, snídaně v 6 ráno." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Filters
// ─────────────────────────────────────────────────────────────────────────────

window.MP_FILTER_DEFAULTS = {
  cities: [],          // string[] of city names
  types: [],           // hotel type ids: "city" / "wellness" / "boutique" / "resort"
  stars: [],           // number[] of star counts: 3 / 4 / 5
  amenities: [],       // amenity tokens
  minRating: 0,        // 0 / 8 / 8.5 / 9 / 9.5
  priceRange: null,    // null or [min, max] in CZK
  membersOnly: false,
};

window.MP_PRICE_BOUNDS = { min: 1500, max: 9000 };

window.MP_AMENITY_LIST = [
  { id: "wellness",   label: "Wellness", icon: "leaf" },
  { id: "spa",        label: "Spa procedury", icon: "sparkle" },
  { id: "pool",       label: "Bazén", icon: "view" },
  { id: "parking",    label: "Parkování", icon: "car" },
  { id: "restaurace", label: "Restaurace", icon: "tag" },
  { id: "bar",        label: "Bar / lobby", icon: "tag" },
  { id: "fitness",    label: "Fitness", icon: "person" },
  { id: "pet",        label: "Pet-friendly", icon: "leaf" },
  { id: "concierge",  label: "Concierge", icon: "users" },
  { id: "wifi",       label: "WiFi v ceně", icon: "wifi" },
];

window.MP_TYPE_ICON = {
  city: "tag",
  wellness: "leaf",
  boutique: "sparkle",
  resort: "view",
};

window.hotelMatchesFilter = function hotelMatchesFilter(h, f, opts) {
  const memberMode = (opts && opts.memberMode) || false;
  if (f.cities && f.cities.length && !f.cities.includes(h.city)) return false;
  if (f.types && f.types.length && !f.types.includes(h.type)) return false;
  if (f.stars && f.stars.length && !f.stars.includes(h.stars)) return false;
  if (f.minRating && h.rating < f.minRating) return false;
  if (f.amenities && f.amenities.length) {
    const ok = f.amenities.every(a => (h.amenities || []).includes(a));
    if (!ok) return false;
  }
  if (f.priceRange) {
    const price = memberMode ? (h.memberPrice || h.fromPrice) : h.fromPrice;
    if (price < f.priceRange[0] || price > f.priceRange[1]) return false;
  }
  return true;
};

window.countActiveMpFilters = function countActiveMpFilters(f) {
  return (f.cities?.length || 0)
       + (f.types?.length || 0)
       + (f.stars?.length || 0)
       + (f.amenities?.length || 0)
       + (f.minRating > 0 ? 1 : 0)
       + (f.priceRange ? 1 : 0);
};

// Czech-aware noun forms (1 / 2-4 / 5+)
window.cz = function cz(n, one, few, many) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
};

window.fmtMp = function fmtMp(n) {
  return n.toLocaleString("cs-CZ");
};

// City list extracted from MP_HOTELS for filter chips
window.MP_CITIES = (function () {
  const set = new Set();
  window.MP_HOTELS.forEach(h => set.add(h.city));
  return Array.from(set);
})();
