const API_URL = 'http://localhost:3000/api/rtaParciales';

export const getRtasParcial = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createRtaParcial = async (rtaParcial) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  });
  return response.json();
};