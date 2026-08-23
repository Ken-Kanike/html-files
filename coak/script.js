/**
 * Coca-Cola Interactive Experience - Master Production Engine
 * High-performance section-driven 3D bottle choreography, Canvas fizz particles,
 * Share-A-Coke Studio, 3D card tilts, and Web Audio API FX.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollPhysics();
    initCanvasParticles();
    initAccordions();
    initFlavorSwitcher();
    initChillSlider();
    initShareACokeStudio();
    initFranchiseCalculator();
    init3DCardTilt();
    initScrollReveal();
    initModalsAndDrawers();
    initAudioEngine();
    initImpactCounters();
    initToastNotifications();
});

/* ===================================================
   1. SECTION-RELATIVE PRECISION BOTTLE PHYSICS
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
    let targetOpacity = 1;

    let currentX = 0;
    let currentY = 0;
    let currentRotate = 0;
    let currentScale = 1;
    let currentOpacity = 1;

    const sections = [
        { id: 'hero', getTarget: (p) => ({ x: 0, y: p * 30, rotate: p * -6, scale: 1 - p * 0.05, opacity: 1 }) },
        { id: 'craft-section', getTarget: (p) => ({ x: -window.innerWidth * 0.25, y: 0, rotate: 10 - p * 4, scale: 1.05, opacity: 1 }) },
        { id: 'flavors-section', getTarget: (p) => ({ x: window.innerWidth * 0.25, y: 0, rotate: -8 + p * 4, scale: 1.05, opacity: 1 }) },
        { id: 'chill-section', getTarget: (p) => ({ x: -window.innerWidth * 0.25, y: 0, rotate: 8, scale: 1.05, opacity: 1 }) },
        { id: 'studio-section', getTarget: (p) => ({ x: window.innerWidth * 0.25, y: 0, rotate: -6, scale: 1.05, opacity: 1 }) },
        { id: 'franchise-section', getTarget: (p) => ({ x: -window.innerWidth * 0.25, y: 0, rotate: 6, scale: 1.05, opacity: 1 }) },
        { id: 'impact-section', getTarget: (p) => ({ x: 0, y: 0, rotate: 0, scale: 0.65, opacity: 0.22 }) },
        { id: 'cta-section', getTarget: (p) => ({ x: 0, y: 40, rotate: 0, scale: 0.85, opacity: 0.5 }) }
    ];

    function calculateTargetPhysics() {
        const winHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 1024;

        if (isMobile) {
            targetX = 0;
            targetY = Math.sin(Date.now() * 0.002) * 6;
            targetRotate = Math.sin(Date.now() * 0.001) * 2;
            targetScale = 0.8;
            targetOpacity = 0.35;
            return;
        }

        // Determine active section via bounding client rects
        let activeFound = false;

        for (let i = 0; i < sections.length; i++) {
            const secElem = document.getElementById(sections[i].id);
            if (!secElem) continue;

            const rect = secElem.getBoundingClientRect();
            // Check if section is centered in the viewport
            if (rect.top <= winHeight * 0.6 && rect.bottom >= winHeight * 0.4) {
                const sectionProgress = Math.min(Math.max((winHeight * 0.5 - rect.top) / rect.height, 0), 1);
                const targetState = sections[i].getTarget(sectionProgress);
                
                targetX = targetState.x;
                targetY = targetState.y;
                targetRotate = targetState.rotate;
                targetScale = targetState.scale;
                targetOpacity = targetState.opacity;
                activeFound = true;
                break;
            }
        }

        if (!activeFound) {
            // Default fallback
            targetX = 0;
            targetY = 0;
            targetRotate = 0;
            targetScale = 1;
            targetOpacity = 1;
        }

        // Hero arch scaling
        if (heroBgArch) {
            const heroRect = document.getElementById('hero')?.getBoundingClientRect();
            if (heroRect) {
                const p = Math.max(0, -heroRect.top / heroRect.height);
                heroBgArch.style.transform = `scale(${Math.max(0.85, 1 - p * 0.2)}) translateY(${p * 40}px)`;
                heroBgArch.style.opacity = `${Math.max(0, 1 - p * 1.2)}`;
            }
        }
    }

    window.addEventListener('scroll', calculateTargetPhysics, { passive: true });
    window.addEventListener('resize', calculateTargetPhysics);
    calculateTargetPhysics();

    // Smooth Lerp Animation Loop (60 FPS)
    function renderLoop() {
        // Continuous subtle floating levitation
        const idleFloat = Math.sin(Date.now() * 0.002) * 7;
        const idleRot = Math.cos(Date.now() * 0.0015) * 1.5;

        currentX += (targetX - currentX) * 0.08;
        currentY += ((targetY + idleFloat) - currentY) * 0.08;
        currentRotate += ((targetRotate + idleRot) - currentRotate) * 0.08;
        currentScale += (targetScale - currentScale) * 0.08;
        currentOpacity += (targetOpacity - currentOpacity) * 0.08;

        bottleContainer.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) rotate(${currentRotate}deg) scale(${currentScale})`;
        bottleContainer.style.opacity = currentOpacity;

        requestAnimationFrame(renderLoop);
    }
    renderLoop();
}

/* ===================================================
   2. CANVAS PARTICLES (Effervescence & Ice)
   =================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('fizz-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const bubbles = [];
    const bubbleCount = Math.min(Math.floor(window.innerWidth / 22), 65);

    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.8 + 1,
            speedY: Math.random() * 1.4 + 0.6,
            speedX: (Math.random() - 0.5) * 0.6,
            opacity: Math.random() * 0.55 + 0.15,
            wobble: Math.random() * Math.PI * 2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let b of bubbles) {
            b.y -= b.speedY;
            b.wobble += 0.03;
            b.x += Math.sin(b.wobble) * 0.5 + b.speedX;

            if (b.y < -10) {
                b.y = height + 10;
                b.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 60, 70, ${b.opacity})`;
            ctx.shadowColor = 'rgba(255, 30, 39, 0.6)';
            ctx.shadowBlur = 6;
            ctx.fill();
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

/* ===================================================
   3. ACCORDIONS (Nutrition & Ingredients)
   =================================================== */
