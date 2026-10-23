gsap.registerPlugin(ScrollTrigger);

// B1: Toggle dark mode on the HTML element.
const darkModeToggle = document.querySelector("#darkModeToggle");
const html = document.documentElement;

darkModeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");
});

// D1 + D2: Page-load intro timeline.
// power2.out gives the entrance a smooth slowdown instead of an abrupt stop.
const intro = gsap.timeline({
    defaults: {
        duration: 0.65,
        ease: "power2.out"
    }
});

const motionPreferences = window.matchMedia("(prefers-reduced-motion: reduce)");

if (motionPreferences.matches) {
    // Visitors who prefer reduced motion see the whole page immediately.
    gsap.set(".brand-intro, .hero-intro, .nav-link", {
        clearProps: "all"
    });
} else {
    intro
        .from(".brand-intro", {
            y: -20,
            opacity: 0
        })
        .from(".nav-link", {
            y: -15,
            opacity: 0,
            stagger: 0.1
        }, "-=0.3")
        .from(".hero-intro", {
            y: 25,
            opacity: 0,
            stagger: 0.12
        }, "-=0.25");
}

// D3: Replay the page intro.
document.querySelector("#replayBtn").addEventListener("click", function () {
    if (motionPreferences.matches) {
        return;
    }

    intro.restart();
});


const media = gsap.matchMedia();

media.add("(prefers-reduced-motion: no-preference)", function () {
    // Reveal each section separately as it enters the viewport.
    gsap.utils.toArray(".reveal").forEach(function (section) {
        gsap.fromTo(section,
            {
                y: 35,
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: "power2.out", // Smoothly settles the section into view.
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Scroll-linked progress bar.
    gsap.fromTo("#progressBar",
        {
            scaleX: 0
        },
        {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        }
    );

    // The work cards enter one after another.
    gsap.from(".product-card", {
        y: 20,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#work",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});

// With reduced motion enabled, sections remain fully visible and usable.
media.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(".reveal", {
        clearProps: "all",
        autoAlpha: 1,
        y: 0
    });

    gsap.set("#progressBar", {
        scaleX: 0
    });

    gsap.set(".product-card", {
        clearProps: "all"
    });
});
