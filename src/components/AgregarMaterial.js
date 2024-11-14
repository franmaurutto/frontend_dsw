import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.js';
import '../styles/AgregarMaterial.css';
import { findMatSinCurso, addMaterialToCurso } from '../services/MaterialService.js';
import { useCurso } from './CursoContext.js';

export const AgregarMaterial = () => {
  const { curso, setCurso } = useCurso();
  const [materiales, setMateriales] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navigate = useNavigate();

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

  // Función para manejar la selección de un material y agregarlo al curso
  async function handleSelectMaterial(material) {
    try {
      console.log('Material ID:', material.id);
      console.log('Curso ID:', curso.id);
  
      // Llamar a la función de agregar material al curso
      const result = await addMaterialToCurso(material.id, curso.id);
      console.log('Material agregado al curso:', result);
      
      // Mostrar mensaje de éxito
      setMensajeExito('Material agregado al curso con éxito!');
      setMensajeError(''); // Limpiar mensaje de error en caso de éxito

      // Actualizar la lista de materiales
      const updatedMateriales = await findMatSinCurso();
      setMateriales(updatedMateriales);
    } catch (error) {
      console.error('Error al agregar el material al curso:', error.message);
      setMensajeError('Error al agregar el material al curso');
      setMensajeExito(''); // Limpiar mensaje de éxito en caso de error
    }
  }

  return (
    <div className='navprof'>
      <NavBar links={profLinks}></NavBar>
      <div className="materiales-list">
        <h2>Materiales</h2>
        
        {/* Mostrar el mensaje de éxito o error */}
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

