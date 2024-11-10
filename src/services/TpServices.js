const API_URL = 'http://localhost:3000/api/tps';

export const getTps = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createTp = async (tp) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tp),
  });
  return response.json();
};

export const updateTp = async (tpId, tp) => {
  const response = await fetch(`${API_URL}/${tpId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tp),
  });
  return response.json();
};

export const deleteTp = async (tpId) => {
  const response = await fetch(`${API_URL}/${tpId}`, {
    method: 'DELETE',
  });
  return response.json();
};