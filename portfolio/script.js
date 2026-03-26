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

////////////////////////////////////////////////////

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyByHMpqviP-ZCPcMcjG-1sxmv2aqfTcEeU",
    authDomain: "portfolio-87e90.firebaseapp.com",
    projectId: "portfolio-87e90",
    storageBucket: "portfolio-87e90.firebasestorage.app",
    messagingSenderId: "506093033488",
    appId: "1:506093033488:web:d478481ec7393854b69295",
    measurementId: "G-Y36SDK51N3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener("load", async () => {
    try {
        await addDoc(collection(db, "logs"), {
            date: serverTimestamp(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
    } catch (e) {
        console.error("Log failed", e);
    }
});
