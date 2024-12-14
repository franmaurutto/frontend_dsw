import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {createCertificado,deleteCertificado} from '../services/CertificadoServices.js';
import { getInscripcionesCurso } from "../services/CursoServices.js";
import { getUsuario } from "../services/UsuarioServices.js";
import NavBar from './NavBar.js';
import '../styles/InscripcionesCurso.css';



const InscripcionesCurso = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [usuarioNombre, setUsuarioNombre] = useState(null);
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const cursoId = decodedCursoToken?.id || null;
  const cursoNombre = decodedCursoToken?.nombre || null;

  const navigate = useNavigate();
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];


    const fetchAlumnos = async () => {
      if (cursoId) {
        try {
          const inscripcionesData = await getInscripcionesCurso(cursoId);
          setInscripciones(inscripcionesData);
          const alumnosConDatos = await Promise.all(
            inscripcionesData.data.map(async (inscripcion) => { 
              const alumno = await getUsuario(inscripcion.usuario);
              setUsuario(alumno.data.id);
              setUsuarioNombre(alumno.data.nombreCompleto)
              return {
                id: alumno.data.id,
                idIns: inscripcion.id,  
                nombreCompleto: alumno?.data.nombreCompleto,
                mail: alumno?.data.mail,  
                fechaInscripcion: inscripcion.fechaInscripcion,
                idCertificado: inscripcion.certificado,  
              };
            })
          );
          

          setAlumnos(alumnosConDatos);
        } catch (error) {
          console.error('Error al obtener alumnos del curso:', error);
        }
      }
    };


  useEffect(() => {
    fetchAlumnos();  
  
  }, [cursoId]); 


const handleGenerarCertificado = async (usuario) => {
  setCargando(true);
  try {
    const inscripcion = inscripciones.data.find((inscripcion) => inscripcion.usuario === usuario);
    if (inscripcion && inscripcion.certificado) { 
      setMensajeError('El certificado ya ha sido generado para esta inscripción.');
      return;  
    }
    const certificadoData = {
      fechaEmision: new Date().toISOString(),
      descripcion: `Certificado generado para el alumno ${usuarioNombre} inscripto a ${cursoNombre}`,
      inscripcionId: inscripcion.id
    };
    const nuevoCertificado = await createCertificado(certificadoData);
    setMensajeExito('Certificado creado exitosamente.');

    inscripcion.certificado = nuevoCertificado.id;
    setAlumnos((prevAlumnos) => 
      prevAlumnos.map((alumno) => 
        alumno.id === usuario ? { ...alumno, idCertificado: nuevoCertificado.id } : alumno
      )
    );

    fetchAlumnos();

  } catch (error) {
    console.error('Error al crear certificado:', error);
    setMensajeError('Hubo un error al crear el certificado.');

  } finally {
    setCargando(false);
  }
};
const handleEliminarCertificado = async (usuario) => {
  setCargando(true);
  try {
    const inscripcion = inscripciones.data.find((inscripcion) => inscripcion.usuario === usuario);

    if (!inscripcion || !inscripcion.certificado) {
      setMensajeError('No se puede eliminar un certificado que no existe.');
      return;
    }

    await deleteCertificado(inscripcion.certificado);
    setAlumnos((prevAlumnos) =>
      prevAlumnos.map((alumno) =>
        alumno.id === usuario ? { ...alumno, idCertificado: null } : alumno
      )
    );

    fetchAlumnos();
    setMensajeExito('Certificado eliminado exitosamente.');
  } catch (error) {
    console.error('Error al eliminar certificado:', error);
    setMensajeError('Hubo un error al eliminar el certificado.');

  } finally {
    setCargando(false);
  }
};
return (
  <div className='inscripciones-curso'>
    <NavBar links={profLinks}></NavBar>
    <div className="lista-inscripciones">
      <h1>Alumnos Inscritos en el Curso</h1>
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
      {alumnos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Correo</th>
              <th>Fecha de Inscripción</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.nombreCompleto}</td>
                <td>{alumno.mail}</td>
                <td>{new Date(alumno.fechaInscripcion).toLocaleDateString()}</td>
                <td>
                  {alumno.idCertificado ? (
                    <button
                      onClick={() => handleEliminarCertificado(alumno.id)}
                      className="boton-eliminar"
                      disabled={cargando}
                    >
                      {cargando ? 'Eliminando...' : 'Eliminar Certificado'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGenerarCertificado(alumno.id)}
                      className="boton-certificado"
                      disabled={cargando}
                    >
                      {cargando ? 'Generando...' : 'Generar Certificado'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='mensaje-no-alumnos'>
          <p>No hay alumnos inscritos en este curso.</p>
        </div>
      )}
      <button onClick={() => navigate('/datos-curso')} className="boton-volver">
          Volver
        </button>
    </div>
  </div>
);
};

export default InscripcionesCurso;