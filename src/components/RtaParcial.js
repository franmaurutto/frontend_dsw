import React, { useEffect, useState } from 'react';
import '../styles/RtaParcial.css'; 
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { createRtaParcial } from '../services/RtaParcialServices.js';


export const RtaParcial = () => {
  const navigate = useNavigate();
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
  ];
  const [consigna, setConsigna] = useState('');
  const [rtaConsigna, setRtaConsigna] = useState('');
  const parcialToken = localStorage.getItem('parcialToken');
  const decodedParcialToken = parcialToken ? jwtDecode(parcialToken) : null;
  const parcialId = decodedParcialToken ? decodedParcialToken.id : null;
  const inscripcionToken = localStorage.getItem('inscripcionToken');
  const decodedInscripcionToken = inscripcionToken ? jwtDecode(inscripcionToken) : null;
  const inscripcionId = decodedInscripcionToken?.id || null;
  useEffect(() => {
    try {
      if (decodedParcialToken) {
        setConsigna(decodedParcialToken.consigna || '');
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rtaConsigna.trim() === '') {
      alert('Por favor, ingrese una respuesta.');
      return;
    }

    const rtaParcial = {
      rtaConsignaParcial: rtaConsigna,
      parcialId,
      inscripcionId,
    };

    try {
      const response = await createRtaParcial(rtaParcial);
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
    <div className="rta-parcial">
      <h1>Evaluación: </h1>
      
      <label>Consigna:</label>
      <p className="consigna-text">{consigna}</p>

      <form onSubmit={handleSubmit} className="form-rta">
        <label>Tu Respuesta:</label>
        <textarea
          value={rtaConsigna}
          onChange={(e) => setRtaConsigna(e.target.value)}
          rows="4"
          className="respuesta"
          placeholder="Escribe tu respuesta aquí..."
        ></textarea>

        <button type="submit">Enviar Respuesta</button>
      </form>
    </div>
  </div>

  );
};

export default RtaParcial;
