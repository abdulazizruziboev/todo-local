checkDbInit();
function checkDbInit() {
    const currentDb = localStorage.getItem("todos");
    if(currentDb === null || !Array.isArray(JSON.parse(currentDb))) localStorage.setItem("todos","[]");
}

export function addTodoToDb (object) {
    const currentTodos = getTodos().sort((a,b)=>a?.id-b?.id);
    const id = (currentTodos.length>0) ? currentTodos.at(-1)?.id+1 : 0;
    object.id = id;
    object.created = +Date.now();
    currentTodos.push(object)
    setTodos(currentTodos);
}

export function getTodos() {
    const currentDb = JSON.parse(localStorage.getItem("todos"));
    if(Array.isArray(currentDb)) return currentDb;
    else return [];
}

export function setTodos(array) {
    checkDbInit();
    localStorage.setItem("todos",JSON.stringify(array))
};

export function editFromDb (object) {
    if(typeof object?.id === "number" && !isNaN(object?.id)) {
        const currentTodos = getTodos();
        const targetIndex = getTodos().findIndex(todos=>todos?.id===object?.id);
        if(targetIndex===-1) return;
        currentTodos[targetIndex] = object;
        setTodos(currentTodos);
    }
}