document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressnumbers = document.getElementById('numbers');

    let isLoading = true; // 🔹 Used to prevent saving while loading from storage

    const toggleEmptyState = () => {
        emptyImage?.style && (emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none');
        if (todosContainer) {
            todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
        }
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressnumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTasksToStorage = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const text = li.querySelector('span').textContent;
            const completed = li.querySelector('.checkbox').checked;
            tasks.push({ text, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const getTasksFromStorage = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/> 
            <span>${taskText}</span>
            <div class="task-btns">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            if (!isLoading) saveTasksToStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                updateProgress(false);
                toggleEmptyState();
                if (!isLoading) saveTasksToStorage();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            updateProgress();
            toggleEmptyState();
            if (!isLoading) saveTasksToStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);

        if (!isLoading) saveTasksToStorage();
    };

    addTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    
    const storedTasks = getTasksFromStorage();
    storedTasks.forEach(task => {
        addTask(task.text, task.completed, false);
    });
    isLoading = false;

    updateProgress(false);
    toggleEmptyState();
});

const Confetti = () => {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["triangle"],
        colors: ["3E2723", "836953", "65000B", "FFFFFF"],
    };

    confetti({ ...defaults, particleCount: 50, scalar: 2 });
    confetti({ ...defaults, particleCount: 35, scalar: 3 });
    confetti({ ...defaults, particleCount: 20, scalar: 2 });
};
