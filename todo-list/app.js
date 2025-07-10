const arrowButton = document.getElementById("arrow-btn");

function toggleMenu() {
    const hiddenMenu = document.getElementById("hidden-menu");

    arrowButton.classList.toggle("active");
    hiddenMenu.classList.toggle("active");
}

function hideMenu() {
    if (arrowButton.classList.contains("active")) {
        toggleMenu();
        setTimeout(() => {
            arrowButton.style.display = "none";
        }, 300);
    } else {
        arrowButton.style.display = "none";
    }
}

function deleteTask() {
    function findTask(id) {
        let l = 0,
            r = taskList.length - 1;

        while (l <= r) {
            let m = Math.floor((l + r) / 2);

            if (taskList[m][0] < id) {
                l = m + 1;
            } else if (taskList[m][0] > id) {
                r = m - 1;
            } else {
                return m;
            }
        }
        return -1;
    }

    const selectedTasks = document.querySelectorAll("#list-items li.selected");
    let listItems = selectedTasks.length;

    if (listItems) {
        selectedTasks.forEach((task) => {
            const id = task.querySelector("span");
            const index = findTask(id);

            task.remove();
            taskList.splice(0, 1);
            listItems = document.getElementById("list-items").children.length;
        });

        if (!listItems) {
            hideMenu();
        }

        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}

// Retrieves list data from localStorage
const storedList = localStorage.getItem("taskList");
const taskList = storedList ? JSON.parse(storedList) : [];

// Displays list items when page is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (taskList.length) {
        const listItems = document.getElementById("list-items");
        taskList.forEach((task) => {
            [id, taskValue] = task;
            const item = createTaskItem(taskValue, id);
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

function createTaskItem(taskValue, id) {
    const item = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = id;
    span.style.display = "none";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const p = document.createElement("p");
    p.textContent = " " + taskValue;

    const button = document.createElement("button");
    button.textContent = "Done";
    button.classList.add("done-btn");

    checkbox.addEventListener("change", () => {
        const li = checkbox.closest("li");
        li.classList.toggle("selected");
    });

    button.addEventListener("click", () => {
        p.classList.toggle("done");
    });

    item.appendChild(span);
    item.appendChild(checkbox);
    item.appendChild(p);
    item.appendChild(button);

    return item;
}

let ID = 0;

function addTask() {
    const id = ID++;
    const newTask = document.getElementById("task");
    const listItems = document.getElementById("list-items");
    const taskValue = newTask.value.trim();

    if (taskValue === "") return;

    const item = createTaskItem(taskValue, id);
    listItems.appendChild(item);

    taskList.push([id, taskValue]);
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

        hideMenu();
    }
}
