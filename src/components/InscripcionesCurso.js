import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';
import { getInscripciones } from '../services/InscripcionesService.js'; // Crea este servicio si aún no existe.

const InscripcionesCurso = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const cursoId = decodedCursoToken ? decodedCursoToken.id : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (cursoId) {
        getInscripciones(cursoId)
        .then((data) => {
          setInscripciones(data);
        })
        .catch((error) => {
          console.error('Error al obtener inscripciones:', error);
        });
    }
  }, [cursoId]);

  return (
    <div>
      <h1>Inscripciones del Curso</h1>
      <button onClick={() => navigate('/nav-prof')}>Volver</button>
      {inscripciones.length > 0 ? (
        <ul>
          {inscripciones.map((inscripcion) => (
            <li key={inscripcion.id}>
              <p>ID Inscripción: {inscripcion.id}</p>
              <p>Fecha Inscripción: {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}</p>
              <p>Usuario ID: {inscripcion.usuarioId}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay inscripciones para este curso.</p>
      )}
    </div>
  );
};

export default InscripcionesCurso;
