import { supabase } from '../supabase/client.js';

/**
 * Obtiene las herramientas activas para mostrar en el popup.
 */
export async function getActiveTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('isActive', true) // Filtra para obtener solo las activas
    .order('name', { ascending: true });

  if (error) {
    console.error('Error al cargar herramientas:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Obtiene TODAS las herramientas para el panel de administración.
 */
export async function getAllTools() {
    const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar herramientas para admin:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Actualiza una herramienta existente.
 * @param {number} id - El ID de la herramienta a actualizar.
 * @param {object} toolData - Los nuevos datos de la herramienta.
 */
export async function updateToolById(id, toolData) {
  const { data, error } = await supabase
    .from('tools')
    .update(toolData)
    .eq('id', id)
    .select(); // .select() devuelve el registro actualizado

  if (error) {
    console.error('Error al actualizar la herramienta:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Crea una nueva herramienta.
 * @param {object} toolData - Los datos de la nueva herramienta.
 */
export async function createNewTool(toolData) {
  const { data, error } = await supabase
    .from('tools')
    .insert([toolData])
    .select();

  if (error) {
    console.error('Error al crear la herramienta:', error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Elimina una herramienta.
 * @param {number} id - El ID de la herramienta a eliminar.
 */
export async function deleteToolById(id) {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar la herramienta:', error);
    throw new Error(error.message);
  }
  return true; // Éxito
}