# weather-home-navigator

Responsive Web-App mit aktuellem Standort-Wetter und Google-Maps-Navigation nach Hause.
HTML5, CSS3 und Vanilla JavaScript, ohne Frameworks, API-Schlüssel oder Paket-Abhängigkeiten.

## Lokal starten

Im Projektverzeichnis mit Python 3:

```sh
python3 -m http.server 8000
```

Öffne anschließend <http://localhost:8000> und erlaube den Standortzugriff.
Optional mit installiertem Node.js/npm: `npm start` startet denselben Server,
`npm run check` prüft die JavaScript-Syntax. Ein Build oder `npm install` ist nicht nötig.

## Auf dem iPhone verwenden

Veröffentliche `index.html`, `style.css` und `script.js` bei einem statischen
HTTPS-Host, beispielsweise GitHub Pages (Repository-Einstellungen → Pages →
Deploy from a branch → den Branch mit der App und `/ (root)` auswählen).
Öffne die bereitgestellte HTTPS-Adresse in Safari und erlaube den Standortzugriff.
Über **Teilen → Zum Home-Bildschirm** kannst du einen Schnellzugriff hinzufügen.

Die Standortabfrage funktioniert nur über **HTTPS** oder auf **localhost**.
Eine unverschlüsselte LAN-Adresse wie `http://192.168.…:8000` genügt auf dem
iPhone nicht. Die App benötigt Internetzugriff und ist keine native iOS-/Offline-App.

## Bedienung

- Das Wetter wird beim Öffnen automatisch geladen; **Aktualisieren** fragt es erneut ab.
- Angezeigt werden Temperatur, Wetterbeschreibung und Symbol, Luftfeuchtigkeit
  sowie Windgeschwindigkeit in km/h. Quelle: [Open-Meteo](https://open-meteo.com/).
- Gib die vollständige Heimatadresse ein und tippe auf **Adresse speichern**.
  Die Adresse kann jederzeit im selben Feld geändert und erneut gespeichert werden.
- **Nach Hause navigieren** öffnet Google Maps mit der gespeicherten Zieladresse
  und angeforderter Auto-Navigation. Je nach Gerät öffnet sich die Maps-App oder
  die Webansicht; Google Maps bestimmt den Startpunkt und kann eine Bestätigung verlangen.
- Bei verweigertem Standortzugriff helfen die Safari-/Website-Einstellungen.
  Die Navigation funktioniert auch ohne Standortfreigabe für diese App.

## Datenschutz

Die Heimatadresse wird ausschließlich im `localStorage` dieses Browsers gespeichert
und erst beim Navigieren an Google Maps übergeben. Gelöschte Website-Daten löschen
auch die Adresse. Ist der Speicher gesperrt, kann die Adresse für die aktuelle Sitzung
verwendet werden, bleibt aber nach dem Neuladen nicht erhalten.

Für die Wetterabfrage werden die Standortkoordinaten an Open-Meteo gesendet.
Es gibt kein eigenes Backend und kein Tracking.
