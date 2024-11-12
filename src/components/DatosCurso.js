import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCurso } from './CursoContext.js';
import { deleteCurso, updateCurso } from '../services/CursoServices.js';
import { useState, useEffect } from 'react';
import NavBar from './NavBar.js';
import '../styles/DatosCurso.css';

export const DatosCurso = () => {

  const {curso,setCurso}=useCurso();
  const [nombre, setNombre] =useState(curso ? curso.nombre : '');
  const [descripcion, setDescripcion] = useState(curso ? curso.descripcion : '');
  const [cantCupos, setCantCupos] = useState(curso ? curso.cantCupos : '');
  const [fechaInicio, setFechaInicio] = useState(curso ? curso.fechaInicio : '');
  const [fechaFin, setFechaFin] = useState(curso ? curso.fechaFin : '');
  const [duracion, setDuracion] = useState('');
  const [horaInicio, setHoraInicio] = useState(curso ? curso.horaInicio : '');
  const [horaFin, sethoraFin] = useState(curso ? curso.horaFin : '');
  const [dias, setDias] = useState(curso ? curso.dias : '');
  const [parcialId]=useState(curso? curso.parcialId:'')
  const [profesor] = useState(curso?.profesor || null);
  const [mensajeExito, setMensajeExito] = useState('');

  const navigate=useNavigate()


    const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  ];

  useEffect(() => {
    console.log("Curso desde contexto:", curso);
    
    if (curso) {
      console.log("Datos del curso:", curso);
      setNombre(curso.nombre || '');
      setDescripcion(curso.descripcion || '');
      setCantCupos(curso.cantCupos);
      setFechaInicio(curso.fechaInicio ? curso.fechaInicio.split('T')[0] : '' ); 
      setFechaFin(curso.fechaFin ? curso.fechaFin.split('T')[0] : '' );
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

  const handleEliminar=()=>{
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar el curso? Esta acción no se puede deshacer.');
      if (confirmation) {
      try {
        deleteCurso(curso.id)
        navigate('/nav-prof')
      } catch (error) {
        console.error('Error al eliminar el curso:', error);
        alert('Hubo un error al intentar cerrar la cuenta. Intenta nuevamente.');
      }
    }
  }

  const handleParcial=(Id)=>{
    navigate('/parcial')
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedCurso =({
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
        setMensajeExito('Datos de alumno actualizados correctamente');
        console.log('Datos actualizados del alumno:', updatedCurso);
        setTimeout(() => setMensajeExito(''), 5000);
      })
      .catch((error) => {
        console.error('Error al actualizar los datos del alumno:', error);
      });
    }
  
  
  return (
    <div>
      <NavBar links={profLinks}></NavBar>
      <div className='mod-curso'>
        <h1>Datos del curso</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <form onSubmit={handleSubmit} className='modificar'>
          <label>Nombre:</label>
          <input type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}></input>
          <label>Descripcion:</label>
          <input type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}></input>
          <label>Cantidad de cupos:</label>
          <input type="number"
            value={cantCupos}
            onChange={(e) => setCantCupos(e.target.value)}></input>
          <label>Fecha de incio:</label>
          <input type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}></input>
          <label>Fecha de finalizacion:</label>
          <input type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}></input>
          <label>Duración:</label>
          <input type="text"
            value={duracion} readOnly></input>
          <label>Hora de inicio:</label>
          <input type="text"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}></input>
          <label>Hora de finalizacion:</label>
          <input type="text"
            value={horaFin}
            onChange={(e) => sethoraFin(e.target.value)}></input>
          <button type='submit'>Modificar Datos</button>
        </form>
        <div className='btns-curso'>
        <button onClick={() => handleParcial(parcialId)}>Parcial</button>
        <button  onClick={handleEliminar}>Eliminar Curso</button>
        </div>
      </div>
    </div>
  )
}
export default DatosCurso
