const API_URL = 'http://localhost:3000/api/usuarios';


export const authUsuario = async (mail, contrasenia) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mail, contrasenia }),
  });
  
  if (!response.ok) {
    const errorData = await response.json(); 
    throw new Error(errorData.message || 'Correo o contraseña incorrecta');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  console.log('Token en headers:', token);
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getAlumnos = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
      const errorData = await response.json(); // Lee el mensaje de error del servidor
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al actualizar el usuario');
  }

  return response.json();}

export const getUsuario = async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/${usuarioId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el usuario');
    }

    const data = await response.json();
    return data;  
  } catch (error) {
    console.error('Error al obtener el detalle del curso:', error);
    throw error;
  }
};


export const updateUsuario = async (usuarioId, usuario) => {
  const response = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'PUT',
    headers:getHeaders(),
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }
  return response.json();
};

export const cambiarContrasenia = async (usuarioId,viejaContrasenia,nuevaContrasenia) =>{
    const response = await fetch(`${API_URL}/${usuarioId}/cambiar-contrasenia`, {
    method: 'PATCH',
    headers:getHeaders(),
    body: JSON.stringify({
    viejaContrasenia,
    nuevaContrasenia,
    }),
  });

  if (!response.ok) {
      const errorData = await response.json(); 
      console.error('Error del servidor:', errorData.message); 
      throw new Error(errorData.message || 'Error al actualizar el usuario');
  }
  return await response.json();
}

export const deleteUsuario = async (usuarioId) => {
  const response = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'DELETE',
    headers:getHeaders()
  });
  return response.json();
};



export const getInscripcionesAlumno = async (usuarioId) => {
  try {
      const response = await fetch(`${API_URL}/${usuarioId}/inscripciones`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json(); 
        console.error('Error del servidor:', errorData.message); 
        throw new Error(errorData.message || 'Error al actualizar el usuario');
    }
    const data = await response.json();
    console.log (data);
    return data;  
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    throw new Error('Error al obtener inscripciones del alumno');
  }
};

export const getCursosProfesor = async (id) => {
    const response = await fetch(`${API_URL}/${id}/cursos`, {
    method: 'GET',
    headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener los cursos del profesor');
    }
    return response.json();
  };