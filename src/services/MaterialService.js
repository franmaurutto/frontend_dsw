const API_URL = 'http://localhost:3000/api/materiales';

export const getMateriales = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los materiales');
    }
    const { data } = await response.json(); 
    return data;
  };

export const createMaterial = async (material) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  });
  return response.json();
};

export const updateMaterial = async (materialId, material) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  });
  return response.json();
};

export const deleteMaterial = async (materialId) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method: 'DELETE',
  });
  return response.json();
};
export const findMatSinCurso = async () => {
  const response = await fetch(`${API_URL}/sin-curso`);
  if (!response.ok) {
    throw new Error('Error al obtener los materiales');
  }
  const { data } = await response.json(); 
  return data;
};
export const addMaterialToCurso = async (materialId, cursoId) => {
  try {
    // Verifica si los IDs están presentes y son válidos
    if (!materialId || !cursoId || isNaN(materialId) || isNaN(cursoId)) {
      throw new Error('Material ID o Curso ID no proporcionados o inválidos');
    }

    const response = await fetch(`${API_URL}/${materialId}/add-to-curso/${cursoId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error al agregar el material al curso');
    }

    const result = await response.json();
    return result; // Regresa el resultado
  } catch (error) {
    console.error('Error al agregar material al curso:', error);
    throw new Error('Error al agregar material al curso');
  }
};
