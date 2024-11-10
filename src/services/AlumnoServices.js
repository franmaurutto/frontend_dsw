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
    throw new Error('Error al registrar alumno');
  }

  return response.json();
};

export const updateAlumno = async (alumnoId, alumno) => {
  const response = await fetch(`${API_URL}/${alumnoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alumno),
  });
  return response.json();
};

export const deleteAlumno = async (alumnoId) => {
  const response = await fetch(`${API_URL}/${alumnoId}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const authAlumno = async (mail, contrasenia) => {
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

export const getCursosAlumno = async (id) => {
  const response = await fetch(`${API_URL}/${id}/cursos`); 
  if (!response.ok) {
    throw new Error('Error al obtener los cursos del alumno');
  }
  return response.json();
};