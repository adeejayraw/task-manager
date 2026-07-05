# Task Manager

A simple task manager web app built with HTML, CSS, and vanilla JavaScript. Tasks persist across page reloads using the browser's `localStorage`. First proper experiment with HTML, CSS and JavaScript.

---

## Project Structure

```
task-manager/
├── index.html   — page structure and element IDs
├── style.css    — dark theme, layout, and interactive styles
└── script.js    — all the logic: add, store, delete, and complete tasks
```

---

## What Was Built & Why

### 1. HTML skeleton (`index.html`)

Set up the bare minimum structure: a heading, a text `<input>`, an "Add" `<button>`, and an empty `<ul>` to hold tasks. Each interactive element has a unique `id` so JavaScript can find it.

> **Learning note:** The `<script>` tag is placed at the very bottom of `<body>`, not inside `<head>`. This matters — if you load the script before the HTML elements exist, `getElementById()` returns `null` and your code breaks silently.

---

### 2. Dark theme stylesheet (`style.css`)

- `* { margin: 0; padding: 0; box-sizing: border-box; }` — a universal reset. Without this, browsers apply their own default spacing which varies and causes layout surprises.
- `body` uses `display: flex; flex-direction: column; align-items: center;` to center everything vertically in a column.
- The input has a `transition: border-color 0.3s` so the blue focus glow fades in smoothly rather than snapping.

---

### 3. Persisting tasks with `localStorage` (`script.js`)

`localStorage` stores string key-value pairs in the browser — data survives page refreshes and even closing the tab. Because it only accepts strings, the `tasks` array is serialised to JSON with `JSON.stringify()` on every write, and read back with `JSON.parse()` on startup.

> **Learning note:** This is a common beginner pattern: keep an in-memory array (`tasks[]`) that mirrors what's on screen, and sync it to `localStorage` on every change. The two always stay in step — DOM, array, and storage updated together.

---

### 4. Loading saved tasks on startup (`script.js`)

```js
const savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    const parsedTasks = JSON.parse(savedTasks);
    for (const task of parsedTasks) {
        tasks.push(task);
        createTaskElement(task);    // ✓ fixed: same rendering as newly added tasks
    }
}
```

On page load the script reads from `localStorage`, parses the JSON back into an array, and calls `createTaskElement(task)` for each one — the same function used when adding new tasks. This means saved tasks now get Delete/Complete buttons after a refresh, fixing a previous inconsistency where restored tasks were plain unclickable text.

> **Learning note:** `JSON.parse()` is the reverse of `JSON.stringify()` — it converts a JSON string back into a JavaScript value (here, an array of strings). You always need both: stringify to save, parse to load.

---

### 5. `deleteTask(li, text)` — explicit text parameter (`script.js`)

```js
function deleteTask(li, text) {
    li.remove();
    tasks.splice(tasks.indexOf(text), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

The function signature was updated to accept the task text explicitly as `text` instead of reading it from `li.textContent`. This matters because `li.textContent` would now include the button labels ("Delete", "Complete") mixed in with the task text — reading it directly would produce the wrong string and fail to remove the correct item from the array.

> **Learning note:** When a DOM element contains child elements (like buttons), `.textContent` returns the combined text of *everything* inside it — including button labels. By capturing the task text at the moment it's created and passing it explicitly, you avoid this pitfall entirely.

> **Known limitation:** `tasks.indexOf(text)` still finds by value. If two tasks have identical text, it always removes the first match. Storing `{ id, text }` objects with unique IDs would fix this properly.

---

### 6. `createTaskElement(text)` — shared rendering function (`script.js`) ✓ *newly added*

```js
function createTaskElement(text) {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = text;
    li.appendChild(taskText);

    const actionsDiv = document.createElement("div");
    const deleteBtn = document.createElement("button");
    const completeBtn = document.createElement("button");

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
```

All the DOM-building logic for a task row was extracted into this single function. Both the startup loader and the add button's click handler now call `createTaskElement(text)` — so every task, whether new or restored from storage, is built the same way.

> **Learning note:** This pattern — extracting repeated DOM-building into a named function — is one of the most common refactors in front-end code. It's the same DRY principle as before, applied to UI construction. The function takes data (`text`) and produces a DOM node, which is the core idea behind every UI component system (React, Vue, etc.) at a conceptual level.

The Complete button still has no click listener — it renders but does nothing yet.

---

### 7. Add button handler — simplified (`script.js`) ✓ *updated*

```js
addBtn.addEventListener("click", function() {
    if (taskInput.value === "") return;

    createTaskElement(taskInput.value);
    tasks.push(taskInput.value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
});
```

Now that `createTaskElement` exists, the click handler is much shorter — it validates the input, delegates rendering to the function, updates the array and storage, then clears the input. The actual DOM work is no longer inlined here.

> **Learning note:** This is what good refactoring looks like. The handler went from ~20 lines of DOM code to 4 lines of high-level steps. Each line now reads almost like plain English: create the element, push to array, save, clear. When code reads at a consistent level of abstraction like this, it's much easier to understand and change later.

---

### 7. Enter key support (`script.js`) ✓ *newly added*

```js
function addTaskWithEnter(event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
}

taskInput.addEventListener("keydown", addTaskWithEnter);
```

A `keydown` listener on the input detects the Enter key and programmatically triggers a click on the Add button — reusing the same logic instead of duplicating it.

> **Learning note:** `addBtn.click()` is a way to fire a click event in code, as if the user had clicked the button themselves. This means you only need the task-creation logic in one place (the button's click handler), and Enter just delegates to it. The `event.key` property tells you exactly which key was pressed as a readable string — `"Enter"`, `"Escape"`, `"ArrowUp"`, etc.

---

## What's Next (ideas)

- **Wire up the Complete button** — add a click listener inside `createTaskElement` that toggles a CSS class (e.g. `text-decoration: line-through`) so tasks can be checked off instead of deleted.
- **Unique task IDs** — store `{ id, text }` objects instead of plain strings to fix the duplicate-name deletion bug (`tasks.indexOf(text)` always removes the first match when two tasks share the same text).
