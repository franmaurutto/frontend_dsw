import React, { createContext, useState, useContext } from 'react';
const MaterialContext = createContext();

export const MaterialProvider = ({ children }) => {
  const [material, setMaterial] = useState(() => {
    const savedMaterial = localStorage.getItem('material');
    return savedMaterial ? JSON.parse(savedMaterial) : null;
  });

const handleSetMaterial = (materialData) => {

    if (materialData) {
      setMaterial(materialData);
    localStorage.setItem('material', JSON.stringify(materialData));
    } else {
      console.error('Datos del curso no válidos:', materialData);
    }
};

  return (
    <MaterialContext.Provider value={{ material, setMaterial: handleSetMaterial}}>
      {children}
    </MaterialContext.Provider>
  );
};

export const useMaterial = () => useContext(MaterialContext);