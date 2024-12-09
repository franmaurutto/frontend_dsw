import React from 'react';
import NavBar from './NavBar.js';
import '../styles/SignUpForm.css';
import { useState } from 'react';
import { createAlumno } from '../services/AlumnoServices.js';
import { createProfesor } from '../services/ProfesorServices.js';
import { useNavigate } from 'react-router-dom';


const SignUpForm =() =>{

const homeLinks = [
{ label: 'Inicio', path: '/' },
{ label: 'Cursos', path: '/cursos' },
{ label: 'Sobre Nosotros', path: '/sobre-nosotros' },
{ label: 'Contacto', path: '/contacto' },
];

const [mostrarFormulario, setMostrarFormulario] = useState("alu");
const [formData, setFormData] = useState({
  nombreCompleto: '',
  mail: '',
  telefono: '',
  contrasenia: '',
});

const [formDataProf, setFormDataProf] = useState({
  nombre_y_apellido: '',
  mail: '',
  telefono: '',
  contrasenia: '',
});

const navigate=useNavigate();

const [error, setError] = useState(null);

const handleToggle = () => {
  setMostrarFormulario((prev) => (prev === "alu" ? "prof" : "alu"));
};

const handleInputChange = (e) => { 
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleInputChangeProf = (e) => { 
  const { name, value } = e.target;
  setFormDataProf((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  


    if (mostrarFormulario === "prof" && !formDataProf.mail.includes('@educatech')) {
      setError('El correo electrónico debe contener @educatech');
      return;
    }

    if (mostrarFormulario === "alu") {
    try {
      const response = await createAlumno(formData);
      console.log('Alumno registrado:', response);
      navigate('/'); 
    } catch (err) {
      setError('Hubo un error al registrar al alumno');
      console.error('Error al registrar alumno:', err);
    }
  } 
  else{
    try{
    const response = await createProfesor(formDataProf);
    console.log('Profesor registrado:', response);
    navigate('/'); 
    
    } catch (err) {
      setError('Hubo un error al registrar al profesor');
      console.error('Error al registrar profesor', err);
    }
  }
};

  return (
    <div className="form-container">
      <NavBar links={homeLinks} />

      {error && <p className="error-box">{error}</p>}

      <div className={`formAlu ${mostrarFormulario === "alu" ? "visible" : "oculto"}`}>

        <form onSubmit={handleSubmit}>
          <h2>Registro de Alumno</h2>
          <input type="text" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleInputChange} name='nombreCompleto' required></input>
          <input type="email" placeholder="Email" value={formData.mail} onChange={handleInputChange} name='mail' required></input>
          <input type="tel" placeholder="Telefono" value={formData.telefono} onChange={handleInputChange} name='telefono' required></input>
          <input type="password" placeholder="Contraseña" value={formData.contrasenia} onChange={handleInputChange} name='contrasenia' required></input>
          <button type='submit'>Registrarse</button>
        </form>
        <div className='separadorAlu'>
          <button onClick={handleToggle} className='btnProf'>Registrate como Profesor</button>
        </div>
      </div>

      <div className={`formProf ${mostrarFormulario === "prof" ? "visible" : "oculto"}`}>
        <form onSubmit={handleSubmit}>
          <h2>Registro de Profesor</h2>
          <input type="text" placeholder="Nombre Completo" value={formDataProf.nombre_y_apellido} onChange={handleInputChangeProf} name='nombre_y_apellido' required></input>
          <input type="email" placeholder="Email (use @educatech)" value={formDataProf.mail} onChange={handleInputChangeProf} name='mail' required></input>
          <input type="tel" placeholder="Telefono" value={formDataProf.telefono} onChange={handleInputChangeProf} name='telefono' required></input>
          <input type="password" placeholder="Contraseña" value={formDataProf.contrasenia} onChange={handleInputChangeProf} name='contrasenia' required></input>
          <button type='submit'>Registrarse</button>
        </form>
        <div className='separadorProf'>
          <button onClick={handleToggle} className='btnAlu'>Registrate como Alumno</button>
        </div>
      </div>


      
    </div>
  );
};


export default SignUpForm;