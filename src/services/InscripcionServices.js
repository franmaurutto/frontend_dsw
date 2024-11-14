const API_URL = 'http://localhost:3000/api/inscripciones';

export const getInscripciones = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las inscripciones');
  }
  return response.json();
};

export const createInscripcion = async (inscripcion) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inscripcion),
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      // Extraer el mensaje de error del backend si está disponible
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la inscripción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createInscripcion:', error.message);
    throw error; // Relanzar el error para que sea manejado por quien llame a esta función
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
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la inscripcion');
  }
  return response.json();
  };
export const getCursoDeInscripcion = async (inscripcionId, cursoId) => {
  try {
    console.log(`Obteniendo curso con ID: ${cursoId}`);  // Verifica el valor de cursoId
    console.log(`Haciendo solicitud a: ${API_URL}/${inscripcionId}/curso/${cursoId}`);

    const response = await fetch(`${API_URL}/${inscripcionId}/curso/${cursoId}`);
    if (!response.ok) {
      throw new Error('Error al obtener el curso de la inscripción');
    }
    return response.json();  // Retorna el curso asociado a la inscripción
  } catch (error) {
    console.error('Error al obtener el curso:', error);
    throw error;
  }
};

