// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.searchQuery = '';
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('taskForm');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskDescription = document.getElementById('taskDescription');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskDueDate = document.getElementById('taskDueDate');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // Progress elements
        this.progressPercent = document.getElementById('progressPercent');
        this.progressBar = document.getElementById('progressBar');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');

        // Filter elements
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchTasks = document.getElementById('searchTasks');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');

        // Task list elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.taskTemplate = document.getElementById('taskTemplate');
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.cancelEditBtn.addEventListener('click', () => this.cancelEdit());

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Search functionality
        this.searchTasks.addEventListener('input', (e) => this.handleSearch(e));

        // Clear completed tasks
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Task list event delegation
        this.taskList.addEventListener('click', (e) => this.handleTaskClick(e));
        this.taskList.addEventListener('change', (e) => this.handleTaskChange(e));
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = this.taskTitle.value.trim();
        if (!title) return;

        const taskData = {
            title,
            description: this.taskDescription.value.trim(),
            priority: this.taskPriority.value,
            dueDate: this.taskDueDate.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
            this.cancelEdit();
        } else {
            this.addTask(taskData);
        }

        this.taskForm.reset();
        this.render();
    }

    // Add new task
    addTask(taskData) {
        const task = {
            id: this.generateId(),
            ...taskData
        };
        this.tasks.unshift(task);
        this.saveTasks();
    }

    // Update existing task
    updateTask(id, taskData) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { 
                ...this.tasks[taskIndex], 
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            this.saveTasks();
        }
    }

    // Delete task
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.render();
        }
    }

    // Start editing task
    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.taskTitle.value = task.title;
            this.taskDescription.value = task.description || '';
            this.taskPriority.value = task.priority;
            this.taskDueDate.value = task.dueDate || '';
            
            this.addTaskBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';
            this.cancelEditBtn.style.display = 'inline-flex';
            
            // Scroll to form
            document.querySelector('.add-task-section').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    // Cancel editing
    cancelEdit() {
        this.editingTaskId = null;
        this.taskForm.reset();
        this.addTaskBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
        this.cancelEditBtn.style.display = 'none';
    }

    // Handle filter change
    handleFilterChange(e) {
        // Update active filter button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
    }

    // Handle search input
    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderTasks();
    }

    // Clear completed tasks
    clearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    // Handle task list clicks
    handleTaskClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        if (e.target.closest('.edit-btn')) {
            this.editTask(taskId);
        } else if (e.target.closest('.delete-btn')) {
            this.deleteTask(taskId);
        }
    }

    // Handle task list changes (checkboxes)
    handleTaskChange(e) {
        if (e.target.classList.contains('task-complete')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            this.toggleTask(taskId);
        }
    }

    // Filter tasks based on current filter and search
    getFilteredTasks() {
        let filtered = this.tasks;

        // Apply filter
        switch (this.currentFilter) {
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            case 'pending':
                filtered = filtered.filter(task => !task.completed);
                break;
            case 'high':
                filtered = filtered.filter(task => task.priority === 'high');
                break;
        }

        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(this.searchQuery) ||
                (task.description && task.description.toLowerCase().includes(this.searchQuery))
            );
        }

        return filtered;
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    }

    // Check if task is overdue
    isOverdue(task) {
        if (!task.dueDate || task.completed) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }

    // Create task element from template
    createTaskElement(task) {
        const template = this.taskTemplate.content.cloneNode(true);
        const taskItem = template.querySelector('.task-item');
        
        taskItem.dataset.id = task.id;
        taskItem.classList.toggle('completed', task.completed);

        // Set checkbox state
        const checkbox = template.querySelector('.task-complete');
        checkbox.checked = task.completed;

        // Set task content
        template.querySelector('.task-title').textContent = task.title;
        
        const descriptionEl = template.querySelector('.task-description');
        if (task.description) {
            descriptionEl.textContent = task.description;
            descriptionEl.style.display = 'block';
        } else {
            descriptionEl.style.display = 'none';
        }

        // Set priority
        const priorityEl = template.querySelector('.task-priority');
        priorityEl.textContent = task.priority;
        priorityEl.className = `task-priority ${task.priority}`;

        // Set due date
        const dueDateEl = template.querySelector('.task-due-date');
        if (task.dueDate) {
            const isOverdue = this.isOverdue(task);
            dueDateEl.innerHTML = `<i class="fas fa-calendar"></i> Due: ${this.formatDate(task.dueDate)}`;
            dueDateEl.classList.toggle('overdue', isOverdue);
        } else {
            dueDateEl.style.display = 'none';
        }

        // Set created date
        const createdEl = template.querySelector('.task-created');
        createdEl.innerHTML = `<i class="fas fa-clock"></i> Created: ${this.formatDate(task.createdAt)}`;

        return template;
    }

    // Render task list
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        // Clear current tasks
        while (this.taskList.children.length > 1) {
            this.taskList.removeChild(this.taskList.lastChild);
        }

        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
            
            // Update empty state message based on filter/search
            const emptyStateTitle = this.emptyState.querySelector('h3');
            const emptyStateText = this.emptyState.querySelector('p');
            
            if (this.searchQuery) {
                emptyStateTitle.textContent = 'No matching tasks found';
                emptyStateText.textContent = `No tasks match "${this.searchQuery}". Try a different search term.`;
            } else if (this.currentFilter !== 'all') {
                emptyStateTitle.textContent = 'No tasks in this category';
                emptyStateText.textContent = 'Try switching to a different filter or add some tasks.';
            } else {
                emptyStateTitle.textContent = 'No tasks yet!';
                emptyStateText.textContent = 'Add your first task to get started with productivity tracking.';
            }
        } else {
            this.emptyState.style.display = 'none';
            
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.taskList.appendChild(taskElement);
            });
        }
    }

    // Update progress statistics
    updateProgress() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Update text values
        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
        this.progressPercent.textContent = `${percentage}%`;

        // Update progress circle
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (percentage / 100) * circumference;
        this.progressBar.style.strokeDashoffset = offset;

        // Update clear completed button state
        this.clearCompletedBtn.disabled = completed === 0;
    }

    // Main render function
    render() {
        this.updateProgress();
        this.renderTasks();
    }

    // Save tasks to localStorage
    saveTasks() {
        try {
            localStorage.setItem('taskManager_tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            const saved = localStorage.getItem('taskManager_tasks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }

    // Export tasks as JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import tasks from JSON file
    importTasks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    if (confirm('This will replace all existing tasks. Continue?')) {
                        this.tasks = importedTasks;
                        this.saveTasks();
                        this.render();
                        alert('Tasks imported successfully!');
                    }
                } else {
                    alert('Invalid file format. Please select a valid JSON file.');
                }
            } catch (error) {
                alert('Error reading file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    // Get productivity stats
    getProductivityStats() {
        const today = new Date();
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const todayTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate.toDateString() === today.toDateString();
        });

        const weekTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= thisWeek;
        });

        const monthTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= thisMonth;
        });

        return {
            today: {
                total: todayTasks.length,
                completed: todayTasks.filter(t => t.completed).length
            },
            week: {
                total: weekTasks.length,
                completed: weekTasks.filter(t => t.completed).length
            },
            month: {
                total: monthTasks.length,
                completed: monthTasks.filter(t => t.completed).length
            },
            overdue: this.tasks.filter(task => this.isOverdue(task)).length
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const taskTitle = document.getElementById('taskTitle');
            if (taskTitle === document.activeElement && taskTitle.value.trim()) {
                document.getElementById('taskForm').dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to cancel edit
        if (e.key === 'Escape' && window.taskManager.editingTaskId) {
            window.taskManager.cancelEdit();
        }
    });

    // Add export/import functionality (optional enhancement)
    const addExportImportButtons = () => {
        const taskActions = document.querySelector('.task-actions');
        if (taskActions) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn-secondary';
            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export';
            exportBtn.onclick = () => window.taskManager.exportTasks();
            
            const importBtn = document.createElement('button');
            importBtn.className = 'btn-secondary';
            importBtn.innerHTML = '<i class="fas fa-upload"></i> Import';
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            fileInput.onchange = (e) => {
                if (e.target.files[0]) {
                    window.taskManager.importTasks(e.target.files[0]);
                }
            };
            
            importBtn.onclick = () => fileInput.click();
            
            taskActions.appendChild(exportBtn);
            taskActions.appendChild(importBtn);
            taskActions.appendChild(fileInput);
        }
    };

    // Initialize export/import buttons
    addExportImportButtons();

    // Auto-save reminder (runs every 30 seconds)
    setInterval(() => {
        if (window.taskManager && window.taskManager.tasks.length > 0) {
            window.taskManager.saveTasks();
        }
    }, 30000);

    console.log('Task Manager initialized successfully!');
});