/* ==========================================================
   main.js — общий скрипт для всех страниц Hikikomori.lab
   ========================================================== */

// ----- Burger menu (custom-header pages) -----
const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");

if (burger && navMenu) {
    burger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// ----- Theme colour toggle (custom-header pages) -----
const colorButton = document.getElementById("color-button");
const colors = ["#f5cba7", "#1a1a1a"];
let currentColor = 0;

if (colorButton) {
    colorButton.addEventListener("click", () => {
        document.body.style.backgroundColor = colors[currentColor];
        currentColor = (currentColor + 1) % colors.length;
    });
}

// ----- Live date/time block -----
const datetimeEl = document.getElementById("datetime");

if (datetimeEl) {
    function showDateTime() {
        datetimeEl.textContent = new Date().toLocaleString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }
    showDateTime();
    setInterval(showDateTime, 1000);
}

// ----- FAQ Accordion -----
document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
        const item = header.parentElement;
        const content = item.querySelector(".accordion-content");
        const icon = header.querySelector("span");

        item.classList.toggle("active");

        if (item.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = "-";
        } else {
            content.style.maxHeight = "0";
            icon.textContent = "+";
        }
    });
});

// ----- Registration form validation -----
const registrationForm = document.querySelector("body:not(.oregairu) > footer form, body > main form#reg-form");
const nameInput        = document.getElementById("name");
const passwordInput    = document.getElementById("pass");
const passwordConfirm  = document.getElementById("pass-confirm");
const emailInput       = document.getElementById("email");
const agreeCheckbox    = document.getElementById("agree");
const errorsBlock      = document.getElementById("errors");

if (nameInput && passwordInput && errorsBlock) {
    const form = nameInput.closest("form");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const errors = [];

            if (nameInput.value.trim() === "") {
                errors.push("Enter a nickname.");
            }
            if (nameInput.value.length < 3) {
                errors.push("Nickname must be at least 3 characters long.");
            }
            if (/^[ ]/.test(nameInput.value)) {
                errors.push("Nickname can't start with a space.");
            }
            if (passwordInput.value.length < 8) {
                errors.push("Password must be at least 8 characters.");
            }
            if (passwordInput.value !== passwordConfirm.value) {
                errors.push("Passwords do not match.");
            }
            if (!/[0-9]/.test(passwordInput.value)) {
                errors.push("Password must contain a digit.");
            }
            if (!/[a-z]/.test(passwordInput.value)) {
                errors.push("Password must contain a lowercase letter.");
            }
            if (!/[A-Z]/.test(passwordInput.value)) {
                errors.push("Password must contain an uppercase letter.");
            }
            if (!/^(?!.*\.\.)[\\w.]+@[\\w]+\.[\\w]{2,}$/.test(emailInput.value)) {
                errors.push("Please enter a valid email.");
            }
            if (agreeCheckbox && !agreeCheckbox.checked) {
                errors.push("You must agree with the terms.");
            }

            errorsBlock.style.whiteSpace = "pre-line";
            if (errors.length > 0) {
                errorsBlock.textContent = errors.join("\n");
                errorsBlock.style.color = "red";
            } else {
                errorsBlock.textContent = "Registration successful!";
                errorsBlock.style.color = "green";
            }
        });
    }
}

// ----- Contact popup -----
const openContactBtn    = document.getElementById("open-contact");
const cancelContactBtn  = document.getElementById("cancel-contact");
const contactPopup      = document.getElementById("contact-popup");
const contactForm       = document.getElementById("contact-form");
const errorsBlockContact = document.getElementById("errors-contact");
const ContactNameInput  = document.getElementById("contact-name");
const ContactEmailInput = document.getElementById("contact-email");

function closeContactPopup() {
    if (contactPopup) contactPopup.classList.remove("active");
}

if (openContactBtn && contactPopup) {
    openContactBtn.addEventListener("click", () => {
        contactPopup.classList.add("active");
    });
}

if (cancelContactBtn) {
    cancelContactBtn.addEventListener("click", closeContactPopup);
}

if (contactPopup) {
    contactPopup.addEventListener("click", (e) => {
        if (e.target === contactPopup) closeContactPopup();
    });
}

