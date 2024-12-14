import React, { useState } from 'react'
import NavBar from './NavBar.js'
import { createCurso } from '../services/CursoServices.js';
import '../styles/CrearCurso.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


export const CrearCurso = () => {

const getToken = () => localStorage.getItem('authToken');
const navigate = useNavigate();
const currentTime = Math.floor(Date.now() / 1000);
const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  const decodedUsuarioToken = token ? jwtDecode(token) : null;
  if (decodedUsuarioToken.exp<currentTime) {
    localStorage.removeItem('authToken');
    navigate('/');
    return;
  }
  try {
    const decodedToken = jwtDecode(token); 
    return decodedToken; 
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
  const usuario = getUserFromToken();
  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];

  const[error,setError]= useState()
  const[mensajeExito,setMensajeExito]=useState()

  const [formData, setFormData] = useState({
  descripcion: '',
  nombre: '',
  cantCupos: '',
  fechaInicio: '',
  fechaFin:'',
  horaInicio:'',
  horaFin:'',
  dias:''
  });

  const cursoData = { 
      ...formData, 
      profesorId: usuario ? usuario.id : null 
    };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  try {
    await createCurso(cursoData);
    setMensajeExito('Se ha registrado el curso')
  } catch (err) {
    setError('Hubo un error al registrar el curso');
    console.error('Error al registrar el curso:', err);
  }
  
};

const handleInputChange = (e) => { 
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  return (
    <div className='crear-curso'>
      <NavBar links={profLinks}></NavBar>
      <div className='form-curso'>
        <h1>Crear curso</h1>
        {error && <p className="error-box">{error}</p>}
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nombre del curso:</label>
          <input type='text' placeholder='Nombre' value={formData.nombre} name='nombre' onChange={handleInputChange} required></input>
          <label>Descripcion:</label>
          <input type='text' placeholder='Descripcion' value={formData.descripcion} name='descripcion' onChange={handleInputChange} required></input>
          <label>Cantidad de cupos</label>
          <input type='number' placeholder='Cantidad de cupos' value={formData.cantCupos} name='cantCupos' onChange={handleInputChange} required min="0"></input>
          <label>Fecha de inicio:</label>
          <input type='date' placeholder='Fecha inicio curso' value={formData.fechaInicio} name='fechaInicio' onChange={handleInputChange} required></input>
          <label>Fecha de finalizacion:</label>
          <input type='date' placeholder='Fecha fin curso' value={formData.fechaFin} name='fechaFin' onChange={handleInputChange} required></input>
          <label>Hora de inicio:</label>
          <input type='text' placeholder='Hora incio' value={formData.horaInicio} name='horaInicio' onChange={handleInputChange} required></input>
          <label>Hora de finalizacion:</label>
          <input type='text' placeholder='Hora fin' value={formData.horaFin} name='horaFin' onChange={handleInputChange} required></input>
          <label>Dia de cursado:</label>
          <input type='text' placeholder='Dia de cursado'></input>
          <button type='submit'>Crear</button>
        </form>
      </div>
    </div>
  )
}
export default CrearCurso
