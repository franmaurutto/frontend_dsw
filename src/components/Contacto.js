import React from 'react';
import '../styles/Contacto.css';
import NavBar from './NavBar.js';

const Contacto = () => {
  const homeLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Cursos', path: '/cursos' },
    { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { label: 'Contacto', path: '/contacto' },
    ];
    return (
  <div className="contacto">
  <NavBar links={homeLinks}></NavBar>
    <h2>Contacto</h2>
    <p>Ponte en contacto con nosotros para cualquier consulta.</p>
    <div className="contact-info">
      <h3>Integrantes:</h3>
      <ul>
        <li><strong>Maria de los Ángeles Arfuso</strong>, mail: <span className="email">mangeles.arfuso@gmail.com</span></li>
        <li><strong>Regina Diodati</strong>, mail: <span className="email">regidiodati@gmail.com</span></li>
        <li><strong>Delfina Mansilla</strong>, mail: <span className="email">delfimansilla.ros@gmail.com</span></li>
        <li><strong>Francesca Maurutto</strong>, mail: <span className="email">franchuls666@gmail.com</span></li>
      </ul>
      <p><strong>Comisión:</strong> 301</p>
      <p><strong>Carrera:</strong> Ingeniería en Sistemas de Información</p>
      <p><strong>Universidad:</strong> UTN</p>
    </div>
  </div>
)};
export default Contacto;
