import React from 'react';

export default function TaskItem({ task, onDelete, onToggle }) {
  return (
    <div className={`task-item${task.completed ? ' completed' : ''}`}>
      <div className="info">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)} />
        <span>{task.title}</span>
      </div>
      <button onClick={() => onDelete(task.id)} type="submit" className="btn custom-dark-btn w-70">Eliminar</button>
    </div>
  );
}
