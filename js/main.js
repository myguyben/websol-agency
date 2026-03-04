// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Setup Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorFollower = document.querySelector('.cursor-follower');
const mouseGlow = document.querySelector('.mouse-glow');

let mouseX = 0, mouseY = 0;
let fX = 0, fY = 0; // follower coordinates

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Immediate dot update
    if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    }

    // Immediate glow update
    if (mouseGlow) {
        mouseGlow.style.left = mouseX + 'px';
        mouseGlow.style.top = mouseY + 'px';
    }
});

// Follower lerp loop
function renderCursor() {
    // Lerp (smooth follow)
    fX += (mouseX - fX) * 0.15;
    fY += (mouseY - fY) * 0.15;

    if (cursorFollower) {
        cursorFollower.style.transform = `translate(-50%, -50%) translate(${fX}px, ${fY}px)`;
    }

    requestAnimationFrame(renderCursor);
}
renderCursor();

// Add hover states to all links and buttons
const interactables = document.querySelectorAll('a, button, .interactive');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// 2. Initialize Lenis (Smooth Scrolling)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Hook Lenis up to ScrollTrigger
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3. Preloader Animation (The Jaw Dropper)
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Text slides up
    tl.to('.preloader-text', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1,
        ease: "power4.inOut"
    })
        // Text fills with cyan
        .to('.preloader-text::after', {
            width: '100%',
            duration: 1,
            ease: "power4.inOut"
        }, "-=0.2")
        // Preloader slides up and away
        .to('#preloader', {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut"
        }, "+=0.2")
        // Hero Text Staggered Reveal
        .from('.hero-title .char', {
            yPercent: 120,
            stagger: 0.03,
            duration: 1,
            ease: "power4.out"
        }, "-=0.8")
        .from('.hero-para', {
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=0.6");
});

// 4. SplitText Setup for Scroll Reveals
// Since we don't have SplitText premium plugin, we use a simple JS splitter function
function splitTextIntolinesAndChars(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        // Highly simplified word/char wrapper for the hero
        text.split(' ').forEach(word => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            word.split('').forEach(char => {
                const charDiv = document.createElement('div');
                charDiv.className = 'char';
                charDiv.innerHTML = char === ' ' ? '&nbsp;' : char;
                wordDiv.appendChild(charDiv);
            });
            // Add a space after word
            const space = document.createElement('div');
            space.className = 'char';
            space.innerHTML = '&nbsp;';
            wordDiv.appendChild(space);

            // Wrap word in a line-mask equivalent
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.style.display = 'inline-block';
            lineDiv.appendChild(wordDiv);

            el.appendChild(lineDiv);
        });
    });
}
splitTextIntolinesAndChars('.split-text');

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // 5. Huge Background Text Parallax
    gsap.to('.huge-text', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        }
    });

    // 6. Horizontal Pinned Scroll (How It Works)
    const horizontalWrapper = document.querySelector('.horizontal-container');
    if (horizontalWrapper) {
        // Calculate amount to scroll: (Total width of container) - (Width of window)
        const getScrollAmount = () => -(horizontalWrapper.scrollWidth - window.innerWidth);

        gsap.to(horizontalWrapper, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll-wrapper",
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }

    // 7. Image Parallax in Gallery
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 8. Text Reveal on Scroll
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            }
        });
    });
});
