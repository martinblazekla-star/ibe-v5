// Multi-property mode — LTR (Long-Term Rental) for students
//
// "Balický Living" — 10 student-oriented buildings across CZ university cities.
// Audience: 80%+ students / Erasmus / young professionals.
//
// Each building exposes:
//   id, name, city, cityArea, address, gps, mapCoords:{x,y}  (CZ_W=1000, CZ_H=640)
//   stars (PRS quality grade, not hotel stars), type:
//      "student-hall"  (kolejní typ, sdílené společné prostory)
//      "co-living"     (zařízené apartmány, komunitní kuchyně)
//      "private"       (kompletní apartmány, soukromé)
//   image, secondaryImages[]
//   rating, reviews
//   buildingTags[]:    ["Tichá zóna", "Erasmus friendly", "Pet friendly", "Pro páry"]
//   amenities[]:       building-level amenities
//   description, highlights[], houseRules[]
//   unitsAvailable, totalUnits
//   monthlyFrom, monthlyOriginal?, studentPrice (ISIC), depositMonths (e.g. 2)
//   minMonths, maxMonths
//   moveInFrom (text, e.g. "1. září 2026")
//   utilities: "included" | "estimate" | "exact"
//   utilitiesCost?: number  (estimated CZK / month when applicable)
//   nearbyUniversities[]: { name, short, walkMin, tramMin?, distanceKm? }
//   roomTypes[]: { label, size, beds, monthlyFrom }  (for inventory preview in detail)
//   testimonial?: { name, school, body, photo? }
//   floors, yearBuilt
//
// Coordinates derived from lat/lng:
//   x = ((lng-12)/7) * 1000
//   y = ((51-lat)/2.5) * 640

window.LTRMP_TYPES = [
  { id: "student-hall", label: "Studentský dům",   short: "Kolej",      desc: "Sdílené kuchyně a common rooms, ideální pro první rok" },
  { id: "co-living",    label: "Co-living",        short: "Co-living",  desc: "Zařízené pokoje, komunitní život" },
  { id: "private",      label: "Privátní apt.",    short: "Apartmány",  desc: "Samostatné apartmány s vlastní kuchyní" },
];

window.LTRMP_BRANDS = [
  { id: "campus",  label: "Campus",  desc: "Velké studentské domy v blízkosti univerzit" },
  { id: "house",   label: "House",   desc: "Komornější co-living budovy v centru" },
  { id: "living",  label: "Living",  desc: "Privátní apartmány pro páry / mladé profesionály" },
];

// Universities — used as map anchors AND filter chips
window.LTRMP_UNIVERSITIES = [
  { id: "cuni",   short: "UK",   name: "Univerzita Karlova",                    city: "Praha",            mapCoords: { x: 350, y: 232 } },
  { id: "cvut",   short: "ČVUT", name: "ČVUT",                                  city: "Praha",            mapCoords: { x: 330, y: 226 } },
  { id: "vse",    short: "VŠE",  name: "Vysoká škola ekonomická",               city: "Praha",            mapCoords: { x: 360, y: 240 } },
  { id: "muni",   short: "MUNI", name: "Masarykova univerzita",                 city: "Brno",             mapCoords: { x: 658, y: 462 } },
  { id: "vut",    short: "VUT",  name: "Vysoké učení technické",                city: "Brno",             mapCoords: { x: 666, y: 458 } },
  { id: "upol",   short: "UPOL", name: "Univerzita Palackého",                  city: "Olomouc",          mapCoords: { x: 749, y: 360 } },
  { id: "vsb",    short: "VŠB",  name: "VŠB-TU Ostrava",                        city: "Ostrava",          mapCoords: { x: 896, y: 298 } },
  { id: "zcu",    short: "ZČU",  name: "Západočeská univerzita",                city: "Plzeň",            mapCoords: { x: 195, y: 320 } },
  { id: "jcu",    short: "JČU",  name: "Jihočeská univerzita",                  city: "České Budějovice", mapCoords: { x: 318, y: 510 } },
  { id: "uhk",    short: "UHK",  name: "Univerzita Hradec Králové",             city: "Hradec Králové",   mapCoords: { x: 480, y: 232 } },
  { id: "tul",    short: "TUL",  name: "Technická univerzita v Liberci",        city: "Liberec",          mapCoords: { x: 472, y: 122 } },
  { id: "uo",     short: "UPa",  name: "Univerzita Pardubice",                  city: "Pardubice",        mapCoords: { x: 519, y: 280 } },
];

