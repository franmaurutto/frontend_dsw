
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/rtaParciales`

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  console.log('Token en headers:', token);
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getRtasParcial = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createRtaParcial = async (rtaParcial) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(rtaParcial),
  });
  return response.json();
};

export const updateRtaParcial = async (rtaParcialId, rtaParcial) => {
  const response = await fetch(`${API_URL}/${rtaParcialId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rtaParcial),
  });
  return response.json();
};

export const deleteRtaParcial = async (rtaParcialId) => {
  const response = await fetch(`${API_URL}/${rtaParcialId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};

export const getInscripcionDeRtaParcial = async (rtaParcialId, inscripcionId) => {
  try {
    const response = await fetch(`${API_URL}/${rtaParcialId}/inscripcion/${inscripcionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener la inscripcion de la rtaParcial');
    }
    const data= await response.json(); 
    return data
  } catch (error) {
    console.error('Error al obtener la inscripcion:', error);
    throw error;
  }
};