import React, { useEffect, useState } from 'react';
import { getCursoDeInscripcion, deleteInscripcion, updateInscripcion } from '../services/InscripcionServices.js';
import { getInscripcionesAlumno, getCursosProfesor } from '../services/UsuarioServices.js';
import { useUser } from './UsuarioContext.js';
import '../styles/MisCursos.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';

const usuarioToken = localStorage.getItem('authToken');
const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
export const MisCursos = () => {

  const navigate= useNavigate();
  const [cursos, setCursos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  console.log("esta x entrar")
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
    ];
useEffect(() => {
  const fetchCursos = async () => {
    try {
      console.log(decodedUsuarioToken);
      console.log(usuarioId);
      console.log(decodedUsuarioToken.rol);
      if (decodedUsuarioToken.rol === 'alumno') {
        const inscripcionesData = await getInscripcionesAlumno(usuarioId);
        console.log(inscripcionesData);
        if (Array.isArray(inscripcionesData.data)) {
          const cursosData = await Promise.all(
            inscripcionesData.data.map(async (inscripcion) => {
              const cursoId = inscripcion.curso ? inscripcion.curso : null; 
              if (!cursoId) {
                console.error('No se encontró curso para esta inscripción:', inscripcion);
                return null;
              }
              const cursoData = await getCursoDeInscripcion(inscripcion.id, cursoId);
              return cursoData
                ? {
                    ...cursoData,
                    inscripcionId: inscripcion.id,
                    fechaInscripcion: inscripcion.fechaInscripcion,
                  }
                : null; 
            })
          );
          const filteredCursosData = cursosData.filter((curso) => curso !== null); 
          console.log(filteredCursosData);
          setCursos(filteredCursosData);
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
}, []);


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
      <NavBar links={aluLinks}></NavBar>
      <div className='lista-mis-cursos'>
        <h1>Mis Cursos</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {Array.isArray(cursos) && cursos.length > 0 ? (
          <ul className='list-cursos'>
            {cursos.map((curso, index) => (
              <li key={index}>
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
                {decodedUsuarioToken.rol==='alumno' && (
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




