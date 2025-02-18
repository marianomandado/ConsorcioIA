const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/expensas', async (req, res) => {
  const { propietario, unidad, gasto, descripcion } = req.body;

  if (!propietario || !unidad || !gasto || !descripcion) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  console.log('Datos recibidos:', req.body);
  res.status(200).json({ message: 'Expensas recibidas correctamente' });
});


// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta principal para mostrar el formulario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar la subida de archivos
app.post('/upload-expenses', upload.single('expensas'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  // Lógica de procesamiento de la expensa aquí
  console.log('Archivo recibido:', file);
  res.send('Expensa subida con éxito');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

