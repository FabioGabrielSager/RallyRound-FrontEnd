# RallyRound FrontEnd

Este repositorio contiene el front-end de la aplicación **RallyRound**, desarrollada como parte de mi proyecto final de la Tecnicatura Universitaria en Programación en la Universidad Tecnológica Nacional - Facultad Regional Córdoba, durante el año 2024. Este proyecto se realizó en el marco de la materia Práctica Supervisada y tiene como objetivo demostrar el aprendizaje adquirido durante los dos años de carrera.

## Descripción del Proyecto

**RallyRound** es una aplicación diseñada para resolver el problema común de organizar eventos sociales, deportivos, musicales, entre otros, cuando no se cuenta con la cantidad suficiente de participantes. La aplicación permite a los usuarios crear y promocionar eventos, así como unirse a eventos existentes, fomentando la interacción social y fortaleciendo la comunidad local.

### Objetivos Principales

- **Facilitar la Organización de Eventos:** Brindar una plataforma donde los usuarios puedan crear y promover eventos de manera sencilla.
- **Resolver la Dificultad para Reunir Participantes:** Permitir a los usuarios encontrar y unirse a eventos relevantes en su localidad.
- **Fomentar la Interacción Social:** Proporcionar un espacio para descubrir eventos, conectar con otros participantes y compartir experiencias.
- **Promover la Comunidad Local:** Fortalecer las comunidades locales mediante la organización de eventos en diferentes localidades.

## Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- **Angular 17**: Como framework principal para la construcción de la aplicación.
- **Bootstrap**: Para el diseño y la creación de una interfaz de usuario responsiva.
- **rx-stomp**: Para la comunicación en tiempo real utilizando WebSockets.
- **bootstrap-icons**: Para la integración de iconos en la interfaz.
- **chat-js y ng2-charts**: Para la generación de gráficos y visualizaciones de datos.
- **ngx-image-cropper**: Para el recorte y edición de imágenes dentro de la aplicación.
- **rxjs**: Para la programación reactiva y manejo de eventos asincrónicos.

## Funcionalidades Principales

### Gestión de Usuarios
- **Registro y Autenticación:** Permite a los usuarios registrarse y autenticarse en la aplicación.
- **Perfil de Usuario:** Gestión y actualización del perfil del usuario.
- **Reputación:** Visualización y actualización de la reputación de los usuarios basada en sus actividades y reportes.

### Gestión de Eventos
- **Creación de Eventos:** Los usuarios pueden crear nuevos eventos especificando la actividad, ubicación y horarios propuestos.
- **Participación en Eventos:** Los usuarios pueden unirse a eventos existentes, votar horarios y realizar pagos de inscripción.
- **Visualización de Eventos:** Listado de eventos disponibles filtrados por actividad, ubicación y fecha.

### Gestión de Chats
- **Comunicación en Tiempo Real:** Permite la comunicación entre usuarios participantes en un evento a través de chats en tiempo real.
- **Historial de Chats:** Los usuarios pueden acceder al historial de mensajes de los eventos en los que participaron.

### Visualización de Datos
- **Gráficos y Estadísticas:** Utilización de gráficos para mostrar estadísticas de eventos, participación de usuarios, reportes, entre otros.

### Gestión de Imágenes
- **Subida y Edición de Imágenes:** Permite a los usuarios subir y recortar imágenes para sus perfiles y eventos.

## Requerimientos No Funcionales
- **Responsividad:** La aplicación es completamente responsiva, garantizando una experiencia óptima en dispositivos móviles y de escritorio.
- **Seguridad:** El acceso a las funcionalidades está restringido mediante autenticación, y las comunicaciones están protegidas utilizando JWT.
