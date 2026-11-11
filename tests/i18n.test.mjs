import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {t,keysFor,channelKeys,UI_LANGS,detectUiLang,defaultVoiceLang} from '../i18n.js';
test('Els quatre idiomes tenen exactament les mateixes claus',()=>{
 const base=keysFor('ca').sort();
 for(const l of UI_LANGS){assert.deepEqual(keysFor(l).sort(),base,'claus de '+l);assert.deepEqual(channelKeys(l).sort(),channelKeys('ca').sort())}
});
test('Totes les claus que usa la interfície existeixen',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),js=['app.js','ai.js','dialog.js'].map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n');
 const used=new Set([...html.matchAll(/data-i18n(?:-html)?="([\w.]+)"/g)].map(m=>m[1]));
 for(const m of html.matchAll(/data-i18n-attr="([^"]+)"/g))for(const p of m[1].split(';'))used.add(p.split(':')[1]);
 for(const m of js.matchAll(/\bt\('([\w.]+)'/g))if(!m[1].endsWith('.'))used.add(m[1]);
 for(const m of js.matchAll(/tr\('(tip\.\w+)'/g))used.add(m[1]);
 for(const k of used)assert.ok(keysFor('ca').includes(k),'falta la clau '+k);
});
test('Idioma inicial i llengua de ràdio sense català',()=>{
 assert.equal(detectUiLang(['fr-FR','en']),'fr');assert.equal(detectUiLang(['de-DE']),'ca');assert.equal(detectUiLang(['ca-ES']),'ca');
 assert.equal(defaultVoiceLang('ca'),'es');assert.equal(defaultVoiceLang('fr'),'fr');
 assert.equal(t('lcd.dscHold',{n:2},'fr'),'DISTRESS : maintenez 2');
});