function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => {
                i.classList.remove('active');
                const icon = i.querySelector('.accordion-icon i');
                if (icon) {
                    icon.classList.remove('ri-indeterminate-circle-line');
                    icon.classList.add('ri-add-circle-line');
                }
            });

            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('.accordion-icon i');
                if (icon) {
                    icon.classList.remove('ri-add-circle-line');
                    icon.classList.add('ri-indeterminate-circle-line');
                }
            }
        });
    });
}

/* ===================================================
   4. FLAVOR SPECTRUM SWITCHER
   =================================================== */
function initFlavorSwitcher() {
    const pills = document.querySelectorAll('.flavor-pill');
    const badge = document.getElementById('flavor-badge');
    const title = document.getElementById('flavor-title');
    const subtitle = document.getElementById('flavor-subtitle');
    const cals = document.getElementById('flavor-cals');
    const sugars = document.getElementById('flavor-sugars');
    const caffeine = document.getElementById('flavor-caffeine');
    const card = document.getElementById('active-flavor-details');

    const flavorData = {
        original: {
            badge: 'Iconic Classic',
            title: 'Original Taste',
            subtitle: 'The timeless classic since 1886 with crisp effervescence and secret botanical notes.',
            cals: '140 kcal',
            sugars: '39g',
            caffeine: '34mg',
            auraColor: 'rgba(255, 30, 39, 0.35)'
        },
        zero: {
            badge: 'Zero Calorie',
            title: 'Zero Sugar',
            subtitle: 'Iconic authentic Coca-Cola taste with zero calories and zero sugar.',
            cals: '0 kcal',
            sugars: '0g',
            caffeine: '34mg',
            auraColor: 'rgba(70, 70, 70, 0.45)'
        },
        cherry: {
            badge: 'Fruit Infusion',
            title: 'Cherry Splash',
            subtitle: 'Bursting with sweet and tangy natural black cherry extracts for an exhilarating twist.',
            cals: '150 kcal',
            sugars: '42g',
            caffeine: '34mg',
            auraColor: 'rgba(194, 24, 91, 0.4)'
        },
        vanilla: {
            badge: 'Smooth Blend',
            title: 'Vanilla Dream',
            subtitle: 'Silky smooth Madagascar vanilla bean infusion blended with crisp carbonated cola.',
            cals: '150 kcal',
            sugars: '42g',
            caffeine: '34mg',
            auraColor: 'rgba(224, 169, 109, 0.4)'
        }
    };

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const key = pill.dataset.flavor;
            const data = flavorData[key];
            if (!data) return;

            // Trigger Pop Audio
            playPopSound();

            if (card) {
                card.classList.add('fading');
                setTimeout(() => {
                    badge.textContent = data.badge;
                    title.textContent = data.title;
                    subtitle.textContent = data.subtitle;
                    cals.textContent = data.cals;
                    sugars.textContent = data.sugars;
                    caffeine.textContent = data.caffeine;
                    card.classList.remove('fading');
                }, 180);
            }
        });
    });
}

