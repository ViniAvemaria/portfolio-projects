const storedList = localStorage.getItem("localList");
const localList = storedList ? JSON.parse(storedList) : [];
const arrowButton = document.getElementById("arrow-btn");
const searchButton = document.getElementById("search-btn");
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const selectSort = document.getElementById("sort-select");
let ID = 0; // unique id for each list item

taskList.addEventListener("change", () => {
    // enables delete and edit button depending on number of selected items in task list
    updateButtonState();
});

selectSort.addEventListener("change", (event) => {
    const tasks = taskList.querySelectorAll("li");
    const doneList = [];
    const pendingList = [];
    let sortedList = localList;

    tasks.forEach((task) => {
        const id = task.querySelector("span").textContent;
        const taskValue = task.querySelector("p");
        if (taskValue.classList.contains("done")) {
            doneList.push([id, taskValue.textContent, 1]);
        } else {
            pendingList.push([id, taskValue.textContent, 0]);
        }
    });

    if (event.target.value === "done") {
        sortedList = [...doneList, ...pendingList];
    } else if (event.target.value === "pending") {
        sortedList = [...pendingList, ...doneList];
    }

    taskList.innerHTML = "";

    sortedList.forEach((task) => {
        [id, taskValue, taskStatus] = task;
        const item = createTaskItem(taskValue, id, taskStatus);
        taskList.appendChild(item);
    });
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
            [id, taskValue, taskStatus] = task;
            const item = createTaskItem(taskValue, id, taskStatus);
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

function deleteTask() {
    const selectedTasks = document.querySelectorAll("#task-list li.selected");
    let taskList = undefined;

    selectedTasks.forEach((task) => {
        const id = task.querySelector("span");
        const index = findTaskIndex(Number(id.textContent));
        task.remove();
        localList.splice(index, 1);
        taskList = document.getElementById("task-list").children.length;
    });

    // clears search input after deleting the searched item
    if (searchButton.textContent === "Clear") {
        clearSearchInput(searchButton);
    }

    // if there're no more items in the list after deletion, hides the menu
    if (!taskList) {
        hideMenu();
    }

    updateButtonState();
    localStorage.setItem("localList", JSON.stringify(localList));
}

// toggles editing mode
function toggleEditing(p, input, button) {
    p.classList.toggle("editing");
    input.classList.toggle("editing");
    input.focus();
    button.classList.toggle("editing");
    button.textContent = button.textContent === "Done" ? "Change" : "Done";
}

// onClick function for edit button
function enableEditTask() {
    const selectedTask = document.querySelector("#task-list li.selected");
    const p = selectedTask.querySelector("p");
    const input = selectedTask.querySelector("input.edit-input");
    const button = selectedTask.querySelector("button");

    input.value = p.textContent;
    toggleEditing(p, input, button);
}

// edits tasks updating p tag with new input
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
    checkbox.checked = false;

    toggleEditing(p, input, button);
    updateButtonState();
}

// also enables input box and show all task items
function clearSearchInput() {
    const input = document.getElementById("search-input");
    const tasks = document.querySelectorAll("li");

    tasks.forEach((task) => {
        if (task.classList.contains("hide")) {
            task.classList.toggle("hide");
        }
    });
    searchButton.textContent = "Search";
    input.value = "";
    input.readOnly = false;
}

function searchTask() {
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

    const input = document.getElementById("search-input");
    const tasks = document.querySelectorAll("li");

    if (input.value.trim() === "") return;

    if (searchButton.textContent === "Search") {
        tasks.forEach((task) => {
            const taskValue = task.querySelector("p");
            if (!fuzzyMatch(input.value, taskValue.textContent)) {
                task.classList.toggle("hide");
            }
        });
        searchButton.textContent = "Clear";
        input.readOnly = true;
    } else {
        clearSearchInput();
    }
}

function createTaskItem(taskValue, id, taskStatus) {
    const item = document.createElement("li");

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
        item.classList.toggle("selected");
        if (input.classList.contains("editing")) {
            toggleEditing(p, input, button);
        }
    });

    button.addEventListener("click", () => {
        if (button.classList.contains("editing")) {
            editTask(span, p, input, button);
            item.classList.toggle("selected"); // removes selected class from task
        } else {
            const index = findTaskIndex(id);
            localList[index][2] = 1;
            localStorage.setItem("localList", JSON.stringify(localList));
            p.classList.toggle("done");
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
    const item = createTaskItem(taskValue, id, 0);
    taskList.appendChild(item);

    // third value represents task completion status. default is 0 = pending
    localList.push([id, taskValue, 0]);
    localStorage.setItem("localList", JSON.stringify(localList));
    newTask.value = "";

    if (searchButton.textContent === "Clear") {
        clearSearchInput(searchButton);
    }

    arrowButton.style.display = "flex";
}

function clearAllTasks() {
    if (localList.length) {
        taskList.innerHTML = "";
        localStorage.removeItem("localList");
        localList.length = 0;
        hideMenu();
        if (searchButton.textContent === "Clear") {
            clearSearchInput(searchButton);
        }
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
