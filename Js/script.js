document.addEventListener("DOMContentLoaded", () => {
    
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

                errorDiv.className = "text-success mb-3 fw-bold";
                errorDiv.textContent = "Success! Your review/form has been validated successfully.";
                
            }
        });
    }

    const sidebarLinks = document.querySelectorAll(".sidebar .nav-item a");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            console.log("Clicked section:", link.textContent);
        });
    });

    const navbarNav = document.querySelector(".navbar-nav");
    if (navbarNav) {
        const popupBtnLi = document.createElement("li");
        popupBtnLi.className = "nav-item";
        popupBtnLi.innerHTML = `<button id="openPopupBtn" class="nav-link btn btn-purple text-white px-3 mt-1 mt-lg-0 border-0">Subscribe</button>`;
        navbarNav.appendChild(popupBtnLi);
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
    }

});