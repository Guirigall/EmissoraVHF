# Handoff · Emissora VHF

Document de traspàs per continuar el projecte sense context previ. Estat a **12 de novembre de 2026**, versió de memòria cau `v1.2.2`.

### Millores de continuació (12 de novembre)

- Apagar cancel·la TX, micròfon, DSC, respostes i historial de la sessió. Les respostes IA i transcripcions tardanes es descarten.
- El canal queda fix durant el PTT; la transcripció conserva el canal original en deixar-lo anar.
- Volum utilitzable amb la ràdio apagada i alliberament del micròfon si el permís arriba després de tancar l’àudio.
- Proves de regressió d’àudio i comprovació en Chromium d’apagar durant TX, canviar volum i tornar a encendre.
- Les captures es regeneren quan canvien els fitxers de l’aplicació, després d’executar les proves.


- **App publicada:** https://guirigall.github.io/EmissoraVHF/ (GitHub Pages, branca `main`, arrel del repositori)
- **Repositori:** https://github.com/Guirigall/EmissoraVHF (públic)
- **Carpeta local de treball:** `Projectes/Emissora-VHF`

## Què és

PWA didàctica que simula una emissora VHF marina ambientada al port de Maó (Menorca). L’usuari tria el canal amb un dial, prem el PTT, parla (o escriu) i li responen estacions i vaixells. En moure el dial se sent estàtica, converses d’altres vaixells, veus llunyanes ininteligibles i ràfegues de dades DSC/AIS. Tot és fictici i amb finalitat educativa; no serveix per navegar.

Funcions principals:

- Pla de canals real (UIT, apèndix 18): 1–28 i 60–88, freqüències de transmissió i recepció, dúplex, canals només de dades (70, 75, 76, 87, 88) i canals limitats a 1 W (15, 17).
- So generat amb Web Audio: estàtica filtrada, squelch amb «cua», efecte de captura de l’FM, clics de PTT i de dial, veus llunyanes sintètiques, ràfegues DSC i AIS.
- PTT amb el ratolí, el dit o la barra d’espai; reconeixement de veu del navegador; alternativa de text i frases d’exemple.
- Estacions que responen: Marina de Maó (16 i 9), Pràctics de Maó (16 i 12), Salvament Marítim (16 i 10) i el veler Tramuntana (16 i 72). També responen les persones sentides fa poc en un canal.
- Abast segons la potència: 25 W arriben a 25 milles; 1 W a 5 milles. Salvament és a 18 milles, així que amb 1 W no et sent.
- Mayday, pan-pan i seguretat; alerta DSC simulada (mantenir premut DISTRESS 3 s).
- Trànsit de fons generat sobre la marxa: no es repeteix.
- Escàner (SCAN), 16/9, H/L, comandaments giratoris de volum, squelch i canal.
- Consells de procediment (identificar-se, acabar amb «cambio», crida al 16 i canvi al canal de treball, canal equivocat, abast).
- Mode IA opcional amb Claude per entendre qualsevol frase.
- Interfície en català, castellà, anglès i francès. Llengua de ràdio en castellà, anglès o francès.
- Funciona fora de línia (excepte el reconeixement de veu i el mode IA).

## Com s’executa i es prova

Sense dependències ni compilació: és HTML, CSS i mòduls ES servits estàticament.

```bash
bash Obre-Emissora.sh      # servidor local i obre Chrome (o el navegador per defecte)
npm test                   # 16 proves amb node --test (Node 22 o posterior)
```

El micròfon, el reconeixement de veu i el service worker necessiten `localhost` o HTTPS. Obrir `index.html` directament com a fitxer no funciona.

Publicar: fer `git push` a `main`. GitHub Pages es reconstrueix sol en un o dos minuts. **Cal pujar la `VERSION` de `sw.js`** a cada canvi de fitxers perquè els navegadors que ja tenen l’app instal·lada descarreguin la nova versió.

## Mapa de fitxers

