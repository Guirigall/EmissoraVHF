# Emissora VHF · simulador marí

Simulador didàctic d’una emissora VHF marina, ambientat al port de Maó. Tries el canal amb el dial, prems el PTT i parles amb la teva veu. Responen una marina, els pràctics, Salvament Marítim o un altre veler. Mentre gires el dial sents estàtica i converses d’altres vaixells.

## Obrir-la

**En línia:** https://guirigall.github.io/EmissoraVHF/ (també s’hi pot instal·lar com a aplicació al mòbil).

**A l’ordinador**, des de la carpeta del projecte:

```bash
bash Obre-Emissora.sh
```

S’obre a `http://localhost:8090` amb **Chrome** si el tens (té veus i reconeixement de veu); si no, amb el navegador per defecte. A Linux, Firefox sovint no té cap veu de síntesi: l’app ho avisa i només mostra subtítols. Prem **PWR** per encendre la ràdio (el navegador només deixa fer so després d’un clic).

Al mòbil, obre l’adreça en línia i instal·la-la com a aplicació (Chrome → ⋮ → Instal·la l’aplicació). Funciona sense connexió, excepte el reconeixement de veu.

## Com s’utilitza

- **Dial CANAL**: arrossega’l en cercle, fes servir la roda del ratolí o ▲▼. Canals 1–28 i 60–88 amb les freqüències reals.
- **SQL** (squelch): al mínim sents l’estàtica contínua; més amunt, només quan algú transmet.
- **PTT**: mantén-lo premut (o la barra d’espai), parla i deixa’l anar en acabar amb «canvi». També pots escriure el missatge i prémer *Transmet*.
- **16/9**: salta al canal 16 (o al 9). **H/L**: 25 W o 1 W (amb 1 W l’abast és curt). **SCAN**: recorre els canals i s’atura on parla algú.
- **DISTRESS**: mantén-lo premut 3 segons per enviar una alerta DSC de socors (simulada).

Dreceres: espai = PTT, P = encendre, 1 = 16/9, S = escàner, H = potència, ↑↓ = canal.

## Què hi trobaràs

| Canal | Què hi passa |
|---|---|
| 16 | Crides, avisos de seguretat. Hi escolten totes les estacions. |
| 9 | Marina de Maó: amarraments, combustible, meteo. |
| 12, 14 | Pràctics de Maó: entrar o sortir de port, ferris i remolcadors. |
| 10, 6 | Salvament Marítim i exercicis de rescat. |
| 13 | Vaixells grans coordinant maniobres (en anglès). |
| 20 | Butlletí meteorològic de la ràdio costanera. |
| 67 | Comitè de regata. |
| 72, 77 | Navegants i pescadors xerrant (català i castellà). El veler *Tramuntana* hi contesta. |
| 8, 69, 73… | Converses llunyanes que no s’entenen. |
| 70, 87, 88 | Dades DSC i AIS: només ràfegues, no s’hi pot parlar. |

Les estacions responen en la llengua que triïs a **Configuració** (català, castellà o anglès), segons on les cridis, què demanis i la potència. Si oblides dir «canvi» o identificar-te, el registre et dona un consell. Si canvies de canal mentre et responen, et perds la resposta.

## Converses variades

Les converses de fons es generen sobre la marxa: vaixells, persones, cales, temes (fondeig, pesca, sopars, parte, avaries, dofins, meduses...), amarraments, ferris, regates, avisos de seguretat i butlletins meteo canvien cada vegada. També pots parlar amb la gent que acabes de sentir en un canal: digues-ne el nom (per exemple «Marta» o el nom del vaixell) i et contestarà en la seva llengua.

## Dues maneres d’entendre’t

- **Motor local** (per defecte, sense Internet ni cost): reconeix moltes maneres de dir les coses, tolera errors d’escriptura i de reconeixement de veu, i quan no t’entén et diu què et pot oferir. Però és limitat: amb frases molt imprevistes pot no encertar.
- **Mode IA amb Claude** (opcional, a Configuració): entén qualsevol frase i respon amb naturalitat, recordant el que s’ha dit al canal. Cal una clau d’API d’Anthropic (console.anthropic.com), que es desa només en aquest navegador; cada missatge costa aproximadament un o dos cèntims amb Opus 5.5 (menys amb Sonnet o Haiku). L’app continua decidint qui et pot sentir (canal i abast); Claude decideix qui contesta i què diu. Si no hi ha connexió o la clau falla, respon el motor local i el registre ho indica. Fes servir una clau amb límit de despesa i no publiquis l’app amb la clau posada.

## Límits

- El reconeixement de veu és el del navegador: Chrome i Edge el tenen (envien l’àudio als seus servidors i necessiten Internet); Firefox no. Sense reconeixement, fes servir el text.
- Les veus són les instal·lades al sistema. Si no n’hi ha cap de catalana, les frases en català es llegeixen amb una altra veu.
- Les veus sintètiques no passen pel filtre de ràdio (el navegador no ho permet). L’estàtica, el squelch, els clics i les veus llunyanes sí que es generen amb filtre de ràdio.
- Les estacions, els vaixells i els diàlegs són inventats i simplificats. No substitueix la formació per al títol d’operador de ràdio ni s’ha d’usar per navegar. En una emergència real, truca al 112.

## Desenvolupament

Sense dependències ni compilació. Proves:

```bash
npm test
```

Fitxers principals: `channels.js` (pla de canals), `dialog.js` i `chatter.js` (motor local), `ai.js` (mode IA), `traffic.js` (converses de fons generades), `audio.js` (so), `voice.js` (veu), `app.js` (interfície). `vendor/anthropic-sdk.mjs` és el SDK oficial d’Anthropic (`@anthropic-ai/sdk` 1.8.0) empaquetat per al navegador; només es carrega si actives el mode IA.
