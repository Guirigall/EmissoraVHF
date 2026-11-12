# Handoff · EmissoraVHF

Document autosuficient per continuar el projecte sense llegir la conversa. Actualitzat el **12 de novembre de 2026**. Estat funcional: **v1.2.4** (`sw.js`, distintiu de la capçalera i `package.json` coincideixen).

**PTT amb micròfon real: causa identificada i corregida a v1.2.4, pendent de confirmació de l’usuari amb la seva veu.**

- **Causa:** al Chrome 157 (flatpak) de Linux d’aquest equip, el reconeixedor (`webkitSpeechRecognition`) arrencat amb `start()` obre la seva pròpia captura d’àudio i **no hi rep so**: arriben `start` i `audiostart`, però mai `soundstart`, i als ~8 s acaba en `no-speech`. Era exactament el símptoma descrit per l’usuari («el micròfon s’activa però no reconeix res»). En canvi, `getUserMedia` sí que rep l’àudio (pic 1,0).
- **Correcció:** `voice.js` obre el micròfon amb `getUserMedia` i en passa la pista al reconeixedor amb `start(track)`. Si el navegador no admet la pista, l’ignora o la rebutja, i es fa servir la captura pròpia com abans. El vúmetre torna a mesurar el nivell real amb el mateix flux, sense segona captura.
- **Com s’ha comprovat (no simulat):** Chrome de l’usuari, sense finestra, amb `--use-fake-device-for-media-stream --use-file-for-fake-audio-capture=<wav>`. El WAV és una frase generada amb `espeak-ng`, així que l’àudio va de debò als servidors de reconeixement de Google. Sense pista: `no-speech`. Amb pista: `soundstart`, `speechstart` i text final. App completa (PTT mantingut i «Parla amb un toc»): frase transcrita (la veu d’espeak s’entén imperfectament: «…this is sailing yacht… radio check over»), la marina respon i el vúmetre arriba a 1,0.
- **Encara no comprovat:** la veu de l’usuari amb el seu micròfon físic, Chrome amb finestra, Android/iPhone físics i Safari.

- Repositori públic: <https://github.com/Guirigall/EmissoraVHF>
- Aplicació: <https://guirigall.github.io/EmissoraVHF/>
- Carpeta local: `/var/home/nocal/Projectes/Emissora-VHF` (també accessible com `/home/nocal/Projectes/Emissora-VHF` en aquest entorn).
- Publicació: GitHub Pages des de `main`, arrel del repositori.

## 1. Objectiu i destinataris

PWA educativa que simula una emissora VHF marina ambientada al port de Maó, Menorca. L’usuari selecciona un canal, manté el PTT premut, parla i escolta una resposta d’una marina, dels pràctics, de Salvament Marítim o d’un altre veler. També pot transmetre text escrit i escoltar trànsit de fons amb soroll de ràdio.

Es busca una experiència de pràctica accessible des d’ordinador i mòbil, instal·lable com una aplicació. El destinatari concret és l’usuari que manté el compte GitHub **Guirigall** i vol practicar comunicacions de ràdio marina. No s’ha definit un públic comercial ni un nivell formatiu concret.

Estacions, posicions, abast, diàlegs i ús dels canals als escenaris són ficticis o simplificats. No és una eina per navegar ni substitueix la formació de radiooperador. Les assignacions dels escenaris no s’han de presentar com els canals operatius reals del port.

## 2. Estat actual: implementat i verificat

### Funcions implementades

- Emissora amb pantalla de canal, freqüències TX/RX, indicadors, escàner, accés 16/9, potència H/L, volum, squelch i dial.
- `channels.js` defineix canals 1–28 i 60–88, dúplex, restriccions de veu i de potència. El handoff anterior atribuïa el pla a l’UIT; en aquesta continuació no s’ha contrastat externament tot el pla. Llegir el codi i les proves abans d’afirmar conformitat completa.
- Web Audio genera estàtica, clics, squelch, veus llunyanes i ràfegues DSC/AIS.
- Motor local de conversa, text escrit, frases d’exemple, consells de procediment, mayday, pan-pan i DSC de socors simulat mantenint DISTRESS tres segons.
- Estacions de `stations.js`: marina, canals 16/9, a 1,5 milles; pràctics, 16/12, a 2 milles; Salvament, 16/10, a 18 milles; veler Tramuntana, 16/72, a 3 milles. Distàncies de simulació. L’abast simulat és de 25 milles amb 25 W i 5 milles amb 1 W.
- Trànsit de fons generat amb variacions i memòria recent per canal; no és una garantia que mai es repeteixi contingut.
- Interfície i consells en català, espanyol, anglès i francès. Comunicacions de ràdio en espanyol, anglès o francès.
- PWA amb manifest, icones, còpia fora de línia i preferències al navegador. Reconeixement de veu i IA opcional requereixen serveis externs; no s’han de prometre fora de línia.
- Mode Claude opcional, amb retorn al motor local si falla.

