const API_BASE = import.meta.env.VITE_API_URL;

export async function createTask(task) {
  const res = await fetch(`${API_BASE}/api/tasks`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return await res.json();
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`);
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return res.ok;
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`,{  
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.ok;
}

export async function findTaskByTitle(title) {
  const res = await fetch(`${API_BASE}/api/tasks/search?title=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error('Error al buscar tarea');
     const tasks = await res.json();
  return tasks.length ? tasks[0] : null; //  primera coincidencia
}


