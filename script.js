/* ==========================================================
   COSMIC ODYSSEY // ULTRA MODERN JAVASCRIPT ENGINE
   File: script.js
   Fitur:
   1. Canvas Starfield 3D & Nebula Glow (Paralaks & Meteor)
   2. Scroll Progress Laser Indicator
   3. Spotlight Card Hover Effect (Vercel / Linear Style)
   4. Stardust Cursor Tracker
   5. Dynamic Typewriter Effect
   6. 3D Hologram Tilt Interaction
   7. Web Audio API Ambient Synthesizer
   8. Telemetry Number Counters
   9. Project Filters & Mission Detail Modal
   10. Terminal Transmission Form Console
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       1. SCROLL PROGRESS LASER INDICATOR
       ====================================================== */
    const scrollProgress = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = (currentScroll / totalHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
    });


    /* ======================================================
       2. CANVAS STARFIELD 3D & NEBULA PARTICLES
       ====================================================== */
    const canvas = document.getElementById("space-canvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    window.addEventListener("mousemove", (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // Bintang dengan Kedalaman 3D (Z-axis Layer)
    const stars = [];
    const starCount = Math.min(width > 768 ? 220 : 90, 260);

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 2 + 0.5, // Depth layer
            radius: Math.random() * 1.6 + 0.4,
            baseAlpha: Math.random() * 0.7 + 0.2,
            alpha: Math.random() * 0.7 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            color: Math.random() > 0.4 ? "#00f2fe" : (Math.random() > 0.5 ? "#f355da" : "#ffffff")
        });
    }

    // Meteor / Bintang Jatuh
    const meteors = [];

    function triggerMeteor() {
        meteors.push({
            x: Math.random() * width * 0.9,
            y: Math.random() * height * 0.35,
            len: Math.random() * 100 + 60,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4,
            opacity: 1
        });
    }

    setInterval(() => {
        if (Math.random() > 0.3) triggerMeteor();
    }, 4000);

    function renderStarfield() {
        ctx.clearRect(0, 0, width, height);

        // Interpolasi posisi mouse halus (smooth lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Render Bintang
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // Kelap-kelip
            s.alpha += s.twinkleSpeed;
            if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

            // Paralaks Efek Kursor
            const parallaxX = (mouse.x - width / 2) * (0.02 * s.z);
            const parallaxY = (mouse.y - height / 2) * (0.02 * s.z);

            let renderX = s.x + parallaxX;
            let renderY = s.y + parallaxY;

            // Efek Gravitasi Lembut Jika Mouse Sangat Dekat
            const dx = mouse.x - renderX;
            const dy = mouse.y - renderY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                s.x += (dx / dist) * 0.5;
                s.y += (dy / dist) * 0.5;
            } else {
                s.x += s.vx;
                s.y += s.vy;
            }

            // Loop keluar layar
            if (s.x < 0) s.x = width;
            if (s.x > width) s.x = 0;
            if (s.y < 0) s.y = height;
            if (s.y > height) s.y = 0;

            // Render Dot
            ctx.beginPath();
            ctx.arc(renderX, renderY, s.radius * s.z * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
            ctx.shadowBlur = 6;
            ctx.shadowColor = s.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Garis Rasi Bintang Halus
            for (let j = i + 1; j < stars.length; j++) {
                const s2 = stars[j];
                const distance = Math.hypot(renderX - (s2.x + parallaxX), renderY - (s2.y + parallaxY));
                if (distance < 85) {
                    ctx.beginPath();
                    ctx.moveTo(renderX, renderY);
                    ctx.lineTo(s2.x + parallaxX, s2.y + parallaxY);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${0.1 - distance / 85 * 0.1})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Render Meteor
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            const endX = m.x + Math.cos(m.angle) * m.len;
            const endY = m.y + Math.sin(m.angle) * m.len;

            const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
            grad.addColorStop(0, "rgba(255, 255, 255, 0)");
            grad.addColorStop(1, `rgba(0, 242, 254, ${m.opacity})`);

            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00f2fe";
            ctx.stroke();
            ctx.shadowBlur = 0;

            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.opacity -= 0.022;

            if (m.opacity <= 0 || m.x > width || m.y > height) {
                meteors.splice(i, 1);
            }
        }

        requestAnimationFrame(renderStarfield);
    }
    renderStarfield();


    /* ======================================================
       3. SPOTLIGHT CARD EFFECT (VERCEL / LINEAR STYLE)
       ====================================================== */
    const spotlightCards = document.querySelectorAll(".spotlight-card");

    spotlightCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `radial-gradient(450px circle at ${x}px ${y}px, rgba(0, 242, 254, 0.08), rgba(13, 10, 38, 0.65) 60%)`;
            card.style.borderColor = "rgba(0, 242, 254, 0.35)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.background = "var(--bg-card)";
            card.style.borderColor = "var(--border-glass)";
        });
    });


    /* ======================================================
       4. KURSOR CAHAYA JEJAK BINTANG
       ====================================================== */
    const cursorGlow = document.getElementById("cursor-glow");
    window.addEventListener("mousemove", (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
        }
    });


    /* ======================================================
       5. DYNAMIC TYPEWRITER EFFECT
       ====================================================== */
    const typewriterElem = document.getElementById("typewriter");
    const roles = [
        "Software Engineer Explorer 🚀",
        "Frontend Web Specialist 🌌",
        "Siswa RPL SMKN 1 Pasuruan 💻",
        "Creative Space UI Designer 🎨"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function runTypewriter() {
        if (!typewriterElem) return;
        const current = roles[roleIdx];

        if (isDeleting) {
            typewriterElem.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 45;
        } else {
            typewriterElem.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 100;
        }

        if (!isDeleting && charIdx === current.length) {
            isDeleting = true;
            typeDelay = 2000;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeDelay = 350;
        }

        setTimeout(runTypewriter, typeDelay);
    }
    runTypewriter();


    /* ======================================================
       6. 3D HOLOGRAM TILT CARD INTERACTION
       ====================================================== */
    const stage = document.getElementById("hologram-stage");
    if (stage) {
        stage.addEventListener("mousemove", (e) => {
            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

            stage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        stage.addEventListener("mouseleave", () => {
            stage.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    }


    /* ======================================================
       7. WEB AUDIO API SYNTHESIZER (AUDIO KOSMIK TANPA MP3)
       ====================================================== */
    let audioCtx = null;
    let audioEnabled = false;
    const audioToggle = document.getElementById("audio-toggle");

    function playTone(freq = 520, type = "sine", duration = 0.15) {
        if (!audioEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (err) {
            console.error("Audio error:", err);
        }
    }

    if (audioToggle) {
        audioToggle.addEventListener("click", () => {
            audioEnabled = !audioEnabled;
            if (audioEnabled) {
                audioToggle.classList.add("active");
                audioToggle.querySelector(".audio-label").textContent = "AUDIO: ON";
                playTone(880, "sine", 0.25);
            } else {
                audioToggle.classList.remove("active");
                audioToggle.querySelector(".audio-label").textContent = "AUDIO: OFF";
            }
        });
    }

    // Suara saat tombol atau menu diklik
    document.querySelectorAll(".btn-stellar, .nav-item, .filter-pill, .btn-inspect").forEach(btn => {
        btn.addEventListener("click", () => {
            playTone(620, "triangle", 0.12);
        });
    });


    /* ======================================================
       8. TELEMETRY NUMBER COUNTER
       ====================================================== */
    const telemetryNums = document.querySelectorAll(".telemetry-num");
    let hasCounted = false;

    function countUp() {
        if (hasCounted) return;
        telemetryNums.forEach(num => {
            const target = +num.getAttribute("data-target");
            let curr = 0;
            const inc = Math.ceil(target / 45);

            const timer = setInterval(() => {
                curr += inc;
                if (curr >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = curr;
                }
            }, 30);
        });
        hasCounted = true;
    }
    countUp();


    /* ======================================================
       9. FILTER KATEGORI PROJEK
       ====================================================== */
    const filterPills = document.querySelectorAll(".filter-pill");
    const showcaseCards = document.querySelectorAll(".showcase-card");

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const filterVal = pill.getAttribute("data-filter");

            showcaseCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterVal === "all" || category === filterVal) {
                    card.style.display = "flex";
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });


    /* ======================================================
       10. DETAIL MODAL MISI PROJEK
       ====================================================== */
    const modal = document.getElementById("project-modal");
    const modalTag = document.getElementById("modal-tag");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalTechList = document.getElementById("modal-tech-list");
    const modalClose = document.getElementById("modal-close");
    const btnModalOk = document.getElementById("btn-modal-ok");

    const projectDatabase = {
        proj1: {
            tag: "SEKTOR 01 // NEON FRONTEND",
            title: "Cyberpunk Neon Biodata",
            desc: "Eksplorasi pembuatan website biodata dengan nuansa cyberpunk gelap, memanfaatkan text-shadow neon berulang, animasi translate melayang, dan struktur garis hierarki tree view.",
            tech: ["HTML5", "CSS3 Keyframes", "Cyberpunk Glow", "Tree View"]
        },
        proj2: {
            tag: "SEKTOR 02 // WEB KOMUNITAS",
            title: "Portal Warga RT 04 Sukamaju",
            desc: "Pengembangan platform digital publik bertema terang segar yang menyajikan struktur keorganisasian rukun tetangga, Karang Taruna, kalender kegiatan bulanan, dan formulir pengajuan surat pengantar.",
            tech: ["HTML5 Semantik", "Light Theme CSS", "Responsive Grid", "Form Aspirasi"]
        },
        proj3: {
            tag: "SEKTOR 03 // JAVASCRIPT DOM",
            title: "Dual-Theme Switcher Engine",
            desc: "Penerapan logika JavaScript interaktif untuk membuat sistem perpindahan tema Gelap dan Terang secara dinamis dengan penyimpanan preferensi di localStorage browser serta layout kartu flex seimbang.",
            tech: ["JavaScript DOM", "LocalStorage", "CSS Variables", "Flexbox"]
        },
        proj4: {
            tag: "SEKTOR 04 // ULTIMATE COSMOS",
            title: "Cosmic Odyssey Portfolio",
            desc: "Website portofolio galaksi mutakhir yang dilengkapi simulasi partikel bintang 3D canvas, efek suara kosmik Web Audio API, Bento Grid modern, kartu 3D hologram, dan konsol terminal futuristik.",
            tech: ["HTML5 Canvas 2D", "Web Audio API", "Bento Grid", "Interactive JS"]
        }
    };

    document.querySelectorAll(".btn-inspect").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-modal");
            const data = projectDatabase[id];
            if (data) {
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;

                modalTechList.innerHTML = "";
                data.tech.forEach(t => {
                    const span = document.createElement("span");
                    span.textContent = t;
                    modalTechList.appendChild(span);
                });

                modal.classList.add("active");
                playTone(720, "sine", 0.2);
            }
        });
    });

    function hideModal() {
        if (modal) modal.classList.remove("active");
    }

    if (modalClose) modalClose.addEventListener("click", hideModal);
    if (btnModalOk) btnModalOk.addEventListener("click", hideModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) hideModal();
        });
    }


    /* ======================================================
       11. FORM TRANSMISI TERMINAL
       ====================================================== */
    const cosmicForm = document.getElementById("cosmic-form");
    const transmissionResult = document.getElementById("transmission-result");
    const btnTransmit = document.getElementById("btn-transmit");

    if (cosmicForm) {
        cosmicForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("caller-name").value;
            const freq = document.getElementById("caller-freq").value;

            btnTransmit.innerHTML = "<span>MEMANCARKAN SINYAL KE ORBIT... 📡</span>";
            btnTransmit.style.opacity = "0.7";

            playTone(1100, "sawtooth", 0.35);

            setTimeout(() => {
                btnTransmit.innerHTML = "<span>PANCARKAN TRANSMISI SEKARANG 📡</span>";
                btnTransmit.style.opacity = "1";

                transmissionResult.className = "transmission-alert active";
                transmissionResult.innerHTML = `
                    <strong>[TRANSMISI TELEMETRI BERHASIL!]</strong><br>
                    &gt; Sinyal Pengirim: <strong>${name}</strong><br>
                    &gt; Frekuensi Balasan: <strong>${freq}</strong><br>
                    &gt; Status: Data telah dicatat di stasiun kendali bumi Pasuruan. Terima kasih atas transmisinya, Penjelajah!
                `;

                cosmicForm.reset();
                playTone(920, "sine", 0.2);
            }, 1200);
        });
    }

});
