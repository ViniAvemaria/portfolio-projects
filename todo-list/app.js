const storedList = localStorage.getItem("localList");
const localList = storedList ? JSON.parse(storedList) : [];
const arrowButton = document.getElementById("arrow-btn");
const searchButton = document.getElementById("search-btn");
const searchBar = document.getElementById("search-bar");
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const selectFilter = document.getElementById("filter-select");
let ID = 0; // unique id for each list item

// displays list items when page is loaded
window.addEventListener("DOMContentLoaded", () => {
    if (!localList.length) return;
    reloadTaskList();
    arrowButton.style.display = "flex";
});

function reloadTaskList() {
    localList.forEach((task) => {
        [id, taskValue, taskStatus] = task;
        const item = createTask(taskValue, id, taskStatus);
        taskList.appendChild(item);
    });
}

// event bubbling - when a checkbox inside a li triggers a 'change', it also triggers this event listener on ul
taskList.addEventListener("change", () => {
    updateButtonState();
});

// enables delete button and edit button depending on number of selected items in task list
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

// arrow button onClick function
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

// binary search to find task's index in local list
function findTaskIndex(id) {
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
}

/////////////////////////////////
///////// ADD NEW TASK //////////
/////////////////////////////////

// adds tasks by pressing enter key
newTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// add task button onClick function
function addTask() {
    const id = ID++;
    const newTask = document.getElementById("new-task");
    const taskValue = newTask.value.trim();
    newTask.value = "";

    if (!taskValue) return;

    // third value represents task completion status. default is 0 = pending
    const item = createTask(taskValue, id, 0);
    taskList.appendChild(item);

    localList.push([id, taskValue, 0]);
    localStorage.setItem("localList", JSON.stringify(localList));

    arrowButton.style.display = "flex";

    // disables search mode if adding a task before clearing search input
    if (searchButton.textContent === "Clear") clearSearchInput(searchButton);
}

function createTask(taskValue, id, taskStatus) {
    const task = document.createElement("li");

    // hidden span that works as a unique id for each task
    const span = document.createElement("span");
    span.textContent = id;
    span.style.display = "none";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const p = document.createElement("p");
    p.textContent = taskValue;
    if (taskStatus) p.classList.add("done");

    // hidden input box that is used when editing a task
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("edit-input");

    const button = document.createElement("button");
    button.textContent = "Done";
    button.classList.add("done-btn");

    checkbox.addEventListener("change", () => {
        task.classList.toggle("selected");
        // disables editing mode if unchecking task
        if (input.classList.contains("editing")) toggleEditing(p, input, button);
    });

    button.addEventListener("click", () => {
        // in editing mode 'done' button becomes 'change'
        if (button.classList.contains("editing")) {
            editTask(span, p, input, button);
            task.classList.toggle("selected"); // removes class 'selected' from task
        } else {
            // marks and unmarks a task as done and updates taskStatus on localList and and localStorage
            p.classList.toggle("done");
            const index = findTaskIndex(id);
            localList[index][2] = p.classList.contains("done") ? 1 : 0;
            localStorage.setItem("localList", JSON.stringify(localList));
        }
    });

    task.appendChild(span);
    task.appendChild(checkbox);
    task.appendChild(p);
    task.appendChild(input);
    task.appendChild(button);

    return task;
}

/////////////////////////////////
////////// DELETE TASK //////////
/////////////////////////////////

// clear list button onClick function
function clearAllTasks() {
    if (!localList.length) return;

    taskList.innerHTML = "";
    localStorage.removeItem("localList");
    localList.length = 0;
    hideMenu();

    // disables search mode if deleting all tasks before clearing search input
    if (searchButton.textContent === "Clear") clearSearchInput(searchButton);
}

function deleteTask() {
    const selectedTasks = document.querySelectorAll("#task-list li.selected");

    selectedTasks.forEach((task) => {
        const id = task.querySelector("span");
        const index = findTaskIndex(Number(id.textContent));
        task.remove();
        localList.splice(index, 1);
    });

    localStorage.setItem("localList", JSON.stringify(localList));
    updateButtonState();

    // clears search input after deleting the searched item
    if (searchButton.textContent === "Clear") {
        clearSearchInput(searchButton);
    }

    // if there're no more items in the list after deletion, hides the menu
    const totalTasks = document.getElementById("task-list").children.length;
    if (!totalTasks) {
        hideMenu();
    }
}

/////////////////////////////////
/////////// EDIT TASK ///////////
/////////////////////////////////

// edit button onClick function
function enableEditMode() {
    const selectedTask = document.querySelector("#task-list li.selected");
    const p = selectedTask.querySelector("p");
    const input = selectedTask.querySelector("input.edit-input");
    const button = selectedTask.querySelector("button");

    input.value = p.textContent;
    toggleEditing(p, input, button);
}

// toggles editing mode
function toggleEditing(p, input, button) {
    p.classList.toggle("editing");
    input.classList.toggle("editing");
    button.classList.toggle("editing");
    input.focus();
    button.textContent = button.textContent === "Done" ? "Change" : "Done";
}

function editTask(id, p, input, button) {
    const newTask = input.value;

    if (newTask) {
        p.textContent = newTask;
        const index = findTaskIndex(Number(id.textContent));
        localList[index][1] = newTask;
        localStorage.setItem("localList", JSON.stringify(localList));
    } else {
        input.value = p.textContent;
    }

    const selectedTask = document.querySelector("#task-list li.selected");
    const checkbox = selectedTask.querySelector("input[type = 'checkbox']");

    // disabling editing mode, unchecking task and disabling delete/edit button
    checkbox.checked = false;
    toggleEditing(p, input, button);
    updateButtonState();
}

/////////////////////////////////
///////// FILTER TASK ///////////
/////////////////////////////////

selectFilter.addEventListener("change", (event) => {
    const tasks = taskList.querySelectorAll("li");
    const typeFilter = event.target.value;

    tasks.forEach((task) => {
        const taskValue = task.querySelector("p");
        switch (typeFilter) {
            case "done":
                if (taskValue.classList.contains("done")) {
                    task.classList.remove("hide");
                } else {
                    task.classList.add("hide");
                }
                break;

            case "pending":
                if (taskValue.classList.contains("done")) {
                    task.classList.add("hide");
                } else {
                    task.classList.remove("hide");
                }
                break;

            case "none":
                task.classList.remove("hide");
                break;
        }
    });
});

/////////////////////////////////
////////// SEARCH TASK //////////
/////////////////////////////////

let searchDelay; // debouncing

searchBar.addEventListener("input", () => {
    function fuzzyMatch(input, target) {
        input = input.toLowerCase();
        target = target.toLowerCase();

        let i = 0;
        for (let char of target) {
            if (char === input[i]) {
                i++;
                if (i === input.length) return true;
            }
        }
        return false;
    }

    clearTimeout(searchDelay);

    searchDelay = setTimeout(() => {
        const tasks = document.querySelectorAll("li");
        const searchInput = searchBar.value;

        if (searchInput === "") {
            taskList.innerHTML = "";
            reloadTaskList();
        }

        // hides tasks that aren't found
        tasks.forEach((task) => {
            const valueToFind = task.querySelector("p").textContent;
            if (fuzzyMatch(searchInput, valueToFind)) {
                task.classList.remove("hide");
            } else {
                task.classList.add("hide");
            }
        });
    }, 200);
});

// stops search mode and shows all tasks again
function clearSearchInput() {
    const input = document.getElementById("search-bar");
    input.value = "";
    input.readOnly = false;

    searchButton.textContent = "Search";
    taskList.innerHTML = "";
    reloadTaskList();
}
