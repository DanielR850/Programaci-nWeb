const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const upload = require('../middlewares/uploadMiddleware');

// CRUD de libros
router.get('/', libroController.getLibros);
router.post('/', libroController.createLibro);
router.put('/:id', libroController.updateLibro);
router.delete('/:id', libroController.deleteLibro);
router.get('/:id', libroController.getLibroById);
router.post('/imagen', libroController.subirImagen);
router.post('/pdf', libroController.subirPDF);

// Nueva ruta para subir imagen
router.post('/imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió imagen' });
  res.json({ ruta: `/assets/${req.file.filename}` });
});

module.exports = router;
