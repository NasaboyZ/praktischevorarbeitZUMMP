import { Calendar, MoreHorizontal, Smile, Cpu, CameraOff } from 'lucide-react';
import { InView } from '../motion/index.jsx';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import orangeFace from '../../assets/hero-Smiles/oranges-gesicht-emoji.png';

function CardNumber({ n }) {
  return (
    <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-(--bd-subtle) bg-white text-sm font-bold text-(--tx-primary)">
      {n}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="projekt" className="border-y border-(--bd-subtle) bg-white">
      <div className="grid-bg grid grid-cols-1 border-b border-(--bd-subtle) md:grid-cols-[1fr_minmax(160px,280px)]">
        <InView className="px-10 py-16 md:pr-16">
          <h2 className="mb-5 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-tight">
            Verstehe das „Warum"<br />
            <span className="text-[#8FA6C9]">hinter dem Projekt</span>
          </h2>
          <p className="max-w-160 text-base leading-[1.75] text-(--tx-secondary)">
            Diese Demo zeigt den Unterschied zwischen einem normalen QR-Code und einem
            Multi-Layer-QR-Code. Sie demonstriert das Prinzip des Farb-Multiplexings am Bildschirm.
            Die Demo führt keinen Kamera-Scan durch. Alle angezeigten Werte stammen aus der
            tatsächlichen Verarbeitung und sind nicht simuliert. Der technische Rahmen nutzt eine
            einzelne HTML-Datei mit JavaScript. Für die Erzeugung der QR-Codes wird die etablierte
            Bibliothek qrcode verwendet. Für die Farbverarbeitung kommt das HTML-Canvas-Element zum
            Einsatz, mit dem sich einzelne Pixel und Farbkanäle direkt auslesen und setzen lassen.
          </p>
        </InView>

        <div className="flex items-center justify-center border-t border-(--bd-subtle) px-5 py-8 md:border-l md:border-t-0">
          <span className="text-[15px] font-bold italic text-(--tx-secondary)">
            (Über das Projekt)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-10 py-16 md:grid-cols-2">

        {/* 01 — Mood & Datum */}
        <InView>
          <Card className="gap-0 py-0 ring-(--bd-subtle)">
            <CardContent className="relative flex min-h-64 items-center justify-center px-8 py-10">
              <CardNumber n="01" />
              <div className="w-56 rounded-2xl border border-(--bd-subtle) bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-(--tx-muted)">Stimmungseintrag</span>
                  <MoreHorizontal className="size-4 text-(--tx-dim)" />
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--g-dim) text-(--g)">
                    <Smile className="size-6" />
                  </div>
                  <div className="text-lg font-extrabold">Ausgeglichen</div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-(--bg-surface) px-3 py-1.5 text-xs font-medium text-(--tx-secondary)">
                  <Calendar className="size-3.5" />
                  12. August 2026
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 px-8 py-7">
              <CardTitle className="text-xl font-extrabold">Dein Mood, Dein Datum, Deine Daten</CardTitle>
              <CardDescription className="text-sm leading-[1.7] text-(--tx-secondary)">
                Gib deinen Mood ein und wähle ein beliebiges Datum dazu – erzeuge deine eigenen
                privaten Daten, die nur dir gehören.
              </CardDescription>
            </CardFooter>
          </Card>
        </InView>

        {/* 02 — Farb-Multiplexing */}
        <InView>
          <Card className="gap-0 py-0 ring-(--bd-subtle)">
            <CardContent className="relative flex min-h-64 items-center justify-center px-8 py-10">
              <CardNumber n="02" />
              <div className="flex h-32 items-end gap-1.5">
                <div className="h-10 w-3 rounded-t-sm bg-(--r)" />
                <div className="h-20 w-3 rounded-t-sm bg-(--g)" />
                <div className="h-14 w-3 rounded-t-sm bg-(--b)" />
                <div className="h-24 w-3 rounded-t-sm bg-(--r)" />
                <div className="h-12 w-3 rounded-t-sm bg-(--g)" />
                <div className="h-28 w-3 rounded-t-sm bg-(--b)" />
                <div className="h-16 w-3 rounded-t-sm bg-(--r)" />
                <div className="h-26 w-3 rounded-t-sm bg-(--g)" />
                <div className="h-18 w-3 rounded-t-sm bg-(--b)" />
                <div className="h-22 w-3 rounded-t-sm bg-(--r)" />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 px-8 py-7">
              <CardTitle className="text-xl font-extrabold">Farb-Multiplexing live</CardTitle>
              <CardDescription className="text-sm leading-[1.7] text-(--tx-secondary)">
                Jeder Farbkanal codiert unabhängig. Verfolge in Echtzeit, wie Rot, Grün und Blau
                parallel zu einem einzigen Bild verschmelzen.
              </CardDescription>
            </CardFooter>
          </Card>
        </InView>

        {/* 03 — Canvas-Verarbeitung */}
        <InView>
          <Card className="gap-0 py-0 ring-(--bd-subtle)">
            <CardContent className="relative flex min-h-64 items-center justify-center px-8 py-10">
              <CardNumber n="03" />
              <div className="w-64">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--blue-dim) text-(--blue)">
                    <Cpu className="size-5" />
                  </div>
                  <span className="text-sm font-bold">Verarbeitungsschritte</span>
                </div>
                <ol className="divide-y divide-(--bd-subtle) rounded-xl border border-(--bd-subtle) bg-white">
                  <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-(--tx-muted)">1</span>
                    Pixel auslesen (Canvas-API)
                  </li>
                  <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-(--tx-muted)">2</span>
                    Kanäle trennen (R, G, B)
                  </li>
                  <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-(--tx-muted)">3</span>
                    Bits pro Kanal dekodieren
                  </li>
                  <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-(--tx-muted)">4</span>
                    Layer zu Ergebnis kombinieren
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 px-8 py-7">
              <CardTitle className="text-xl font-extrabold">Canvas-basierte Pixel-Analyse</CardTitle>
              <CardDescription className="text-sm leading-[1.7] text-(--tx-secondary)">
                Das HTML-Canvas-Element liest und setzt jeden Pixel einzeln – Farbkanäle lassen sich
                so direkt im Browser auslesen, ganz ohne Server.
              </CardDescription>
            </CardFooter>
          </Card>
        </InView>

        {/* 04 — Kein Kamera-Scan */}
        <InView>
          <Card className="gap-0 py-0 ring-(--bd-subtle)">
            <CardContent className="relative flex min-h-64 items-center justify-center px-8 py-10">
              <CardNumber n="04" />
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-(--r-dim) blur-xl" />
                <img src={orangeFace} alt="" className="relative h-22 w-22 drop-shadow-[0_10px_24px_rgba(0,0,0,0.12)]" />
                <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-(--bd-subtle) bg-white shadow-[0_4px_14px_rgba(17,24,39,0.08)]">
                  <CameraOff className="size-4 text-(--tx-secondary)" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 px-8 py-7">
              <CardTitle className="text-xl font-extrabold">Scenne mit deine Telefon Kamera</CardTitle>
              <CardDescription className="text-sm leading-[1.7] text-(--tx-secondary)">
              Nimm dein Smartphone und scanne den QR-Code. Du wirst sehen, dass die Demo keinen Kamera-Scan durchführt. Alle angezeigten Werte stammen aus der tatsächlichen Verarbeitung und sind nicht simuliert.
              </CardDescription>
            </CardFooter>
          </Card>
        </InView>

      </div>
    </section>
  );
}
