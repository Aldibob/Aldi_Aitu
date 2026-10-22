const burger = document.getElementById("burger");
const nav_Menu = document.getElementById("nav-menu");

burger.addEventListener("click", function () {
    nav_Menu.classList.toggle("active");
    });

const colorButton = document.getElementById("color-button")

const colors = [
    "#f5f5f5",
    "#d6eaf8",
    "#d5f5e3",
    "#fcf3cf",
    "#f5cba7"
];
let currentColor = 0;


if(colorButton) {
    colorButton.addEventListener("click", () => {
        document.body.style.backgroundColor = colors[currentColor];

        currentColor++;

        if(currentColor >= colors.length) {
            currentColor = 0;
        }
    })

}

const datetime = document.getElementById("datetime");

if(datetime) {
    function showDateTime() {
        const now = new Date();

        const formattedDate = now.toLocaleString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        document.getElementById("datetime").textContent = formattedDate;
    }
    showDateTime();
    setInterval(showDateTime, 1000);
}

const questions = document.querySelectorAll(".accordion-header");

questions.forEach(function(question) {
    question.addEventListener("click", function() {
        const item = question.parentElement;
        const content = item.querySelector(".accordion-content");
        const icon = question.querySelector("span");

        item.classList.toggle("active");

        if(item.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = "-";
        } else {
            content.style.maxHeight = "0";
            icon.textContent = "+";
        }
    });
});

const form = document.querySelector("form");

const name = document.getElementById("name");
const password = document.getElementById("pass");
const password_Confirm = document.getElementById("pass-confirm");
const email = document.getElementById("email");
const agree = document.getElementById("agree")
const errorsBlock = document.getElementById("errors");

let error = [];

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    error = [];

    if(name.value.trim() === "") {
        error.push("Enter a nickname.");
    }

    if(password.value.length < 8) {
        error.push("Password is less than 8 charaters.")
    }

    if(password.value !== password_Confirm.value) {
        error.push("Passwords does not match.")
    }

    if(!/[0-9]/.test(password.value)) {
        error.push("Password should contain digit")
    }

    if(!/[a-z]/.test(password.value)) {
        error.push("Password should contain lowercase letter.")
    }

    if(!/[A-Z]/.test(password.value)) {
        error.push("Password should contain uppercase letter.")
    }

    if(!/^[^\s&@#$!/]+@[^\s&@#$!/]+\.[^\s&@#$!/]+$/.test(email.value)) {
        error.push("Please enter a valid email.")
    }

    if(!agree.checked) {
        error.push("You must agree with the terms.")
    }

    if(error.length > 0) {
        errorsBlock.textContent = error.join("\n");
        errorsBlock.style.color = "red";
    } else {
        errorsBlock.textContent = "Registration successful!";
        errorsBlock.style.color = "green";
    }
})

const openButton = document.getElementById("open-contact");
const cancelButton = document.getElementById("cancel-contact");
const popup = document.getElementById("contact-popup");
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (openButton && popup) {
    openButton.addEventListener("click", () => {
        popup.classList.add("active");
    });
}

function closePopup() {
    if (popup) {
        popup.classList.remove("active");
    }
}

if (cancelButton) {
    cancelButton.addEventListener("click", closePopup);
}

// Close when clicking outside the popup
if (popup) {
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });
}

// Close with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePopup();
    }
});

// Handle form submission
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        contactStatus.textContent =
            "This demo form is not connected to a server. Your message was not sent.";
        contactStatus.style.color = "red";
    });
}