import React, { useEffect, useState } from 'react';
import '../styles/VerRtasTp.css'; 
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getRtaTpdeTp } from '../services/TpServices.js';
import { deleteRtaTp, getInscripcionDeRtaTp } from '../services/RtaTpServices.js';
import { getAlumnoDeInscripcion } from '../services/InscripcionServices.js';

console.log('holartatp')
const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const tpId = decodedCursoToken ? decodedCursoToken.tpId : null;
  console.log(decodedCursoToken)
export const RespuestaTp = () => {

    console.log('holartatp2')

  const [rtas, setRtas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  console.log('holartatp3')
  useEffect(() => {
    setLoading(false);
    const fetchRtas = async () => {
        console.log('holartatp4')
      try {
        if (tpId) {
            console.log('holartatp5')
          const rtasData = await getRtaTpdeTp(tpId);
          console.log('Datos de respuestas:', rtasData);
          console.log('holartatp6')
          const rtasConInscripciones = await Promise.all(
            rtasData.map(async (rta) => {
              const inscripcionData = await getInscripcionDeRtaTp(rta.id, rta.inscripcion);
              const alumnoData = await getAlumnoDeInscripcion(inscripcionData.id, inscripcionData.usuario); 
              return { ...rta, alumno: alumnoData };
            })
          );
          setRtas(rtasConInscripciones);
        }
      } catch (error) {
        setError('Hubo un error al obtener las respuestas.');
        console.error('Error al obtener las respuestas del TP:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRtas();
  }, [tpId]);

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  const handleDelete = async (rtaTPId) => {
    try {
      const response = await deleteRtaTp(rtaTPId);
      if (response.success) {
        setRtas((prevRtas) => prevRtas.filter((rta) => rta.id !== rtaTPId));
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
      <div className="rtas-tp">
        <h1>Respuestas del TP</h1>
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
                  <td>{rta.rtaConsignaTP}</td>
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
          <p>No se encontraron respuestas para este TP.</p>
        )}
      </div>
    </div>
  );
}  

