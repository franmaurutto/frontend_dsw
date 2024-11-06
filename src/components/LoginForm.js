import React from 'react';
//import '../styles/Form.css';

const LoginForm = ({ tipoUsuario, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Iniciando sesión como ${tipoUsuario}`);
    // Aquí podrías añadir la lógica para autenticar al usuario como Alumno o Profesor
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión - {tipoUsuario}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <button onClick={onClose} className="close-button">Cerrar</button>
    </div>
  );
};

export default LoginForm;