# 🎫 Sistema de Gestión de Tickets & Soporte TI (Asistido por IA)

Un sistema Full-Stack para la gestión de incidencias de soporte técnico en tiempo real, integrado con la **API de Google Gemini** para el análisis inteligente de consultas y la inferencia de categorías.

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
* **React** (Vite)
* **Tailwind CSS (v4)**
* **Axios**
* **Lucide React** (Iconografía)

### **Backend**
* **Node.js** & **Express**
* **MySQL** (XAMPP / MariaDB)
* **Google Generative AI SDK** (`@google/genai` - Gemini 2.5 Flash)

---

## ✨ Características Principales

1. **Atención al Cliente / Usuario Final:**
   * **Creación de Tickets:** Formulario intuitivo con generación de código único de seguimiento (`TCK-XXXXX`).
   * **Sugerencia en Tiempo Real con IA:** Integración con Gemini que evalúa la descripción del problema para categorizar la incidencia de forma automática.
   * **Consulta de Estado:** Módulo para que los usuarios revisen la evolución de su ticket mediante su código de seguimiento.

2. **Panel Técnico / Administración:**
   * **Tabla de Gestión Centralizada:** Vista completa de todos los tickets registrados con indicación visual de prioridad y categoría sugerida.
   * **Filtros por Estado:** Selección dinámica de tickets (Pendientes, En Proceso, Resueltos, Cerrados).
   * **Actualización en Tiempo Real:** Cambio inmediato del estado del ticket reflejado en la base de datos MySQL.
   * **Modal de Detalles:** Vista emergente con información de contacto, descripción ampliada y diagnóstico inferido por la IA.

---

## 📂 Estructura del Proyecto

```text
/
├── sistema-tickets-backend/     # Servidor REST API (Node.js + Express)
│   ├── src/
│   │   ├── config/              # Conexión a MySQL y Gemini API
│   │   ├── controllers/         # Lógica de controladores (Tickets)
│   │   └── routes/              # Rutas REST
│   └── package.json
│
├── sistema-tickets-frontend/    # Interfaz de Usuario (React + Vite)
│   ├── src/
│   │   ├── components/          # Componentes React (CreateTicket, TrackTicket, AdminDashboard)
│   │   ├── services/            # Cliente Axios
│   │   └── App.jsx
│   └── package.json
└── README.md
```


🚀 Guía de Instalación y Configuración Local
Prerrequisitos
Node.js (v18 o superior)

MySQL / XAMPP (servidor Apache y MySQL corriendo)

1. Configuración de la Base de Datos
Ejecuta el script de creación de tablas en phpMyAdmin o MySQL Workbench:

SQL
CREATE DATABASE IF NOT EXISTS tickets_db;
USE tickets_db;

CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_code VARCHAR(12) NOT NULL UNIQUE,
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(100) NOT NULL,
  client_phone VARCHAR(20) NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  ai_category_suggestion VARCHAR(50) NULL,
  priority ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
  status ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
2. Configurar y Levantar el Backend
Bash
cd sistema-tickets-backend
npm install
Crea un archivo .env en sistema-tickets-backend/:

Fragmento de código
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tickets_db
GEMINI_API_KEY=tu_api_key_aqui
Inicia el servidor:

Bash
npm run dev
3. Configurar y Levantar el Frontend
En una nueva terminal:

Bash
cd sistema-tickets-frontend
npm install
npm run dev
Abre tu navegador en http://localhost:5173.

📝 Licencia
Este proyecto es de código abierto y está disponible bajo la licencia MIT.
