import React from 'react';
import { Link,useNavigate, useLocation} from 'react-router-dom';
import '../styles/NavBar.css';
import { useUser } from './UsuarioContext.js';
import { deleteAlumno } from '../services/AlumnoServices.js';
import { deleteProfesor } from '../services/ProfesorServices.js';
import { useState } from 'react';
const NavBar = ({ links = [] }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [menuActive, setMenuActive] = useState(false);
  const { usuario, logout } = useUser();

  const handleSignUp = () => {
    navigate('/sign-up-form'); 
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const handleCloseAccount =async () => {
    if (!usuario || !usuario.id) {
    alert('No se ha encontrado un usuario válido');
    return;
    }
    const confirmation = window.confirm('¿Estás seguro de que quieres cerrar tu cuenta? Esta acción no se puede deshacer.');
        if (confirmation) {
      try {
        
        if (usuario.mail.includes('@educatech')) {
          await deleteProfesor(usuario.id);  
        } else {
          await deleteAlumno(usuario.id);    
        }
        
        handleLogout()
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        alert('Hubo un error al intentar cerrar la cuenta. Intenta nuevamente.');
      }
    }
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };



  const renderButton=()=>{
    if(location.pathname ==='/' || location.pathname==='/sign-up-form'){
      return(
        <button className="btn" onClick={handleSignUp}>Crear Cuenta</button>
      )
    } else{
        return (
        <>
          <button className="btn" onClick={handleLogout}>Cerrar Sesion</button>
          <button className="btn" onClick={handleCloseAccount}>Eliminar Cuenta</button>
        </>
      );
    }
  }

  return(
  <nav className="navbar">
    <h1 className='navLogo'>EducaTech</h1>
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776; 
      </button>
    <div className={`nav-links ${menuActive ? 'active' : ''}`}>
        {links.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setMenuActive(false)}>{link.label} </Link>
        ))}
    </div>
    <div className="auth-buttons">
      {renderButton()}
    </div>
  </nav>
  )
};


export default NavBar;