| Fitxer | Què fa |
|---|---|
| `index.html` | Estructura. Els textos porten `data-i18n`, `data-i18n-html` o `data-i18n-attr`; el text dins l’HTML només és una reserva. |
| `style.css` | Estil del frontal, la pantalla LCD, els comandaments, el PTT i els panells. |
| `app.js` | Interfície i orquestració: pantalla, bucle de recepció (cada 120 ms), transmissió, escàner, DSC, configuració, idiomes, registre i historial per canal. Exposa `globalThis.__vhf` per a proves automàtiques al navegador. |
| `channels.js` | Pla de canals: freqüències, dúplex, permisos de transmissió i claus de nom (`nameKey`). |
| `stations.js` | Estacions que responen: canals que escolten, canal de treball, distància, àlies (per reconèixer-ne el nom) i perfil de veu. |
| `dialog.js` | Motor local (sense IA), funció pura provable amb Node: qui respon, intenció, flux d’amarrament, mayday i pan-pan, abast i consells. Respostes en `es`, `en` i `fr`. Tolera errors d’escriptura i de reconeixement (distància d’edició i prefixos). |
| `chatter.js` | Variants de resposta, missatges d’ajuda, serveis de la marina i conversa informal per temes (`es`, `en`, `fr`). |
| `traffic.js` | Generador de trànsit de fons per canal i planificador (`Traffic`): els canals avancen encara que no s’escoltin, i recorda qui ha parlat a cada canal. |
| `ai.js` | Mode IA amb Claude: construeix la situació, crida l’API i valida la resposta. |
| `audio.js` | Motor de so amb Web Audio i vúmetre del micròfon. |
| `voice.js` | Síntesi de veu (frases dividides, veu estable per persona) i reconeixement de veu. |
| `i18n.js` | Tots els textos de la interfície en quatre idiomes, noms de canal, paraules de procediment de ràdio, detecció d’idioma. Sense dependències del navegador. |
| `sw.js` | Service worker: xarxa primer i, sense connexió, la còpia desada. Llista explícita de fitxers a `FILES`. |
| `vendor/anthropic-sdk.mjs` | SDK oficial `@anthropic-ai/sdk` 1.8.0 empaquetat amb esbuild per al navegador (369 KB). Només es carrega si s’activa el mode IA. |
| `tests/` | Proves: canals, diàleg, trànsit, IA (situació), traduccions i fitxers fora de línia. |
| `.github/` | Flux «Captures del README»: genera `docs/images/desktop.jpg` i `mobile.jpg` amb Playwright. |
| `Obre-Emissora.sh` | Llançador local; prioritza Chrome. |

## Decisions importants i per què

- **El català no és llengua de ràdio.** Les veus sintètiques catalanes sonen molt malament (i Chrome no en té cap). La interfície sí que és en català. La configuració antiga amb `lang: 'ca'` es migra sola al castellà.
- **Dos idiomes separats.** `settings.ui` (interfície i consells) i `settings.lang` (ràdio: veu, reconeixement, respostes). La guia mostra les frases de ràdio en `lang` amb el text explicatiu en `ui`.
- **Chrome com a navegador recomanat.** A Linux, Firefox no té veus si el servei `speech-dispatcher` no està actiu, i tampoc té reconeixement de veu. L’app ho detecta i mostra un avís; el llançador obre Chrome.
- **Les veus no passen pel filtre de ràdio.** El navegador no deixa enviar la síntesi de veu a Web Audio. Per compensar-ho, l’estàtica, el squelch i els clics sí que el tenen, i un senyal fort fa callar l’estàtica.
- **Mode IA: l’app decideix qui et pot sentir, Claude decideix què es diu.** `ai.js` calcula localment quines estacions escolten el canal i són dins d’abast. Després descarta qualsevol resposta de qui no hi era. Si la IA falla (sense clau, sense connexió, clau invàlida o rebuig), respon el motor local i el registre ho indica.
- **Clau d’API només al navegador de l’usuari** (`localStorage`). No s’ha de posar mai cap clau al repositori ni a l’app publicada.

## Mode IA (Claude)

- Model per defecte `claude-opus-5-5`; opcions `claude-sonnet-5-5` i `claude-haiku-5-5` (aquest sense `fallbacks`).
- Petició: `client.beta.messages.parse` amb `betaJSONSchemaOutputFormat` (JSON validat: `replies[{speaker, lang, text}]` i `tip`), `output_config.effort: 'low'` per respondre ràpid, `cache_control` al text de sistema, i `betas: ['server-side-fallback-2026-07-01']` + `fallbacks: 'default'` (si el model principal declina, l’API ho torna a provar amb un altre model).
- Client del navegador amb `dangerouslyAllowBrowser: true`: és acceptable només perquè cada usuari hi posa la seva clau.
- Cost segons model i ús de l’API; no s’ha verificat cap import per missatge.
- **Encara no s’ha provat contra l’API real.** Les proves al navegador s’han fet amb el servei simulat (interceptant `fetch`): petició, resposta i error de clau invàlida. La primera prova real s’ha de fer amb «Prova la connexió» a Configuració.
- Per actualitzar el SDK: `npm install @anthropic-ai/sdk` en una carpeta temporal, i amb esbuild empaquetar una entrada que exporti `default as Anthropic` i `betaJSONSchemaOutputFormat` de `@anthropic-ai/sdk/helpers/beta/json-schema`, amb `--bundle --format=esm --platform=browser --minify`. Desar el resultat a `vendor/anthropic-sdk.mjs` i actualitzar `vendor/VERSION`.

