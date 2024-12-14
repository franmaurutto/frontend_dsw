import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getCertificado } from '../services/CertificadoServices.js';
import { getInscripcionesAlumno } from "../services/UsuarioServices.js";
import NavBar from './NavBar.js';
import '../styles/MisCertificados.css';

const MisCertificados = () => {
  const [certificados, setCertificados] = useState([]);  
  const [cargando, setCargando] = useState(false);
  const [inscripciones, setInscripciones] = useState([]); 
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const usuarioId = decodedUsuarioToken?.id || null;
  const currentTime = Math.floor(Date.now() / 1000);

  const navigate = useNavigate();
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
    { label: 'Mis Certificados', path: '/mis-certificados' },
  ];

  const fetchCertificados = async () => {
    if (decodedUsuarioToken.exp<currentTime) {
      localStorage.removeItem('authToken');
      navigate('/');
      return;
    }
    if (usuarioId) {
      setCargando(true);
      setMensajeExito('');
      setMensajeError('');
      try {
        const inscripcionesData = await getInscripcionesAlumno(usuarioId);
        setInscripciones(inscripcionesData);
        const certificadosConDatos = await Promise.all(
          inscripcionesData.data.map(async (inscripcion) => {
            if (inscripcion.certificado) {
              const certificado = await getCertificado(inscripcion.certificado);
              return {
                id: certificado.data.id,
                descripcion: certificado.data.descripcion,
                fechaEmision: certificado.data.fechaEmision,
                inscripcionId: inscripcion.id  
              };
            }
            return null; 
          })
        );
        setCertificados(certificadosConDatos.filter(cert => cert !== null));
        //setMensajeExito('Certificados cargados exitosamente.');
      } catch (error) {
        console.error('Error al obtener certificados:', error);
        setMensajeError('Hubo un error al cargar los certificados.');
      } finally {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    fetchCertificados();  
  }, [usuarioId]);

  return (
    <div className='inscripciones-curso'>
      <NavBar links={aluLinks}></NavBar>
      <div className="lista-inscripciones">
        <h1>Mis Certificados</h1>
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        {certificados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Descripcion</th>
                <th>Fecha de Emision</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((certificado) => (
                <tr key={certificado.id}>
                  <td>{certificado.descripcion}</td>
                  <td>{new Date(certificado.fechaEmision).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='mensaje-no-certificados'>
            <p>El alumno no tiene certificados.</p>
          </div>
        )}
        <button onClick={() => navigate('/nav-alu')} className="boton-volver">Volver</button>
      </div>
    </div>
  );
};

export default MisCertificados;
