import React, { useEffect, useState } from 'react';
import '../styles/VerRtasParcial.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getRtaParcialdeParcial } from '../services/ParcialServices.js';
import { deleteRtaParcial, getInscripcionDeRtaParcial } from '../services/RtaParcialServices.js';
import { getAlumnoDeInscripcion } from '../services/InscripcionServices.js';

const VerRtasParcial = () => {
  const [rtas, setRtas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const parcialToken = localStorage.getItem('parcialToken');
  const decodedParcialToken = parcialToken ? jwtDecode(parcialToken) : null;
  const parcialId = decodedParcialToken ? decodedParcialToken.id : null;
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;

  useEffect(() => {
    if (!usuarioToken || !decodedUsuarioToken) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
    const fetchRtas = async () => {
      try {
        if (!parcialId) {
          throw new Error('Parcial ID no encontrado.'); 
        }
  
        const rtasData = await getRtaParcialdeParcial(parcialId); 
        const rtasConInscripciones = await Promise.all(
          rtasData.map(async (rta) => {
            const inscripcionData = await getInscripcionDeRtaParcial(rta.id, rta.inscripcion);
            const alumnoData = await getAlumnoDeInscripcion(inscripcionData.id, inscripcionData.usuario); 
            return { ...rta, alumno: alumnoData };
          })
        );
        setRtas(rtasConInscripciones);
      } catch (error) {
        setError(error.message || 'Hubo un error al obtener las respuestas.');
        console.error('Error al obtener las respuestas del parcial:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRtas();
  }, [parcialId]);
  
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
    ];

  const handleDelete = async (rtaParcialId) => {
    try {
      const response = await deleteRtaParcial(rtaParcialId); 
      if (response.success) {
        setRtas((prevRtas) => prevRtas.filter((rta) => rta.id !== rtaParcialId));
      } else {
        setError('No se pudo eliminar la respuesta');
      }
    } catch (error) {
      setError('Hubo un error al eliminar la respuesta.');
      console.error('Error al eliminar la respuesta:', error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='nav-prof'>
      <NavBar links={profLinks}></NavBar>
      <div className="rtas-parcial">
        <h1>Respuestas del Parcial</h1>
        {rtas.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Respuesta</th>
                <th>Alumno</th>
                <th>Correo del Alumno</th>
                <th>Teléfono del Alumno</th>
              </tr>
            </thead>
            <tbody>
              {rtas.map((rta, index) => (
                <tr key={index}>
                  <td>{rta.rtaConsignaParcial}</td>
                  <td>{rta.alumno.nombreCompleto}</td>
                  <td>{rta.alumno.mail}</td>
                  <td>{rta.alumno.telefono}</td>
                  <td>
                    <button onClick={() => handleDelete(rta.id)}>Eliminar</button> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron respuestas para este parcial.</p>
        )}
      </div>
    </div>
  );
}  

export default VerRtasParcial;
