import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import { parseISO, format } from 'date-fns';
import './CalendarView.css';


function CalendarView() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = querySnapshot.docs.map(doc => doc.data());
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const taskForDate = tasks.find(task =>
        task.date === format(date, 'yyyy-MM-dd')
      );
      return taskForDate ? <p>📌 {taskForDate.title || taskForDate.task}</p> : null;
    }
    return null;
  };

  return (
    <div className="calendar-view">
      <h2>Task Calendar</h2>
      <Calendar tileContent={tileContent} />
    </div>
  );
}

export default CalendarView;
