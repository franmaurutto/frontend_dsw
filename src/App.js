import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Cursos from './components/ListaCursos';
import SobreNosotros from './components/SobreNosotros.js';
import Contacto from './components/Contacto';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './App.css';

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarSignUp, setMostrarSignUp] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(""); // Estado para guardar el tipo de usuario (Alumno o Profesor)

  // Función para mostrar el formulario de inicio de sesión
  const abrirLogin = (tipo) => {
    setTipoUsuario(tipo);
    setMostrarLogin(true);
  };

  // Función para mostrar el formulario de creación de cuenta
  const abrirSignUp = (tipo) => {
    setTipoUsuario(tipo);
    setMostrarSignUp(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage onLogin={abrirLogin} onSignUp={abrirSignUp} />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
        {mostrarLogin && <LoginForm tipoUsuario={tipoUsuario} onClose={() => setMostrarLogin(false)} />}
        {mostrarSignUp && <SignUpForm tipoUsuario={tipoUsuario} onClose={() => setMostrarSignUp(false)} />}
      </div>
    </Router>
  );
}

export default App;
