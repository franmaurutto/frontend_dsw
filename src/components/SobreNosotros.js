import React from 'react';
import '../styles/SobreNosotros.css';
import NavBar from './NavBar.js';

const SobreNosotros = () => {
  const homeLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Cursos', path: '/cursos' },
    { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { label: 'Contacto', path: '/contacto' },
    ];
    return (
  <div className="sobre-nosotros">
    <NavBar links={homeLinks}></NavBar>
    <h2>Sobre Nosotras</h2>
    <p>
      Somos cuatro chicas con un rumbo bien claro,<br />
      Estudiamos Ingeniería, buscando siempre lo más raro,<br />
      En Sistemas de Información nos encanta innovar,<br />
      Y con tecnología, todo lo que queremos lograr.<br />
    </p>
    <p>
      Cada una tiene su estilo, su toque especial,<br />
      Pero lo que nos une es la amistad, que es lo más leal.<br />
      Juntas pasamos mil horas, estudiando sin parar,<br />
      Porque sabemos que este camino lo vamos a disfrutar.<br />
    </p>
    <p>
      El trabajo en equipo es lo que nos hace fuertes,<br />
      Siempre juntas, aunque haya mil puertas por abrir de frente.<br />
      Con esfuerzo, dedicación y un toque de locura,<br />
      Vamos a llegar lejos, eso está en nuestra altura.<br />
    </p>
    <p>
      Si nos buscás, sabés dónde encontrarnos,<br />
      Cuatro amigas con un objetivo que nunca vamos a soltar, siempre a full,<br />
      La Ingeniería nos motiva, nos impulsa a seguir, <br />
      Y la amistad es lo que nos hace seguir para no rendir.<br />
    </p>
  </div>
)};

export default SobreNosotros;
