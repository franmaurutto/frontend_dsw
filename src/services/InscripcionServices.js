const API_URL = 'http://localhost:3000/api/inscripciones';

export const getInscripciones = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las inscripciones');
  }
  return response.json();
};

export const createInscripcion = async (inscripcion) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inscripcion),
  });
  return response.json();
};

export const updateInscripcion = async (inscripcionId, inscripcion) => {
  const response = await fetch(`${API_URL}/${inscripcionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inscripcion),
  });
  return response.json();
};

export const deleteInscripcion = async (inscripcionId) => {
  const response = await fetch(`${API_URL}/${inscripcionId}`, {
    method: 'DELETE',
  });
  return response.json();
};