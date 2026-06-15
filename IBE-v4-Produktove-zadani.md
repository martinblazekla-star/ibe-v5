# IBE v4 — Produktové & UX zadání pro vývoj

> **Účel dokumentu.** Toto je kompletní popis chování booking enginu v4 z pohledu produktu a uživatelské zkušenosti. Slouží jako podklad pro implementaci backendu, integrace, A/B testování i pro QA. Vizuální podoba je závazná v rovině struktury, hierarchie a interakcí; konkrétní pixely jsou v HTML prototypech (`*.html` v projektu).
>
> **Verze:** v4 · květen 2026
> **Jazyk produktu:** primárně čeština (cs), s rozhraním pro sk / en / de / pl / hu
> **Měna:** primárně CZK, s rozhraním pro EUR / USD / GBP / PLN / HUF
> **Cílový hotel referenční:** Hotel Balický (Praha) + Vila Regenhart (Jeseník — proposal scenario)

---

## 0. Poslední změny (v4.x)

Posledně přidané / upravené části produktu — pro implementaci a QA jako přednostní záležitost. Detaily v příslušných sekcích.

| Oblast | Co je nové | Sekce |
|---|---|---|
| 🆕 **Mapa apartmánů** | 4. pohled v Pick Room (`Pick-Room-Map-View.html`). Interaktivní mapa s clusterovanými piny, levý sloupec se seznamem karet, popover na pin s tlačítky **Detail** + **Vybrat sazbu**. Vlastní `MV_APARTS` dataset (apartmány, nikoli pokoje). | [§6.1.6](#616-map-view-pick-room---map-viewhtml), [§11.2](#112-mapa-apartm%C3%A1n%C5%AF-pick-room---map-viewhtml) |
| 🆕 **Sjednocený Filtry button** | Konzistentní `RoomFiltersButton` + `RoomFiltersDialog` v `ResultsHeader` napříč Table / List / Grid / Map. Filtruje podle Strava / Storno / Typ pokoje / Velikost lůžka. | [§5.13](#513-roomfiltersbutton--roomfiltersdialog), [§6.1](#61-pick-room-table--list--grid--map) |
| 🆕 **Sjednocený rate-konfigurátor** | `RateConfigDialog` je nyní sdílený napříč všemi pohledy včetně Map View. Klik na **Vybrat sazbu** na mapě otevírá tentýž dialog jako Table View klik na **Rezervovat**. Helper `fmtT` byl extrahován do interního formátteru `rcdFmt`, aby dialog nezávisel na hostitelském souboru. | [§5.9.1](#591-rateconfigdialog), [§6.1.6](#616-map-view-pick-room---map-viewhtml) |
| 🆕 **Detail z mapy** | Klik **Detail** v popoveru na mapě otevírá standardní `RoomDetailDialog` (apartmán adaptován jako `room`: `number ← building`, `view ← floor`). Dříve používaný `ApRatePicker` byl nahrazen. | [§6.1.6](#616-map-view-pick-room---map-viewhtml), [§5.9](#59-detaildialogshost) |
| 🆕 **Hodnocení — pohled v kontextu** | Filtry recenzí jsou sticky a fungují i v sekci „Co o tom říkají hosté" na Single Room. Per-source split (Booking / Google / Tripadvisor) s vlastními skóre. | [§10.1](#101-reviews-reviewshtml) |
| 🆕 **Concierge → split** | `Concierge.html` zůstává jako statická info stránka (mapa hotelu, doprava, okolí). **Mapa apartmánů** se od něj odlišila jako samostatný pohled v Pick Room. | [§11](#11-concierge--mapa) |
| 🆕 **AI asistent — sekce** | Marie je rozšířena na samostatnou kapitolu se všemi kontrakty s backendem, kontextovým system promptem a plánem nasazení mimo Pick Room. | [§16](#16-chatbot-marie-ai-asistent) |

---

## Obsah

1. [Přehled produktu](#1-přehled-produktu)
2. [Slovníček pojmů](#2-slovníček-pojmů)
3. [Hlavní uživatelské cesty (high-level flow)](#3-hlavní-uživatelské-cesty)
4. [Stránky a jejich účel](#4-stránky-a-jejich-účel)
5. [Sdílené komponenty a chování](#5-sdílené-komponenty-a-chování)
6. [Hlavní booking flow — transient pobyt](#6-hlavní-booking-flow--transient-pobyt)
7. [Balíčky (Packages)](#7-balíčky-packages)
8. [Wellness rezervace](#8-wellness-rezervace)
9. [Voucher Sale (dárkové vouchery)](#9-voucher-sale-dárkové-vouchery)
10. [Hodnocení (Reviews)](#10-hodnocení-reviews)
11. [Concierge & Mapa](#11-concierge--mapa)
12. [Mobilní verze (Pick Room)](#12-mobilní-verze-pick-room)
13. [Marketing landing stránky](#13-marketing-landing-stránky)
14. [LTR — Long-Term Rental (dlouhodobý nájem)](#14-ltr--long-term-rental)
15. [Proposal Engine (B2B nabídky)](#15-proposal-engine-b2b-nabídky)
16. [Chatbot „Marie" (AI asistent)](#16-chatbot-marie-ai-asistent)
17. [Login & Loyalty (Balický Club)](#17-login--loyalty-balický-club)
18. [Sleva, voucher a cenotvorba](#18-sleva-voucher-a-cenotvorba)
19. [Datové modely a zdroje dat](#19-datové-modely-a-zdroje-dat)
20. [Globální stav, události, persistence](#20-globální-stav-události-persistence)
21. [Lokalizace a formátování](#21-lokalizace-a-formátování)
22. [Tweaks režim (pro design / sales)](#22-tweaks-režim)
23. [Integrace a backendové kontrakty](#23-integrace-a-backendové-kontrakty)
24. [Otevřené otázky a out-of-scope](#24-otevřené-otázky-a-out-of-scope)

---

## 1. Přehled produktu

IBE v4 je **přímý booking engine hotelu** (Internet Booking Engine) — tj. rezervační rozhraní provozované samotným hotelem (nikoli OTA). Cílí na maximální konverzi přímé rezervace přes čtyři pilíře:

1. **Best-rate guarantee a anti-OTA komunikace** — viditelné ujištění o nejlepší ceně.
2. **Balický Club (loyalty)** — okamžitá registrace přímo z nákupního flow s 5 % slevou.
3. **AI asistent (Marie)** — kontextová pomoc s výběrem.
4. **Cross-sell modulů** — balíčky, wellness, vouchery, LTR, proposal.

### 1.1 Moduly engine

| Modul | URL stránka | Cílový segment |
|---|---|---|
| **Transient booking** | `Pick Room - *.html`, `Upsell.html`, `Checkout.html`, `Confirmation.html` | B2C, krátký pobyt (1–14 nocí) |
| **Packages** | `Pick-Package.html`, `Pick-Package-Single-Package.html` | B2C, balíčky se zážitky |
| **Wellness** | `Wellness-Booking.html` | Hosté + externí klientela |
| **Voucher Sale** | `Voucher-Sale.html` | Dárci |
| **Reviews** | `Reviews.html` | Hosté při průzkumu |
| **Concierge / Mapa** | `Concierge.html` | Hosté po rezervaci i před |
| **Mobile (Pick Room)** | `Mobile-Pick-Room.html` | Mobilní zařízení |
| **Marketing** | `Room-Landing.html`, `Package-Landing.html` | Akviziční landing |
| **LTR** | `LTR *.html` | Studenti, expati, dlouhodobí nájemci (3–12 měsíců) |
| **Proposal** | `Proposal.html` | B2B (svatby, konference, skupiny) |

### 1.2 Klíčové principy

- **Jedna sdílená navigace** napříč modulu transient/packages/wellness/vouchery/reviews/mapa — viz [§5.1 PickRoomNav](#51-pickroomnav).
- **Jeden globální stav přihlášení** napříč všemi stránkami (přes `window.__loyaltyUser`).
- **Jednotná cenotvorba** — sazby (rate) jsou vždy „za celý pobyt včetně daní", nikoli „za noc".
- **Veškerý detail otevírá modální dialog**, ne novou stránku (kromě Single Room/Package, které slouží jako share-able permalinky).
- **Tweaks** — režim pro pracovníky designu/marketingu, který umožňuje za běhu měnit varianty UI bez deploye.

---

## 2. Slovníček pojmů

| Pojem | Význam |
|---|---|
| **IBE** | Internet Booking Engine — toto rozhraní |
| **OTA** | Online Travel Agency (Booking.com, Expedia…) — konkurence |
| **Transient** | Krátkodobý hotelový pobyt (běžná rezervace) |
| **LTR** | Long-Term Rental — dlouhodobý pronájem (3+ měsíců), funguje jako bytová agentura |
| **Rate / Sazba** | Konkrétní cenová varianta pokoje (Flexi, Nevratná, Polopenze…) |
| **Inventory** | Počet pokojů daného typu k prodeji |
| **Voucher** | (a) slevový kód do voucher pole, (b) dárkový voucher prodávaný v eshopu |
| **Balíček (Package)** | Bundle pobyt + zážitek + jídlo (např. wellness víkend) |
| **Proposal / Nabídka** | B2B nabídka pro akce (svatba, konference, skupina) |
| **Loyalty / Balický Club** | Věrnostní program s tieru (Stříbrný / Zlatý / Platinový) |
| **Marie** | AI chatbot integrovaný do Pick Room |

---

## 3. Hlavní uživatelské cesty

```
                                ┌──────────────────────┐
                                │ Marketing / Landing  │
                                │  (Google, Facebook)  │
                                └──────────┬───────────┘
                                           │
              ┌────────────────────────────┼─────────────────────────────┐
              │                            │                             │
       ┌──────▼──────┐             ┌───────▼──────┐              ┌───────▼──────┐
       │ Pick Room   │             │ Pick Package │              │ LTR Pick     │
       │ (Table/List │             │              │              │ Room         │
       │  /Grid)     │             └───────┬──────┘              └───────┬──────┘
       └──────┬──────┘                     │                             │
              │ select rate                │ select package              │ select rate
              ▼                            ▼                             ▼
       ┌─────────────┐              ┌─────────────┐               ┌─────────────┐
       │   Upsell    │              │   Single    │               │ LTR Single  │
       │             │              │   Package   │               │   Room      │
       └──────┬──────┘              └──────┬──────┘               └──────┬──────┘
              │                            │                             │
              └────────────┬───────────────┘                             │
                           ▼                                              ▼
                    ┌─────────────┐                              ┌─────────────┐
                    │  Checkout   │                              │ LTR         │
                    │             │                              │ Checkout    │
                    └──────┬──────┘                              └──────┬──────┘
                           ▼                                              ▼
                    ┌─────────────┐                              ┌─────────────┐
                    │Confirmation │                              │ LTR         │
                    │             │                              │Confirmation │
                    └─────────────┘                              └─────────────┘

       Wellness Booking, Voucher Sale, Reviews, Concierge — stand-alone moduly,
       dosažitelné z hlavní navigace, končí stejnou Confirmation logikou.

       Proposal Engine — samostatný flow se vstupem skrz odkaz v e-mailu
       (proposal sales agent → příjemce nabídky).
```

### 3.1 Vstupní body

| Vstupní bod | Vede na | Poznámka |
|---|---|---|
| Logo v navigaci | `Pick-Room-Table-View.html` | Výchozí stav booking enginu |
| Marketing landing CTA „Rezervovat pobyt" | `Pick-Room-Grid-View.html` | Hi-fi pohled |
| E-mail s odkazem na proposal | `Proposal.html?id=XYZ` (mockováno přes Tweaks) | B2B |
| Mobilní detekce | `Mobile-Pick-Room.html` | Server-side redirect dle UA |
| Confirmation page → „Stáhnout voucher" | PDF download | Externí služba |

---

## 4. Stránky a jejich účel

### 4.1 Mapa všech stránek

| Soubor (HTML) | Účel | App soubor (JSX) | Sdílí navigaci? |
|---|---|---|---|
| `Pick-Room-Table-View.html` | Hlavní výpis pokojů — všechny sazby viditelné v tabulce | `app-table.jsx` | ✅ PickRoomNav (`ubytovani`) |
| `Pick-Room-List-View.html` | Stejný výpis, vertikální karty s preview rate | `app-list.jsx` | ✅ |
| `Pick-Room-Grid-View.html` | Stejný výpis, mřížka karet (zaměřené na fotky) | `app-grid.jsx` | ✅ |
| `Pick-Room-Map-View.html` 🆕 | Mapový pohled na apartmány (geolokace, clustery, dataset `MV_APARTS`) | `app-map.jsx` + `app-map-parts.jsx` | ✅ |
| `Pick-Room-Single-Room.html` | Permalink k pokoji + booking widget | `app-single-room.jsx` | ✅ |
| `Pick-Package.html` | Výpis balíčků s filtrem kategorií | `app-packages.jsx` | ✅ PickRoomNav (`balicky`) |
| `Pick-Package-Single-Package.html` | Permalink k balíčku | `app-single-package.jsx` | ✅ |
| `Wellness-Booking.html` | Procedury + slot picker | `app-wellness.jsx` | ✅ (`wellness`) |
| `Voucher-Sale.html` | Konfigurace dárkového voucheru + live preview | `app-voucher.jsx` | ✅ (`vouchery`) |
| `Reviews.html` | Filtrované recenze + souhrn | `app-reviews.jsx` | ✅ (`hodnoceni`) |
| `Concierge.html` | Mapa hotelu, doprava, tipy v okolí | `app-concierge.jsx` | ✅ (`mapa`) |
| `Upsell.html` | Vylepšení pobytu mezi Pick Room a Checkout | `app-upsell.jsx` | ❌ vlastní stepper |
| `Checkout.html` | Údaje, platba, podpis | `app-checkout.jsx` | ❌ vlastní stepper |
| `Confirmation.html` | Post-purchase: voucher, kalendář, referral | `app-confirmation.jsx` | ❌ vlastní |
| `Mobile-Pick-Room.html` | Mobilní výpis pokojů + bottom sheet | `app-mobile-pick-room.jsx` | ❌ mobilní nav |
| `Room-Landing.html` | Marketing landing pro konkrétní pokoj | `app-room-landing.jsx` | ❌ MarketingNav |
| `Package-Landing.html` | Marketing landing pro balíček | `app-package-landing.jsx` | ❌ MarketingNav |
| `LTR-Pick-Room.html` | LTR výpis bytů | `app-ltr.jsx` | ❌ vlastní (LTR nemá tabs) |
| `LTR-Single-Room.html` | LTR detail bytu | `app-ltr-single-room.jsx` | ❌ |
| `LTR-Checkout.html` | LTR checkout (3-step stepper) | `app-ltr-checkout.jsx` | ❌ LTRBookingNav |
| `LTR-Confirmation.html` | LTR potvrzení vč. smlouvy k podpisu | `app-ltr-confirmation.jsx` | ❌ LTRBookingNav |
| `Proposal.html` | Proposal engine (variants → detail → forms → checkout → done) | `app-proposal.jsx` | ❌ ProposalNav |

---

## 5. Sdílené komponenty a chování

### 5.1 PickRoomNav

Hlavní navigace booking enginu. Použitá na všech stránkách transient + balíčky + wellness + vouchery + reviews + mapa.

**Struktura (zleva doprava):**

1. **Logo** Hotel Balický — kotvený na `Pick-Room-Table-View.html`
2. **Menu položky:**
   - Ubytování → `Pick-Room-Table-View.html`
   - Balíčky → `Pick-Package.html`
   - Wellness → `Wellness-Booking.html`
   - Vouchery → `Voucher-Sale.html`
   - Hodnocení → `Reviews.html`
   - Mapa → `Concierge.html`
3. **Pravý okraj:**
   - **Lang/currency pill** — otevírá `LangCurrencyPicker` dropdown
   - **Login button** / **Member badge** — otevírá `LoginDropdown` nebo `LoyaltyMemberZone`

**Aktivní stav:** podtržení brand barvou pod aktuální položkou. Aktivita se předává jako prop `active` (`"ubytovani" | "balicky" | "wellness" | "vouchery" | "hodnoceni" | "mapa"`).

**Stav loyalty se synchronizuje** napříč všemi instancemi navigace přes globální `window.__loyaltyUser` a `CustomEvent("loyalty-change")`.

### 5.2 PickRoomSearchBar

Sticky search bar pod hlavičkou hlavního flow. **Čtyři pole vedle sebe:**

1. **Termín** — otevírá `DateRangePicker` (2 měsíce vedle sebe, heat-map cen, omezení dostupnosti)
2. **Hosté** — otevírá `GuestsPicker` (multi-pokoj, 4 věkové kategorie)
3. **Voucher** — otevírá `VoucherPicker` (validace kódu)
4. **Tlačítko „Změnit hledání"** — submit (re-fetch dostupnosti)

**Interakce:**
- Kliknutí na pole otevře dropdown; otevření jiného pole automaticky zavře předchozí.
- Pole vizuálně označí aktivní stav (brand-tinted background, podtržení).
- Po `onChange` z dropdownu se hodnoty propíší zpět do popisku pole, dropdown se nezavírá automaticky — vyžaduje explicit „Použít" / „Zavřít".
- **Pod search barem se zobrazuje `AppliedDiscountStrip`** — pruh agregující aktivní slevy (voucher, long-stay), automaticky se objeví/skryje.

**Logika dlouhého pobytu:** pokud `nights >= 3`, automaticky se aplikuje sleva 15 % (`window.__longStayDiscount = true`), bez nutnosti zadávat kód.

### 5.3 DateRangePicker

Dva měsíce vedle sebe, lokalizovaná čeština.

**Stavy dnů:**
- `available` — bílý, hover brand tint, klikatelný
- `selected start / end` — brand background
- `inRange` — světlý brand tint
- `soldOut` — šedé, neklikatelné
- `closeToArrival` — den nelze začít pobyt (s tooltipem)
- `closeToDeparture` — den nelze ukončit pobyt
- `minStay2` — vyžaduje minimálně 2 noci pobytu

**Funkce:**
- Heat-mapa cen — barva pozadí dne odráží relativní cenu (cheaper = green tint, pricier = warm tint).
- Kliknutí na den 1 = start, kliknutí na den 2 = end (validuje proti restrikcím).
- Po vybrání rozsahu zobrazí součet nocí + průměrnou cenu/noc.

**Data:** `AVAILABILITY_OVERRIDES` (per-day stav), `getPrice(date)` (mockovaná cenotvorba).

### 5.4 GuestsPicker

**Multi-pokoj** UI:
- Každý pokoj má 4 kategorie hostů: Dospělí (18+) / Mládež (13–17) / Děti (3–12, sleva 50 %) / Kojenci (0–2, zdarma)
- Steppery min/max: dospělí 1–6, mládež 0–4, děti 0–4, kojenci 0–2.
- Tlačítko **„Přidat další pokoj"** (max 5 pokojů na rezervaci).
- Footer ukazuje souhrn (`X pokojů · Y hostů`).
- Akce: **Zrušit** (zahodí změny) / **Použít** (commit + close).

### 5.5 VoucherPicker

- Vstup pro kód (uppercase, letter-spacing).
- Tlačítko **Použít** ověří kód mock-asynchronně (500 ms).
- Validní kódy v mocku: `WELCOME10` (−10 %), `EARLYBIRD15` (−15 %), `VIP25` (−25 %).
- **Stav:** idle / loading / ok / error — vizuálně reflektován v border-color inputu a v hlášce pod ním.
- „Tip jak získat slevu" — sekce s alternativami (loyalty, early bird, dárkový voucher).
- Footer: **Uložit a zavřít** (pokud ok) / **Zavřít**.

### 5.6 LangCurrencyPicker

Dropdown s **2 sloupci**:
- Jazyk: CS / SK / EN / DE / PL / HU (s vlajkou)
- Měna: CZK / EUR / USD / GBP / PLN / HUF (s aktuálním kurzem k CZK)

Změna kurzu/jazyka by měla **invalidovat ceny v celém UI** (re-formátování). V prototypu zatím změna jen překreslí pill v nav. Backend musí dodat:
- Lokalizační stringy (i18n).
- Aktuální FX rates (s timestampem; ideálně cache 1h).

### 5.7 LoginDropdown / LoyaltyMemberZone

**LoginDropdown** (pro nepřihlášeného uživatele):
- Vrchní band „Balický Club — 5 % sleva, body, pozdní check-out".
- Taby: **Přihlášení** / **Vytvořit účet**.
- Social: Google, Apple.
- E-mail + heslo (login) / jméno + e-mail + heslo (register).
- „Zapamatovat si mě" + „Zapomenuté heslo" link.
- CTA tlačítko: **Přihlásit se** / **Vytvořit účet a získat 5 % slevu**.
- Po úspěchu (mockováno přes `mockLogin()`) → fire `CustomEvent("loyalty-change")` a zavře se.

**LoyaltyMemberZone** (po přihlášení):
- Gradient header s jménem, e-mailem, **tier badge** (Stříbrný 🥈 / Zlatý 🥇 / Platinový).
- **Progress bar k dalšímu tieru** (procento z `points / pointsTotal`).
- Dvojice statů: **Body** (a jejich ekvivalent v Kč), **Sleva v %** na rezervace.
- Sekce **Aktivní výhody** — list bodů.
- Menu: Moje rezervace (s badge počtu nadcházejících), Body a odměny, Profil, Nastavení.
- Footer: **Odhlásit se**.

### 5.8 AppliedDiscountStrip

Tenký pruh pod search barem, který se objeví, když je aktivní jedna nebo více slev:
- **Voucherový kód** (z `VoucherPicker`)
- **Long-stay sleva 15 %** (automaticky při `nights >= 3`)

Vykresluje se jako oddělené chipy s hodnotou (−10 %) + popisem + sub-textem.

### 5.9 DetailDialogsHost

**Event-driven dispatcher modálních detailů.** Apps mountují jednou v root úrovni:

```jsx
<DetailDialogsHost onPickRoomRate={(room, rate) => addToCart(room, rate)} />
```

**Naslouchá globálním eventům na `window`:**
- `open-room-detail` → mountne `RoomDetailDialog`
- `open-package-detail` → mountne `PackageDetailDialog`
- `open-wellness-detail` → mountne `WellnessDetailDialog`

Tak může kterákoli komponenta (řádek tabulky, chat karta, banner) otevřít detail bez prop-drillingu:

```js
window.dispatchEvent(new CustomEvent("open-room-detail", { detail: { room } }));
```

**Dialogy mají standardní strukturu:**
- Fixed overlay + escape/click-outside zavřít
- Galerie + tabs (Popis / Vybavení / Sazby / Storno / FAQ)
- CTA sazby — fire `onPickRate(room, rate)` → propaguje se do App → uloží do cart.

#### 5.9.1 RateConfigDialog

Konfigurátor sazby otevřený po kliku na **Rezervovat** / **Vybrat sazbu**. Sdílený `rate-config-dialog.jsx`, použitý napříč všemi pohledy včetně Map View (🆕).

- 2-sloupcový layout 900 px: vlevo konfigurátor (počet pokojů, hosté, stravování, doplňky, zprávy), vpravo sticky price summary.
- **Stravování** — radio: Zahrnuto / Polopenze (+590 Kč/os./noc) / Plná penze (+1190 Kč/os./noc).
- **Doplňky** — Welcome drink / Parkování (per-noc) / Domácí mazlíček / Pozdní check-out.
- Multi-room support: stejnou sazbu lze rezervovat pro až 5 pokojů.
- Live price line: Sazba × N + Stravování + Doplňky + Daně (v ceně) = **Celkem**.
- Loyalty hint pod CTA pokud uživatel ještě není přihlášený.

**Implementační detail:** dialog má vlastní interní formátter `rcdFmt` (cs-CZ locale) — nezávisí už na hostitelském souboru. Volat lze z kteréhokoli view: `<window.RateConfigDialog open room rate initialRooms onClose onConfirm />`.


### 5.10 PickRoomReservationBar

Sticky footer rezervace ve výpise pokojů. Zobrazí se, jakmile uživatel přidá první pokoj.

- Avatar ✓
- Souhrn: `X pokojů ve Vaší rezervaci` + výčet `qty× název (sazba)`
- **Vyprázdnit** (zahodí vše)
- Cena: `Celkem za N nocí` + cena tučně
- CTA **Pokračovat** → `Upsell.html`

### 5.11 PickRoomFooter

Globální patička booking enginu: copyright, storno podmínky, obchodní podmínky, GDPR.

### 5.12 ViewSwitcher

Přepínač pohledů ve výpisu pokojů (4 položky — **Karty / Seznam / Tabulka / Mapa**). Klik na ne-aktivní pohled = navigace na příslušný `.html`. Aktivní stav: neutral-100 background.

### 5.13 RoomFiltersButton + RoomFiltersDialog

🆕 **Sjednocený filter button** pro Pick Room (Table / List / Grid). Sídlí ve sdíleném souboru `pick-room-shared.jsx`.

- **Button** (`RoomFiltersButton`) — vykresluje se ve slotu `extra` v `ResultsHeader`. Stav „neaktivní" = bílé pozadí + 1px border; stav „aktivní" (≥1 zvolený filtr) = `--ink-1` pozadí + badge s počtem aktivních filtrů.
- **Dialog** (`RoomFiltersDialog`) — modální okno 640 px se 4 sekcemi:
  1. **Strava** — Snídaně v ceně / Polopenze / Volitelná strava
  2. **Storno podmínky** — Zrušení zdarma / Nevratné
  3. **Typ pokoje** — Standard / Deluxe / Executive / Apartmán / Suite
  4. **Velikost lůžka** — King size / Twin / Více lůžek
- Volby jsou **chipy** s počtem matching položek; `whiteSpace: nowrap` aby se neměnily na 2 řádky.
- Footer: **Vymazat filtry** (link) vlevo + **Zobrazit pokoje (N filtrů)** (brand) vpravo.
- Stav: per-view lokální (`useState`); aplikace přes `onApply(draft)`. Stav přežívá zavření dialogu.

**Map View** používá samostatný `FilterDialog` (`app-map-parts.jsx`) s rozšířenými filtry vhodnými pro městský dataset apartmánů — viz [§6.1.6](#616-map-view-pick-room---map-viewhtml).

**Defaulty:** `window.ROOM_FILTER_DEFAULTS = { meal: [], cancellation: [], roomType: [], bed: [] }`.
**Helper:** `window.countActiveRoomFilters(filters)` → number.

---

## 6. Hlavní booking flow — transient pobyt

### 6.1 Pick Room (Table / List / Grid / Map)

**4 ekvivalentní pohledy** na hotelový inventory:

- **Table / List / Grid** sdílí dataset `window.ROOMS` (pokoje s typem, sazbami).
- **Map** používá `window.MV_APARTS` (apartmány — geo coords, building, neighborhood) a slouží zejména pro modul „Apartmány" / krátkodobý pronájem v městské mapě.

Všechny 4 pohledy sdílí stejnou hlavičku, hlavičku výsledků a `PickRoomReservationBar`, jen mění render karet.

#### 6.1.1 Společná hlavička (všechny pohledy)

1. PickRoomNav
2. Breadcrumb: `Hotel Balický → Vybrat pokoj` (resp. `Vybrat apartmán z mapy` na Map View)
3. PickRoomSearchBar + AppliedDiscountStrip
4. **Konverzní bannery** (Table / List / Grid):
   - `BestPriceGuarantee` — kompaktní pruh s ujištěním
   - `MemberActiveRibbon` — pro přihlášeného člena (zelený)
   - `MemberSignUpBanner` — pro nepřihlášeného (CTA registrace)
   - *(Map view bannery vynechává kvůli vyšší informační hustotě.)*
5. `ResultsHeader` — počet pokojů, **Filtry button**, `ViewSwitcher`, sort dropdown

#### 6.1.2 Table View (`Pick-Room-Table-View.html`) — výchozí

- **Per-pokoj „RoomBlock":** thumbnail + meta vlevo, tabulka sazeb vpravo.
- Tabulka sazeb má sloupce: **Sazba** (název + stravování + storno) / **Cena** / **Akce** (Stepper +/− počtu pokojů).
- Badge sazby: `Nejvýhodnější` (zelený), nebo `Nevratná` (rust).
- Sazba s `originalPrice` → strikethrough + nová cena, vedle `−X %` chip.
- **Sold out** stav → blok s diagonálním šrafováním a CTA „Nastavit upozornění".
- Klik na **Rezervovat** → `RateConfigDialog` (`rate-config-dialog.jsx`) pro doplnění konfigurace.
- Po výběru se uloží do `selections` (lokální stav komponenty App).
- **Filtry** jsou navíc vždy viditelné v levém sloupci (FiltersSidebar) — sekce Strava / Storno / Typ pokoje / Velikost lůžka. Button v `ResultsHeader` otevírá tutéž sadu jako modální dialog.

#### 6.1.3 List View (`Pick-Room-List-View.html`)

- Vertikální karty pokojů: velká fotka vlevo, content vpravo.
- Nejlevnější sazba je expanded inline (s tlačítkem „Přidat"), ostatní sazby v collapsibles.
- Filtry pouze přes Filtry button → `RoomFiltersDialog`.

#### 6.1.4 Grid View (`Pick-Room-Grid-View.html`)

- 2-sloupcová mřížka karet (responzivně 1-col na mobilu, ale projekt cílí na desktop 1280px).
- Karta = velká fotka + meta + cena od + tlačítko „Vybrat sazbu".
- Klik **Vybrat sazbu** → lokální `RatePickerDialog` (rate-list) → po výběru → `RateConfigDialog`.
- Filtry pouze přes Filtry button → `RoomFiltersDialog`.

#### 6.1.5 Spodní lišta rezervace

`PickRoomReservationBar` se objeví, jakmile `Object.values(selections).some(s => s.qty > 0)`.

#### 6.1.6 Map View (`Pick-Room-Map-View.html`)

🆕 **Nově v v4.x.** Geolokační pohled — vhodný pro krátkodobé apartmány distribuované po městě (více budov / čtvrtí).

**Layout:** levý sloupec = scrollable seznam karet apartmánů; pravý sloupec = sticky mapa.

1. **Mapa** (`MapPanel`)
   - SVG ilustrace města (3 themes: `light` / `sage` / `warm`).
   - **Cluster piny** — apartmány v téže budově / blízké budově sdílí pin; v patičce pinu se zobrazuje **počet + nejlevnější cena** (`od X Kč`).
   - **Hover karty na seznamu** → highlight odpovídajícího pinu (`Tweak: highlightFromCard`).
   - **Klik na pin** → otevře `ApartmentPopover` ukotvený nad pinem.
2. **ApartmentPopover** (`map-components.jsx` / `app-map-parts.jsx`)
   - Mini karta: foto + neighborhood badge + název + rating + meta (kapacita / m² / beds) + cena od.
   - **2 tlačítka:**
     - **Detail** → otevírá `RoomDetailDialog` (apartment se adaptuje jako `room`: `number ← building`, `view ← floor`).
     - **Vybrat sazbu** → otevírá `RateConfigDialog` rovnou s nejlevnější sazbou (stejně jako Table → Rezervovat).
   - Šipky `‹ ›` pro cyklování mezi apartmány v clusteru.
3. **ApartmentCard** (levý sloupec)
   - Větší karta než popover: foto 16:10 + neighborhood + název + rating + meta + amenity preview + cena od.
   - **CTA „Vybrat sazbu"** → totéž jako popover.
   - Klik na kartu (mimo tlačítko) → otevře popover na příslušném pinu (sync).
4. **Filtrace**
   - `RoomFiltersButton` v `ResultsHeader` → otevírá rozšířený `FilterDialog` (`app-map-parts.jsx`) s mapy-specifickými filtry: **Lokalita** (neighborhood chips s count), **Cena za 2 noci** (od/do + presety), **Kapacita**, **Vybavení**, **Min. rating**.
   - Aktivní filtr → button změní barvu na `ink-1`, badge s počtem aktivních filtrů.

**Tweaks pro Map View:** mapTheme, clusterRadius, split (60/40 ↔ 40/60), showRating, highlightFromCard.

**Dataset:** `window.MV_APARTS` (viz `data-map.jsx`) — pole apartmánů s povinnými atributy:
`id, name, building, buildingId, neighborhood, distance, coords:{x,y}, image, beds, capacity, size, floor, tags[], amenities[], rating, reviews, badge?, rates[]`.

### 6.2 Single Room (`Pick-Room-Single-Room.html`)

Permalink stránka konkrétního pokoje, dostupná pro SEO i sdílení.

- Hero galerie (carousel).
- Tabs: Popis / Vybavení / Sazby / Storno / FAQ (stejné jako v `RoomDetailDialog`).
- `BookingWidget` (varianta `inline`) v pravém sloupci sticky — datum, hosté, voucher, výběr sazby.
- Sekce: **Wellness** (cross-sell), **Co o tom říkají hosté** (top 3 recenze), **Často kupované balíčky**.

### 6.3 Upsell (`Upsell.html`)

**Krok mezi Pick Room a Checkout.** Pokud uživatel přijde rovnou na Checkout (např. z balíčku), Upsell se přeskakuje.

#### 6.3.1 Progress

4-step stepper: `Výběr ubytování → Vylepšení pobytu → Vaše údaje a platba → Potvrzení`.

#### 6.3.2 Sekce (vše Tweakable on/off)

1. **Vylepšení pokoje (Room Upgrade)** — nabídka přechodu na vyšší kategorii (např. Deluxe → Executive) za příplatek.
2. **Vlastnosti pokoje** — výběr patro, výhled, postel (twin/king).
3. **Wellness balíčky** — slotování během pobytu, s časovým výběrem (využívá `WellnessSlotDialog`).
4. **Parkování** — checkbox / qty stepper, denní sazba.
5. **Extra služby** — láhev sektu, květiny, transfer, late checkout.
6. **Upgrade na balíček** — nabídka přechodu z room-only na fully-bundled package.

#### 6.3.3 Sticky pravý sloupec

`UpsellSummary` — pokoj + datum + line items za doplňky + total + CTA „Pokračovat na údaje".

### 6.4 Checkout (`Checkout.html`)

#### 6.4.1 Progress

3-step: `Výběr ubytování → Vaše údaje a platba → Potvrzení rezervace`.

#### 6.4.2 Levý sloupec — formulář

1. **Loyalty banner** (pro nepřihlášené — CTA registrace s benefitem 5 % okamžitě).
2. **Kontaktní údaje** — jméno, příjmení, e-mail, telefon (+ country code), Země.
3. **Pro koho rezervujete** (volitelné) — radio „Pro sebe" / „Pro někoho jiného" → zobrazí druhou skupinu polí.
4. **Doplňky k pobytu** (volitelné) — checkbox karty s mini příplatky.
5. **Speciální přání** — textarea.
6. **Platba** — tabs:
   - Karta (Visa/MC/Amex) — pole číslo karty, expiry, CVV, jméno
   - Apple Pay / Google Pay (button)
   - Bankovní převod (vygeneruje VS po potvrzení)
   - Platba na recepci (pouze pro flexibilní sazby)
7. **Souhlasy a CTA:**
   - Checkbox „Souhlasím s obchodními podmínkami" (povinný)
   - Checkbox „Souhlasím se zpracováním údajů" (povinný)
   - Checkbox „Chci dostávat akční nabídky" (volitelný)
   - **Tlačítko „Závazně rezervovat za XXX Kč"** (full-width, brand)
   - Disclaimer pod tlačítkem

#### 6.4.3 Pravý sloupec — sticky Summary

- Hotel
- Datum + počet nocí + počet hostů + link „Změnit termín nebo hosty" (zpět na Pick Room)
- Per-pokoj line: thumbnail + název + č. pokoje + sazba + chipy (snídaně, storno) + cena
- Tlačítko „Přidat další pokoj"
- Price breakdown: Ubytování / Doplňky / Daně (v ceně)
- **Celkem** (display font, 26px)
- Social proof: „4 lidé právě prohlížejí" + „Naposledy rezervováno před 12 minutami"

### 6.5 Confirmation (`Confirmation.html`)

#### 6.5.1 Sekce (vše Tweakable)

1. **SuccessHero** — „Děkujeme, Jane. Těšíme se na Vás." + e-mail potvrzení + tlačítka:
   - **Stáhnout voucher (PDF)** (brand)
   - **Přidat do kalendáře** (open .ics)
   - **Sdílet s rodinou** (mailto/share API)
2. **Číslo rezervace** + QR kód pro check-in.
3. **Timeline pobytu** — Před příjezdem (check-in instrukce, parking…) / V den příjezdu (15:00 check-in) / Během pobytu (snídaně 7–10, wellness 7–22) / Po odjezdu (feedback link).
4. **Upsell pro tento pobyt** — late checkout, wellness, parking (last-mile cross-sell).
5. **Loyalty CTA** — pokud nepřihlášen, „Aktivujte si Balický Club" (jednoclick z e-mailu rezervace).
6. **Referral** — „Doporučte přítele, získáte 500 b. oba" s linkem.
7. **Tipy v okolí** — link na Concierge.

### 6.6 Spodní mobile bar (jen mobile)

Viz [§12 Mobilní verze](#12-mobilní-verze-pick-room).

---

## 7. Balíčky (Packages)

### 7.1 Pick Package (`Pick-Package.html`)

#### 7.1.1 Hlavička

- PickRoomNav (active=`balicky`)
- Breadcrumb
- `SearchBarPkg` — stejná struktura jako PickRoomSearchBar, ale s default 3 nocemi
- **CategoryStrip** — pill filtr: Všechny / Pro páry / Wellness / Rodinné / City break / Sezónní + sort dropdown vpravo

#### 7.1.2 Výpis balíčků

Karty 2-sloupcové. Karta obsahuje:
- Hero fotka + badge (Bestseller / Top výběr / −33 %)
- Název balíčku + tagline (1 řádek shrnutí)
- 3-řádkový popis
- **Co je v ceně** — bullet list inclusion (max 6 položek, expandable)
- Tagy chipy
- **Cena od** + původní cena (přeškrtnutá) + „Ušetříte X Kč"
- Tlačítko **Otevřít detail** (modal `PackageDetailDialog`)
- Sub-CTA „Rezervovat" (přejde na `Pick-Package-Single-Package.html` s parametrem balíčku)

### 7.2 Single Package (`Pick-Package-Single-Package.html`)

Permalink balíčku. Struktura podobná Single Room:
- Hero + galerie
- Inclusions / Itinerary / Co není v ceně / FAQ
- `BookingWidget` (variant `inline`) — datum + hosté + tlačítko „Rezervovat balíček"
- Cross-sell: podobné balíčky

Při potvrzení Booking widgetu → přechází na **Upsell** s aplikovaným balíčkem (vynechá Pick Room).

---

## 8. Wellness rezervace

### 8.1 Wellness Booking (`Wellness-Booking.html`)

#### 8.1.1 Účel

Modul pro hotel-internal i externí klientelu. Lze rezervovat **bez pobytu** (pouze proceduru).

#### 8.1.2 Struktura

1. PickRoomNav (active=`wellness`)
2. Hero band + kategorie filtr: Všechny / Masáže / Beauty / Sauna & lázně / Páry / Balíčky
3. Mřížka procedur (`window.WELLNESS`) — karta:
   - Emoji + název
   - Délka + cena
   - Krátký popis
   - Badge (Bestseller / Popular)
   - Tlačítko „Rezervovat" → otevírá `WellnessSlotDialog`

#### 8.1.3 WellnessSlotDialog (slot picker)

Modal s:
- Den (5 dní k výběru — `WELLNESS_DAYS`)
- Čas (8 slotů — `WELLNESS_SLOTS`), barevně rozdělené volné/obsazené
- Volba terapeuta (radio: any nebo konkrétní jméno)
- Počet osob (1 / 2, u párových procedur fixně 2)
- Cena celkem
- CTA **Přidat do rezervace**

Dostupnost je deterministická (mock): `window.wellnessAvailability(procedureId, dayId, slot)`.

#### 8.1.4 Cart

Spodní lišta s vybranými procedurami → vede na **Checkout** (kde se procedury objeví jako line items místo pokojů).

---

## 9. Voucher Sale (dárkové vouchery)

### 9.1 Voucher Sale (`Voucher-Sale.html`)

Single page s **live preview**.

#### 9.1.1 Vlevo — konfigurátor

1. **Hero band** (volitelný) — vizuálka „Darujte zážitek"
2. **Typ voucheru:**
   - Na pobyt (od 3 000 Kč, volitelná hodnota)
   - Na wellness (od 1 000 Kč)
   - Na konkrétní balíček (pre-set hodnota)
3. **Hodnota** — slider nebo input (3 000 – 50 000 Kč)
4. **Příležitost** (Tweakable on/off) — Narozeniny / Výročí / Vánoce / Den matek / Bez příležitosti → vizuální motiv na voucheru
5. **Design voucheru** — radio (Classic / Minimal / Photo / Ornate)
6. **Příjemce:**
   - Jméno příjemce
   - Věnování (text, max 200 znaků)
   - **Doručení:** E-mail (PDF do schránky) / Tištěná verze (poštou, +149 Kč) / Předám osobně (download PDF)
   - Datum doručení (pokud e-mail/pošta — naplánovat odeslání)
7. **Vaše údaje:** Jméno + e-mail + telefon
8. **CTA Zaplatit X Kč**

#### 9.1.2 Vpravo — Live preview

Stylizovaný náhled voucheru s aktuálními hodnotami:
- Logo hotelu, hodnota, jméno příjemce, věnování, číslo voucheru (mock), QR kód, platnost (1 rok od vystavení).

Po platbě:
- Pokud e-mail → odeslán automaticky v naplánovaný den
- Pokud pošta → tisk + odeslání kurýrem
- Pokud osobně → okamžitý PDF download + e-mail

---

## 10. Hodnocení (Reviews)

### 10.1 Reviews (`Reviews.html`)

#### 10.1.1 Struktura

1. PickRoomNav (active=`hodnoceni`)
2. **Souhrn:**
   - Velké skóre (9.2/10) + „Vynikající" label + počet hodnocení
   - Sloupec recommendation pct (96 %)
   - Per-source skóre (Booking.com / Google / Tripadvisor — `window.REVIEWS_SUMMARY.sources`) — 🆕 každá platforma má vlastní průměr, počet recenzí a link na zdrojový profil.
   - **Kategorie** — bar chart per category (Personál 9.6 / Čistota 9.5 / …)
3. **Filtry** (sticky pod hlavičkou souhrnu, 🆕):
   - **Typ hosta** (Pár / Rodina / Sólo / Business / Skupina)
   - **Pokoj** (Deluxe / Executive / Apartmán / Standard…)
   - **Měsíc pobytu** (last 12 months, dropdown)
   - **Hodnocení** (10 / 9–10 / 8+ / vše)
   - **Zdroj** (Booking / Google / Tripadvisor / přímé)
   - Vícenásobná volba (multi-select chipy). Aktivní filtr zvýrazněn `--ink-1`. „Vymazat vše" link, pokud je aktivní ≥ 1.
4. **Sort:** Nejnovější / Nejvyšší / Nejnižší / Relevance
5. **Výpis recenzí** — karta:
   - Avatar + jméno + flag země + datum
   - Skóre + zdroj (badge platformy)
   - Stay type + pokoj (chipy → klik = aplikovat filtr)
   - Title + tělo
   - Pros (zelená) / Cons (rust) chipy
   - **Hotel reply** (pokud existuje) — bílá karta zarovnaná dovnitř, badge „Odpověď hotelu"
6. **Pagination / „Načíst další"** — infinite scroll s `Načíst dalších X` button, kde X = `min(remaining, 10)`.

#### 10.1.2 Defaulty filtrů (Tweakable)

Tweak `filtry default` umožňuje pre-aplikovat sadu filtrů na základě referrer URL — např. host přicházející z Booking.com vidí default `source = Booking`.

### 10.2 Reviews v jiných kontextech

| Kontext | Co se zobrazuje | Filtrace |
|---|---|---|
| **Single Room** (sekce „Co o tom říkají hosté") | Top 3 recenze filtrované per-room (`window.REVIEWS.filter(r => r.roomId === room.id)`) | Automaticky podle pokoje |
| **Single Package** | Top 3 recenze pro daný balíček | Podle `packageId` |
| **Confirmation** (sekce „Co o tom říkají ostatní") | 2 random pozitivní recenze (boost důvěry po rezervaci) | Bez filtrů |
| **Pick Room Single Room** (po proklik z výpisu) | Top 3 + link „Zobrazit všechny recenze" → `Reviews.html?roomId=…` | Per-room |

🆕 Filtry v `Reviews.html` přijímají query parametry (`?source=booking&type=family`) — slouží pro deep linky z Single Room a marketing landingu.

---

## 11. Concierge & Mapa

V IBE v4 existují **dva mapové kontexty** s odlišným účelem:

| Stránka | Účel | Zdroj dat |
|---|---|---|
| `Concierge.html` | Statická info stránka — adresa hotelu, doprava, okolí, concierge služby | hardcoded copy + `NEARBY_PLACES` |
| `Pick-Room-Map-View.html` 🆕 | Interaktivní výběr apartmánu na městské mapě (Pick Room flow) | `MV_APARTS` (data-map.jsx) |

### 11.1 Concierge (`Concierge.html`)

Slouží hostům **před** i **po** rezervaci pro orientaci v destinaci.

#### 11.1.1 Struktura

1. PickRoomNav (active=`mapa`)
2. **Hero header** — „Mapa & doprava" + krátký popis
3. **2-sloupec:**
   - **MapIllustration** — schematická SVG mapa s pinem hotelu, pulzující animací
   - **AddressCard** — adresa + GPS + kopírovat + „Otevřít v navigaci" + kontakty (telefon, e-mail, jazyky)
4. **TransportTabs** — Auto / Vlak / Letadlo / MHD:
   - Aktivní tab: čas dojezdu + summary + step-by-step pokyny
   - Sidebar: parkování (cena, kapacita) / concierge tip
5. **NearbySection** — pamtáky / restaurace / wellness v okolí, s vzdáleností a notou
6. **ConciergeServices** — 4 karty: Transfer / Rezervace restaurací / Vstupenky / Speciální překvapení + CTA Zavolat

#### 11.1.2 Vstupní body

- Z `Confirmation.html` (sekce „Tipy v okolí")
- Z `PickRoomNav` (tab „Mapa")
- Z e-mailové komunikace (před příjezdem)

### 11.2 Mapa apartmánů (`Pick-Room-Map-View.html`)

🆕 **Nově v v4.x.** Plnohodnotný 4. pohled v Pick Room flow, viz [§6.1.6](#616-map-view-pick-room---map-viewhtml) pro layout a interakce.

**Kdy použít:**
- Pro hotely / brandy s distribuovaným inventory (více budov v městě, apartmánové sítě).
- Pro hosty, kteří se rozhodují podle lokality (blízkost k metru / centru).

**Klíčové rozdíly oproti Concierge:**
- Interaktivní (klik na pin → popover → Detail / Vybrat sazbu).
- Cluster piny při překryvu (více apartmánů v 1 budově).
- Filtrace podle neighborhood, ceny, kapacity, vybavení, ratingu.
- Sdílí ostatní pick-room komponenty (`PickRoomNav`, `PickRoomSearchBar`, `PickRoomReservationBar`, `RateConfigDialog`, `RoomDetailDialog`).

**Backend kontrakt pro implementaci:**
- Per-apartment geo coords (lat/lng → SVG x/y konverze klientem nebo server-side).
- Per-building grouping (`buildingId`) pro cluster logiku.
- Per-neighborhood agregace pro filter chips s počtem.

---

## 12. Mobilní verze (Pick Room)

### 12.1 Mobile Pick Room (`Mobile-Pick-Room.html`)

**Cílový viewport:** 390–428 px (iPhone). Stránka má `width=device-width`.

#### 12.1.1 Komponenty

1. **MobileNav** — fixed top bar: ← back, logo, ikona menu
2. **MobileSearchSummary** — kompaktní lišta s pillem zobrazujícím termín + hosty, klik otevírá full-screen editor
3. **MobileTrustStrip** — vodorovný carousel trust signálů (Best price / SSL / Loyalty)
4. **MobileRoomCard** — full-width karty:
   - Velká fotka + badge (zbývá 1)
   - Název + meta (m², beds, hosté)
   - Cena od + původní cena
   - „Vybrat sazbu" CTA → otevírá **MobileRateSheet** (bottom sheet)
5. **MobileRateSheet** (bottom sheet) — list sazeb + steppery, sticky CTA „Přidat za X Kč"
6. **MobileBottomNav** — fixed bottom (Hledat / Mé rezervace / Profil)

---

## 13. Marketing landing stránky

### 13.1 Room Landing (`Room-Landing.html`) a Package Landing (`Package-Landing.html`)

**Účel:** vstupní stránka z reklamních kanálů (Google Ads, Facebook, e-mail kampaně).

**Není** součástí booking flow — používá **MarketingNav** (jiná struktura: Pobyt / Pokoje / Balíčky / Wellness / Restaurace / Příběh hotelu / Kontakt + tlačítko „Rezervovat pobyt").

#### 13.1.1 Sekce (typické)

1. Hero — full-bleed fotka + tagline + jediný primární CTA
2. **Highlights strip** — 3–4 ikony s benefity
3. **Gallery** — masonry layout
4. **Editorial copy** — 2–3 odstavce vyprávění
5. **Specifikace** — m², postele, vybavení (kompaktní tabulka)
6. **Recenze** — 3 vybrané citace
7. **CTA blok** — „Zarezervujte si pobyt" → přejde do Pick Room (s pre-filled termínem dle URL parametru, pokud existuje)

Marketing stránky **neukládají žádný stav**; jsou stateless landing pro akvizici.

---

## 14. LTR — Long-Term Rental

### 14.1 Účel modulu

Pronájem bytů na **3–12 měsíců** — pro studenty, expaty, dlouhodobé nájemce. Jiný produkt než hotel pobyt, ale jeden engine.

### 14.2 Klíčové rozdíly oproti transient

| Aspekt | Transient | LTR |
|---|---|---|
| Délka pobytu | 1–14 nocí | 3–12 měsíců |
| Cenotvorba | Cena za pobyt | Měsíční nájem |
| Datum | Range picker (dny) | Monthly picker (měsíce) |
| Smlouva | Voucher / potvrzení | **Nájemní smlouva** k podpisu |
| Kauce | Není | **Vyžadována** (typicky 2× měsíční nájem) |
| Booking fee | Není | Jednorázový poplatek (2–3 000 Kč) |
| Storno | Per-sazba (často 0 storno do data) | Výpovědní doba (1–2 měsíce) |
| Loyalty | Body za pobyt | Není (jiná klientela) |
| Navigace | PickRoomNav | LTRBookingNav (3-step) |
| Cílový segment | Hosté | Studenti, expati, mobile workers |

### 14.3 LTR Pick Room (`LTR-Pick-Room.html`)

- LTRBookingNav (step 1)
- Search bar: **Termín nastěhování** (otevírá `MonthlyDatePickerDialog`), Počet osob, Status (Student/Pracující/Pár)
- Výpis bytů (`window.LTR_ROOMS`) — karty zaměřené na patro, dispozice, dostupnost od X
- Filtry: cenový rozsah měsíčního nájmu, počet pokojů, student-friendly, pet-friendly
- Per-byt 3 sazby (`std` / `long` / `student` ISIC)

### 14.4 LTR Single Room (`LTR-Single-Room.html`)

Stejný layout jako Single Room transient, ale s:
- **Měsíční** cenotvorba
- Kalkulačka „celkem za X měsíců" — vč. kauce + booking fee
- Sekce **Smlouva** — co je v nájmu, energie, internet, údržba
- **Co potřebujete** — pro studenty: ISIC, doklad o studiu

### 14.5 LTR Booking flow (`LTR-Checkout.html`)

3-step stepper: **Výběr bytu → Vaše údaje a platba → Potvrzení a smlouva**.

#### Checkout obsahuje:
- Osobní údaje + doklad totožnosti (číslo)
- ISIC (pokud student)
- Adresa trvalého bydliště
- Bankovní účet (pro vrácení kauce)
- Platební metoda **pro:** první nájem + kauce + booking fee
- Souhlas s obchodními podmínkami + GDPR + **smlouva o nájmu** (otevíratelný PDF preview)

### 14.6 LTR Confirmation (`LTR-Confirmation.html`)

- Success hero
- **Krok 1: Podpis smlouvy** — vložené smluvní PDF + 2 možnosti:
  - **DocuSign / BankID elektronický podpis** (preferováno)
  - **Tištěná verze poštou** (delší proces)
- **Krok 2: Předání bytu** — termín a místo, kontakt na správce
- **Krok 3: Energie/internet** — pokyny pro převod nebo údaje
- **Po podpisu:** stáhnout finální smlouvu, klíče vyzvednete na recepci

---

## 15. Proposal Engine (B2B nabídky)

### 15.1 Účel

Modul pro **akce na míru** — svatby, konference, skupinové pobyty. Sales agent vytvoří nabídku v admin interface, vygeneruje sdílecí odkaz, příjemce ji otevře a může:
- Prohlédnout 1–3 cenové varianty (Basic / Standard / Premium)
- Vybrat variantu
- Přidat extras (květiny, focení, transfery…)
- Vyplnit doplňující formuláře (alergie, logistika)
- Zaplatit zálohu nebo potvrdit nezávaznou rezervaci

### 15.2 Scenarios (proposal-data.jsx)

Mockované 3 scénáře:

| ID | Scénář | Příklad |
|---|---|---|
| `svatba` | Svatební víkend | 22 pokojů × 2 noci · 60 hostů · gala večeře + DJ |
| `konference` | Firemní konference | sál + ubytování + catering |
| `skupina` | Skupinový pobyt | autobusová skupina, B&B |

### 15.3 Flow

```
        ┌────────────────┐
        │ Variants View  │  ← Volba varianty (Basic / Standard / Premium)
        └────────┬───────┘    Při single variant scenarios přeskakuje
                 │
                 ▼
        ┌────────────────┐
        │ Detail View    │  ← Plný rozpad items, fotogalerie, schedule,
        │                │    extras picker, cenový souhrn
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Forms Step     │  ← Alergie, logistika, příjezd, special requests
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Checkout Step  │  ← Kontakt + záloha (deposit) + e-signature
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Confirmed View │  ← Potvrzení + sales contact + next steps
        └────────────────┘
```

### 15.4 Klíčové specifika

- **Expirační doba nabídky** (`expiresDays`, default 10 dní) — countdown viditelný v `ProposalNav`.
- **Granular edit** (Tweakable) — režim, kdy lze upravit qty u každé položky nabídky (např. „chci 20 pokojů místo 22").
- **Kontakt sales agenta** — viditelný avatar + jméno + e-mail + tel., sticky v sidebaru.
- **Sdílení** — tlačítko „Sdílet" generuje pre-filled e-mail / WhatsApp (link na proposal s tokenem).
- **Decline** — uživatel může nabídku odmítnout (otevře dialog s důvodem; sales agent dostane notifikaci).
- **Loyalty/Login** (Tweakable) — proposal lze přihlásit; relevantní pro corporate klienty s vyjednanými sazbami.
- **Chatbot** (Tweakable) — pro proposal je možné aktivovat, kontextovaná pro tuto konkrétní nabídku.

### 15.5 Datový kontrakt (z hlediska backendu)

Nabídka má strukturu:

```ts
ProposalScenario = {
  id, label, proposalNumber, hotel: { name, address, logo },
  title, subtitle, intro,             // texty od sales agenta
  dateLabel, dateStart, dateEnd, nights,
  guests: { adults, children }, rooms,
  expiresDays,
  contact: { name, role, email, phone, avatarBg, initials },
  photos: [{ src, caption }],
  schedule: [{ day, time, title, loc, cat }],
  variants: [{
    id, name, sub, recommended?, highlights[],
    items: [{ cat, label, qty, unit, total }],
    deposit, cancellation
  }]
}
```

### 15.6 Cena

`window.proposalTotals(items)` vrací `{ net, vat, gross }`.
- VAT je 21 % (DPH ČR, pobyt 10 %, jídlo 15 %; v prototypu zatím flat).
- Záloha (`deposit`) je explicitní per-varianta a typicky 20–40 % gross.

---

## 16. Chatbot „Marie" (AI asistent)

Samostatná kapitola pokrývající AI asistenta od vstupního bodu přes systémový prompt až po backendový kontrakt. Marie není okrajová funkce — je to **3. pilíř konverze IBE v4** (viz [§1](#1-přehled-produktu): Best-price · Loyalty · **Marie** · Cross-sell).

### 16.1 Účel & rozsah

Konverzační rozhraní, které pomáhá hostům:
- **Doporučit pokoj / sazbu / balíček** podle volných formulací (např. „jedeme s dětmi a chceme klid").
- **Vysvětlit rozdíly** mezi sazbami (Flexi vs. Nevratná, polopenze, storno).
- **Odpovědět na FAQ** (snídaně, parking, wellness, pet policy, check-in).
- **Provést akci** — vložit konkrétní pokoj/sazbu rovnou do rezervace, otevřít detail dialog.

Není určen pro: zpracování platby, změnu existující rezervace (→ recepce), právní informace, dohadovaní cen.

### 16.2 Vstupní body

| Místo | Trigger | Stav UI |
|---|---|---|
| Pick Room Table View | Tweak `aiChatbot = true` | FAB v pravém dolním rohu + hint bubble (auto-dismiss 7 s) |
| Single Room (plánováno) | Per-room Tweak | FAB s kontextem konkrétního pokoje |
| Single Package (plánováno) | Per-package Tweak | FAB s kontextem balíčku |
| Proposal (plánováno) | Sales-side toggle | FAB s kontextem konkrétní nabídky |
| Concierge (plánováno) | Always-on | FAB pro tipy a doporučení |

**FAB** — pulse animace; hint bubble „Potřebujete poradit s rezervací?" se objeví po 1 s a po 7 s sám zmizí. Pokud uživatel klikne mimo, bubble se zavře okamžitě a flag `__chatbotHintDismissed` v localStorage zabrání opětovnému zobrazení v této session.

### 16.3 Panel UI (`AIChatbotPanel`)

**Rozměry:** fixed 400 × 640 px, pravý dolní roh (16 px od edge), z-index 1000.

**Struktura:**

1. **Header** (gradient brand)
   - Avatar Marie (svg ilustrace)
   - „Marie" + AI badge (subtle pulse pro „online")
   - Online indikátor (zelená tečka)
   - Tlačítka: ↻ **Nový rozhovor** (reset historie) · × **Zavřít**
2. **Welcome screen** (před první zprávou) — `WelcomeBlock`
   - Personalizovaná uvítací zpráva: „Dobrý den! Jsem Marie. Pomohu Vám s výběrem pro {NIGHTS} {nocí|noci|noc} pro {GUESTS} {hosty|hosta}."
   - **4 QUICK_PROMPTS** (klikatelné karty, předvolené dotazy):
     - „Doporuč mi pokoj pro 2 osoby s wellness"
     - „Jaký je rozdíl mezi flexibilní a nevratnou cenou?"
     - „Který pokoj je nejvýhodnější?"
     - „Co je v ceně snídaně?"
3. **Konverzace** — message list (scrollable)
   - **User bubble** — brand background, pravý sloupec, max-width 80 %
   - **Bot bubble** — bílé pozadí, avatar vlevo
   - **Inline room karty** (1–3) — fotka + meta + cena + 2 akce (Detail / Přidat)
   - **Inline rate karta** — sazba + cena + akce Přidat
   - **Loading dots** během čekání na odpověď
4. **Footer input**
   - Text input s placeholder „Zeptejte se Marie…"
   - Send button (paper-plane ikona) — disabled při čekání
   - Disclaimer pod inputem: „Generováno AI, ověřte podstatné údaje s recepcí."

### 16.4 Integrace s LLM (Claude)

Volá `window.claude.complete({ messages })` (poskytuje hostitelský runtime — viz [§16.7](#167-backend--kontrakt)).

**Konverzační smyčka:**

```js
const messages = [
  { role: "system",   content: buildSystemPrompt() },
  ...history,                              // alternating user/assistant
  { role: "user",     content: userInput },
];
const raw = await window.claude.complete({ messages });
const { body, rooms, rate } = parseBotMessage(raw);
appendMessage({ role: "assistant", body, rooms, rate });
```

**Model:** Claude Haiku 4.5, 1024 max output tokens (sdíleno per-user rate limit).

### 16.5 System prompt — kontrakt

`buildSystemPrompt()` vrací string. Skládá se z:

1. **Persona & pravidla**
   - Mluv česky, vykání, stručnost (2–4 věty), bez emoji.
   - Doporučení vždy ✕ doplnit konkrétní akcí (room/rate karta).
   - Nikdy nesměřuj uživatele jinam (žádný „zavolejte recepci" jako první volba).
2. **Output kontrakt** — na konec odpovědi přilepit max 1 z následujících tagů:
   - `[ROOMS: 107, 201, 305]` — embed až 3 room karty (klient je naparuje a vykreslí)
   - `[RATE: 107:deluxe-nrf]` — embed 1 specifickou rate kartu
   - Bez tagu → pouze text
3. **Kontext pobytu** (per-call substituce):
   - `NIGHTS = {n}`
   - `GUESTS = "{a dospělí, b dětí}"`
   - `LOYALTY = {tier|null}`
4. **Inventory dump** — `window.ROOMS` jako JSON (subset polí — `id`, `name`, `capacity`, `size`, `beds`, `view`, `tags`, `amenities`, `soldOut`, `remaining`, `rates`).
   - Pro kontext Single Room: pouze ten konkrétní pokoj.
   - Pro kontext Proposal: items z nabídky.

🆕 **Kontextovaný system prompt:** plánuje se rozšíření o `?context=` parametr, který se mapuje na variantu promptu (pick-room / single-room / package / proposal / concierge).

### 16.6 Parser výstupu (`parseBotMessage`)

```js
function parseBotMessage(raw) {
  // 1. Najdi `[ROOMS: ...]` nebo `[RATE: ...]` (case-insensitive)
  // 2. Odstraň tag z textu
  // 3. Naparuj IDs na konkrétní room/rate objekty z window.ROOMS
  // 4. Vrať { body, rooms[], rate }
}
```

**Edge cases:**
- ID v tagu, který už neexistuje (rate zrušený) → tag se ignoruje, text projde sám.
- Více tagů v jedné odpovědi → použije se první `ROOMS`, ostatní se odstraní.
- Tag uprostřed věty → vyextrahuje se, text se zalomí.

### 16.7 Backend — kontrakt

| Endpoint | Účel | Frekvence |
|---|---|---|
| `POST /api/chatbot/complete` | Proxy ke Claude API (přidává auth, rate limit) | Per-message |
| `GET /api/chatbot/system-prompt?context=…` | Vrací current system prompt s inventory dumpem | Per-session |
| `POST /api/chatbot/action` | Logování akcí (Přidat, Detail) pro analytics | Per-action |
| `POST /api/chatbot/feedback` | Per-message thumbs up/down | Volitelné |

**Rate limit:** 30 messages / user / hour. Při překročení: fallback zpráva „Marie momentálně odpočívá, zkuste prosím za chvíli." s telefonem na recepci.

**Logování pro tuning:**
- Každá uživatelská zpráva + AI odpověď → DB (anonymizace přes hash session ID).
- Action eventy (Přidat, Detail) → conversion attribution.
- Thumbs up/down → feedback loop pro tuning system promptu.

### 16.8 Akce z chatu

| Akce | Effect | Implementace |
|---|---|---|
| **Přidat** (room/rate karta) | Přidá pokoj+sazbu do `selections` | Fire `onAddSelection(room, rate)` → App handler. Stejné jako klik na +1 v tabulce. |
| **Detail** | Otevře `RoomDetailDialog` | Fire `CustomEvent("open-room-detail", { detail: { room } })` → `DetailDialogsHost` |
| **Nový rozhovor** | Reset history + zachová welcome screen | `setHistory([])` + analytics event |
| **Kopírovat odpověď** (3-dot menu) | Clipboard | Volitelné, plánováno |

### 16.9 Error handling

| Situace | Chování |
|---|---|
| Network error | Bubble „Spojení selhalo. Zkuste znovu?" + retry button. |
| Rate limit (429) | Fallback zpráva + telefon na recepci (`+420 …`). |
| Timeout (>15 s) | „Marie přemýšlí déle, než obvykle…" → po dalších 10 s timeout error. |
| Malformed AI response | Pošli raw text bez room/rate cards. Loguj pro tuning. |
| Empty input | Disable send button. |

### 16.10 Bezpečnost a privacy

- **Žádné PII** v promptech (jméno, e-mail, kontakt) — vždy jen pseudonymizovaný kontext.
- **Disclaimer** v každém panel viditelně: „Generováno AI, ověřte podstatné údaje s recepcí."
- **GDPR**: konverzační historie max 30 dní, pak anonymizace nebo smazání. Per-user export endpoint.
- **No price negotiation**: system prompt zakazuje slevy mimo `window.__loyaltyUser` a `window.__longStayDiscount`.

### 16.11 Tweaks pro design / testing

| Tweak | Popis | Default |
|---|---|---|
| `aiChatbot` | Zapnout chatbot na stránce | `true` |
| `hintBubble` | Auto-zobrazení uvítacího bubble | `true` |
| `quickPrompts` | Zobrazit 4 quick-prompt karty na welcome screen | `true` |
| `loyalty-aware` | Personalizace promptu podle tieru | `true` |

### 16.12 Roadmap (post v4.0)

- **Voice input** (Web Speech API) — pro mobilní zařízení.
- **Multi-jazyková personalita** — Marie / Maria / Mary podle jazyka rozhraní.
- **Long-term memory** per přihlášený user (preference, oblíbené pokoje).
- **Proactive triggers** — automatický prompt po X s neaktivity na sold-out pokoji („Mám Vám najít alternativu?").
- **Voice handoff** — eskalace na lidskou recepci jednoklikem.

---

## 17. Login & Loyalty (Balický Club)

### 17.1 Globální stav

`window.__loyaltyUser` je single source of truth — `null` = odhlášen, jinak objekt:

```ts
LoyaltyUser = {
  name, email, initials,
  tier, tierIcon, tierColor,           // Stříbrný / Zlatý / Platinový
  nextTier, nextTierIcon,
  points, pointsToNextTier, pointsTotal,
  discount,                             // 5 % / 10 % / 15 %
  memberSince,
  upcomingStays,
  benefits: string[],                   // pro UI list
}
```

Změny stavu se propagují přes `window.dispatchEvent(new CustomEvent("loyalty-change"))`. Všechny komponenty, které stav konzumují, listenují na event.

### 17.2 Mock flow

`mockLogin()` — vytvoří demo uživatele (Jan Novák, Stříbrný, 2840 b., −5 %).
`logout()` — `__loyaltyUser = null`.

### 17.3 Tiery (návrh)

| Tier | Body | Sleva | Hlavní benefit |
|---|---|---|---|
| Stříbrný 🥈 | 0–4 000 | 5 % | Welcome drink, pozdní check-out |
| Zlatý 🥇 | 4 000–10 000 | 10 % | + Upgrade pokoje (dle dostupnosti), volný wellness |
| Platinový 💎 | 10 000+ | 15 % | + Soukromý concierge, transfer zdarma 1×/rok |

### 17.4 Účinek na rezervaci

- **Sleva se aplikuje automaticky** na úrovni rate.price → discounted price.
- V Pick Room se zobrazí `MemberActiveRibbon` (zelený) — „Jste přihlášen, sleva 5 % již aplikována".
- V Checkout: per-rate line item + řádek „Členská sleva −X %".
- Body se připíší **po pobytu** (ne při rezervaci) — backend cron job po check-out.

### 17.5 Registrace v průběhu nákupu

Tři vstupní body:
1. **LoginDropdown** z nav (přepnout tab na „Vytvořit účet")
2. **MemberSignUpBanner** v Pick Room
3. **LoyaltyBanner** v Checkout (CTA „Zaregistrovat a získat 5 % okamžitě")

Registrace v Checkout je **inline** — vyžaduje pouze e-mail (heslo uživatel nastaví po kliku v potvrzovacím e-mailu).

---

## 18. Sleva, voucher a cenotvorba

### 18.1 Vrstvy slev (priorita aplikace)

1. **Sazba (rate)** — výchozí cena z PMS (např. Flexi 4 900 Kč)
2. **Promocionální cena** — `originalPrice` → `price` (např. NRF 4 200 Kč; sleva oproti Flexi)
3. **Voucherový kód** — z `VoucherPicker` (např. WELCOME10 = −10 %)
4. **Long-stay sleva** — automaticky pro `nights >= 3` (−15 %)
5. **Loyalty sleva** — automaticky pro přihlášeného (−5 / −10 / −15 %)

**Pravidlo kumulace** (návrh, nutné potvrdit s revenue manažerem):
- Promocionální cena × voucher: **kumulativní**
- Voucher + long-stay: **lepší z obou**, ne kumulativní
- Loyalty + jiná sleva: **kumulativní vždy** (max 25 % celkem)

### 18.2 Anti-OTA komunikace

- Pruh `BestPriceGuarantee` v Pick Room — „Nejlepší cena přímo zde — garantujeme"
- V Summary v Checkout: chip „O 8 % nižší než na OTA"
- V Confirmation: vysvětlení „Děkujeme za přímou rezervaci…"

### 18.3 Daně

V prototypu je vše „v ceně". Pro implementaci:
- DPH 10 % na ubytování (ČR)
- DPH 21 % na služby (parking, wellness)
- DPH 15 % na stravu (snídaně, polopenze, gala)
- Pobytový poplatek (50 Kč/osoba/noc v Praze) — zobrazený jako separate line, vždy v ceně

---

## 19. Datové modely a zdroje dat

### 19.1 Hlavní entity

#### Room (transient)
```ts
{
  id: number,
  name, number, image,
  beds, capacity, size, view,
  tags: string[],
  amenities: string[],
  note?: string,
  remaining?: number,
  soldOut?: boolean,
  rates: Rate[]
}
```

#### Rate
```ts
{
  id, name, meal, cancellation, cancellable: boolean,
  price, originalPrice?: number, badge?: string
}
```

#### Package
```ts
{
  id, name, tagline, description, image,
  nights, badge,
  tags: string[], inclusions: string[],
  fromPrice, originalPrice, savings, minNights
}
```

#### LTR Room
```ts
{
  ...Room base...,
  floor, availableFrom, minMonths, maxMonths,
  monthlyFrom, deposit, bookingFee,
  student: boolean, petFriendly: boolean,
  rates: [{ id, name, monthly, sub, contract, badge }]
}
```

#### Wellness Procedure
```ts
{
  id, category, name, emoji,
  duration: number,         // minutes
  price: number,
  desc: string,
  therapists: string[],
  popular?, bundle?, badge?, saving?
}
```

#### Voucher (slevový kód, ne dárkový)
```ts
{ code: string, label, value: string }   // např. WELCOME10, −10 %
```

#### Review
```ts
{
  id, name, initials, country, flag,
  date, stayType, room,
  score, source,
  title, body,
  pros?, cons?,
  reply?: string
}
```

#### Proposal Scenario
Viz [§15.5](#155-datový-kontrakt-z-hlediska-backendu).

### 19.2 Zdroje dat — backend musí poskytnout

| API endpoint | Použito v | Cache TTL |
|---|---|---|
| `GET /api/availability?from&to&adults&teens&kids&infants` | Pick Room | 30 s |
| `GET /api/rooms/:id` | Single Room, Detail dialog | 5 min |
| `GET /api/packages?date&guests` | Pick Package | 5 min |
| `POST /api/voucher/validate` | VoucherPicker | per request |
| `GET /api/wellness/availability?date` | Wellness slots | 1 min |
| `POST /api/booking` | Checkout submit | — |
| `GET /api/me` | Login state restore | — |
| `POST /api/auth/login` | LoginDropdown | — |
| `POST /api/auth/register` | LoginDropdown | — |
| `GET /api/proposals/:token` | Proposal load | — |
| `POST /api/proposals/:token/accept` | Proposal checkout | — |
| `GET /api/reviews?room&type&score&source&sort` | Reviews | 10 min |
| `POST /api/ai/chat` (proxy ke Claude) | Marie | — |
| `GET /api/ltr/rooms?from&months` | LTR Pick Room | 5 min |

---

## 20. Globální stav, události, persistence

### 20.1 `window` globals (sdílené napříč stránkami)

| Klíč | Účel | Lifecycle |
|---|---|---|
| `window.__loyaltyUser` | Aktuální přihlášený uživatel | Persistent (cookie/session) |
| `window.__voucherDiscount` | Aktivní voucherová sleva | Per-search |
| `window.__longStayDiscount` | Aktivní long-stay sleva | Per-search |
| `window.ROOMS`, `window.PACKAGES`, `window.WELLNESS`, `window.LTR_ROOMS`, `window.REVIEWS`, `window.PROPOSAL_SCENARIOS` | Datové mocky | Per-page (v produkci → API) |
| `window.NIGHTS`, `window.GUESTS` | Kontext pro chatbot | Per-search |
| `window.CART` | Mock cart pro Checkout | Per-flow |

### 20.2 Globální custom events

| Event | Listenery | Trigger |
|---|---|---|
| `loyalty-change` | PickRoomNav, MemberActiveRibbon, MemberSignUpBanner, LoyaltyBanner v Checkout | `mockLogin()`, `logout()` |
| `discount-change` | AppliedDiscountStrip | `VoucherPicker.onChange`, change `nights` |
| `open-room-detail` | DetailDialogsHost | Karta / chat / banner |
| `open-package-detail` | DetailDialogsHost | Package karta / chat |
| `open-wellness-detail` | DetailDialogsHost | Wellness karta |

### 20.3 Persistence (backend kontrakt)

- **Cart** — backend session (Redis), 24h TTL. Frontend hash v URL pro deep linking.
- **Search context** (`from`, `to`, `guests`, `voucher`) — URL query parameters, sdílecí.
- **Loyalty session** — JWT v httpOnly cookie, refresh on demand.

---

## 21. Lokalizace a formátování

### 21.1 Podporované jazyky

CS (primární), SK, EN, DE, PL, HU. Všechny stringy musí být v i18n bundlu (`/locales/{lang}/booking.json`).

### 21.2 Měny

CZK, EUR, USD, GBP, PLN, HUF. Konverze přes denní rate, zobrazená měna se ukládá v session.

### 21.3 Formátování

- **Čísla:** `n.toLocaleString("cs-CZ")` → např. `4 900` (mezera jako tisícový oddělovač)
- **Datum krátké:** `Pá 15. 5.` (`fmtShort`)
- **Datum dlouhé:** `15. května` (`fmtCzech`, používá genitiv měsíce)
- **Měsíc:** `květen 2026` (`MONTH_NAMES`)
- **Češtinská pluralizace** — implementovaná inline:
  - `1 → "noc" / "host" / "pokoj"`
  - `2–4 → "noci" / "hosté" / "pokoje"`
  - `5+ → "nocí" / "hostů" / "pokojů"`
  - Backend by měl pluralizaci poskytnout přes ICU MessageFormat.

### 21.4 Typografie

- **Display & UI font:** `Source Sans 3` (Google Fonts), váhy 400/500/600/700/800
- Fallback chain: `Source Sans Pro, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### 21.5 Design tokens

V každém HTML souboru jako `:root` block. Klíčové:

```css
--ink-1: #1F2429     /* primary text */
--ink-2: #484C4F
--ink-3: #6D7073
--ink-4: #9093A0
--border: #E2E6E8
--surface: #F7F8F9
--brand: #550173        /* primary CTA, links */
--brand-dark: #3F0156
--brand-tint: #FAF5FC
--accent: #1F8A5B       /* success, discount, eco */
--accent-dark: #176B47
--accent-tint: #E8F4EE
--warning: #B45309
--danger: #B91C1C
```

---

## 22. Tweaks režim

### 22.1 Účel

**Interní režim pro design / marketing team.** Umožňuje za běhu měnit varianty UI (zapnout/vypnout sekce, změnit barvy, copy) **bez nasazení**.

### 22.2 Mechanika

Každá stránka má `TWEAK_DEFAULTS` jako JSON v komentářových markerech:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showLoyaltyBanner": true,
  "showSocialProof": true,
  ...
}/*EDITMODE-END*/;
```

`useTweaks(defaults)` hook spravuje state a komunikuje s host iframe přes `postMessage` (`__edit_mode_set_keys`). Změny se persistují přepisem JSON na disku.

### 22.3 Vystavené Tweaks (per stránka)

| Stránka | Klíče |
|---|---|
| Pick Room (table/list/grid) | `density`, `showImage`, `accent`, `sortBy`, `showHero`, `stickyHeader`, `showBenefits` |
| Single Room | `stickyHeader`, `gallery`, `showReviews` |
| Pick Package | filtr kategorií default |
| Upsell | per-sekce on/off (`showRoomUpgrade`, `showWellness`, `showParking`…) |
| Checkout | `showLoyaltyBanner`, `showSocialProof`, `showAddons`, `showBookingFor` |
| Confirmation | `showLoyalty`, `showReferral`, `showTimeline`, `showUpsell` |
| Voucher Sale | `showHero`, `showOccasions`, `previewDesign` |
| Reviews | filtry default |
| Concierge | sekce on/off |
| Proposal | `scenario`, `variantCount`, `layout`, `showLoyalty`, `showChatbot`, `showTimeline`, `granularEdit`, `daysToExpiry`, `loggedIn` |
| LTR | `stickyHeader`, `showStudentBadge` |

### 22.4 Pro produkci

Tweaks režim **vypnout v produkčním buildu** (`NODE_ENV === "production"`). Hodnoty se zafixují na defaults pro daný build, případně se A/B testují přes server-side experiments (Optimizely / GrowthBook).

---

## 23. Integrace a backendové kontrakty

### 23.1 PMS (Property Management System)

Hlavní zdroj pravdy pro:
- Inventory (počet pokojů per typ per datum)
- Sazby (rate plans)
- Restrictions (close to arrival, min stay)
- Cenotvorba

Doporučená integrace: REST API + webhook pro inventory změny.

### 23.2 Platební brána

- **Stripe** (preferováno) — karty, Apple Pay, Google Pay, SEPA
- **GoPay** (alternativa pro CZ trh) — bankovní převod, BankID
- **Bank transfer** — vygenerovaný VS po potvrzení rezervace (cron sleduje připsání → potvrzuje rezervaci)
- **Pay on arrival** — pouze pro flexibilní sazby, vyžaduje pre-auth karty

### 23.3 E-mail

Transakční e-maily přes SendGrid/Postmark:
- Confirmation s PDF voucherem
- Reminder 24h před příjezdem (s check-in instrukcemi)
- Post-stay feedback request + loyalty points credit
- Voucher delivery (dárkové vouchery)
- Proposal expiration warning (3 dny před)

### 23.4 PDF generation

Server-side rendering (Puppeteer / Chromium headless):
- Voucher po rezervaci
- Dárkový voucher
- LTR smlouva
- Proposal PDF export

### 23.5 AI / Claude integrace

Backend proxy k Anthropic API:
- Endpoint: `POST /api/ai/chat`
- Body: `{ context, history }`
- Kontext:
  - `pick-room` → vloží `window.ROOMS` do system promptu
  - `proposal` → vloží detail nabídky
  - `concierge` → vloží okolí
- Rate limit: 20 req/uživatel/hod
- Cache: žádný (každý dotaz unique)

### 23.6 Analytics

- **GA4** — pageviews, ecommerce events (begin_checkout, add_payment_info, purchase)
- **Hotjar / FullStory** — session recording (vypnout v Checkout — PII)
- **Vlastní events:**
  - `search_submitted`
  - `room_viewed` / `rate_selected`
  - `chatbot_opened` / `chatbot_recommendation_accepted`
  - `voucher_applied`
  - `loyalty_registered_inline`

### 23.7 BankID / DocuSign (LTR)

LTR smlouva vyžaduje elektronický podpis:
- BankID — pro klienty s českou bankou
- DocuSign — pro mezinárodní klienty (EU eIDAS-compliant)
- Fallback: tištěná verze poštou

### 23.8 SEO

- Single Room / Single Package / Room Landing / Package Landing **musí být SSR/SSG** s pre-renderovaným HTML.
- Strukturovaná data:
  - `Hotel` / `LodgingBusiness` schema na všech stránkách
  - `Product` / `Offer` schema na Single Room s aktuální cenou
  - `AggregateRating` na základě `window.REVIEWS_SUMMARY`
- Sitemap obsahuje všechny Single Room / Single Package permalinky.

---

## 24. Otevřené otázky a out-of-scope

### 24.1 Otevřené otázky (vyžadují rozhodnutí)

1. **Kumulace slev** — finální pravidla (loyalty + voucher + long-stay) — revenue manager.
2. **Tier upgrade trigger** — při pobytu? Při získání bodů? Po roce?
3. **Voucher na pobyt** — uplatnitelný v rámci Checkoutu jako kód, nebo jako platební metoda?
4. **LTR kauce** — drží hotel nebo escrow účet? Vrácení po check-out termín?
5. **Proposal granular edit** — pokud klient sníží počet pokojů, mění se i počet hostů automaticky?
6. **AI chatbot v Single Room/Package** — kontextový rozsah, kdy by AI mělo umět dodat link na Pick Room s pre-filled hodnotami.
7. **Mobile flow** — má mít Mobile vlastní Checkout/Confirmation, nebo redirect na desktop?
8. **Multi-property** — engine je single-property; pro chain (Hotel Balický + Vila Regenhart) potřebujeme property switcher.

### 24.2 Out of scope této verze

- **Admin / back-office** — správa rezervací z pohledu hotelu (jiný produkt).
- **Channel manager** — synchronizace inventory s OTA.
- **Group booking workflow** přesahující 5 pokojů (řeší se v Proposal).
- **Multi-property switcher** v navigaci.
- **PWA / offline support**.
- **App mobile (iOS/Android nativní)** — projekt cílí na web; možný follow-up.
- **Účetní výstupy** — daňový doklad, faktura na firmu — vrstva nad rezervací (řeší PMS).

### 24.3 Roadmap doporučení (návazné kroky)

- **v4.1** — Mobile parita pro celý flow (Single Room, Package, Checkout, Confirmation, Wellness)
- **v4.2** — Chatbot rozšířený o Single Room, Package, Concierge kontexty
- **v4.3** — Multi-property switcher (chain support)
- **v5.0** — Personalizace stránek dle loyalty profilu a historie

---

## Závěr

Tento dokument je živý. Změny v UX, copy, datových modelech nebo integracích musí být reflektovány. Pravidlo: **kód a dokument se updatují společně, ne odděleně.**

**Otázky?**
- Produktové vedení: [doplnit]
- Tech lead: [doplnit]
- Design lead: [doplnit]

— Konec dokumentu —
