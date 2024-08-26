document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterIncomplete = document.getElementById('filter-incomplete');
    const searchInput = document.getElementById('search');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = "all") {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (filter === "completed" && !task.completed) return;
            if (filter === "incomplete" && task.completed) return;

            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <div class="task-content">
                    <strong>${task.title}</strong> - ${task.desc} (Due: ${task.date})
                </div>
                <div class="task-actions">
                    <button class="completed">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;

            // Event listeners for buttons
            li.querySelector('.completed').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });

            li.querySelector('.edit').addEventListener('click', () => {
                const title = prompt('Edit task title:', task.title);
                const desc = prompt('Edit task description:', task.desc);
                const date = prompt('Edit task due date:', task.date);
                if (title) task.title = title;
                if (desc) task.desc = desc;
                if (date) task.date = date;
                saveTasks();
                renderTasks(filter);
            });

            li.querySelector('.delete').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks(filter);
                }
            });

            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;

        tasks.push({
            title,
            desc,
            date,
            completed: false
        });

        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    filterAll.addEventListener('click', () => renderTasks('all'));
    filterCompleted.addEventListener('click', () => renderTasks('completed'));
    filterIncomplete.addEventListener('click', () => renderTasks('incomplete'));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (task.title.toLowerCase().includes(query) || task.desc.toLowerCase().includes(query)) {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <div class="task-content">
                        <strong>${task.title}</strong> - ${task.desc} (Due: ${task.date})
                    </div>
                    <div class="task-actions">
                        <button class="completed">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </div>
                `;
                
                taskList.appendChild(li);
            }
        });
    });

    renderTasks();
});