/* ===================================================
   5. SUB-ZERO CHILL SLIDER
   =================================================== */
function initChillSlider() {
    const slider = document.getElementById('temp-slider');
    const valDisplay = document.getElementById('temp-value-display');
    const meterFill = document.getElementById('chill-meter-fill');
    const statusText = document.getElementById('temp-status-text');
    const bottleImg = document.getElementById('main-coke-bottle');

    if (!slider || !valDisplay) return;

    slider.addEventListener('input', (e) => {
        const temp = parseInt(e.target.value);
        valDisplay.textContent = `${temp}°C`;

        const percent = ((temp - 1) / 11) * 100;
        if (meterFill) meterFill.style.width = `${percent}%`;

        // Dynamic status feedback
        if (temp <= 2) {
            statusText.textContent = '❄️ Sub-Zero Frosted: Intense ice crystal carbonation crispness.';
            statusText.style.color = '#80d8ff';
            if (bottleImg) bottleImg.style.filter = 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(100, 181, 246, 0.8)) brightness(1.15)';
        } else if (temp <= 5) {
            statusText.textContent = '✨ The Gold Standard: Optimal secret formula sensory balance.';
            statusText.style.color = '#90caf9';
            if (bottleImg) bottleImg.style.filter = 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(255, 30, 39, 0.6))';
        } else {
            statusText.textContent = '☀️ Refreshing Ambient: Rich aromatic vanilla & caramel notes.';
            statusText.style.color = '#ffb74d';
            if (bottleImg) bottleImg.style.filter = 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(255, 183, 77, 0.5))';
        }
    });
}

/* ===================================================
   6. SHARE-A-COKE CUSTOMIZER STUDIO
   =================================================== */
function initShareACokeStudio() {
    const input = document.getElementById('custom-label-input');
    const labelDisplay = document.getElementById('live-custom-name');
    const saveBtn = document.getElementById('generate-label-btn');

    if (!input || !labelDisplay) return;

    input.addEventListener('input', () => {
        const text = input.value.trim();
        labelDisplay.textContent = text.length > 0 ? text.toUpperCase() : 'YOUR NAME';
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = labelDisplay.textContent;
            showToast(`🎉 Custom "${name}" Contour Can Saved to Bag!`);
            playPopSound();
        });
    }
}

/* ===================================================
   7. FRANCHISE ROI CALCULATOR
   =================================================== */
