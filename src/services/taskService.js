import { supabase } from '../config/supabase.js'


// ==========================================
// CRUD NORMAL DE TAREAS
// ==========================================

// REEMPLAZAR función obtenerTareas en src/services/taskService.js
export async function obtenerTareas() {
  // Supabase RLS aplicará automáticamente el filtro de propiedad O compartición
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('id', { ascending: false });

  return { data, error };
}


export async function crearTarea({
  title,
  description,
  priority,
  userId
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title,
        description,
        priority,
        completed: false,
        user_id: userId
      }
    ])
    .select()

  return {
    data,
    error
  }
}


export async function cambiarEstado(
  id,
  estadoActual
) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: !estadoActual
    })
    .eq('id', id)
    .select()

  return {
    data,
    error
  }
}


export async function eliminarTarea(id) {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()

  return {
    data,
    error
  }
}


// ==========================================
// PRUEBAS EDUCATIVAS DE RLS POR ID
// ==========================================

export async function buscarTareaPorId(id) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)

  return {
    data,
    error
  }
}


export async function modificarTareaPorId(
  id,
  nuevoTitulo
) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: nuevoTitulo
    })
    .eq('id', id)
    .select()

  return {
    data,
    error
  }
}


export async function eliminarTareaPorId(id) {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()

  return {
    data,
    error
  }
}


// ==========================================
// REALTIME
// ==========================================

// REEMPLAZAR la función suscribirseATareas en src/services/taskService.js
export function suscribirseATareas(onCambio) {
  const canal = supabase
    .channel('cambios-tasks-public')
    .on(
      'postgres_changes',
      {
        event: '*', // Escucha INSERT, UPDATE y DELETE
        schema: 'public',
        table: 'tasks'
      },
      (payload) => {
        console.log('Cambio Realtime detectado:', payload)
        onCambio(payload)
      }
    )
    .subscribe((status) => {
      console.log('Estado Realtime:', status)
    })

  return canal
}


export async function cancelarSuscripcion(
  canal
) {
  if (!canal) {
    return
  }

  await supabase.removeChannel(canal)
}

// Función agregada al final para la Actividad 3
export async function compartirTarea(taskId, userId, permission = 'ver_modificar') {
  const { data, error } = await supabase
    .from('task_shares')
    .insert([{ task_id: taskId, user_id: userId, permission }]);

  return { data, error };
}