### Canvis recents

| Versió | Canvis |
|---|---|
| v1.2.1 | Apagar cancel·la transmissió, temporitzadors DSC, micròfon i cua de respostes; invalida resultats tardans de la sessió; neteja historial i estat de diàleg. Canal fix durant TX i preservat en processar la transcripció. Volum amb la ràdio apagada i alliberament de permisos de micròfon tardans corregits. |
| v1.2.2 | Icona d’emissora fixa horitzontal amb micròfon separat, SVG i PNG de 192/512 px. Eliminada la segona captura de micròfon per al vúmetre durant el PTT. Gestió de resultats finals després de deixar anar el botó, sessions acabades prematurament i textos revisats. Errors de veu traduïts. |
| v1.2.4 | **Correcció del PTT real:** el micròfon s’obre amb `getUserMedia` i la pista es passa al reconeixedor (`start(track)`), amb alternativa sense pista. Vúmetre real amb el mateix flux. Fases noves al diagnòstic: «Micròfon obert», «So detectat pel reconeixedor» i «Sense pista pròpia». Les fases repetides s’agrupen (×N). `package.json` passa a 1.2.4. |
| v1.2.3 | La capçalera reutilitza `icons/icon.svg`. Botó «Parla amb un toc» per començar amb un clic i acabar amb un altre. Diagnòstic de fases/codis visible i versió a la capçalera. «Escoltant» només després de `audiostart`; límit de 12 s si no comença la captura. |

L’usuari ha dit que **la icona nova està bé**. Va indicar que el dibuix antic encara apareixia a dalt a l’esquerra; això s’ha corregit a v1.2.3. No s’ha rebut una confirmació posterior.

### Evidència i límits de les proves

