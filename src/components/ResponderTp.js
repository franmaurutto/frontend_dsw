import React, { useEffect, useState } from 'react';
import '../styles/ResponderTp.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { createRtaTp, deleteRtaTp, updateRtaTp } from '../services/RtaTpServices.js';
import { getTp } from '../services/TpServices.js';
import { getRtaTpdeTp } from '../services/TpServices.js';

export const ResponderTp = () => {
  const navigate = useNavigate();
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
  ];
  const [consigna, setConsigna] = useState('');
  const [rtaConsigna, setRtaConsigna] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [tp, setTp] = useState('');
  const [respuestaExistente, setRespuestaExistente] = useState(null);
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedcursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const tpId = decodedcursoToken ? decodedcursoToken.tpId : null;
  const inscripcionToken = localStorage.getItem('inscripcionToken');
  const decodedInscripcionToken = inscripcionToken ? jwtDecode(inscripcionToken) : null;
  const inscripcionId = decodedInscripcionToken ? decodedInscripcionToken.id : null;

  useEffect(() => {
    const fetchTp = async () => {
      if (tpId && inscripcionId) {
        try {
          const tpData = await getTp(tpId);
          setTp(tpData.data);
          const respuestas = await getRtaTpdeTp(tpId);
          const respuestaExistente = respuestas.find(rta => rta.inscripcion === inscripcionId);
          if (respuestaExistente) {
            setRespuestaExistente(respuestaExistente);
            setRtaConsigna(respuestaExistente.rtaConsignaTP);
          }
        } catch (error) {
          console.error('Error al obtener la respuesta:', error);
        }
      }
    };

    fetchTp();
  }, [tpId, inscripcionId]);

  useEffect(() => {
    if (tp) {
      setConsigna(tp.consigna || '');
      setFechaLimite(tp.fechaLimite ? tp.fechaLimite.split('T')[0] : '');
    }
  }, [tp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rtaConsigna.trim() === '') {
      alert('Por favor, ingrese una respuesta.');
      return;
    }

    const rtaTp = {
      rtaConsignaTP: rtaConsigna,
      tpId,
      inscripcionId,
    };

    try {
      const respuestas = await getRtaTpdeTp(tpId);
      const respuestaExistente = respuestas.find(rta => rta.inscripcion === inscripcionId);

      if (respuestaExistente) {
        await updateRtaTp(respuestaExistente.id, rtaTp.rtaConsignaTP);
        setRespuestaExistente({ ...respuestaExistente, rtaConsignaTP: rtaConsigna });
      } else {
        await createRtaTp(rtaTp);
        setRespuestaExistente({ rtaConsignaTP: rtaConsigna, inscripcion: inscripcionId });
      }

      navigate('/mis-cursos');
    } catch (error) {
      console.error('Error al enviar o modificar la respuesta:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (respuestaExistente) {
        await deleteRtaTp(respuestaExistente.id);
        setRtaConsigna('');
        setRespuestaExistente(null);
      }
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
    }
  };

  return (
    <div className="respuesta-container">
      <NavBar links={aluLinks} />
      <div className="rta-tp">
        <h1>Trabajo practico: </h1>

        <div className="recuadro">
          <label>Consigna:</label>
          <p className="consigna-text">{consigna}</p>
        </div>

        {fechaLimite && (
          <div className="recuadro">
            <label>Fecha límite:</label>
            <p className="fecha-limite-text">{fechaLimite}</p>
          </div>
        )}

        <div>
          <label>Tu Respuesta:</label>
          <textarea
            value={rtaConsigna}
            onChange={(e) => setRtaConsigna(e.target.value)}
            rows="4"
            className="respuesta"
            placeholder="Escribe tu respuesta"
          ></textarea>
        </div>

        <div>
          {respuestaExistente ? (
            <div class="boton-container">
              <button onClick={handleSubmit}>Modificar Respuesta</button>
              <button onClick={handleDelete}>Eliminar Respuesta</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-rta">
              <button type="submit">Enviar Respuesta</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
