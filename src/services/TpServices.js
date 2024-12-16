
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/tps`

export const getTps = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getTp = async (tpId) => {
  const response = await fetch(`${API_URL}/${tpId}`, {
    method: 'GET',
    headers:getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Error del servidor:', errorData);
  }
  return response.json()
}


export const createTp = async (tp) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(tp),
  });
  return response.json();
};

export const updateTp = async (tpId, tp) => {
  const response = await fetch(`${API_URL}/${tpId}`, {
    method: 'PUT',
    headers:getHeaders(),
    body: JSON.stringify(tp),
  });
  return response.json();
};

export const deleteTp = async (tpId) => {
  const response = await fetch(`${API_URL}/${tpId}`, {
    method: 'DELETE',
    headers:getHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Error del servidor:', errorData);
  }
  return response.json();
};


export const getRtaTpdeTp = async (tpId) => {
  const response = await fetch(`${API_URL}/${tpId}/rtaTps`, {
    method: 'GET',
    headers: getHeaders(), 
  }); 
  if (!response.ok) {
    throw new Error('Error al obtener las rtastp');
  }
  const { data } = await response.json();
  return data;
};