- `npm test` passa: 27 casos en vuit fitxers. A `voice.test.mjs` hi ha regressions de la causa real: la pista arriba al reconeixedor i s’allibera, el permís denegat es diu `not-allowed`, i sense dispositiu es fa servir la captura del navegador.
- Prova real del reconeixement (12/11/2026, v1.2.4): vegeu la prioritat a l’inici del document.
- El flux de GitHub Actions executa les proves amb Node 22 i Chromium/Playwright en formats 1440×1050 i 390×844. Prova apagar durant TX de text, ajustar volum apagat i tornar a encendre; PTT amb resultats finals després de deixar-lo anar; error de xarxa; absència de segona petició de micròfon; alternativa amb dos clics i icona de capçalera.
- Última comprovació v1.2.3: [Captures del README, execució 43195879590](https://github.com/Guirigall/EmissoraVHF/actions/runs/43195879590), completada correctament. [Publicació Pages 43195879248](https://github.com/Guirigall/EmissoraVHF/actions/runs/43195879248), correcta.
- **El reconeixedor de les proves automàtiques (Node i Actions) és simulat.** La prova real s’ha fet a mà amb el Chrome de l’equip i àudio generat; s’hauria d’automatitzar (vegeu pendents). El format mòbil emulat tampoc és una prova en un telèfon físic.
- El handoff anterior indicava comprovacions de converses, escàner, canal 70, DSC, francès i mode fora de línia. No totes s’han tornat a executar manualment en aquesta continuació.
- Sense verificació real documentada del reconeixement amb micròfon, de Claude contra l’API, d’Android/iPhone físics ni de Safari.

## 3. Decisions clau i motius

- **Interfície i ràdio separades:** `settings.ui` controla textos i consells; `settings.lang` controla respostes, veu i reconeixement. Permet una interfície catalana amb comunicacions en una altra llengua.
- **Sense català com a llengua de ràdio:** decisió prèvia per la qualitat/disponibilitat de les veus sintètiques observada en el projecte. No és una afirmació universal sobre tots els navegadors. Configuracions antigues amb `lang: 'ca'` es migren a una llengua admesa.
- **Alternativa escrita conservada:** permet utilitzar el simulador quan el reconeixement no està disponible o falla.
- **Una sola captura durant PTT, compartida:** `listen()` obre el micròfon una vegada per transmissió (els reintents reutilitzen la pista) i el passa al reconeixedor. `onStream` dona el mateix `MediaStream` a `audio.meter()` per al vúmetre, sense una segona `getUserMedia`. `audio.micMeter()` continua existint però el PTT no la fa servir.
- **Esperar resultats finals:** `listen().stop()` espera el final del servei, amb límit de 8 s. Si el navegador acaba abans que s’alliberi el PTT, pot reiniciar la captura amb un màxim de tres reintents. Hi ha un límit global de TX de 45 s a `app.js`.
- **Cancel·lació per sessió:** apagar invalida transcripcions i respostes IA pendents, perquè no afectin la pròxima sessió.
- **Diagnòstic mínim en memòria:** mostra context segur, connexió, disponibilitat de l’API i últimes fases/codis. No grava ni desa àudio o claus. Els textos transcrits sí apareixen al registre normal de comunicacions.
- **HTML/CSS/mòduls ES estàtics:** sense compilació ni dependències per al funcionament local bàsic. Playwright és només per a l’automatització de proves/captures.
- **Motor local decideix canal i abast; Claude genera contingut:** es validen els interlocutors retornats per la IA. La IA no ha de saltar-se les regles de recepció.
- **Clau d’Anthropic només al navegador de cada usuari:** `localStorage`; mai al repositori, en captures ni en logs publicats.
- **Chrome prioritzat pel llançador:** decisió prèvia per veus i reconeixement. L’existència de l’API al navegador no garanteix que el servei funcioni. No s’ha identificat encara el navegador concret amb què falla l’usuari.
- **Una sola font per al dibuix de l’app:** `icons/icon.svg` és també la imatge de la capçalera, evitant un segon SVG divergent.

## 4. Coses provades, abandonades o no concloents

- **Icona antiga vertical i dibuix antic de capçalera:** rebutjats per l’usuari per l’aspecte. No restaurar-los. La substitució inicial només canviava les icones de la PWA i deixava el SVG independent de la capçalera; v1.2.3 ho unifica.
- **Reconeixement i `getUserMedia` simultanis per tenir vúmetre:** abandonat com a possible font de conflictes. Treure la segona captura **no ha demostrat resoldre** el problema real: l’usuari va informar que el PTT continuava fallant.
- **Mostrar «Escoltant» immediatament:** substituït per fases de preparació i captura real. No confondre `start` del servei amb `audiostart`.
- **Donar per resolt el PTT perquè passen proves simulades:** les versions anteriors van passar aquestes proves i l’usuari va continuar informant d’error. No repetir aquesta conclusió.
- **Hipòtesis del PTT revisades el 12/11/2026:** «servei de reconeixement inaccessible» queda descartada en aquest equip (amb pista, Google retorna text). La causa observada és la captura pròpia del reconeixedor sense so (vegeu l’inici). Si l’usuari continua tenint problemes, el diagnòstic dirà si falta «So detectat» o si arriba un error (`not-allowed`, `network`…).
- **`node --test tests/`:** fallava al runner amb Node 22, encara que funcionava a l’entorn local. Substituït per `node --test tests/*.test.mjs` a `package.json`.
- **Veus sintètiques filtrades amb Web Audio:** el disseny actual no les encamina pel filtre; l’efecte de ràdio es produeix sobre soroll i altres sons. No s’ha implementat una alternativa.
- **Publicar amb Git des de la shell d’aquest entorn:** va fallar per resolució DNS de `github.com`. Es va publicar amb les eines connectades de GitHub, creant arbre, commit i actualitzant `main` sense forçar. No interpretar-ho com un error del projecte o de les credencials.

## 5. Pendent, en ordre de prioritat

1. **Confirmar amb l’usuari que v1.2.4 funciona amb la seva veu** (Chrome, PWA o web). Comprovar que la capçalera diu **v1.2.4** (si no, recarregar: el service worker és xarxa primer). Si falla, demanar el «Diagnòstic de veu» i mirar si hi ha «Micròfon obert» i «So detectat pel reconeixedor».
2. **Automatitzar la prova real** a Actions o en un script local: Chrome amb `--use-file-for-fake-audio-capture` i un WAV, com a la prova manual del 12/11/2026. Ara Actions només fa servir un reconeixedor simulat. Atenció: depèn de la xarxa i del servei de Google, i pot ser inestable.
3. **Verificar amb veu humana i dispositius reals:** frase reconeguda, registre i resposta; repetir transmissions, concedir permís per primera vegada, canviar canal després de deixar anar, apagar/encendre i provar dispositiu físic. Afegir regressió de la causa concreta. Registrar què s’ha comprovat i amb quin navegador.
4. **Provar opcionalment Claude contra el servei real**, només amb una clau que proporcioni l’usuari per a aquest ús. «Prova la connexió» a configuració. No donar per vàlids models, paràmetres beta o preus perquè el mock els accepti.
5. **Revisar coherència de documentació i versions** quan es resolgui la veu: README d’usuari, paquet, SW i distintiu. Actualitzar el handoff amb evidència, no només amb canvis de codi.
6. **Millores opcionals, sense compromís d’implementació:** manifests per idioma, escolta doble 16 + canal de treball, accents de vaixells estrangers, mapa de posició, puntuació de procediment, exercicis guiats i aspecte inspirat en B&G V60. Són idees del handoff anterior, no la feina prioritària. Aquell document afirmava que l’usuari té el manual V60; no s’ha localitzat ni analitzat en aquesta continuació.

## 6. Problemes oberts, dubtes i riscos coneguts

- **Error principal (probablement resolt a v1.2.4, pendent de confirmació):** l’usuari deia que el micròfon semblava activar-se però no es reconeixia la veu. S’ha reproduït amb el Chrome de l’equip i àudio real, s’ha trobat la causa (captura pròpia del reconeixedor sense so) i s’ha corregit. Falta la confirmació de l’usuari amb la seva veu i el seu micròfon.
- Les proves mock no comproven permisos reals, dispositiu d’entrada, servidor de reconeixement, xarxa ni compatibilitat del navegador. La detecció `canListen()` només comprova la presència de l’API.
- Les veus depenen del sistema/navegador. Pot haver-hi API de síntesi sense veus disponibles; hi ha avisos i alternativa escrita. La implementació usa habitualment reconeixement remot, amb dependència de connexió i tractament d’àudio pel proveïdor del navegador.
- Mode IA no verificat amb una petició real. Els identificadors de model i paràmetres del codi són configuració existent, no garantia de disponibilitat ni de cost.
- El motor local interpreta paraules i intents; pot fallar amb frases inesperades. La IA tampoc garanteix entendre qualsevol frase.
- Manifest en català per a totes les llengües; no s’han creat manifests localitzats.
- Service worker xarxa-primer: els recursos i la versió instal·lada s’han de comprovar abans d’atribuir un resultat a l’últim canvi. No s’ha d’esborrar indiscriminadament `localStorage`, perquè conté preferències i pot contenir la clau de l’usuari.
- **Històries Git local/remota diferents:** aquesta continuació va crear commits locals i publicar commits equivalents mitjançant API, amb altres SHA; les captures afegeixen commits del bot a GitHub. No fer `push --force`, `reset --hard` o rebase sense inspeccionar arbres, diferències i canvis de l’usuari. Partir de l’estat remot actual quan calgui integrar.

## 7. Context tècnic, fitxers i restriccions

### Executar i provar

Des de la carpeta del projecte, amb Node 22 o posterior i Python 3:

```bash
bash Obre-Emissora.sh
# o només el servidor local:
npm start
# proves:
npm test
```

El servidor local s’obre a `http://localhost:8090`. El llançador prioritza Chrome i, si no el troba, el navegador per defecte. Cal servir l’app per localhost o HTTPS per a les funcions de veu/SW; no treballar obrint directament `index.html` com a fitxer.

### Mapa de fitxers

| Fitxer | Responsabilitat |
|---|---|
| `index.html`, `style.css` | Frontal, LCD, comandaments, PTT, botó `#voiceToggle`, diagnòstic `#voiceDiagnostics`, registre i configuració. |
| `app.js` | Orquestració, bucle de 120 ms, `pttDown`, `pttUp`, `transmitted`, `powerToggle`, cancel·lació de sessió, cues, configuració i idiomes. |
| `voice.js` | Síntesi i `listen(lang, onInterim, onStatus, onStream)`; retorna `stop()` i `abort()`. Obre el micròfon i passa la pista al reconeixedor. Fases: `starting`, `mic`, `nomic`, `service`, `ready`, `sound`, `speech`, `result`, `end`, `error`. |
| `audio.js` | Soroll i efectes Web Audio. `meter(stream, onLevel)` mesura un flux ja obert (el del PTT); `micMeter()` es conserva però no es fa servir. |
| `channels.js`, `stations.js` | Pla de canals i interlocutors/distàncies simulats. |
| `dialog.js`, `chatter.js` | Motor local i variants de respostes. |
| `traffic.js` | Generació, planificació i memòria de trànsit per canal. |
| `ai.js` | Context, crida a Claude i validació de resposta. |
| `i18n.js` | Textos CA/ES/EN/FR, llengües de ràdio, noms de canal i paraules de procediment. |
| `sw.js` | `VERSION='v1.2.4'`, llista explícita `FILES`, xarxa-primer i fallback fora de línia. |
| `manifest.webmanifest`, `icons/` | Instal·lació i icona nova. SVG també usat a la capçalera; PNG 192/512 per instal·lació. |
| `tests/*.test.mjs` | Canals, diàleg, trànsit, IA, traduccions, offline, àudio i veu simulada. |
| `.github/workflows/readme-previews.yml` | Node 22, proves, Playwright i captures, amb commit de les imatges per bot. |
| `.github/scripts/readme-preview.cjs` | Prova l’app amb Chromium, substitueix el reconeixedor per un mock i captura ordinador/mòbil. |
| `docs/images/` | `desktop.jpg`, `mobile.jpg`, `capture.json` amb commit font i errors de pàgina. |
| `README.md` | Guia d’usuari en català, espanyol i anglès. La interfície també té francès. |
| `vendor/anthropic-sdk.mjs`, `vendor/VERSION` | SDK Anthropic empaquetat; versió declarada `@anthropic-ai/sdk 1.8.0`. Càrrega només amb IA. |

`app.js` exposa `globalThis.__vhf` per a proves: `state`, `settings`, `traffic`, `sendText`, `setChannel`, `powerToggle`, `spokenCount`. No hi ha una connexió remota al micròfon de l’usuari disponible en aquesta sessió.

### Configuració i IA existent

Preferències sota `localStorage['vhf-settings-v1']`: nom del vaixell (`Xaloc` per defecte), `ui`, `lang`, mode, canal, potència, volum, squelch, subtítols i paràmetres IA.

`ai.js` declara `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`. Usa `client.beta.messages.parse`, `betaJSONSchemaOutputFormat`, esquema de respostes, esforç `low`, cache del sistema i, per a alguns models, beta `server-side-fallback-2026-07-01` amb `fallbacks: 'default'`. Client amb `dangerouslyAllowBrowser: true`, timeout de 30 s i un reintent. **Són valors del codi; no s’han validat contra l’API real.** El handoff anterior descrivia proves de petició/resposta i clau invàlida amb `fetch` interceptat. No hi ha preu per missatge verificat.

### Manteniment i publicació

- Text nou: afegir-lo als quatre idiomes de `i18n.js` i usar `t()` o atributs `data-i18n*`; executar les proves de traduccions.
- Nou mòdul de l’app: incloure’l a `FILES` de `sw.js`. En canvis de recursos funcionals, actualitzar la versió SW i el distintiu visible de `index.html`. Aquest handoff no és un recurs de la memòria cau: editar només documentació no requereix incrementar la versió funcional.
- Nova estació: revisar `stations.js`, motor local, context IA, guia i traduccions. Nou idioma de ràdio: revisar `dialog.js`, `chatter.js`, `traffic.js`, frases d’`app.js`, `i18n.js`, `voice.js` i esquema IA.
- Executar proves i revisar el diff abans de publicar. Publicació normal amb push a `main` si l’historial està integrat; amb eina connectada, partir del cap remot i actualitzar la referència amb SHA esperat i sense forçar.
- «Captures del README» s’executa quan canvien fitxers de l’app, proves, paquet o la mateixa automatització, i també manualment a Actions. Un canvi només a aquest document no el dispara. Verificar l’estat de Pages i de les proves quan correspongui.

### Preferències i restriccions de l’usuari

- Respondre en català. Treballar els projectes a `/home/nocal/Projectes` o l’equivalent `/var/home/nocal/Projectes`.
- Conservar les traduccions, el mode text i la instal·lació PWA. L’usuari ha aprovat la icona horitzontal nova.
- Repositori públic: cap clau API, correu personal, dades de navegador ni àudio privat en commits, captures o logs publicats.
- Autor de commits emprat: `Guirigall`, correu privat GitHub `61776585+Guirigall@users.noreply.github.com`.
- Prioritzar resoldre la veu abans d’ampliar funcions. No anunciar el PTT com a arreglat sense prova real i confirmació de què s’ha verificat.
