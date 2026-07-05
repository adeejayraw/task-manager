/* This section selects the necessary elements from the DOM */
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

/* This section retrieves the saved tasks from local storage and initializes the tasks array */
const savedTasks = localStorage.getItem("tasks");

/* This section initializes an empty array to hold the tasks */
const tasks = [];

/* A function that adds task with Enter key */
function addTaskWithEnter(event) {
  if (event.key === "Enter") {
    addBtn.click();
  }
}
/* This section adds an event listener to the task input field to listen for the Enter key press */
taskInput.addEventListener("keydown", addTaskWithEnter);

/* A function for deleting tasks */
function deleteTask(li, text) {
  li.remove();
  tasks.splice(tasks.indexOf(text), 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* A function that creates a task element with action buttons */
function createTaskElement(text) {
  const li = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = text;
    li.appendChild(taskText);

    /* This section creates the action buttons for each task */
    const actionsDiv = document.createElement("div");
    const deleteBtn = document.createElement("button");
    const completeBtn = document.createElement("button");

    /* Set the text content of the buttons and append them to the actions div */
    deleteBtn.textContent = "Delete";
    completeBtn.textContent = "Complete";
    actionsDiv.appendChild(deleteBtn);
    actionsDiv.appendChild(completeBtn);
    li.appendChild(actionsDiv);

    deleteBtn.addEventListener("click", function() {
        deleteTask(li, taskText.textContent);
    });

    taskList.appendChild(li);
}

/* This section initializes the task list from local storage */
if (savedTasks !== null) {
    const parsedTasks = JSON.parse(savedTasks);
    for (const task of parsedTasks) {
        tasks.push(task);
        createTaskElement(task);
    }
}

/* This section adds a new task to the list and saves it to local storage */
addBtn.addEventListener("click", function() {
    if (taskInput.value === "") {
        return;
    }

/* This section creates a new task element, adds it to the tasks array, and saves it to local storage */    
    createTaskElement(taskInput.value);
    tasks.push(taskInput.value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";

});