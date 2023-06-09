const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

const fetchTasks = async () => {
  const res = await fetch('http://localhost:3333/tasks');
  const tasks = await res.json()
  return tasks
}

const addTask = async (e) => {
  e.preventDefault()

  const task = { title: inputTask.value }

  await fetch('http://localhost:3333/tasks', {
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(task)
  })
  loadTasks()
  inputTask.value = ''
  
}

const deleteTask = async (id) => {
  
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'delete',
  } )
  
  loadTasks()
}

const updatetask = async ({ id, title, status }) => {

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ title, status})
  })

  loadTasks()
  
}

const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle:'short'}
  const date = new Date(dateUTC).toLocaleString('pt-br', options)
  return date
}



const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag)

  if(innerText){
    element.innerText = innerText
  }

  if(innerHTML){
    element.innerHTML = innerHTML
  }

  return element
}

const createSelect = (value) => {
  const options = `
    <option value="pendente">pendente</option>
    <option value="em andamento">em andamento</option>
    <option value="concluída">concluída</option>
  `

  const select = createElement('select', '', options)

  select.value = value
  select.classList.add('select-status')

  return select

}

const createRow = (task) => {

  const { id, title, status, created_at } = task

  const tr = createElement('tr')

  if(status == 'concluída') tr.classList.add('ended')

  const tdTitle = createElement('td', title)
  const tdCreatedAt = createElement('td', formatDate(created_at))
  const tdStatus = createElement('td')
  const tdActions = createElement('td')

  const select = createSelect(status)

  select.addEventListener('change', ({ target }) => updatetask({... task, status: target.value }))

  const editButton = createElement('button', '','<span class="material-symbols-outlined">edit</span>')
  const deleteButton = createElement('button', '','<span class="material-symbols-outlined">delete</span>')

  const editForm = createElement('form')
  const editInput = createElement('input')

  editInput.value = title

  editForm.appendChild(editInput)

  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    updatetask({id, title: editInput.value, status })
  })

  editButton.addEventListener('click', () => {
    tdTitle.innerText = ''
    tdTitle.appendChild(editForm)
  })

  editButton.classList.add('btn-action')
  deleteButton.classList.add('btn-action')

  deleteButton.addEventListener('click', () => deleteTask(id))

  tdStatus.appendChild(select)


  tdActions.appendChild(editButton)
  tdActions.appendChild(deleteButton)

  tr.appendChild(tdTitle)
  tr.appendChild(tdCreatedAt)
  tr.appendChild(tdStatus)
  tr.appendChild(tdActions)

  tbody.appendChild(tr)
  

}

const loadTasks = async () => {
  const tasks = await fetchTasks()

  tbody.innerHTML = ''

  tasks.forEach((task) => {
    createRow(task)
   
  });
}

addForm.addEventListener('submit', addTask)

loadTasks()


