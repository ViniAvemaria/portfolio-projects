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
