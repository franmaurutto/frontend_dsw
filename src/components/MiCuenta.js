import React from 'react'
import { useUser } from './UsuarioContext.js';
import { useState, useEffect } from 'react';
import '../styles/MiCuenta.css'
import NavBar from './NavBar.js';
import { updateUsuario } from './UsuarioService'; 
import { updateAlumno } from '../services/AlumnoServices.js';
import { updateProfesor } from '../services/ProfesorServices.js';

export const MiCuenta = () => {

  const { usuario, setUsuario } = useUser(); 
  
  const [nombreCompleto, setNombreCompleto] =useState(usuario ? usuario.nombreCompleto : '');
  const [mail, setMail] = useState(usuario ? usuario.mail : '');
  const [telefono, setTelefono] = useState(usuario ? usuario.telefono : '');
  const [contrasenia, setContrasenia] = useState(usuario ? usuario.contrasenia : '');
  const [mensajeExito, setMensajeExito] = useState('');

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
      ];

  useEffect(() => {
    if (usuario) {
      setNombreCompleto(usuario.nombre_y_apellido || usuario.nombreCompleto);
      setMail(usuario.mail);
      setTelefono(usuario.telefono);
      setContrasenia(usuario.contrasenia);
    }
  }, [usuario]);

  if (!usuario) {
    return <p>Cargando datos del usuario...</p>;  
  }

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser =({
      ...usuario,
      nombre_y_apellido: nombreCompleto,
      mail,
      telefono,
      contrasenia,
    });

    if (mail.includes('@educatech')) {
      updateProfesor(usuario.id, updatedUser)
        .then((updatedData) => {
          setUsuario(updatedData);
          setMensajeExito('Datos de profesor actualizados correctamente');
          console.log('Datos actualizados del profesor:', updatedUser);
          setTimeout(() => setMensajeExito(''), 5000);
        })
        .catch((error) => {
          console.error('Error al actualizar los datos del profesor:', error);
        });
    } else {
      updateAlumno(usuario.id, updatedUser)
        .then((updatedData) => {
          setUsuario(updatedData);
          setMensajeExito('Datos de alumno actualizados correctamente');
          console.log('Datos actualizados del alumno:', updatedUser);
          setTimeout(() => setMensajeExito(''), 5000);
        })
        .catch((error) => {
          console.error('Error al actualizar los datos del alumno:', error);
        });
    }
  };



  return (
    <div className='pag-modificar'>
      <NavBar links={links}></NavBar>
      <div className='form-modificar'>
      <h1>Datos de la cuenta</h1>
      {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
      <form onSubmit={handleSubmit} className='modificar'>
        <label>Nombre Completo:</label>
        <input type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}>
        </input>
        <label>Email:</label>
        <input type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)} placeholder={usuario ? usuario.mail : 'Cargando...'}>
        </input>
        <label>Telefono:</label>
        <input type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}>
        </input>
        <label>Contraseña:</label>
        <input type="text"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}>
        </input>
        <button type='submit'>Modificar datos</button>
      </form>
      </div>
    </div>
  )

} 
