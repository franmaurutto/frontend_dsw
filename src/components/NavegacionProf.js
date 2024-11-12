import React from 'react'
import NavBar from './NavBar.js'
import '../styles/NavegacionProf.css';
import { useUser } from './UsuarioContext.js';
import { useState,useEffect } from 'react';
import { getCursosProfesor } from '../services/ProfesorServices.js';
import { useNavigate } from 'react-router-dom';
import { useCurso } from './CursoContext.js';


export const NavegacionProf = () => {

  const { setCurso } = useCurso();
  const { usuario } = useUser(); 
  const [cursos, setCursos] = useState([]); 

  const navigate=useNavigate()

  useEffect(() => {
    if (usuario && usuario.id) { 
      const fetchCursos = async () => {
        try {
          const data = await getCursosProfesor(usuario.id); // Usamos el id del usuario
          setCursos(data.data); // Guardamos los cursos en el estado
        } catch (error) {
          console.error('Error al obtener los cursos:', error);
        }
      };

      fetchCursos();
    }
  }, [usuario]);

  const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  ];

  const handleCursoClick = (curso) => {
      setCurso(curso);
      navigate('/datos-curso'); 
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

