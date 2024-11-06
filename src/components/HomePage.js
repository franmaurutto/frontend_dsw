import React from 'react';
import NavBar from './NavBar';
import '../styles/HomePage.css';

const HomePage = ({ onLogin, onSignUp }) => (
  <div className="home-page">
    <NavBar onLoginClick={onLogin} onSignUpClick={onSignUp} />
    <img src="/milogo.png" alt="Descripción de la imagen" className="home-image" />
    <div className='home-wrapper'>
      <div className="home-content">
        <h2>Empodera tu futuro con EducaTech</h2>
        <p>Bienvenido a EducaTech, tu plataforma ideal para aprender programación de manera práctica y efectiva. Con nuestros cursos interactivos, desde los fundamentos hasta temas avanzados, podrás mejorar tus habilidades y prepararte para el futuro. ¡Comienza hoy mismo y lleva tus conocimientos al siguiente nivel!</p>
        <div className='form_inicio'>
          <h3 >Inicia Sesion</h3>
          <input className='inp'placeholder='Email'></input>
          <input className='inp' placeholder='Contraseña'></input>
          <button className='btn_is'>Iniciar Sesion</button>       
          <h5>¿No tienes cuenta?</h5>
          <a href="#" >Registrate</a>
        </div>
      </div> 
    </div>

  </div>
);

export default HomePage;