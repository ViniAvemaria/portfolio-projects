const storedLanguage = localStorage.getItem("lang") || "pt-br";
const storedTheme = localStorage.getItem("theme");
const themeButton = document.getElementById("theme-btn");

// sets language and theme based on data in localStorage when page is loaded
document.addEventListener("DOMContentLoaded", () => {
    setLanguage(storedLanguage);
    selectedLanguage(storedLanguage);

    if (storedTheme === "light") {
        document.body.classList.add("light");
        themeButton.classList.add("light");
        updateFavicon("light");
    }
});

// updates copyright year
document.getElementById("year").textContent = new Date().getFullYear();

/*
////////////////////////////////////
//////////// NAV MENU //////////////
////////////////////////////////////
*/

// nav button onClick function
function toggleMenu() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");

    navbar.classList.toggle("active");
    hamburger.classList.toggle("active");

    setTimeout(() => {
        navbar.classList.toggle("closing");
    }, 300);
}

const navLinks = document.querySelectorAll(".nav-links");

// closes navbar after clicking a link
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        toggleMenu();
    });
});

/*
////////////////////////////////////
////////// CONTACT FORM ////////////
////////////////////////////////////
*/

const form = document.getElementById("contact-form");

// submits for to formspree
form.addEventListener("submit", function (event) {
    function showStatus(statusToShow) {
        const statuses = [statusSuccess, statusError, statusMissing];
        statuses.forEach((status) => {
            status.style.display = "none";
        });
        statusToShow.style.display = "initial";
    }
    event.preventDefault();

    const statusSuccess = document.getElementById("status-success");
    const statusError = document.getElementById("status-error");
    const statusMissing = document.getElementById("status-missing");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        showStatus(statusMissing);
        return;
    }

    fetch(form.action, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message,
        }),
    })
        .then((response) => {
            if (response.ok) {
                showStatus(statusSuccess);
                form.reset();
            } else {
                showStatus(statusError);
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

/*
////////////////////////////////////
///////// SETTINGS MENU ////////////
////////////////////////////////////
*/

const settingsMenu = document.getElementById("settings-menu");
const settingsButton = document.getElementById("settings-btn");

// settings menu button onClick function
function toggleSettingsMenu() {
    settingsMenu.classList.toggle("active");

    setTimeout(() => {
        settingsMenu.classList.toggle("closing");
    }, 300);
}

// closes settings menu when clicking outside the menu
document.addEventListener("click", (event) => {
    const clickedInsideMenu = settingsMenu.contains(event.target);
    const clickedToggle = settingsButton.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        settingsMenu.classList.remove("active");

        setTimeout(() => {
            settingsMenu.classList.remove("closing");
        }, 300);
    }
});

/*
////////////////////////////////////
////////// CHANGE THEME ////////////
////////////////////////////////////
*/

// theme button onClick function
function changeTheme() {
    themeButton.classList.toggle("light");
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateFavicon(isLight ? "light" : "dark");
}

// changes page's favicon
function updateFavicon(theme) {
    const favicon = document.getElementById("favicon");
    if (!favicon) return;

    const path = theme === "light" ? "assets/favicon-light.ico" : "assets/favicon-dark.ico";
    favicon.setAttribute("href", path);
}

/*
////////////////////////////////////
////////// TRANSLATION /////////////
////////////////////////////////////
*/

// language button onClick function
function changeLanguage() {
    const currentLanguage = localStorage.getItem("lang");
    const differentLanguage = currentLanguage === "pt-br" ? "en-us" : "pt-br";
    setLanguage(differentLanguage);
    selectedLanguage(differentLanguage);
}

// changes the selected language on the language button
function selectedLanguage(lang) {
    const portuguese = document.getElementById("portuguese-lang");
    const english = document.getElementById("english-lang");

    if (lang === "pt-br") {
        portuguese.classList.add("active");
        english.classList.remove("active");
    } else {
        portuguese.classList.remove("active");
        english.classList.add("active");
    }
}

// changes page's language
function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const keys = key.split(".");
        let text = translations[lang];

        for (const key of keys) {
            text = text?.[key];
        }

        if (text) {
            element.innerHTML = text;
        } else {
            console.warn(`Missing translation for ${key}`);
        }
    });

    document.title = translations[lang].title || document.title;
    localStorage.setItem("lang", lang);
}
