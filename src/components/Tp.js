import React from 'react'
import  {jwtDecode} from 'jwt-decode';
import { useEffect,useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { getTp, updateTp, deleteTp,createTp } from '../services/TpServices.js';
import NavBar from './NavBar.js';
import '../styles/Tp.css';



export const Tp = () => {

  const [tp, setTp] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [consigna, setConsigna] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cursoToken, setCursoToken] = useState(localStorage.getItem('cursoToken'));

  const navigate=useNavigate()

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  const decodedCursoToken = cursoToken ? jwtDecode(cursoToken) : null;
  const tpId = decodedCursoToken?.tpId || null;

  useEffect(() => {
    const fetchTp = async () => {
      setLoading(true);
      try {
        if (tpId) {
          const response = await getTp(tpId); 
          setTp(response.data);
        } else {
          throw new Error('No se encontró un idTp en el token.');
        }
      } catch (err) {
        console.error('Error al cargar el tp:', err);
        setError('Tp no cargado.');
      } finally {
        setLoading(false);
      }
    };
    fetchTp();
  }, [cursoToken]);


  useEffect(() => {
    if (tp) {
      setFechaLimite(tp.fechaLimite ? tp.fechaLimite.split('T')[0] : '');
      setConsigna(tp.consigna || '');
    }
  }, [tp]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tpData = { consigna, fechaLimite, cursoId: decodedCursoToken?.id };
    try {
      if (tp) {
        await updateTp(tpId, tpData);
        setMensajeExito('Trabajo Practico actualizado');
        setError('');
      } else {
        await createTp(tpData);
        setMensajeExito('Trabajo Practico creado');
        setError('');
      }
    } catch (error) {
      console.log('Error al guardar el trabajo practico:', error);
      setError('Hubo un error');
    }
  };
  

  const handleEliminar = async () => {
    try {
      await deleteTp(tpId);
      setMensajeExito('Trabajo practico eliminado.');
      setTimeout(() => {
        navigate('/nav-prof');
      }, 3000);
    } catch (error) {
      console.error('Error al eliminar el trabajo practico:', error);
      setError('Hubo un error al eliminar.');
    }
  };

  return (
     <div>
      <NavBar links={profLinks} />
      {loading ? ( 
        <p className="loading">Cargando...</p>
      ) : (
        <div className="form-tp">

          <h1>{tp ? 'Trabajo practico del Curso' : 'Subir Trabajo practico'}</h1>
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
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
            />
            <button type="submit">{tp ? 'Modificar' : 'Subir Trabajo practico'}</button>
          </form>
          {tp && (
            <div className="acciones-tp">
              <button onClick={handleEliminar}>Eliminar</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
