import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCurso, updateCurso, getMaterialesCurso } from '../services/CursoServices.js';
import { updateMaterial } from '../services/MaterialService.js'; 
import NavBar from './NavBar.js';
import '../styles/DatosCurso.css';
import  {jwtDecode} from 'jwt-decode';

const usuarioToken = localStorage.getItem('authToken');
const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
const cursoToken = localStorage.getItem('cursoToken');
const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
const cursoId = decodedCursoToken ? decodedCursoToken.id : null;

export const DatosCurso = () => {
  const [cursos, setCurso] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantCupos, setCantCupos] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [duracion, setDuracion] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [dias, setDias] = useState('');
  const [cursoToken, setCursoToken] = useState('');
  const [parcialId]=useState(decodedCursoToken ? decodedCursoToken.parcial_id:'');
  const [tpId]=useState(decodedCursoToken ? decodedCursoToken.tp_id:'')
  const [profesor] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [materiales, setMateriales] = useState([]); 

  const navigate = useNavigate();

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
    if (decodedCursoToken) {
      setCursoToken(decodedCursoToken); 
      setNombre(decodedCursoToken.nombre || '');
      setDescripcion(decodedCursoToken.descripcion || '');
      setCantCupos(decodedCursoToken.cantCupos);
      setFechaInicio(decodedCursoToken.fechaInicio ? decodedCursoToken.fechaInicio.split('T')[0] : '');
      setFechaFin(decodedCursoToken.fechaFin ? decodedCursoToken.fechaFin.split('T')[0] : '');
      setHoraInicio(decodedCursoToken.horaInicio || '');
      setHoraFin(decodedCursoToken.horaFin || '');
      setDias(decodedCursoToken.dias || '');
    }
  }, []);

  useEffect(() => {
    if (decodedCursoToken) {
      getMaterialesCurso(cursoId)
        .then((materialesData) => {
          setMateriales(materialesData); 
        })
        .catch((error) => {
          console.error('Error al obtener materiales del curso:', error);
        });
    }
  }, [decodedCursoToken, cursoId]);


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

  if (!decodedCursoToken) {
    return <p>Cargando datos del curso...</p>;
  }

  const handleEliminar = () => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar el curso? Esta acción no se puede deshacer.');
    if (confirmation) {
      try {
        deleteCurso(cursoId);
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
        updateMaterial(materialId, { curso: undefined });
        setMateriales(prevMateriales => prevMateriales.filter(material => material.id !== materialId));
      } catch (error) {
        console.error('Error al eliminar el material:', error);
        alert('Hubo un error al intentar eliminar el material. Intenta nuevamente.');
      }
    }
  }
  const handleAgregarMaterial = () => {
    navigate('/agregar-material');
  };
  const handleParcial = () => {
    if (parcialId) {
      navigate('/parcial', { state: { id: parcialId } });
    } else {
      navigate('/parcial');
    }
  }

  const handleTp = () => {
    if (tpId) {
      navigate('/tp', { state: { id: tpId } });
    } else {
      navigate('/tp');
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cursoId) {
      console.error("Error: No se pudo obtener el ID del curso.");
      return;
    }
    const updatedCurso = ({
      ...decodedCursoToken,
      nombre,
      descripcion,
      cantCupos,
      fechaInicio: fechaInicio ? fechaInicio.split('T')[0] : '',
      fechaFin: fechaFin ? fechaFin.split('T')[0] : '',
      duracion,
      horaInicio,
      horaFin,
      dias,
      usuarioId,
      parcialId,
    });
    console.log(updateCurso)
    Object.keys(updatedCurso).forEach(key => {
      if (updatedCurso[key] === null || updatedCurso[key] === undefined) {
        delete updatedCurso[key];
      }
    });
    updateCurso(cursoId, updatedCurso)
      .then((updatedData) => {
        setCurso(updatedData);
        setMensajeExito('Datos de curso actualizados correctamente');
        setTimeout(() => setMensajeExito(''), 5000);
      })
      .catch((error) => {
        console.error('Error al actualizar los datos del curso:', error);
      });
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
          <input type="text" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
          <div className="btns-curso">
            <button type="submit">Modificar Datos</button>
            <button onClick={() => handleParcial(decodedCursoToken.parcialId)}>Parcial</button>
            <button onClick={handleEliminar}>Eliminar Curso</button>
            <button onClick={handleAgregarMaterial}>Agregar Material</button>
            <button onClick={handleTp}>Trabajo Practico</button>
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

