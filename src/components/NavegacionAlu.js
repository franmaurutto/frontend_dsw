import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.js';
import '../styles/NavegacionAlu.css';
import { getCursos } from '../services/CursoServices.js';

export const NavegacionAlu = () => {

  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  const aluLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/mis-cursos' },
  { label: 'Cursos', path: '/nav-alu' },
  ];

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getCursos();
        setCursos(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCursos();
  }, []);

  const handleCursoClick = (cursoId) => {
    navigate(`/curso/${cursoId}`); 
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
