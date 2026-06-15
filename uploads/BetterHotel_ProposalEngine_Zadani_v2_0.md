

**BETTER HOTEL**

**Proposal Engine**

*Produktové zadání modulu  •  Verze 2.0*

| Verze dokumentu: 2.0 Datum: Květen 2026 Autor: Martin Blažek Program: Příprava zadání Referenční úkol: PROJECT-346 Status: Připraven k review Změny v této verzi: Varianty nabídky, šablony, správa nabídek (Dashboard/Kanban), loyalty integrace, chatbot, provozní podklady, Orphan days, granulární editace klientem, delegování, časový harmonogram |
| :---- |

# **1\. Účel a kontext projektu**

Proposal Engine je nový modul systému Better Hotel určený k automatizaci a optimalizaci celého procesu správy poptávek a tvorby nabídek pro skupinové pobyty, svatby, konference, korporátní akce a další segmenty vyžadující individuální nabídku. Cílem je nahradit stávající manuální proces (e-maily, tabulky, PDF soubory) plně integrovaným řešením přímo v PMS.

| Strategický cíl Zkrátit průměrnou dobu odpovědi na poptávku z hodin na minuty, zvýšit konverzní poměr nabídek, zlepšit zákaznickou zkušenost a poskytnout recepčním i obchodním týmům plný přehled nad prodejním pipeline skupinového ubytování. |
| :---- |

Modul se skládá ze dvou hlavních částí:

* Administrace v BH (PMS) — správa poptávek, tvorba a editace nabídek, šablony, správa nabídek (dashboard, kanban, statistiky), notifikace, integrace do stávajících modulů.

* Proposal Engine FE (IBE) — klientská část integrovaná do booking enginu: interaktivní nabídka, výběr variant, formuláře, souhlas s dokumenty, platba.

# **2\. Analýza trhu a konkurenčních řešení**

Průzkum čtyř klíčových konkurenčních produktů. Shrnuty silné stránky a inspirace pro Better Hotel.

## **2.1 LetShare ProposalPro (proposalpro.online)**

* Nabídky v libovolném jazyce, neomezené fotky, šablony pro různé segmenty

* Klient může upravovat obsah — počet pokojů, obědů, nastavení prostor

* Platba přímo v nabídce přes Stripe; opcionalní rezervace s pozdějším potvrzením

* Klíčová diferenciace: automatické propojení s dostupností a cenami oproti Word/PDF

## **2.2 MicePro — AI-Powered Proposal Generator (proposal.micepro.io)**

* Generování personalizovaných nabídek pro skupiny v minutách pomocí AI

* Data-driven přístup, zaměření na rychlost: od RFP k nabídce co nejrychleji

## **2.3 HippoVideo — Proposal Automation for Hotels (hippovideo.io)**

* Interaktivní video nabídky s AI avatarem; host uvítán jménem a proveden nabídkou

* Engagement analytics: kdo, kdy, jak dlouho, zda sdílel

* Lead Catcher → Proposal → Deal Room → platba — plně automatizovaný pipeline

* Klíčové metriky: \+31 % win rate, 83 % rychlejší tvorba, 5× engagement vs. PDF

## **2.4 Cvent Smart Custom Proposals**

* Enterprise řešení, propojení s Cvent RFP platformou, korporátní segment

* Brand konzistence, rychlé šablony, komplexní reporting konverzí

## **2.5 Srovnávací přehled**

| Funkce | ProposalPro | MicePro | HippoVideo | Cvent | BH |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Integrace s PMS | Vlastní BE | API | API | Cvent | Nativní |
| Varianty nabídky (více) | Ne | Ne | Ne | Ano | Ano |
| Klientská editace nabídky | Ano | Ne | Omezená | Ne | Granulární |
| AI generování textů | Ne | Ano | Ano | Částečně | Ano |
| Engagement analytics | Omezená | Ne | Detailní | Základní | Ano |
| Online platba | Stripe | Ne | Ne | Ano | Ano |
| Blokace kapacity (štafle) | Ano | Ne | Ne | Ano | Ano |
| Loyalty integrace | Ne | Ne | Ne | Částečně | Ano |
| Kanban / pipeline view | Ne | Ne | Ano | Ano | Ano |
| Šablony (2-úrovňové) | Základní | Ne | Ne | Ano | Ano |

# **3\. Poznatky z průzkumu klientů**

Průzkum proběhl v lednu–únoru 2025, 8 použitelných odpovědí (3× hotel \>20 pokojů, 2× hotel/penzion do 20, 2× hostel, 1× apartmány).

## **3.1 Největší bolesti**

* Ruční přepisování cen a pokojů do e-mailu — nejčastěji zmiňovaný problém

* Složitost úpravy kalkulace při změně požadavků klienta

* Obtížná vizuální úprava nabídky, Word/e-mail nevytváří poutavý dojem

* Neexistence online potvrzení klientem — komplikovaný proces

* Ruční sledování stavu nabídek, žádná centrální evidence

## **3.2 Požadované funkce**

* Automatické načítání cen a pokojů ze systému a ceníku

* Šablony s fotkami, textem a kontaktními údaji hotelu

* Časový harmonogram akce (kdy se co vydává, aktivity)

* Online přijetí nabídky a platba zálohy

* Přehled nabídek se stavy a statistikami úspěšnosti

* Delegování zpracování nabídky na kolegu

* QR kód pro sdílení nabídky

## **3.3 Pokrytí v zadání**

