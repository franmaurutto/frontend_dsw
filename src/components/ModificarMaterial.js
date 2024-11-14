import React from 'react';
import { useMaterial } from './MaterialContext.js';
import { updateMaterial } from '../services/MaterialService.js';
import { useState, useEffect } from 'react';
import NavBar from './NavBar.js';
import '../styles/ModificarMaterial.css';

export const ModificarMaterial = () => {

  const {material,setMaterial}=useMaterial();
  const [titulo, setTitulo] =useState(material ? material.titulo : '');
  const [descripcion, setDescripcion] = useState(material ?  material.descripcion : '');
  const [mensajeExito, setMensajeExito] = useState('');

  const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  { label: 'Crear Material', path: '/crear-material' },
  { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
    if (material) {
      setTitulo(material.titulo || '');
      setDescripcion(material.descripcion || '');
    }
  }, [material]);


  if (!material) {
    return <p>Cargando datos del curso...</p>;  
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedMaterial =({
      ...material,
      titulo,
      descripcion,
    });

  Object.keys(updatedMaterial).forEach(key => {
    if (updatedMaterial[key] === null || updatedMaterial[key] === undefined) {
      delete updatedMaterial[key];
    }
  });

  updateMaterial(material.id, updatedMaterial)
      .then((updatedData) => {
        setMaterial(updatedData);
        setMensajeExito('Datos del material actualizados correctamente');
        console.log('Datos actualizados del material:', updatedMaterial);
        setTimeout(() => setMensajeExito(''), 5000);
      })
      .catch((error) => {
        console.error('Error al actualizar los datos del material:', error);
      });
    }
  
  
  return (
    <div>
      <NavBar links={profLinks}></NavBar>
      <div className='mod-material'>
        <h1>Datos del material</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <form onSubmit={handleSubmit} className='modificar'>
          <label>Titulo:</label>
          <input type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}></input>
          <label>Descripcion:</label>
          <input type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}></input>
          <button type='submit'>Modificar Datos</button>
        </form>
        <div className='btns-curso'>
        </div>
      </div>
    </div>
  )
}
export default ModificarMaterial