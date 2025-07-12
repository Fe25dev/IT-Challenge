
import React from 'react';
import TaskList from './components/TaskList.jsx';

export default function App() {
  return (
    <div className="app-container">
      <h1>Mis Tareas</h1>
      <TaskList />
     
      <footer>
        <small>
          <a target="_blank" href="https://icons8.com/icon/103413/internet">favicon</a> icono de <a target="_blank" href="https://icons8.com">Icons8   </a> Desarrollo de Hector Fernando Calisaya
        </small>
      </footer>
    </div>
  );
}

