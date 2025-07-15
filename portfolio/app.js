document.getElementById("year").textContent = new Date().getFullYear();

/*
////////////////////////////////////
//////////// NAV MENU //////////////
////////////////////////////////////
*/

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

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formResult = document.getElementById("form-result");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formResult.textContent = "Por favor, preencha todos os campos.";
        formResult.style.color = "red";
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
                formResult.textContent = "Mensagem enviada com sucesso!";
                formResult.style.color = "#9b30ff";
                form.reset();
            } else {
                formResult.textContent = "Erro ao enviar. Tente novamente.";
                formResult.style.color = "red";
            }
        })
        .catch((error) => {
            alert(error);
        });
});

/*
////////////////////////////////////
///////// SETTINGS MENU ////////////
////////////////////////////////////
*/

const settingsMenu = document.getElementById("settings-menu");
const settingsButtons = document.querySelectorAll(".settings-menu-btn");

settingsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        settingsMenu.classList.toggle("active");
    });
});

function toggleSettingsMenu() {
    settingsMenu.classList.toggle("active");

    setTimeout(() => {
        settingsMenu.classList.toggle("closing");
    }, 300);
}

/*
////////////////////////////////////
////////// TRANSLATION /////////////
////////////////////////////////////
*/

const languageButton = document.getElementById("language-btn");
const storedLanguage = localStorage.getItem("lang") || "pt-br";

document.addEventListener("DOMContentLoaded", () => {
    setLanguage(storedLanguage);
    selectedLanguage(storedLanguage);
});

languageButton.addEventListener("click", () => {
    const currentLanguage = localStorage.getItem("lang");
    const differentLanguage = currentLanguage === "pt-br" ? "en-us" : "pt-br";
    setLanguage(differentLanguage);
    selectedLanguage(differentLanguage);
});

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
