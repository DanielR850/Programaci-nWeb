USE mydb;

-- 1. Insertar categoría si no existe
INSERT IGNORE INTO categoria (Category) VALUES ('General');

-- 2. Insertar autor si no existe (usa el NOMBRE directamente)
INSERT IGNORE INTO autor (Autor) VALUES ('Jeff Kinney');

-- 3. Insertar libro (usando el NOMBRE del autor, no ID)
INSERT INTO libros (
  Título, 
  Autor,  -- Aquí va el NOMBRE (VARCHAR) que coincide con autor.Autor
  Precio, 
  CantidadDisponible, 
  Descripción, 
  idCategoria, 
  RutaDelLibroDescargable, 
  RutaDeLaImagen
)
VALUES (
  'El diario de Greg 2',
  'Jeff Kinney',  -- Nombre exacto como en la tabla autor
  19.99,
  10,
  'Segunda entrega del diario de Greg.',
  (SELECT idCategoria FROM categoria WHERE Category = 'General' LIMIT 1),
  'libros/diario_de_greg_2.pdf',
   '../assets/diariodegreg2.jpg'
);

