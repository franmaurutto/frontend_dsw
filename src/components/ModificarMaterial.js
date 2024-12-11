import React from 'react';
import { useMaterial } from './MaterialContext.js';
import { updateMaterial } from '../services/MaterialService.js';
import { useState, useEffect } from 'react';
import NavBar from './NavBar.js';
import '../styles/ModificarMaterial.css';
import  {jwtDecode} from 'jwt-decode';

const materialToken = localStorage.getItem('materialToken');
const decodedMaterialToken = materialToken ? jwtDecode(materialToken) : null;
const materialId = decodedMaterialToken ? decodedMaterialToken.id : null;


export const ModificarMaterial = () => {
  const [titulo, setTitulo] =useState( '');
  const [descripcion, setDescripcion] = useState('');
  const [materialId, setMaterialId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  { label: 'Crear Material', path: '/crear-material' },
  { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
      try {
        if (decodedMaterialToken) {
          setTitulo(decodedMaterialToken.titulo || '');
          setDescripcion(decodedMaterialToken.descripcion || '');
          setMaterialId(decodedMaterialToken.id || null);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedMaterial =({
      titulo,
      descripcion,
    });

  Object.keys(updatedMaterial).forEach(key => {
    if (updatedMaterial[key] === null || updatedMaterial[key] === undefined) {
      delete updatedMaterial[key];
    }
  });

  updateMaterial(materialId, updatedMaterial)
      .then((updatedData) => {
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