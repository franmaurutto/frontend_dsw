const API_URL = 'http://localhost:3000/api/certificados';

export const getCertificados = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createCertificado = async (certificado) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(certificado),
  });
  return response.json();
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