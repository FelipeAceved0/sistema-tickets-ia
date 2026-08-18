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
* **Google Generative AI SDK** (`@google/genai` - Gemini 3.6 Flash)

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