| Požadavek respondenta | Pokrytí v zadání | Verze |
| :---- | :---- | :---- |
| Automatické načítání cen ze systému | Plně pokryto — propojení s ceníkem a štaflemi | V1 |
| Šablony s fotkami, texty, kontakty | Plně pokryto — 2-úrovňový systém šablon | V1 |
| Eliminace ručního přepisování | Plně pokryto — integrace nahrazuje manuální práci | V1 |
| Evidence nabídek se stavy a filtry | Plně pokryto — Správa nabídek (tabulka, kanban) | V1 |
| Online přijetí a platba | Plně pokryto — IBE proposal flow | V1 |
| Komunikace s hostem | Pokryto — chatbot (ref. na samostatné zadání) | V1 |
| Časový harmonogram akce | Pokryto | V1 |
| Delegování nabídky na kolegu | Pokryto | V1 |
| QR kód pro sdílení | Pokryto — URL \+ QR kód | V1 |
| Statistiky úspěšnosti a výdělků | Pokryto | V2 |
| Provozní podklady pro kuchaře/provoz | Pokryto | V1 |
| DPH výpočet v tabulce | Pokryto — bez DPH / s DPH | V1 |
| Orphan days — proaktivní nabídky | Pokryto | V2 |
| Hromadné oslovení segmentu | Mimo scope — patří do email marketing modulu | — |
| Instagram / newsletter šablona | Mimo scope | — |

# **4\. Architektura modulu**

## **4.1 Přehled komponent**

| BACK-END / PMS (Administrace) | FRONT-END / IBE (Proposal Engine) |
| :---- | :---- |
| **Správa nabídek**  Dashboard Tabulka poptávek Kanban pipeline Statistiky (V2) Reporty (V2) **Formulář poptávky / nabídky**  Varianty nabídky  Granulární editace klientem  Delegování na uživatele  Časový harmonogram **Systém šablon**  Offer templates (presets)  Bloky (texty, pokoje, služby, platební podmínky) **Integrace**  Loyalty modul (ref.) Chatbot (ref.) Inbox Notifikační centrum Štafle CRON joby | **Interaktivní nabídka**  Srovnávací view variant  Statická / dynamická volba pokojů  Tabulka s cenou (bez DPH / s DPH)  Časový harmonogram akce **Klientský flow**  Formuláře k vyplnění  Upsale služeb  Souhlas s dokumenty / podpis  Platební brána (záloha / plná platba)  Odmítnutí nabídky s důvodem **Rozšíření**  Loyalty integrace (pre-fill, benefity, body)  Chatbot widget (kontext nabídky)  QR kód pro sdílení |

## **4.2 Technická integrace**

* FE (IBE) přistupuje k nabídce přes URL GET parametr s identifikátorem nabídky

* Detail nabídky se stahuje z BH API — struktura podobná load-reservation \+ speciální parametry nabídky

* Všechna volání z IBE doplněna o HTTP hlavičku x-proposal: {ID nabídky}

* Vzniknou nové API endpointy: detail formulářů, dokumentů, stav, odmítnutí, potvrzení

* Endpointy specifické pro nabídky se nepřidávají do defaults IBE

* Platba přes stávající platební brány IBE (záloha, plná platba, force platba)

# **5\. Datový model — struktura poptávky a nabídky**

## **5.1 Hlavička poptávky**

| Pole | Typ | Popis |
| :---- | :---- | :---- |
| Číslo poptávky | string / číselná řada | Vlastní číselná řada hotelu |
| Datum přijetí | datetime | Automaticky při vytvoření |
| Interní označení (label) | string | Volný popis pro interní potřeby |
| Status poptávky | enum | Čeká / Zpracovaná / Zamítnuto / Výhra / Prohra / Expirováno |
| Datum expirace | date | Opcní expirace nabídky |
| Datum začátku / konce | date | Termín pobytu nebo akce |
| Počet hostů | int | Předpokládaný počet osob |
| Ceník (rate) | FK | Propojení na rate plan |
| Storno podmínky | FK | Odkaz na storno politiku |
| Zdroj poptávky | FK | Napojení na zdroj rezervací |
| Volba pokojů | enum | Přiřazené pokoje / Volná volba |
| Výše zálohy | decimal | Výše požadované zálohy |
| Reference na hosta / firmu | FK | Adresář hostů / firem |
| Přiřazený uživatel (delegování) | FK | Uživatel BH zodpovědný za zpracování |
| Požadavky klienta | text | Popis poptávky — může být vyplněn AI z Inboxu |
| Poznámka (interní) | text | Viditelná pouze pro obsluhu |
| Umožnit upsale | bool | Zobrazí krok s upsalem v IBE |
| Konfirmace podpisem | bool | Vyžaduje elektronický podpis |
| Připojené formuláře | FK\[\] | Formuláře k vyplnění hostem |
| Připojené dokumenty k podpisu | FK\[\] | Dokumenty vyžadující souhlas |
| Připojené přílohy | FK\[\] | Libovolné soubory ke stažení |
| Granulární editace klientem | JSON | Mapa povolených polí k editaci hostem |

## **5.2 Varianta nabídky**

Jedna poptávka může obsahovat více variant nabídky. Každá varianta má:

* Označení varianty (label, např. 'Základní balíček', 'Premium balíček')

* Příznak doporučené varianty — vizuálně zvýrazněna v srovnávacím view

* Vlastní výběr pokojů, minutových rezervací a doplňkových služeb

* Vlastní tabulku položek a cen

* Vlastní texty (nebo zdědí texty z hlavní nabídky)

* Vlastní platební podmínky a storno politiku

Kapacita na štaflích se blokuje pouze pro maximálně kapacitně náročnou variantu — ostatní varianty sdílejí tento pool. Systém hlídá, aby celková kapacita pro danou variantu byla pokryta.

