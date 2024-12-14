import React, { useEffect, useState, fetchData } from 'react';
import '../styles/VerParcial.css';
import NavBar from './NavBar.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { useLocation } from 'react-router-dom';
import { getInscripcion } from '../services/InscripcionServices.js';

export const VerParcial = () => {
  const location = useLocation();
  const rtaId = location.state?.id;
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
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const [parcial, setParcial] = useState(null);
  const [fecha, setFecha] = useState('');
  const [horaComienzo, setHoraComienzo] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [canTakeParcial, setCanTakeParcial] = useState(false);
  const [inscripcionToken, setInscripcionToken] = useState(localStorage.getItem('inscripcionToken'));
  const currentTime = Math.floor(Date.now() / 1000);

  useEffect(() => {
    const storedInscripcionToken = localStorage.getItem('inscripcionToken');
    setInscripcionToken(storedInscripcionToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (decodedUsuarioToken.exp<currentTime) {
          localStorage.removeItem('authToken');
          navigate('/');
          return;
        }

        if (decodedParcialToken) {
          setFecha(decodedParcialToken.fecha.split('T')[0]);
          setHoraComienzo(decodedParcialToken.horaComienzo);
          setHoraFin(decodedParcialToken.horaFin);
          setParcial({
            habilitado: decodedParcialToken.habilitado,
          });

          if (rtaId) {
            const decodedInscripcionToken = jwtDecode(inscripcionToken);
            const inscripcion = await getInscripcion(decodedInscripcionToken.id);
            localStorage.removeItem('inscripcionToken');
            setInscripcionToken(inscripcion);
            localStorage.setItem('inscripcionToken', inscripcion);
            const iscripcionDatos= inscripcion ? jwtDecode(inscripcion) : null;
            if (iscripcionDatos && iscripcionDatos.rtaparcialId) {
              setCanTakeParcial(false);
            } else {
              setCanTakeParcial(true);
            }
          }else{
            setCanTakeParcial(true);
          }

          setLoading(false);
        } else {
          setError('No se encontró el token del parcial.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en fetchData:', error);
        setError('Hubo un error al obtener los datos.');
        setLoading(false);
      }
    };
    fetchData(); // Llamada a la función asíncrona
  }, []);

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
