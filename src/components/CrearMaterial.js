import React, { useState, useEffect } from 'react'
import NavBar from './NavBar.js'
import { createMaterial } from '../services/MaterialService.js';
import '../styles/CrearMaterial.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
export const CrearMaterial = () => {

  const profLinks = [
    { label: 'Mi cuenta', path: '/mi-cuenta' },
    { label: 'Mis Cursos', path: '/nav-prof' },
    { label: 'Crear Curso', path: '/crear-curso' },
    { label: 'Crear Material', path: '/crear-material' },
    { label: 'Materiales', path: '/materiales' },
  ];
  const navigate = useNavigate()
  const[error,setError]= useState()
  const[mensajeExito,setMensajeExito]=useState()

  const [formData, setFormData] = useState({
  descripcion: '',
  titulo: '',
  });
  useEffect(() => {
    const usuarioToken = localStorage.getItem('authToken');
    const decodedUsuarioToken = usuarioToken ? jwtDecode(usuarioToken) : null;
    if (!usuarioToken || !decodedUsuarioToken) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
  }, [navigate]);
  const materialData = { 
    ...formData, 
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  try {
    const response = await createMaterial(materialData);
    console.log('Material registrado:', response);
    setMensajeExito('Se ha registrado el material')
  } catch (err) {
    setError('Hubo un error al registrar el material');
    console.error('Error al registrar el material:', err);
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
    <div className='crear-material'>
      <NavBar links={profLinks}></NavBar>
      <div className='form-material'>
        <h1>Crear material</h1>
        {error && <p className="error-box">{error}</p>}
        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
        <form onSubmit={handleSubmit}>
          <label>Titulo del material:</label>
          <input type='text' placeholder='Titulo' value={formData.titulo} name='titulo' onChange={handleInputChange} required></input>
          <label>Descripcion:</label>
          <input type='text' placeholder='Descripcion' value={formData.descripcion} name='descripcion' onChange={handleInputChange} required></input>
          <button type='submit'>Crear</button>
        </form>
      </div>
    </div>
  )
}
export default CrearMaterial