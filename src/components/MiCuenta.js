import React from 'react'
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/MiCuenta.css'
import NavBar from './NavBar.js';
import { jwtDecode } from 'jwt-decode';
import { cambiarContrasenia, updateUsuario } from '../services/UsuarioServices.js';


export const MiCuenta = () => {

const getToken = () => localStorage.getItem('authToken');
const currentTime = Math.floor(Date.now() / 1000);

const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token); 
    return decodedToken; 
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
  const usuario = getUserFromToken();
  const navigate=useNavigate()
  useEffect(() => {
    if (usuario.exp<currentTime) {
      localStorage.removeItem('authToken');
      navigate('/'); 
    }
  }, [usuario, navigate]);
  const [nombreCompleto, setNombreCompleto] =useState(usuario ? usuario.nombreCompleto : '');
  const [mail, setMail] = useState(usuario ? usuario.mail :'');
  const [telefono, setTelefono] = useState(usuario ? usuario.telefono : '');
  const [rol]=useState(usuario ? usuario.rol: '');
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarNuevaContraseña, setConfirmarNuevaContraseña] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError]=useState('');




  const links = usuario && usuario.rol==='profesor'
    ? [
      { label: 'Mi cuenta', path: '/mi-cuenta' },
      { label: 'Mis Cursos', path: '/nav-prof' },
      { label: 'Crear Curso', path: '/crear-curso' },
      { label: 'Crear Material', path: '/crear-material' },
      { label: 'Materiales', path: '/materiales' },
      ]
    : [
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/mis-cursos' },
        { label: 'Cursos', path: '/nav-alu' },
        { label: 'Mis Certificados', path: '/mis-certificados' },
      ];

  

  if (!usuario) {
    return <p>Cargando datos del usuario...</p>;  
  }

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser =({
      ...usuario,
      nombreCompleto,
      rol,
      mail,
      telefono,
    });

  
  updateUsuario(usuario.id, updatedUser)
    .then((updatedData) => {
      setNombreCompleto(updatedData.nombreCompleto);
      setMail(updatedData.mail);
      setTelefono(updatedData.telefono);
      setMensajeExito('Datos actualizados correctamente');
      if (usuario.rol==='profesor'){
        setTimeout(() => {
          setMensajeExito('');
          navigate('/nav-prof');
        }, 5000);
      }else{
        setTimeout(() => {
          setMensajeExito('');
          navigate('/mis-cursos');
        }, 5000);
      }
    })
    .catch((error) => {
      setMensajeError('No se puedieron actualizar los datos')
      setTimeout(() => setMensajeError(''), 5000);
      console.error('Error al actualizar los datos del usuario:', error);
    });
};

const handleCambiarContrasenia = (e) => {
    e.preventDefault();
    if (nuevaContraseña !== confirmarNuevaContraseña) {
      setMensajeError('Contraseñas no coinciden')
      setTimeout(() => setMensajeError(''), 5000);
      return;
    }
    try {
      cambiarContrasenia(usuario.id, contraseñaActual, nuevaContraseña);
      setMensajeExito('Contraseña cambiada exitosamente.');
      setMostrarFormulario(false);
      if (usuario.rol==='profesor'){
        setTimeout(() => {
          setMensajeExito('');
          navigate('/nav-prof');
        }, 5000);
      }else{
        setTimeout(() => {
          setMensajeExito('');
          navigate('/mis-cursos');
        }, 5000);
      }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error.message);
        setMensajeError(`Error: ${error.message}`);
        setTimeout(() => setMensajeError(''), 5000);
    }
  };


  return (
    <div className='pag-modificar'>
      <NavBar links={links}></NavBar>
      <div className='form-modificar'>
        <h1>Datos de la cuenta</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
  
        {!mostrarFormulario ? (
          <form onSubmit={handleSubmit} className='modificar'>
            <label>Nombre Completo:</label>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
            />
            <label>Email:</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder={usuario ? usuario.mail : 'Cargando...'}
            />
            <label>Telefono:</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <div className="botones-container">
              <button type='submit'>Modificar datos</button>
              <button 
                type="button"
                onClick={() => setMostrarFormulario(!mostrarFormulario)} 
                className="btn-cambiar-contrasena">
                {mostrarFormulario ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCambiarContrasenia} className="modificar">
            <label>Contraseña Actual:</label>
            <input
              type="password"
              value={contraseñaActual}
              onChange={(e) => setContraseñaActual(e.target.value)}
            />
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
            />
            <label>Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              value={confirmarNuevaContraseña}
              onChange={(e) => setConfirmarNuevaContraseña(e.target.value)}
            />
            <div className="botones-container">
              <button type="submit">Guardar nueva contraseña</button>
              <button 
                type="button" 
                onClick={() => setMostrarFormulario(!mostrarFormulario)} 
                className="btn-cambiar-contrasena">
                {mostrarFormulario ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}  
