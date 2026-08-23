/**
 * Coca-Cola Interactive Experience - Script Engine
 * High-performance scroll physics, interactive UI modules, and ambient audio
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollPhysics();
    initCanvasParticles();
    initAccordions();
    initFlavorSwitcher();
    initChillSlider();
    initModalsAndDrawers();
    initAudioEngine();
    initCounters();
    initToastNotifications();
});

/* ===================================================
   1. BOTTLE SCROLL PHYSICS & TIMELINE
   =================================================== */
function initScrollPhysics() {
    const bottleContainer = document.getElementById('coke-bottle-stage');
    const bottleImg = document.getElementById('main-coke-bottle');
    const heroBgArch = document.getElementById('center-bg');
    if (!bottleContainer || !bottleImg) return;

    let targetX = 0;
    let targetY = 0;
    let targetRotate = 0;
    let targetScale = 1;
    let currentX = 0;
    let currentY = 0;
    let currentRotate = 0;
    let currentScale = 1;

    function onScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

        // Sections reference points
        const heroSection = document.getElementById('hero');
        const craftSection = document.getElementById('craft-section');
        const flavorSection = document.getElementById('flavors-section');
        const chillSection = document.getElementById('chill-section');
        const impactSection = document.getElementById('impact-section');
        const ctaSection = document.getElementById('cta-section');

        const winHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Subdued motion for mobile
            targetX = 0;
            targetY = Math.sin(Date.now() * 0.002) * 5;
            targetRotate = Math.sin(Date.now() * 0.001) * 3;
            targetScale = 0.85;
            return;
        }

        // Multistage Scroll Choreography
        if (progress < 0.18) {
            // STAGE 0: HERO (Centered in glowing arch)
            const p0 = progress / 0.18;
            targetX = 0;
            targetY = p0 * 40;
            targetRotate = (p0 * -6);
            targetScale = 1 + (p0 * 0.08);
            if (heroBgArch) {
                heroBgArch.style.transform = `scale(${1 - p0 * 0.15}) translateY(${p0 * 30}px)`;
                heroBgArch.style.opacity = `${1 - p0 * 0.8}`;
            }
        } else if (progress < 0.40) {
            // STAGE 1: THE SECRET FORMULA & CRAFT (Moves to left side, tilts 8deg, specs on right)
            const p1 = (progress - 0.18) / 0.22;
            targetX = -260 + (p1 * -30);
            targetY = 20 + (p1 * 30);
            targetRotate = -6 + (p1 * 14); // tilts to +8deg
            targetScale = 1.08 + (p1 * 0.07);
        } else if (progress < 0.65) {
            // STAGE 2: FLAVORS SHOWCASE (Glides to right, tilts back, scale up)
            const p2 = (progress - 0.40) / 0.25;
            targetX = -290 + (p2 * 540); // moves to +250px right
            targetY = 50 - (p2 * 20);
            targetRotate = 8 - (p2 * 18); // tilts to -10deg
            targetScale = 1.15 - (p2 * 0.1);
        } else if (progress < 0.85) {
            // STAGE 3: OPTIMAL CHILL (Moves back towards center-left, frosty chill vibe)
            const p3 = (progress - 0.65) / 0.20;
            targetX = 250 - (p3 * 400); // moves to -150px
            targetY = 30 + (p3 * 20);
            targetRotate = -10 + (p3 * 16);
            targetScale = 1.05 + (p3 * 0.05);
        } else {
            // STAGE 4: SUSTAINABILITY & FINAL CTA (Centers and scales nicely)
            const p4 = (progress - 0.85) / 0.15;
            targetX = -150 + (p4 * 150);
            targetY = 50 + (p4 * 20);
            targetRotate = 6 - (p4 * 6);
            targetScale = 1.1 - (p4 * 0.15);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // Smooth Lerp Animation Loop
    function renderLoop() {
        // Idle gentle float physics
        const time = Date.now() * 0.0025;
        const idleBob = Math.sin(time) * 8;
        const idleTilt = Math.cos(time * 0.8) * 1.5;

        currentX += (targetX - currentX) * 0.09;
        currentY += (targetY - currentY) * 0.09;
        currentRotate += (targetRotate + idleTilt - currentRotate) * 0.09;
        currentScale += (targetScale - currentScale) * 0.09;

        bottleContainer.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY + idleBob}px)) rotate(${currentRotate}deg) scale(${currentScale})`;

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

/* ===================================================
   2. FIZZING BUBBLE CANVAS PARTICLES
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

    const bubbles = [];
    const bubbleCount = 45;

    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1.2 + 0.4,
            opacity: Math.random() * 0.6 + 0.15,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.04 + 0.01
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let b of bubbles) {
            b.y -= b.speed;
            b.wobble += b.wobbleSpeed;
            const wobbleX = b.x + Math.sin(b.wobble) * 12;

            if (b.y < -10) {
                b.y = height + 10;
                b.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(wobbleX, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 60, 60, ${b.opacity})`;
            ctx.shadowColor = 'rgba(255, 30, 30, 0.8)';
            ctx.shadowBlur = 6;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* ===================================================
   3. ACCORDIONS & INTERACTIVE SPEC TABS
   =================================================== */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close others in same group
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
            }
        });
    });
}

