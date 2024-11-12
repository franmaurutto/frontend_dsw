import React from 'react'
import { useState,useEffect } from 'react';
import { getParcial } from '../services/ParcialServices.js';
import NavBar from './NavBar.js';
import { updateParcial,createParcial } from '../services/ParcialServices.js';
import '../styles/Parcial.css';
import { useCurso } from './CursoContext.js';
export const Parcial = ({id}) => {

  const { curso } = useCurso();
  const [parcial, setParcial] = useState(null);
  const [error, setError] = useState(null);
  const [consigna, setConsigna] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaComienzo, setHoraComienzo] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensajeExito,setMensajeExito]= useState('')


  const profLinks = [
  { label: 'Mi cuenta', path: '/mi-cuenta' },
  { label: 'Mis Cursos', path: '/nav-prof' },
  { label: 'Crear Curso', path: '/crear-curso' },
  ];

  useEffect(() => {
    const fetchParcial = async () => {
      try {
        const data = await getParcial(id);
        if (data) {
          setParcial(data);
          setConsigna(data.consigna || '');
          setFecha(data.fecha || '');
          setHoraComienzo(data.horaComienzo || '');
          setHoraFin(data.horaFin || '');
        }
      } catch (err) {
        setError('Parcial no cargado');
      }
    };

    fetchParcial();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parcialData = { consigna, fecha, horaComienzo, horaFin,cursoId: curso?.id };

    try {
      if (parcial) {
        await updateParcial(id, parcialData);
        setMensajeExito('Parcial actualizado')
      } else {
        await createParcial(parcialData);
        setMensajeExito('Parcial Creado')
      }
    } catch (error) {
      console.error('Error al guardar el parcial:', error);
      setError('Hubo un error');
    }
  };
  return (
    <div>
      <NavBar links={profLinks}></NavBar>
        {parcial ? (
          <div className='form-parcial'>
            {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
            {error && <p className="error-box">{error}</p>}
            <h1>Parcial del Curso</h1>
            <form onSubmit={handleSubmit}>
            <label>Consigna:</label>
            <input type='text'
              value={consigna}
              onChange={(e) => setConsigna(e.target.value )}
            ></input>
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value )}
            />
            <label>Hora Comienzo:</label>
            <input type='text'
              value={horaComienzo}
              onChange={(e) => setHoraComienzo(e.target.value )}
            ></input>
            <label>Hora Fin:</label>
            <input type='text'
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value )}
            ></input>
            <button type='submit'>Modificar</button>
            <div>
              <button>Eliminar Parcial</button>
              <button>Habilitar</button>
            </div>
            </form>
            
          </div>
        ) : (
          <div className='form-parcial'>
            {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
            {error && <p className="error-box">{error}</p>}
            <h1>Subir Parcial</h1>
            <form onSubmit={handleSubmit}>
            <label>Consigna:</label>
            <input type='text'
              value={consigna}
              onChange={(e) => setConsigna(e.target.value )}
            ></input>
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value )}
            />
            <label>Hora Comienzo:</label>
            <input type='text'
              value={horaComienzo}
              onChange={(e) => setHoraComienzo(e.target.value )}
            ></input>
            <label>Hora Fin:</label>
            <input type='text'
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value )}
            ></input>
              <button type='submit'>Subir Parcial</button>
            </form>
          </div>
        )}
      </div>
  )
}

export default Parcial
