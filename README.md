# IBE v5 — klikací prototypy

Čtyři end-to-end uživatelské cesty hotelového booking enginu (Hotel Balický). Každá cesta je „shell" s horní lištou (kroky + přepínač cest + skok na obrazovku), který v `<iframe>` provede celým provázaným flow až po dokončení rezervace a děkovací stránku.

Vstupní rozcestník: **`index.html`** → odkazuje na 4 cesty:

- `Kratkodobe-najmy.html` — multiproperty, balíčky, wellness, vouchery + AI asistentka Marie (mockovaná)
- `Dlouhodobe-najmy.html` — pronájem bytů, smlouva, kauce
- `Proposal-Engine.html` — B2B nabídka na míru
- `Hodinovy-hotel.html` — rezervace po hodinách

> Prototyp s ilustrativními daty. Chatbot i ceny jsou mockované, žádné živé napojení na backend.

---

## Spuštění lokálně

Soubory se **musí** servírovat přes HTTP (kvůli iframu mezi stránkami nestačí otevřít `file://`):

```bash
# v rozbalené složce projektu
python3 -m http.server 8000
# nebo:  npx serve
```

Pak otevřít `http://localhost:8000/`.

---

## Nasazení na GitHub Pages

1. Vytvořte nový repozitář (např. `ibe-prototyp`).
2. Nahrajte **obsah této složky** do kořene repozitáře (přes web GitHubu „Add file → Upload files", nebo `git add . && git commit && git push`).
3. V repu **Settings → Pages → Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)` → Save
4. Po chvíli poběží na `https://<účet>.github.io/<repo>/` — kořen zobrazí rozcestník (`index.html`).

Názvy souborů obsahují mezery a diakritiku; GitHub Pages je servíruje korektně (prohlížeč je v odkazech sám zakóduje).

---

## Struktura

- `index.html` — rozcestník
- `*.html` cesty (shelly) + `journey-shell.css` / `journey-shell.js` — chrome cesty
- ostatní `*.html` — jednotlivé obrazovky enginu
- `*.jsx` — React komponenty (transpilované v prohlížeči přes Babel)
- `assets/` — obrázky
