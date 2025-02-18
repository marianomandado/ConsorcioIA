const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Servir archivos estáticos
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/consorcioIA', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('🟢 Conexión a MongoDB exitosa'))
.catch(err => console.error('🔴 Error al conectar con MongoDB:', err));



// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});