// Buildings
window.LTRMP_BUILDINGS = [
  {
    id: "praha-campus-dejvice",
    name: "Balický Campus Dejvice",
    brand: "campus",
    city: "Praha",
    cityArea: "Dejvice",
    address: "Šolínova 1903/7, 160 00 Praha 6",
    gps: { lat: 50.1023, lng: 14.3936 },
    mapCoords: { x: 328, y: 224 },
    stars: 4,
    type: "student-hall",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    rating: 9.2, reviews: 318,
    buildingTags: ["Erasmus friendly", "Tichá zóna", "24/7 recepce"],
    amenities: ["wifi-1g", "study-room", "gym", "laundry", "bike-storage", "kitchen-shared", "common-room", "rooftop", "reception"],
    description:
      "Velký studentský dům přímo proti ČVUT Dejvice — 4 minuty pěšky do kampusu. " +
      "Plně zařízené pokoje a studia, sdílené kuchyně po patrech, studovna na 2. patře a střešní terasa. " +
      "Erasmus orientation week vždy první týden v září. Recepce 24/7 a balíkovna v přízemí.",
    highlights: ["4 min pěšky k ČVUT", "Studovna 24/7", "Recepce 24/7", "Erasmus orientation"],
    houseRules: ["Bez kuřáků", "Bez party (klid 22–8)", "Hosté přihlášení na recepci"],
    unitsAvailable: 12, totalUnits: 168,
    monthlyFrom: 12900,
    studentPrice: 11900,
    depositMonths: 2, bookingFee: 2500,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [
      { id: "cvut",  walkMin: 4,  tramMin: null },
      { id: "cuni",  walkMin: null, tramMin: 18 },
    ],
    roomTypes: [
      { label: "Single room", size: 14, beds: "1 lůžko",        monthlyFrom: 11900, count: 86 },
      { label: "Studio",      size: 22, beds: "1 lůžko",        monthlyFrom: 14900, count: 42 },
      { label: "Twin room",   size: 18, beds: "2 lůžka sdílené", monthlyFrom: 8900,  count: 40 },
    ],
    yearBuilt: 2019, floors: 7,
    testimonial: { name: "Jakub V.", school: "ČVUT FEL, 2. ročník", body: "Bydlím tady druhý rok. Studovna je top, internet bez výpadku a sousedi z celé Evropy. Erasmus orientation week mi pomohl proklouznout do party." },
  },

  {
    id: "praha-house-vinohrady",
    name: "Balický House Vinohrady",
    brand: "house",
    city: "Praha",
    cityArea: "Vinohrady",
    address: "Korunní 88, 101 00 Praha 10",
    gps: { lat: 50.0747, lng: 14.4525 },
    mapCoords: { x: 365, y: 252 },
    stars: 4,
    type: "co-living",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-1.png", "assets/room-3.png"],
    rating: 9.4, reviews: 207,
    buildingTags: ["Co-living", "Komunitní akce", "Pro páry"],
    amenities: ["wifi-1g", "kitchen-shared", "common-room", "rooftop", "laundry", "bike-storage", "events", "cinema-room"],
    description:
      "Co-living dům v krásné secesní budově na Korunní. 38 zařízených pokojů, 4 sdílené kuchyně a obývací prostory, " +
      "filmový sál v suterénu. Komunitní wellness večery v úterý, family dinner každý čtvrtek. " +
      "Tramvaj 11 a 13 přímo před domem — VŠE 12 min, FF UK 15 min.",
    highlights: ["Filmový sál", "Family dinner Čt", "Tramvaj přede dveřmi", "Pet friendly"],
    houseRules: ["Quiet hours 23–7", "Hosté ohlášeni 24h předem", "Pets s registrací"],
    unitsAvailable: 6, totalUnits: 38,
    monthlyFrom: 17400,
    studentPrice: 16200,
    depositMonths: 2, bookingFee: 2500,
    minMonths: 4, maxMonths: 24,
    moveInFrom: "15. srpna 2026",
    utilities: "included",
    nearbyUniversities: [
      { id: "vse",  walkMin: null, tramMin: 12 },
      { id: "cuni", walkMin: null, tramMin: 15 },
    ],
    roomTypes: [
      { label: "Cozy single",  size: 16, beds: "1 lůžko",       monthlyFrom: 16200, count: 22 },
      { label: "Premium room", size: 22, beds: "1 lůžko king",  monthlyFrom: 19500, count: 12 },
      { label: "Couple room",  size: 26, beds: "1 lůžko king",  monthlyFrom: 23900, count: 4  },
    ],
    yearBuilt: 1908, floors: 5,
    testimonial: { name: "Eliška H.", school: "VŠE, 3. ročník Bc.", body: "Family dinner ve čtvrtek změnily celou moji první půlku semestru. Konečně lidi mimo školu." },
  },

  {
    id: "praha-living-karlin",
    name: "Balický Living Karlín",
    brand: "living",
    city: "Praha",
    cityArea: "Karlín",
    address: "Sokolovská 124, 186 00 Praha 8",
    gps: { lat: 50.0944, lng: 14.4513 },
    mapCoords: { x: 364, y: 234 },
    stars: 4,
    type: "private",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-1.png", "assets/room-2.png"],
    rating: 9.0, reviews: 142,
    buildingTags: ["Pro páry", "Pet friendly", "Pro mladé profesionály"],
    amenities: ["wifi-1g", "gym", "laundry", "bike-storage", "parking", "rooftop", "package", "reception"],
    description:
      "Privátní apartmány v moderním Karlíně — kompletně zařízené, vlastní kuchyně a koupelna. " +
      "Žádné sdílené prostory: jen apartmán a komfort. Vhodné pro páry, mladé profesionály nebo PhD studenty. " +
      "5 min na metro B (Křižíkova), 8 min do centra.",
    highlights: ["Vlastní kuchyně i koupelna", "Posilovna v budově", "Metro B 5 min", "Bez sdílených prostor"],
    houseRules: ["Bez kuřáků", "Pets do 25 kg s registrací"],
    unitsAvailable: 3, totalUnits: 64,
    monthlyFrom: 22500,
    studentPrice: null,
    depositMonths: 2, bookingFee: 3000,
    minMonths: 6, maxMonths: 24,
    moveInFrom: "1. července 2026",
    utilities: "estimate",
    utilitiesCost: 2400,
    nearbyUniversities: [
      { id: "vse",   walkMin: null, tramMin: 12 },
      { id: "cvut",  walkMin: null, tramMin: 22 },
    ],
    roomTypes: [
      { label: "Studio 28 m²", size: 28, beds: "1 lůžko queen",    monthlyFrom: 22500, count: 28 },
      { label: "1+kk 38 m²",   size: 38, beds: "1 lůžko king",     monthlyFrom: 27900, count: 24 },
      { label: "2+kk 56 m²",   size: 56, beds: "1 ložnice + obyvák", monthlyFrom: 36500, count: 12 },
    ],
    yearBuilt: 2022, floors: 8,
  },

  {
    id: "brno-campus-bohunice",
    name: "Balický Campus Bohunice",
    brand: "campus",
    city: "Brno",
    cityArea: "Bohunice",
    address: "Kamenice 753/5, 625 00 Brno",
    gps: { lat: 49.1755, lng: 16.5705 },
    mapCoords: { x: 653, y: 469 },
    stars: 4,
    type: "student-hall",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    rating: 9.1, reviews: 412,
    buildingTags: ["Pro mediky", "Erasmus friendly", "Tichá zóna"],
    amenities: ["wifi-1g", "study-room", "gym", "laundry", "bike-storage", "kitchen-shared", "common-room", "reception"],
    description:
      "Studentský dům 3 minuty od Lékařské fakulty MUNI. Specializuje se na mediky a studenty " +
      "přírodních věd — 24/7 studovna, klidové patro, anatomický model na zapůjčení. Erasmus week každé září.",
    highlights: ["3 min k LF MUNI", "Studovna 24/7", "Klidové patro", "Anatomický model k zapůjčení"],
    houseRules: ["Bez kuřáků", "Klid 22–7", "Hosté ohlášeni"],
    unitsAvailable: 18, totalUnits: 220,
    monthlyFrom: 8900,
    studentPrice: 7900,
    depositMonths: 2, bookingFee: 2000,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [
      { id: "muni", walkMin: 3, tramMin: null },
      { id: "vut",  walkMin: null, tramMin: 18 },
    ],
    roomTypes: [
      { label: "Single room",  size: 14, beds: "1 lůžko",        monthlyFrom: 7900,  count: 110 },
      { label: "Twin shared",  size: 18, beds: "2 lůžka",        monthlyFrom: 5900,  count: 80  },
      { label: "Studio",       size: 22, beds: "1 lůžko",        monthlyFrom: 11500, count: 30  },
    ],
    yearBuilt: 2018, floors: 6,
    testimonial: { name: "Adam P.", school: "MUNI Lékařská fakulta, 3. ročník", body: "Pro mediky perfektní. Studovna funguje 24/7, sousedi z medicíny tě nutí dělat — bez nich bych přestal." },
  },

  {
    id: "brno-house-veveri",
    name: "Balický House Veveří",
    brand: "house",
    city: "Brno",
    cityArea: "Veveří",
    address: "Veveří 95, 602 00 Brno",
    gps: { lat: 49.2089, lng: 16.5945 },
    mapCoords: { x: 657, y: 446 },
    stars: 3,
    type: "co-living",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-3.png", "assets/room-1.png"],
    rating: 8.8, reviews: 165,
    buildingTags: ["Co-living", "Komunitní akce", "Centrum"],
    amenities: ["wifi-1g", "kitchen-shared", "common-room", "laundry", "bike-storage", "events"],
    description:
      "Komornější co-living blízko Filozofické fakulty MUNI a centra. 28 zařízených pokojů, " +
      "2 sdílené kuchyně, společenská místnost s gauči a deskovkami. Bez party — pro lidi, kteří chtějí klidnější komunitu.",
    highlights: ["6 min k FF MUNI", "Klidná komunita", "Deskovky a kino večery"],
    houseRules: ["Bez kuřáků", "Quiet hours 22–7"],
    unitsAvailable: 4, totalUnits: 28,
    monthlyFrom: 11800,
    studentPrice: 10800,
    depositMonths: 2, bookingFee: 2000,
    minMonths: 4, maxMonths: 18,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [
      { id: "muni", walkMin: 6, tramMin: null },
      { id: "vut",  walkMin: null, tramMin: 8 },
    ],
    roomTypes: [
      { label: "Single",       size: 16, beds: "1 lůžko",     monthlyFrom: 10800, count: 20 },
      { label: "Premium room", size: 22, beds: "1 lůžko",     monthlyFrom: 13900, count: 8  },
    ],
    yearBuilt: 1932, floors: 4,
  },

  {
    id: "olomouc-campus-envelopa",
    name: "Balický Campus Envelopa",
    brand: "campus",
    city: "Olomouc",
    cityArea: "Envelopa",
    address: "Křížkovského 8, 779 00 Olomouc",
    gps: { lat: 49.5947, lng: 17.2606 },
    mapCoords: { x: 752, y: 359 },
    stars: 4,
    type: "student-hall",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-1.png", "assets/room-2.png"],
    rating: 9.0, reviews: 198,
    buildingTags: ["Erasmus friendly", "Univerzitní čtvrť"],
    amenities: ["wifi-1g", "study-room", "kitchen-shared", "common-room", "laundry", "bike-storage", "events", "reception"],
    description:
      "Studentský dům v Envelopě, hned u Filozofické fakulty UPOL. Klasický kolejní formát, " +
      "ale s kvalitou hotelového standardu. Erasmus orientation a tandem nights pro mezinárodní studenty.",
    highlights: ["2 min k FF UPOL", "Tandem nights", "Bike storage"],
    houseRules: ["Bez kuřáků", "Klid 22–7"],
    unitsAvailable: 22, totalUnits: 142,
    monthlyFrom: 7400,
    studentPrice: 6800,
    depositMonths: 2, bookingFee: 1800,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [{ id: "upol", walkMin: 2 }],
    roomTypes: [
      { label: "Single",     size: 14, beds: "1 lůžko",  monthlyFrom: 6800, count: 76 },
      { label: "Twin shared", size: 18, beds: "2 lůžka", monthlyFrom: 5200, count: 50 },
      { label: "Studio",     size: 22, beds: "1 lůžko",  monthlyFrom: 9400, count: 16 },
    ],
    yearBuilt: 2020, floors: 5,
  },

  {
    id: "ostrava-campus-poruba",
    name: "Balický Campus Poruba",
    brand: "campus",
    city: "Ostrava",
    cityArea: "Poruba",
    address: "17. listopadu 2172, 708 00 Ostrava",
    gps: { lat: 49.8334, lng: 18.1622 },
    mapCoords: { x: 880, y: 300 },
    stars: 4,
    type: "student-hall",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-2.png", "assets/room-3.png"],
    rating: 8.9, reviews: 256,
    buildingTags: ["VŠB campus", "Pro techniky", "Tichá zóna"],
    amenities: ["wifi-1g", "study-room", "gym", "laundry", "bike-storage", "kitchen-shared", "common-room", "reception"],
    description:
      "Studentský dům přímo u VŠB-TU. Velký důraz na technické vybavení — 3D tiskárna, makerspace " +
      "v přízemí, projektová učebna. Pro studenty FEI a Strojní fakulty.",
    highlights: ["1 min k VŠB", "Makerspace + 3D tisk", "Projektová učebna"],
    houseRules: ["Bez kuřáků", "Klid 22–7"],
    unitsAvailable: 28, totalUnits: 180,
    monthlyFrom: 6900,
    studentPrice: 6300,
    depositMonths: 2, bookingFee: 1800,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [{ id: "vsb", walkMin: 1 }],
    roomTypes: [
      { label: "Single",      size: 14, beds: "1 lůžko",  monthlyFrom: 6300, count: 108 },
      { label: "Twin shared", size: 18, beds: "2 lůžka",  monthlyFrom: 4800, count: 56  },
      { label: "Studio",      size: 22, beds: "1 lůžko",  monthlyFrom: 8400, count: 16  },
    ],
    yearBuilt: 2017, floors: 6,
  },

  {
    id: "plzen-campus-borska",
    name: "Balický Campus Borská pole",
    brand: "campus",
    city: "Plzeň",
    cityArea: "Borská pole",
    address: "Univerzitní 8, 301 00 Plzeň",
    gps: { lat: 49.7234, lng: 13.3505 },
    mapCoords: { x: 193, y: 324 },
    stars: 3,
    type: "student-hall",
    image: "assets/room-2.png",
    secondaryImages: ["assets/room-1.png", "assets/room-3.png"],
    rating: 8.7, reviews: 184,
    buildingTags: ["ZČU campus", "Pro techniky"],
    amenities: ["wifi-1g", "study-room", "laundry", "bike-storage", "kitchen-shared", "common-room", "events"],
    description:
      "Klasický studentský dům pro ZČU. Praktický základ — funkční vybavení, levný nájem, " +
      "studovna a 2× sdílená kuchyně. Vhodný pro první ročníky.",
    highlights: ["3 min k ZČU", "Levný nájem", "Studovna"],
    houseRules: ["Bez kuřáků", "Klid 22–7"],
    unitsAvailable: 18, totalUnits: 124,
    monthlyFrom: 6400,
    studentPrice: 5900,
    depositMonths: 2, bookingFee: 1500,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [{ id: "zcu", walkMin: 3 }],
    roomTypes: [
      { label: "Single",      size: 14, beds: "1 lůžko",  monthlyFrom: 5900, count: 72 },
      { label: "Twin shared", size: 18, beds: "2 lůžka",  monthlyFrom: 4400, count: 52 },
    ],
    yearBuilt: 2014, floors: 5,
  },

  {
    id: "ceske-budejovice-house",
    name: "Balický House České Budějovice",
    brand: "house",
    city: "České Budějovice",
    cityArea: "Centrum",
    address: "Branišovská 31a, 370 05 České Budějovice",
    gps: { lat: 48.9758, lng: 14.4467 },
    mapCoords: { x: 351, y: 518 },
    stars: 3,
    type: "co-living",
    image: "assets/room-3.png",
    secondaryImages: ["assets/room-2.png", "assets/room-1.png"],
    rating: 8.8, reviews: 96,
    buildingTags: ["Co-living", "Klidná lokalita"],
    amenities: ["wifi-1g", "kitchen-shared", "common-room", "laundry", "bike-storage"],
    description:
      "Komornější co-living pro studenty Jihočeské univerzity. 22 pokojů, dvě sdílené kuchyně, " +
      "klidná čtvrť, ale 8 min na kampus.",
    highlights: ["8 min k JČU", "Klidná čtvrť", "Bike storage"],
    houseRules: ["Bez kuřáků", "Klid 22–7"],
    unitsAvailable: 5, totalUnits: 22,
    monthlyFrom: 8200,
    studentPrice: 7600,
    depositMonths: 2, bookingFee: 1800,
    minMonths: 4, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [{ id: "jcu", walkMin: 8 }],
    roomTypes: [
      { label: "Single", size: 16, beds: "1 lůžko", monthlyFrom: 7600, count: 18 },
      { label: "Studio", size: 22, beds: "1 lůžko", monthlyFrom: 10400, count: 4 },
    ],
    yearBuilt: 2016, floors: 4,
  },

  {
    id: "liberec-campus-husova",
    name: "Balický Campus Husova",
    brand: "campus",
    city: "Liberec",
    cityArea: "Husova",
    address: "Husova 11, 460 01 Liberec",
    gps: { lat: 50.7693, lng: 15.0626 },
    mapCoords: { x: 437, y: 56 },
    stars: 4,
    type: "student-hall",
    image: "assets/room-1.png",
    secondaryImages: ["assets/room-3.png", "assets/room-2.png"],
    rating: 9.0, reviews: 124,
    buildingTags: ["TUL campus", "Hory v dosahu", "Erasmus friendly"],
    amenities: ["wifi-1g", "study-room", "gym", "laundry", "bike-storage", "ski-storage", "kitchen-shared", "common-room"],
    description:
      "Studentský dům TUL — 5 min na kampus, navíc plně vybavený ski-storage room. " +
      "Erasmus program s tandem nights a víkendovými výlety do Jizerských hor.",
    highlights: ["5 min k TUL", "Ski storage", "Víkendové výlety do hor"],
    houseRules: ["Bez kuřáků", "Klid 22–7"],
    unitsAvailable: 9, totalUnits: 86,
    monthlyFrom: 7900,
    studentPrice: 7300,
    depositMonths: 2, bookingFee: 1800,
    minMonths: 5, maxMonths: 12,
    moveInFrom: "1. září 2026",
    utilities: "included",
    nearbyUniversities: [{ id: "tul", walkMin: 5 }],
    roomTypes: [
      { label: "Single",      size: 14, beds: "1 lůžko", monthlyFrom: 7300, count: 52 },
      { label: "Twin shared", size: 18, beds: "2 lůžka", monthlyFrom: 5400, count: 28 },
      { label: "Studio",      size: 22, beds: "1 lůžko", monthlyFrom: 9600, count: 6  },
    ],
    yearBuilt: 2019, floors: 5,
  },
];

