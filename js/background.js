const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let mouse = { x: null, y: null, radius: 130 };

const isMobile = window.matchMedia("(max-width: 768px)").matches;

const particleCount = isMobile ? 35 : 75;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    createParticles();
}

function getThemeColors() {
    const theme = document.documentElement.getAttribute("data-theme");

    if (theme === "light") {
        return {
            particle: "21, 150, 106",
            line: "37, 99, 235"
        };
    }

    return {
        particle: "214, 180, 106",
        line: "214, 180, 106"
    };
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        this.size = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius && distance > 0) {
                const force = (mouse.radius - distance) / mouse.radius;

                this.x += (dx / distance) * force * 1.5;
                this.y += (dy / distance) * force * 1.5;
            }
        }
    }

    draw(color) {
        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(${color}, 0.65)`;
        ctx.fill();
    }
}

function createParticles() {
    particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles(color) {
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.13;

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);

                ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                ctx.lineWidth = 0.6;

                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    const colors = getThemeColors();

    particles.forEach(particle => {
        particle.update();
        particle.draw(colors.particle);
    });

    connectParticles(colors.line);

    requestAnimationFrame(animate);
}

window.addEventListener("mousemove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();