import React, { useEffect, useState } from 'react';
import { getInscripcionesAlumno } from '../services/AlumnoServices.js';
import { getCursoDeInscripcion, deleteInscripcion, updateInscripcion } from '../services/InscripcionServices.js';
import { getCursosProfesor } from '../services/ProfesorServices.js'; 
import { useUser } from './UsuarioContext.js';
import '../styles/MisCursos.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';

export const MisCursos = () => {

  const navigate= useNavigate
  const { usuario } = useUser();
  const [cursos, setCursos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  
  const links = usuario && usuario.mail.includes('@educatech')
    ? [
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/nav-prof' },
        { label: 'Crear Curso', path: '' },
      ]
    : [
        { label: 'Mi cuenta', path: '/mi-cuenta' },
        { label: 'Mis Cursos', path: '/mis-cursos' },
        { label: 'Cursos', path: '/nav-alu' },
      ];

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        if (usuario && usuario.mail.includes('@educatech')) {
          const cursosData = await getCursosProfesor(usuario.id);
          setCursos(cursosData);
        } else if (usuario && usuario.id) {
          const inscripcionesData = await getInscripcionesAlumno(usuario.id);
          if (Array.isArray(inscripcionesData)) {
            const cursosData = await Promise.all(
              inscripcionesData.map(async (inscripcion) => {
                const cursoData = await getCursoDeInscripcion(inscripcion.id, inscripcion.curso);
                return {
                  ...cursoData,
                  inscripcionId: inscripcion.id,
                  fechaInscripcion: inscripcion.fechaInscripcion,
                };
              })
            );
            setCursos(cursosData);
          } else {
            setCursos([]);
          }
        }
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
        setCursos([]);
      }
    };

    fetchCursos();
  }, [usuario]);

  const handleAnularInscripcion = async (inscripcionId) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres anular la inscripción a este curso? Esta acción no se puede deshacer.');
    if (confirmation) {
      try {
        await deleteInscripcion(inscripcionId);
        setMensajeExito('Inscripción borrada correctamente.');
        setTimeout(() => setMensajeExito(''), 5000);
        setCursos((prevCursos) => prevCursos.filter(curso => curso.inscripcionId !== inscripcionId));
      } catch (error) {
        console.error('Error al eliminar la inscripción:', error);
      }
    }
  };

  const handleClick =()=>{
    navigate('/nav-alu')
  }

  const handleModificarInscripcion = async (inscripcionId) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres modificar la fecha de inscripción? Esta acción cambiará la fecha a la fecha actual.');
    if (confirmation) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await updateInscripcion(inscripcionId, { fechaInscripcion: today });
        
        setMensajeExito('Fecha de inscripción actualizada correctamente.');
        setTimeout(() => setMensajeExito(''), 5000);
        setCursos((prevCursos) =>
          prevCursos.map(curso =>
            curso.inscripcionId === inscripcionId
              ? { ...curso, fechaInscripcion: today } 
              : curso
          )
        );
      } catch (error) {
        console.error('Error al modificar la inscripción:', error);
      }
    }
  };

  return (
    <div className='mis-cursos'>
      <NavBar links={links}></NavBar>
      <div className='lista-mis-cursos'>
        <h1>Mis Cursos</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {Array.isArray(cursos) && cursos.length > 0 ? (
          <ul className='list-cursos'>
            {cursos.map((curso, index) => (
              <li key={index}>
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
                {usuario && !usuario.mail.includes('@educatech') && (
                  <div>
                    <button
                      className="boton-cursos"
                      onClick={() => handleModificarInscripcion(curso.inscripcionId)}
                    >
                      Modificar Fecha Inscripción
                    </button>
                    <button
                      className="boton-cursos"
                      onClick={() => handleAnularInscripcion(curso.inscripcionId)}
                    >
                      Anular Inscripción
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className='inscribirse'>
            <p>No se ha inscripto a ningun curso.</p>
            <button onClick={handleClick}>Inscribirse</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisCursos;




