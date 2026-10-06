import { supabase } from '../config/supabase.js'

export async function registrarUsuario(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name // Se envía a raw_user_meta_data para el trigger
      }
    }
  })

  return { data, error }
}

export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function obtenerUsuarioActual() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, profile: null, error }
  }

  // Usamos maybeSingle() para evitar el error PGRST116 si no existe fila
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return {
    user,
    profile,
    error: profileError
  }
}

// Actividad 2: Cambiar la contraseña de la cuenta autenticada
export async function cambiarPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  return { data, error }
}

// Obtener la lista de todos los perfiles registrados (necesario para compartir tareas más adelante)
export async function obtenerPerfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name')

  return { data, error }
}

// Función agregada al final para la Actividad 3
export async function obtenerTodosLosPerfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name');

  return { data, error };
}