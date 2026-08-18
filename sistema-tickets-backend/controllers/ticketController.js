const db = require('../config/db');
const { analyzeTicketWithAI } = require('../services/aiService');

//Funcion auxiliar para generar un codigo unico de seguimiento
const generateTrackingCode = () => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `TCK-${randomHex}`;
};

//1. Crear ticket nuevo (modulo de cliente publico)

exports.createTicket = async (req, res) => {
    try {
        const { client_name, client_email, client_phone, title, description, category_id, priority } = req.body;

        if (!client_name || !client_email || !title || !description) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
        }

        const tracking_code = generateTrackingCode();

        // 1. Analizar el ticket con Gemini AI
        const aiAnalysis = await analyzeTicketWithAI(title, description);

        // 2. Insertar ticket con la sugerencia de IA
        const query = `
            INSERT INTO tickets (tracking_code, client_name, client_email, client_phone, title, description, ai_category_suggestion, category_id, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            tracking_code,
            client_name,
            client_email,
            client_phone || null,
            title,
            description,
            aiAnalysis.suggested_category,
            category_id || null,
            priority || 'media'
        ]);

        res.status(201).json({
            message: 'Ticket creado exitosamente con análisis de IA',
            tracking_code: tracking_code,
            ticket_id: result.insertId,
            ai_analysis: aiAnalysis
        });
    } catch (error) {
        console.error('Error al crear ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el ticket.' });
    }
};

//2 Consultar el estado del ticket por codigo (modulo de cliente publico)

exports.getTicketByCode = async (req, res) => {
    try {
        const { code } = req.params;

        const query = `
            SELECT t.tracking_code, t.client_name, t.title, t.description, t.status, t.priority, t.created_at,
                   c.name AS category_name
            FROM tickets t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.tracking_code = ?
        `;

        const [rows] = await db.query(query, [code]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró ningún ticket con el código ingresado.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al consultar ticket:', error);
        res.status(500).json({ error: 'Error al obtener la información del ticket.' });
    }
};

// 3 Obtener todos los tickets (modulo administracion - Tecnico)
exports.getAllTickets = async (req, res) => {
    try {
        const query = `
            SELECT t.id, 
                   t.tracking_code, 
                   t.client_name, 
                   t.client_email, 
                   t.client_phone,
                   t.title, 
                   t.description,
                   t.ai_category_suggestion,
                   t.status, 
                   t.priority, 
                   t.created_at,
                   c.name AS category,
                   u.full_name AS assigned_tech
            FROM tickets t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u ON t.assigned_tech_id = u.id
            ORDER BY t.created_at DESC
        `;

        const [tickets] = await db.query(query);
        res.json(tickets);
    } catch (error) {
        console.error('Error al obtener lista de tickets:', error);
        res.status(500).json({ error: 'Error al obtener los tickets.' });
    }
};

//4 Actualizar estado y/o asignar tecnico (modulo de administracion)

exports.updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_tech_id, priority } = req.body;

        // Validar que el ticket exista
        const [existing] = await db.query('SELECT * FROM tickets WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'El ticket solicitado no existe.' });
        }

        const query = `
            UPDATE tickets 
            SET status = COALESCE(?, status),
                assigned_tech_id = COALESCE(?, assigned_tech_id),
                priority = COALESCE(?, priority)
            WHERE id = ?
        `;

        await db.query(query, [status, assigned_tech_id, priority, id]);

        res.json({ message: 'Ticket actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar ticket:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del ticket.' });
    }
};

//5 Agregar comentario / nota tecnica
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params; // ticket_id
        const { user_id, comment, is_internal } = req.body;

        if (!comment || !user_id) {
            return res.status(400).json({ error: 'El comentario y el ID del técnico son obligatorios.' });
        }

        const query = `
            INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal)
            VALUES (?, ?, ?, ?)
        `;

        await db.query(query, [id, user_id, comment, is_internal ?? true]);

        res.status(201).json({ message: 'Comentario registrado con éxito' });
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        res.status(500).json({ error: 'Error al guardar el comentario.' });
    }
};