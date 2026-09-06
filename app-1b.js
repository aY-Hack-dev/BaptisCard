function buildCardSVG(carte, eglise) {
const logoUrl = eglise?.logoUrl || LOGO_AD_DATA_URI;
const logoWatermark = eglise?.logoUrl || LOGO_AD_DATA_URI;
const pasteur = carte.pasteurOverride || eglise?.pasteur || '';
const nomEglise = eglise?.nom || '';
const sigUrl = carte.signatureOverride || eglise?.signatureUrl || '';
const uidSuffix = carte.id || uid();
return `
<svg id="card-svg-${uidSuffix}" class="baptism-card-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 1011 638" width="1011" height="638">
<defs>
<style>@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&amp;family=Poppins:wght@400;500;600;700;800&amp;display=swap');.titre{font-family:'Oswald',sans-serif;font-weight:700;}.titre-med{font-family:'Oswald',sans-serif;font-weight:500;}.label{font-family:'Poppins',sans-serif;font-weight:700;fill:#073A7A;}.value{font-family:'Poppins',sans-serif;font-weight:600;fill:#0b1f3a;}.phrase{font-family:'Poppins',sans-serif;font-weight:700;fill:#073A7A;}.footer-text{font-family:'Poppins',sans-serif;font-weight:400;fill:#ffffff;}.footer-gold{font-family:'Poppins',sans-serif;font-weight:700;fill:#f4b31e;}.sig-label{font-family:'Poppins',sans-serif;font-weight:600;fill:#073A7A;}</style>
<clipPath id="cardClip-${uidSuffix}"><rect x="0" y="0" width="1011" height="638" rx="22" ry="22"/></clipPath>
<clipPath id="photoClip-${uidSuffix}"><rect x="0" y="0" width="276" height="333" rx="10" ry="10"/></clipPath>
<clipPath id="headerClip-${uidSuffix}"><rect x="0" y="0" width="1011" height="148" rx="22" ry="22"/></clipPath>
<clipPath id="footerClip-${uidSuffix}"><rect x="0" y="578" width="1011" height="60" rx="22" ry="22"/></clipPath>
</defs>
<g clip-path="url(#cardClip-${uidSuffix})">
<rect x="0" y="0" width="1011" height="638" fill="#ffffff"/>
<image href="${logoWatermark}" x="620" y="180" width="420" height="420" opacity="0.05" preserveAspectRatio="xMidYMid meet"/>
<g clip-path="url(#headerClip-${uidSuffix})">
<rect x="0" y="0" width="1011" height="148" fill="#073A7A"/>
<path d="M0,148 C450,90 650,160 1011,118 L1011,148 Z" fill="#f4b31e"/>
<path d="M0,140 C450,86 650,150 1011,110 L1011,120 C650,158 450,98 0,152 Z" fill="#ffffff"/>
</g>
<image href="${logoUrl}" x="38" y="20" width="108" height="108" preserveAspectRatio="xMidYMid meet"/>
${(() => {
const rawName = (nomEglise || 'ASSEMBLEES DE DIEU').toUpperCase();
let fontSize = 40;
if (rawName.length > 30) fontSize = 22;
else if (rawName.length > 24) fontSize = 27;
else if (rawName.length > 18) fontSize = 33;
const displayName = rawName.length > 42 ? rawName.slice(0, 40) + '…' : rawName;
return `<text x="164" y="72" class="titre" font-size="${fontSize}" fill="#ffffff">${escapeXml(displayName)}</text>`;
})()}
<text x="164" y="102" class="titre-med" font-size="20" fill="#ffffff">Tout L'Evangile</text>
<rect x="164" y="114" width="60" height="3" fill="#f4b31e"/>
<rect x="693" y="18" width="280" height="76" rx="14" fill="#0e4fa3" stroke="#ffffff" stroke-width="3"/>
<text x="833" y="66" text-anchor="middle" class="titre" font-size="27" fill="#ffffff">CARTE DE BAPTÊME</text>
<rect x="41" y="176" width="282" height="339" rx="13" fill="#073A7A"/>
<g clip-path="url(#photoClip-${uidSuffix})" transform="translate(44,179)">
<rect x="0" y="0" width="276" height="333" fill="#eef2f7"/>
${carte.photoUrl
? `<image href="${carte.photoUrl}" x="0" y="0" width="276" height="333" preserveAspectRatio="xMidYMid slice"/>`
: `<text x="138" y="157" text-anchor="middle" class="value" font-size="16" fill="#94a3b8">Photo du</text>
<text x="138" y="180" text-anchor="middle" class="value" font-size="16" fill="#94a3b8">baptisé</text>`
}
</g>
<text x="373" y="200" class="label" font-size="17">Nom :</text>
<text x="373" y="246" class="label" font-size="17">Prénom (s) :</text>
<text x="373" y="292" class="label" font-size="17">Né (e) le :</text>
<text x="373" y="338" class="label" font-size="17">À :</text>
<text x="373" y="384" class="label" font-size="17">Église :</text>
<text x="373" y="440" class="phrase" font-size="15">A été baptisé d'eau au nom du père, du fils et du Saint-Esprit,</text>
<text x="373" y="486" class="label" font-size="17">Le :</text>
<text x="373" y="532" class="label" font-size="17">Par le pasteur :</text>
<line x1="373" y1="210" x2="973" y2="210" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="256" x2="973" y2="256" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="302" x2="973" y2="302" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="348" x2="973" y2="348" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="394" x2="973" y2="394" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="450" x2="973" y2="450" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="496" x2="973" y2="496" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<line x1="373" y1="542" x2="973" y2="542" stroke="#7f9fc9" stroke-width="1" stroke-dasharray="2,3"/>
<text x="545" y="200" class="value" font-size="17">${escapeXml(carte.nom || '')}</text>
<text x="545" y="246" class="value" font-size="17">${escapeXml(carte.prenom || '')}</text>
<text x="545" y="292" class="value" font-size="17">${escapeXml(carte.naissance || '')}</text>
<text x="545" y="338" class="value" font-size="17">${escapeXml(carte.lieu || '')}</text>
<text x="545" y="384" class="value" font-size="17">${escapeXml(nomEglise)}</text>
<text x="545" y="486" class="value" font-size="17">${escapeXml(carte.dateBapteme || '')}</text>
<text x="545" y="532" class="value" font-size="17">${escapeXml(pasteur)}</text>
${sigUrl ? `<image href="${sigUrl}" x="675" y="500" width="170" height="46" preserveAspectRatio="xMidYMid meet"/>` : ''}
<line x1="685" y1="546" x2="905" y2="546" stroke="#073A7A" stroke-width="1.2"/>
<text x="795" y="562" text-anchor="middle" class="sig-label" font-size="13">Signature du pasteur</text>
<g clip-path="url(#footerClip-${uidSuffix})">
<rect x="0" y="578" width="1011" height="60" fill="#073A7A"/>
<path d="M791,638 C851,618 951,638 1011,622" stroke="#f4b31e" stroke-width="3" fill="none"/>
</g>
<g transform="translate(75,592)">
<path d="M32 10 C36 4 44 2 50 6 C46 8 44 12 44 16 C50 14 56 16 58 20 C52 20 48 24 46 28 C40 24 34 26 32 30 C30 26 24 24 18 28 C16 24 12 20 6 20 C8 16 14 14 20 16 C20 12 18 8 14 6 C20 2 28 4 32 10 Z" fill="#ffffff" transform="scale(0.42)"/>
<rect x="5" y="16" width="16" height="1.8" fill="#ffffff"/>
<path d="M5 16 C9.5 14.3 12 15.2 13.5 16 C15 15.2 17.5 14.3 21 16 L21 17.6 C17.5 15.9 15 16.7 13.5 17.5 C12 16.7 9.5 15.9 5 17.6 Z" fill="#ffffff"/>
</g>
<rect x="108" y="586" width="2" height="38" fill="#f4b31e"/>
<text x="128" y="601" class="footer-text" font-size="13">« Allez, faites de toutes les nations des disciples,</text>
<text x="128" y="617" class="footer-text" font-size="13">les baptisant au nom du Père, du Fils et du Saint-Esprit. »</text>
<text x="128" y="633" class="footer-gold" font-size="13">Matthieu 28:19</text>
<text x="973" y="601" text-anchor="end" class="footer-text" font-size="12">Délivrée le</text>
<text x="973" y="623" text-anchor="end" class="footer-gold" font-size="17">${escapeXml(carte.dateDelivrance || '')}</text>
<rect x="1.5" y="1.5" width="1008" height="635" rx="21" ry="21" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
</g>
</svg>`;
}
function getEgliseById(id) {
return state.data.eglises.find((e) => e.id === id) || null;
}
