Bienvenido a **CineNext**, una aplicación web estilo Netflix construida con React y Vite. Te permite crear tu propio catálogo personal de películas y series, gestionándolas a través de un panel de administración privado.

👉 **Prueba la aplicación aquí:** [https://spay2024.github.io/CineNext/](https://spay2024.github.io/CineNext/)

---

## ✨ Características

*   🎬 **Catálogo Personalizado:** Agrega tus películas y series favoritas usando su ID de **The Movie Database (TMDB)**.
*   🖥️ **Panel de Administración Privado:** Un espacio exclusivo para gestionar tu contenido.
*   🔍 **Buscador Integrado:** Encuentra rápidamente títulos en tu colección.
*   🎞️ **Vista de Detalle:** Información completa de cada película/serie (sinopsis, reparto, puntuación).
*   🎥 **Reproductor Integrado:** Reproduce el contenido usando Vimeus.
*   📱 **Diseño Responsive:** Funciona perfectamente en ordenadores, tablets y móviles.

---

## 🚀 Cómo Usar CineNext

### 1. Accede a la Aplicación
Ve a la página principal: [https://spay2024.github.io/CineNext/](https://spay2024.github.io/CineNext/)

### 2. Abre el Panel de Administración
Para agregar tu primer contenido, necesitas acceder al panel privado:
*   **URL:** [https://spay2024.github.io/CineNext/#/admin](https://spay2024.github.io/CineNext/#/admin)
*   **Contraseña de acceso:** `admin123`

### 3. Encuentra el ID de una Película en TMDB
El panel necesita el ID de TMDB para obtener toda la información (título, póster, descripción...).
1.  Ve a [**The Movie Database (TMDB)**](https://www.themoviedb.org/).
2.  Busca la película o serie que quieras agregar.
3.  En la URL de la página del título, verás algo como: `https://www.themoviedb.org/movie/**1236153**-mercy`
4.  **Copia solo los números** (en este ejemplo, `1236153`).

### 4. Agrega el Título a tu Catálogo
1.  En el panel de admin, pega el número de ID en el campo correspondiente y haz clic en **"Buscar"**.
2.  Verás una vista previa con la información obtenida de TMDB.
3.  Selecciona el **Género** y el **Tipo de Contenido** (Película, Serie, Anime, etc.).
4.  Pega la **URL del video iframe** (proporcionada por tu fuente).
5.  Haz clic en **"Agregar Contenido"**. ¡La película aparecerá automáticamente en tu página principal!

> **💡 Consejo:** Los datos de tu catálogo se guardan en tu propio navegador usando `localStorage`. Si cambias de dispositivo, tu lista no se moverá contigo.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React 18
*   **Build Tool:** Vite
*   **Rutas:** React Router DOM
*   **Estilos:** CSS Puro (con diseño inspirado en Netflix)
*   **API Externa:** The Movie Database (TMDB) API
*   **Reproducción:** Servicio Vimeus
*   **Almacenamiento:** `localStorage` del navegador
*   **Despliegue:** GitHub Pages

---

## ⚙️ Instalación y Desarrollo Local

Si deseas clonar y ejecutar el proyecto en tu máquina:

```bash
# 1. Clona el repositorio
git clone https://github.com/SpAy2024/CineNext.git

# 2. Entra en la carpeta del proyecto
cd CineNext

# 3. Instala las dependencias
npm install

# 4. Crea un archivo `.env` en la raíz con tus claves:
VITE_TMDB_KEY=tu_clave_api_tmdb
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_VIMEUS_KEY=tu_clave_vimeus
VITE_ADMIN_SECRET=admin123

# 5. Inicia el servidor de desarrollo
npm run dev

🤝 Contribuciones
Las contribuciones, ideas y sugerencias son siempre bienvenidas. Este es un proyecto personal en evolución. Siéntete libre de abrir un "issue" o hacer un "fork" para proponer mejoras.

📜 Licencia
Este proyecto es de código abierto y se distribuye bajo la licencia MIT.

📬 Contacto
GitHub: @SpAy2024

Sitio Web: https://spay2024.github.io/CineNext/
