
import React from 'react';

export default function TaskItem({ task, onDelete, onToggle }) {
  const handleCheckboxChange = () => {
    onToggle(task);
  };

  return (
    <div className={`task-item${task.completed ? ' completed' : ''}`}>
      <div className="info">
        <label>
          <input
            type="checkbox"
            checked={!!task.completed} //booleano
            onChange={handleCheckboxChange}
          />
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none', marginLeft: '0.5rem' }}>
            {task.title}
          </span>
        </label>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        type="button"
        className="btn custom-dark-btn w-70"
      >
        Eliminar
      </button>
    </div>
  );
}
