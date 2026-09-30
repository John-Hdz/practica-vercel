# Supabase Tasks App

Aplicación web desarrollada con **Vite + JavaScript + Supabase**.

El proyecto implementa:

- PostgreSQL mediante Supabase
- CRUD de tareas
- Supabase Auth
- Row Level Security (RLS)
- Asociación de tareas por usuario
- Realtime
- Persistencia de sesión
- Separación de vistas, servicios, configuración y componentes

---

## Tecnologías utilizadas

- Node.js
- npm
- Vite
- JavaScript
- Supabase
- PostgreSQL
- `@supabase/supabase-js`

---

## Versiones utilizadas

Este proyecto fue desarrollado y probado con:

```text
Node.js: v24.13.0
npm: 11.6.2
Vite: 8.3.1
@supabase/supabase-js: 2.117.2
```

Para comprobar las versiones instaladas en tu equipo:

```bash
node -v
npm -v
```

Para consultar las versiones instaladas en el proyecto:

```bash
npm list vite @supabase/supabase-js
```

---

# 1. Clonar el repositorio

Clona el proyecto:

```bash
git clone https://github.com/P4quiton/supabase-tasks-app.git
```

Entra a la carpeta:

```bash
cd supabase-tasks-app
```

---

# 2. Instalar dependencias

Ejecuta:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`.

Dependencias principales:

```text
@supabase/supabase-js: ^2.117.2
vite: ^8.3.0
```

No es necesario copiar la carpeta `node_modules` desde otra computadora.

---

# 3. Scripts disponibles

El proyecto incluye los siguientes scripts:

```bash
npm run dev
```

Inicia el servidor de desarrollo de Vite.

```bash
npm run build
```

Genera la versión de producción.

```bash
npm run preview
```

Permite previsualizar localmente la versión generada con `build`.

---

# 4. Crear un proyecto en Supabase

Cada usuario debe crear su propio proyecto en Supabase.

Una vez creado, será necesario obtener:

```text
Project URL
Publishable Key
```

No utilizar en el frontend:

```text
Secret Key
service_role
```

---

# 5. Configurar variables de entorno

El repositorio incluye un archivo:

```text
.env.example
```

Crea una copia llamada:

```text
.env
```

En Windows PowerShell puedes utilizar:

```powershell
Copy-Item .env.example .env
```

O crear el archivo manualmente.

El contenido debe tener esta estructura:

```env
VITE_SUPABASE_URL=TU_PROJECT_URL
VITE_SUPABASE_KEY=TU_PUBLISHABLE_KEY
```

Ejemplo:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_KEY=TU_PUBLISHABLE_KEY
```

El archivo `.env` no debe subirse al repositorio.

La aplicación lee estas variables desde:

```javascript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_KEY
```

---

# 6. Crear la tabla `tasks`

En Supabase crea una tabla llamada:

```text
tasks
```

con la siguiente estructura:

| Columna | Tipo | Configuración |
|---|---|---|
| `id` | `int8` | Primary Key, Identity |
| `title` | `text` | NOT NULL |
| `description` | `text` | Nullable |
| `priority` | `text` | NOT NULL |
| `completed` | `bool` | Default: `false` |
| `user_id` | `uuid` | Nullable inicialmente |
| `created_at` | `timestamptz` | Default: `now()` |

---

# 7. Configurar Authentication

En Supabase entra a:

```text
Authentication
```

y habilita el proveedor:

```text
Email
```

Para una práctica rápida puede desactivarse temporalmente la confirmación de correo.

En un proyecto real se recomienda mantenerla habilitada.

La aplicación utiliza:

```javascript
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()
supabase.auth.getUser()
```

---

# 8. Asociación entre usuarios y tareas

Cada tarea contiene:

```text
user_id
```

Este valor corresponde al UUID del usuario autenticado.

No almacena:

```text
Access Token
Refresh Token
Session ID
```

Almacena únicamente el identificador del usuario.

Ejemplo:

```text
Usuario A
UUID: 1234...

├── Tarea 1
└── Tarea 2

Usuario B
UUID: 5678...

├── Tarea 3
└── Tarea 4
```

