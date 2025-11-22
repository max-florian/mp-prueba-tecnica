USE dicridb;
GO

-- Validar credenciales y retornar rol para el frontend (React)
CREATE PROCEDURE sp_login_usuario
    @usuario VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.usuario,
        u.password_hash, -- El backend debe comparar el hash (bcrypt)
        u.id_rol,
        r.nombre_rol
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.usuario = @usuario AND u.activo = 1;
END
GO

-- Registro de expedientes DICRI
CREATE PROCEDURE sp_crear_expediente
    @numero_expediente VARCHAR(50),
    @descripcion_general VARCHAR(255),
    @id_usuario_registra INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- El estado inicial siempre es 1 (abierto)
    INSERT INTO expediente (
        numero_expediente, 
        descripcion_general, 
        id_usuario_registra, 
        id_estado,
        fecha_actualizacion
    )
    VALUES (
        @numero_expediente, 
        @descripcion_general, 
        @id_usuario_registra, 
        1, -- Estado por defecto: abierto
        GETDATE()
    );

    SELECT SCOPE_IDENTITY() AS id_expediente;
END
GO

-- Generación de reportes con filtros por fechas y estados
CREATE PROCEDURE sp_obtener_expedientes
    @fecha_inicio DATETIME = NULL,
    @fecha_fin DATETIME = NULL,
    @id_estado INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.id_expediente,
        e.numero_expediente,
        e.descripcion_general,
        e.fecha_registro,
        e.id_usuario_registra,
        u.nombre_completo AS nombre_tecnico,
        e.id_estado,
        es.descripcion AS estado_descripcion,
        e.justificacion_rechazo
    FROM expediente e
    INNER JOIN usuario u ON e.id_usuario_registra = u.id_usuario
    INNER JOIN estado es ON e.id_estado = es.id_estado
    WHERE 
        (@fecha_inicio IS NULL OR e.fecha_registro >= @fecha_inicio) AND
        (@fecha_fin IS NULL OR e.fecha_registro <= @fecha_fin) AND
        (@id_estado IS NULL OR e.id_estado = @id_estado)
    ORDER BY e.fecha_registro DESC;
END
GO

-- Ver detalle único antes de editar/aprobar
CREATE PROCEDURE sp_obtener_expediente_por_id
    @id_expediente INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM expediente WHERE id_expediente = @id_expediente;
END
GO

-- Modificar datos generales si hubo error en registro
CREATE PROCEDURE sp_editar_expediente
    @id_expediente INT,
    @numero_expediente VARCHAR(50),
    @descripcion_general VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE expediente
    SET 
        numero_expediente = @numero_expediente,
        descripcion_general = @descripcion_general,
        fecha_actualizacion = GETDATE()
    WHERE id_expediente = @id_expediente;
END
GO

-- Borrado de expediente
CREATE PROCEDURE sp_eliminar_expediente
    @id_expediente INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Primero se eliminan sus indicios asociados
    DELETE FROM indicio WHERE id_expediente = @id_expediente;
    DELETE FROM expediente WHERE id_expediente = @id_expediente;
END
GO

-- Revisión, aprobación y rechazo
CREATE PROCEDURE sp_cambiar_estado_expediente
    @id_expediente INT,
    @id_usuario_revisa INT, -- El coordinador
    @id_nuevo_estado INT,
    @justificacion_rechazo VARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE expediente
    SET 
        id_estado = @id_nuevo_estado,
        id_usuario_revisa = @id_usuario_revisa,
        justificacion_rechazo = @justificacion_rechazo, -- Se guarda si es rechazo, o NULL si aprueba
        fecha_actualizacion = GETDATE()
    WHERE id_expediente = @id_expediente;
END
GO

-- Registro de indicios con características específicas
CREATE PROCEDURE sp_crear_indicio
    @id_expediente INT,
    @descripcion_indicio VARCHAR(255),
    @color VARCHAR(50),
    @tamano VARCHAR(50),
    @peso DECIMAL(10,2),
    @ubicacion_recoleccion VARCHAR(100),
    @id_usuario_registra INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO indicio (
        id_expediente,
        descripcion_indicio,
        color,
        tamano,
        peso,
        ubicacion_recoleccion,
        id_usuario_registra,
        fecha_registro
    )
    VALUES (
        @id_expediente,
        @descripcion_indicio,
        @color,
        @tamano,
        @peso,
        @ubicacion_recoleccion,
        @id_usuario_registra,
        GETDATE()
    );
END
GO

-- Mostrar la lista de evidencias dentro de un caso
CREATE PROCEDURE sp_listar_indicios_por_expediente
    @id_expediente INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.id_indicio,
        i.descripcion_indicio,
        i.color,
        i.tamano,
        i.peso,
        i.ubicacion_recoleccion,
        i.fecha_registro,
        u.nombre_completo AS nombre_tecnico
    FROM indicio i
    INNER JOIN usuario u ON i.id_usuario_registra = u.id_usuario
    WHERE i.id_expediente = @id_expediente;
END
GO

-- Obtener indicio por id
CREATE PROCEDURE sp_obtener_indicio_por_id
    @id_indicio INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM indicio WHERE id_indicio = @id_indicio;
END
GO

-- Modificar datos de indicio de una evidencia
CREATE PROCEDURE sp_editar_indicio
    @id_indicio INT,
    @descripcion_indicio VARCHAR(255),
    @color VARCHAR(50),
    @tamano VARCHAR(50),
    @peso DECIMAL(10,2),
    @ubicacion_recoleccion VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE indicio
    SET 
        descripcion_indicio = @descripcion_indicio,
        color = @color,
        tamano = @tamano,
        peso = @peso,
        ubicacion_recoleccion = @ubicacion_recoleccion
    WHERE id_indicio = @id_indicio;
END
GO

-- Eliminar el indicio de un expediente
CREATE PROCEDURE sp_eliminar_indicio
    @id_indicio INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM indicio WHERE id_indicio = @id_indicio;
END
GO