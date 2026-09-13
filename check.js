const http = require('http');
const { spawn } = require('child_process');
const child = spawn(process.execPath, ['backend/server.js'], { cwd: require('path').join(__dirname, '..'), env: { ...process.env, PORT: '3210' } });
let done = false;
function finish(code){ if(done) return; done=true; child.kill(); process.exit(code); }
setTimeout(()=>{
  const data = JSON.stringify({ message: 'Assalamualaikum siapa awak?' });
  const req = http.request({ hostname:'127.0.0.1', port:3210, path:'/api/chat', method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}, res=>{
    let body=''; res.on('data',c=>body+=c); res.on('end',()=>{ console.log(body); finish(res.statusCode===200 ? 0 : 1); });
  });
  req.on('error',e=>{ console.error(e); finish(1); });
  req.write(data); req.end();
}, 700);
setTimeout(()=>finish(1), 5000);