---

# 9. Activar Row Level Security

Activa RLS para la tabla:

```text
tasks
```

Crea las siguientes políticas.

## SELECT

Nombre:

```text
Users can view own tasks
```

Rol:

```text
authenticated
```

Condición:

```sql
auth.uid() = user_id
```

## INSERT

Nombre:

```text
Users can create own tasks
```

Rol:

```text
authenticated
```

Condición `WITH CHECK`:

```sql
auth.uid() = user_id
```

## UPDATE

Nombre:

```text
Users can update own tasks
```

Rol:

```text
authenticated
```

Condición `USING`:

```sql
auth.uid() = user_id
```

Condición `WITH CHECK`:

```sql
auth.uid() = user_id
```

## DELETE

Nombre:

```text
Users can delete own tasks
```

Rol:

```text
authenticated
```

Condición:

```sql
auth.uid() = user_id
```

---

# 10. Cómo funciona RLS

La condición principal utilizada es:

```sql
auth.uid() = user_id
```

`auth.uid()` obtiene el UUID del usuario autenticado.

`user_id` contiene el UUID del propietario de la tarea.

Si ambos coinciden:

```text
ACCESO PERMITIDO
```

Si no coinciden:

```text
ACCESO DENEGADO
```

Esto permite que cada usuario trabaje únicamente con sus propias tareas.

---

# 11. Activar Realtime

En Supabase habilita la tabla:

```text
tasks
```

dentro de la publicación:

```text
supabase_realtime
```

La aplicación escucha cambios de PostgreSQL mediante:

```javascript
supabase
  .channel('cambios-tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks'
    },
    payload => {
      // Cambio detectado
    }
  )
  .subscribe()
```

El valor:

```text
event: '*'
```

permite escuchar:

```text
INSERT
UPDATE
DELETE
```

Esto permite que varias pestañas o clientes se actualicen automáticamente sin recargar la página.

---

# 12. Ejecutar el proyecto

Una vez configurado Supabase y el archivo `.env`, ejecuta:

```bash
npm run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173/
```

Abre esa dirección en el navegador.

---

# 13. Flujo de la aplicación

La aplicación funciona de la siguiente manera:

```text
Inicio
  ↓
¿Existe sesión?
  ↓
 ┌───────────────┐
 │               │
 No              Sí
 │               │
 ↓               ↓
Login         Gestor de tareas
 │               │
 │            CRUD + Realtime
 │               │
 └──── Login ────┘
```

El usuario puede:

- Registrarse
- Iniciar sesión
- Cerrar sesión
- Crear tareas
- Consultar sus tareas
- Cambiar su estado
- Eliminar tareas
- Ver cambios en tiempo real

---

# 14. Persistencia de sesión

Supabase Auth mantiene la sesión del usuario en el navegador.

Por esta razón, cerrar Vite, cerrar el navegador o apagar la computadora no necesariamente cierra la sesión.

Cuando la aplicación vuelve a iniciar, consulta:

```javascript
supabase.auth.getUser()
```

Si existe una sesión válida, el usuario entra directamente al gestor de tareas.

Para cerrar correctamente la sesión se utiliza:

```javascript
supabase.auth.signOut()
```

---

# 15. CRUD utilizado

La aplicación realiza operaciones CRUD mediante `supabase-js`.

## CREATE

```javascript
supabase
  .from('tasks')
  .insert(...)
```

## READ

```javascript
supabase
  .from('tasks')
  .select('*')
```

## UPDATE

```javascript
supabase
  .from('tasks')
  .update(...)
```

## DELETE

```javascript
supabase
  .from('tasks')
  .delete()
```

---

# 16. Estructura del proyecto

La estructura actual es:

```text
src/
│   app.js
│   main.js
│   style.css
│
├── components/
│   └── confirmModal.js
│
├── config/
│   └── supabase.js
│
├── services/
│   ├── authService.js
│   └── taskService.js
│
└── views/
    ├── loginView.js
    └── tasksView.js
```

## `components`

Contiene componentes reutilizables de interfaz.

### `confirmModal.js`