if (contactForm && errorsBlockContact) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const errors = [];

        if (ContactNameInput && ContactNameInput.value.trim() === "") {
            errors.push("Enter a name.");
        }
        if (ContactNameInput && /^[ ]/.test(ContactNameInput.value)) {
            errors.push("Name can't start with a space.");
        }
        if (ContactEmailInput && !/^(?!.*\.\.)[\\w.]+@[\\w]+\.[\\w]{2,}$/.test(ContactEmailInput.value)) {
            errors.push("Please enter a valid email.");
        }

        if (errors.length > 0) {
            errorsBlockContact.textContent = errors.join("\n");
            errorsBlockContact.style.color = "red";
        } else {
            errorsBlockContact.textContent = "Message sent successfully!";
            errorsBlockContact.style.color = "green";
        }
    });
}

// ----- Scroll progress bar (custom pages) -----
const progressBar = document.getElementById("progress-bar");

if (progressBar) {
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + "%";
    });
}

// ----- Manga counter animation (index.html) -----
const mangaCounter = document.getElementById("manga-counter");

if (mangaCounter && typeof $ !== "undefined") {
    $({ count: 0 }).animate(
        { count: $(mangaCounter).data("target") },
        {
            duration: 2000,
            step: function () {
                mangaCounter.textContent = Math.floor(this.count);
            },
            complete: function () {
                mangaCounter.textContent = this.count;
            }
        }
    );
}

// ----- Search bar with suggestions (index.html, jQuery) -----
if (typeof $ !== "undefined" && $("#search-bar").length) {

    const mangaList = ["Bleach", "Demon Slayer", "Hunter x Hunter", "Jujutsu Kaisen", "Kaguya Sama", "Oregairu"];

    $("#search-bar").on("input", () => {
        const term = $("#search-bar").val().toLowerCase().trim();

        // Reset text nodes before highlighting
        $(".gallery-item h3, .gallery-item p").each(function () {
            $(this).text($(this).text());
        });

        // Filter gallery cards
        $(".gallery-item").each(function () {
            const title = $(this).find("h3").text().toLowerCase().trim();
            $(this).toggle(term === "" || title.includes(term));
        });

        // Suggestions dropdown
        const $suggestions = $("#suggestions");
        $suggestions.empty();

        if (term === "") {
            $suggestions.hide();
            return;
        }

        $suggestions.show();
        mangaList
            .filter((m) => m.toLowerCase().includes(term))
            .forEach((m) => {
                $suggestions.append(`<div class="suggestion-item">${m}</div>`);
            });

        // Highlight matching text
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedTerm, "gi");

        $(".gallery-item h3, .gallery-item p").each(function () {
            const highlighted = $(this).text().replace(
                regex,
                (match) => `<span class="highlight">${match}</span>`
            );
            $(this).html(highlighted);
        });
    });

    // Suggestion click selects item
    $("#suggestions").on("click", ".suggestion-item", function () {
        $("#search-bar").val($(this).text()).trigger("input");
        $("#suggestions").empty().hide();
    });

    // Copy search text
    $("#copy-search").on("click", function () {
        const text = $("#search-bar").val();

        if (text.trim() === "") {
            showToast("Search bar is empty!");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => showToast("Text copied successfully!"))
            .catch(() => showToast("Failed to copy text!"));
    });
}

/* ==========================================================
   ADVANCED FEATURES (jQuery — script.js logic)
   Only runs when jQuery is available
   ========================================================== */
