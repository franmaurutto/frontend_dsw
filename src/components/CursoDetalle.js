import { useState, useEffect } from 'react';
import { useUser } from './UsuarioContext.js';
import { getCursoDetalle } from '../services/CursoServices.js'; 
import NavBar from './NavBar'; 
import '../styles/CursoDetalle.css';
import { useParams } from 'react-router-dom';
import { createInscripcion } from '../services/InscripcionServices.js';

export const CursoDetalle = () => {
  //const { usuario } = useUser();
  const { cursoId } = useParams();  
  const [curso, setCurso] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  useEffect(() => {
    const cursoToken = localStorage.getItem('cursoToken');

    if (cursoToken) {
      
      setCurso(JSON.parse(cursoToken)); 
    } else {

      setMensajeError('No se encontró información del curso.');
    }
  }, []);

  const separarNombreApellido = (nombre_y_apellido) => {
    const [nombre, apellido] = nombre_y_apellido.split(' ');
    return { nombre, apellido };
  };

  const handleInscripcion = async () => {
    const usuarioToken = JSON.parse(localStorage.getItem('usuarioToken')); // Recuperar el token del usuario desde localStorage

      if (!usuarioToken || !usuarioToken.id) {
        alert('No se ha encontrado un usuario válido');
        return;
      }

      const confirmation = window.confirm('¿Estás seguro de que quieres inscribirte a este curso?');
      if (confirmation) {
        const fechaInscripcion = new Date().toISOString().split('T')[0];
        const inscripcionData = {
          fechaInscripcion: fechaInscripcion, 
          alumnoId: usuarioToken.id, 
          cursoId: curso.id,  
        };
  
      try {
        await createInscripcion(inscripcionData);
        setMensajeExito('Inscripción creada correctamente.');
        setMensajeError(''); 
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'El alumno ya está inscrito en este curso') {
          setMensajeError('Ya estás inscrito en este curso.');
          setMensajeExito(''); 
        } else {
          setMensajeError('Error al intentar inscribirse. Intenta de nuevo más tarde.');
          setMensajeExito(''); 
        }
      } finally {
        setTimeout(() => {
          setMensajeExito('');
          setMensajeError('');
        }, 5000); 
      }
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
            {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
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

