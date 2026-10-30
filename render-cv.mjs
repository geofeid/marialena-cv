// Layout follows zab-cv's .card → .id + .skills + .main structure.
// Content and compact print variants follow Online_CV's shared-data approach.
export function renderCV(c, {e, pdfName, printView=false}) {
  const scopeNames = ['','Profile','Hands-on','Lead'];
  const signal = scope => `<span class="campaign-signal" aria-hidden="true" data-scope="${scope}"><i></i><i></i><i></i></span>`;
  const skillRow = x => `<li data-scope="${x.scope}"><span class="skill-name">${e(x.name)}</span><span class="skill-scope" title="${scopeNames[x.scope]}">${signal(x.scope)}<small class="sr-only">${scopeNames[x.scope]}</small></span></li>`;
  const aboutText = text => e(text).replace('Head of Digital','<strong>Head of Digital</strong>').replace('European B2B and B2C markets','<strong>European B2B and B2C markets</strong>');
  const icon = name => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const symbols = `<svg width="0" height="0" class="symbols" aria-hidden="true"><symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></symbol><symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol><symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol><symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></symbol><symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol></svg>`;
  const timeline = c.experience.map((x,i) => `<li class="${i===0?'now':''}"><p class="when">${e(x.dates)}</p><div class="what"><h3>${e(x.role)}</h3><p class="at">${e(x.company)} <span>· ${e(x.location)}</span></p><div class="paras screen-only"><ul>${x.bullets.map(b=>`<li>${e(b)}</li>`).join('')}</ul>${x.type.includes('Concurrent')||x.type.includes('concurrent')?`<p class="engagement">${e(x.type)}</p>`:''}</div><p class="paras print-only">${x.print.map(e).join(' ')}</p></div></li>`).join('');
  return `<body class="resume-page${printView?' print-preview':''}">${symbols}<a class="skip" href="#main">Skip to content</a>${printView?'<div class="print-toolbar"><a href="index.html">← Back to online CV</a><button onclick="window.print()">Print / Save PDF</button></div>':''}
<div class="card">
  <header class="id">
    <img class="photo" src="assets/marialena-portrait-clean.png" alt="Maria–Eleni Konsta" width="1122" height="1402" fetchpriority="high">
    <h1 class="name">Maria–Eleni <span>Konsta</span></h1>
    <p class="alias">Marialena</p><p class="role">${e(c.role)}</p><p class="org">GENEKOR Medical S.A.</p>
    <a class="btn" href="${pdfName}" download>${icon('download')}Download CV (PDF)</a>
    <ul class="contact" id="contact">
      <li>${icon('phone')}<a href="tel:${c.phone.replace(/\s/g,'')}">${e(c.phone)}</a></li>
      <li>${icon('mail')}<a class="ext" href="mailto:${e(c.email)}">${e(c.email)}</a></li>
      <li>${icon('linkedin')}<a class="ext" href="${e(c.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/<wbr>marialenakonsta</a></li>
      <li>${icon('pin')}<span>${e(c.location)}</span></li>
    </ul>
  </header>
  <aside class="skills" aria-label="Skills and languages">
    <section id="expertise"><h2 class="label">Digital marketing skills</h2><div class="screen-only"><p class="signal-legend signal-key"><span>${signal(1)}Profile</span><span>${signal(2)}Hands-on</span><span>${signal(3)}Lead</span></p>${c.skillGroups.map(x=>`<h3 class="skill-group-title skill-band">${e(x.title)}</h3><ul class="skill-list campaign-skills">${x.items.map(skillRow).join('')}</ul>`).join('')}</div><div class="print-only compact-skills">${c.printSkillGroups.map((x,i)=>`<div><h3 class="skill-group-title">${e(x.title)}${signal(i===2?1:3)}</h3><p>${e(x.text)}</p></div>`).join('')}</div></section>
    <section><h2 class="label">Soft skills</h2><ul class="chips soft-skills screen-only">${c.softSkills.map(y=>`<li>${e(y.name)}</li>`).join('')}</ul><p class="print-only compact-soft-skills">${c.printSoftSkills.map(x=>`<span class="skill-term">${e(x)}</span>`).join(' · ')}</p></section>
    <section><h2 class="label">Languages</h2><ul class="language-list">${c.languages.map(([a,b])=>`<li><strong>${e(a)}</strong><span><span class="screen-only">${e(b)}</span><span class="print-only">${e(b.replace(' proficiency',''))}</span></span></li>`).join('')}</ul></section>
  </aside>
  <main class="main" id="main">
    <section class="sec about"><h2>${printView?'Professional Summary':'About'}</h2><div class="screen-only">${c.about.map(x=>`<p>${aboutText(x)}</p>`).join('')}</div><p class="print-only">${aboutText(c.summary)}</p></section>
    <section class="sec" id="experience"><h2>Work experience</h2><ol class="timeline">${timeline}</ol><div class="earlier"><h3>Earlier experience</h3><ul>${c.earlier.map(x=>`<li><strong>${e(x.company)}</strong> · ${e(x.role)} · ${e(x.dates)}<span class="screen-only"> · ${e(x.location)}</span></li>`).join('')}</ul></div></section>
    <section class="sec projects-section screen-only"><h2>Selected initiatives</h2><dl class="projects">${c.projects.map(x=>`<div><dt>${e(x.context)}</dt><dd><h3>${e(x.title)}</h3><p>${e(x.text)}</p></dd></div>`).join('')}</dl></section>
    <section class="sec education"><h2>Education</h2><ol class="timeline">${c.education.map(x=>`<li><p class="when"><span class="screen-only">${e(x.dates)}</span><span class="print-only">${e(x.printDates||x.dates)}</span></p><div class="what"><h3>${e(x.degree)}</h3><p class="at">${e(x.school)} <span>· ${e(x.location)}</span></p><p class="paras screen-only">${e(x.note)}</p>${x.achievement?`<p class="achievement screen-only">${e(x.achievement)}</p>`:''}</div></li>`).join('')}</ol></section>
    <section class="sec certifications"><h2>Certifications & development</h2><ul class="credentials screen-only">${c.certifications.map(x=>`<li>${e(x)}</li>`).join('')}<li>${e(c.ongoing)}</li></ul><ul class="credentials print-only"><li>Digital Marketing Pro · AI & Digital Marketing (University of Patras · 250 hours)</li><li>Google Ads · Google Analytics (Beginner & Advanced) · Google Digital Garage</li><li>LinkedIn Learning · Photoshop, graphic design, email, SEO, content & social media</li><li>AI Marketing Bootcamp · Public · In progress per supplied CV</li></ul></section>
  </main>
</div></body>`;
}
