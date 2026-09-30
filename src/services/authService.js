import { supabase } from '../config/supabase.js'

export async function registrarUsuario(
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password
    })

  return {
    data,
    error
  }
}


export async function iniciarSesion(
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    })

  return {
    data,
    error
  }
}


export async function cerrarSesion() {
  const { error } =
    await supabase.auth.signOut()

  return {
    error
  }
}


export async function obtenerUsuarioActual() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  return {
    user,
    error
  }
}