import React, { useEffect, useState } from 'react';
import '../styles/VerParcial.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

export const VerParcial = () => {
  const navigate = useNavigate();
  const aluLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
  ];
  const cursoToken = localStorage.getItem('cursoToken');
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const parcialToken = localStorage.getItem('parcialToken');
  const decodedParcialToken = parcialToken ? jwtDecode(parcialToken) : null;
  const inscripcionToken = localStorage.getItem('inscripcionToken');
  const decodedInscripcionToken = inscripcionToken ? jwtDecode(inscripcionToken) : null;
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const [parcial, setParcial] = useState(null);
  const [fecha, setFecha] = useState('');
  const [horaComienzo, setHoraComienzo] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [canTakeParcial, setCanTakeParcial] = useState(false);

  useEffect(() => {
    if (!usuarioToken || !decodedUsuarioToken) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
    if (decodedParcialToken) {
      setFecha(decodedParcialToken.fecha.split('T')[0]); 
      setHoraComienzo(decodedParcialToken.horaComienzo);
      setHoraFin(decodedParcialToken.horaFin);
      setParcial({
        habilitado: decodedParcialToken.habilitado, 
      });

      if (decodedInscripcionToken && decodedInscripcionToken.rtaparcialId) {
        setCanTakeParcial(false);
      } else {
        setCanTakeParcial(true);
      }

      setLoading(false);
    } else {
      setError('No se encontró el token del parcial.');
      setLoading(false);
    }
  }, [decodedParcialToken, decodedInscripcionToken]);

  const handleRealizarParcial = async () => {
    try {
      navigate('/rta-parcial');
    } catch (err) {
      console.error('Error al realizar el parcial:', err);
    }
  };

  return (
    <div className='curso-detalle'>
  <NavBar links={[
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/mis-cursos' },
    { label: 'Cursos', path: '/nav-alu' },
  ]} />
  <div className="parcial-curso-detalle">
    <div className="content">
      <NavBar links={aluLinks} />
      <div className="info">
        <h1>Datos del Parcial</h1>
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Hora Comienzo:</strong> {horaComienzo}</p>
        <p><strong>Hora Fin:</strong> {horaFin}</p>

        {parcial && parcial.habilitado && canTakeParcial && (
          <div className="rtaparcial-btn">
            <button onClick={handleRealizarParcial}>Realizar Parcial</button>
          </div>
        )}

        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  </div>
</div>


  );
};

export default VerParcial;
