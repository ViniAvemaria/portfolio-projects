document.getElementById("year").textContent = new Date().getFullYear();

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
