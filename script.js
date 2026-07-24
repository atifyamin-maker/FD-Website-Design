/* ============================================================
   Stable Money — shared JS (headline anim, marquees, testimonials, counter)
   Every function guards for element presence so one file serves all pages.
   ============================================================ */

// ---- Animated headline ----
// <h1 data-headline data-parts='[["India’s ",false],["Safe Investment",true],[" Platform",false]]'>
// Letters are grouped into .word wrappers so a word never breaks mid-way;
// line breaks happen only at the real spaces between words.
document.querySelectorAll('[data-headline]').forEach(h1 => {
  let parts;
  try { parts = JSON.parse(h1.getAttribute('data-parts')); } catch(e){ return; }
  let i = 0;
  let word = null;
  parts.forEach(p => {
    const [text, gold] = p;
    [...text].forEach(ch => {
      if (ch === ' ') {
        h1.appendChild(document.createTextNode(' ')); // breakable space between words
        word = null;
        return;
      }
      if (!word) {
        word = document.createElement('span');
        word.className = 'word';
        h1.appendChild(word);
      }
      const s = document.createElement('span');
      s.className = 'char' + (gold ? ' char-gold' : '');
      s.style.animationDelay = (i * 0.04) + 's';
      s.textContent = ch;
      word.appendChild(s);
      i++;
    });
  });
});

// ---- Bank marquees ----
const BANK_BASE = "https://assets.stablemoney.in/bank-logos/";
const banksTop = [
  ["Unity.png","8.30%"],["Suryoday.png","8.40%"],["UtkarshNew.webp","8.15%"],
  ["SBI.png","7.30%"],["HDFC.png","7.10%"],["Shriram.png","8.19%"],
  ["ICICI.png","7.10%"],["Bajaj.png","7.75%"],["Shivalik.png","8.50%"],
  ["AU.webp","7.90%"],["Ujjivan.png","8.30%"],["bandhan.png","7.75%"],
  ["Yes.png","8.08%"],["axis.png","7.10%"],["kotak.png","7.29%"],["PayTm.png","7.75%"]
];
const banksMid = [
  ["HSBC.png","7.00%"],["BOI.png","7.35%"],["PNB.png","7.50%"],["Union.png","6.85%"],
  ["Karur.png","7.03%"],["Baroda.webp","7.10%"],["Mahindra.png","7.00%"],
  ["South%20Indian.png","7.20%"],["SBM.png","7.75%"],["Karnataka.png","6.75%"],
  ["TMB.png","7.55%"],["IDFC.png","6.75%"],["Federal.png","7.35%"],["LIC.png","7.85%"],
  ["Canara.png","7.40%"],["Indian.png","7.10%"],["Induslnd.png","7.75%"],["DBS.png","7.15%"]
];
function bankChip(l, r){
  return `<div class="bank-chip"><div class="logo-wrap"><img loading="lazy" src="${BANK_BASE}${l}" alt=""></div><span class="rate">${r}</span></div>`;
}
function fillBanks(id, arr){
  const el = document.getElementById(id);
  if(!el) return;
  const html = arr.map(x => bankChip(x[0], x[1])).join('');
  el.innerHTML = html + html; // duplicate for seamless loop
}
window.SM_BANKS = { top: banksTop, mid: banksMid };
fillBanks('rowTop', banksTop);
fillBanks('rowA', banksTop);
fillBanks('rowB', banksMid);
fillBanks('rowC', banksTop.slice().reverse());

