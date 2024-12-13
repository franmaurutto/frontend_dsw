const API_URL = 'http://localhost:3000/api/rtaTps';

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  console.log('Token en headers:', token);
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getRtasTp = async () => {
  const response = await fetch(API_URL);
  const tp1 = await response.json();  
  console.log(tp1.data);  
  return tp1.data;
};

export const createRtaTp = async (rtaTp) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(), 
    body: JSON.stringify({
      inscripcionId: rtaTp.inscripcionId,  
      tpId: rtaTp.tpId,                    
      rtaConsignaTP: rtaTp.rtaConsignaTP
 
    }),
  });
  console.log(rtaTp);
  console.log(rtaTp.inscripcionId);
  console.log(rtaTp.tpId)
  console.log(rtaTp.rtaConsignaTP)
  console.log('HOLAAAA'); 
  console.log('Response Status:', response.status);
  
  if (!response.ok) {
    console.error('Error en la respuesta:', response.statusText);
    console.error('Error en la respuesta completa:', await response.text());

    console.log('entra al if')
    return;
  }
  const tp1 = await response.json();
  console.log('Respuesta recibidaaaa:', tp1.data);  
  return tp1.data;
};

export const updateRtaTp = async (rtaTpId, rtaTp) => {
  const response = await fetch(`${API_URL}/${rtaTpId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(rtaTp),
  });
  return response.json();
};

export const deleteRtaTp = async (rtaTpId) => {
  const response = await fetch(`${API_URL}/${rtaTpId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};

export const getInscripcionDeRtaTp = async (rtaTpId, inscripcionId) => {
  try {
    const response = await fetch(`${API_URL}/${rtaTpId}/inscripcion/${inscripcionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener la inscripcion de la rtaTp');
    }
    const data= await response.json(); 
    return data
  } catch (error) {
    console.error('Error al obtener la inscripcion:', error);
    throw error;
  }
};