Muestra el modal de confirmación antes de eliminar una tarea.

## `config`

Contiene la configuración de servicios externos.

### `supabase.js`

Crea el cliente de Supabase utilizando:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_KEY
```

## `services`

Contiene la comunicación con Supabase.

### `authService.js`

Maneja:

- Registro
- Inicio de sesión
- Cierre de sesión
- Obtención del usuario actual

### `taskService.js`

Maneja:

- SELECT
- INSERT
- UPDATE
- DELETE
- Realtime

## `views`

Contiene las interfaces de la aplicación.

### `loginView.js`

Muestra la pantalla de autenticación.

### `tasksView.js`

Muestra:

- Usuario autenticado
- Formulario de tareas
- Lista de tareas
- Cambio de estado
- Eliminación de tareas

## `app.js`

Controla el flujo principal de la aplicación.

Coordina:

```text
Authentication
Vistas
CRUD
Realtime
```

Ejemplo:

```text
Login
↓
Gestor de tareas
↓
Cerrar sesión
↓
Login
```

## `main.js`

Es el punto de entrada de la aplicación.

Su función principal es cargar los estilos e iniciar la aplicación.

```javascript
import './style.css'

import {
  iniciarApp
} from './app.js'

iniciarApp()
```

---

# 17. Diferencia entre CRUD y Realtime

Realtime no es necesario para que el CRUD funcione.

Sin Realtime:

```text
CREATE
READ
UPDATE
DELETE
```

siguen funcionando normalmente.

Lo que se pierde es la actualización automática entre clientes.

Con Realtime:

```text
Cliente A modifica datos
        ↓
Supabase detecta el cambio
        ↓
Cliente B recibe el evento
        ↓
La interfaz se actualiza
```

---

# 18. Seguridad

La aplicación utiliza una:

```text
Publishable Key
```

en el frontend.

No debe utilizarse una:

```text
Secret Key
```

o:

```text
service_role
```

dentro del navegador.

La protección de los datos se realiza mediante:

```text
Authentication
+
Row Level Security
```

El archivo `.env` se encuentra ignorado mediante `.gitignore`.

El repositorio solamente incluye:

```text
.env.example
```

como plantilla de configuración.

---

# 19. Problemas comunes

## La aplicación no conecta con Supabase

Verifica que exista:

```text
.env
```

y que tenga:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```

Después reinicia Vite:

```bash
Ctrl + C
npm run dev
```

## Las tareas no aparecen

Revisa:

- que exista la tabla `tasks`;
- que el usuario haya iniciado sesión;
- que `user_id` corresponda al usuario autenticado;
- que las políticas RLS estén configuradas correctamente.

## No se puede registrar o iniciar sesión

Revisa:

```text
Authentication
→ Sign In / Providers
→ Email
```

y verifica que Email esté habilitado.

Si aparece:

```text
Email not confirmed
```

el usuario debe confirmar su correo o debe ajustarse temporalmente la configuración de confirmación.

## Realtime no funciona

Verifica que:

```text
tasks
```

esté incluida dentro de:

```text
supabase_realtime
```

Después abre dos pestañas con el mismo usuario y prueba:

```text
Crear
Actualizar
Eliminar
```

Los cambios deberían reflejarse automáticamente.

## Vite no detecta cambios en `.env`

Detén el servidor:

```bash
Ctrl + C
```

y vuelve a ejecutarlo:

```bash
npm run dev
```

---

# 20. Resultado final

Al finalizar se obtiene un gestor de tareas con la siguiente arquitectura:

```text
Frontend
Vite + JavaScript
        ↓
supabase-js
        ↓
Supabase
        │
        ├── PostgreSQL
        ├── Authentication
        ├── Row Level Security
        └── Realtime
```

Cada usuario puede:

- Registrarse
- Iniciar sesión
- Mantener una sesión persistente
- Crear sus propias tareas
- Consultar únicamente sus tareas
- Cambiar el estado de sus tareas
- Eliminar sus tareas
- Ver cambios en tiempo real

La seguridad de los registros está controlada desde PostgreSQL mediante Row Level Security.
