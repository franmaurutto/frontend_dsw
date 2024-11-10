import React from 'react';
import NavBar from './NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { useState } from 'react';
import { authAlumno } from '../services/AlumnoServices.js';
import { useUser } from './UsuarioContext.js';
import { authProfesor } from '../services/ProfesorServices.js';

const HomePage = () => {

  const [mail, setMail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState(null);
  const homeLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Cursos', path: '/cursos' },
  { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
  { label: 'Contacto', path: '/contacto' },
  ];
  const { setUsuario } = useUser(); 
  const navigate = useNavigate();
  const handleMailChange = (e) => setMail(e.target.value);
  const handleContraseniaChange = (e) => setContrasenia(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mail.includes('@educatech')) {
        const response = await authProfesor(mail, contrasenia);
        console.log('Inicio de sesión exitoso:', response);
        setUsuario(response);
        navigate('/nav-prof');  
      } else {
        const response = await authAlumno(mail, contrasenia);
        console.log('Inicio de sesión exitoso:', response);
        setUsuario(response); 
        navigate('/nav-alu');   
      }
    } catch (err) {
      setError('Correo o contraseña incorrecta');
      console.error('Error al iniciar sesión:', err);
    }
  };

  return(
  <div className="home-page">
    <NavBar links={homeLinks} />
    <img src="/milogo.png" alt="Descripción de la imagen" className="home-image" />
      <div className="home-content">
        <h2>Empodera tu futuro con EducaTech</h2>
        <p>Bienvenido a EducaTech, tu plataforma ideal para aprender programación de manera práctica y efectiva. Con nuestros cursos interactivos, desde los fundamentos hasta temas avanzados, podrás mejorar tus habilidades y prepararte para el futuro. ¡Comienza hoy mismo y lleva tus conocimientos al siguiente nivel!</p>
        <div className='form_inicio'>
          <h3 >Inicia Sesion</h3>
          <form onSubmit={handleSubmit}>
          <input type="email"className='inp'placeholder='Email' name='mail' value={mail} onChange={handleMailChange}></input>
          <input type="Password" className='inp' placeholder='Contraseña' name='contrasenia' value={contrasenia} onChange={handleContraseniaChange}></input>
          <button className='btn_is'>Iniciar Sesion</button>       
          </form>
          {error && <p className="error-box">{error}</p>}
          <h5>¿No tienes cuenta?</h5>
          <Link to="/sign-up-form">Registrate</Link> 
        </div> 
      </div>

  </div>
  )
};

export default HomePage;