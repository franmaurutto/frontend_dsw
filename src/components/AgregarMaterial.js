import React, { useState, useEffect } from 'react';
import NavBar from './NavBar.js';
import '../styles/AgregarMaterial.css';
import { findMatSinCurso, addMaterialToCurso } from '../services/MaterialService.js';
import  {jwtDecode} from 'jwt-decode';
const usuarioToken = localStorage.getItem('authToken');
const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
const cursoToken = localStorage.getItem('cursoToken');
const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
const cursoId = decodedCursoToken ? decodedCursoToken.id : null;

export const AgregarMaterial = () => {
  const [materiales, setMateriales] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await findMatSinCurso();
        setMateriales(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMateriales();
  }, []);

  async function handleSelectMaterial(material) {
    try {
      const result = await addMaterialToCurso(material.id, cursoId);
      console.log('Material agregado al curso:', result);
      setMensajeExito('Material agregado al curso con éxito!');
      setMensajeError(''); 
      const updatedMateriales = await findMatSinCurso();
      setMateriales(updatedMateriales);
    } catch (error) {
      console.error('Error al agregar el material al curso:', error.message);
      setMensajeError('Error al agregar el material al curso');
      setMensajeExito(''); 
    }
  }

  return (
    <div className='navprof'>
      <NavBar links={profLinks}></NavBar>
      <div className="materiales-list">
        <h2>Materiales</h2>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        
        <ul className='items-materiales'>
          {materiales.map((material) => (
            <li key={material.id} onClick={() => handleSelectMaterial(material)}>
              <h3>{material.titulo}</h3>
              <p>{material.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

