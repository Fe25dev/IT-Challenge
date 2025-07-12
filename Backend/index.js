require('dotenv').config();
const express = require('express');
const Database = require('./db/database'); 

const app = express();
const PORT = process.env.PORT || 3001;

(async () => {
  console.log('Iniciando servidor...');

  const db = new Database();
  await db.connect();
  console.log(' Base de datos conectada');

  app.use(express.json());
  console.log(' Middleware cargado');

  const cors = require('cors');
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  }));

  const taskRoutes = require('./routes/tasks')(db);
  app.use('/api/tasks', taskRoutes);
  console.log(' Rutas de tareas montadas');

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
})();
