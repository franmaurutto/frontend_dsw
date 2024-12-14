import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCurso, updateCurso, getMaterialesCurso, getCurso } from '../services/CursoServices.js';
import { updateMaterial } from '../services/MaterialService.js'; 
import NavBar from './NavBar.js';
import '../styles/DatosCurso.css';
import  {jwtDecode} from 'jwt-decode';
import { getParcial } from '../services/ParcialServices.js';


export const DatosCurso = () => {
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  console.log(cursoToken)
  console.log(decodedCursoToken, 'esta es la linea 17')
  const cursoid=decodedCursoToken.id;
  if (decodedCursoToken){console.log(cursoid)}

  
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
  const [parcialId]=useState(decodedCursoToken ? decodedCursoToken.parcial_id:'');
  const [tpId]=useState(decodedCursoToken ? decodedCursoToken.tp_id:'')
  const [mensajeExito, setMensajeExito] = useState('');
  const [materiales, setMateriales] = useState([]); 
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
    const fetchData = async ()=>{
      if (!usuarioToken || !decodedUsuarioToken) {
        localStorage.removeItem('authToken');
        navigate('/');
        return;
      }
      const curso = await getCurso(cursoid)
      localStorage.removeItem('cursoToken');
      localStorage.setItem('cursoToken', curso) 
      console.log(JSON.stringify(curso))
      const decodedCursoToken1 = curso ? jwtDecode(curso) : null;
      if (decodedCursoToken1) {
      setNombre(decodedCursoToken1.nombre || '');
      setDescripcion(decodedCursoToken1.descripcion || '');
      setCantCupos(decodedCursoToken1.cantCupos);
      setFechaInicio(decodedCursoToken1.fechaInicio ? decodedCursoToken1.fechaInicio.split('T')[0] : '');
      setFechaFin(decodedCursoToken1.fechaFin ? decodedCursoToken1.fechaFin.split('T')[0] : '');
      setHoraInicio(decodedCursoToken1.horaInicio || '');
      setHoraFin(decodedCursoToken1.horaFin || '');
      setDias(decodedCursoToken1.dias || '');
      console.log(decodedCursoToken1.parcialId)
      console.log(decodedCursoToken1)
      if (decodedCursoToken1.parcialId) {
        try {
          const response = await getParcial(decodedCursoToken1.parcialId);
          const decodedToken = jwtDecode(response);
          if (!decodedToken) throw new Error('No se recibió token de autenticación.');
          localStorage.setItem('parcialToken', response);
        } catch (error) {
          console.error('Error fetching parcial:', error);
        }
      } 
    }
    }
    fetchData()
  }, []);

  useEffect(() => {
    if (decodedCursoToken) {
      getMaterialesCurso(cursoid)
        .then((materialesData) => {
          setMateriales(materialesData); 
        })
        .catch((error) => {
          console.error('Error al obtener materiales del curso:', error);
        });
    }
  }, [decodedCursoToken, cursoid]);


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
        deleteCurso(cursoid);
        navigate('/nav-prof');
      } catch (error) {
        console.error('Error al eliminar el curso:', error);
        alert('Hubo un error al intentar eliminar el curso. Intenta nuevamente.');
      }
    }
  };
  const handleVerRtaParcial = async (parcialId) => {
    if (decodedCursoToken.parcialId) {
      navigate('/ver-rtasparcial');
    } else {
      setMensajeError('No existe parcial para mostrar respuestas.'); 
      setTimeout(() => {
        setMensajeError('');
      }, 5000);
      setMensajeExito('')
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
  const handleParcial = (parcialId) => {
    if (parcialId) {
      console.log(parcialId)
      navigate('/parcial', { state: { id: parcialId } });
    } else {
      navigate('/parcial');
    }
  }

  const handleTp = (tpId) => {
    if (tpId) {
      navigate('/tp', { state: { id: tpId } });
    } else {
      navigate('/tp');
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cursoid) {
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
    Object.keys(updatedCurso).forEach(key => {
      if (updatedCurso[key] === null || updatedCurso[key] === undefined) {
        delete updatedCurso[key];
      }
    });
    updateCurso(cursoid, updatedCurso)
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
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
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
            <button type="button" onClick={() => handleParcial(decodedCursoToken.parcialId)}>Parcial</button>
            <button type="button" onClick={handleEliminar}>Eliminar Curso</button>
            <button type="button" onClick={handleAgregarMaterial}>Agregar Material</button>
            <button type="button" onClick={() => handleVerRtaParcial(decodedCursoToken.parcialId)}>Rtas Parcial</button>
            <button onClick={() => navigate('/inscripciones-curso')}>Listar Inscripciones</button>
            <button type="button" onClick={() => handleTp(decodedCursoToken.tpId)}>Trabajo Practico</button>
          </div>
        </form>

        <div className="materiales-curso">
          <h2>Materiales del Curso</h2>
          <ul>
            {materiales.length > 0 ? (
              materiales.map(material => (
                <li key={material.id} className="material-item">
                  <span>ID del material: {material.id} - {material.titulo}</span>
                  <button className='eliminar-material' onClick={() => handleEliminarMaterial(material.id)}>Eliminar Material</button>
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