## **5.3 Granulární editace klientem**

Admin může per-nabídka zapnout/vypnout možnost editace konkrétních polí hostem:

| Editovatelné pole | Typ změny | Poznámka |
| :---- | :---- | :---- |
| Počet osob | Numerický input | Ovlivňuje cenu (přepočet) |
| Strava | Výběr z dostupných možností | Upgrade/downgrade v rámci rate |
| Datum (posunutí termínu) | Výběr data v nastavené toleranci | ±X dní, nastavitelné v admin |
| Preference pokoje | Výběr v rámci daného RT | Pokud je aktivní room preference |
| Přidání extra služeb | Výběr z předvoleného listu | Admin definuje nabídnuté položky |

Pokud host provede změnu, cena se automaticky přepočítá. Fixní nabídka zůstává fixní — editace neovlivňuje základní výběr pokojů, pouze rozšiřuje nebo upřesňuje.

## **5.4 Položky na účtu**

* Automaticky generované: ubytování, strava, city tax, 

* Moznost manualne pridat na ucet: doplňkové služby z ciselniku, vlastni polozky

* Ke každé položce vlastní popis

* Volné položky s vlastním labelem

* Každá položka: label, cena/j, počet jednotek, celkem bez DPH, celkem s DPH

* Úprava celkové ceny — jednotková cena se dopočítá

* Vizuální kategorizace: Ubytování | Stravování | Pronájem prostor | Doprovodné aktivity | Ostatní

* Tabulka zobrazuje mezisoučty dle kategorie, celkový součet bez DPH, výši DPH a celkem s DPH

## **5.5 Časový harmonogram akce**

Volitelná sekce nabídky pro akce vyžadující časové plánování (konference, svatby, teambuilding):

* Přehledná časová osa (timeline) s jednotlivými body programu

* Každý bod: čas, název aktivity/výdeje, popis, lokace (napr. sál, restaurace), zodpovědný úsek

* Možnost kategorizace: Ubytování | Stravování | Konference | Aktivity | Přestávka

* Viditelné pro hosta v IBE jako součást nabídky, tisknutelné

* Může být součástí šablony nabídky nebo vytvořen ad hoc

# **6\. Administrace v BH — Back-end část**

## **6.1 Správa nabídek — hlavní view**

Nová sekce v menu Recepce → Nabídky. Slouží jako hlavní pracovní plocha pro práci s poptávkami a nabídkami. Obsahuje čtyři subviews přístupné přes záložky.

### **6.1.1 Dashboard**

Výchozí pohled poskytující real-time přehled stavu pipeline. Cílová skupina: vedoucí recepce, obchodní manažer.

* Karta: Počet aktivních nabídek \+ celková pipeline hodnota (Kč)

* Karta: Nabídky expirující do 24h / 3 dnů / 7 dnů — s přímým odkazem

* Karta: Dnešní aktivita — nové poptávky, potvrzení, odmítnutí

* Tabulka 'Vyžaduje akci': nezpracované poptávky starší než X hodin, nabídky čekající na follow-up

* Mini-kanban preview: počty karet v každém sloupci pipeline

* Přiřazené mně: nabídky delegované na přihlášeného uživatele

### **6.1.2 Tabulka \- napojeni na NotionLike table**

Klasická evidence všech poptávek. Obsahuje historické i aktivní záznamy.

* Sloupce: číslo, status (barevně), klient, termín, hodnota, expirace, přiřazený uživatel, blokuje kapacitu

* Rychlé filtry: Aktivní | Čekající | Expiruje brzy | Výhry | Prohry | Expirované | Vše

* Fulltextové vyhledávání přes klienta, označení, číslo poptávky

* Řazení dle libovolného sloupce

* Inline akce: prodloužit expiraci, změnit status, delegovat, odeslat připomínku

* Rozkliknutí firmy/hosta: zobrazí všechny historické poptávky daného klienta

### **6.1.3 Kanban**

Vizuální pipeline view pro správu obchodního procesu. Drag & drop mezi sloupci mění stav poptávky.

| Nová poptávka | Nabídka připravena | Odesláno klientovi | Uzavřeno |
| :---- | :---- | :---- | :---- |
| **Stav: Čeká na vyřízení** Nová příchozí poptávka, ještě není zpracována | **Stav: Zpracovaná nabídka** Nabídka sestavena, připravena k odeslání | **Stav: Odesláno** Host obdržel nabídku, čeká se na odpověď | **Výhra (zelená) / Prohra (červená) / Expirováno (šedá)** Terminální stavy — karty zůstávají viditelné, nelze přetáhnout zpět |

* Karta na kanbanu zobrazuje: jméno klienta, hodnotu nabídky, termín akce, datum expirace, přiřazený uživatel

* Vizuální indikátory: červená \= expiruje do 24h, oranžová \= expiruje do 3 dnů, zelená \= potvrzeno

* Drag & drop změní stav poptávky — s potvrzovacím dialogem pro terminální stavy (Výhra/Prohra)

* Filtr dle přiřazeného uživatele — každý vidí svůj pipeline

### **6.1.4 Statistiky (V2)**

Interaktivní analytický dashboard s filtry dle období, obsluhy, segmentu a zdroje poptávky.

* Win rate — celkový i dle segmentu, zdroje, přiřazeného uživatele

* Průměrná hodnota nabídky a průměrná výše zálohy

* Průměrná doba odpovědi na poptávku (od přijetí do odeslání nabídky)

* Průměrná doba od odeslání do přijetí nebo odmítnutí

* Konverzní funnel: Poptávky přijaty → Nabídka odeslána → Přijato → Zaplaceno

