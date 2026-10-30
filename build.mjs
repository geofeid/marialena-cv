import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderCV } from './render-cv.mjs';
import { renderBrand } from './render-brand.mjs';

process.chdir(import.meta.dirname);
const c = JSON.parse(readFileSync('content.json', 'utf8'));
const e = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pdfName = 'Maria-Eleni-Konsta-CV.pdf';
const mark = '<span class="monogram" aria-hidden="true">m<span>.</span></span>';
const arrow = '<span aria-hidden="true">↗</span>';
const siteUrl='https://geofeid.github.io/marialena-cv/';
const head = (title, description, extra='', stylesheet='styles.css') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(description)}"><meta name="theme-color" content="#531d35">
<meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="profile">
<meta property="og:image" content="${siteUrl}assets/marialena-portrait-clean.png"><meta property="og:url" content="${siteUrl}">
<link rel="icon" href="assets/monogram.svg" type="image/svg+xml"><link rel="stylesheet" href="${stylesheet}">${extra}</head>`;
const nav = `<a class="skip" href="#main">Skip to content</a><header class="nav"><a class="wordmark" href="./" aria-label="Marialena CV">${mark}<span>marialena.</span></a><nav aria-label="CV navigation"><a href="index.html">Online CV</a><a href="print.html">A4 preview</a></nav><a class="nav-download" href="${pdfName}" download>Download CV <span aria-hidden="true">↓</span></a></header>`;
const footer = `<footer class="footer"><a class="wordmark" href="./">${mark}<span>marialena.</span></a><span>Maria–Eleni Konsta</span><a href="index.html">Back to CV ${arrow}</a></footer>`;
const web = head(`${c.name} · ${c.role}`, c.summary, '', 'cv.css') + renderCV(c,{e,pdfName}) + '</html>';
const printRules = readFileSync('cv.css','utf8').split('@media print{')[1].trim().replace(/\}\s*$/,'');
const previewStyle = `<style>@scope (.print-preview){${printRules}} @media screen{body.print-preview{font-size:8pt;background:var(--mist)!important}.print-preview .print-toolbar{display:flex!important}.print-preview .card{margin:20px auto;box-shadow:0 8px 40px #531d3520}}</style>`;
const print = head(`${c.name} · Curriculum Vitae`,c.summary,'<meta name="robots" content="noindex">'+previewStyle,'cv.css') + renderCV(c,{e,pdfName,printView:true}) + '</html>';
const brand = renderBrand({head,nav,footer,mark,arrow,e});
mkdirSync('dist', {recursive:true});
for(const obsolete of ['ats.html','ats.css','Maria-Eleni-Konsta-ATS.pdf','Maria-Eleni-Konsta-ATS.txt'])rmSync(resolve('dist',obsolete),{force:true});
cpSync('assets','dist/assets',{recursive:true,filter:source=>!source.endsWith('marialena-portrait.png')});
rmSync('dist/assets/marialena-portrait.png',{force:true});
cpSync('fonts','dist/fonts',{recursive:true});
for (const stylesheet of ['styles.css','cv.css']) cpSync(stylesheet,`dist/${stylesheet}`);
for (const [name,html] of [['index.html',web],['print.html',print],['brand.html',brand]]) writeFileSync(`dist/${name}`,html);
console.log('Built online CV, A4 preview and identity guide');
if(process.argv.includes('--pdf')) {
  const chrome = [process.env.CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome'].find(x=>x&&existsSync(x));
  if(!chrome) throw new Error('Chrome not found. Set CHROME_PATH.');
  for (const [file,source,min,max] of [[pdfName,'print.html',1,1]]) {
    // Keep the currently downloadable PDF intact until its replacement passes checks.
    const target=resolve('dist',`.${file}.building.pdf`);
    rmSync(target,{force:true});
    const run=spawnSync(chrome,['--headless','--disable-gpu',...(process.platform==='linux'?['--no-sandbox']:[]),`--user-data-dir=${resolve('.chrome-profile')}`,'--no-pdf-header-footer','--allow-file-access-from-files','--timeout=15000',`--print-to-pdf=${target}`,pathToFileURL(resolve('dist',source)).href],{encoding:'utf8',timeout:60000});
    if(run.error||run.status!==0||!existsSync(target))throw new Error(`PDF failed: ${run.error||run.stderr}`);
    const pages=(readFileSync(target,'latin1').match(/\/Type\s*\/Page\b/g)||[]).length;
    if(pages<min||pages>max)throw new Error(`${file}: expected ${min}–${max} A4 pages, got ${pages}. Check the print layout.`);
    const optimise=spawnSync(process.env.PYTHON_PATH||'python',['-X','utf8','scripts/optimise-pdf.py',target],{encoding:'utf8',timeout:30000});
    if(optimise.error||optimise.status!==0)throw new Error(`PDF optimisation/check failed: ${optimise.error||optimise.stderr}`);
    console.log(optimise.stdout.trim());
    renameSync(target,resolve('dist',file));
    console.log(`${file}: ${pages} page(s)`);
  }
}
