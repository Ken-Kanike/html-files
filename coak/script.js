/**
 * Coca-Cola Real Magic - Precision Physics Engine & UI Controller
 * Section-Relative Coordinates (100% collision-free placement), Scroll Reveal, Canvas FX, Audio
 */

document.addEventListener('DOMContentLoaded', () => {
    initPrecisionBottlePhysics();
    initCanvasParticles();
    initAccordions();
    initFlavorSwitcher();
    initChillSlider();
    initPersonalizeStudio();
    initModalsAndDrawers();
    initAudioEngine();
    initCounters();
    initCardParallax();
    initFranchiseEstimator();
    initScrollReveals();
});

/* ===================================================
   1. PRECISION SECTION-DRIVEN BOTTLE PHYSICS
   =================================================== */
function initPrecisionBottlePhysics() {
    const stage = document.getElementById('coke-bottle-stage');
    const bottleImg = document.getElementById('main-coke-bottle');
    const heroBgArch = document.getElementById('center-bg');
    if (!stage || !bottleImg) return;

    let targetX = 0;
    let targetY = 0;
    let targetRotate = 0;
    let targetScale = 1;
    let targetOpacity = 1;

    let currentX = 0;
    let currentY = 0;
    let currentRotate = 0;
    let currentScale = 1;
    let currentOpacity = 1;

    const sections = [
        { id: 'hero', getPose: () => ({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }) },
        { id: 'craft-section', getPose: () => ({ x: -Math.min(window.innerWidth * 0.24, 340), y: 0, rotate: -6, scale: 1.05, opacity: 1 }) },
        { id: 'flavors-section', getPose: () => ({ x: Math.min(window.innerWidth * 0.24, 340), y: 0, rotate: 6, scale: 1.05, opacity: 1 }) },
        { id: 'chill-section', getPose: () => ({ x: -Math.min(window.innerWidth * 0.24, 340), y: 0, rotate: -5, scale: 1.05, opacity: 1 }) },
        { id: 'studio-section', getPose: () => ({ x: Math.min(window.innerWidth * 0.24, 340), y: 0, rotate: 5, scale: 1.05, opacity: 1 }) },
        { id: 'franchise-section', getPose: () => ({ x: -Math.min(window.innerWidth * 0.24, 340), y: 0, rotate: -5, scale: 1.05, opacity: 1 }) },
        { id: 'impact-section', getPose: () => ({ x: 0, y: 30, rotate: 0, scale: 0.65, opacity: 0.22 }) },
        { id: 'cta-section', getPose: () => ({ x: 0, y: 80, rotate: 0, scale: 0.6, opacity: 0.15 }) }
    ];

    function updatePhysicsTarget() {
        const vh = window.innerHeight;
        const isMobile = window.innerWidth <= 900;

        if (isMobile) {
            targetX = 0;
            targetY = 0;
            targetRotate = Math.sin(Date.now() * 0.001) * 2;
            targetScale = 0.72;
            targetOpacity = 0.28;
            return;
        }

        const viewMid = vh / 2;
        let activeIdx = 0;
        let blendFactor = 0;

        for (let i = 0; i < sections.length; i++) {
            const el = document.getElementById(sections[i].id);
            if (!el) continue;
            const rect = el.getBoundingClientRect();

            if (rect.top <= viewMid && rect.bottom >= viewMid) {
                activeIdx = i;
                const sectionH = rect.height || 1;
                const distFromTop = viewMid - rect.top;
                blendFactor = Math.min(Math.max(distFromTop / sectionH, 0), 1);
                break;
            } else if (rect.top > viewMid && i > 0 && activeIdx === 0) {
                activeIdx = Math.max(0, i - 1);
                blendFactor = 0.5;
            }
        }

        const currSec = sections[activeIdx];
        const nextSec = sections[Math.min(activeIdx + 1, sections.length - 1)];

        const poseA = currSec.getPose();
        const poseB = nextSec.getPose();

        // Smooth cosine interpolation
        const easeT = 0.5 - 0.5 * Math.cos(blendFactor * Math.PI);

        targetX = poseA.x + (poseB.x - poseA.x) * easeT;
        targetY = poseA.y + (poseB.y - poseA.y) * easeT;
        targetRotate = poseA.rotate + (poseB.rotate - poseA.rotate) * easeT;
        targetScale = poseA.scale + (poseB.scale - poseA.scale) * easeT;
        targetOpacity = poseA.opacity + (poseB.opacity - poseA.opacity) * easeT;

        if (heroBgArch && activeIdx === 0) {
            heroBgArch.style.transform = `scale(${1 - blendFactor * 0.15}) translateY(${blendFactor * 25}px)`;
            heroBgArch.style.opacity = `${1 - blendFactor * 0.85}`;
        }
    }

    window.addEventListener('scroll', updatePhysicsTarget, { passive: true });
    window.addEventListener('resize', updatePhysicsTarget);
    updatePhysicsTarget();

    function renderLoop() {
        const time = Date.now() * 0.0025;
        const idleBob = Math.sin(time) * 5;
        const idleTilt = Math.cos(time * 0.8) * 1.2;

        currentX += (targetX - currentX) * 0.085;
        currentY += (targetY - currentY) * 0.085;
        currentRotate += (targetRotate + idleTilt - currentRotate) * 0.085;
        currentScale += (targetScale - currentScale) * 0.085;
        currentOpacity += (targetOpacity - currentOpacity) * 0.085;

        stage.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY + idleBob}px)) rotate(${currentRotate}deg) scale(${currentScale})`;
        stage.style.opacity = currentOpacity;

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

/* ===================================================
   2. FIZZING PARTICLES & FLOATING ICE CANVAS
   =================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('fizz-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1.3 + 0.4,
            opacity: Math.random() * 0.5 + 0.15,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.035 + 0.01,
            isIce: Math.random() > 0.88,
            size: Math.random() * 12 + 6,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.015
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let p of particles) {
            p.y -= p.speed;
            p.wobble += p.wobbleSpeed;
            const wobbleX = p.x + Math.sin(p.wobble) * 10;

            if (p.y < -30) {
                p.y = height + 20;
                p.x = Math.random() * width;
            }

            if (p.isIce) {
                ctx.save();
                ctx.translate(wobbleX, p.y);
                p.rot += p.rotSpeed;
                ctx.rotate(p.rot);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.35})`;
                ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(wobbleX, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 45, 55, ${p.opacity})`;
                ctx.shadowColor = 'rgba(255, 30, 39, 0.7)';
                ctx.shadowBlur = 6;
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* ===================================================
   3. SCROLL REVEAL OBSERVER
   =================================================== */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.tilt-card, .section-title, .glass-feature-card, .stat-card');
    revealElements.forEach(el => el.classList.add('reveal-item'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

/* ===================================================
   4. ACCORDIONS
   =================================================== */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            const parentGroup = item.parentElement;
            parentGroup.querySelectorAll('.accordion-item').forEach(other => {
                other.classList.remove('active');
                const icon = other.querySelector('.accordion-icon i');
                if (icon) icon.className = 'ri-add-circle-line';
            });

            if (!isActive) {
                item.classList.add('active');
                const icon = header.querySelector('.accordion-icon i');
                if (icon) icon.className = 'ri-indeterminate-circle-line';
                playHissSound(0.15);
            }
        });
    });
}

/* ===================================================
   5. FLAVOR CUSTOMIZER & EDITIONS SWITCHER
   =================================================== */
const flavorData = {
    original: {
        name: 'Original Taste',
        subtitle: 'The timeless classic since 1886 with crisp effervescence and secret botanical notes.',
        tag: 'Iconic Classic',
        calories: '140 kcal',
        sugar: '39g',
        caffeine: '34mg',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(229, 9, 20, 0.4) 0%, transparent 60%)'
    },
    zero: {
        name: 'Zero Sugar',
        subtitle: 'Uncompromising classic Coke flavor crafted with zero sugar and zero calories.',
        tag: 'Zero Calories',
        calories: '0 kcal',
        sugar: '0g',
        caffeine: '34mg',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(100, 100, 100, 0.3) 0%, transparent 60%)'
    },
    cherry: {
        name: 'Cherry Splash',
        subtitle: 'A sweet burst of rich dark cherry fruit aroma blended into the original crisp formula.',
        tag: 'Fruit Fusion',
        calories: '150 kcal',
        sugar: '42g',
        caffeine: '34mg',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(194, 24, 91, 0.4) 0%, transparent 60%)'
    },
    vanilla: {
        name: 'Vanilla Dream',
        subtitle: 'Velvety smooth Madagascar vanilla notes combined with legendary cola zest.',
        tag: 'Silky Smooth',
        calories: '150 kcal',
        sugar: '42g',
        caffeine: '34mg',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(224, 169, 109, 0.35) 0%, transparent 60%)'
    }
};

function initFlavorSwitcher() {
    const flavorPills = document.querySelectorAll('.flavor-pill');
    const flavorCard = document.getElementById('active-flavor-details');
    const flavorSection = document.getElementById('flavors-section');

    if (!flavorPills.length || !flavorCard) return;

    flavorPills.forEach(pill => {
        pill.addEventListener('click', () => {
            flavorPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const flavorKey = pill.getAttribute('data-flavor');
            const data = flavorData[flavorKey] || flavorData.original;

            flavorCard.classList.add('fading');
            setTimeout(() => {
                document.getElementById('flavor-title').textContent = data.name;
                document.getElementById('flavor-subtitle').textContent = data.subtitle;
                document.getElementById('flavor-badge').textContent = data.tag;
                document.getElementById('flavor-cals').textContent = data.calories;
                document.getElementById('flavor-sugars').textContent = data.sugar;
                document.getElementById('flavor-caffeine').textContent = data.caffeine;

                if (flavorSection) {
                    flavorSection.style.background = data.bgGlow;
                }
                flavorCard.classList.remove('fading');
            }, 160);

            playHissSound(0.2);
            showToast(`Switched to: ${data.name}`);
        });
    });
}

/* ===================================================
   6. CHILL SLIDER & TEMPERATURE GAUGE
   =================================================== */
function initChillSlider() {
    const slider = document.getElementById('temp-slider');
    const tempValue = document.getElementById('temp-value-display');
    const tempStatus = document.getElementById('temp-status-text');
    const chillMeterBar = document.getElementById('chill-meter-fill');

    if (!slider || !tempValue || !tempStatus) return;

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        tempValue.textContent = `${val}°C`;

        const percent = ((val - 1) / (12 - 1)) * 100;
        if (chillMeterBar) chillMeterBar.style.width = `${percent}%`;

        if (val <= 3) {
            tempStatus.textContent = "❄️ Sub-Zero Ultra Crisp (Maximum Fizz & Zing)";
            tempStatus.style.color = "#64b5f6";
        } else if (val <= 5) {
            tempStatus.textContent = "✨ The Gold Standard (Optimal Secret Formula Balance)";
            tempStatus.style.color = "#81c784";
        } else if (val <= 8) {
            tempStatus.textContent = "🍃 Smooth & Sweet (Mellow Carbonation)";
            tempStatus.style.color = "#ffb74d";
        } else {
            tempStatus.textContent = "⚠️ Mild Warmth (Recommended: Add Ice Cubes!)";
            tempStatus.style.color = "#e57373";
        }
    });
}

/* ===================================================
   7. SHARE-A-COKE PERSONALIZATION STUDIO
   =================================================== */
function initPersonalizeStudio() {
    const nameInput = document.getElementById('custom-label-input');
    const liveLabelText = document.getElementById('live-custom-name');
    const generateBtn = document.getElementById('generate-label-btn');

    if (!nameInput || !liveLabelText) return;

    nameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        liveLabelText.textContent = val ? val.toUpperCase() : "YOUR NAME";
    });

    generateBtn?.addEventListener('click', () => {
        const name = nameInput.value.trim() || "FRIEND";
        showToast(`✨ Personalized edition created for ${name}! Added to collection.`);
        playCanOpeningSound();
    });
}

/* ===================================================
   8. 3D CARD PARALLAX ON MOUSEMOVE
   =================================================== */
function initCardParallax() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = -(y / rect.height) * 8;
            const rotY = (x / rect.width) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ===================================================
   9. FRANCHISE PROFIT ESTIMATOR
   =================================================== */
function initFranchiseEstimator() {
    const volumeSlider = document.getElementById('calc-volume-slider');
    const volumeDisplay = document.getElementById('calc-volume-display');
    const revenueDisplay = document.getElementById('calc-revenue-display');

    if (!volumeSlider || !revenueDisplay) return;

    volumeSlider.addEventListener('input', (e) => {
        const casesPerMonth = parseInt(e.target.value);
        if (volumeDisplay) volumeDisplay.textContent = `${casesPerMonth.toLocaleString()} cases/mo`;
        const estProfit = Math.round(casesPerMonth * 14.5);
        revenueDisplay.textContent = `$${estProfit.toLocaleString()}`;
    });
}

/* ===================================================
   10. MODALS, SIDEBAR DRAWER & SEARCH
   =================================================== */
function initModalsAndDrawers() {
    const menuBtn = document.getElementById('menu-trigger');
    const closeMenuBtn = document.getElementById('close-drawer');
    const drawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function openDrawer() {
        drawer?.classList.add('open');
        drawerOverlay?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        drawer?.classList.remove('open');
        drawerOverlay?.classList.remove('show');
        document.body.style.overflow = '';
    }

    menuBtn?.addEventListener('click', openDrawer);
    closeMenuBtn?.addEventListener('click', closeDrawer);
    drawerOverlay?.addEventListener('click', closeDrawer);

    const searchBtn = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-query-input');

    function openSearch() {
        searchModal?.classList.add('open');
        setTimeout(() => searchInput?.focus(), 150);
    }
    function closeSearch() {
        searchModal?.classList.remove('open');
    }

    searchBtn?.addEventListener('click', openSearch);
    closeSearchBtn?.addEventListener('click', closeSearch);

    const tasteButtons = document.querySelectorAll('.taste-now-btn');
    const orderModal = document.getElementById('order-modal');
    const closeOrderBtn = document.getElementById('close-order');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    tasteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            orderModal?.classList.add('open');
            playCanOpeningSound();
        });
    });

    closeOrderBtn?.addEventListener('click', () => {
        orderModal?.classList.remove('open');
    });

    confirmOrderBtn?.addEventListener('click', () => {
        orderModal?.classList.remove('open');
        showToast('🎉 Ice-cold pack added to order! Delivering magic to your door.');
        updateCartBadge(1);
    });

    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            sizeOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    const heartBtns = document.querySelectorAll('.heart-toggle');
    heartBtns.forEach(heart => {
        let isFav = false;
        heart.addEventListener('click', () => {
            isFav = !isFav;
            if (isFav) {
                heart.classList.remove('ri-heart-line');
                heart.classList.add('ri-heart-fill');
                heart.style.color = '#ff1e27';
                showToast('Added to your Favorites ❤️');
            } else {
                heart.classList.remove('ri-heart-fill');
                heart.classList.add('ri-heart-line');
                heart.style.color = '';
                showToast('Removed from Favorites');
            }
        });
    });
}

/* ===================================================
   11. AUDIO ENGINE
   =================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
    const audioToggle = document.getElementById('sound-toggle-btn');
    if (!audioToggle) return;

    audioToggle.addEventListener('click', () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            audioToggle.innerHTML = '<i class="ri-volume-vibrate-line"></i> <span>Sound On</span>';
            audioToggle.classList.add('active');
            playCanOpeningSound();
            showToast('🔊 Effervescence sound fx enabled!');
        } else {
            audioToggle.innerHTML = '<i class="ri-volume-mute-line"></i> <span>Sound Muted</span>';
            audioToggle.classList.remove('active');
            showToast('🔇 Sound muted');
        }
    });
}

function playCanOpeningSound() {
    if (!audioCtx || !soundEnabled) return;
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        oscGain.gain.setValueAtTime(0.35, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);

        playHissSound(0.45);
    } catch (e) {
        console.log('Audio playback info:', e);
    }
}

function playHissSound(duration = 0.35) {
    if (!audioCtx || !soundEnabled) return;
    try {
        const now = audioCtx.currentTime;
        const bufferSize = Math.floor(audioCtx.sampleRate * duration);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(5500, now + duration);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);
    } catch (e) {
        console.log('Hiss playback info:', e);
    }
}

/* ===================================================
   12. STATS COUNTERS
   =================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    let hasRun = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target') || '100');
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let count = 0;
                    const duration = 1500;
                    const stepTime = 25;
                    const steps = duration / stepTime;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.textContent = `${target}${suffix}`;
                            clearInterval(timer);
                        } else {
                            counter.textContent = `${Math.floor(count)}${suffix}`;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('impact-section');
    if (statsSection) observer.observe(statsSection);
}

/* ===================================================
   13. TOAST & CART BADGE
   =================================================== */
let toastTimeout;
function showToast(message) {
    let toast = document.getElementById('coke-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'coke-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

let cartCount = 0;
function updateCartBadge(added) {
    cartCount += added;
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
        badge.textContent = cartCount;
        badge.style.display = 'inline-flex';
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 300);
    }
}
