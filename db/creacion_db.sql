-- CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE dicridb;
GO

USE dicridb;
GO


-- Define si el usuario es técnico o coordinador
CREATE TABLE rol (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);
GO


-- Controla el flujo: registrado, revisión, aprobado, rechazado
CREATE TABLE estado (
    id_estado INT IDENTITY(1,1) PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);
GO


-- Autenticación y control de permisos
CREATE TABLE usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    activo BIT DEFAULT 1,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);
GO


-- Datos generales del expediente, técnico que registra y coordinador que revisa
CREATE TABLE expediente (
    id_expediente INT IDENTITY(1,1) PRIMARY KEY,
    numero_expediente VARCHAR(50) NOT NULL UNIQUE,
    descripcion_general VARCHAR(255),
    fecha_registro DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME,
    
    -- Auditoría
    id_usuario_registra INT NOT NULL, -- Técnico que registra
    id_usuario_revisa INT,            -- Coordinador que aprueba/rechaza
    
    -- Flujo
    id_estado INT NOT NULL,
    justificacion_rechazo VARCHAR(MAX), -- Requerido para el rechazo
    
    CONSTRAINT fk_expediente_usuario_registra FOREIGN KEY (id_usuario_registra) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_expediente_usuario_revisa FOREIGN KEY (id_usuario_revisa) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_expediente_estado FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
);
GO


-- Registro de indicios (evidencia) dentro del expediente
CREATE TABLE indicio (
    id_indicio INT IDENTITY(1,1) PRIMARY KEY,
    id_expediente INT NOT NULL,
    
    -- Datos generales del objeto solicitados
    descripcion_indicio VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    tamano VARCHAR(50),
    peso DECIMAL(10,2),
    ubicacion_recoleccion VARCHAR(100),
    
    fecha_registro DATETIME DEFAULT GETDATE(),
    id_usuario_registra INT NOT NULL, -- Técnico que registra el indicio
    
    CONSTRAINT fk_indicio_expediente FOREIGN KEY (id_expediente) REFERENCES expediente(id_expediente),
    CONSTRAINT fk_indicio_usuario FOREIGN KEY (id_usuario_registra) REFERENCES usuario(id_usuario)
);
GO