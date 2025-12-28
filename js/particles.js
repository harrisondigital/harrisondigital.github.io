// Fix viewport height for mobile browsers
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setViewportHeight);
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    function toggleMenu() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      const isClickInsideNav = event.target.closest('.nav-container');
      if (!isClickInsideNav && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
});

// Particle system for hero section
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = this.calculateParticleCount();
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
    this.animate();
    this.setupEventListeners();
  }

  calculateParticleCount() {
    const width = window.innerWidth;
    // Scale particles based on screen width

    if (width < 768) {
      return 60;
    } else if (width < 1280) {
      return 120;
    } else if (width < 1920) {
      return 180;
    } else {
      return 240;
    }
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    // Use window dimensions directly for mobile compatibility
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    // Set canvas drawing buffer size
    this.canvas.width = width;
    this.canvas.height = height;

    // Ensure canvas CSS matches
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    // Recalculate particle count on resize
    const newParticleCount = this.calculateParticleCount();
    if (newParticleCount !== this.particleCount) {
      this.particleCount = newParticleCount;
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
      });
    }
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = 'rgba(100, 108, 255, 0.5)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx.strokeStyle = `rgba(100, 108, 255, ${0.5 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      });
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges and clamp position
      if (particle.x < particle.size || particle.x > this.canvas.width - particle.size) {
        particle.vx *= -1;
        particle.x = Math.max(particle.size, Math.min(this.canvas.width - particle.size, particle.x));
      }
      if (particle.y < particle.size || particle.y > this.canvas.height - particle.size) {
        particle.vy *= -1;
        particle.y = Math.max(particle.size, Math.min(this.canvas.height - particle.size, particle.y));
      }

      // Mouse repulsion
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        }
      }

      // Velocity damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Ensure minimum velocity
      if (Math.abs(particle.vx) < 0.5) particle.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(particle.vy) < 0.5) particle.vy += (Math.random() - 0.5) * 0.1;
    });
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }

  setupEventListeners() {
    const handleResize = () => {
      this.resizeCanvas();
      this.createParticles();
    };

    window.addEventListener('resize', handleResize);

    // Better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.canvas.addEventListener('click', () => {
      // Limit total particle count to prevent performance issues
      if (this.particles.length < 200) {
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: this.mouse.x || Math.random() * this.canvas.width,
            y: this.mouse.y || Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 3 + 1,
          });
        }
      }
    });
  }
}

// Initialize particle system when DOM is ready
function initParticles() {
  // Wait for layout to be fully calculated before initializing
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      new ParticleSystem('particles');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticles);
} else {
  initParticles();
}
