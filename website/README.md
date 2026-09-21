# Website - Dyer Alumini & Duroplast

Website statik (HTML/CSS/JS, pa nevojë për build tools) për një biznes që merret me punime alumini dhe duroplast (PVC).

## Struktura

```
website/
├── index.html          # Faqja kryesore (të gjitha seksionet)
├── css/styles.css      # Stilet
├── js/main.js          # Menu mobile, filtrim galerie, lightbox, formular kontakti
├── images/galeria/     # Fotot e punimeve (aktualisht placeholder-a SVG)
└── README.md
```

## Si ta shikoni lokalisht

Hapni `index.html` direkt në browser, ose nisni një server të thjeshtë:

```bash
cd website
python3 -m http.server 8000
```

Pastaj hapni `http://localhost:8000` në browser.

## Çfarë duhet të personalizoni para publikimit

1. **Emri i biznesit dhe logo** — kërkoni `ALPIN Alumini & Duroplast` në `index.html` dhe zëvendësojeni me emrin tuaj real.
2. **Numri i telefonit** — kërkoni `+355 69 123 4567` / `355691234567` (përdoret te header, footer, WhatsApp, form) dhe vendosni numrin real.
3. **Email** — zëvendësoni `info@alpin-aludur.al`.
4. **Adresa dhe lokacioni** — në seksionin `#lokacioni`, ndryshoni tekstin e adresës dhe URL-në e Google Maps (`https://www.google.com/maps?q=...`) me adresën tuaj reale.
5. **Orari i punës** — te seksioni i lokacionit.
6. **Rrjetet sociale** — te seksioni i kontaktit, plotësoni linqet reale të Facebook/Instagram/TikTok (aktualisht `#`).
7. **Fotot e punimeve** — zëvendësoni skedarët placeholder në `images/galeria/punim-1.svg` deri `punim-8.svg` me foto reale (`.jpg`/`.png`) të projekteve tuaja, dhe përditësoni `src` përkatëse në `index.html`. Sugjerohet rezolucion ~1200x900px, të kompresuara për web.
8. **Foto "Rreth Nesh"** — në seksionin `#rreth-nesh` ka një kuti placeholder; mund ta zëvendësoni me një `<img>` reale të ekipit/punishtes.
9. **Formulari i kontaktit** — aktualisht dërgon kërkesën përmes `mailto:` (hap klientin e email-it të vizitorit). Për një zgjidhje profesionale (dërgim direkt nga serveri, pa hapur email client), lidheni formularin me një shërbim si Formspree, EmailJS, ose një backend të thjeshtë.

## Publikimi (Deploy)

Ky është një site statik, kështu që mund të hostohet lehtësisht falas te:

- **GitHub Pages**: aktivizoni Pages për repo-n, duke zgjedhur folderin `website/` (ose e zhvendosni përmbajtjen në root).
- **Netlify / Vercel**: lidhni repo-n dhe caktoni `website` si "publish directory".
- **Cloudflare Pages**: e njëjta logjikë si më sipër.

## Teknologjitë e përdorura

- HTML5 + CSS3 (variabla CSS, grid, flexbox, responsive/mobile-first)
- JavaScript vanilla (pa framework)
- Font Awesome (ikona, nga CDN)
- Google Fonts: Poppins & Inter
- Google Maps embed (iframe, pa API key)