* Top segmenty (konference, svatby, skupiny, teambuilding)

* Top zdroje poptávek a jejich konverzní poměr

* Sezónalita: kdy přichází nejvíce poptávek a jaká je úspěšnost dle měsíce

* Analýza důvodů odmítnutí (kategorizace AI — viz sekce 9\)

### **6.1.5 Reporty (V2)**

* Generátor exportovatelných přehledů za zvolené období

* Export do Excelu (.xlsx) nebo tiskový výstup

* Typy reportů: pipeline summary, výkonnost obsluhy, segmentová analýza, sezónní přehled

## **6.2 Formulář poptávky a nabídky**

Přístupný z: tlačítko '+ Přidat' v Master UI, tabulka poptávek, přímo z Inboxu.

### **6.2.1 Záložka: Základní informace**

* Číslo, datum přijetí, label, status, datum expirace, zdroj poptávky

* Vazba na klienta: host nebo firma z adresáře

* Termín (od–do), počet hostů

* Přiřazení uživatele — delegování zpracování na konkrétního člena týmu

* Požadavky klienta (výstup AI extrakce z Inboxu nebo manuální zadání), interní poznámka

### **6.2.2 Záložka: Varianty a pokoje**

* Správa variant: přidání nové varianty, označení doporučené varianty

* Pro každou variantu: výběr pokojů (přiřazené nebo volná nabídka), minutové rezervace, doplňkové služby

* Kapacita: systém zobrazuje, která varianta blokuje štafle (maximálně náročná)

### **6.2.3 Záložka: Položky a ceny**

* Automaticky generované položky dle výběru pokojů a služeb

* Kategorizace: Ubytování | Stravování | Pronájem prostor | Aktivity | Ostatní

* Volné položky s vlastním labelem

* Zobrazení bez DPH / výše DPH / celkem s DPH

* Úprava celkové ceny — jednotková cena se přepočítá

### **6.2.4 Záložka: Platební podmínky**

* Rate / ceník, storno podmínky, výše zálohy

* Konfirmace podpisem (bool), statická sleva z číselníku

* Granulární editace klientem: výběr polí, která může host editovat (počet osob, strava, datum ±X dní, preference, extra služby)

* Seznam extra služeb dostupných k výběru hostem (předvolený list)

### **6.2.5 Záložka: Texty a obsah**

* Výběr šablony nabídky (preset celé nabídky) nebo sestavení z bloků

* Úvodní text (WYSIWYG editor s proměnnými)

* Doplňkové info k ceně a k platbě

* Časový harmonogram (volitelně) — editor časové osy

* Připojení formulářů, dokumentů k podpisu, příloh

### **6.2.6 Záložka: Notifikace**

* Výběr e-mailové šablony pro odeslání nabídky

* Nastavení reminderů před expirací (X hodin/dnů)

## **6.3 Systém šablon**

Dvouúrovňový systém umožňující jak rychlé vytvoření celé nabídky jedním klikem, tak flexibilní skládání z jednotlivých bloků.

| Klíčový princip Offer template je složen z reusable bloků. Hotely si nejprve vytvoří knihovnu bloků a z nich pak sestavují offer templates pro opakující se segmenty (konference, svatba, skupinový pobyt, teambuilding...). |
| :---- |

### **6.3.1 Úroveň 1 — Offer Templates (presets)**

Kompletní preset celé nabídky pro konkrétní segment nebo typ akce. Obsluha vybere šablonu, zadá termín a klienta — vše ostatní je předvyplněno.

* Název a popis šablony, segment (konference, svatba, skupiny, teambuilding, jiné)

* Složena z: bloků textů, bloku pokojů, bloku služeb, bloku platebních podmínek, bloku harmonogramu

* Přiřazené formuláře a dokumenty k podpisu

* Nastavení granulární editace klientem

* Správa per-hotel (každý hotel má svou knihovnu šablon, verzování není vyžadováno)

### **6.3.2 Úroveň 2 — Reusable bloky**

| Typ bloku | Obsah |
| :---- | :---- |
| Textový blok | Pojmenovaný text s proměnnými (host, firma, termín, počet osob). Např. 'Uvítání — firemní klient', 'Uvítání — svatba' |
| Blok pokojů | Přednastavený výběr typů pokojů a strav pro daný segment. Např. '50 osob — 2×DBL \+ 1×APP' |
| Blok služeb | Přednastavené balíčky doplňkových služeb. Např. 'Coffee break balíček', 'Gala dinner set' |
| Blok platebních podmínek | Kombinace rate, storno politiky, výše zálohy. Např. 'Korporátní podmínky Q4' |
| Blok harmonogramu | Předdefinovaná časová osa pro typické akce. Např. 'Jednodenní konference s obědem' |

## **6.4 Loyalty modul — integrační body**

Loyalty modul bude řešen samostatným zadáním. Níže jsou popsány integrační body relevantní pro Proposal Engine.

| Loyalty modul (ref. na samostatné zadání) Systém bodů, tier nastavení v rámci rates, přiřazování výhod (slevy, extras, upgrades) dle tier úrovně. Proposal Engine konzumuje tyto informace pro zobrazení benefitů a automatické aplikování podmínek. |
| :---- |

### **V administraci BH:**

* Při vytváření nabídky systém zobrazí loyalty tier klienta/firmy (badge u jména)

* Automatický návrh vhodného rate plánu dle loyalty tier

* Přehled aktivních benefitů hosta relevantních pro daný pobyt (volné upgrady, extras, sleva)

* Body přičítané za potvrzenou skupinovou rezervaci — nastavitelná výše dle hodnoty nabídky