if (typeof $ !== "undefined") {
    $(document).ready(function () {

        // ----- Audio feedback utility -----
        let audioContext = null;

        function playClickSound() {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;

                if (!audioContext) audioContext = new AudioContextClass();
                if (audioContext.state === "suspended") audioContext.resume();

                const oscillator = audioContext.createOscillator();
                const gainNode   = audioContext.createGain();

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
            } catch (err) {
                console.log("Audio unavailable:", err);
            }
        }

        // ----- Toast notification utility -----
        $("body").append(`<div id="toastContainer" style="position:fixed;bottom:20px;right:20px;z-index:3000;"></div>`);

        window.showToast = function (message) {
            const toast = $("<div>")
                .text(message)
                .css({
                    background: "#8b5cf6",
                    color: "white",
                    padding: "12px 20px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    display: "none"
                });

            $("#toastContainer").append(toast);
            toast.fadeIn(300);

            setTimeout(() => {
                toast.fadeOut(400, function () { $(this).remove(); });
            }, 2500);
        };

        // ----- Scroll progress bar (Bootstrap pages) -----
        $("body").prepend(`
            <div id="scrollProgressContainer">
                <div id="scrollProgress"></div>
            </div>
        `);

        $("#scrollProgressContainer").css({
            position: "fixed", top: "0", left: "0",
            width: "100%", height: "6px",
            background: "rgba(128,128,128,0.2)", zIndex: "2000"
        });

        $("#scrollProgress").css({
            height: "100%", width: "0%",
            background: "linear-gradient(to right, #a855f7, #ec4899)",
            transition: "width 0.1s linear"
        });

        function updateScrollProgress() {
            const docHeight = $(document).height() - $(window).height();
            const pct = docHeight > 0 ? ($(window).scrollTop() / docHeight) * 100 : 0;
            $("#scrollProgress").css("width", pct + "%");
        }

        $(window).on("scroll resize", updateScrollProgress);
        updateScrollProgress();

        // ----- Lazy image loading -----
        const lazyImages = $(".image-gallery img, .custom-card img, .oregairu-main img");

        lazyImages.each(function () {
            const img = $(this);
            const src = img.attr("data-src") || img.attr("src");
            if (!src) return;
            img.attr("data-src", src).removeAttr("src").addClass("lazy-image");
        });

        function loadVisibleImages() {
            lazyImages.each(function () {
                const img = $(this);
                if (!img.attr("data-src")) return;

                const pos = img.offset();
                if (!pos) return;

                if ($(window).scrollTop() + $(window).height() + 200 > pos.top) {
                    img.attr("src", img.attr("data-src")).removeAttr("data-src").removeClass("lazy-image");
                }
            });
        }

        $(window).on("scroll resize", loadVisibleImages);
        loadVisibleImages();

        // ----- Card entrance animations -----
        const cards = document.querySelectorAll(".custom-card, .gallery-item, .card");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reducedMotion) {
            cards.forEach((card, i) => {
                card.classList.add("js-animated-card");
                setTimeout(() => card.classList.add("is-visible"), 100 * i);
            });
        }

        // ----- Bootstrap-page navbar extras -----
        const $navbarNav = $(".navbar-nav");

        if ($navbarNav.length) {

            // Subscribe button
            $navbarNav.append(`
                <li class="nav-item">
                    <button id="openPopupBtn" class="nav-link btn btn-purple text-white px-3 mt-1 mt-lg-0 border-0" type="button">Subscribe</button>
                </li>
            `);

            // Theme toggle button
            $navbarNav.append(`
                <li class="nav-item ms-lg-2">
                    <button id="themeToggleBtn" class="nav-link btn btn-outline-purple px-3 mt-1 mt-lg-0" type="button">☀️ Day Mode</button>
                </li>
            `);

            const $themeBtn = $("#themeToggleBtn");

            // Restore saved theme
            try {
                if (localStorage.getItem("hikikomori-theme") === "day") {
                    document.body.classList.add("day-theme");
                    $themeBtn.text("🌙 Night Mode");
                }
            } catch (e) {
                console.log("Theme storage unavailable:", e);
            }

            $themeBtn.on("click", () => {
                playClickSound();
                const isDay = document.body.classList.toggle("day-theme");
                $themeBtn.text(isDay ? "🌙 Night Mode" : "☀️ Day Mode");
                try {
                    localStorage.setItem("hikikomori-theme", isDay ? "day" : "night");
                } catch (e) {
                    console.log("Theme storage unavailable:", e);
                }
            });

            // Change-theme colour button (next to brand)
            const $brand = $(".navbar-brand");
            if ($brand.length) {
                const $colorBtn = $(`<button id="changeColorBtn" class="btn btn-sm btn-outline-purple text-white ms-3" type="button">🎨 Change Theme</button>`);
                $brand.after($colorBtn);

                const bgColors = [
                    "rgba(251,252,252,0.95)",
                    "rgba(142,231,245,0.95)",
                    "rgba(236,166,247,0.95)",
                    "rgba(169,252,168,0.95)"
                ];
                let colorIdx = 0;

                $colorBtn.on("click", () => {
                    playClickSound();
                    colorIdx = (colorIdx + 1) % bgColors.length;
                    const $main = $(".main-content, main").first();
                    ($main.length ? $main : $("body")).css("background-color", bgColors[colorIdx]);
                });
            }
        }

        // ----- Subscribe popup -----
        const popupHTML = `
            <div id="customPopup" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:1050;justify-content:center;align-items:center;">
                <div class="bg-dark p-4 rounded border border-purple text-light" style="width:90%;max-width:400px;">
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
        $("body").append(popupHTML);

        const $customPopup = $("#customPopup");

        $("#openPopupBtn").on("click", () => {
            playClickSound();
            $customPopup.css("display", "flex");
        });

        $("#closePopupBtn").on("click", () => $customPopup.hide());

        $(window).on("click", (e) => {
            if (e.target === $customPopup[0]) $customPopup.hide();
        });

        $("#submitPopupBtn").on("click", function () {
            const val = $("#popupEmail").val().trim();
            if (val.includes("@") && val.includes(".")) {
                playClickSound();
                window.showToast("Thank you for subscribing!");
                $customPopup.hide();
            } else {
                window.showToast("Please enter a valid email!");
            }
        });

        // ----- Footer live clock & greeting -----
        const $footer = $("footer.main-footer");

        if ($footer.length) {
            const $clock = $(`<div id="live-clock" class="text-pink mt-1 small"></div>`);
            $footer.append($clock);

            function updateClock() {
                $clock.text(new Date().toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                    hour: "numeric", minute: "numeric", second: "numeric", hour12: true
                }));
            }
            updateClock();
            setInterval(updateClock, 1000);

            function getTimeGreeting() {
                const h = new Date().getHours();
                if (h < 12) return "🌅 Good morning, anime fan! Ready to explore new collections?";
                if (h < 18) return "☀️ Good afternoon! Check out our top-rated anime list.";
                return "🌙 Good evening! Perfect time for a night anime marathon.";
            }

            $footer.append(
                $(`<div class="time-greeting text-center my-2 small"></div>`).text(getTimeGreeting())
            );
        }

        // ----- Oregairu: star rating -----
        const $oregairuMain = $("body.oregairu .oregairu-main");

        if ($oregairuMain.length) {
            const $ratingContainer = $(`
                <div class="rating-container my-3 p-3 rounded">
                    <p class="mb-2">Rate Oregairu:</p>
                    <div id="star-rating" role="group" aria-label="Rate Oregairu from 1 to 5 stars">
                        <button class="star" data-value="1" type="button" aria-label="1 star">☆</button>
                        <button class="star" data-value="2" type="button" aria-label="2 stars">☆</button>
                        <button class="star" data-value="3" type="button" aria-label="3 stars">☆</button>
                        <button class="star" data-value="4" type="button" aria-label="4 stars">☆</button>
                        <button class="star" data-value="5" type="button" aria-label="5 stars">☆</button>
                    </div>
                    <small id="rating-output" aria-live="polite">Click a star to rate</small>
                </div>
            `);

            $oregairuMain.prepend($ratingContainer);

            $ratingContainer.find(".star").on("click", function () {
                playClickSound();
                const val = Number($(this).data("value"));

                $ratingContainer.find(".star").each(function (i) {
                    const sel = i < val;
                    $(this).text(sel ? "★" : "☆")
                           .toggleClass("selected", sel)
                           .attr("aria-pressed", String(sel));
                });

                $ratingContainer.find("#rating-output").text(`Thank you! You rated Oregairu ${val}/5 stars.`);
                window.showToast("Thank you for rating Oregairu!");
            });

            // ----- Oregairu: quote copy -----
            $oregairuMain.append(`
                <div class="quote-copy-box my-4 p-3 rounded" style="background-color:#1e1e2f;color:#f8fafc;border:1px solid rgba(168,85,247,0.4);">
                    <p class="mb-2"><strong style="color:#c084fc;">Oregairu Quote:</strong></p>
                    <p id="animeQuote" style="color:#e2e8f0;font-style:italic;">Soft words can sometimes be a curse.</p>
                    <button type="button" id="copyQuoteBtn" class="btn btn-sm"
                            style="background-color:#9333ea;color:#ffffff;border:none;"
                            title="Copy to clipboard">
                        <span class="copy-icon">📋</span> Copy quote
                    </button>
                </div>
            `);

            $("#copyQuoteBtn").on("click", async function () {
                const quote = $("#animeQuote").text().trim();
                try {
                    await navigator.clipboard.writeText(quote);
                    $(this).html("<span>✓</span> Copied!").attr("title", "Copied!");
                    window.showToast("Quote copied to clipboard!");
                    setTimeout(() => {
                        $("#copyQuoteBtn").html('<span>📋</span> Copy quote').attr("title", "Copy to clipboard");
                    }, 2000);
                } catch (err) {
                    console.error("Clipboard error:", err);
                    window.showToast("Could not copy the quote.");
                }
            });

            // ----- Oregairu: review form validation -----
            const $reviewForm = $("body.oregairu form").not("#contact-form");

            if ($reviewForm.length) {
                const $errorDiv = $(`<div class="text-danger mb-3 fw-bold"></div>`);
                $reviewForm.prepend($errorDiv);

                $reviewForm.on("submit", function (e) {
                    e.preventDefault();

                    const $nameIn  = $("#userName");
                    const $emailIn = $("#userEmail");
                    const $submit  = $reviewForm.find('button[type="submit"]');

                    if (!$nameIn.length || !$emailIn.length) return;

                    const name  = $nameIn.val().trim();
                    const email = $emailIn.val().trim();

                    if (name.length < 2) {
                        $errorDiv.removeClass("text-success").addClass("text-danger")
                                 .text("Error: Name must be at least 2 characters long.");
                        $nameIn.focus();
                        return;
                    }

                    if (!email.includes("@") || !email.includes(".")) {
                        $errorDiv.removeClass("text-success").addClass("text-danger")
                                 .text("Error: Please enter a valid email address.");
                        $emailIn.focus();
                        return;
                    }

                    playClickSound();
                    const originalHTML = $submit.html();
                    $submit.prop("disabled", true).html(`
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Please wait...
                    `);
                    $errorDiv.text("");

                    setTimeout(() => {
                        $submit.prop("disabled", false).html(originalHTML);
                        $errorDiv.removeClass("text-danger").addClass("text-success")
                                 .text("Success! Your review has been submitted.");
                        window.showToast("Your review was submitted successfully!");
                    }, 1500);
                });
            }
        }

        // ----- Anime Collections gallery search (animecollections.html) -----
        const $gallery    = $(".image-gallery");
        const $galleryItems = $gallery.find(".gallery-item");

        if ($gallery.length && $galleryItems.length) {

            const $searchContainer = $(`
                <div class="anime-search-container my-4">
                    <label for="animeSearch" class="form-label">Search anime:</label>
                    <input type="text" id="animeSearch" class="form-control"
                           placeholder="Type an anime name..." autocomplete="off">
                    <ul id="animeSuggestions" class="list-group mt-1" style="display:none;"></ul>
                    <p id="searchResult" class="small mt-2" aria-live="polite"></p>
                </div>
            `);

            $gallery.before($searchContainer);

            const $animeInput  = $("#animeSearch");
            const $animeSuggest = $("#animeSuggestions");
            const $searchResult = $("#searchResult");
            const animeTitles  = [];

            $galleryItems.each(function () {
                const title = ($(this).find("h1,h2,h3,h4,h5,.card-title").first().text().trim()
                            || $(this).find("img").first().attr("alt") || "");
                if (title && !animeTitles.includes(title)) animeTitles.push(title);
            });

            function removeHighlights() {
                $galleryItems.find("mark.search-highlight").each(function () {
                    $(this).replaceWith(document.createTextNode($(this).text()));
                });
            }

            function highlightText(element, query) {
                if (!query) return;
                const walker = document.createTreeWalker(
                    element, NodeFilter.SHOW_TEXT,
                    {
                        acceptNode(node) {
                            const p = node.parentElement;
                            if (!p || ["SCRIPT", "STYLE", "MARK"].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
                            return node.textContent.toLowerCase().includes(query.toLowerCase())
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT;
                        }
                    }
                );

                const nodes = [];
                while (walker.nextNode()) nodes.push(walker.currentNode);

                nodes.forEach((node) => {
                    const text  = node.textContent;
                    const idx   = text.toLowerCase().indexOf(query.toLowerCase());
                    if (idx === -1) return;

                    const frag = document.createDocumentFragment();
                    frag.appendChild(document.createTextNode(text.substring(0, idx)));
                    const mark = document.createElement("mark");
                    mark.className = "search-highlight";
                    mark.textContent = text.substring(idx, idx + query.length);
                    frag.appendChild(mark);
                    frag.appendChild(document.createTextNode(text.substring(idx + query.length)));
                    node.parentNode.replaceChild(frag, node);
                });
            }

            function filterAnime(query) {
                removeHighlights();
                let visible = 0;

                $galleryItems.each(function () {
                    const matches =
                        $(this).text().toLowerCase().includes(query.toLowerCase()) ||
                        ($(this).find("img").first().attr("alt") || "").toLowerCase().includes(query.toLowerCase());

                    $(this).toggle(matches);
                    if (matches) { visible++; highlightText(this, query); }
                });

                $searchResult.text(query.trim() ? `${visible} anime result(s) found.` : "");
            }

            $animeInput.on("input", function () {
                const query = $(this).val().trim();
                filterAnime(query);

                $animeSuggest.empty();
                if (!query) { $animeSuggest.hide(); return; }

                const matches = animeTitles.filter((t) => t.toLowerCase().includes(query.toLowerCase()));

                matches.forEach((t) => {
                    $("<li>").addClass("list-group-item list-group-item-action")
                             .text(t).css("cursor", "pointer")
                             .on("click", () => {
                                 $animeInput.val(t);
                                 filterAnime(t);
                                 $animeSuggest.hide();
                             })
                             .appendTo($animeSuggest);
                });

                matches.length ? $animeSuggest.show() : $animeSuggest.hide();
            });

            $(document).on("click", (e) => {
                if (!$(e.target).closest(".anime-search-container").length) {
                    $animeSuggest.hide();
                }
            });
        }

        // ----- Stats counters (animecollections.html) -----
        if ($(".image-gallery").length) {
            const galleryCount  = $(".image-gallery .gallery-item").length;
            const featuredCount = $(".custom-card-group .custom-card").length;

            const $statsSection = $(`
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

            $(".image-gallery").before($statsSection);

            let counterStarted = false;

            function startCounters() {
                if (counterStarted) return;
                if ($(window).scrollTop() + $(window).height() > $statsSection.offset().top) {
                    counterStarted = true;
                    $(".counter").each(function () {
                        const $c   = $(this);
                        const tgt  = Number($c.attr("data-target"));
                        $({ value: 0 }).animate(
                            { value: tgt },
                            {
                                duration: 1500,
                                easing: "swing",
                                step()   { $c.text(Math.floor(this.value)); },
                                complete() { $c.text(tgt); }
                            }
                        );
                    });
                }
            }

            $(window).on("scroll", startCounters);
            startCounters();
        }

        // ----- Keyboard navigation for Bootstrap navbar -----
        const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
        if (navLinks.length > 0) {
            document.addEventListener("keydown", (e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                const active = document.activeElement;
                if (active.matches("input, textarea, select, [contenteditable]")) return;

                const idx = Array.from(navLinks).indexOf(active);
                if (idx === -1) return;

                e.preventDefault();
                const next = e.key === "ArrowRight"
                    ? (idx + 1) % navLinks.length
                    : (idx - 1 + navLinks.length) % navLinks.length;
                navLinks[next].focus();
            });
        }

    }); // end $(document).ready
}