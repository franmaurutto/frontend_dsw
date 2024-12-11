import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.js';
import '../styles/NavegacionAlu.css';
import { getCursos } from '../services/CursoServices.js';
import { getCurso } from '../services/CursoServices.js';
import  {jwtDecode} from 'jwt-decode';

export const NavegacionAlu = () => {

  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  const aluLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/mis-cursos' },
  { label: 'Cursos', path: '/nav-alu' },
  ];

  useEffect(() => {
    const usuarioToken = localStorage.getItem('usuarioToken');
    if (usuarioToken) {
      const usuario = JSON.parse(usuarioToken); 
      if (usuario.id) { 
        const fetchCursos = async () => {
          try {
            const data = await getCursos(usuario.id); 
            setCursos(data.data); 
          } catch (error) {
            console.error('Error al obtener los cursos:', error);
          }
        };
        fetchCursos();
      }
    }
  }, []);



  const handleCursoClick = async (cursoId) => {
    try {
      const response = await getCurso(cursoId); 
      const { cursoToken } = response;

    if (!cursoToken) {
      throw new Error('No se recibió el token del curso.');
    }
    const decodedToken = jwtDecode(cursoToken);
    console.log(decodedToken);
    localStorage.setItem('cursoToken', cursoToken);
    navigate(`/curso/${cursoId}`); 
    } catch (error) {
      console.error('Error al manejar el clic en el curso:', error);
      alert('Hubo un problema al acceder al curso. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className='navalu'>
      <NavBar links={aluLinks}></NavBar>
        <div className="cursos-list">
        <h2>Cursos</h2>
        <ul className='items-cursos'>
            {cursos.map((curso) => (
              <li key={curso.id} onClick={() => handleCursoClick(curso.id)}>       
                  <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
