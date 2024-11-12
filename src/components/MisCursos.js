import React from 'react'
import { useEffect,useState } from 'react';
import { getCursosAlumno } from '../services/AlumnoServices.js';
import { useUser } from './UsuarioContext.js';
import '../styles/MisCursos.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';

export const MisCursos = () => {

  const navigate= useNavigate

  const { usuario } = useUser(); 
  const [cursos, setCursos] = useState([]); 
  const [mail] = useState(usuario ? usuario.mail : '');

  const links = usuario && mail.includes('@educatech')
    ? [
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/nav-prof' },
        { label: 'Crear Curso', path: '' },
      ]
    : [
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/mis-cursos' },
        { label: 'Cursos', path: '/nav-alu' },
      ];

  useEffect(() => {
    if (usuario && usuario.id) { 
      const fetchCursos = async () => {
        try {
          const data = await getCursosAlumno(usuario.id); 
          setCursos(data.data); 
        } catch (error) {
          console.error('Error al obtener los cursos:', error);
        }
      };

      fetchCursos();
    }
  }, [usuario]);

  const handleClick=()=>{
    navigate('/nav-alu')
  }


  return (
    <div className='mis-cursos'>
      <NavBar links={links}></NavBar>
      <div className='lista-mis-cursos'>
        <h1>MisCursos</h1>
        {cursos.length > 0 ? (
          <ul className='list-cursos'>
            {cursos.map((curso, index) => (
              <li key={index}>
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className='inscribirse'>
            <p>No se ha inscripto a ningun curso.</p>
            <button onClick={handleClick}>Inscribirse</button>
          </div>
        )}
      </div>
    </div>
  )
}
export default MisCursos;