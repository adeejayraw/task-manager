# Task Manager

A simple task manager web app built with HTML, CSS, and vanilla JavaScript. Tasks persist across page reloads using the browser's `localStorage`.

---

## Project Structure

```
task-manager/
├── index.html   — page structure and element IDs
├── style.css    — dark theme, layout, and interactive styles
└── script.js    — all the logic: add, store, and delete tasks
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
- `li { cursor: pointer; }` signals to the user that task items are clickable (for deletion).

---

### 3. Adding tasks (`script.js`)

```js
addBtn.addEventListener("click", function() {
    if (taskInput.value === "") return;  // guard: ignore empty submissions

    const li = document.createElement("li");
    li.textContent = taskInput.value;
    taskList.appendChild(li);
    taskInput.value = "";  // clear the input after adding
});
```

> **Learning note:** `createElement` + `appendChild` is how you build the DOM dynamically. The element doesn't exist in the HTML file — JavaScript creates it at runtime and inserts it into the page. This is the core pattern behind almost every interactive web UI.

---

### 4. Persisting tasks with `localStorage` (`script.js`)

`localStorage` stores string key-value pairs in the browser — data survives page refreshes and even closing the tab. Because it only accepts strings, the `tasks` array is serialised to JSON with `JSON.stringify()` on every write, and read back with `JSON.parse()` on startup.

> **Learning note:** This is a common beginner pattern: keep an in-memory array (`tasks[]`) that mirrors what's on screen, and sync it to `localStorage` on every change. The two always stay in step — DOM, array, and storage updated together.

---

### 5. Loading saved tasks on startup (`script.js`) ✓ *newly added*

```js
const savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    const parsedTasks = JSON.parse(savedTasks);
    for (const task of parsedTasks) {
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
        li.addEventListener("click", function() {
            deleteTask(li);
        });
    }
}
```

On page load the script reads from `localStorage`. If data exists (`!== null`), it parses the JSON back into an array and re-creates an `<li>` for each saved task — so the list survives a refresh.

> **Learning note:** `JSON.parse()` is the reverse of `JSON.stringify()` — it converts a JSON string back into a JavaScript value (here, an array of strings). You always need both: stringify to save, parse to load.

> **Known bug:** The loaded tasks are rendered to the DOM but never pushed into the in-memory `tasks[]` array. So if you add a new task after a refresh, `tasks` only contains that one new item and `localStorage` gets overwritten with just it — erasing everything else. Fix: after `JSON.parse`, also do `tasks.push(...parsedTasks)` to repopulate the array.

---

### 6. Extracting `deleteTask()` to avoid repetition (`script.js`) ✓ *newly added*

```js
function deleteTask(li) {
    li.remove();
    tasks.splice(tasks.indexOf(li.textContent), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

The delete logic used to be copy-pasted in two places (once for newly added tasks, once for tasks loaded from storage). It was pulled out into a named function so both places call `deleteTask(li)` instead.

> **Learning note:** This is the DRY principle — Don't Repeat Yourself. Any time you find yourself writing the same block of code twice, that's a signal to extract it into a function. It means a future bug fix or change only needs to happen in one place.

> **Known limitation:** `tasks.indexOf(li.textContent)` finds the task by its text. If two tasks have the same text, it always removes the first match — not necessarily the one you clicked. Storing unique IDs instead of plain text would fix this.

---

### 7. Click-to-delete (`script.js`)

Each `<li>` gets its own click listener attached the moment it is created — both when added by the user and when restored from storage. Clicking calls `deleteTask(li)` which removes the element from the page, removes the entry from the array, and saves the updated list.

> **Learning note:** An alternative to attaching individual listeners is *event delegation* — one listener on the parent `<ul>` that checks `event.target` to see what was clicked. Delegation is more efficient when you have many items or items that are frequently added/removed.

---

## What's Next (ideas)

- **Fix the startup bug** — after parsing saved tasks, push them into `tasks[]` so adding a new task after a refresh doesn't wipe the old ones.
- **Unique task IDs** — store `{ id, text }` objects instead of plain strings to fix the duplicate-name deletion bug.
- **Mark complete** — toggle a CSS class on click instead of deleting, so tasks can be checked off rather than removed.
- **Enter key support** — add a `keydown` listener on the input so pressing Enter also submits the task.
