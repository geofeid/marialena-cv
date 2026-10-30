import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(import.meta.dirname,'..');
const dist=resolve(root,'dist');
for(const name of ['index.html','print.html','brand.html']){
  const html=readFileSync(resolve(dist,name),'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const value=match[1].split('#')[0].split('?')[0];
    if(!value||/^(?:https?:|mailto:|tel:|data:)/.test(value)||value==='./')continue;
    assert(existsSync(resolve(dist,value)),`${name}: missing ${value}`);
  }
}
const html=readFileSync(resolve(dist,'index.html'),'utf8');
assert(!html.includes('Personal identity guide'));
assert(!html.includes('Download ATS version'));
assert.equal((html.match(/class="skill-name"/g)||[]).length,25);
assert(existsSync(resolve(dist,'Maria-Eleni-Konsta-CV.pdf')));
console.log('Publication files, links, portrait, CV download and 25 skill labels verified');
