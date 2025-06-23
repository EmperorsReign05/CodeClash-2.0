import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import './App.css';



function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [response, setResponse] = useState('');

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const tasksData = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();
      setResponse(data.message);
      setTask('');
      fetchTasks();
    } catch (err) {
      console.error(err);
      setResponse('Error sending task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Task Companion</h1>
      <TaskList />
<CalendarView />

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Type your task here..."
          style={{ flexGrow: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}>
          Submit
        </button>
      </form>

      {response && (
        <p style={{ marginBottom: '20px', color: 'green', textAlign: 'center' }}>
          {response}
        </p>
      )}

      <h2 style={{ marginBottom: '10px' }}>Saved Tasks:</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{
            background: '#f9f9f9',
            padding: '10px 15px',
            marginBottom: '10px',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{t.task}</span>
            <button
              onClick={() => handleDelete(t.id)}
              style={{
                background: '#ff4d4d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
