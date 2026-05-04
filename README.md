# BonScan v2 — Kasticket Scanner App

Een gratis, uitgebreide PWA (Progressive Web App) voor het scannen en beheren van kastickets met AI.

## ✨ Functies

- **AI-analyse** — Scan kastickets met Claude Vision AI (extraheer winkel, datum, totaal, BTW, alle artikelen)
- **Camera** — Direct fotograferen via smartphone camera
- **Handmatige invoer** — Bonnen zelf invoeren
- **Artikelen zoeken** — Doorzoek alle gekochte artikelen met prijshistorie
- **Projecten** — Koppel bonnen aan projecten (verbouwing, werk, etc.) met budgetbeheer
- **7 grafieken** — Maandelijks, categorie, weekdag, trend (30d), tijdstip, per project, top winkels
- **Export** — JSON, CSV, TXT
- **Import** — Importeer eerder geëxporteerde data
- **Taalkeuze** — Nederlands / Engels
- **Firebase cloud** — Optionele gratis cloud-opslag (instructies in app)
- **Geen foto's opgeslagen** — Privacy-vriendelijk, alleen data
- **PWA** — Installeerbaar als echte app op Android, iOS en PC

---

## 📱 Als app installeren (gratis, geen Play Store nodig)

### Android (Chrome)
1. Open de app in Chrome
2. Tik op de drie puntjes (⋮) rechts bovenaan
3. Kies **"Toevoegen aan startscherm"**
4. De app verschijnt als icoon op je thuisscherm

### iPhone/iPad (Safari)
1. Open de app in Safari
2. Tik op het **Deel-icoon** (vierkantje met pijl omhoog)
3. Scroll naar beneden en kies **"Zet op beginscherm"**

### PC / Mac (Chrome of Edge)
1. Kijk rechts in de adresbalk voor een **installatie-icoon** (monitor met pijl)
2. Klik erop en bevestig installatie
3. Of: Chrome-menu → "BonScan installeren"

---

## ☁️ Gratis hosten op GitHub Pages

Zo host je BonScan gratis zodat je het op elk apparaat kunt gebruiken:

### Stap 1 — GitHub account aanmaken
Ga naar [github.com](https://github.com) en maak een gratis account aan.

### Stap 2 — Nieuw repository aanmaken
1. Klik op **"New repository"**
2. Naam: `bonscan` (of een andere naam)
3. Zet op **Public**
4. Klik **"Create repository"**

### Stap 3 — Bestanden uploaden
Upload alle bestanden uit deze map:
- `index.html`
- `css/style.css`
- `js/app.js`
- `sw.js`
- `manifest.json`
- `icons/` (map met alle .png bestanden)

Of via GitHub Desktop / git command line:
```bash
git init
git add .
git commit -m "BonScan v2"
git remote add origin https://github.com/JOUWGEBRUIKERSNAAM/bonscan.git
git push -u origin main
```

### Stap 4 — GitHub Pages aanzetten
1. Ga naar je repository → **Settings**
2. Klik op **"Pages"** in het linkermenu
3. Bij "Source": kies **"main"** branch, map **"/ (root)"**
4. Klik **Save**

Na 1-2 minuten is je app live op:
`https://JOUWGEBRUIKERSNAAM.github.io/bonscan/`

---

## 🔑 Claude API Key instellen

Voor AI-analyse van kastickets heb je een gratis Anthropic API key nodig:

1. Ga naar [console.anthropic.com](https://console.anthropic.com)
2. Maak een gratis account aan
3. Ga naar **API Keys** → **Create Key**
4. Kopieer de key (begint met `sk-ant-...`)
5. Open BonScan → **Instellingen** → plak de key in → Opslaan

De key wordt alleen lokaal opgeslagen op jouw apparaat.

---

## ☁️ Firebase gratis cloud opslag instellen

Firebase biedt gratis 1GB opslag en 50.000 reads/dag:

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com)
2. Klik **"Project toevoegen"** → Volg de stappen (gratis)
3. Klik **"</> Web app toevoegen"** → Registreer app
4. Kopieer de config (apiKey, authDomain, projectId)
5. Ga naar **Firestore Database** → **Database aanmaken** → **Testmodus**
6. Open BonScan → **Instellingen** → Plak de gegevens in → Verbinden

---

## 📁 Bestandsstructuur

```
bonscan/
├── index.html          — Hoofd HTML bestand
├── manifest.json       — PWA manifest
├── sw.js               — Service Worker (offline support)
├── css/
│   └── style.css       — Alle stijlen
├── js/
│   └── app.js          — Volledige app logica
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md           — Dit bestand
```

---

## 🔧 Technische details

- **Framework**: Vanilla JS (geen dependencies nodig)
- **Charts**: Chart.js 4.4 (CDN)
- **Fonts**: DM Sans + DM Mono (Google Fonts)
- **AI**: Claude claude-sonnet-4-20250514 Vision API
- **Opslag**: LocalStorage (lokaal) + Firebase Firestore (cloud)
- **PWA**: Service Worker + Web App Manifest
- **Privacy**: Geen foto's worden opgeslagen, alleen geëxtraheerde data

---

*BonScan v2.0 — Gratis, open source*
