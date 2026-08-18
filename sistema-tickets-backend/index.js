const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar conexión a base de datos
require('./config/db');

// Importar rutas
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints principales
app.use('/api/tickets', ticketRoutes);

// Ruta de comprobación
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor Backend de Tickets activo y funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});