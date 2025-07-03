const sidebar = document.getElementById("sidebar");
const links = document.querySelectorAll("#sidebar a");

function toggleMenu() {
    sidebar.classList.toggle("active");
}

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        sidebar.classList.remove("active");
    });
});
