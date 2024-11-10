const API_URL = 'http://localhost:3000/api/parciales';

export const getParciales = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createParcial = async (parcial) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parcial),
  });
  return response.json();
};

export const updateParcial = async (parcialId, parcial) => {
  const response = await fetch(`${API_URL}/${parcialId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parcial),
  });
  return response.json();
};

export const deleteParcial = async (parcialId) => {
  const response = await fetch(`${API_URL}/${parcialId}`, {
    method: 'DELETE',
  });
  return response.json();
};