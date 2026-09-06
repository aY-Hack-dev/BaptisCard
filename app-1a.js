const CLOUDINARY_CLOUD_NAME = 'dynibrw7q';
const CLOUDINARY_UPLOAD_PRESET = 'baptiscard_unsigned';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const JSONBIN_BIN_ID = '6a8202cfda38895dfeec37f2';
const JSONBIN_MASTER_KEY = '$2a$10$.FKUMTXgeLQ9.sUiT3QQzOQkYHh20PVWB7RCBx2c3VdtAvkXd0Hzq';
const JSONBIN_BASE = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const state = {
data: null,        // full bin payload: { eglises, cartes, parametres }
loaded: false,
currentTab: 'accueil',
selectedCardIds: new Set(),   // for Format A4 selection
editingCardId: null,          // when editing an existing card from "Cartes"
editingEgliseId: null,
};
function defaultData() {
return {
app: 'BaptisCard',
version: 2,
eglises: [],
cartes: [],
parametres: {
dateSoumissionDefaut: ''
}
};
}
let toastTimer = null;
function showToast(msg, type) {
const el = document.getElementById('toast');
el.textContent = msg;
el.className = 'toast show' + (type ? ' ' + type : '');
clearTimeout(toastTimer);
toastTimer = setTimeout(() => { el.classList.remove('show'); }, 2800);
}
function setSyncStatus(status) {
const el = document.getElementById('sync-indicator');
el.className = '';
if (status === 'busy') el.classList.add('busy');
else if (status === 'ok') el.classList.add('ok');
else if (status === 'err') el.classList.add('err');
}
async function loadData() {
setSyncStatus('busy');
try {
const res = await fetch(JSONBIN_BASE + '/latest', {
headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
});
if (!res.ok) throw new Error('HTTP ' + res.status);
const json = await res.json();
let record = json.record || defaultData();
if (!record.eglises) record.eglises = [];
if (!record.cartes) record.cartes = [];
if (!record.parametres) record.parametres = { dateSoumissionDefaut: '' };
state.data = record;
state.loaded = true;
setSyncStatus('ok');
} catch (err) {
console.error('loadData failed:', err);
setSyncStatus('err');
state.data = defaultData();
state.loaded = true;
showToast('Connexion au cloud impossible — mode hors-ligne temporaire', 'err');
}
return state.data;
}
let saveInFlight = false;
let savePending = false;
async function saveData() {
if (!state.data) return;
if (saveInFlight) { savePending = true; return; }
saveInFlight = true;
setSyncStatus('busy');
try {
const res = await fetch(JSONBIN_BASE, {
method: 'PUT',
headers: {
'Content-Type': 'application/json',
'X-Master-Key': JSONBIN_MASTER_KEY
},
body: JSON.stringify(state.data)
});
if (!res.ok) throw new Error('HTTP ' + res.status);
setSyncStatus('ok');
} catch (err) {
console.error('saveData failed:', err);
setSyncStatus('err');
showToast("Échec de la sauvegarde cloud — réessayez", 'err');
} finally {
saveInFlight = false;
if (savePending) {
savePending = false;
saveData();
}
}
}
async function uploadToCloudinary(dataUrlOrBlob, folderHint) {
const formData = new FormData();
if (typeof dataUrlOrBlob === 'string') {
formData.append('file', dataUrlOrBlob);
} else {
formData.append('file', dataUrlOrBlob);
}
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
if (folderHint) formData.append('folder', 'baptiscard/' + folderHint);
const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
if (!res.ok) {
const errText = await res.text().catch(() => '');
throw new Error('Cloudinary upload failed: ' + res.status + ' ' + errText);
}
const json = await res.json();
return json.secure_url;
}
function resizeImageFile(file, targetW, targetH, mode) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = (evt) => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement('canvas');
canvas.width = targetW;
canvas.height = targetH;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
if (mode === 'cover') {
const srcRatio = img.width / img.height;
const dstRatio = targetW / targetH;
let sx, sy, sw, sh;
if (srcRatio > dstRatio) {
sh = img.height; sw = sh * dstRatio;
sx = (img.width - sw) / 2; sy = 0;
} else {
sw = img.width; sh = sw / dstRatio;
sx = 0; sy = (img.height - sh) / 2;
}
ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
} else {
const scale = Math.min(targetW / img.width, targetH / img.height);
const w = img.width * scale, h = img.height * scale;
const dx = (targetW - w) / 2, dy = (targetH - h) / 2;
ctx.drawImage(img, dx, dy, w, h);
}
resolve(canvas.toDataURL('image/jpeg', 0.92));
};
img.onerror = reject;
img.src = evt.target.result;
};
reader.onerror = reject;
reader.readAsDataURL(file);
});
}
function uid() {
return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function escapeXml(str) {
return String(str || '').replace(/[<>&'"]/g, (c) => ({
'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
}[c]));
}
function setTab(tab) {
state.currentTab = tab;
document.querySelectorAll('.tab-btn').forEach((btn) => {
btn.classList.toggle('active', btn.dataset.tab === tab);
});
renderCurrentTab();
document.getElementById('app-content').scrollTop = 0;
window.scrollTo(0, 0);
}
function renderCurrentTab() {
const root = document.getElementById('app-content');
if (!state.loaded) {
root.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px; gap:14px;">
<div class="spinner dark" style="width:28px;height:28px;"></div>
<p style="color:var(--text-muted); font-size:13px;">Chargement des données…</p>
</div>`;
return;
}
if (state.currentTab === 'accueil') renderAccueil(root);
else if (state.currentTab === 'cartes') renderCartes(root);
else if (state.currentTab === 'eglises') renderEglises(root);
else if (state.currentTab === 'a4') renderA4(root);
else if (state.currentTab === 'parametres') renderParametres(root);
}
