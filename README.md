# Emotionaler Multi-Layer-QR-Code

Dieses Projekt ist eine interaktive Web-Demo im Rahmen einer Bachelorarbeit. Persönliche Erinnerungen wie Stimmung, Ort, Notizen, Bilder und Audio werden erfasst und auf drei QR-Code-Ebenen verteilt. Die Demo vergleicht die Kapazität eines normalen QR-Codes mit einem Multi-Layer-QR-Code und kann die Daten in Echtzeit an ein Smartphone übertragen.

Die eingegebenen Daten werden nicht dauerhaft gespeichert. Sie bleiben während der Demo im Browser und werden beim Neuladen gelöscht. Lediglich der eingegebene Name wird lokal gespeichert.

## Voraussetzungen

- Node.js 20 oder neuer
- npm
- Optional: Ably-API-Key für die Übertragung zwischen Computer und Smartphone

## Installation

1. Repository klonen und in den Projektordner wechseln:

   ```bash
   git clone <REPOSITORY-URL>
   cd Praktische_Vorarbeit
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

4. Im Browser öffnen:

   ```text
   http://localhost:5174
   ```

## Weitere Befehle

```bash
npm run build    # Produktions-Build erstellen
npm run preview  # Produktions-Build lokal testen
npm run lint     # Quellcode prüfen
```

## Verwendete Technologien

React, Vite, Tailwind CSS, QRCode.
