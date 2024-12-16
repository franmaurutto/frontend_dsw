
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/materiales`

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getMateriales = async () => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeaders(), 
    }); 
    if (!response.ok) {
      throw new Error('Error al obtener los materiales');
    }
    const { data } = await response.json(); 
    return data;
  };

export const createMaterial = async (material) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(material),
  });
  return response.json();
};

export const updateMaterial = async (materialId, material) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(material),
  });
  return response.json();
};

export const deleteMaterial = async (materialId) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};
export const findMatSinCurso = async () => {
  const response = await fetch(`${API_URL}/sin-curso`, {
    method: 'GET',
    headers: getHeaders(), 
  });
  if (!response.ok) {
    throw new Error('Error al obtener los materiales');
  }
  const { data } = await response.json(); 
  return data;
};
export const addMaterialToCurso = async (materialId, cursoId) => {
  try {
    if (!materialId || !cursoId || isNaN(materialId) || isNaN(cursoId)) {
      throw new Error('Material ID o Curso ID no proporcionados o inválidos');
    }

    const response = await fetch(`${API_URL}/${materialId}/add-to-curso/${cursoId}`, {
      method: 'POST',
      headers: getHeaders(), 
    });

    if (!response.ok) {
      throw new Error('Error al agregar el material al curso');
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error('Error al agregar material al curso:', error);
    throw new Error('Error al agregar material al curso');
  }
};
export const getMaterial = async (materialId) => {
  try {
    const response = await fetch(`${API_URL}/${materialId}`, {
      method: 'GET',
      headers: getHeaders(), 
    }); 
    if (!response.ok) {
      throw new Error('No se pudo obtener el material');
    }
    const data = await response.json();
    return data.materialToken;  
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    throw error;
  }
};