const webhookQuick = 'https://celebrated-beauty-production.up.railway.app/webhook/5131686e-9341-4559-a4db-e8a7b11c01c5';
const webhookPro = 'https://celebrated-beauty-production.up.railway.app/webhook/ebce61bb-fb95-468c-967d-f5c5bb6b44f1';

const input = document.getElementById('wordInput');
const cancelBtn = document.getElementById('cancelBtn');
const doneBtn = document.getElementById('doneBtn');
const responseArea = document.getElementById('responseArea');
const toggle = document.getElementById('modeToggle');
const container = document.getElementById('mainContainer');

cancelBtn.onclick = () => {
  input.value = '';
  responseArea.innerHTML = '';
  input.focus();
};

async function doFetch() {
  const word = input.value.trim();
  if (!word) return;
  responseArea.textContent = 'Loading...';
  const url = toggle.checked ? webhookPro : webhookQuick;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    let text = await res.text();

    // Auto spacing before emoji headers
    text = text.replace(/(^|\n)(?=.*(?:📚|🏃|💼|✏️|☑️|⚪️|📌|📎|📘|📖|🏠|✅|📄|📁|🧠|🔍|💡|📢|📤|📥|📈|📊|📅|🔬|📂|📑|📚|🔖|📝|📎|📉|📇))/g, '\n\n');

    // Auto direction detection per line
    const lines = text.split('\n');
    responseArea.innerHTML = lines.map(line => {
      const isRTL = /[\u0600-\u06FF]/.test(line);
      return `<span dir="${isRTL ? 'rtl' : 'ltr'}">${line}</span>`;
    }).join('\n');
    
    input.value = '';
    input.focus();
  } catch (err) {
    responseArea.textContent = 'Error: ' + err.message;
  }
}

doneBtn.onclick = doFetch;
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doFetch();
  }
});

toggle.addEventListener('change', () => {
  container.classList.toggle('pro-mode', toggle.checked);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
