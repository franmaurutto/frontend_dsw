import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, onSignUpClick }) => (
  <nav className="navbar">
    <h1 className='navLogo'>EducaTech</h1>
    <div className="nav-links">
      <Link to="/">Inicio</Link>
      <Link to="/cursos">Cursos</Link>
      <Link to="/sobre-nosotros">Sobre Nosotros</Link>
      <Link to="/contacto">Contacto</Link>
    </div>
    <div className="auth-buttons">
      <button className="btn" onClick={onLoginClick}>Iniciar Sesión</button>
      <button className="btn" onClick={onSignUpClick}>Crear Cuenta</button>
    </div>
  </nav>
);

export default NavBar;