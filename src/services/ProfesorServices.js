const API_URL = 'http://localhost:3000/api/profesores';

export const getProfesores = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createProfesor = async (profesor) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profesor),
  });

  if (!response.ok) {
    throw new Error('Error al registrar profesor');
  }
  return response.json();
};

export const updateProfesor = async (profesorId, profesor) => {
  const response = await fetch(`${API_URL}/${profesorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profesor),
  });
  return response.json();
};

export const deleteProfesor = async (profesorId) => {
  const response = await fetch(`${API_URL}/${profesorId}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const authProfesor = async (mail, contrasenia) => {
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

export const getCursosProfesor = async (id) => {
  const response = await fetch(`${API_URL}/${id}/cursos`); 
  if (!response.ok) {
    throw new Error('Error al obtener los cursos del alumno');
  }
  return response.json();
};