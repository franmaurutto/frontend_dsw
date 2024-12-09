const API_URL = 'http://localhost:3000/api/alumnos';

export const getAlumnos = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createAlumno = async (alumno) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alumno),
  });

  if (!response.ok) {
    throw new Error('Error al registrar usuario');
  }

  return response.json();
};

export const updateUsuario = async (usuarioId, usuario) => {
  const response = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  return response.json();
};

export const deleteUsuario = async (usuarioId) => {
  const response = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const authUsuario = async (mail, contrasenia) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mail, contrasenia }),
  });
  
  if (!response.ok) {
    throw new Error('Correo o contraseña incorrecta');
  }
  return response.json();
};

export const getInscripcionesAlumno = async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/${usuarioId}/inscripciones`);
    if (!response.ok) {
      throw new Error('No se pudieron obtener las inscripciones');
    }
    const data = await response.json();
    return data.data;  
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    throw new Error('Error al obtener inscripciones del alumno');
  }
};

export const getCursosProfesor = async (id) => {
    const response = await fetch(`${API_URL}/${id}/cursos`); 
    if (!response.ok) {
      throw new Error('Error al obtener los cursos del profesor');
    }
    return response.json();
  };