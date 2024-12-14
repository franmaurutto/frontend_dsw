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
  console.log(parcialId)
  const inscripcionToken = localStorage.getItem('inscripcionToken');
  const decodedInscripcionToken = inscripcionToken ? jwtDecode(inscripcionToken) : null;
  const inscripcionId = decodedInscripcionToken?.id || null;
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const currentTime = Math.floor(Date.now() / 1000);

  useEffect(() => {
    if (decodedUsuarioToken.exp<currentTime) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
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
    console.log(parcialId)
    console.log(inscripcionId)
    
    if (rtaConsigna.trim() === '') {
      setMensajeError('Por favor, ingrese una respuesta');
      setTimeout(() => setMensajeError(''), 5000);
      return;
    }

    const rtaParcial = {
      rtaConsignaParcial: rtaConsigna,
      parcialId,
      inscripcionId,
    };

    try {
      const response = await createRtaParcial(rtaParcial);
      console.log(response)
      if (response.data.id) {
        setMensajeExito('Respuesta enviada con éxito');
        setTimeout(() => {
          setMensajeExito('');
          navigate('/mis-cursos');
        }, 5000);
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setMensajeError('Hubo un error al enviar la respuesta');
      setTimeout(() => {
        setMensajeError('');
        navigate('/mis-cursos');
      }, 5000);
    }
  };

  return (
    <div className="respuesta-container">
    <NavBar links={aluLinks} />
    {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
    {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
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
