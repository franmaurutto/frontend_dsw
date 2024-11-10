const API_URL = 'http://localhost:3000/api/rtaTps';

export const getRtasTp = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createRtaTp = async (rtaTp) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rtaTp),
  });
  return response.json();
};

export const updateRtaTp = async (rtaTpId, rtaTp) => {
  const response = await fetch(`${API_URL}/${rtaTpId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rtaTp),
  });
  return response.json();
};

export const deleteRtaTp = async (rtaTpId) => {
  const response = await fetch(`${API_URL}/${rtaTpId}`, {
    method: 'DELETE',
  });
  return response.json();
};