function initFranchiseCalculator() {
    const slider = document.getElementById('calc-volume-slider');
    const volDisplay = document.getElementById('calc-volume-display');
    const revDisplay = document.getElementById('calc-revenue-display');

    if (!slider || !volDisplay || !revDisplay) return;

    slider.addEventListener('input', () => {
        const volume = parseInt(slider.value);
        volDisplay.textContent = `${volume.toLocaleString()} cases/mo`;

        // Standard wholesale distribution margin (~$14.50 gross profit per case)
        const revenue = Math.round(volume * 14.5);
        revDisplay.textContent = `$${revenue.toLocaleString()}`;
    });
}

/* ===================================================
   8. 3D CARD TILT ON MOUSE HOVER
   =================================================== */
function init3DCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ===================================================
   9. SCROLL REVEAL UTILITY
   =================================================== */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
}

/* ===================================================
   10. MODALS & DRAWERS
   =================================================== */
function initModalsAndDrawers() {
    const searchModal = document.getElementById('search-modal');
    const orderModal = document.getElementById('order-modal');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const mobileDrawer = document.getElementById('mobile-drawer');

    // Search Trigger
    document.getElementById('search-trigger')?.addEventListener('click', () => {
        searchModal?.classList.add('open');
        document.getElementById('search-query-input')?.focus();
    });
    document.getElementById('close-search')?.addEventListener('click', () => searchModal?.classList.remove('open'));

    // Taste Now / Order Triggers
    document.querySelectorAll('.taste-now-btn').forEach(btn => {
        btn.addEventListener('click', () => orderModal?.classList.add('open'));
    });
    document.getElementById('close-order')?.addEventListener('click', () => orderModal?.classList.remove('open'));

    // Drawer Triggers
    document.getElementById('menu-trigger')?.addEventListener('click', () => {
        mobileDrawer?.classList.add('open');
        drawerOverlay?.classList.add('show');
    });
    document.getElementById('close-drawer')?.addEventListener('click', closeDrawer);
    drawerOverlay?.addEventListener('click', closeDrawer);

    function closeDrawer() {
        mobileDrawer?.classList.remove('open');
        drawerOverlay?.classList.remove('show');
    }

    // Modal Size Selectors
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    // Confirm Order
    document.getElementById('confirm-order-btn')?.addEventListener('click', () => {
        orderModal?.classList.remove('open');
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
            badge.style.display = 'flex';
            badge.textContent = parseInt(badge.textContent || 0) + 1;
        }
        showToast('🛒 Ice-Cold Pack added to your bag!');
        playPopSound();
    });

    // Close on backdrop click
    [searchModal, orderModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('open');
        });
    });
}

/* ===================================================
   11. WEB AUDIO API SOUND ENGINE
   =================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (!soundToggle) return;

    soundToggle.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('active', soundEnabled);
        soundToggle.innerHTML = soundEnabled 
            ? '<i class="ri-volume-up-line"></i> <span>Sound On</span>' 
            : '<i class="ri-volume-mute-line"></i> <span>Sound</span>';

        if (soundEnabled) {
            playPopSound();
            showToast('🔊 Interactive Fizz Audio Enabled');
        }
    });
}

function playPopSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
        console.warn('Audio play error:', e);
    }
}

/* ===================================================
   12. IMPACT COUNTERS (Scroll Triggered)
   =================================================== */
function initImpactCounters() {
    let triggered = false;
    const statsSection = document.getElementById('impact-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !triggered) {
            triggered = true;
            document.querySelectorAll('.stat-number').forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                let count = 0;
                const speed = 2000 / (target || 1);

                const interval = setInterval(() => {
                    count += Math.ceil(target / 45);
                    if (count >= target) {
                        counter.textContent = `${target}${suffix}`;
                        clearInterval(interval);
                    } else {
                        counter.textContent = `${Math.floor(count)}${suffix}`;
                    }
                }, 35);
            });
        }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

/* ===================================================
   13. TOAST NOTIFICATIONS
   =================================================== */
function initToastNotifications() {
    let toast = document.getElementById('coke-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'coke-toast';
        document.body.appendChild(toast);
    }
}

function showToast(msg) {
    const toast = document.getElementById('coke-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
}