### **V IBE (klientský view):**

* Loyalty člen se přihlásí v IBE — kontaktní údaje jsou předvyplněny z loyalty profilu

* Zobrazení aktivního tieru a dostupných benefitů pro danou nabídku

* Body, které klient získá potvrzením této nabídky — vizuální motivátor

* Exkluzivní nabídky dostupné pouze pro loyalty členy (označení 'Member Exclusive')

## **6.5 Nastavení modulu poptávek**

| Nastavení | Popis |
| :---- | :---- |
| Výchozí šablona e-mailu | Šablona odesílaná po vytvoření nabídky |
| Šablona expirační notifikace | E-mail hostovi při expiraci |
| Šablona reminderu | E-mail X hodin před expirací |
| Čas pro reminder | Nastavitelný počet hodin před expirací |
| Auto-smazání rezervací po expiraci | Automaticky odstranit opcní rezervace |
| Auto-smazání po odmítnutí | Automaticky odstranit opcní rezervace |
| Prohra po X dnech bez aktivity | Auto-přechod do stavu Prohra |
| Tolerance posunutí data klientem | Počet dní, o které může klient posunout termín |

# **7\. Proposal Engine — Front-end (IBE / klientská část)**

Nabídky jsou integrovány do Booking Enginu jako samostatné view. Sdílejí hlavičku IBE s volbou jazyka a měny. V proposal mode nejsou zobrazeny záložky pro standardní rezervaci ani vouchery.

## **7.1 Srovnávací view variant**

Pokud nabídka obsahuje více variant, jsou zobrazeny ve srovnávacím layout side-by-side před detailem.

* Každá varianta: název, stručný popis, celková cena, klíčové položky (počet pokojů, strava, hlavní služby)

* Doporučená varianta vizuálně zvýrazněna (badge 'Doporučujeme', odlišná barva rámečku)

* Tlačítko 'Vybrat tuto variantu' — po výběru přejde na detail dané varianty

* Host může přepínat mezi variantami zpět — výběr se nepotvrzuje, dokud nevyplní kontaktní údaje

* Pouze jedna varianta může být přijata — výběr druhé nahradí předchozí výběr

## **7.2 Struktura nabídky — detail**

### **7.2.1 Hlavička**

* Logo hotelu, označení nabídky (label), termín, počet dní do expirace, číslo poptávky

* Úvodní text (personalizovaný pozdrav), fotogalerie

* Kontaktní osoba hotelu: jméno, e-mail, telefon, avatar

* Strukturované shrnutí: počet osob, pokojů, termín, kontaktní údaje hosta/firmy

* QR kód pro sdílení nabídky (zobrazitelný / kopírovatelný link)

* Loyalty badge: pokud je host loyalty člen, zobrazí se tier a dostupné benefity

### **7.2.2 Tabulka s cenou**

* Položky kategorizované: Ubytování | Stravování | Pronájem prostor | Aktivity | Ostatní

* Mezisoučty dle kategorie

* Celkový součet: bez DPH | výše DPH | celkem s DPH

* Poznámka k ceně, loyalty sleva (pokud aplikovatelná — označena jako member benefit)

### **7.2.3 Časový harmonogram (volitelně)**

* Přehledná timeline akce — viditelná pro hosta jako součást nabídky

* Body programu s časy, popisem, lokací

* Tisknutelná sekce

### **7.2.4 Sekce pokojů**

**A) Fixní nabídka — přiřazené pokoje:**

* Karty s předem vybranými typy pokojů — fotky a detailní popis

* Pokud je více rate, host si vybere jednu → aktualizace ceny

* Granulárně editovatelné pole zobrazena jako interaktivní prvky

**B) Volná nabídka — dynamická:**

* Doporučená nabídka (nejvýhodnější pro zadaný počet hostů)

* Standardní karty IBE filtrované dle nastavených typů pokojů

* Po saturaci počtu hostů → dialog s informací

## **7.3 Chatbot widget**

Integrovaný chatbot dostupný v pravém dolním rohu po celou dobu prohlížení nabídky.

| Chatbot (ref. na samostatné zadání) Chatbot bude řešen jako sdílený modul napříč BH produkty. V kontextu nabídky má přístup k detailu dané poptávky (termín, pokoje, ceny, podmínky) a umí odpovídat na dotazy hosta. Umožňuje eskalaci na živou podporu — obsluha BH je notifikována a může konverzaci převzít. |
| :---- |

* Kontext: chatbot zná obsah konkrétní nabídky — termín, pokoje, ceny, storno podmínky, hotel

* Typické dotazy: parkování, stravování, přístupnost, možnosti úprav, podmínky platby

* Eskalace: host může požádat o kontakt s obsluhou — notifikace do notifikačního centra BH

* Notifikace obsluze: nová zpráva od hosta k nabídce — zobrazí se v detailu poptávky v admin

## **7.4 Granulárně editovatelné sekce**

* Pole povolená adminem se zobrazí jako interaktivní — ostatní jsou read-only

* Změna počtu osob nebo stravy → okamžitý přepočet ceny (live update tabulky)

* Extra služby: host vidí předdefinovaný list a může přidat položky do svého přehledu

* Po editaci se zobrazí shrnutí změn před potvrzením

## **7.5 Mezikrok — formuláře a upsale**

* Formuláře: accordion, required odpovědi před přechodem, status (vyplněno/nevyplněno)

* Upsale: 2\. krok IBE s možností dokoupení doplňkových služeb

## **7.6 Poslední krok — kontaktní údaje a platba**

* Předvyplnění z loyalty profilu (pokud přihlášen) nebo z adresáře hostů/firem