// Building-level amenity catalogue
window.LTRMP_AMENITY_LIST = [
  { id: "wifi-1g",        label: "WiFi 1 Gbps",        icon: "wifi" },
  { id: "study-room",     label: "Studovna 24/7",      icon: "book" },
  { id: "gym",            label: "Posilovna",          icon: "person" },
  { id: "laundry",        label: "Prádelna",           icon: "tag" },
  { id: "bike-storage",   label: "Úschovna kol",       icon: "tag" },
  { id: "ski-storage",    label: "Úschovna lyží",      icon: "tag" },
  { id: "kitchen-shared", label: "Sdílená kuchyně",    icon: "tag" },
  { id: "common-room",    label: "Společenská místnost", icon: "users" },
  { id: "rooftop",        label: "Střešní terasa",     icon: "view" },
  { id: "cinema-room",    label: "Filmový sál",        icon: "tag" },
  { id: "events",         label: "Komunitní akce",     icon: "sparkle" },
  { id: "reception",      label: "Recepce 24/7",       icon: "concierge" },
  { id: "parking",        label: "Parkování",          icon: "car" },
  { id: "package",        label: "Balíkovna",          icon: "tag" },
];

// Tag groups for filter chips
window.LTRMP_TAG_GROUPS = {
  audience: [
    { id: "Erasmus friendly",          icon: "globe" },
    { id: "Pro mediky",                icon: "person" },
    { id: "Pro techniky",              icon: "tag" },
    { id: "Pro páry",                  icon: "users" },
    { id: "Pro mladé profesionály",    icon: "person" },
  ],
  vibe: [
    { id: "Tichá zóna",                icon: "leaf" },
    { id: "Komunitní akce",            icon: "sparkle" },
    { id: "Pet friendly",              icon: "leaf" },
    { id: "Klidná lokalita",           icon: "leaf" },
  ],
};

