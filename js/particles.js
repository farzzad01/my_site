// small lightweight particles effect (canvas)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=> { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

const particles = [];
const count = Math.floor((W*H)/90000); // scale with screen
for(let i=0;i<count;i++){
  particles.push({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.6 + 0.4,
    vx: (Math.random()-0.5)*0.2,
    vy: -0.15 - Math.random()*0.25,
    alpha: 0.08 + Math.random()*0.12
  });
}

function draw(){
  ctx.clearRect(0,0,W,H);
  for(let p of particles){
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,40,40,'+p.alpha+')';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if(p.y < -10) { p.y = H + 10; p.x = Math.random()*W; }
    if(p.x < -20) p.x = W + 20;
    if(p.x > W + 20) p.x = -20;
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
