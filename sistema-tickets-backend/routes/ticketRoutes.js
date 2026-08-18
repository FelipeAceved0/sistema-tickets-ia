const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Rutas Públicas para Clientes
router.post('/', ticketController.createTicket);
router.get('/track/:code', ticketController.getTicketByCode);

// Ruta para el Panel Técnico / Admin
router.get('/', ticketController.getAllTickets);
router.put('/:id', ticketController.updateTicketStatus);
router.post('/:id/comments', ticketController.addComment);

module.exports = router;