// ---- FD sub-category tabs + swipeable bank cards (fd.html) ----
const fdBanks = [
  {name:"Unity SF Bank",   logo:"Unity.png",      rate:"8.50%", tenure:"501D",     tags:["high","instant","monthly"], web:false},
  {name:"Shivalik SF Bank",logo:"Shivalik.png",   rate:"8.50%", tenure:"2Y",       tags:["high","instant"],           web:false},
  {name:"Suryoday SF Bank",logo:"Suryoday.png",   rate:"8.40%", tenure:"2Y 6M",    tags:["high","instant","monthly"], web:true},
  {name:"Ujjivan SF Bank", logo:"Ujjivan.png",    rate:"8.30%", tenure:"18M",      tags:["high","monthly"],           web:false},
  {name:"Shriram Finance", logo:"Shriram.png",    rate:"8.19%", tenure:"5Y",       tags:["high","monthly"],           web:true},
  {name:"Utkarsh SF Bank", logo:"UtkarshNew.webp",rate:"8.15%", tenure:"1Y 301D",  tags:["high","short"],             web:false},
  {name:"AU SF Bank",      logo:"AU.webp",        rate:"7.90%", tenure:"2Y",       tags:["short","instant"],          web:false},
  {name:"Bajaj Finance",   logo:"Bajaj.png",      rate:"7.75%", tenure:"3Y",       tags:["short","monthly"],          web:false}
];
const fdTabsDef = [
  {key:"high",    label:"High returns"},
  {key:"short",   label:"Short term FDs"},
  {key:"instant", label:"Instant Withdrawal"},
  {key:"monthly", label:"Monthly Payouts"},
  {key:"all",     label:"All FDs"}
];
(function(){
  const cardsEl = document.getElementById('bankCards');
  const tabsEl  = document.getElementById('fdTabs');
  if(!cardsEl || !tabsEl) return;
  let active = "high";
  function render(){
    const list = fdBanks
      .filter(b => active === "all" ? true : b.tags.includes(active))
      .sort((a,b) => (b.web ? 1 : 0) - (a.web ? 1 : 0)); // web-payment banks first
    cardsEl.innerHTML = list.map(b => {
      const cta = b.web ? 'Book now' : 'Book on App';
      const chip = b.web ? '' : '<span class="bank-appchip">App only</span>';
      return `
      <div class="bankcard">
        <div class="bc-top">
          <div class="bname-wrap"><span class="bname">${b.name}</span>${chip}</div>
          <div class="blogo"><img loading="lazy" src="${BANK_BASE}${b.logo}" alt=""></div>
        </div>
        <hr class="bc-div">
        <div class="bc-bottom">
          <span class="tenure">${b.tenure}</span>
          <span class="brate">${b.rate}<small>P.A.</small></span>
          <button type="button" class="bbook" ${b.web ? 'data-lead-open' : 'data-book-app'}>${cta}</button>
        </div>
      </div>`;
    }).join('');
  }
  tabsEl.innerHTML = fdTabsDef.map(t =>
    `<button class="fdtab${t.key===active?' active':''}" data-key="${t.key}">${t.label}</button>`).join('');
  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.fdtab');
    if(!btn) return;
    active = btn.dataset.key;
    tabsEl.querySelectorAll('.fdtab').forEach(b => b.classList.toggle('active', b.dataset.key === active));
    render();
  });
  render();
})();

// ---- Testimonials ----
const AV = "https://assets.stablemoney.in/web-frontend/website/testimonials-users-images/";
const testis = [
  ["Ravi Shankar Dwivedi","@oye_rsd", AV+"twitter/ravi-shankar.jpg","Since last 9 months of investing, I had never thought about doing FD. Two reasons: lower returns in most banks and offline process."],
  ["Sachin Sachdeva","@sac_sachdeva", AV+"twitter/sachin.jpg","Thank you @StableMoney_ — the smoothest FD booking I've done."],
  ["Vikash Kumar","@vikash_khola", AV+"twitter/vikash-kumar.jpg","@StableMoney_ in banking history a unique revolution. Happy to invest. Thanks for a unique platform for our income growth."],
  ["Megham Garg","LinkedIn", AV+"linkedin/megham-garg.jpg","FDs: the tortoise in our financial race. With the Stable Money app, the tortoise just got some rocket boots."],
  ["Roshan Sonaje","LinkedIn", AV+"linkedin/roshan-sonaje.jpg","StableMoney: The Smooth Journey to Great Returns."],
  ["Alan S. Castelino","LinkedIn", AV+"linkedin/Alan.jpg","Just tried Stablemoney App for a FD investment — really simple and easy to book FDs."],
  ["Prateek Desai","LinkedIn", AV+"linkedin/pratik-desai.jpg","A fixed deposit is a safe, secure option with decent returns and flexibility, and rates are nearly 5-yr high."],
  ["Aditya Behere","LinkedIn", AV+"linkedin/aditya-behere.jpg","Just tried out stablemoney.in — extremely well built."]
];
function tcard(n, h, img, body){
  return `<div class="tcard"><div class="head"><div class="who"><img loading="lazy" src="${img}" alt=""><div><div class="nm">${n}</div><div class="hn">${h}</div></div></div><span class="ic">&#128172;</span></div><div class="body">${body}</div></div>`;
}
function fillT(id, arr){
  const el = document.getElementById(id);
  if(!el) return;
  const html = arr.map(t => tcard(t[0],t[1],t[2],t[3])).join('');
  el.innerHTML = html + html;
}
fillT('testiA', testis);
fillT('testiB', testis.slice().reverse());

