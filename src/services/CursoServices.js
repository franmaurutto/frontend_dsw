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

// CursoServices.js
export const getCursoDetalle = async (cursoId) => {
  try {
    const response = await fetch(`/api/cursos/${cursoId}`);  // Verifica la URL de la API
    if (!response.ok) {
      throw new Error('No se pudo obtener los detalles del curso');
    }
    const data = await response.json();
    console.log(data);  // Agrega esto para ver la respuesta del servidor
    return data;  // Asegúrate de que la estructura de datos sea la correcta
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    throw error;  // Lanza el error para que lo maneje el componente
  }
};


