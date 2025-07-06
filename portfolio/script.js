function toggleMenu() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");

    navbar.classList.toggle("active");
    hamburger.classList.toggle("toggle");

    if (navbar.classList.contains("closing")) {
        setTimeout(() => {
            navbar.classList.remove("closing");
        }, 300);
    } else {
        navbar.classList.add("closing");
    }
}

const navLinks = document.querySelectorAll(".nav-links");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        toggleMenu();
    });
});
