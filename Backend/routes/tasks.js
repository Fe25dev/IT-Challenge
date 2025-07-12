const express = require('express');

module.exports = (dbInstance) => {
  const router = express.Router();

  // GET all tasks
  router.get('/', async (req, res) => {
    try {
      const tasks = await dbInstance.getAllTasks();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Búsqueda por título exacto
  router.get('/search', async (req, res) => {
      const { title } = req.query;
      if (!title) return res.status(400).json({ error: 'Falta el título' });

      try {
        const tasks = await dbInstance.getAllTasks();
        const match = tasks.find(task => task.title.toLowerCase() === title.toLowerCase());
        res.json(match ? [match] : []);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar tarea' });
      }
    });

  // POST create task
  router.post('/', async (req, res) => {
    const { title, description, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Título requerido' });

    try {
      const result = await dbInstance.addTask(title, description, completed);
      const task = await dbInstance.getTaskById(result.id);
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT update task
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updated = await dbInstance.updateTaskById(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(updated);
  });

  // DELETE task
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await dbInstance.deleteTaskById(id);
    if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada', id });
  });

  return router;
};
