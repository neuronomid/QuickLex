const QUICK_URL = 'https://celebrated-beauty-production.up.railway.app/webhook/5131686e-9341-4559-a4db-e8a7b11c01c5';
const PRO_URL   = 'https://celebrated-beauty-production.up.railway.app/webhook/ebce61bb-fb95-468c-967d-f5c5bb6b44f1';

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

  const url = toggle.checked ? PRO_URL : QUICK_URL;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    let text = await res.text();

    // Add a line break before each emoji (✏️, ☑️, ⚪️) if needed
    text = text.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️))/g, '\n');

    // Split and wrap lines
    const emojiPattern = /^(✏️|☑️|⚪️)/;
    const lines = text.split('\n');

    responseArea.innerHTML = lines.map(line => {
      const isRTL = /[\u0600-\u06FF]/.test(line);
      const isEmoji = emojiPattern.test(line.trim());
      return `<span dir="${isRTL ? 'rtl' : 'ltr'}"${isEmoji ? ' class="emoji-header"' : ''}>${line}</span>`;
    }).join('\n');

    input.value = '';
    input.blur();
  } catch (err) {
    responseArea.textContent = 'Error: ' + err.message;
  }
}

doneBtn.onclick = doFetch;

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doFetch();
    setTimeout(() => {
      input.blur();
    }, 200);
  }
});

toggle.addEventListener('change', () => {
  container.classList.toggle('pro-mode', toggle.checked);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
