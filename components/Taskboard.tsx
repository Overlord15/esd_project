import React from 'react';

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

// Defines the shape of a single user object
interface User {
    name: string;
    avatarUrl: string;
}

// Defines the shape of a single task object
interface Task {
    id: string;
    text: string;
    statusClass?: 'warning' | 'success' | 'info' | 'danger' | 'default';
    user: User;
}

// Props for the TaskItem component
interface TaskItemProps {
    task: Task;
}

// Props for the TaskColumn component
interface TaskColumnProps {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
}

// ============================================================================
// 2. DATA
// In a real app, this would come from an API call, e.g., using useState and useEffect
// ============================================================================

const upcomingTasks: Task[] = [
    { id: 'task1', text: 'When an unknown printer took a galley of type and scrambled it to make a type specimen book.', statusClass: 'warning', user: { name: 'Petey Cruiser', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png' } },
    { id: 'task2', text: 'Many desktop publishing packages and web page editors now use Lorem.', statusClass: 'success', user: { name: 'Anna Sthesia', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar2.png' } },
    { id: 'task3', text: 'If you are going to use a passage of Lorem Ipsum..', statusClass: 'default', user: { name: 'Gail Forcewind', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar3.png' } },
    { id: 'task4', text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.', statusClass: 'info', user: { name: 'Maya Didas', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar4.png' } },
    { id: 'task5', text: 'There are many variations of passages of Lorem Ipsum available.', statusClass: 'danger', user: { name: 'Rick O\'Shea', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar5.png' } },
];

const inProgressTasks: Task[] = [
    { id: 'task9', text: 'If you are going to use a passage of Lorem Ipsum..', statusClass: 'default', user: { name: 'Gail Forcewind', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar3.png' } },
    { id: 'task10', text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.', statusClass: 'info', user: { name: 'Maya Didas', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar4.png' } },
    { id: 'task11', text: 'There are many variations of passages of Lorem Ipsum available.', statusClass: 'danger', user: { name: 'Rick O\'Shea', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar5.png' } },
    { id: 'task7', text: 'When an unknown printer took a galley of type and scrambled it to make a type specimen book.', statusClass: 'warning', user: { name: 'Petey Cruiser', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png' } },
];

const completedTasks: Task[] = [
    { id: 'task14', text: 'When an unknown printer took a galley of type and scrambled it to make a type specimen book.', statusClass: 'warning', user: { name: 'Petey Cruiser', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png' } },
    { id: 'task15', text: 'Many desktop publishing packages and web page editors now use Lorem.', statusClass: 'success', user: { name: 'Anna Sthesia', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar2.png' } },
    { id: 'task16', text: 'If you are going to use a passage of Lorem Ipsum..', statusClass: 'default', user: { name: 'Gail Forcewind', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar3.png' } },
    { id: 'task17', text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.', statusClass: 'info', user: { name: 'Maya Didas', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar4.png' } },
    { id: 'task18', text: 'There are many variations of passages of Lorem Ipsum available.', statusClass: 'danger', user: { name: 'Rick O\'Shea', avatarUrl: 'https://bootdey.com/img/Content/avatar/avatar5.png' } },
];


// ============================================================================
// 3. CHILD COMPONENTS
// ============================================================================

/**
 * Renders a single task item.
 */
const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const liClassName = `
    ${task.statusClass && task.statusClass !== 'default' ? `task-${task.statusClass}` : ''} 
    ui-sortable-handle
  `.trim();

    return (
        <li className={liClassName} id={task.id}>
            <div className="checkbox checkbox-custom checkbox-single float-right">
                <input type="checkbox" aria-label={`Checkbox for ${task.id}`} />
                <label></label>
            </div>
            {task.text}
            <div className="clearfix"></div>
            <div className="mt-3">
                <p className="float-right mb-0 mt-2">
                    <button type="button" className="btn btn-success btn-sm waves-effect waves-light">
                        View
                    </button>
                </p>
                <p className="mb-0">
                    <a href="#" onClick={e => e.preventDefault()} className="text-muted">
                        <img src={task.user.avatarUrl} alt="task-user" className="thumb-sm rounded-circle mr-2" />
                        <span className="font-bold font-secondary">{task.user.name}</span>
                    </a>
                </p>
            </div>
        </li>
    );
};

/**
 * Renders a task column containing a list of tasks.
 */
const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, description, tasks }) => {
    return (
        <div className="col-lg-4">
            <div className="card-box">
                <h4 className="text-dark header-title">{title}</h4>
                <p className="text-muted m-b-30 font-13">{description}</p>
                {/* Note: The `ui-sortable` class suggests drag-and-drop functionality.
            In React, you'd use a library like 'react-beautiful-dnd' or 'dnd-kit'
            to implement this feature, not jQuery UI. */}
                <ul className="sortable-list taskList list-unstyled ui-sortable" id={id}>
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </ul>
                <a href="#" onClick={e => e.preventDefault()} className="btn btn-custom btn-block mt-3 waves-effect waves-light">
                    <i className="fa fa-plus-circle"></i> Add New
                </a>
            </div>
        </div>
    );
};


// ============================================================================
// 4. MAIN COMPONENT
// ============================================================================

/**
 * The main Task Board component that brings everything together.
 */
const TaskBoard: React.FC = () => {
    return (
        <div className="content">
            <div className="container">
                <div className="row">
                    <TaskColumn
                        id="upcoming"
                        title="Upcoming"
                        description="Your awesome text goes here. Your awesome text goes here."
                        tasks={upcomingTasks}
                    />
                    <TaskColumn
                        id="inprogress"
                        title="In Progress"
                        description="The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested."
                        tasks={inProgressTasks}
                    />
                    <TaskColumn
                        id="completed"
                        title="Completed"
                        description="Your awesome text goes here. Your awesome text goes here."
                        tasks={completedTasks}
                    />
                </div>
                {/* end row */}
            </div>
            {/* container */}
        </div>
    );
};

export default TaskBoard;
