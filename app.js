const chat = document.querySelector('#chat');
const form = document.querySelector('#form');
const input = document.querySelector('#message');
const statusEl = document.querySelector('#status');
const clearBtn = document.querySelector('#clear');
let history = JSON.parse(localStorage.getItem('yunus-ai-history') || '[]');

function save(){ localStorage.setItem('yunus-ai-history', JSON.stringify(history.slice(-50))); }
function el(tag, cls, text){ const node=document.createElement(tag); node.className=cls; node.textContent=text; return node; }
function add(role, text){
  const box = el('div', `msg ${role}`, '');
  box.appendChild(el('div','meta', role === 'user' ? 'Anda' : 'Yunus AI'));
  box.appendChild(document.createTextNode(text));
  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;
}
function render(){ chat.innerHTML=''; if(!history.length){ add('ai','Assalamualaikum. Saya Yunus AI. Tanya apa sahaja dalam Bahasa Melayu — saya sedia membantu.'); } history.forEach(m=>add(m.role,m.content)); }
async function health(){
  try{ const r=await fetch('/api/health'); const j=await r.json(); statusEl.textContent = j.ok ? 'Online • ' + j.mode : 'Error'; statusEl.className='status ok'; }
  catch{ statusEl.textContent='Offline'; statusEl.className='status bad'; }
}
async function send(message){
  history.push({role:'user',content:message}); save(); add('user', message);
  const thinking = el('div','msg ai',''); thinking.appendChild(el('div','meta','Yunus AI')); thinking.appendChild(document.createTextNode('Sedang berfikir...')); chat.appendChild(thinking); chat.scrollTop=chat.scrollHeight;
  try{
    const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history})});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const contentType = r.headers.get('content-type') || '';
    if(!contentType.includes('application/json')) throw new Error('Respons tidak sah daripada pelayan');
    const j = await r.json();
    thinking.remove();
    if(!j.ok) throw new Error(j.error || 'Ralat tidak diketahui');
    history.push({role:'ai',content:j.reply}); save(); add('ai', j.reply);
  }catch(e){ thinking.remove(); add('ai','Maaf, berlaku ralat: '+e.message); }
}
form.addEventListener('submit', e=>{ e.preventDefault(); const msg=input.value.trim(); if(!msg) return; input.value=''; input.style.height='46px'; send(msg); });
input.addEventListener('input', ()=>{ input.style.height='46px'; input.style.height=Math.min(input.scrollHeight,160)+'px'; });
input.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); form.requestSubmit(); } });
clearBtn.addEventListener('click', ()=>{ history=[]; save(); render(); });
if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').catch(()=>{}); }
render(); health();
