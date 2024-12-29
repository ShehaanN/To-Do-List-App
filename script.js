const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");
const themeToggle = document.getElementById("theme-toggle");

// Load tasks and theme from local storage
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

// Add new task
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// Toggle theme
themeToggle.addEventListener("click", toggleTheme);

function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return alert("Task cannot be empty!");

    const taskItem = createTaskItem(taskText, false);
    pendingTasks.appendChild(taskItem);
    saveTasks();
    taskInput.value = "";
}



function createTaskItem(text, isCompleted) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (isCompleted) li.classList.add("completed");

    // Set up the buttons with conditional classes
    li.innerHTML = `
    <span class="task-text">${text}</span>
    <button class="${isCompleted ? 'complete-btn-completed' : 'complete-btn-pending'}">
        ${isCompleted ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
    </button>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
  `;

    const completeBtn = li.querySelector("button");
    completeBtn.addEventListener("click", () => {
        li.classList.toggle("completed");
        if (li.classList.contains("completed")) {
            completedTasks.appendChild(li);
            completeBtn.className = "complete-btn-completed";
            completeBtn.innerHTML = '<i class="fas fa-undo"></i>';
        } else {
            pendingTasks.appendChild(li);
            completeBtn.className = "complete-btn-pending";
            completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        }
        saveTasks();
    });

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    return li;
}





function saveTasks() {
    const pending = Array.from(pendingTasks.children).map((li) => ({
        text: li.querySelector(".task-text").textContent,
        completed: false,
    }));

    const completed = Array.from(completedTasks.children).map((li) => ({
        text: li.querySelector(".task-text").textContent,
        completed: true,
    }));

    const allTasks = [...pending, ...completed];
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        const taskItem = createTaskItem(task.text, task.completed);
        if (task.completed) {
            completedTasks.appendChild(taskItem);
        } else {
            pendingTasks.appendChild(taskItem);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
}
