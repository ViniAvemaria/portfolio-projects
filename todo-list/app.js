const storedList = localStorage.getItem("localList");
const localList = storedList ? JSON.parse(storedList) : [];
const arrowButton = document.getElementById("arrow-btn");
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
let ID = 0; // unique id for each list item

taskList.addEventListener("change", () => {
    // enables delete and edit button depending on number of selected items in task list
    updateButtonState();
});

// adds tasks by pressing enter key
newTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// displays list items when page is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (localList.length) {
        localList.forEach((task) => {
            [id, taskValue] = task;
            const item = createTaskItem(taskValue, id);
            taskList.appendChild(item);
        });

        arrowButton.style.display = "flex";
    }
});

function toggleMenu() {
    const hiddenMenu = document.getElementById("hidden-menu");

    arrowButton.classList.toggle("active");
    hiddenMenu.classList.toggle("active");
}

// collapses the hidden menu when using delete or clear list and there're no items left in the list
function hideMenu() {
    if (arrowButton.classList.contains("active")) {
        toggleMenu();
        setTimeout(() => {
            arrowButton.style.display = "none";
        }, 200);
    } else {
        arrowButton.style.display = "none";
    }
}

function deleteTask() {
    const findTask = (id) => {
        let l = 0,
            r = localList.length - 1;

        while (l <= r) {
            let m = Math.floor((l + r) / 2);

            if (localList[m][0] < id) {
                l = m + 1;
            } else if (localList[m][0] > id) {
                r = m - 1;
            } else {
                return m;
            }
        }
        return -1;
    };

    const selectedTasks = document.querySelectorAll("#task-list li.selected");
    let taskList = undefined;

    selectedTasks.forEach((task) => {
        const id = task.querySelector("span");
        const index = findTask(Number(id.textContent));
        task.remove();
        localList.splice(index, 1);
        taskList = document.getElementById("task-list").children.length;
    });

    if (!taskList) {
        hideMenu();
    }

    updateButtonState();
    localStorage.setItem("localList", JSON.stringify(localList));
}

function toggleEditing(p, input, button) {
    p.classList.toggle("editing");
    input.classList.toggle("editing");
    input.focus();
    button.classList.toggle("editing");
    button.textContent = button.textContent === "Done" ? "Change" : "Done";
}

function enableEditTask() {
    const selectedTask = document.querySelector("#task-list li.selected");
    const p = selectedTask.querySelector("p");
    const input = selectedTask.querySelector("input.edit-input");
    const button = selectedTask.querySelector("button");

    toggleEditing(p, input, button);
}

function editTask(p, input) {
    alert(input.value);
    alert(p.textContent);
}

function createTaskItem(taskValue, id) {
    const item = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = id;
    span.style.display = "none";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const p = document.createElement("p");
    p.textContent = " " + taskValue;

    const input = document.createElement("input");
    input.type = "text";
    input.value = p.textContent;
    input.classList.add("edit-input");

    const button = document.createElement("button");
    button.textContent = "Done";
    button.classList.add("done-btn");

    checkbox.addEventListener("change", () => {
        const li = checkbox.closest("li");
        li.classList.toggle("selected");
        if (input.classList.contains("editing")) {
            toggleEditing(p, input, button);
        }
    });

    button.addEventListener("click", () => {
        p.classList.toggle("done");
        if (button.classList.contains("editing")) {
            editTask(p, input);
        }
    });

    item.appendChild(span);
    item.appendChild(checkbox);
    item.appendChild(p);
    item.appendChild(input);
    item.appendChild(button);

    return item;
}

function addTask() {
    const id = ID++;
    const newTask = document.getElementById("new-task");
    const taskValue = newTask.value.trim();

    if (taskValue === "") return;
    const item = createTaskItem(taskValue, id);
    taskList.appendChild(item);

    localList.push([id, taskValue]);
    localStorage.setItem("localList", JSON.stringify(localList));
    newTask.value = "";

    arrowButton.style.display = "flex";
}

function clearAllTasks() {
    if (localList.length) {
        taskList.innerHTML = "";
        localStorage.removeItem("localList");
        localList.length = 0;
        hideMenu();
    }
}

function updateButtonState() {
    const deleteButton = document.getElementById("delete-btn");
    const editButton = document.getElementById("edit-btn");

    const checkboxes = taskList.querySelectorAll("input[type='checkbox']");
    // needs to convert NodeList to array to use filter
    const checkedBoxes = Array.from(checkboxes).filter((cb) => cb.checked);

    const anyChecked = checkedBoxes.length > 0;
    const onlyOneChecked = checkedBoxes.length === 1;

    // must be ! so it sets disable to false and enables the button
    deleteButton.disabled = !anyChecked;
    editButton.disabled = !onlyOneChecked;
}
