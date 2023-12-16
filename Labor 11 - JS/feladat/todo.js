class Todo {
    constructor(name, state) {
        this.name = name;
        this.state = state;
    }
}

class Button {
    constructor(action, icon, type, title) {
        this.action = action;
        this.icon = icon;
        this.type = type;
        this.title = title;
    }

}

const todos = [];
const states = ["active", "inactive", "done"];
const tabs = ["all"].concat(states);

const buttons = [
    new Button("done", "check", "success", "Mark as done"),
    new Button("active", "plus", "secondary", "Mark as active"),
    // Az objektumot dinamikusan is kezelhetjük, ekkor nem a konstruktorral példányosítjuk
    { action: "inactive", icon: "minus", type: "secondary", title: "Mark as inactive" },
    new Button("remove", "trash", "danger", "Remove"),
];

const form = document.getElementById("new-todo-form");
const input = document.getElementById("new-todo-title");

form.onsubmit = function (event) { 
    event.preventDefault();
    if (input?.value?.length) {
        todos.push(new Todo (input.value, "active"));
        input.value = "";
    }
    renderTodos();
}

function createElementFromHTML(html) {
    const virutalElement = document.createElement("div");
    virutalElement.innerHTML = html;

    return virutalElement.childElementCount == 1
    ? virutalElement.firstChild
    : virutalElement.children;
}

function moveTodoUp(todo) {
    const index = todos.indexOf(todo);
    if (index > 0) {
        const temp = todos[index - 1];
        todos[index - 1] = todo;
        todos[index] = temp;
        renderTodos();
    }
}

function moveTodoDown(todo) {
    const index = todos.indexOf(todo);
    if (index < todos.length - 1) {
        const temp = todos[index + 1];
        todos[index + 1] = todo;
        todos[index] = temp;
        renderTodos();
    }
}

window.onload = function() {
    if(localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'));
        renderTodos();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    const filtered = todos.filter(function(todo){ return todo.state === currentTab || currentTab === "all"; });
    for(let todo of filtered) {
        const row = createElementFromHTML(
            `<div class="row">
                <div class="col d-flex p-0">
                    <a class="list-group-item flex-grow-1" href="#">
                        ${todo.name}
                    </a>
                    <div class="btn-group action-buttons"></div>
                </div>
            </div>`);
            for(let button of buttons)
            {
                const btn = createElementFromHTML(
                    `<button class="btn btn-outline-${button.type} fas fa-${button.icon}" title="${button.title}"></button>`
                );
    
                if (todo.state === button.action) {
                    btn.disabled = true;
                }

                btn.onclick = () => { 
                    if (button.action === "remove") { 
                        if (confirm("Are you sure you want to delete the todo titled '" + todo.name + "'?")) { 
                            todos.splice(todos.indexOf(todo), 1);
                            renderTodos();
                        }
                    }
                    else { 
                        todo.state = button.action;
                        renderTodos();
                    }
                }
    
                row.querySelector(".action-buttons").appendChild(btn); 
            }

            const moveUpBtn = createElementFromHTML(`<button class="btn btn-outline-secondary fas fa-arrow-up" title="Move Up"></button>`);
            moveUpBtn.onclick = () => moveTodoUp(todo);
            moveUpBtn.disabled = todos.indexOf(todo) === 0;
            row.querySelector(".action-buttons").appendChild(moveUpBtn);

            const moveDownBtn = createElementFromHTML(`<button class="btn btn-outline-secondary fas fa-arrow-down" title="Move Down"></button>`);
            moveDownBtn.onclick = () => moveTodoDown(todo);
            moveDownBtn.disabled = todos.indexOf(todo) === todos.length - 1;
            row.querySelector(".action-buttons").appendChild(moveDownBtn);
    
    
            todoList.appendChild(row);
    }

    document.querySelector(".todo-tab[data-tab-name='all'] .badge").innerHTML = todos.length || "";

    for (let state of states) {
        document.querySelector(`.todo-tab[data-tab-name='${state}'] .badge`).innerHTML = todos.filter(t => t.state === state).length || "";

    }

    saveToLocalStorage();
}

let currentTab; 

function selectTab(type) {
    currentTab = type; 

    for (let tab of document.getElementsByClassName("todo-tab")) {
        tab.classList.remove("active"); 

        if (tab.getAttribute("data-tab-name") == type) 
            tab.classList.add("active");
    }

    renderTodos(); 
}

selectTab("all");