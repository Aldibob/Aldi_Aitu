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


        const reviewForm = document.querySelector("body.oregairu form");

    if (reviewForm) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "text-danger mb-3 fw-bold";
        reviewForm.prepend(errorDiv);

        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("userName");
            const emailInput = document.getElementById("userEmail");
            const submitButton = reviewForm.querySelector('button[type="submit"]');

            if (!nameInput || !emailInput || !submitButton) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();

            if (name.length < 2) {
                errorDiv.className = "text-danger mb-3 fw-bold";
                errorDiv.textContent = "Error: Name must be at least 2 characters long.";
                nameInput.focus();
                return;
            }

            if (!email.includes("@") || !email.includes(".")) {
                errorDiv.className = "text-danger mb-3 fw-bold";
                errorDiv.textContent = "Error: Please enter a valid email address.";
                emailInput.focus();
                return;
            }

            playClickSound();

            const originalText = submitButton.innerHTML;

            
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"
                      role="status" aria-hidden="true"></span>
                Please wait...
            `;

            errorDiv.textContent = "";

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;

                errorDiv.className = "text-success mb-3 fw-bold";
                errorDiv.textContent =
                    "Success! Your review/form has been validated successfully.";

                if (typeof window.showToast === "function") {
                    window.showToast("Your review was submitted successfully!");
                }
            }, 1500);
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

$(document).ready(function () {

    console.log("jQuery is ready!");


    const gallery = $(".image-gallery");
    const galleryItems = gallery.find(".gallery-item");

    if (gallery.length && galleryItems.length) {

        const searchContainer = $(`
            <div class="anime-search-container my-4">
                <label for="animeSearch" class="form-label">
                    Search anime:
                </label>

                <input
                    type="text"
                    id="animeSearch"
                    class="form-control"
                    placeholder="Type an anime name..."
                    autocomplete="off"
                >

                <ul id="animeSuggestions"
                    class="list-group mt-1"
                    style="display: none;">
                </ul>

                <p id="searchResult"
                   class="small mt-2"
                   aria-live="polite">
                </p>
            </div>
        `);

        gallery.before(searchContainer);

        const searchInput = $("#animeSearch");
        const suggestions = $("#animeSuggestions");
        const searchResult = $("#searchResult");

        const animeTitles = [];

        galleryItems.each(function () {
            const imageAlt = $(this).find("img").first().attr("alt");
            const cardTitle = $(this).find(
                "h1, h2, h3, h4, h5, .card-title"
            ).first().text().trim();

            const title = cardTitle || imageAlt;

            if (title && !animeTitles.includes(title)) {
                animeTitles.push(title);
            }
        });

        function removeHighlights() {
            galleryItems.find("mark.search-highlight").each(function () {
                $(this).replaceWith(document.createTextNode($(this).text()));
            });
        }

        function highlightText(element, query) {
            if (!query) return;

            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {
                        const parent = node.parentElement;

                        if (!parent) return NodeFilter.FILTER_REJECT;

                        if (
                            ["SCRIPT", "STYLE", "MARK"].includes(parent.tagName)
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return node.textContent.toLowerCase().includes(
                            query.toLowerCase()
                        )
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            const textNodes = [];

            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach(function (node) {
                const text = node.textContent;
                const lowerText = text.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const index = lowerText.indexOf(lowerQuery);

                if (index === -1) return;

                const fragment = document.createDocumentFragment();

                fragment.appendChild(
                    document.createTextNode(text.substring(0, index))
                );

                const mark = document.createElement("mark");
                mark.className = "search-highlight";
                mark.textContent = text.substring(
                    index,
                    index + query.length
                );

                fragment.appendChild(mark);

                fragment.appendChild(
                    document.createTextNode(text.substring(index + query.length))
                );

                node.parentNode.replaceChild(fragment, node);
            });
        }

        function filterAnime(query) {
            removeHighlights();

            let visibleCount = 0;

            galleryItems.each(function () {
                const item = $(this);
                const itemText = item.text().toLowerCase();
                const imageAlt = (
                    item.find("img").first().attr("alt") || ""
                ).toLowerCase();

                const matches =
                    itemText.includes(query.toLowerCase()) ||
                    imageAlt.includes(query.toLowerCase());

                item.toggle(matches);

                if (matches) {
                    visibleCount++;
                    highlightText(this, query);
                }
            });

            if (query.trim() === "") {
                searchResult.text("");
            } else {
                searchResult.text(
                    visibleCount + " anime result(s) found."
                );
            }
        }

        searchInput.on("input", function () {
            const query = $(this).val().trim();

            filterAnime(query);

            suggestions.empty();

            if (query.length === 0) {
                suggestions.hide();
                return;
            }

            const matchingTitles = animeTitles.filter(function (title) {
                return title.toLowerCase().includes(query.toLowerCase());
            });

            matchingTitles.forEach(function (title) {
                const suggestion = $("<li>")
                    .addClass("list-group-item list-group-item-action")
                    .text(title)
                    .css("cursor", "pointer");

                suggestion.on("click", function () {
                    searchInput.val(title);
                    filterAnime(title);
                    suggestions.hide();
                });

                suggestions.append(suggestion);
            });

            if (matchingTitles.length > 0) {
                suggestions.show();
            } else {
                suggestions.hide();
            }
        });

        $(document).on("click", function (event) {
            if (!$(event.target).closest(".anime-search-container").length) {
                suggestions.hide();
            }
        });
    }


    $("body").prepend(`
        <div id="scrollProgressContainer">
            <div id="scrollProgress"></div>
        </div>
    `);

    $("#scrollProgressContainer").css({
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "6px",
        background: "rgba(128, 128, 128, 0.2)",
        zIndex: "2000"
    });

    $("#scrollProgress").css({
        height: "100%",
        width: "0%",
        background: "linear-gradient(to right, #a855f7, #ec4899)",
        transition: "width 0.1s linear"
    });

    function updateScrollProgress() {
        const scrollTop = $(window).scrollTop();

        const documentHeight =
            $(document).height() - $(window).height();

        let percentage = 0;

        if (documentHeight > 0) {
            percentage = (scrollTop / documentHeight) * 100;
        }

        $("#scrollProgress").css("width", percentage + "%");
    }

    $(window).on("scroll resize", updateScrollProgress);
    updateScrollProgress();

    if ($(".image-gallery").length) {

        const galleryCount = $(".image-gallery .gallery-item").length;
        const featuredCount = $(".custom-card-group .custom-card").length;

        const statsSection = $(`
            <div class="anime-stats row text-center my-4">
                <div class="col-6 col-md-3 mb-3">
                    <div class="p-3 rounded">
                        <h3 class="counter" data-target="${galleryCount}">0</h3>
                        <p>Gallery Anime</p>
                    </div>
                </div>

                <div class="col-6 col-md-3 mb-3">
                    <div class="p-3 rounded">
                        <h3 class="counter" data-target="${featuredCount}">0</h3>
                        <p>Featured Anime</p>
                    </div>
                </div>
            </div>
        `);

        $(".image-gallery").before(statsSection);

        let counterStarted = false;

        function startCounters() {
            if (counterStarted) return;

            const sectionTop = statsSection.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();

            if (windowBottom > sectionTop) {
                counterStarted = true;

                $(".counter").each(function () {
                    const counter = $(this);
                    const target = Number(counter.attr("data-target"));

                    $({ value: 0 }).animate(
                        { value: target },
                        {
                            duration: 1500,
                            easing: "swing",
                            step: function () {
                                counter.text(Math.floor(this.value));
                            },
                            complete: function () {
                                counter.text(target);
                            }
                        }
                    );
                });
            }
        }

        $(window).on("scroll", startCounters);
        startCounters();
    }

    $("body").append(`
        <div id="toastContainer"
             style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 3000;
             ">
        </div>
    `);

    window.showToast = function (message) {
        const toast = $("<div>")
            .addClass("custom-toast")
            .text(message)
            .css({
                background: "#8b5cf6",
                color: "white",
                padding: "12px 20px",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                opacity: "0",
                display: "none"
            });

        $("#toastContainer").append(toast);

        toast.fadeIn(300).animate(
            { opacity: 1 },
            200
        );

        setTimeout(function () {
            toast.fadeOut(400, function () {
                $(this).remove();
            });
        }, 2500);
    };


    if ($("body.oregairu .oregairu-main").length) {

        const quoteContainer = $(`
            <div class="quote-copy-box my-4 p-3 rounded" style="background-color: #1e1e2f; color: #f8fafc; border: 1px solid rgba(168, 85, 247, 0.4);">
                <p class="mb-2">
                    <strong style="color: #c084fc;">Oregairu Quote:</strong>
                </p>

                <p id="animeQuote" style="color: #e2e8f0; font-style: italic;">
                    Soft words can sometimes be a curse.
                </p>

                <button type="button"
                        id="copyQuoteBtn"
                        class="btn btn-sm"
                        style="background-color: #9333ea; color: #ffffff; border: none;"
                        title="Copy to clipboard">
                    <span class="copy-icon">📋</span>
                    Copy quote
                </button>
            </div>
        `);

        $(".oregairu-main").append(quoteContainer);

        $("#copyQuoteBtn").on("click", async function () {
            const quote = $("#animeQuote").text().trim();
            const button = $(this);

            try {
                await navigator.clipboard.writeText(quote);

                button.html('<span>✓</span> Copied!');
                button.attr("title", "Copied to clipboard!");

                window.showToast("Quote copied to clipboard!");

                setTimeout(function () {
                    button.html('<span>📋</span> Copy quote');
                    button.attr("title", "Copy to clipboard");
                }, 2000);

            } catch (error) {
                console.error("Clipboard error:", error);
                window.showToast("Could not copy the quote.");
            }
        });
    }

    const lazyImages = $(
        ".image-gallery img, .custom-card img, .oregairu-main img"
    );

    lazyImages.each(function () {
        const image = $(this);

        const originalSource =
            image.attr("data-src") || image.attr("src");

        if (!originalSource) return;

        image.attr("data-src", originalSource);
        image.removeAttr("src");
        image.addClass("lazy-image");
    });

    function loadVisibleImages() {
        lazyImages.each(function () {
            const image = $(this);

            if (!image.attr("data-src")) return;

            const position = image.offset();
            if (!position) return;
            const imageTop = position.top;

            const windowBottom =
                $(window).scrollTop() + $(window).height();

            if (windowBottom + 200 > imageTop) {
                image.attr("src", image.attr("data-src"));
                image.removeAttr("data-src");
                image.removeClass("lazy-image");
            }
        });
    }

    $(window).on("scroll resize", loadVisibleImages);
    loadVisibleImages();

    $(document).on("click", "#star-rating .star", function () {
        window.showToast("Thank you for rating Oregairu!");
    });

    $("#submitPopupBtn").on("click", function () {
        const email = $("#popupEmail").val().trim();

        if (email.includes("@") && email.includes(".")) {
            window.showToast("Thank you for subscribing!");
        }
    });

});