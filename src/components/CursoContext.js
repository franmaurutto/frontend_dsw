/*import React, { createContext, useState, useContext } from 'react';
const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
  const [curso, setCurso] = useState(() => {
    const savedCurso = localStorage.getItem('curso');
    return savedCurso ? JSON.parse(savedCurso) : null;
  });

const handleSetCurso = (cursoData) => {

    if (cursoData && usuarioData.data) {
      setUsuario(usuarioData.data);
    localStorage.setItem('usuario', JSON.stringify(usuarioData.data));
    } else {
      console.error('Datos del usuario no válidos:', usuarioData);
    }
};

  const handleLogout = () => {
    setUsuario(null); 
    localStorage.removeItem('usuario'); 
  };

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario: handleSetUsuario,logout: handleLogout}}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUser = () => useContext(UsuarioContext);*/