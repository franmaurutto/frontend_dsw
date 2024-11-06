import React from 'react';
//import '../styles/Form.css';

const SignUpForm = ({ tipoUsuario, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Creando cuenta como ${tipoUsuario}`);
  };

  return (
    <div className="form-container">
      <h2>Crear Cuenta - {tipoUsuario}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre de usuario" required />
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Registrar</button>
      </form>
      <button onClick={onClose} className="close-button">Cerrar</button>
    </div>
  );
};

export default SignUpForm;