* Loyalty body získané potvrzením: zobrazení jako motivátor před dokončením

* Souhlas s dokumenty k podpisu, se storno podmínkami

* Elektronický podpis (pokud aktivní)

* Platba — stávající platební brány IBE

## **7.7 Odmítnutí nabídky**

* Tlačítko odmítnutí viditelné po celou dobu na hlavní stránce nabídky

* Vynutit důvod odmítnutí (výběr z kategorií \+ volný text)

* Kategorie odmítnutí: Cena | Termín | Kapacita | Vybrali konkurenci | Akce se nekoná | Jiné

* Odeslání na API → uložení, změna stavu, notifikace obsluhy

# **8\. Flows, notifikace a automatizace**

## **8.1 Flow: Vytvoření poptávky**

1. Obsluha nebo Inbox inicializuje novou poptávku (s AI extrakcí dat z e-mailu)

2. Vyplnění formuláře, přiřazení uživatele, sestavení variant nabídky

3. Uložení → systém vytvoří opcní rezervace na štaflích (max kapacita variant)

4. Otevře se e-mailový klient s výchozí šablonou — link na nabídku jako proměnná \+ QR kód

## **8.2 Flow: Potvrzení nabídky hostem**

5. Host vybere variantu, provede granulární úpravy (pokud povoleno)

6. Vyplní formuláře, odsouhlasí dokumenty, případně podepíše elektronicky

7. Platba zálohy nebo plné ceny

8. Systém potvrdí opcní rezervace z vítězné varianty → stav Potvrzeno

9. Rezervace ostatních variant zrušeny

10. Loyalty body přičteny na účet hosta/firmy

11. Potvrzovací e-mail hostovi, notifikace obsluze do notifikačního centra

12. Stav poptávky → Výhra

## **8.3 Flow: Odmítnutí nabídky hostem**

13. Host vybere kategorii důvodu a vyplní volný text

14. Stav poptávky → Zamítnuto klientem

15. Notifikace obsluze (e-mail \+ notifikační centrum) s důvodem

16. Dle nastavení: auto-smazání opcních rezervací

## **8.4 Flow: Expirace nabídky**

17. CRON: X hodin před expirací → odeslání reminderů hostovi i hotelu

18. Po expiraci: expirační e-mail hostovi, stav → Expirováno

19. Dle nastavení: auto-smazání opcních rezervací

20. Notifikace do notifikačního centra

## **8.5 Flow: Provozní podklady po potvrzení**

Po potvrzení nabídky hostem systém automaticky vygeneruje provozní podklady pro relevantní úseky hotelu.

21. Stravovací podklady pro kuchaře: počty porcí dle stravy, typ menu, časy výdeje z harmonogramu

22. Pokojový seznam: přiřazené typy pokojů, počty, datum příjezdu/odjezdu, speciální požadavky

23. Provozní list pro recepci: termín, počet hostů, kontakt, přiřazené akce, platební stav

24. Notifikace příslušným vedoucím úseků (e-mail nebo interní zpráva)

25. Podklady dostupné ke stažení v detailu poptávky v admin

## **8.6 Flow: Integrace do stávajících modulů**

### **Master UI**

* Přidat novou možnost v tlačítku '+ Přidat': Vytvořit poptávku

### **Menu — Recepce**

* Přejmenovat 'Tabulka rezervací' → 'Rezervace' \+ rychlé filtry

* Nová položka: Nabídky (správa nabídek)

### **Štafle**

* Opcní rezervace zobrazeny ve speciálním stavu — doporučit hotel vytvořit si dedikovaný stav

* Hlídání expirace, auto-smazání po expiraci nebo odmítnutí

### **Inbox**

* Z e-mailu lze vytvořit novou poptávku; AI extrahuje termín, počet, požadavky

* Obsluha může odpovědět s linkem na vytvořenou nabídku přímo z Inboxu

* Propojení e-mailu s poptávkou — označení jako zpracované, detekce odpovědí

# **9\. AI příležitosti a automatizace**

## **9.1 Priorita vysoká — V1**

### **9.1.1 Extrakce dat z příchozích poptávek (Inbox AI)**

* Termín, počet hostů, typ akce, speciální požadavky, kontaktní údaje

* Výstup: předvyplněný formulář poptávky ke kontrole a uložení

| Přínos Eliminace ručního opisování z e-mailů. Zpracování poptávky do 2 minut místo 10–15. |
| :---- |

### **9.1.2 AI generování textu nabídky**

* Na základě typu akce, termínu, počtu osob, firmy a požadavků AI navrhne úvodní text

* Obsluha zkontroluje a upraví — AI text je návrh, ne finální výstup

| Přínos Konzistentní tón komunikace, žádné psaní od nuly pro každou nabídku. |
| :---- |

### **9.1.3 Doporučení konfigurace pokojů**

* AI navrhne optimální konfiguraci na základě počtu hostů, dostupnosti a historické úspěšnosti

## **9.2 Priorita střední — V2**

### **9.2.1 Engagement analytics a follow-up timing**

* Sledování otevření nabídky, délky prohlížení, sdílení, opakovaných návštěv

* AI doporučí optimální čas pro follow-up kontakt na základě chování hosta

### **9.2.2 Analýza důvodů odmítnutí**

* AI kategorizuje a analyzuje shromážděné důvody odmítnutí

* Pravidelné reporty s doporučeními pro úpravu strategie nabídek

### **9.2.3 Automatický překlad nabídky**

* AI přeloží texty nabídky do jazyka hosta, zachová formátování a proměnné

## **9.3 Priorita nízká — V3**

