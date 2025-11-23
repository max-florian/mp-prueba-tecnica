-- Roles
INSERT INTO rol (nombre_rol) VALUES ('técnico'), ('coordinador');

-- Estados del flujo
INSERT INTO estado (descripcion) VALUES 
('abierto'),
('en revisión'),
('aprobado'),
('rechazado');
GO

-- Usuarios
INSERT INTO usuario (nombre_completo, usuario, password_hash, id_rol, activo) VALUES
('Max Florian', 'mflorian','$2b$10$yM8vUdHGgbkqwLVo0OvlTeGSA6DT7ZuXDcjUKDPkrz3tfHb1MoTe2',2,1);

INSERT INTO usuario (nombre_completo, usuario, password_hash, id_rol, activo) VALUES
('Max Florian Tecnico', 'mtecnico','$2b$10$feRSJs4tUMcM5l2DCxse5uTBBV43QD6RY6S2XhgK8u9ESW6QsHKwK',1,1);