## Com afegir coses

- **Un text nou a la interfície:** afegir la clau a `i18n.js` en els **quatre** idiomes (la prova `i18n.test.mjs` falla si en falta algun o si l’HTML o el codi fan servir una clau inexistent). Fer servir `t('clau')` al codi, o `data-i18n` a l’HTML.
- **Una estació:** entrada a `stations.js` (amb `name` en `ca`, `es`, `en` i `fr`, perquè `ca` es fa servir a la interfície), lògica a `dialog.js`, descripció al text de sistema de `ai.js`, fila a la guia de l’`index.html` i claus de traducció.
- **Un tipus de conversa de fons:** un generador a `traffic.js` i registrar-lo a `GENERATORS` amb el canal i l’interval de temps entre converses.
- **Un fitxer nou:** afegir-lo a `FILES` de `sw.js` i pujar la `VERSION` (la prova `offline.test.mjs` comprova que tots els `.js` hi siguin).
- **Una llengua de ràdio nova:** respostes a `dialog.js` (`S`), `chatter.js`, `traffic.js`, `PHRASES` d’`app.js`, `PROWORDS` d’`i18n.js`, `LOCALE` de `voice.js`, l’enum de l’esquema d’`ai.js` i `VOICE_LANGS`.

## Estat de les proves

- `npm test`: 16 proves, totes superades.
- Comprovat amb Chrome (local i a la web publicada): converses completes, escàner, bloqueig del canal 70, alerta DSC, mayday, PTT amb micròfon simulat, quatre idiomes, conversa en francès, fora de línia i actualització d’una versió instal·lada.
- **No comprovat:** reconeixement de veu real amb micròfon, mode IA contra l’API real, mòbil físic (Android i iPhone), Safari.

## Limitacions conegudes i idees pendents

- El flux «Captures del README» comprova el navegador i actualitza les captures quan canvien els fitxers de l’app. També es pot llançar manualment a Actions.
- El manifest (`manifest.webmanifest`) té el nom en català: a la pantalla d’inici del mòbil l’app es diu «Emissora VHF» en qualsevol idioma. Es podrien fer manifests per idioma, com a CablejatElectric.
- El motor local busca paraules: amb frases molt imprevistes pot no encertar (per això hi ha el mode IA).
- El reconeixement de veu de Chrome envia l’àudio als servidors de Google i necessita Internet.
- Idees: escolta doble (16 + un altre canal), veus en anglès per a vaixells estrangers amb accent, mapa amb la posició, puntuació de procediment, escenaris guiats (exercicis), aspecte inspirat en la B&G V60 (l’usuari en té el manual).

## Context de l’autor

- El projecte el mantén **Guirigall**. Els commits es fan amb l’adreça privada de GitHub `61776585+Guirigall@users.noreply.github.com`; no s’ha de posar cap correu personal al repositori.
- Projectes germans al mateix compte, amb el mateix estil de PWA i el mateix flux de captures: CablejatElectric, ElectricitatABord, ExercicisCartaNautica, MotorMarino.
- L’usuari escriu en català i prefereix explicacions en català.

## PTT i icona · v1.2.2

- Icona nova: emissora fixa horitzontal amb micròfon separat, SVG i PNG de 192/512 px.
- PTT: captura única del reconeixedor, sense obrir un segon micròfon per al vúmetre. El nivell TX indica activitat de parla detectada, no amplitud mesurada.
- Es distingeix preparació d’escolta real; es processen resultats després de deixar anar el botó (fins a 8 s), es recuperen finals prematurs de sessió i s’eviten transcripcions duplicades.
- Errors de xarxa, captura, permís i llengua amb missatges en els quatre idiomes.
- Proves unitàries amb reconeixedor simulat i regressió Chromium del PTT complet. La veu real del dispositiu continua requerint comprovació amb l’usuari; el servei del navegador necessita connexió.
