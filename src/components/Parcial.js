import React, { useState, useEffect } from 'react';
import { deleteParcial, getParcial } from '../services/ParcialServices.js';
import NavBar from './NavBar.js';
import { updateParcial, createParcial } from '../services/ParcialServices.js';
import '../styles/Parcial.css';
import { useNavigate } from 'react-router-dom';
import  {jwtDecode} from 'jwt-decode';


export const Parcial = () => {
  const [parcial, setParcial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [consigna, setConsigna] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaComienzo, setHoraComienzo] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const cursoToken = localStorage.getItem('cursoToken'); 
  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const parcialId = decodedCursoToken?.parcialId || null;
  const usuarioToken = localStorage.getItem('authToken');
  const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
  const navigate=useNavigate()

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  useEffect(() => {
    const fetchParcial = async () => {
      if (!usuarioToken || !decodedUsuarioToken) {
        localStorage.removeItem('authToken');
        navigate('/');
      }
      setLoading(true);
      try {
        if (parcialId) {
          const response = await getParcial(parcialId); 
          const decodedParcialToken = response ? jwtDecode(response) : null;
          setParcial(decodedParcialToken);
        } else {
          throw new Error('No se encontró un idParcial en el token.');
        }
      } catch (err) {
        console.error('Error al cargar el parcial:', err);
        setError('Parcial no cargado.');
      } finally {
        setLoading(false);
      }
    };
    fetchParcial();
  }, []);//le saque parcialId

  useEffect(() => {
    if (parcial) {
      setFecha(parcial.fecha ? parcial.fecha.split('T')[0] : '');
      setConsigna(parcial.consigna || '');
      setHoraComienzo(parcial.horaComienzo || '');
      setHoraFin(parcial.horaFin || '');
    }
  }, [parcial]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parcialData = { consigna, fecha, horaComienzo, horaFin, cursoId: decodedCursoToken?.id };

    try {
      if (parcial) {
        await updateParcial(parcialId, parcialData);
        setMensajeExito('Parcial actualizado');
        setError('');
      } else {
        await createParcial(parcialData);
        setMensajeExito('Parcial creado');
        setError('');
      }
    } catch (error) {
      setError('Hubo un error');
    }
  };
  

  const handleEliminar = async () => {
    try {
      await deleteParcial(parcialId);
      setMensajeExito('Parcial eliminado.');
      setTimeout(() => {
        navigate('/nav-prof');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el parcial:', error);
      setError('Hubo un error al eliminar.');
    }
  };

  const handleHabilitacion = async () => {
    if (parcial) {
      const parcialData = {
        consigna,
        fecha,
        horaComienzo,
        horaFin,
        habilitado: !parcial.habilitado,
      };

      try {
        await updateParcial(parcialId, parcialData);
        setMensajeExito(parcialData.habilitado ? 'Parcial habilitado.' : 'Parcial deshabilitado.');
        setError('');
      } catch (error) {
        console.error('Error al actualizar el estado de habilitación:', error);
        setError('Hubo un error al actualizar el estado.');
      }
    }
  };


  return (
    <div>
      <NavBar links={profLinks} />
      {loading ? ( 
        <p className="loading">Cargando...</p>
      ) : (
        <div className="form-parcial">

          <h1>{parcial ? 'Parcial del Curso' : 'Subir Parcial'}</h1>
          {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
          {error && <p className="error-box">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>Consigna:</label>
            <input
              type="text"
              value={consigna}
              onChange={(e) => setConsigna(e.target.value)}
            />
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <label>Hora Comienzo:</label>
            <input
              type="text"
              value={horaComienzo}
              onChange={(e) => setHoraComienzo(e.target.value)}
            />
            <label>Hora Fin:</label>
            <input
              type="text"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
            />
            <button type="submit">{parcial ? 'Modificar' : 'Subir Parcial'}</button>
          </form>
          {parcial && (
            <div className="acciones-parcial">
              {parcial.habilitado ? (
                <button onClick={handleHabilitacion}>Deshabilitar</button>
              ) : (
                <button onClick={handleHabilitacion}>Habilitar</button>
              )}
              <button onClick={handleEliminar}>Eliminar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Parcial; 