
document.addEventListener("DOMContentLoaded", () => {
    console.log("Hikikomori Advanced JS Loaded!");

    // ==========================================
    // 1. SOUND EFFECTS
    // ==========================================

    let audioContext = null;

    function playClickSound() {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            if (!audioContext) {
                audioContext = new AudioContextClass();
            }

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(
                587.33,
                audioContext.currentTime
            );

            gainNode.gain.setValueAtTime(
                0.05,
                audioContext.currentTime
            );

            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.1
            );

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);

            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
        } catch (error) {
            console.log("Audio unavailable:", error);
        }
    }

    // ==========================================
    // 2. DOM MANIPULATION: RATING STARS
    // ==========================================

    // Rating appears ONLY on the Oregairu page.
    const overviewSection = document.querySelector(
        "body.oregairu .oregairu-main"
    );

    if (overviewSection) {
        const ratingContainer = document.createElement("div");

        ratingContainer.className =
            "rating-container my-3 p-3 rounded";

        ratingContainer.innerHTML = `
            <p class="mb-2">Rate Oregairu:</p>

            <div id="star-rating"
                 role="group"
                 aria-label="Rate Oregairu from 1 to 5 stars">

                <button class="star" data-value="1"
                        type="button" aria-label="1 star">☆</button>
                <button class="star" data-value="2"
                        type="button" aria-label="2 stars">☆</button>
                <button class="star" data-value="3"
                        type="button" aria-label="3 stars">☆</button>
                <button class="star" data-value="4"
                        type="button" aria-label="4 stars">☆</button>
                <button class="star" data-value="5"
                        type="button" aria-label="5 stars">☆</button>
            </div>

            <small id="rating-output" aria-live="polite">
                Click a star to rate
            </small>
        `;

        overviewSection.prepend(ratingContainer);

        const stars = ratingContainer.querySelectorAll(".star");
        const ratingOutput =
            ratingContainer.querySelector("#rating-output");

        stars.forEach((star) => {
            star.addEventListener("click", () => {
                playClickSound();

                const ratingValue = Number(star.dataset.value);

                stars.forEach((currentStar, index) => {
                    const isSelected = index < ratingValue;

                    currentStar.textContent =
                        isSelected ? "★" : "☆";

                    currentStar.classList.toggle(
                        "selected",
                        isSelected
                    );

                    currentStar.setAttribute(
                        "aria-pressed",
                        String(isSelected)
                    );
                });

                ratingOutput.textContent =
                    `Thank you! You rated Oregairu ${ratingValue}/5 stars.`;
            });
        });
    }

    // ==========================================
    // 3. DAY / NIGHT THEME SWITCHER
    // ==========================================

    const navbarNav = document.querySelector(".navbar-nav");

    if (navbarNav) {
        const themeToggleLi = document.createElement("li");

        themeToggleLi.className = "nav-item ms-lg-2";

        themeToggleLi.innerHTML = `
            <button id="themeToggleBtn"
                    class="nav-link btn btn-outline-purple px-3 mt-1 mt-lg-0"
                    type="button">
                ☀️ Day Mode
            </button>
        `;

        navbarNav.appendChild(themeToggleLi);

        const themeToggleBtn =
            document.getElementById("themeToggleBtn");

        // Restore previously selected theme.
        let savedTheme = null;

        try {
            savedTheme = localStorage.getItem("hikikomori-theme");
        } catch (error) {
            console.log("Theme storage unavailable:", error);
        }

        if (savedTheme === "day") {
            document.body.classList.add("day-theme");
            themeToggleBtn.textContent = "🌙 Night Mode";
        }

        themeToggleBtn.addEventListener("click", () => {
            playClickSound();

            const isDayMode =
                document.body.classList.toggle("day-theme");

            themeToggleBtn.textContent = isDayMode
                ? "🌙 Night Mode"
                : "☀️ Day Mode";

            try {
                localStorage.setItem(
                    "hikikomori-theme",
                    isDayMode ? "day" : "night"
                );
            } catch (error) {
                console.log("Theme storage unavailable:", error);
            }
        });
    }

    // ==========================================
    // 4. EVENT HANDLING: CURRENT TIME
    // ==========================================

    const footerElement =
        document.querySelector("footer.main-footer");

    if (footerElement) {
        const timeButtonContainer =
            document.createElement("div");

        timeButtonContainer.className = "mb-2";

        timeButtonContainer.innerHTML = `
            <button id="showTimeBtn"
                    class="btn btn-sm btn-purple"
                    type="button">
                Show Current Time
            </button>

            <span id="timeDisplay"
                  class="ms-2"
                  aria-live="polite"></span>
        `;

        footerElement.prepend(timeButtonContainer);

        const showTimeBtn =
            document.getElementById("showTimeBtn");

        const timeDisplay =
            document.getElementById("timeDisplay");

        showTimeBtn.addEventListener("click", () => {
            playClickSound();

            const currentTime =
                new Date().toLocaleTimeString();

            timeDisplay.textContent =
                `Current time: ${currentTime}`;
        });
    }

    // ==========================================
    // 5. SWITCH STATEMENT: TIME GREETING
    // ==========================================

    function getTimeGreeting() {
        const hour = new Date().getHours();
        let message = "";

        switch (true) {
            case hour < 12:
                message =
                    "🌅 Good morning, anime fan! Ready to explore new collections?";
                break;

            case hour < 18:
                message =
                    "☀️ Good afternoon! Check out our top-rated anime list.";
                break;

            default:
                message =
                    "🌙 Good evening! Perfect time for a night anime marathon.";
                break;
        }

        return message;
    }

    if (footerElement) {
        const greetingContainer =
            document.createElement("div");

        greetingContainer.className =
            "time-greeting text-center my-2 small";

        greetingContainer.textContent = getTimeGreeting();

        footerElement.appendChild(greetingContainer);
    }

    // ==========================================
    // 6. KEYBOARD EVENT HANDLING
    // ==========================================

    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link"
    );

    if (navLinks.length > 0) {
        document.addEventListener("keydown", (event) => {
            if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowLeft"
            ) {
                return;
            }

            const activeElement = document.activeElement;

            // Do not interfere with typing in form fields.
            if (
                activeElement.matches(
                    "input, textarea, select, [contenteditable]"
                )
            ) {
                return;
            }

            const currentIndex =
                Array.from(navLinks).indexOf(activeElement);

            // Navigation works when a menu item has focus.
            if (currentIndex === -1) return;

            event.preventDefault();

            let nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex =
                    (currentIndex + 1) % navLinks.length;
            } else {
                nextIndex =
                    (currentIndex - 1 + navLinks.length) %
                    navLinks.length;
            }

            const nextLink = navLinks[nextIndex];

            nextLink.focus();
        });
    }

    // ==========================================
    // 7. OBJECTS, ARRAYS AND HIGHER-ORDER FUNCTIONS
    // ==========================================

    const animeData = [
        {
            title: "Oregairu",
            quote:
                "Hikigaya Hachiman: 'Soft words can sometimes be a curse.'"
        },
        {
            title: "Bleach",
            quote:
                "Kurosaki Ichigo: 'If I protect the world, I won't be able to protect you.'"
        },
        {
            title: "Hunter x Hunter",
            quote:
                "Killua Zoldyck: 'People only ever find me when they're looking to bleed.'"
        },
        {
            title: "Jujutsu Kaisen",
            quote:
                "Gojo Satoru: 'Throughout heaven and earth, I alone am the honored one.'"
        }
    ];

    animeData.forEach((anime) => {
        console.log(`Anime: ${anime.title} -> ${anime.quote}`);
    });

    // ==========================================
    // 8. CALLBACK: OREGAIRU REVIEW FORM
    // ==========================================

    const reviewForm = document.querySelector(
        "body.oregairu form"
    );

    if (reviewForm) {
        const formMessage = document.createElement("p");

        formMessage.className =
            "review-message mt-3";

        formMessage.setAttribute("role", "status");
        formMessage.setAttribute("aria-live", "polite");

        reviewForm.appendChild(formMessage);

        function showFormMessage(message) {
            formMessage.textContent = message;
        }

        function handleReviewSubmit(event) {
            event.preventDefault();

            if (!reviewForm.reportValidity()) return;

            const userName =
                document.getElementById("userName").value.trim();

            if (!userName) {
                showFormMessage("Please enter your name.");
                return;
            }

            playClickSound();

            // Demo submission: no backend is connected.
            showFormMessage(
                `Thank you, ${userName}! Your review was received in demo mode.`
            );

            reviewForm.reset();
        }

        reviewForm.addEventListener(
            "submit",
            handleReviewSubmit
        );
    }

    // ==========================================
    // 9. ANIMATIONS
    // ==========================================

    const cards = document.querySelectorAll(
        ".custom-card, .gallery-item, .card"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion) {
        cards.forEach((card, index) => {
            card.classList.add("js-animated-card");

            setTimeout(() => {
                card.classList.add("is-visible");
            }, 100 * index);
        });
    }
});
