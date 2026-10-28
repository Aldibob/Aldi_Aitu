document.addEventListener("DOMContentLoaded", () => {
    console.log("Hikikomori Advanced JS Loaded!");

    let audioContext = null;

    function playClickSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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
            oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

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


    const overviewSection = document.querySelector("body.oregairu .oregairu-main");

    if (overviewSection) {
        const ratingContainer = document.createElement("div");
        ratingContainer.className = "rating-container my-3 p-3 rounded";

        ratingContainer.innerHTML = `
            <p class="mb-2">Rate Oregairu:</p>
            <div id="star-rating" role="group" aria-label="Rate Oregairu from 1 to 5 stars">
                <button class="star" data-value="1" type="button" aria-label="1 star">☆</button>
                <button class="star" data-value="2" type="button" aria-label="2 stars">☆</button>
                <button class="star" data-value="3" type="button" aria-label="3 stars">☆</button>
                <button class="star" data-value="4" type="button" aria-label="4 stars">☆</button>
                <button class="star" data-value="5" type="button" aria-label="5 stars">☆</button>
            </div>
            <small id="rating-output" aria-live="polite">Click a star to rate</small>
        `;

        overviewSection.prepend(ratingContainer);

        const stars = ratingContainer.querySelectorAll(".star");
        const ratingOutput = ratingContainer.querySelector("#rating-output");

        stars.forEach((star) => {
            star.addEventListener("click", () => {
                playClickSound();
                const ratingValue = Number(star.dataset.value);

                stars.forEach((currentStar, index) => {
                    const isSelected = index < ratingValue;
                    currentStar.textContent = isSelected ? "★" : "☆";
                    currentStar.classList.toggle("selected", isSelected);
                    currentStar.setAttribute("aria-pressed", String(isSelected));
                });

                ratingOutput.textContent = `Thank you! You rated Oregairu ${ratingValue}/5 stars.`;
            });
        });
    }


    const navbarNav = document.querySelector(".navbar-nav");

    if (navbarNav) {
        const popupBtnLi = document.createElement("li");
        popupBtnLi.className = "nav-item";
        popupBtnLi.innerHTML = `<button id="openPopupBtn" class="nav-link btn btn-purple text-white px-3 mt-1 mt-lg-0 border-0" type="button">Subscribe</button>`;
        navbarNav.appendChild(popupBtnLi);

        const themeToggleLi = document.createElement("li");
        themeToggleLi.className = "nav-item ms-lg-2";
        themeToggleLi.innerHTML = `
            <button id="themeToggleBtn" class="nav-link btn btn-outline-purple px-3 mt-1 mt-lg-0" type="button">
                ☀️ Day Mode
            </button>
        `;
        navbarNav.appendChild(themeToggleLi);

        const themeToggleBtn = document.getElementById("themeToggleBtn");
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
            const isDayMode = document.body.classList.toggle("day-theme");

            themeToggleBtn.textContent = isDayMode ? "🌙 Night Mode" : "☀️ Day Mode";

            try {
                localStorage.setItem("hikikomori-theme", isDayMode ? "day" : "night");
            } catch (error) {
                console.log("Theme storage unavailable:", error);
            }
        });
    }


    const popupHTML = `
        <div id="customPopup" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1050; justify-content: center; align-items: center;">
            <div class="bg-dark p-4 rounded border border-purple text-light" style="width: 90%; max-width: 400px; position: relative;">
                <h3 class="text-pink mb-3">Subscribe to Hikikomori</h3>
                <p>Get the latest anime and manga collections straight to your inbox.</p>
                <input type="email" id="popupEmail" class="form-control bg-secondary text-white border-0 mb-3" placeholder="Enter your email...">
                <div class="d-flex justify-content-end gap-2">
                    <button id="closePopupBtn" class="btn btn-secondary btn-sm">Close</button>
                    <button id="submitPopupBtn" class="btn btn-purple btn-sm">Subscribe</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", popupHTML);

    const openPopupBtn = document.getElementById("openPopupBtn");
    const customPopup = document.getElementById("customPopup");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const submitPopupBtn = document.getElementById("submitPopupBtn");

    if (openPopupBtn && customPopup) {
        openPopupBtn.addEventListener("click", () => {
            playClickSound();
            customPopup.style.display = "flex";
        });

        closePopupBtn.addEventListener("click", () => {
            customPopup.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === customPopup) {
                customPopup.style.display = "none";
            }
        });

        submitPopupBtn.addEventListener("click", () => {
            const val = document.getElementById("popupEmail").value;
            if (val.includes("@")) {
                playClickSound();
                alert("Thank you for subscribing!");
                customPopup.style.display = "none";
            } else {
                alert("Please enter a valid email!");
            }
        });
    }

    const navbarBrand = document.querySelector(".navbar-brand");
    if (navbarBrand) {
        const colorBtn = document.createElement("button");
        colorBtn.id = "changeColorBtn";
        colorBtn.className = "btn btn-sm btn-outline-purple text-white ms-3";
        colorBtn.textContent = "🎨 Change Theme";
        navbarBrand.after(colorBtn);

        const backgroundColors = [
            "rgba(251, 252, 252, 0.95)", 
            "rgba(142, 231, 245, 0.95)",
            "rgba(236, 166, 247, 0.95)",
            "rgba(169, 252, 168, 0.95)"
        ];
        let colorIndex = 0;

        colorBtn.addEventListener("click", () => {
            playClickSound();
            colorIndex = (colorIndex + 1) % backgroundColors.length;

            const mainContent = document.querySelector(".main-content") || document.querySelector("main");
            if (mainContent) {
                mainContent.style.backgroundColor = backgroundColors[colorIndex];
            } else {
                document.body.style.backgroundColor = backgroundColors[colorIndex];
            }
        });
    }



    const mainFooter = document.querySelector("footer.main-footer");
    
    if (mainFooter) {
        const timeDiv = document.createElement("div");
        timeDiv.id = "live-clock";
        timeDiv.className = "text-pink mt-1 small";
        mainFooter.appendChild(timeDiv);

        function updateClock() {
            const now = new Date();
            const options = { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric',
                hour12: true 
            };
            timeDiv.textContent = now.toLocaleDateString('en-US', options);
        }

        updateClock();
        setInterval(updateClock, 1000);

        function getTimeGreeting() {
            const hour = new Date().getHours();
            let message = "";

            if (hour < 12) {
                message = "🌅 Good morning, anime fan! Ready to explore new collections?";
            } else if (hour < 18) {
                message = "☀️ Good afternoon! Check out our top-rated anime list.";
            } else {
                message = "🌙 Good evening! Perfect time for a night anime marathon.";
            }
            return message;
        }

        const greetingContainer = document.createElement("div");
        greetingContainer.className = "time-greeting text-center my-2 small";
        greetingContainer.textContent = getTimeGreeting();
        mainFooter.appendChild(greetingContainer);
    }


    const reviewForm = document.querySelector("form");
    if (reviewForm) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "text-danger mb-3 fw-bold";
        reviewForm.prepend(errorDiv);

        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault(); 

            const nameInput = document.getElementById("userName");
            const emailInput = document.getElementById("userEmail");
            
            if (nameInput && emailInput) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();

                if (name.length < 2) {
                    errorDiv.textContent = "Error: Name must be at least 2 characters long.";
                    nameInput.focus();
                    return;
                }

                if (!email.includes("@") || !email.includes(".")) {
                    errorDiv.textContent = "Error: Please enter a valid email address (must include '@' and '.').";
                    emailInput.focus();
                    return;
                }

                playClickSound();
                errorDiv.className = "text-success mb-3 fw-bold";
                errorDiv.textContent = "Success! Your review/form has been validated successfully.";
            }
        });
    }


    const sidebarLinks = document.querySelectorAll(".sidebar .nav-item a");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", () => {
            console.log("Clicked section:", link.textContent);
        });
    });

    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    if (navLinks.length > 0) {
        document.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
            }

            const activeElement = document.activeElement;
            if (activeElement.matches("input, textarea, select, [contenteditable]")) {
                return;
            }

            const currentIndex = Array.from(navLinks).indexOf(activeElement);
            if (currentIndex === -1) return;

            event.preventDefault();
            let nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex = (currentIndex + 1) % navLinks.length;
            } else {
                nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            }

            navLinks[nextIndex].focus();
        });
    }


    const animeData = [
        { title: "Oregairu", quote: "Hikigaya Hachiman: 'Soft words can sometimes be a curse.'" },
        { title: "Bleach", quote: "Kurosaki Ichigo: 'If I protect the world, I won't be able to protect you.'" },
        { title: "Hunter x Hunter", quote: "Killua Zoldyck: 'People only ever find me when they're looking to bleed.'" },
        { title: "Jujutsu Kaisen", quote: "Gojo Satoru: 'Throughout heaven and earth, I alone am the honored one.'" }
    ];

    animeData.forEach((anime) => {
        console.log(`Anime: ${anime.title} -> ${anime.quote}`);
    });

    const cards = document.querySelectorAll(".custom-card, .gallery-item, .card");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
        cards.forEach((card, index) => {
            card.classList.add("js-animated-card");
            setTimeout(() => {
                card.classList.add("is-visible");
            }, 100 * index);
        });
    }
});