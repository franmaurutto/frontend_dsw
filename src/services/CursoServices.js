const API_URL = 'http://localhost:3000/api/cursos';

// Obtener todos los cursos
export const getCursos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }
  const { data } = await response.json(); 
  return data;
};

// Crear un nuevo curso
export const createCurso = async (curso) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(curso),
  });
  if (!response.ok) {
    throw new Error('Error al crear el curso');
  }
  return response.json();
};

// Actualizar un curso
export const updateCurso = async (cursoId, curso) => {
  const response = await fetch(`${API_URL}/${cursoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(curso),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el curso');
  }
  return response.json();
};

// Eliminar un curso
export const deleteCurso = async (cursoId) => {
  const response = await fetch(`${API_URL}/${cursoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el curso');
  }
  return response.json();
};