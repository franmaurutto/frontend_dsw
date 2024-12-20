import React from 'react'
import NavBar from './NavBar.js'
import '../styles/NavegacionProf.css';
import { useState,useEffect } from 'react';
import { getCursosProfesor } from '../services/UsuarioServices.js';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode'; 
import { getCurso } from '../services/CursoServices.js';

export const NavegacionProf = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate(); 
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const usuarioId = decodedUsuarioToken?.id || null;
  const currentTime = Math.floor(Date.now() / 1000);
  
  useEffect(() => {
    if (decodedUsuarioToken.exp<currentTime) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
    if (decodedUsuarioToken && usuarioId) {
        const fetchCursos = async () => {
          try {
            const data = await getCursosProfesor(usuarioId); 
            setCursos(data.data); 
          } catch (error) {
            console.error('Error al obtener los cursos:', error);
          }
        };
        fetchCursos();
      }
    }
  , [decodedUsuarioToken, usuarioId]);

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
      const decodedToken = jwtDecode(data);
      if (!decodedToken) throw new Error('No se recibió token del curso.');
      localStorage.setItem('cursoToken', data);
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
              <li key={index} onClick={() => handleCursoClick(curso.id)}>
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

