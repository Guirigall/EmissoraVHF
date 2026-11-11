import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('Tots els fitxers de l’app són a la memòria cau i existeixen',()=>{
 const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),files=JSON.parse(sw.match(/const FILES=(\[[^\]]*\])/)[1].replace(/'/g,'"'));
 for(const f of files)if(f!=='./')assert.ok(fs.existsSync(new URL('../'+f,import.meta.url)),f);
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),js=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
 for(const m of (js+html).matchAll(/from '\.\/([\w-]+\.js)'|src="\.\/([\w-]+\.js)"/g))assert.ok(files.includes('./'+(m[1]||m[2])),'falta a la memòria cau: '+(m[1]||m[2]));
 for(const f of fs.readdirSync(new URL('..',import.meta.url)).filter(f=>f.endsWith('.js')&&f!=='sw.js'))assert.ok(files.includes('./'+f),'falta '+f);
 const m=JSON.parse(fs.readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));for(const i of m.icons)assert.ok(fs.existsSync(new URL('../'+i.src,import.meta.url)));
});
