
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

function App() {

  return (
    <UsuarioProvider>
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
          </Routes>
        </div>
      </Router>
    </UsuarioProvider>

  );
}

export default App;
