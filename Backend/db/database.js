const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const DEFAULT_DATABASE_FILEPATH = path.resolve(__dirname, '../tasks.db');


class Database {
  constructor(filepath = DEFAULT_DATABASE_FILEPATH) {
    this.filepath = filepath;
  }

  async connect() {
    this.db = await open({
      filename: this.filepath,
      driver: sqlite3.Database
    });

    await this.createTable();
  }

  async createTable() {
    console.log('Creando tabla tasks...');
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla creada (o ya existía)');

  // Precarga de datos iniciales si la tabla está vacía
  const { count } = await this.db.get('SELECT COUNT(*) as count FROM tasks');
    if (count === 0) {
      await this.db.exec(`
        INSERT INTO tasks (title, description, completed, createdAt) VALUES
          ('Aprender React', 'Curso inicial de React con Vite', 0, CURRENT_TIMESTAMP),
          ('Backend con Express', 'Levantar API REST usando SQLite', 1, CURRENT_TIMESTAMP),
          ('Deploy en Vercel', 'Subir frontend a Vercel y backend a Render', 0, CURRENT_TIMESTAMP);
      `);
      console.log(' Datos precargados en tasks');
    }
  }


  async getAllTasks() {
    return this.db.all('SELECT * FROM tasks');
  }

  async getTaskById(id) {
    return this.db.get('SELECT * FROM tasks WHERE id = ?', id);
  }

  async addTask(title, description = '', completed = 0) {
    const result = await this.db.run(
      'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
      title, description, completed ? 1 : 0
    );
    return { id: result.lastID };
  }

  async updateTaskById(id, { title, description, completed }) {
    const task = await this.getTaskById(id);
    if (!task) return null;

    await this.db.run(
      `UPDATE tasks 
       SET title = COALESCE(?, title), 
           description = COALESCE(?, description), 
           completed = COALESCE(?, completed)
       WHERE id = ?`,
      [title, description, completed !== undefined ? (completed ? 1 : 0) : null, id]
    );

    return this.getTaskById(id);
  }

  async deleteTaskById(id) {
    const result = await this.db.run('DELETE FROM tasks WHERE id = ?', id);
    return result.changes > 0;
  }

  async close() {
    await this.db.close();
  }
}

module.exports = Database;
