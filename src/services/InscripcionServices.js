
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/inscripciones`

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};


export const getInscripciones = async (cursoId) => {
  try {
    const response = await fetch(`${API_URL}/${cursoId}`, { 
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al crear el curso');
    }
    const data = await response.json();
    return data.token; 
  } catch (error) {
    console.error('Error en getInscripciones:', error.message);
    throw error;
  }
};

export const createInscripcion = async (inscripcion) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(inscripcion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la inscripción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createInscripcion:', error.message);
    throw error; 
  }
};


export const updateInscripcion = async (inscripcionId, inscripcion) => {
  const response = await fetch(`${API_URL}/${inscripcionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inscripcion),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar la inscripción');
  }
  
  return response.json();  
};

export const deleteInscripcion = async (inscripcionId) => {
  const response = await fetch(`${API_URL}/${inscripcionId}`, {
    method: 'DELETE',
    headers:getHeaders()
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la inscripcion');
  }
  return response.json();
  };

export const getCursoDeInscripcion = async (inscripcionId, cursoId) => {
  try {
    const response = await fetch(`${API_URL}/${inscripcionId}/curso/${cursoId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener el curso de la inscripción');
    }
    const data= await response.json(); 
    return data
  } catch (error) {
    console.error('Error al obtener el curso:', error);
    throw error;
  }
};

export const getAlumnoDeInscripcion = async (inscripcionId, alumnoId) => {
  try {
    const response = await fetch(`${API_URL}/${inscripcionId}/alumno/${alumnoId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener el alumno de la inscripción');
    }
    const data= await response.json(); 
    return data
  } catch (error) {
    console.error('Error al obtener el alumno:', error);
    throw error;
  }
};

export const getInscripcion = async (inscripcionId) => {
  try {
    const response = await fetch(`${API_URL}/${inscripcionId}`, {
      method: 'GET',
      headers: getHeaders(), 
    }); 
    if (!response.ok) {
      throw new Error('No se pudo obtener la inscripcion');
    }
    const data = await response.json();
    return data.inscripcionToken;  
  } catch (error) {
    console.error('Error al obtener la inscripcion:', error);
    throw error;
  }
};
export const getAlumnoInscripcion = async (usuarioId, inscripcionId) => {
  try {
    const response = await fetch(`${API_URL}/${inscripcionId}/usuario/${usuarioId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor al obtener el usuario de la inscripción:', errorData.message);
      throw new Error(errorData.message || 'Error al obtener el usuario de la inscripción');
    }

    const data = await response.json();
    return data.token; 
  } catch (error) {
    console.error('Error al obtener el usuario de la inscripción:', error);
    throw error;
  }
};