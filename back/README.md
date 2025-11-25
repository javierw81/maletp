# (BACKEND) Red Social - TP #2

### Alumna: Malena Nahir Cortes
### Comisión: 141

Este proyecto es el backend de la aplicación "Red Social", desarrollado en **NestJS**.


## Características **(Sprint #1)** v1.0.0

*   **Creación del Proyecto:** :white_check_mark:  Estructura base de NestJS con TypeScript.
*   **Base de Datos:** :white_check_mark: Configuración y conexión con **MongoDB** usando Mongoose.
*   **Módulos Creados:** :white_check_mark:
    *   `AuthModule`: Maneja el registro y login.
    *   `UsersModule`: Maneja la lógica de usuarios (creación, búsqueda).
    *   `PostsModule`: Para futuras funcionalidades.
*   **Módulo Autenticación (`/auth`):**
    *   **Ruta `POST /auth/registro`:** :white_check_mark:
        *   Recibe datos del usuario (`FormData`) incluyendo una imagen de perfil.
        *   **Validación de Datos (DTOs):** Utiliza `class-validator` para validar todos los campos (longitud, formato, etc.).
        *   **Seguridad:** Encripta la contraseña usando **Bcrypt**.
        *   **Subida de Archivos:** Sube la imagen de perfil a **Cloudinary** y guarda la `secure_url` y el `public_id` en la base de datos.
        *   **Limpieza de Datos:** Aplica limpieza en el `UserSchema` antes de guardar.
    *   **Ruta `POST /auth/login`:** :white_check_mark:
        *   Permite el login usando **correo** O **nombre de usuario**.
        *   Compara la contraseña recibida (sin encriptar) con el hash de la BD usando Bcrypt.
        *   Genera y devuelve un **JSON Web Token (JWT)** si las credenciales son correctas.
        *   Devuelve los datos del usuario logueado.
*   **Manejo de Errores:** :white_check_mark:
    *   La API responde con los **códigos de estado HTTP correctos** 
*   **Deploy en vercel:** :white_check_mark:
    *   Actualmente de encuentra deployado en vercer


## Características **(Sprint #2)** v2.0.0 :white_check_mark:

####  Módulo publicaciones - publicaciones controller:
- Debe permitir dar de alta, listar y dar de baja publicaciones (baja lógica).
- Por POST: debe guardar una publicación relacionada a un usuario. Título, descripción, url
de la imagen si es que tiene. La imagen debe ser guardada.
- Por DELETE: baja lógica, solo realizada por el usuario que la creó o un administrador.
- Por GET: debe permitir listar las últimas publicaciones. Debe poder recibir un parámetro
para cambiar el ordenamiento: por fecha/ por cantidad de me gusta. Debe poder filtrar
los posteos de un usuario particular. Debe poder recibir un parámetro offset y limit para
paginar los resultados.
- Por POST: debe permitir que un usuario le dé me gusta a la publicación que elija. Un
usuario puede darle un solo me gusta a cada publicación.
- Por DELETE: debe permitir eliminar un me gusta de una publicación, solo si el usuario
previamente lo había realizado.

## Características **(Sprint #3)** v3.0.0 :white_check_mark:

### Backend

#### Módulo de Publicaciones - Comentarios Controller
- :white_check_mark: **GET** `/publicaciones/{id}/comentarios` - Obtener comentarios con paginación
- :white_check_mark: **POST** `/publicaciones/{id}/comentarios` - Crear nuevo comentario
- :white_check_mark: **PUT** `/comentarios/{id}` - Editar comentario propio
- :white_check_mark: Ordenamiento por fecha (más recientes primero)
- :white_check_mark: Atributo `modificado: true` en comentarios editados
- :white_check_mark: Paginación configurable de resultados

#### Módulo de Autenticación
- :white_check_mark: **POST** `/auth/login` - Inicio de sesión
- :white_check_mark: **POST** `/auth/registro` - Registro de usuario
- :white_check_mark: Generación de JWT con payload (uuid/correo/nombre de usuario y rol)
- :white_check_mark: Token con vencimiento de 15 minutos
- :white_check_mark: Devolución de token en response o cookies
- :white_check_mark: **POST** `/auth/autorizar` - Validación de token válido y no vencido
- :white_check_mark: Retorno de datos del usuario en respuesta de autorización
- :white_check_mark: Error 401 para tokens inválidos o vencidos
- :white_check_mark: **POST** `/auth/refrescar` - Generar nuevo token con mismo payload