window.LTRMP_FILTER_DEFAULTS = {
  cities: [],
  types: [],         // student-hall / co-living / private
  universities: [],  // university ids
  tags: [],          // audience + vibe tags (intersected with buildingTags)
  amenities: [],
  isicOnly: false,
  petFriendly: false,
  budget: null,      // [min, max] in CZK/month
  unitsOnly: false,  // only buildings with >0 units available
};

window.LTRMP_BUDGET_BOUNDS = { min: 4500, max: 35000 };

// Cities and counts
window.LTRMP_CITIES = (function () {
  const set = new Set();
  window.LTRMP_BUILDINGS.forEach(b => set.add(b.city));
  return Array.from(set);
})();

// Filter predicate
window.ltrmpMatches = function ltrmpMatches(b, f, opts) {
  const isicMode = (opts && opts.isicMode) || false;
  if (f.cities && f.cities.length && !f.cities.includes(b.city)) return false;
  if (f.types  && f.types.length  && !f.types.includes(b.type)) return false;
  if (f.universities && f.universities.length) {
    const ids = (b.nearbyUniversities || []).map(u => u.id);
    if (!f.universities.some(id => ids.includes(id))) return false;
  }
  if (f.tags && f.tags.length) {
    const ok = f.tags.every(t => (b.buildingTags || []).includes(t));
    if (!ok) return false;
  }
  if (f.amenities && f.amenities.length) {
    const ok = f.amenities.every(a => (b.amenities || []).includes(a));
    if (!ok) return false;
  }
  if (f.petFriendly && !(b.buildingTags || []).includes("Pet friendly")) return false;
  if (f.isicOnly && !b.studentPrice) return false;
  if (f.budget) {
    const price = isicMode && b.studentPrice ? b.studentPrice : b.monthlyFrom;
    if (price < f.budget[0] || price > f.budget[1]) return false;
  }
  if (f.unitsOnly && b.unitsAvailable === 0) return false;
  return true;
};

window.countLtrmpFilters = function countLtrmpFilters(f) {
  return (f.cities?.length || 0)
       + (f.types?.length || 0)
       + (f.universities?.length || 0)
       + (f.tags?.length || 0)
       + (f.amenities?.length || 0)
       + (f.petFriendly ? 1 : 0)
       + (f.isicOnly ? 1 : 0)
       + (f.budget ? 1 : 0)
       + (f.unitsOnly ? 1 : 0);
};

window.fmtLtrmp = function fmtLtrmp(n) { return n.toLocaleString("cs-CZ"); };

window.ltrmpUniversityById = function (id) {
  return window.LTRMP_UNIVERSITIES.find(u => u.id === id);
};

// Walk-time label helper
window.ltrmpProximityLabel = function (entry) {
  if (!entry) return "";
  if (entry.walkMin != null) return `${entry.walkMin} min pěšky`;
  if (entry.tramMin != null) return `${entry.tramMin} min tramvají`;
  if (entry.distanceKm != null) return `${entry.distanceKm} km`;
  return "";
};
