// Simple clean particles effect
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', () => {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  initParticles();
});

const particles = [];
let time = 0;

// Initialize simple particles
function initParticles() {
  particles.length = 0;
  const count = Math.floor((W * H) / 90000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.15 - Math.random() * 0.25,
      alpha: 0.08 + Math.random() * 0.12,
      pulseSpeed: 0.02 + Math.random() * 0.03
    });
  }
}

// Draw simple particles with subtle glow
function drawParticles() {
  for (let p of particles) {
    const pulse = Math.sin(time * p.pulseSpeed) * 0.2 + 0.8;
    const currentAlpha = p.alpha * pulse;

    // Simple particle with very subtle glow
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,45,45,${currentAlpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Update position
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
  }
}

// Main draw function
function draw() {
  ctx.clearRect(0, 0, W, H);
  time++;

  drawParticles();

  requestAnimationFrame(draw);
}

// Initialize and start
initParticles();
requestAnimationFrame(draw);
