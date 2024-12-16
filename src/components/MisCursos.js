import React, { useEffect, useState } from 'react';
import { getCursoDeInscripcion, deleteInscripcion, getInscripcion } from '../services/InscripcionServices.js';
import { getInscripcionesAlumno} from '../services/UsuarioServices.js';
import '../styles/MisCursos.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';
import { getCurso } from '../services/CursoServices.js';
import { getParcial } from '../services/ParcialServices.js';
import { getTp } from '../services/TpServices.js';


export const MisCursos = () => {
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
  const navigate= useNavigate();
  const [cursos, setCursos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const currentTime = Math.floor(Date.now() / 1000);
  const [mensajeError, setMensajeError] = useState('');



  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
    { label: 'Mis Certificados', path: '/mis-certificados' },
    ];

  useEffect(() => {
    if (decodedUsuarioToken.exp < currentTime) {
      localStorage.removeItem('authToken');
      navigate('/');
      return;
    }
    const fetchCursos = async () => {
      try {
        
        if (decodedUsuarioToken.rol === 'alumno') {
          const inscripcionesData = await getInscripcionesAlumno(usuarioId);
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
                  : null;})
            );
            const filteredCursosData = cursosData.filter((curso) => curso !== null); 
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
  }, [usuarioId]);

  const handleTp = async (cursoId, inscripcionId) => {
    try {
      const cursoData = await getCurso(cursoId);
      const decodedCursoToken = jwtDecode(cursoData);

      if (!decodedCursoToken) throw new Error('No se recibió token del curso.');
      localStorage.setItem('cursoToken', cursoData);

      const inscripcionData = await getInscripcion(inscripcionId);
      const decodedInscripcionToken = jwtDecode(inscripcionData);

      if (!decodedInscripcionToken) throw new Error('No se recibió token de la inscripción.');
      localStorage.setItem('inscripcionToken', inscripcionData);

      const tp = await getTp(decodedCursoToken.tpId);

      if (!tp) {
        throw new Error('No se encontró el TP asociado al curso.');
      }

      navigate('/rta-tp');
    } catch (error) {
      console.error('Error al manejar el TP:', error.message);
      setMensajeError(error.message);
      setTimeout(() => setMensajeError(''), 5000);
    }
  };

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

  const handleVerParcial = async (cursoId, inscripcionId) => {
    try {
      const cursoData = await getCurso(cursoId);
      const decodedCursoToken = jwtDecode(cursoData);

      if (!decodedCursoToken) throw new Error('No se recibió token del curso.');
      localStorage.setItem('cursoToken', cursoData);

      const inscripcionData = await getInscripcion(inscripcionId);
      const decodedInscripcionToken = jwtDecode(inscripcionData);

      if (!decodedInscripcionToken) throw new Error('No se recibió token de la inscripción.');
      localStorage.setItem('inscripcionToken', inscripcionData);

      const parcialId = decodedCursoToken.parcialId;

      if (!parcialId) {
        throw new Error('El curso no tiene un parcial asociado.');
      }

      const parcialData = await getParcial(parcialId);
      const decodedParcialToken = jwtDecode(parcialData);

      if (!decodedParcialToken) throw new Error('No se recibió token del parcial.');
      localStorage.setItem('parcialToken', parcialData);

      const rtaParcialId = decodedInscripcionToken.rtaparcialId;

      navigate('/ver-parcial', { state: { id: rtaParcialId || null } });
    } catch (error) {
      console.error('Error al manejar el parcial:', error.message);
      setMensajeError(error.message);
      setTimeout(() => setMensajeError(''), 5000);
    }
  };

  return (
    <div className='mis-cursos'>
      <NavBar links={aluLinks}></NavBar>
      <div className='lista-mis-cursos'>
        <h1>Mis Cursos</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
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
                      onClick={() => handleVerParcial(curso.id, curso.inscripcionId, curso.parcial)}
                    >
                      Ver Parcial
                    </button>
                    <button
                      className="boton-cursos"
                      onClick={() => handleAnularInscripcion(curso.inscripcionId)}
                    >
                      Anular Inscripción
                    </button>
                    <button
                      className="boton-cursos"
                      onClick={() => handleTp(curso.id, curso.inscripcionId, curso.tp)}
                    >
                      Ver Tp
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





