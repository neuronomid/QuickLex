const webhookQuick = 'https://celebrated-beauty-production.up.railway.app/webhook/5131686e-9341-4559-a4db-e8a7b11c01c5';
const webhookPro = 'https://celebrated-beauty-production.up.railway.app/webhook/ebce61bb-fb95-468c-967d-f5c5bb6b44f1';

const input = document.getElementById('wordInput');
const cancelBtn = document.getElementById('cancelBtn');
const doneBtn = document.getElementById('doneBtn');
const responseArea = document.getElementById('responseArea');
const toggle = document.getElementById('modeToggle');
const container = document.getElementById('mainContainer');

// تابع شناسایی خطوطی که با ایموجی شروع می‌شوند
function isEmojiLine(line) {
  return /^[\u231A-\u231B\u23E9-\u23EC\u23F0-\u23F4\u2600-\u27BF\u2B50-\u2B55\u2934-\u2935\u3297-\u3299\uD83C-\uDBFF\uDC00-\uDFFF]/.test(line.trim());
}

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

    // فاصله‌دهی قبل از خطوط ایموجی (برای خوانایی)
    text = text.replace(/(^|\n)(?=.*(?:✏️|☑️|⚪️|))/g, '\n');

    // تشخیص راست‌به‌چپ یا چپ‌به‌راست و اضافه کردن کلاس emoji-line
    const lines = text.split('\n');
    responseArea.innerHTML = lines.map(line => {
      const isRTL = /[\u0600-\u06FF]/.test(line);
      const emojiClass = isEmojiLine(line) ? 'emoji-line' : '';
      return `<span dir="${isRTL ? 'rtl' : 'ltr'}" class="${emojiClass}">${line}</span>`;
    }).join('\n');

    input.value = '';
    input.blur(); // بستن کیبورد در موبایل
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
    }, 200); // بستن کیبورد با Enter موبایل
  }
});

toggle.addEventListener('change', () => {
  container.classList.toggle('pro-mode', toggle.checked);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