// ---- Live "total FD" counter ----
(function(){
  const el = document.getElementById('totalFd');
  if(!el) return;
  let base = 8385524900;
  setInterval(() => {
    base += Math.floor(Math.random()*900)+100;
    el.textContent = '₹ ' + base.toLocaleString('en-IN');
  }, 2500);
})();

// ---- Live "FD booked in <city>" pill ----
(function(){
  const el = document.getElementById('bookedCity');
  if(!el) return;
  const cities = ["Niz-Bahjani","Bengaluru","Pune","Guwahati","Kochi","Indore","Jaipur",
    "Lucknow","Surat","Nagpur","Coimbatore","Bhubaneswar","Patna","Ludhiana","Vijayawada",
    "Thrissur","Dehradun","Raipur","Mysuru","Siliguri"];
  const pill = el.closest('.booked-pill');
  setInterval(() => {
    if(pill) pill.style.opacity = '0';
    setTimeout(() => {
      el.textContent = cities[Math.floor(Math.random()*cities.length)];
      if(pill) pill.style.opacity = '1';
    }, 300);
  }, 2600);
})();

// ---- "Book on App" → store redirect on mobile, QR to download on desktop ----
(function(){
  const APP_LINK = 'https://stablemoney.onelink.me/rkWL/g4r5bggf'; // OneLink auto-routes to Play/App Store
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 820;
  let overlay;
  function build(){
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="modal qr-modal" role="dialog" aria-modal="true" aria-label="Download the app">
        <button class="modal-close" data-qr-close aria-label="Close">&times;</button>
        <h3 class="modal-title">Book on the <span class="gradient-text">Stable&nbsp;Money app</span></h3>
        <p class="modal-sub">Scan to download and finish booking in the app.</p>
        <img class="qr-img" alt="Scan to download Stable Money" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(APP_LINK)}">
        <div class="qr-badges">
          <a href="${APP_LINK}" target="_blank" rel="noreferrer"><img src="https://assets.stablemoney.in/kbc/playstore.webp" alt="Google Play"></a>
          <a href="${APP_LINK}" target="_blank" rel="noreferrer"><img src="https://assets.stablemoney.in/kbc/appstore.webp" alt="App Store"></a>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if(e.target === overlay || e.target.closest('[data-qr-close]')) close(); });
  }
  function open(){ if(!overlay) build(); overlay.hidden = false; document.body.style.overflow = 'hidden'; }
  function close(){ if(overlay){ overlay.hidden = true; document.body.style.overflow = ''; } }
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && overlay && !overlay.hidden) close(); });
  document.addEventListener('click', e => {
    if(e.target.closest('[data-book-app]')){
      if(isMobile) window.location.href = APP_LINK; else open();
    }
  });
})();

