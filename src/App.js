
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SobreNosotros from './components/SobreNosotros.js';
import Contacto from './components/Contacto';
import SignUpForm from './components/SignUpForm';
import { NavegacionAlu } from './components/NavegacionAlu.js';
import {MisCursos} from './components/MisCursos.js';
import { MiCuenta } from './components/MiCuenta.js';
import { NavegacionProf } from './components/NavegacionProf.js';
import CursoDetalle from './components/CursoDetalle.js';
import {CrearCurso} from './components/CrearCurso.js'
import {DatosCurso} from './components/DatosCurso.js'
import {Parcial} from './components/Parcial.js'
import { CrearMaterial } from './components/CrearMaterial.js';
import {Materiales} from './components/Materiales.js';
import {ModificarMaterial} from './components/ModificarMaterial.js';
import {AgregarMaterial} from './components/AgregarMaterial.js';
import {VerParcial} from './components/VerParcial.js';
import RtaParcial from './components/RtaParcial.js';
import {RespuestaTp} from './components/RespuestaTp.js';
import VerRtasParcial from './components/VerRtasParcial.js';
import { Tp } from './components/Tp.js';
import ResponderTp from './components/ResponderTp.js';
function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage  />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/sign-up-form" element={<SignUpForm />} />
          <Route path="/nav-alu" element={<NavegacionAlu />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route path="/mis-cursos" element={<MisCursos />} />
          <Route path="/nav-prof" element={<NavegacionProf />} />
          <Route path="/curso/:cursoId" element={<CursoDetalle />} />
          <Route path="/crear-curso" element={<CrearCurso />} />
          <Route path="/datos-curso" element={<DatosCurso />} />
          <Route path="/parcial" element={<Parcial />} />
          <Route path="/crear-material" element={<CrearMaterial />} />
          <Route path="/materiales" element={<Materiales />} />
          <Route path="/modificar-material" element={<ModificarMaterial />} />
          <Route path="/agregar-material" element={<AgregarMaterial />} />
          <Route path="/ver-parcial" element={<VerParcial />} />
          <Route path="/rta-parcial" element={<RtaParcial />} />
          <Route path="/ver-rtasparcial" element={<VerRtasParcial />} />
          <Route path="/tp" element={<Tp />} />
          <Route path="/rta-tp" element={<ResponderTp />}/>
          <Route path="/ver-rtastp" element={<RespuestaTp />} />
          
        </Routes>
      </div>
    </Router>

  );
}

export default App;
