-- 1. TABLA DE USUARIOS (Técnicos y Administradores)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'tech') DEFAULT 'tech',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE CATEGORÍAS (Clasificación de problemas)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 3. TABLA DE TICKETS (Incidentes/Requerimientos reportados por clientes)
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_code VARCHAR(12) UNIQUE NOT NULL, -- Código único de seguimiento para el cliente (ej: TCK-84920)
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    ai_category_suggestion VARCHAR(50),      -- Guardará la sugerencia detectada por la IA
    category_id INT,                         -- Llave foránea a categories
    priority ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    status ENUM('pendiente', 'en_proceso', 'resuelto', 'cancelado') DEFAULT 'pendiente',
    assigned_tech_id INT NULL,               -- Llave foránea a users (técnico asignado)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_tech_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. TABLA DE COMENTARIOS / NOTAS TÉCNICAS (Historial de resolución)
CREATE TABLE ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,                    -- Técnico que comenta
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,        -- Si la nota es solo visible para el equipo interno
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. ÍNDICES PARA OPTIMIZAR BÚSQUEDAS RÁPIDAS
CREATE INDEX idx_tickets_tracking_code ON tickets(tracking_code);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_tech ON tickets(assigned_tech_id);