// ---- Lead capture modal (any page with [data-lead-open]) ----
(function(){
  const modal = document.getElementById('leadModal');
  if(!modal) return;
  const form   = document.getElementById('leadForm');
  const thanks = document.getElementById('leadThanks');
  const errEl  = document.getElementById('ldErr');

  function open(){
    form.hidden = false; thanks.hidden = true; errEl.textContent = '';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    try{ sessionStorage.setItem('sm_lead_shown','1'); }catch(e){}
    const n = document.getElementById('ldPhone'); if(n) setTimeout(()=>n.focus(),50);
  }
  function close(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // delegated so dynamically-rendered triggers (bank cards) also work
  document.addEventListener('click', e => { if(e.target.closest('[data-lead-open]')) open(); });
  modal.querySelectorAll('[data-lead-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if(e.target === modal) close(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !modal.hidden) close(); });

  const submit = document.getElementById('leadSubmit');
  if(submit) submit.addEventListener('click', () => {
    const phone = (document.getElementById('ldPhone').value || '').replace(/\D/g,'');
    if(phone.length !== 10){ errEl.textContent = 'Please enter a valid 10-digit mobile number.'; return; }
    errEl.textContent = '';
    // Client-side only — trigger your OTP send + verification here (wire to your API later).
    form.hidden = true; thanks.hidden = false;
  });

  // Auto-open the lead form once, ~10s after landing (per browser session)
  let alreadyShown = false;
  try{ alreadyShown = sessionStorage.getItem('sm_lead_shown') === '1'; }catch(e){}
  if(!alreadyShown){
    setTimeout(() => {
      try{ if(sessionStorage.getItem('sm_lead_shown') === '1') return; }catch(e){}
      if(modal.hidden) open();
    }, 10000);
  }
})();

// ---- FD returns calculator (fd.html) — slider based, quarterly compounding ----
(function(){
  const amt = document.getElementById('amt');
  if(!amt) return;
  const ten = document.getElementById('ten');
  const rate = document.getElementById('rate');
  const amtLbl = document.getElementById('amtLbl');
  const tenLbl = document.getElementById('tenLbl');
  const rateLbl = document.getElementById('rateLbl');
  const outInt = document.getElementById('outInt');
  const outMat = document.getElementById('outMat');
  const bankSelect = document.getElementById('bankSelect');
  const manualWrap = document.getElementById('manualWrap');
  const bankWrap = document.getElementById('bankWrap');
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  let rateMode = 'manual';

  // populate bank dropdown from the shared fdBanks list (high → low)
  if(bankSelect && typeof fdBanks !== 'undefined'){
    [...fdBanks].map(b => ({n:b.name, r:parseFloat(b.rate)}))
      .sort((a,b) => b.r - a.r)
      .forEach(b => {
        const o = document.createElement('option');
        o.value = b.r; o.textContent = `${b.n} — ${b.r.toFixed(2)}% p.a.`;
        bankSelect.appendChild(o);
      });
  }
  const currentRate = () => rateMode === 'bank' ? +bankSelect.value : +rate.value;
  function calc(){
    const P = +amt.value, Y = +ten.value, R = currentRate()/100;
    const M = P * Math.pow(1 + R/4, 4*Y);
    amtLbl.textContent = inr(P);
    tenLbl.textContent = Y + (Y === 1 ? ' year' : ' years');
    rateLbl.textContent = currentRate().toFixed(2) + '%';
    outMat.textContent = inr(M);
    outInt.textContent = inr(M - P);
  }
  [amt, ten, rate, bankSelect].forEach(s => s && s.addEventListener('input', calc));
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      rateMode = btn.dataset.mode;
      manualWrap.style.display = rateMode === 'manual' ? 'block' : 'none';
      bankWrap.style.display   = rateMode === 'bank'   ? 'block' : 'none';
      calc();
    });
  });
  calc();
})();