* AI chatbot v nabídce — sdílený modul, viz ref. na samostatné zadání

* Prediktivní pricing a personalizované upsell doporučení

## **9.4 Orphan Days — proaktivní nabídky (V2)**

Funkce pro proaktivní oslovení hostů s nabídkou prodloužení pobytu na základě detekce proluk v obsazenosti.

* Systém detekuje Orphan Days — proluky mezi rezervacemi (1–3 noci)

* Automaticky identifikuje hosty s příjezdem nebo odjezdem sousedícím s prolukovou

* Vygeneruje personalizovanou nabídku prodloužení (Proposal Engine flow)

* Odesílání dle nastavitelných pravidel (min. délka proluky, min. dny předem, segment hostů)

* Propojení s RevPAR daty nebo externími nástroji (PriceLabs API — volitelně)

* Výsledek: vyšší obsazenost při nižších distribučních nákladech

# **10\. Technické a nefunkcionální požadavky**

## **10.1 Nové API endpointy (BH ↔ IBE)**

| Metoda | Endpoint | Popis |
| :---- | :---- | :---- |
| GET | /proposals/{id} | Detail nabídky (varianta, pokoje, ceny, podmínky) |
| GET | /proposals/{id}/variants | Seznam variant nabídky |
| POST | /proposals/{id}/decline | Odmítnutí nabídky \+ kategorie \+ důvod |
| GET | /proposals/{id}/forms | Stažení přiložených formulářů |
| GET | /proposals/{id}/documents | Stažení přiložených dokumentů |
| POST | /proposals/{id}/confirm | Potvrzení \+ výběr varianty \+ platba |
| PATCH | /proposals/{id}/status | Interní aktualizace stavu |
| GET | /proposals/{id}/qr | Vygenerování QR kódu pro sdílení |
| GET | /proposals/{id}/operational | Provozní podklady (po potvrzení) |

## **10.2 Kapacita a štafle**

* Při uložení nabídky s přiřazenými pokoji systém vytvoří opcní rezervace na štaflích

* Kapacita se blokuje pouze pro maximálně náročnou variantu — ostatní varianty sdílejí pool

* Systém hlídá, aby celková kapacita žádné varianty nepřekročila dostupnost

* Při potvrzení: rezervace vítězné varianty → Potvrzeno; ostatní varianty zrušeny

## **10.3 CRON joby**

| CRON job | Popis |
| :---- | :---- |
| Kontrola expirace | Každou hodinu — detekce expirací, stav, notifikace, cleanup rezervací |
| Odeslání reminderů | X hodin před expirací → šablona hostovi i hotelu |
| Auto-přechod Prohra | Jednou denně — nabídky bez aktivity X dní po expiraci |
| Cleanup rezervací | Jednou denně — čistění osiřelých opcních rezervací |
| Orphan Days (V2) | Denně — detekce proluk, generování proaktivních nabídek |

## **10.4 Bezpečnost**

* Přístup k administraci podléhá roli uživatele v BH

* Nabídka v IBE přístupná přes unikátní URL s UUID — bez přihlášení

* Expirovaná nebo odmítnutá nabídka zobrazí stavovou stránku, platba není možná

* Dokumenty a formuláře dostupné pouze přes autorizovaný API endpoint s validním proposal ID

# **11\. Identifikace zdrojů a přípravná fáze**

## **11.1 Zdroje pro zahájení vývoje**

### **Design a UX**

* UI pro Správu nabídek: Dashboard, Tabulka, Kanban

* UI pro srovnávací view variant v IBE

* UI pro formulář poptávky — všechny záložky včetně granulární editace

* UI pro systém šablon — správa bloků a offer templates

* UI pro chatbot widget v IBE (koordinace s chatbot zadáním)

* UI pro časový harmonogram — editor v admin \+ zobrazení v IBE

* UI pro provozní podklady — výstupní přehled

### **API a backend**

* Zdokumentovat nové API endpointy pro IBE ↔ BH komunikaci

* Definovat datové modely pro varianty, granulární editaci, šablony

## **11.2 Týmový přesah**

* Inbox: sdílené AI komponenty pro extrakci dat z e-mailů

* IBE: nové endpointy a proposal mód, srovnávací view

* Štafle: opcní stavy, správa kapacity pro varianty

* Chatbot: koordinace API a kontextového modelu

* Loyalty: koordinace integraci body/tier/benefity v Proposal Enginu

# **12\. Navrhované fáze vývoje**

## **Verze 1.0 — Core Proposal Engine**

| \# | Funkce | Priorita |
| :---- | :---- | :---- |
| 1 | Evidence poptávek — Správa nabídek (Dashboard, Tabulka, Kanban) | Must have |
| 2 | Formulář poptávky — všechny záložky | Must have |
| 3 | Varianty nabídky — srovnávací view, správa kapacity | Must have |
| 4 | Granulární editace klientem (nastavení per-nabídka) | Must have |
| 5 | Delegování nabídky na uživatele | Must have |
| 6 | Systém šablon — offer templates \+ reusable bloky | Must have |
| 7 | Opcní rezervace na štaflích \+ správa kapacity pro varianty | Must have |
| 8 | FE nabídky v IBE — fixní i volná, srovnávací view | Must have |
| 9 | Online přijetí \+ výběr varianty \+ platba | Must have |
| 10 | Odmítnutí nabídky s kategorizovaným důvodem | Must have |
| 11 | Časový harmonogram akce (editor \+ IBE zobrazení) | Must have |
| 12 | Tabulka s cenou: DPH bez/s, kategorie služeb | Must have |
| 13 | E-mailové notifikace (vytvoření, expirace, potvrzení, odmítnutí) | Must have |
| 14 | CRON joby — expirace, remindery, cleanup | Must have |
| 15 | Provozní podklady po potvrzení (kuchyně, recepce, provoz) | Must have |
| 16 | QR kód pro sdílení nabídky | Must have |
| 17 | Loyalty integrace — tier badge, benefity, body po potvrzení | Must have |
| 18 | Chatbot widget v IBE (ref. na chatbot zadání) | Should have |
| 19 | AI extrakce dat z Inboxu | Should have |
| 20 | AI generování textu nabídky | Should have |
| 21 | Formuláře a dokumenty k podpisu v nabídce | Should have |
| 22 | Elektronický podpis (konfirmace podpisem) | Could have |
| 23 | Nastavení modulu poptávek | Must have |

