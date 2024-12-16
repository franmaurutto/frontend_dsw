
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/certificados`

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
export const getCertificado = async (certificadoId) => {
  try {
    const response = await fetch(`${API_URL}/${certificadoId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el certificado');
    }

    const data = await response.json();
    return data;  
  } catch (error) {
    console.error('Error al obtener el detalle del certificado:', error);
    throw error;
  }
};

export const createCertificado = async (certificadoData) => {
  try {
    console.log("Datos del certificado:", certificadoData);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certificadoData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error('Error al crear el certificado');
    }
    const data = await response.json();
    return data; 
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