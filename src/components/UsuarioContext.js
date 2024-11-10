import React, { createContext, useState, useContext } from 'react';
const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });

const handleSetUsuario = (usuarioData) => {

    if (usuarioData && usuarioData.data) {
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

export const useUser = () => useContext(UsuarioContext);