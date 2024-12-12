const API_URL = 'http://localhost:3000/api/parciales';
const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};
export const getParciales = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createParcial = async (parcial) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(), 
    body: JSON.stringify(parcial)
  }); 
  return response.json();
};

export const getParcial = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getHeaders(), 
  }); 
  if (!response.ok) {
    throw new Error('Error al obtener el parcial');
  }
  const data = await response.json()
  console.log(data.token)
  console.log(data)
  return data.parcialToken;
};

export const updateParcial = async (parcialId, parcial) => {
  const response = await fetch(`${API_URL}/${parcialId}`, {
    method: 'PUT',
    headers: getHeaders(), 
    body: JSON.stringify(parcial)
  }); 
  return response.json();
};

export const deleteParcial = async (parcialId) => {
  const response = await fetch(`${API_URL}/${parcialId}`, {
    method: 'DELETE',
    headers: getHeaders()
  }); 
  return response.json();
};

export const getRtaParcialdeParcial = async (parcialId) => {
  const response = await fetch(`${API_URL}/${parcialId}/rtasParcial`, {
    method: 'GET',
    headers: getHeaders(), 
  }); 
  if (!response.ok) {
    throw new Error('Error al obtener las rtasParcial');
  }
  const { data } = await response.json(); 
  return data;
};