// ---- RD sub-category tabs + horizontal bank cards (rd.html) ----
const rdBanks = [
  {name:"Unity SF Bank",   logo:"Unity.png",      rate:"7.90%", tenure:"12M", tags:["high","monthly"]},
  {name:"Suryoday SF Bank",logo:"Suryoday.png",   rate:"7.90%", tenure:"24M", tags:["high","monthly"]},
  {name:"Shriram Finance", logo:"Shriram.png",    rate:"7.85%", tenure:"36M", tags:["high","topup"]},
  {name:"Shivalik SF Bank",logo:"Shivalik.png",   rate:"7.85%", tenure:"18M", tags:["high"]},
  {name:"Ujjivan SF Bank", logo:"Ujjivan.png",    rate:"7.75%", tenure:"12M", tags:["high","short","monthly"]},
  {name:"Utkarsh SF Bank", logo:"UtkarshNew.webp",rate:"7.60%", tenure:"12M", tags:["short"]},
  {name:"AU SF Bank",      logo:"AU.webp",        rate:"7.50%", tenure:"24M", tags:["topup"]},
  {name:"Bajaj Finance",   logo:"Bajaj.png",      rate:"7.40%", tenure:"33M", tags:["short","topup"]}
];
const rdTabsDef = [
  {key:"high",  label:"High returns"},
  {key:"short", label:"Short term RDs"},
  {key:"topup", label:"Top-up allowed"},
  {key:"monthly", label:"Monthly Payouts"},
  {key:"all",   label:"All RDs"}
];
(function(){
  const cardsEl = document.getElementById('rdBankCards');
  const tabsEl  = document.getElementById('rdTabs');
  if(!cardsEl || !tabsEl) return;
  let active = "high";
  function render(){
    const list = rdBanks.filter(b => active === "all" ? true : b.tags.includes(active));
    cardsEl.innerHTML = list.map(b => `
      <div class="bankcard">
        <div class="bc-top">
          <span class="bname">${b.name}</span>
          <div class="blogo"><img loading="lazy" src="${BANK_BASE}${b.logo}" alt=""></div>
        </div>
        <hr class="bc-div">
        <div class="bc-bottom">
          <span class="tenure">${b.tenure}</span>
          <span class="brate">${b.rate}<small>P.A.</small></span>
          <span class="bbook">Start RD</span>
        </div>
      </div>`).join('');
  }
  tabsEl.innerHTML = rdTabsDef.map(t =>
    `<button class="fdtab${t.key===active?' active':''}" data-key="${t.key}">${t.label}</button>`).join('');
  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.fdtab');
    if(!btn) return;
    active = btn.dataset.key;
    tabsEl.querySelectorAll('.fdtab').forEach(b => b.classList.toggle('active', b.dataset.key === active));
    render();
  });
  render();
})();

// ---- RD returns calculator (rd.html) — monthly recurring, quarterly-style compounding ----
(function(){
  const amt = document.getElementById('rdAmt');
  if(!amt) return;
  const ten = document.getElementById('rdTen');
  const rate = document.getElementById('rdRate');
  const amtLbl = document.getElementById('rdAmtLbl');
  const tenLbl = document.getElementById('rdTenLbl');
  const rateLbl = document.getElementById('rdRateLbl');
  const outInt = document.getElementById('rdOutInt');
  const outMat = document.getElementById('rdOutMat');
  const bankSelect = document.getElementById('rdBankSelect');
  const rateMode = document.getElementById('rdRateMode');
  const manualWrap = document.getElementById('rdManualWrap');
  const bankWrap = document.getElementById('rdBankWrap');
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  let mode = 'manual';

  if(bankSelect && typeof rdBanks !== 'undefined'){
    [...rdBanks].map(b => ({n:b.name, r:parseFloat(b.rate)}))
      .sort((a,b) => b.r - a.r)
      .forEach(b => {
        const o = document.createElement('option');
        o.value = b.r; o.textContent = `${b.n} — ${b.r.toFixed(2)}% p.a.`;
        bankSelect.appendChild(o);
      });
  }
  const currentRate = () => mode === 'bank' ? +bankSelect.value : +rate.value;
  function calc(){
    const P = +amt.value, Y = +ten.value, n = Y*12, i = currentRate()/100/12;
    // future value of a monthly recurring deposit (annuity-due)
    const M = P * ((Math.pow(1+i, n) - 1) / i) * (1+i);
    const invested = P * n;
    amtLbl.textContent = inr(P);
    tenLbl.textContent = Y + (Y === 1 ? ' year' : ' years');
    rateLbl.textContent = currentRate().toFixed(2) + '%';
    outMat.textContent = inr(M);
    outInt.textContent = inr(M - invested);
  }
  [amt, ten, rate, bankSelect].forEach(s => s && s.addEventListener('input', calc));
  if(rateMode) rateMode.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      rateMode.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      manualWrap.style.display = mode === 'manual' ? 'block' : 'none';
      bankWrap.style.display   = mode === 'bank'   ? 'block' : 'none';
      calc();
    });
  });
  calc();
})();
