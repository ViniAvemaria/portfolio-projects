const form = document.getElementById("contact-form");

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
