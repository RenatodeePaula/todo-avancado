// Seleção de elmentos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('#erase-button')
const filterSelected = document.querySelector('#filter-select')

const todoContainer = document.querySelector('.todo-container')

let oldInputValue

const  h1 = document.querySelector('h1')

// ========================= Funções ====================================
const saveTodo = (textInput, done = 0, save = 1) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')
    
    const todoTitle = document.createElement('h3')
    todoTitle.innerText = textInput
    todo.appendChild(todoTitle)    
    
    const doneBtn = document.createElement('button')
    doneBtn.classList.add('finish-todo')
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)
    
    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todo')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)
    
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('remove-todo')
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)
    
    // utilizando dados da localStorage
    if(done) {
        todo.classList.add('done')
    }
    
    if(save) {
        saveTodoLocalStorage({textInput, done })
    }
    
    todoList.appendChild(todo)

    todoInput.value = ""
    todoInput.focus()        
}


const toggleForms = (text) => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const updateTodo = (editInputValue) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo)=> {
        let todoTitle = todo.querySelector('h3')

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = editInputValue
        }
    })
}

const getSearchTodos = (search) =>  {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3').innerText.toLowerCase()

        todo.style.display = 'flex'
        
        const lowerCaseSearch = search.toLowerCase()
        if(!todoTitle.includes(lowerCaseSearch)) {
            todo.style.display = 'none'
        }
    })
}

const filterTodo = (recebFilter, todos) => {
    todos.forEach((ev) => {                 
    switch(recebFilter){
        case "all":
            ev.style.display = "flex"
        break
        case "done":
           ev.classList.contains('done') ? ev.style.display = 'flex' : ev.style.display = 'none'
        break
        case "todo":
            !ev.classList.contains('done') ? ev.style.display = 'flex' : ev.style.display = 'none'
        break
    }
})    
}

//======================== Eventos ===========================

// Adicionar tarefas
todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const inputValue = todoInput.value
    if(inputValue) {
        saveTodo(inputValue)
    }
})

// Confirmar (Check), editar e excluir tarefas
document.addEventListener('click', (event) => {
    const targetEl = event.target
    const parentEl = targetEl.closest(("div"))
    let todoTitle

    if(parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText
    }

    if(targetEl.classList.contains('finish-todo')) {
       parentEl.classList.toggle('done')
    }

    if(targetEl.classList.contains('remove-todo')) {
        parentEl.remove()
        removeTodoLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains('edit-todo')) {
        toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener('click', (event) => {    
    event.preventDefault()
    toggleForms()
})

editForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const editInputValue = editInput.value

    if(editInputValue) {
        updateTodo(editInputValue)
    }
    toggleForms()
})

searchInput.addEventListener('keyup', (event) => {
    const search = event.target.value

    getSearchTodos(search)
})

eraseBtn.addEventListener("click", (event) => {
    event.preventDefault()

    searchInput.value = ''

    searchInput.dispatchEvent(new Event('keyup'))
})


filterSelected.addEventListener('change', (ev) => {    
    const todoFilter = ev.target.value

    const todos = document.querySelectorAll('.todo')   
    filterTodo(todoFilter, todos)  
})

//======================== Local Storage ===========================

const getTodosLocalStorage = () =>  {
    const todos = JSON.parse(localStorage.getItem('todos')) || []
    
    return todos
}

const loadTodos = () => {
    const todos = getTodosLocalStorage()

    todos.forEach((todo) => {
      saveTodo(todo.textInput, todo.done, 0)  
    })
}

const saveTodoLocalStorage = (todo) => {
    // pegar todos os todos da ls
    const todos = getTodosLocalStorage()

    // add o novo todo no arr
    todos.push(todo)

    // salvar tudo na ls
    localStorage.setItem("todos", JSON.stringify(todos))

}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.textInput != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };

loadTodos()