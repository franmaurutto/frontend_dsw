
const API_URL = 'http://localhost:3000/api/cursos';
/*
export const GetInscripcionesCurso = async (cursoId) => {
  try {
    const response = await fetch(`${API_URL}/${cursoId}/inscripciones`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al obtener inscripciones del curso:', errorData.message);
      throw new Error(errorData.message || 'Error al obtener las inscripciones del curso');
    }

    const data = await response.json(); 
    return data.token ; 
  } catch (error) {
    console.error('Error al obtener inscripciones por curso:', error);
    throw error;
  }
};*/



export const getCursos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }
  const { data } = await response.json(); 
  return data;
};

const getToken = () => localStorage.getItem('authToken')

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};



export const createCurso = async (curso) => {
  try{
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(curso),
  });
  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Error del servidor:', errorData);
  }
  const data = await response.json();
    return data.token;  
  } catch (error) {
    console.error('Error al crear el curso:', error);
    throw error;
  }
};


export const getCurso = async (cursoId) => {
  try {
    const response = await fetch(`${API_URL}/${cursoId}`, {
      method: 'GET',
      headers: getHeaders(), 
    }); 
    if (!response.ok) {
      throw new Error('No se pudo obtener el curso');
    }
    const data = await response.json();
    return data.token;  
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    throw error;
  }
};
export const updateCurso = async (cursoId, curso) => {
  const response = await fetch(`${API_URL}/${cursoId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(curso),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el curso');
  }
  return response.json();
};

export const deleteCurso = async (cursoId) => {
  const response = await fetch(`${API_URL}/${cursoId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el curso');
  }
  return response.json();
};

export const getCursoDetalle = async (cursoId) => {
  try {
    const response = await fetch(`/api/cursos/${cursoId}`); 
    if (!response.ok) {
      throw new Error('No se pudo obtener los detalles del curso');
    }
    const data = await response.json();
    return data;  
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    throw error;
  }
};

export const getMaterialesCurso = async (cursoId) => {
  const response = await fetch(`${API_URL}/${cursoId}/materiales`, {
    method: 'GET',
    headers: getHeaders(), 
  }); 
  if (!response.ok) {
    throw new Error('Error al obtener los materiales');
  }
  const { data } = await response.json(); 
  return data;
};
/*
export const getInscripcionesPorCurso = async (cursoId) => {
  try {
    const response = await fetch(`${API_URL}/${cursoId}/inscripciones`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData.message);
      throw new Error(errorData.message || 'Error al obtener las inscripciones del curso');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    throw error;
  }
};*/
export const getInscripcionesCurso = async (cursoId) => {
  try {
    const url = `${API_URL}/${cursoId}/inscripciones`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    console.log('Response completa:', response); // Verifica qué estás recibiendo
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData.message);
      throw new Error(errorData.message || 'Error al obtener las inscripciones del curso');
    }

    const data = await response.json();
    console.log('Datos de la respuesta:', data); // Asegúrate de que "data" es lo que esperas
    return data; //ACA NO VA DATA.TOKEN 
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    throw error;
  }
};
