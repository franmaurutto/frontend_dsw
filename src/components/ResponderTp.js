import React, { useEffect, useState } from 'react';
import '../styles/ResponderTp.css'; 
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { createRtaTp } from '../services/RtaTpServices.js';
import { getTp } from '../services/TpServices.js';


export const ResponderTp = () => {
  const navigate = useNavigate();
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
  ];
  const [consigna, setConsigna] = useState('');
  const [rtaConsigna, setRtaConsigna] = useState('');
  const [fechaLimite, setFechaLimite] =useState('');
  const [tp, setTp] = useState('');
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedcursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const tpId = decodedcursoToken ? decodedcursoToken.tpId : null;
  const inscripcionToken = localStorage.getItem('inscripcionToken');
  const decodedInscripcionToken = inscripcionToken ? jwtDecode(inscripcionToken) : null;
  const inscripcionId = decodedInscripcionToken ? decodedInscripcionToken.id : null;;


  useEffect(() => {
    const fetchTp = async () => {
      if (tpId) {
        try {
          const tpData = await getTp(tpId);
          setTp(tpData.data)
          console.log(tpData)
        } catch (error) {
          console.error('Error al obtener el TP:', error);
        }
      }
    };

    fetchTp();
  }, [tpId]);

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
      const response = await createRtaTp(rtaTp);
      if (response) {
        alert('Respuesta enviada con éxito');
        navigate('/mis-cursos');
      }
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      alert('Ocurrió un error al enviar la respuesta.');
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

        <form onSubmit={handleSubmit} className="form-rta">
          <label>Tu Respuesta:</label>
          <textarea
            value={rtaConsigna}
            onChange={(e) => setRtaConsigna(e.target.value)}
            rows="4"
            className="respuesta"
            placeholder="Respuesta"
          ></textarea>

          <button type="submit">Enviar Respuesta</button>
        </form>
      </div>
    </div>

  );
};

export default ResponderTp;
