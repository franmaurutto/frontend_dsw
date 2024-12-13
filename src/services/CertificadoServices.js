const API_URL = 'http://localhost:3000/api/certificados';

export const getCertificados = async () => {
  const response = await fetch(API_URL);
  return response.json();
};
const getToken = () => localStorage.getItem('authToken') //ver si es authToken

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const createCertificado = async (certificado) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certificado),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al crear el certificado');
    }
    const data = await response.json();
    return data.token; 
  } catch (error) {
    console.error('Error al crear el certificado:', error);
    throw error;
  }
};

export const updateCertificado = async (certificadoId, certificado) => {
  const response = await fetch(`${API_URL}/${certificadoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(certificado),
  });
  return response.json();
};

export const deleteCertificado = async (certificadoId) => {
  const response = await fetch(`${API_URL}/${certificadoId}`, {
    method: 'DELETE',
  });
  return response.json();
};