
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../api.js';
import TaskItem from './TaskItem.jsx';
import TaskForm from './TaskForm.jsx';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const loadTasks = () => {
    getTasks()
      .then(setTasks)
      .catch(err => setError(err.message));
  };

  const handleCreate = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  useEffect(loadTasks, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      setTasks(prev =>
        prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
      );
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="task-section-container">
      <div className="form-section">
        <TaskForm onTaskCreated={handleCreate} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="list-section">
          <h2>Listado de Tareas</h2> 
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
