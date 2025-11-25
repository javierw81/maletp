# (FRONTEND) Red Social - TP #2

Este proyecto es el frontend de la aplicación "Red Social", desarrollado en **Angular**

### Alumna: Malena Nahir Cortes
### Comisión: 141

## Características **(Sprint #1)** v1.0.0

*   **Creación del Proyecto:** :white_check_mark: Estructura base de Angular.
*   **Navegación:** :white_check_mark:
*   **Favicon:** :white_check_mark: Implementación de un favicon propio.
*   **Pantallas Creadas:** :white_check_mark:
    *   `Login`: Formulario de inicio de sesión.
    *   `Registro`: Formulario de registro completo.
    *   `Publicaciones`.
    *   `MiPerfil`.
*   **Componente Login:** :white_check_mark:
    *   Formulario reactivo 
    *   Validación de campos 
    *   Permite login por **correo** o **nombre de usuario**.
    *   Validación de contraseña (mínimo 8 caracteres, 1 mayúscula, 1 número).
*   **Componente Registro:** :white_check_mark:
    *   Formulario reactivo con validaciones y mensajes de error.
    *   Campos implementados: `nombre`, `apellido`, `correo`, `nombreUsuario`, `password`, `confirmarPassword`, `fechaNacimiento`, `descripcion`.
    *   Validaciones personalizadas.
    *   Campo `file` para imagen de perfil con validación de tamaño y tipo.
*   **Diseño:** :white_check_mark: Interfaz trabajada con Bootstrap y estilos propios.
*   **Modales:** :white_check_mark: Uso de SweetAlert2 para feedback al usuario.
*   **Deploy en vercel:** :white_check_mark: Actualmente de encuentra deployado en vercer

## Características **(Sprint #2)** v2.0.0 :white_check_mark:

#### Página publicaciones. :white_check_mark:
- Debe mostrar el listado de publicaciones, ordenado por fecha por defecto.
- Debe permitir cambiar el ordenamiento a por cantidad de me gusta
- Debe traer una cantidad limitada de publicaciones, permitiendo paginarlas.
- Cada publicación debe ser un componente.
- Se debe poder dar y quitar me gusta de una publicación siempre que sea el caso.
- Debo ser capaz de eliminar mis propias publicaciones.
#### Componente Mi Perfil: :white_check_mark:
- Debe mostrar todos los datos del usuario, así como su foto de perfil
- Debe mostrar mis últimas 3 publicaciones y sus comentarios

## Características **(Sprint #3)** v3.0.0 :white_check_mark:

#### Página de Publicación
- :white_check_mark: Vista detallada de publicación en pantalla completa
- :white_check_mark: Visualización de comentarios asociados
- :white_check_mark: Formulario para escribir nuevos comentarios
- :white_check_mark: Comentarios ordenados cronológicamente (más recientes primero)
- :white_check_mark: Paginación de comentarios con botón "Cargar más"
- :white_check_mark: Edición de comentarios propios
- :white_check_mark: Indicador de comentario editado

#### Autenticación
- :white_check_mark: Almacenamiento seguro del token JWT en cookies
- :white_check_mark: Persistencia de sesión

#### Pantalla de Carga
- :white_check_mark: Spinner de cargando al iniciar la aplicación
- :white_check_mark: Validación de token contra ruta `/autorizar`
- :white_check_mark: Redirección automática a publicaciones si token es válido
- :white_check_mark: Redirección a login si token es inválido o expirado

#### Gestión de Sesión a Nivel de Aplicación
- :white_check_mark: Contador de 10 minutos desde inicio de sesión
- :white_check_mark: Modal de advertencia a los 10 minutos (5 minutos restantes)
- :white_check_mark: Opción para extender sesión (refresco de token)
- :white_check_mark: Token con vencimiento de 15 minutos
- :white_check_mark: Manejo automático de error 401 con redirección a login

