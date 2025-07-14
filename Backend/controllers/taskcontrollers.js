
exports.getAllTasks = async (req, res, db) => {
  try {
    const { title } = req.query;
    let tasks = await db.getAllTasks();

    // a booleano
    tasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed),
    }));

    if (title) {
      const match = tasks.find(task =>
        task.title.toLowerCase() === title.toLowerCase()
      );
      return res.json(match ? [match] : []);
    }

    res.json(tasks);
  } catch (err) {
    console.error(' Error en getAllTasks:', err.message);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

exports.createTask = async (req, res, db) => {
  const { title, description, completed = false } = req.body;
  if (!title) return res.status(400).json({ error: 'Título requerido' });

  try {
    const { id } = await db.addTask(title, description, completed ? 1 : 0);

    const newTask = await db.getTaskById(id);

    const task = {
      ...newTask,
      completed: Boolean(newTask.completed),
    };

    res.status(201).json(task);
  } catch (err) {
    console.error(' Error en createTask:', err.message);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

exports.updateTask = async (req, res, db) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const updated = await db.updateTask(id, { title, description, completed });
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });

    // a booleano antes 
    const task = {
      ...updated,
      completed: Boolean(updated.completed),
    };

    res.json(task);
  } catch (err) {
    console.error(' Error en updateTask:', err.message);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

exports.deleteTask = async (req, res, db) => {
  const { id } = req.params;
  try {
    const deleted = await db.deleteTask(id);
    if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada', id });
  } catch (err) {
    console.error(' Error en deleteTask:', err.message);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};


