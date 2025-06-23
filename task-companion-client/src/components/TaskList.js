import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './TaskList.css';  // optional — for styling

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = querySnapshot.docs.map(doc => doc.data());
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="task-card">
              <strong>{task.title || task.task}</strong> <br />
              Date: {task.date || 'N/A'} <br />
              Time: {task.time || 'N/A'} <br />
              Priority: {task.priority || 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