/* ===================================================
   4. FLAVOR CUSTOMIZER & EDITIONS SWITCHER
   =================================================== */
const flavorData = {
    original: {
        name: 'Original Taste',
        subtitle: 'The timeless classic since 1886 with crisp effervescence and secret botanical notes.',
        tag: 'Iconic Classic',
        calories: '140 kcal',
        sugar: '39g',
        caffeine: '34mg',
        color: '#ff1e27',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(229, 9, 20, 0.45) 0%, transparent 60%)'
    },
    zero: {
        name: 'Zero Sugar',
        subtitle: 'Uncompromising classic Coke flavor crafted with zero sugar and zero calories.',
        tag: 'Zero Calories',
        calories: '0 kcal',
        sugar: '0g',
        caffeine: '34mg',
        color: '#111111',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(120, 120, 120, 0.35) 0%, transparent 60%)'
    },
    cherry: {
        name: 'Cherry Splash',
        subtitle: 'A sweet burst of rich dark cherry fruit aroma blended into the original crisp formula.',
        tag: 'Fruit Fusion',
        calories: '150 kcal',
        sugar: '42g',
        caffeine: '34mg',
        color: '#c2185b',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(194, 24, 91, 0.45) 0%, transparent 60%)'
    },
    vanilla: {
        name: 'Vanilla Dream',
        subtitle: 'Velvety smooth Madagascar vanilla notes combined with legendary cola zest.',
        tag: 'Silky Smooth',
        calories: '150 kcal',
        sugar: '42g',
        caffeine: '34mg',
        color: '#e0a96d',
        bgGlow: 'radial-gradient(circle at 65% 50%, rgba(224, 169, 109, 0.4) 0%, transparent 60%)'
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

            // Update details with micro-animation
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
            }, 180);

            showToast(`Selected flavor: ${data.name}`);
        });
    });
}

/* ===================================================
   5. CHILL SLIDER & TEMPERATURE GAUGE
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
   6. MODALS, SIDEBAR DRAWER & SEARCH
   =================================================== */
function initModalsAndDrawers() {
    // Menu Drawer
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

    // Search Modal
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

    // Taste Now Checkout Sheet
    const tasteButtons = document.querySelectorAll('.taste-now-btn');
    const orderModal = document.getElementById('order-modal');
    const closeOrderBtn = document.getElementById('close-order');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    tasteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            orderModal?.classList.add('open');
        });
    });

    closeOrderBtn?.addEventListener('click', () => {
        orderModal?.classList.remove('open');
    });

    confirmOrderBtn?.addEventListener('click', () => {
        orderModal?.classList.remove('open');
        showToast('🎉 Coke pack added to your order! Delivering ice-cold freshness.');
        updateCartBadge(1);
    });

    // Favorite Heart Toggle
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
   7. WEB AUDIO API - FIZZ & CAN CRACK SOUND FX
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

        // White noise for fizz
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = buffer;

        // Filter for crisp hiss
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.frequency.exponentialRampToValueAtTime(6000, now + 0.6);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.8);
    } catch (e) {
        console.log('Audio playback info:', e);
    }
}

/* ===================================================
   8. STATS COUNTERS INTERSECTION OBSERVER
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
                    const duration = 1600;
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
    }, { threshold: 0.4 });

    const statsSection = document.getElementById('impact-section');
    if (statsSection) observer.observe(statsSection);
}

/* ===================================================
   9. TOAST NOTIFICATION SYSTEM & CART BADGE
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
    }, 3200);
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