## **Verze 2.0 — Analytika, AI a proaktivní funkce**

* Statistiky a Reporty (subview ve Správě nabídek) — win rate, funnel, výdělky, sezónalita

* Engagement analytics — sledování otevření, chování hosta v nabídce

* Chytrý follow-up timing na základě engagement dat

* Analýza a reporting důvodů odmítnutí (AI kategorizace)

* Automatický překlad nabídky do jazyka hosta

* Orphan Days — proaktivní nabídky prodloužení

## **Verze 3.0 — Pokročilé funkce**

* Prediktivní pricing a personalizovaný upsell

* Video prezentace nabídky (inspirace: HippoVideo)

* API pro export nabídek do externích systémů

# **13\. Definice hotovo (Definition of Done)**

## **13.1 Back-end / PMS**

* Správa nabídek: Dashboard, Tabulka (s filtry a inline akcemi) a Kanban (drag & drop) fungují

* Formulář poptávky: všechny záložky, validace, ukládání fungují

* Varianty: srovnávací view, správa kapacity (max varianta blokuje štafle) funguje

* Granulární editace klientem: nastavení per-nabídka se aplikuje v IBE

* Delegování: přiřazení uživatele se projeví ve filtru a v Kanbanu

* Šablony: offer templates i reusable bloky jdou vytvořit, editovat a použít

* Provozní podklady: generovány automaticky po potvrzení, dostupné v admin

* CRON joby nasazeny a otestovány

## **13.2 Front-end / IBE**

* Srovnávací view variant funguje, výběr jedné varianty pokračuje na detail

* Tabulka s cenou zobrazuje kategorie, bez DPH, DPH, s DPH

* Granulárně editovatelné pole jsou interaktivní, přepočet ceny funguje live

* Loyalty: badge, benefity a body fungují pro přihlášeného loyalty člena

* Chatbot widget se načte s kontextem nabídky

* QR kód je funkční a sdílí správný link

* Klientský flow (formuláře → platba → potvrzení) funguje end-to-end

* Odmítnutí s kategorizovaným důvodem funguje a notifikuje obsluhu

## **13.3 Integrace**

* Inbox: vytvoření poptávky z e-mailu \+ AI extrakce \+ propojení e-mailu

* Štafle: opcní rezervace, správa kapacity pro varianty

* Notifikační centrum: dostává notifikace o klíčových stavech i chatbot zprávách

* Loyalty modul: body přičteny po potvrzení, tier a benefity zobrazeny v IBE

## **13.4 Kvalita**

* Unit testy pro business logiku (kapacita variant, expirace, stavový stroj, DPH výpočet)

* E2E testy pro hlavní flow (tvorba → varianty → potvrzení → provozní podklady)

* Accessibility: WCAG 2.1 AA pro IBE proposal mód

* Performance: stránka nabídky \< 2 s na 3G připojení

# **Příloha A — Slovník pojmů**

| Pojem | Definice |
| :---- | :---- |
| Poptávka | Příchozí žádost od klienta o nabídku. Obsahuje metadata: termín, počet osob, požadavky. |
| Nabídka | Cenová a obsahová odpověď hotelu na poptávku. Jedna poptávka \= jedna nabídka s možností více variant. |
| Varianta | Alternativní verze nabídky v rámci jedné poptávky. Prezentována ve srovnávacím view, přijata může být pouze jedna. |
| IBE | Internet Booking Engine — klientská část BH pro online rezervaci a zobrazení nabídky. |
| PMS | Property Management System — hotelový systém Better Hotel (back-end, administrace). |
| Opcní rezervace | Dočasná rezervace na štaflích blokující kapacitu pro nabídku. |
| Štafle | Modul BH zobrazující obsazenost pokojů na časové ose. |
| Offer Template | Kompletní preset celé nabídky pro konkrétní segment (1. úroveň šablon). |
| Reusable blok | Znovupoužitelná komponenta šablony: text, pokoje, služby, platební podmínky (2. úroveň). |
| Granulární editace | Nastavení per-nabídka, která pole může host sám upravit v IBE. |
| Provozní podklady | Dokumenty generované po potvrzení pro kuchaře a provozní úseky hotelu. |
| Orphan Days | Proluky (1–3 noci) v obsazenosti mezi stávajícími rezervacemi — příležitost pro proaktivní nabídku. |
| Loyalty tier | Úroveň věrnostního programu klienta (Silver/Gold/Platinum) ovlivňující dostupné benefity. |
| Win Rate | Poměr přijatých nabídek k celkovému počtu odeslaných nabídek. |
| RFP | Request for Proposal — formální poptávka, zejména z korporátního segmentu. |
| RevPAR | Revenue Per Available Room — klíčová metrika příjmů hotelu. |

*Konec dokumentu — Better Hotel Proposal Engine v2.0*