-- Creación de la base de datos
CREATE DATABASE parqueadero_db;
\c parqueadero_db;

-- Tabla USUARIO
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Tabla ESTUDIANTE
CREATE TABLE estudiante (
    usuarioid INT PRIMARY KEY,
    carrera VARCHAR(255) NOT NULL,
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (usuarioid)
        REFERENCES usuario (id)
        ON DELETE CASCADE
);

-- Tabla EMPLEADO
CREATE TABLE empleado (
    usuarioid INT PRIMARY KEY,
    permisos VARCHAR(255),
    CONSTRAINT fk_empleado_usuario FOREIGN KEY (usuarioid)
        REFERENCES usuario (id)
        ON DELETE CASCADE
);

-- Tabla PARQUEADERO
CREATE TABLE parqueadero (
    id SERIAL PRIMARY KEY,
    ubicacion VARCHAR(255) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    tarifa DECIMAL(10,2) NOT NULL
);

-- Tabla RESERVA
CREATE TABLE reserva (
    id SERIAL PRIMARY KEY,
    fechaHorainicio TIMESTAMP NOT NULL,
    fechaHoraFin TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL,
    usuarioid INT NOT NULL,
    parqueaderoid INT NOT NULL,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuarioid)
        REFERENCES usuario (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reserva_parqueadero FOREIGN KEY (parqueaderoid)
        REFERENCES parqueadero (id)
        ON DELETE CASCADE
);

-- Tabla PAGO
CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL,
    fechaPago TIMESTAMP NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    reservaid INT NOT NULL,
    CONSTRAINT fk_pago_reserva FOREIGN KEY (reservaid)
        REFERENCES reserva (id)
        ON DELETE CASCADE
);
