 import React, { useState, useEffect } from 'react';
import { deleteParcial, getParcial } from '../services/ParcialServices.js';
import NavBar from './NavBar.js';
import { updateParcial, createParcial } from '../services/ParcialServices.js';
import '../styles/Parcial.css';
import { useCurso } from './CursoContext.js';
import {useLocation, useNavigate } from 'react-router-dom';

export const Parcial = () => {
  const { curso } = useCurso();
  const { state } = useLocation();
  const id = state?.id; 
  const [parcial, setParcial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [consigna, setConsigna] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaComienzo, setHoraComienzo] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate=useNavigate()
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
  ];

  useEffect(() => {
    const fetchParcial = async () => {
      setLoading(true); 
      try {
        if (id || state?.id) {
          const response = await getParcial(id || state?.id);
          console.log('Parcial recibido:', response.data);
          setParcial(response.data);
        } else {
          setError('ID de parcial inválido');
        }
      } catch (err) {
        setError('Parcial no cargado');
      } finally {
        setLoading(false);
      }
    };
    fetchParcial();
  }, [id,state]);

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
    const parcialData = { consigna, fecha, horaComienzo, horaFin, cursoId: curso?.id };

    try {
      if (parcial) {
        await updateParcial(id, parcialData);
        setMensajeExito('Parcial actualizado');
        setError('');
      } else {
        await createParcial(parcialData);
        setMensajeExito('Parcial creado');
        setError('');
      }
    } catch (error) {
      console.log('Error al guardar el parcial:', error);
      setError('Hubo un error');
    }
  };

  const handleEliminar= async ()=>{
    deleteParcial(id)
    setMensajeExito('Parcial eliminado')
    setTimeout(() => {
      navigate('/nav-prof');
    }, 3000);
  }

  const handleHabilitacion = async () => {
    if (parcial) {
      const parcialData = {
        consigna,
        fecha,
        horaComienzo,
        horaFin,
        cursoId: curso?.id,
        habilitado: !parcial.habilitado, 
      };

      try {
        await updateParcial(id, parcialData);
        setMensajeExito(parcialData.habilitado ? 'Parcial habilitado' : 'Parcial deshabilitado');
        setError('');
      } catch (error) {
        console.log('Error al actualizar el estado de habilitación:', error);
        setError('Hubo un error al actualizar el estado');
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