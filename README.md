# To-Do List Application

A simple To-Do List web application built using the FreeSchema framework.  
The app allows users to **create, view, edit, delete, and update the status** of tasks.

---

## Features

- **Create Task**: Add new tasks with a title and description.
- **List Tasks**: Display all tasks in a table.
- **Edit Tasks**: Modify title and description of existing tasks.
- **Delete Tasks**: Remove tasks from the list.
- **Task Status**: Mark tasks as `pending` or `completed`.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/iamloke/todo-list-freeschema.git
```

2. Navigate into the project folder:
```bash
cd todo-list-freeschema
```

3. Install dependencies:
```bash
npm install
```

## How to Run

Start the application using:

```bash
npm run dev
```

This will open the app in your default browser.

## How to Use

**1. Add a Task**
- Enter a title and description in the form.
- Cick Submit to save the task. Status defaults to pending.

**2. View Tasks**
- All tasks are displayed in the table below the form.
- Columns include Title, Description, Status, and Action buttons.

**3. Edit a Task**
- Click the Edit button next to a task.
- The task details will appear in the form for editing.
- Click Submit to update.

**4. Delete a Task**
- Click the Delete button next to a task.
- The task will be removed from the list.

**5. Toggle Task Status**
- Click the Toggle Status button next to a task.
- The status will switch between pending and completed.
