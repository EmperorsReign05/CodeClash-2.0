import React from 'react';
import './TaskList.css'; 

function TaskList({ tasks }) {
  return (
    <div className="task-list-container">
      <h2>Saved Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              {task.task}
              <span className="task-date">
                {task.createdAt?.toDate?.().toLocaleString?.() || ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
