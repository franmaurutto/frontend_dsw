
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SobreNosotros from './components/SobreNosotros.js';
import Contacto from './components/Contacto';
import SignUpForm from './components/SignUpForm';
import { NavegacionAlu } from './components/NavegacionAlu.js';
import { MisCursos } from './components/MisCursos.js';
import { MiCuenta } from './components/MiCuenta.js';
import { UsuarioProvider } from './components/UsuarioContext.js';
import { NavegacionProf } from './components/NavegacionProf.js';
import CursoDetalle from './components/CursoDetalle.js';
import {CrearCurso} from './components/CrearCurso.js'
import {DatosCurso} from './components/DatosCurso.js'
import { CursoProvider } from './components/CursoContext.js';
import {Parcial} from './components/Parcial.js'
import { MaterialProvider } from './components/MaterialContext.js';
import { CrearMaterial } from './components/CrearMaterial.js';
import {Materiales} from './components/Materiales.js';
import {ModificarMaterial} from './components/ModificarMaterial.js';
import {AgregarMaterial} from './components/AgregarMaterial.js';
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
        </Routes>
      </div>
    </Router>

  );
}

export default App;
