const arrowButton = document.getElementById("arrow-btn");

function toggleMenu() {
    hiddenMenu = document.getElementById("hidden-menu");

    arrowButton.classList.toggle("active");
    hiddenMenu.classList.toggle("active");
}

// Retrieves list data from localStorage
const storedList = localStorage.getItem("taskList");
const taskList = storedList ? JSON.parse(storedList) : [];

// Displays list items when page is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (taskList.length) {
        const listItems = document.getElementById("list-items");
        taskList.forEach((task) => {
            const item = createTaskItem(task);
            listItems.appendChild(item);
        });

        arrowButton.style.display = "flex";
    }
});

// Allows pressing enter key to add task
const input = document.getElementById("task");
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function createTaskItem(taskValue) {
    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const p = document.createElement("p");
    p.textContent = " " + taskValue;

    const button = document.createElement("button");
    button.textContent = "Done";
    button.classList.add("done-btn");

    button.addEventListener("click", () => {
        p.classList.toggle("done");
    });

    item.appendChild(checkbox);
    item.appendChild(p);
    item.appendChild(button);

    return item;
}

function addTask() {
    const newTask = document.getElementById("task");
    const listItems = document.getElementById("list-items");
    const taskValue = newTask.value.trim();

    if (taskValue === "") return;

    const item = createTaskItem(taskValue);
    listItems.appendChild(item);

    taskList.push(taskValue);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    newTask.value = "";

    arrowButton.style.display = "flex";
}

function clearAllTasks() {
    if (taskList.length) {
        const listItems = document.getElementById("list-items");
        listItems.innerHTML = "";
        localStorage.removeItem("taskList");
        taskList.length = 0;

        if (arrowButton.classList.contains("active")) {
            toggleMenu();
            setTimeout(() => {
                arrowButton.style.display = "none";
            }, 300);
        } else {
            arrowButton.style.display = "none";
        }
    }
}
