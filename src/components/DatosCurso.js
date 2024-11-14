import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurso } from './CursoContext.js';
import { deleteCurso, updateCurso, getMaterialesCurso } from '../services/CursoServices.js';
import { updateMaterial } from '../services/MaterialService.js'; // Importar getMaterialesCurso
import NavBar from './NavBar.js';
import '../styles/DatosCurso.css';

export const DatosCurso = () => {
  const { curso, setCurso } = useCurso();
  const [nombre, setNombre] = useState(curso ? curso.nombre : '');
  const [descripcion, setDescripcion] = useState(curso ? curso.descripcion : '');
  const [cantCupos, setCantCupos] = useState(curso ? curso.cantCupos : '');
  const [fechaInicio, setFechaInicio] = useState(curso ? curso.fechaInicio : '');
  const [fechaFin, setFechaFin] = useState(curso ? curso.fechaFin : '');
  const [duracion, setDuracion] = useState('');
  const [horaInicio, setHoraInicio] = useState(curso ? curso.horaInicio : '');
  const [horaFin, sethoraFin] = useState(curso ? curso.horaFin : '');
  const [dias, setDias] = useState(curso ? curso.dias : '');
  const [profesor] = useState(curso?.profesor || null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [materiales, setMateriales] = useState([]); // Estado para los materiales

  const navigate = useNavigate();

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  // Obtener materiales del curso cuando se carga el componente
  useEffect(() => {
    if (curso) {
      getMaterialesCurso(curso.id)
        .then((materialesData) => {
          setMateriales(materialesData); // Establecer los materiales obtenidos
        })
        .catch((error) => {
          console.error('Error al obtener materiales del curso:', error);
          alert('Hubo un error al obtener los materiales del curso.');
        });
    }
  }, [curso]);

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre || '');
      setDescripcion(curso.descripcion || '');
      setCantCupos(curso.cantCupos);
      setFechaInicio(curso.fechaInicio ? curso.fechaInicio.split('T')[0] : '');
      setFechaFin(curso.fechaFin ? curso.fechaFin.split('T')[0] : '');
      setHoraInicio(curso.horaInicio || '');
      sethoraFin(curso.horaFin || '');
      setDias(curso.dias || '');
    }
  }, [curso]);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      const timeDiff = endDate - startDate;

      if (timeDiff > 0) {
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDuracion(`${days} días`);
      } else {
        setDuracion('Fechas no válidas');
      }
    } else {
      setDuracion('');
    }
  }, [fechaInicio, fechaFin]);

  if (!curso) {
    return <p>Cargando datos del curso...</p>;
  }

  const handleEliminar = () => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar el curso? Esta acción no se puede deshacer.');
    if (confirmation) {
      try {
        deleteCurso(curso.id);
        navigate('/nav-prof');
      } catch (error) {
        console.error('Error al eliminar el curso:', error);
        alert('Hubo un error al intentar eliminar el curso. Intenta nuevamente.');
      }
    }
  };

  const handleEliminarMaterial = (materialId) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar este material del curso?');
    if (confirmation) {
      try {
        // Llama a la función para actualizar el material y poner el curso como undefined
        updateMaterial(materialId, { curso: undefined });
        // Actualiza la vista del frontend
        setMateriales(prevMateriales => prevMateriales.filter(material => material.id !== materialId));
      } catch (error) {
        console.error('Error al eliminar el material:', error);
        alert('Hubo un error al intentar eliminar el material. Intenta nuevamente.');
      }
    }
  };
  
  
  const handleAgregarMaterial = () => {
    setCurso(curso);
    navigate('/agregar-material');
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCurso = ({
      ...curso,
      nombre,
      descripcion,
      cantCupos,
      fechaInicio: fechaInicio ? fechaInicio.split('T')[0] : '',
      fechaFin: fechaFin ? fechaFin.split('T')[0] : '',
      duracion,
      horaInicio,
      horaFin,
      dias,
      profesorId: profesor.id,
    });

    Object.keys(updatedCurso).forEach(key => {
      if (updatedCurso[key] === null || updatedCurso[key] === undefined) {
        delete updatedCurso[key];
      }
    });

    updateCurso(curso.id, updatedCurso)
      .then((updatedData) => {
        setCurso(updatedData);
        setMensajeExito('Datos de curso actualizados correctamente');
        setTimeout(() => setMensajeExito(''), 5000);
      })
      .catch((error) => {
        console.error('Error al actualizar los datos del curso:', error);
      });
  };

  const handleParcial = (parcialId) => {
    navigate(`/parcial/${parcialId}`);
  };

  return (
    <div>
      <NavBar links={profLinks}></NavBar>
      <div className="mod-curso">
        <h1>Datos del curso</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <form onSubmit={handleSubmit} className="modificar">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <label>Descripcion:</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <label>Cantidad de cupos:</label>
          <input type="number" value={cantCupos} onChange={(e) => setCantCupos(e.target.value)} />
          <label>Fecha de inicio:</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <label>Fecha de finalización:</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <label>Duración:</label>
          <input type="text" value={duracion} readOnly />
          <label>Hora de inicio:</label>
          <input type="text" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          <label>Hora de finalización:</label>
          <input type="text" value={horaFin} onChange={(e) => sethoraFin(e.target.value)} />
          <div className="btns-curso">
            <button type="submit">Modificar Datos</button>
            <button onClick={() => handleParcial(curso.parcialId)}>Parcial</button>
            <button onClick={handleEliminar}>Eliminar Curso</button>
            <button onClick={handleAgregarMaterial}>Agregar Material</button>
          </div>
        </form>

        <div className="materiales-curso">
          <h2>Materiales del Curso</h2>
          <ul>
            {materiales.length > 0 ? (
              materiales.map(material => (
                <li key={material.id} className="material-item">
                  <span>ID del material: {material.id} - {material.titulo}</span>
                  <button onClick={() => handleEliminarMaterial(material.id)}>Eliminar Material</button>
                </li>
              ))
            ) : (
              <p>No hay materiales disponibles para este curso.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatosCurso;

