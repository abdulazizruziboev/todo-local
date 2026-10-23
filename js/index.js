import { addTodoToDb, editFromDb, getTodos, setTodos } from "./db.js";
import { todoAddButtonEl , todoCuModalEl , todoCuFormEl , todosListBoxEl , todoCardTemplateEl , todosEmptyTextEl, todoDeleteModalEl, todoDeleteConfirmButtonEl } from "./htmlElements.js";

window.addEventListener("storage",()=>window.location.reload());

const na = "Noma'lum";

writeTodosToUi()

function writeTodosToUi() {
    const todos = getTodos();

    todosListBoxEl.innerHTML = "";

    if(todos.length>0) {

        todosEmptyTextEl.classList.add("hidden")

        todos.forEach(todo=>{
            const card = todoCardTemplateEl.cloneNode(true).content;
            card.querySelector(".todo-card-title").textContent = todo.title ?? "Noma'lum";
            card.querySelector(".todo-card-description").textContent = todo.description ?? na;
            const created =  new Date(todo?.created);
            const day = String(created.getDate()).padStart(2,"0")
            const month = String(created.getMonth()+1).padStart(2,"0")
            const year = created.getFullYear()
            const hours = String(created.getHours()).padStart(2,"0")
            const minutes = String(created.getMinutes()).padStart(2,"0")
            if(!card?.created) card.querySelector(".todo-card-created").textContent = `${day}/${month}/${year} - ${hours}:${minutes}`;
            else card.querySelector(".todo-card-created").textContent = na;
            card.querySelector(".todo-card-status").textContent =  todo?.status === "pending" ? "Kutilmoqda" : todo?.status === "started" ? "Boshlangan" : todo?.status === "ended" ? "Tugagan" : na;

            card.querySelector(".todo-card-status").classList.add(String(todo?.status))

            card.firstElementChild.addEventListener("dblclick",(e)=>{
                if(e.target.classList.contains("todo-card") && todo?.status !== "ended") {
                    todo.status = "ended";
                    editFromDb(todo);
                    writeTodosToUi();
                }
            })

            card.querySelector(".todo-card-edit-button").addEventListener("click",()=>{
                setCuModalTheme("edit",todo);
                todoCuModalEl.classList.remove("hidden")

                todoCuFormEl.addEventListener("submit",(e)=>{
                    e.preventDefault();
                    if(todoCuModalEl.querySelector(".todo-cu-modal-title").textContent==="Tahrirlash")  { 
                        const title = e.target.querySelector("input[name=title]");
                        const status = e.target.querySelector("select[name=status]");
                        const description = e.target.querySelector("textarea[name=description]");
                        
                        if(title.value.trim().length < 1) title.focus() 
                        else if(description.value.trim().length < 1) description.focus()
                        else
                        { 
                            editFromDb({
                                ...todo,
                                title: title.value.trim(),
                                status: status.value.trim(),
                                description: description.value.trim()
                            });
                            
                            e.target.reset();
                            todoCuModalEl.classList.add("hidden");

                            writeTodosToUi();

                    }}
                });

            });
            
            card.querySelector(".todo-card-delete-button").addEventListener("click",()=>{
                todoDeleteModalEl.classList.remove("hidden");
                todoDeleteConfirmButtonEl.addEventListener("click",()=>{
                    setTodos(todos.filter(t=>t.id!=todo.id));
                    todoDeleteModalEl.classList.add("hidden");
                    writeTodosToUi();
                })
            });

            todosListBoxEl.appendChild(card);
        })

    } else {
        todosEmptyTextEl.classList.remove("hidden")
    }
}

todoAddButtonEl.addEventListener("click",()=>{
    setCuModalTheme("add");
    todoCuModalEl.classList.remove("hidden");
});

todoCuModalEl.addEventListener("click",(e)=>{
    if(e.target.classList.contains("todo-cu-modal") || e.target.classList.contains("todo-cu-form-cancel-button")) {
        setCuModalTheme("add")
        todoCuModalEl.classList.add("hidden");
    }
});

todoDeleteModalEl.addEventListener("click",(e)=>{
    if(e.target.classList.contains("todo-delete-modal") || e.target.classList.contains("todo-delete-form-cancel-button")) {
        todoDeleteModalEl.classList.add("hidden");
    }
});

todoCuFormEl.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(todoCuModalEl.querySelector(".todo-cu-modal-title").textContent==="Qo'shish") {
        const title = e.target.querySelector("input[name=title]");
        const status = e.target.querySelector("select[name=status]");
        const description = e.target.querySelector("textarea[name=description]");
        
        if(title.value.trim().length < 1) title.focus() 
        else if(description.value.trim().length < 1) description.focus()
        else
        { 
            addTodoToDb({
                title: title.value.trim(),
                status: status.value.trim(),
                description: description.value.trim()
            });
            
            e.target.reset();
            todoCuModalEl.classList.add("hidden");

            writeTodosToUi();

    }}
});


function setCuModalTheme(cuMode,data) {
    if(cuMode==="add") {
        todoCuModalEl.querySelector(".todo-cu-modal-title").textContent = "Qo'shish";
        todoCuFormEl.reset();
    } else if(cuMode==="edit") {
        todoCuModalEl.querySelector(".todo-cu-modal-title").textContent = "Tahrirlash";
        todoCuFormEl.querySelector("input[name=title]").value = data?.title ?? na;
        todoCuFormEl.querySelector("select[name=status]").value = data?.status ?? "pending";
        todoCuFormEl.querySelector("textarea[name=description]").value = data?.description ?? na;
    }
} 