import React from 'react';
import { Link,useNavigate, useLocation} from 'react-router-dom';
import '../styles/NavBar.css';
import { useState } from 'react';
import { deleteUsuario } from '../services/UsuarioServices.js';
import { jwtDecode } from 'jwt-decode';

const NavBar = ({ links = [] }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [menuActive, setMenuActive] = useState(false);
 

  
  const removeToken = () => localStorage.removeItem('authToken');

  const handleSignUp = () => {
    navigate('/sign-up-form'); 
  };

  const handleLogout = () => {
    removeToken(); 
    navigate('/'); 
  };

  const handleCloseAccount =async () => {
    const token = localStorage.getItem('authToken'); 

    if (!token) {
      alert('No se encontró un usuario autenticado');
      return;
    }

    const decodedToken = jwtDecode(token); 
    const userId = decodedToken.id
    if (!userId) {
      alert('No se pudo encontrar el ID del usuario en el token.');
      return;
    }
    const confirmation = window.confirm('¿Estás seguro de que quieres cerrar tu cuenta? Esta acción no se puede deshacer.');
        if (confirmation) {
      try {
        deleteUsuario(userId) 
        handleLogout()
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        alert('Hubo un error al intentar cerrar la cuenta. Intenta nuevamente.');
      }
    }
  };

  const toggleMenu = () => {
    setMenuActive((prevState) => !prevState);
  };

  const handleLinkClick = () => {
    setMenuActive(false); 
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
          <Link key={index} to={link.path} onClick={handleLinkClick}>{link.label} </Link>
        ))}
    </div>
    <div className="auth-buttons">
      {renderButton()}
    </div>
  </nav>
  )
};


export default NavBar;