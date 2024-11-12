import { useState, useEffect } from 'react';
import { useUser } from './UsuarioContext.js';
import { getCursoDetalle } from '../services/CursoServices.js'; 
import NavBar from './NavBar'; 
import '../styles/CursoDetalle.css';
import { useParams } from 'react-router-dom';
import { createInscripcion } from '../services/InscripcionServices.js';

export const CursoDetalle = () => {
  const { usuario } = useUser();
  const { cursoId } = useParams();  // Obtenemos el cursoId de los parámetros de la URL
  const [curso, setCurso] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const data = await getCursoDetalle(cursoId);
        setCurso(data.data);
      } catch (error) {
        console.error('Error al obtener los detalles del curso:', error);
      }
    };

    fetchCurso();
  }, [cursoId]);  // Dependemos de cursoId para actualizar la información cuando cambie

  const separarNombreApellido = (nombre_y_apellido) => {
    const [nombre, apellido] = nombre_y_apellido.split(' ');
    return { nombre, apellido };
  };

  const handleInscripcion = async () => {
    if (!usuario || !usuario.id) {
      alert('No se ha encontrado un usuario válido');
      return;
    }
    const confirmation = window.confirm('¿Estás seguro de que quieres inscribirte a este curso?');
    if (confirmation) {
        const fechaInscripcion = new Date().toISOString().split('T')[0]; 
        const inscripcionData = {
          fechaInscripcion: fechaInscripcion, 
          cancelado: "No", 
          alumnoId: usuario.id, 
          cursoId: curso.id, 
        };
  
        createInscripcion(inscripcionData)
            .then((updatedData) => {
                setMensajeExito('Inscripción creada correctamente.');
                setTimeout(() => setMensajeExito(''), 5000);
            })
            .catch((error) => {
              console.error('Error al actualizar los datos del alumno:', error);
            });
    }
  };
  
  return (
    <div className='curso-detalle'>
      <NavBar links={[
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/mis-cursos' },
        { label: 'Cursos', path: '/nav-alu' },
      ]} />
    
      <div className='contenido-curso-detalle'>
        {curso ? (
          <>
            {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
            <h1>{curso.nombre}</h1>
            <p><strong>Descripción:</strong> {curso.descripcion}</p>
            {curso.profesor.nombre_y_apellido && (
              <>
                <p><strong>Profesor:</strong> {separarNombreApellido(curso.profesor.nombre_y_apellido).nombre} {separarNombreApellido(curso.profesor.nombre_y_apellido).apellido}</p>
              </>
            )}
            <p><strong>Email del Profesor:</strong> {curso.profesor.mail}</p>
            <p><strong>Duración:</strong> {curso.duracion}</p>
            <p><strong>Fecha de Inicio:</strong> {curso.fechaInicio}</p>
            <p><strong>Fecha de Fin:</strong> {curso.fechaFin}</p>
            <p><strong>Hora Inicio:</strong> {curso.horaInicio}</p>
            <p><strong>Hora Fin:</strong> {curso.horaFin}</p>
            <button className='inscribirme-btn' onClick={handleInscripcion}>Inscribirme</button>
          </>
        ) : (
          <p>Cargando detalles del curso...</p>
        )}
      </div>
    </div>
  );
};

export default CursoDetalle;

