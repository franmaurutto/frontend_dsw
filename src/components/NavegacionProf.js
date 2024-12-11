import React from 'react'
import NavBar from './NavBar.js'
import '../styles/NavegacionProf.css';
import { useUser } from './UsuarioContext.js';
import { useState,useEffect } from 'react';
import { getCursosProfesor } from '../services/ProfesorServices.js';
import { useNavigate } from 'react-router-dom';
import { useCurso } from './CursoContext.js';


export const NavegacionProf = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const usuarioToken = localStorage.getItem('usuarioToken');
    if (usuarioToken) {
      const usuario = JSON.parse(usuarioToken); 
      if (usuario.id) { 
        const fetchCursos = async () => {
          try {
            const data = await getCursosProfesor(usuario.id); 
            setCursos(data.data); 
          } catch (error) {
            console.error('Error al obtener los cursos:', error);
          }
        };
        fetchCursos();
      }
    }
  }, []);

  const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  { label: 'Crear Material', path: '/crear-material' },
  { label: 'Materiales', path: '/materiales' },
  ];


  const handleCursoClick = async (cursoId) => {
    try {
      if (!cursoId) throw new Error('ID de curso inválido');
      const data = await getCurso(cursoId);
      const { token: cursoToken } = data;

      if (!cursoToken) throw new Error('No se recibió token del curso.');
      const decodedToken = jwtDecode(cursoToken);
      console.log('Información del token decodificado:', decodedToken);
      localStorage.setItem('cursoToken', cursoToken);
      navigate('/datos-curso');
    } catch (error) {
      console.error('Error en handleCursoClick:', error.message);
    }
  };


  return (
    <div className='nav-prof'>
      <NavBar links={profLinks}></NavBar>
      <div className='prof-cursos'>
        <h1>Mis Cursos</h1>
        {cursos.length > 0 ? (
          <ul className='list-cursos-prof'>
            {cursos.map((curso,index) => (
              <li key={index} onClick={() => handleCursoClick(curso)}>
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes cursos creados.</p>
        )}
      </div>
    </div>
  )
}

