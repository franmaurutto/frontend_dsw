import React, { useEffect, useState } from 'react';
import { getCursoDeInscripcion, deleteInscripcion, updateInscripcion, getInscripcion } from '../services/InscripcionServices.js';
import { getInscripcionesAlumno} from '../services/UsuarioServices.js';
import '../styles/MisCursos.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';
import { getCurso } from '../services/CursoServices.js';
import { getParcial } from '../services/ParcialServices.js';

export const MisCursos = () => {

  const navigate= useNavigate();
  const [cursos, setCursos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  console.log("esta x entrar")
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const usuarioId = decodedUsuarioToken ? decodedUsuarioToken.id : null;
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

  const handleVerParcial = async (cursoId, inscripcionId, parcialId) => {
    console.log(parcialId)
    const data = await getCurso(cursoId);
    const decodedToken = jwtDecode(data);
    if (!decodedToken) throw new Error('No se recibió token del curso.');
    localStorage.setItem('cursoToken', data);
    const data1 = await getInscripcion(inscripcionId);
    const decodedToken1 = jwtDecode(data1);
    if (!decodedToken1) throw new Error('No se recibió token del curso.');
    localStorage.setItem('inscripcionToken', data1);
    const data2 = await getParcial(parcialId);
    const decodedToken2 = jwtDecode(data2);
    if (!decodedToken2) throw new Error('No se recibió token del curso.');
    localStorage.setItem('parcialToken', data2);
    console.log(data2)
    navigate('/ver-parcial');
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




