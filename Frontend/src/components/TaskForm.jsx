
import React, { useState } from 'react';
import { createTask, updateTask, findTaskByTitle } from '../api.js';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000); 
  };
  const [searchTitle, setSearchTitle] = useState('');
  const [editingId, setEditingId] = useState(null); // activa edicion
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
    setError('');
    setSearchTitle('');
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showError('El título es obligatorio');
      return;
    }

    try {
      if (editingId) {
        await updateTask(editingId, { title, description });
        alert('Tarea actualizada');
      } else {
        const newTask = { title, description, completed: false };
        const created = await createTask(newTask);
        onTaskCreated(created);
        alert('Tarea creada');
      }

      setTitle('');
      setDescription('');
      setError('');
      setEditingId(null);
      }
      catch (err) {
        showError(err.message);
      }
  };
  
      const handleSearch = async () => {
      if (!searchTitle.trim()) {
        showError('Ingresá un título para buscar');
        return;
      }

      try {
        const task = await findTaskByTitle(searchTitle.trim());

        if (task && task.title.toLowerCase() === searchTitle.trim().toLowerCase()) {
          setTitle(task.title);
          setDescription(task.description || '');
          setEditingId(task.id);
          setError('');

        }
        else {
          showError('No se encontró coincidencia');
        }

      }
      catch (err) {
        showError(err.message || 'Error al buscar la tarea');
      }
    };

  return (
  <>
    {/* Formulario de creación / edición */}
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="text-center mb-3 ">Nueva tarea</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        // required
      />

      <textarea
        className="form-control mb-3"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button type="submit" className="btn custom-dark-btn w-70">
        {editingId ? 'Actualizar tarea' : 'Agregar tarea'}
      </button>
    </form>

    <br />

    {/* Bloque de búsqueda */}
    <div className="mb-4">
      <h2>Actualizar tarea</h2>
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Título de la tarea a buscar"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
        <button onClick={handleSearch} type="button" className="btn custom-dark-btn w-70">
          Buscar
        </button>
        {editingId && (
          <button onClick={clearForm} type="button" className="btn btn-danger">
            Cancelar edición
          </button>
        )}
      </div>
    </div>

    <div className="error-message-container">
      {error && (
        <div className="alert alert-danger mt-3 mb-0 py-2 px-3">
          {error}
        </div>
      )}
    </div>
  </>
);
}
