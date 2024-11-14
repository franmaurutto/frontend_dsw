import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.js';
import '../styles/Materiales.css';
import { getMateriales, deleteMaterial } from '../services/MaterialService.js';
import { useMaterial } from './MaterialContext.js';


export const Materiales = () => {
  const { setMaterial } = useMaterial();
  const [materiales, setMateriales] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
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
        const data = await getMateriales();
        setMateriales(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMateriales();
  }, []);

  const handleEliminarMaterial = async (materialId) => {
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.');
    if (confirmation) {
      try {
        await deleteMaterial(materialId);
        setMensajeExito('Material eliminado correctamente.');
        setTimeout(() => setMensajeExito(''), 5000);

        // Eliminar el material de la lista sin hacer una nueva solicitud
        setMateriales((prevMateriales) => prevMateriales.filter(material => material.id !== materialId));
      } catch (error) {
        console.error('Error al eliminar el material:', error);
      }
    }
  };

  const handleModificarMaterial = (material) => {
    setMaterial(material);
    navigate('/modificar-material'); 
  };

  return (
    <div className='navprof'>
      <NavBar links={profLinks}></NavBar>
      <div className="materiales-list">
        <h2>Materiales</h2>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <ul className='items-materiales'>
          {materiales.map((material) => (
            <li key={material.id}>
              <h3>{material.titulo}</h3>
              <p>{material.descripcion}</p>
              <div>
                <button
                  className="boton-material"
                  onClick={() => handleModificarMaterial(material)}
                >
                  Modificar Material
                </button>
                <button
                  className="boton-material"
                  onClick={() => handleEliminarMaterial(material.id)}
                >
                  Eliminar Material
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
