import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {createCertificado} from '../services/CertificadoService';
import { GetInscripcionesCurso } from "../services/CursoService";
import { getUsuario } from "../services/UsuarioServices.js";
import NavBar from './NavBar.js';
import '../styles/InscripcionesCurso.css';


const InscripcionesCurso = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);

  const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const cursoId = decodedCursoToken?.id || null;

  const navigate = useNavigate();
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (cursoId) {
        try {
          // Obtener todas las inscripciones del curso
          const inscripcionesData = await GetInscripcionesCurso(cursoId);
          setInscripciones(inscripcionesData);
          
          // Obtener los datos de los alumnos a partir de las inscripciones
          const alumnosConDatos = await Promise.all(
            inscripcionesData.map(async (inscripcion) => {
              const alumno = await getUsuario(inscripcion.usuarioId);
              return {
                id: inscripcion.id,  // ID de inscripción
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                email: alumno.email,  // Agregar más detalles según lo necesario
                fechaInscripcion: inscripcion.fechaInscripcion,
                idCertificado: inscripcion.idCertificado,  // ID de certificado de la inscripción
              };
            })
          );

          setAlumnos(alumnosConDatos);
        } catch (error) {
          console.error('Error al obtener alumnos del curso:', error);
        }
      }
    };

    fetchAlumnos();
  }, [cursoId]);
  

const handleGenerarCertificado = async (usuarioId) => {
  setCargando(true);
  try {
    // Buscar la inscripción del usuario en el array de inscripciones
    const inscripcion = inscripciones.find((inscripcion) => inscripcion.usuarioId === usuarioId);

    // Verificar si ya tiene un certificado (si idCertificado no es nulo)
    if (inscripcion && inscripcion.idCertificado) {
      alert('El certificado ya ha sido generado para esta inscripción.');
      return;  // Si ya tiene certificado, no hacemos nada más
    }

    // Si no tiene certificado (idCertificado es null), generar un nuevo certificado
    const certificadoData = {
      fechaEmision: new Date().toISOString(),
      descripcion: `Certificado generado para la inscripción del usuario ${usuarioId}`,
      inscripcionId: inscripcion.id
    };

    const nuevoCertificado = await createCertificado(certificadoData);
    console.log('Certificado creado:', nuevoCertificado);
    alert('Certificado creado exitosamente');
    
    // Si es necesario, actualiza la inscripción para reflejar que ahora tiene un certificado
    inscripcion.idCertificado = nuevoCertificado.id;

  } catch (error) {
    console.error('Error al crear certificado:', error);
    alert('Hubo un error al crear el certificado');
  } finally {
    setCargando(false);
  }
};
return (
  <div className='inscripciones-curso'>
    <NavBar links={profLinks}></NavBar>
    <div className='lista-inscripciones'>
      <h1>Alumnos Inscritos en el Curso</h1>
      <button onClick={() => navigate('/nav-prof')} className="boton-volver">Volver</button>
      {alumnos.length > 0 ? (
        <ul className='lista-alumnos'>
          {alumnos.map((alumno) => (
            <li key={alumno.id} className='alumno-item'>
              <h3>{alumno.nombre} {alumno.apellido}</h3>
              <p>{alumno.email}</p>
              <p>Fecha de Inscripción: {new Date(alumno.fechaInscripcion).toLocaleDateString()}</p>
              <button
                onClick={() => handleGenerarCertificado(alumno.id)}
                className="boton-certificado"
                disabled={cargando || alumno.idCertificado}
              >
                {cargando ? 'Generando...' : alumno.idCertificado ? 'Certificado Generado' : 'Generar Certificado'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className='mensaje-no-alumnos'>
          <p>No hay alumnos inscritos en este curso.</p>
        </div>
      )}
    </div>
  </div>
);
};

export default InscripcionesCurso;
