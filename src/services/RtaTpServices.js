
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/rtaTps`

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), 
  };
};

export const getRtasTp = async () => {
  const response = await fetch(API_URL);
  const tp1 = await response.json();  
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

  if (!response.ok) {
    console.error('Error en la respuesta:', response.statusText);
    console.error('Error en la respuesta completa:', await response.text());

    return;
  }
  const tp1 = await response.json();
  return tp1.data;
};

export const getRtaTp = async (tpId, inscripcionId) => {
  try {
    const response = await fetch(`${API_URL}/${tpId}/inscripcion/${inscripcionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener la respuesta del TP');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener la respuesta:', error);
    throw error;
  }
};

export const updateRtaTp = async (rtaTpId, rtaConsignaTP) => {
  const response = await fetch(`${API_URL}/${rtaTpId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      rtaConsignaTP: rtaConsignaTP,
    }),
  });

  if (!response.ok) {
    console.error('Error en la respuesta:', response.statusText);
    console.error('Error en la respuesta completa:', await response.text());
    return;
  }

  const tp1 = await response.json();
  return tp1.data;
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