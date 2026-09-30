import { supabase } from '../config/supabase.js'


export async function obtenerTareas() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('id', {
      ascending: true
    })

  return {
    data,
    error
  }
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
  estadoActual,
  userId
) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: !estadoActual
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()

  return {
    data,
    error
  }
}


export async function eliminarTarea(
  id,
  userId
) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  return {
    error
  }
}


export function suscribirseATareas(onCambio) {
  const canal = supabase
    .channel('cambios-tasks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks'
      },
      payload => {
        console.log(
          'Cambio Realtime:',
          payload
        )

        onCambio(payload)
      }
    )
    .subscribe(status => {
      console.log(
        'Estado Realtime:',
        status
      )
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