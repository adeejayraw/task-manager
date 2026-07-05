const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const tasks = [];
const savedTasks = localStorage.getItem("tasks");

/* A function for deleting tasks */
function deleteTask(li) {
  li.remove();
  tasks.splice(tasks.indexOf(li.textContent), 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* This section initializes the task list from local storage */
if (savedTasks !== null) {
    const parsedTasks = JSON.parse(savedTasks);
    for (const task of parsedTasks) {
        tasks.push(task);
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
        li.addEventListener("click", function() {
            deleteTask(li);
        });
    }
}

/* This section adds a new task to the list and saves it to local storage */
addBtn.addEventListener("click", function() {
    if (taskInput.value === "") {
        return;
    }
    const li = document.createElement("li");
    li.textContent = taskInput.value;
    tasks.push(taskInput.value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskList.appendChild(li);

    li.addEventListener("click", function() {
        deleteTask(li);
    });

    taskInput.value = "";

});